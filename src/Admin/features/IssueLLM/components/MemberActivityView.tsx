import { useEffect, useMemo, useState } from "react";
import { ActiveUserEntry, ActivitySegment, DailyLogEntry, getActiveUsers, getDailyLog } from "../services/activityApi";
import { fmtWorkingTime } from "../hooks/useActivityTracker";
import { useGetAllIssueTickets } from "../hooks/GetAllTicketsHook";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const IDLE_MS   = 90_000;   // > 90 s since last heartbeat = idle
const AWAY_MS   = 5 * 60_000; // > 5 min = away

type OnlineStatus = "active" | "idle" | "away";

const getStatus = (entry: ActiveUserEntry): OnlineStatus => {
  const elapsed = Date.now() - entry.lastHeartbeat;
  if (elapsed > AWAY_MS) return "away";
  // server says present-but-not-interacting → idle even if the heartbeat is fresh
  if (entry.active === false) return "idle";
  if (elapsed <= IDLE_MS) return "active";
  return "idle";
};

/* Normalize a unix timestamp to ms (backend sometimes sends seconds). */
const toMs = (n?: number): number => {
  if (!n || !Number.isFinite(n)) return 0;
  return String(Math.trunc(n)).length <= 10 ? n * 1000 : n;
};

/* Tolerate field-name differences from the backend
   (lastHeartbeat vs lastHeartbeatAt, checkedInAt vs firstCheckinAt). */
const normalizeActive = (raw: any): ActiveUserEntry => ({
  userId:   raw?.userId ?? raw?.id ?? "",
  userName: raw?.userName ?? raw?.name ?? "Unknown",
  roleId:   raw?.roleId ?? 0,
  checkedInAt:   toMs(raw?.checkedInAt ?? raw?.firstCheckinAt),
  lastHeartbeat: toMs(raw?.lastHeartbeat ?? raw?.lastHeartbeatAt ?? raw?.lastSeen),
  active:        typeof raw?.active === "boolean" ? raw.active : undefined,
  activeMs:      Number.isFinite(raw?.activeMs) ? raw.activeMs : undefined,
  currentScreen: raw?.currentScreen ?? raw?.screen ?? undefined,
});

/* Map a raw route to a friendly feature label for the "Working on" column. */
const SCREEN_LABELS: { match: string; label: string }[] = [
  { match: "issue_llm",            label: "Issue LLM" },
  { match: "all_devices",          label: "Division Devices" },
  { match: "device_configuration", label: "Device Config" },
  { match: "beat_module",          label: "Beat Module" },
  { match: "device_exchange",      label: "Device Exchange" },
  { match: "hirearchy_module",     label: "Hierarchy" },
  { match: "device_subscription",  label: "Subscription" },
  { match: "admin_utility",        label: "Admin Utility" },
  { match: "location_utility",     label: "Location Utility" },
  { match: "admin_iot_data",       label: "IOT Data" },
  { match: "device_inspection",    label: "Device Inspection" },
  { match: "reports_permission",   label: "Reports & Permission" },
  { match: "report_configuration", label: "Report Config" },
];

