import { useEffect, useRef, useState } from "react";
import { activityCheckin, activityCheckout, activityHeartbeat } from "../services/activityApi";
import { authToken } from "../../../../api/services/AuthService";

const HEARTBEAT_MS      = 30_000;  // how often we report to the server
const SAMPLE_MS         = 5_000;   // how often we accumulate active time
const ACTIVE_WINDOW_MS  = 60_000;  // interaction within this window = "actively working"

interface StoredSession {
  sessionId: string;
  checkedInAt: number;
  userId: string;
  date: string;      // "YYYY-MM-DD" — scopes session to one per day
  activeMs?: number; // true active time accumulated so far today
}

interface ActivityState {
  isActive: boolean;
  checkedInAt: number | null;
  workingMs: number; // TRUE active time (excludes idle gaps), not wall-clock
}

const todayKey = (userId: string) =>
  `admin_activity_${userId}_${new Date().toISOString().slice(0, 10)}`;

const loadTodaySession = (userId: string): StoredSession | null => {
  try {
    const raw = localStorage.getItem(todayKey(userId));
    if (!raw) return null;
    const s: StoredSession = JSON.parse(raw);
    return s.userId === userId ? s : null;
  } catch { return null; }
};

const saveTodaySession = (s: StoredSession) => {
  localStorage.setItem(todayKey(s.userId), JSON.stringify(s));
};

const clearTodaySession = (userId: string) => {
  localStorage.removeItem(todayKey(userId));
};

/* Current route the user is on, e.g. "/admin/issue_llm". */
const getScreen = (): string =>
  typeof window !== "undefined" ? window.location.pathname + window.location.hash : "";

export const useActivityTracker = (userId: string, userName: string, roleId: number) => {
  const [state, setState] = useState<ActivityState>({
    isActive: false,
    checkedInAt: null,
    workingMs: 0,
  });

  const sessionRef        = useRef<StoredSession | null>(null);
  const heartbeatRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const sampleRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkedInRef      = useRef(false);
  const lastInteractionRef = useRef<number>(Date.now());
  const activeMsRef       = useRef<number>(0);
  const lastSampleRef     = useRef<number>(Date.now());

  /* truly working = tab visible AND interacted within the active window */
  const isActiveNow = (): boolean =>
    typeof document !== "undefined" &&
    document.visibilityState === "visible" &&
    (Date.now() - lastInteractionRef.current) <= ACTIVE_WINDOW_MS;

  const persistActiveMs = () => {
    const s = sessionRef.current;
    if (!s) return;
    sessionRef.current = { ...s, activeMs: activeMsRef.current };
    saveTodaySession(sessionRef.current);
  };

  /* ── on mount: resume today's session if it exists ── */
  useEffect(() => {
    if (!userId) return;
    const existing = loadTodaySession(userId);
    if (existing) {
      sessionRef.current   = existing;
      checkedInRef.current = true;
      activeMsRef.current  = existing.activeMs ?? 0;
      lastSampleRef.current = Date.now();
      setState({ isActive: isActiveNow(), checkedInAt: existing.checkedInAt, workingMs: activeMsRef.current });
      startHeartbeat(existing.sessionId);
      startSampler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* ── track interaction + visibility; first interaction triggers check-in ── */
  useEffect(() => {
    if (!userId) return;
    const onInteraction = () => {
      lastInteractionRef.current = Date.now();
      if (!checkedInRef.current) {
        checkedInRef.current = true;
        doCheckin();
      }
    };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart", "mousedown", "wheel"] as const;
    events.forEach(e => window.addEventListener(e, onInteraction, { passive: true }));
    const onVisible = () => { if (document.visibilityState === "visible") lastInteractionRef.current = Date.now(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      events.forEach(e => window.removeEventListener(e, onInteraction));
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* ── checkout on tab close (server closes the open segment) ── */
  useEffect(() => {
    const onUnload = () => {
      const s = sessionRef.current;
      if (!s || s.sessionId === "local") return;
      persistActiveMs();
      try {
        const base = import.meta.env.VITE_ADMIN_API_URL ?? "";
        const raw  = localStorage.getItem(authToken);
        const token = raw ? `Bearer ${JSON.parse(raw)}` : "";
        fetch(`${base}/v2/activity/checkout`, {
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: token } : {}) },
          body: JSON.stringify({ userId: s.userId, sessionId: s.sessionId, activeMs: activeMsRef.current, screen: getScreen() }),
        }).catch(() => { /* best-effort on unload */ });
      } catch { /* ignore */ }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── cleanup intervals on unmount ── */
  useEffect(() => () => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (sampleRef.current)    clearInterval(sampleRef.current);
  }, []);

  /* ── helpers ── */

  const doCheckin = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await activityCheckin({ userId, userName, roleId, date: today, screen: getScreen() });
      const { sessionId, checkedInAt } = res.data.data.result;
      const stored: StoredSession = { sessionId, checkedInAt, userId, date: today, activeMs: activeMsRef.current };
      sessionRef.current = stored;
      saveTodaySession(stored);
      lastSampleRef.current = Date.now();
      setState({ isActive: true, checkedInAt, workingMs: activeMsRef.current });
      startHeartbeat(sessionId);
      startSampler();
    } catch {
      // API unavailable — track locally, no server call
      const checkedInAt = Date.now();
      const today = new Date().toISOString().slice(0, 10);
      const stored: StoredSession = { sessionId: "local", checkedInAt, userId, date: today, activeMs: activeMsRef.current };
      sessionRef.current = stored;
      saveTodaySession(stored);
      lastSampleRef.current = Date.now();
      setState({ isActive: true, checkedInAt, workingMs: activeMsRef.current });
      startSampler();
    }
  };

  /* accumulate true active time every few seconds (idle gaps are skipped) */
  const startSampler = () => {
    if (sampleRef.current) clearInterval(sampleRef.current);
    lastSampleRef.current = Date.now();
    sampleRef.current = setInterval(() => {
      const nowT = Date.now();
      if (isActiveNow()) activeMsRef.current += nowT - lastSampleRef.current;
      lastSampleRef.current = nowT;
      setState(prev => ({ ...prev, isActive: isActiveNow(), workingMs: activeMsRef.current }));
    }, SAMPLE_MS);
  };

  const startHeartbeat = (sessionId: string) => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (sessionId === "local") return;
    heartbeatRef.current = setInterval(async () => {
      persistActiveMs();
      try {
        await activityHeartbeat({ userId, sessionId, active: isActiveNow(), activeMs: activeMsRef.current, screen: getScreen() });
      } catch { /* silent */ }
    }, HEARTBEAT_MS);
  };

  const doCheckout = async () => {
    const s = sessionRef.current;
    if (!s) return;
    if (s.sessionId !== "local") {
      try { await activityCheckout({ userId: s.userId, sessionId: s.sessionId, activeMs: activeMsRef.current, screen: getScreen() }); } catch { /* silent */ }
    }
    clearTodaySession(userId);
    sessionRef.current   = null;
    checkedInRef.current = false;
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (sampleRef.current)    clearInterval(sampleRef.current);
    setState({ isActive: false, checkedInAt: null, workingMs: 0 });
  };

  return { ...state, doCheckout };
};

export const fmtWorkingTime = (ms: number): string => {
  const totalMin = Math.floor(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};