const screenLabel = (screen?: string): string => {
  if (!screen) return "—";
  const hit = SCREEN_LABELS.find(s => screen.includes(s.match));
  if (hit) return hit.label;
  const seg = screen.split(/[/#?]/).filter(Boolean).pop() ?? "";
  if (!seg || seg === "admin") return "Dashboard";
  return seg.replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

/* per-member work output (today) from the ticket list */
const tkMs = (ts: number) => (String(ts).length > 10 ? ts : ts * 1000);
const tkPickupMs = (t: any): number | null => {
  const e = t.statusHistory?.find((h: any) => h.status === "PICKED_UP")
    ?? t.statusHistory?.find((h: any) => h.status === "IN_PROGRESS");
  if (e?.changedAt) return tkMs(e.changedAt);
  if (t.assignee && t.createdAt) return new Date(t.createdAt).getTime();
  return null;
};
const tkDoneMs = (t: any): number | null => {
  const e = [...(t.statusHistory ?? [])].reverse().find((h: any) => h.status === "CLOSED" || h.status === "RESOLVED");
  return e?.changedAt ? tkMs(e.changedAt) : null;
};
const isTodayMs = (ms: number) =>
  new Date(ms).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);

const STATUS_CFG: Record<OnlineStatus, { label: string; dot: string; badge: string }> = {
  active: { label: "Active",  dot: "bg-emerald-400 animate-pulse", badge: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  idle:   { label: "Idle",    dot: "bg-amber-400",                  badge: "bg-amber-100 text-amber-700 ring-amber-200"        },
  away:   { label: "Away",    dot: "bg-gray-400",                   badge: "bg-gray-100 text-gray-500 ring-gray-200"           },
};

const MEMBER_COLORS = [
  "#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6",
  "#ec4899","#14b8a6","#f97316","#3b82f6","#84cc16",
];

const fmtTime = (ms: number): string => {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

/* ── component ───────────────────────────────────────────────────────────── */

const todayStr  = () => new Date().toISOString().slice(0, 10);
const daysAgo   = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

/* Midnight (local) of the current day — used to keep the active-users view
   scoped to "today": a session that started yesterday and is still alive should
   not report a previous-day check-in or a working time that spans midnight. */
const startOfTodayMs = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

const fmtDateShort = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
};

const fmtMs = (ms: number) => {
  const d = new Date(ms);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2,"0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

/* ── 24-hour active-segment timeline ───────────────────────────────────────── */

const DAY_MS = 86_400_000;
const hhmm = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const SegmentTimeline = ({ date, segments, firstCheckinAt, lastHeartbeatAt }: {
  date: string;
  segments?: ActivitySegment[];
  firstCheckinAt: number;
  lastHeartbeatAt: number;
}) => {
  const dayStart = new Date(date + "T00:00:00").getTime();
  const frac = (ms: number) => Math.max(0, Math.min(1, (ms - dayStart) / DAY_MS));

  // real segments when available; otherwise a faint approximate span (first→last)
  const bars = segments && segments.length > 0
    ? segments.map(s => ({ from: s.from, to: s.to, screen: s.screen, approx: false }))
    : [{ from: firstCheckinAt, to: lastHeartbeatAt, screen: undefined as string | undefined, approx: true }];

  return (
    <div className="relative h-3 w-full rounded-full bg-gray-100 ring-1 ring-gray-200 overflow-hidden">
      {[6, 12, 18].map(h => (
        <span key={h} className="absolute top-0 bottom-0 w-px bg-gray-200" style={{ left: `${(h / 24) * 100}%` }} />
      ))}
      {bars.map((b, i) => {
        const left  = frac(b.from) * 100;
        const width = Math.max(0.6, (frac(b.to) - frac(b.from)) * 100);
        return (
          <span
            key={i}
            title={`${hhmm(b.from)}–${hhmm(b.to)}${b.screen ? ` · ${screenLabel(b.screen)}` : ""}${b.approx ? " (approx span)" : ""}`}
            className={`absolute top-0 bottom-0 rounded-full ${b.approx ? "bg-indigo-200" : "bg-indigo-500"}`}
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        );
      })}
    </div>
  );
};

const MemberActivityView = () => {
  const [entries, setEntries]   = useState<ActiveUserEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(false);
  const [now,     setNow]       = useState(Date.now());
  const [search,  setSearch]    = useState("");

  /* ── per-member work output today (picked / resolved) ── */
  const { data: ticketData } = useGetAllIssueTickets();
  const outputByUser = useMemo(() => {
    const inner = (ticketData?.data as any)?.data;
    const flat: any[] = Array.isArray(inner)
      ? inner
      : (inner && typeof inner === "object"
          ? (["result", "content", "data", "tickets", "items", "records"]
              .map(k => (inner as any)[k]).find(Array.isArray) as any[] | undefined)
            ?? Object.values(inner).flat()
          : []);
    const map = new Map<string, { picked: number; resolved: number }>();
    for (const t of flat ?? []) {
      if (!t?.assignee) continue;
      const cur = map.get(t.assignee) ?? { picked: 0, resolved: 0 };
      const p = tkPickupMs(t); if (p !== null && isTodayMs(p)) cur.picked += 1;
      const d = tkDoneMs(t);   if (d !== null && isTodayMs(d)) cur.resolved += 1;
      map.set(t.assignee, cur);
    }
    return map;
  }, [ticketData]);

  /* daily log state */
  const [logFrom,    setLogFrom]    = useState(daysAgo(6));
  const [logTo,      setLogTo]      = useState(todayStr());
  const [appliedFrom,setAppliedFrom]= useState(daysAgo(6));
  const [appliedTo,  setAppliedTo]  = useState(todayStr());
  const [logEntries, setLogEntries] = useState<DailyLogEntry[]>([]);
  const [logLoading, setLogLoading] = useState(false);
  const [logError,   setLogError]   = useState(false);
  const [logSearch,  setLogSearch]  = useState("");

  const fetchLog = async (from: string, to: string) => {
    setLogLoading(true);
    try {
      const res = await getDailyLog({ from, to });
      const raw = (res.data as any)?.data?.result;
      setLogEntries(Array.isArray(raw) ? raw : []);
      setLogError(false);
    } catch {
      setLogError(true);
    } finally {
      setLogLoading(false);
    }
  };

  const handleApplyLog = () => {
    setAppliedFrom(logFrom);
    setAppliedTo(logTo);
    fetchLog(logFrom, logTo);
  };

  const filteredLog = useMemo(() => {
    const q = logSearch.trim().toLowerCase();
    return [...logEntries]
      .filter(e => !q || e.userName.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date) || a.firstCheckinAt - b.firstCheckinAt);
  }, [logEntries, logSearch]);

  /* fetch active users */
  const fetchUsers = async () => {
    try {
      const res = await getActiveUsers();
      const raw = (res.data as any)?.data?.result;
      setEntries(Array.isArray(raw) ? raw.map(normalizeActive) : []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLog(appliedFrom, appliedTo);
    const id = setInterval(fetchUsers, 30_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* tick every 10 s so working times stay live */
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries
      .filter(e => !q || e.userName.toLowerCase().includes(q))
      .sort((a, b) => {
        const sa = getStatus(a); const sb = getStatus(b);
        const order: Record<OnlineStatus, number> = { active: 0, idle: 1, away: 2 };
        if (order[sa] !== order[sb]) return order[sa] - order[sb];
        return a.checkedInAt - b.checkedInAt; // earliest checked-in first
      });
  }, [entries, now, search]);

  const activeCount = filtered.filter(e => getStatus(e) === "active").length;
  const idleCount   = filtered.filter(e => getStatus(e) === "idle").length;
  const awayCount   = filtered.filter(e => getStatus(e) === "away").length;

  /* ── render ── */

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm gap-2">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading activity…
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400">
        <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-sm font-medium">Activity API not available yet.</p>
        <p className="text-xs text-center max-w-xs">
          Implement <code className="bg-gray-100 px-1 rounded">GET /v2/admin/activity/active-users</code> on the backend to enable this view.
        </p>
        <button onClick={fetchUsers} className="mt-1 px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 px-4 pt-3 pb-2 overflow-hidden">

      {/* ── Summary badges ── */}
      <div className="flex-shrink-0 mb-3 flex flex-wrap items-center gap-3">
        {[
          { label: "Active",  count: activeCount, cfg: STATUS_CFG.active },
          { label: "Idle",    count: idleCount,   cfg: STATUS_CFG.idle   },
          { label: "Away",    count: awayCount,   cfg: STATUS_CFG.away   },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${s.cfg.badge}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${s.cfg.dot}`} />
            <span className="text-xs font-semibold">{s.label}:</span>
            <span className="text-xs font-bold">{s.count}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Auto-refreshes every 30 s
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* toolbar */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search member…"
              className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* table */}
        <div className="flex-1 min-h-0 overflow-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No members currently tracked</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                  <th className="px-4 py-3 w-[4%]">#</th>
                  <th className="px-4 py-3 w-[20%]">Member</th>
                  <th className="px-4 py-3 w-[10%] text-center">Status</th>
                  <th className="px-4 py-3 w-[15%]">Working On</th>
                  <th className="px-4 py-3 w-[11%]">Check-in</th>
                  <th className="px-4 py-3 w-[13%]">Last Active</th>
                  <th className="px-4 py-3 w-[13%] text-center">Today</th>
                  <th className="px-4 py-3 w-[14%] text-center">Active Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((entry, i) => {
                  const status  = getStatus(entry);
                  const cfg     = STATUS_CFG[status];
                  const color   = MEMBER_COLORS[i % MEMBER_COLORS.length];
                  const initial = (entry.userName || "?")[0].toUpperCase();
                  // Scope check-in to today: if the session began on a previous
                  // day and is still alive, treat midnight as the effective
                  // check-in so the time and working duration reset each day.
                  const effectiveCheckin = entry.checkedInAt
                    ? Math.max(entry.checkedInAt, startOfTodayMs())
                    : 0;
                  // true active time when the server provides it; else fall back to
                  // wall-clock since check-in (flagged with ~ so it's not mistaken for exact)
                  const hasActiveMs = entry.activeMs !== undefined;
                  const workMs  = hasActiveMs ? entry.activeMs! : now - effectiveCheckin;
                  const idleMs  = now - entry.lastHeartbeat;
                  const out     = outputByUser.get(entry.userId) ?? { picked: 0, resolved: 0 };

                  return (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-emerald-50/40`}
                    >
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                            style={{ background: color }}>
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{entry.userName}</p>
                            <p className="text-[11px] text-gray-400">Role {entry.roleId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${cfg.badge}`}>
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {screenLabel(entry.currentScreen)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                        {effectiveCheckin ? fmtTime(effectiveCheckin) : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {idleMs < 60_000
                          ? "just now"
                          : idleMs < 3_600_000
                          ? `${Math.floor(idleMs / 60_000)}m ago`
                          : `${Math.floor(idleMs / 3_600_000)}h ago`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-1.5 py-0.5 rounded-full" title="Picked up today">
                            ▲ {out.picked}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-700 bg-lime-50 ring-1 ring-lime-200 px-1.5 py-0.5 rounded-full" title="Resolved/closed today">
                            ✓ {out.resolved}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-lg ${
                          status === "active"
                            ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200"
                            : "text-gray-600 bg-gray-100 ring-1 ring-gray-200"
                        }`}
                          title={hasActiveMs ? "True active time (idle excluded)" : "Wall-clock since check-in (server active time unavailable)"}>
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {hasActiveMs ? "" : "~"}{fmtWorkingTime(workMs)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ══ Daily Login Log ══════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 mt-4 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* header + date range */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-bold text-gray-700">Daily Login Log</span>
          </div>

          {/* date range */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">From</span>
            <input type="date" value={logFrom} max={logTo}
              onChange={e => setLogFrom(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            <span className="text-xs font-semibold text-gray-500">To</span>
            <input type="date" value={logTo} min={logFrom} max={todayStr()}
              onChange={e => setLogTo(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            <button onClick={handleApplyLog}
              className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors">
              Apply
            </button>
          </div>

          {/* search */}
          <div className="relative min-w-[180px] flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input type="text" value={logSearch} onChange={e => setLogSearch(e.target.value)}
              placeholder="Search member…"
              className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-9 pr-4 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>

          <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
            {filteredLog.length} record{filteredLog.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* table */}
        <div className="overflow-auto max-h-72">
          {logLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400 text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading…
            </div>
          ) : logError ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400 text-xs">
              <p>Daily log API not available.</p>
              <p>Implement <code className="bg-gray-100 px-1 rounded">GET /v2/activity/daily-log</code></p>
              <button onClick={handleApplyLog} className="mt-1 px-3 py-1 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">Retry</button>
            </div>
          ) : filteredLog.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
              No login records for {fmtDateShort(appliedFrom)} – {fmtDateShort(appliedTo)}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                  <th className="px-4 py-2.5 w-[4%]">#</th>
                  <th className="px-4 py-2.5 w-[11%]">Date</th>
                  <th className="px-4 py-2.5 w-[15%]">Member</th>
                  <th className="px-4 py-2.5 w-[12%]">First Login</th>
                  <th className="px-4 py-2.5 w-[12%]">Last Active</th>
                  <th className="px-4 py-2.5 w-[9%] text-center">Active</th>
                  <th className="px-4 py-2.5 w-[37%]">Timeline <span className="text-gray-500 normal-case">(12a · 6a · 12p · 6p · 12a)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLog.map((e, i) => {
                  const spanMs = e.lastHeartbeatAt - e.firstCheckinAt;
                  const hasActiveMs = e.activeMs !== undefined;
                  const activeLabel = hasActiveMs ? fmtWorkingTime(e.activeMs!) : `~${fmtWorkingTime(spanMs)}`;
                  const color = MEMBER_COLORS[i % MEMBER_COLORS.length];
                  const initial = (e.userName || "?")[0].toUpperCase();
                  const isToday = e.date === todayStr();
                  return (
                    <tr key={`${e.userId}-${e.date}`}
                      className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-indigo-50/30`}>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isToday ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" : "bg-gray-100 text-gray-600"
                        }`}>
                          {isToday && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                          {fmtDateShort(e.date)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: color }}>{initial}</div>
                          <span className="text-xs font-semibold text-gray-800 truncate">{e.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-700 font-medium">{fmtMs(e.firstCheckinAt)}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{fmtMs(e.lastHeartbeatAt)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 px-2 py-0.5 rounded-full"
                          title={hasActiveMs ? "True active time (idle excluded)" : "First→last span (server active time unavailable)"}>
                          {activeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <SegmentTimeline
                          date={e.date}
                          segments={e.segments}
                          firstCheckinAt={e.firstCheckinAt}
                          lastHeartbeatAt={e.lastHeartbeatAt}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default MemberActivityView;
