import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import { AxiosResponse } from "axios";
import { authToken } from "../../../../api/services/AuthService";

/* Explicit bearer header — ensures auth is attached even if the global
   request interceptor is bypassed for these calls. */
const authHeaders = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(authToken);
    if (!raw) return {};
    return { Authorization: `Bearer ${JSON.parse(raw)}` };
  } catch {
    return {};
  }
};

export interface ActivitySegment {
  from: number;    // unix ms — segment start (interaction resumed)
  to: number;      // unix ms — segment end (went idle/away)
  screen?: string; // route the user was on for this segment
}

export interface ActiveUserEntry {
  userId: string;
  userName: string;
  roleId: number;
  checkedInAt: number;    // unix ms
  lastHeartbeat: number;  // unix ms
  active?: boolean;       // server's view: truly interacting vs merely tab-open
  activeMs?: number;      // true active time today (sum of active intervals)
  currentScreen?: string; // route/feature the user is currently on
}

export interface DailyLogEntry {
  userId: string;
  userName: string;
  roleId: number;
  date: string;            // "YYYY-MM-DD"
  firstCheckinAt: number;  // unix ms — first login of that day
  lastHeartbeatAt: number; // unix ms — last activity of that day
  activeMs?: number;       // true active time that day (excludes idle gaps)
  segments?: ActivitySegment[]; // per-day work segments for a timeline
}

/*
 * ── Backend implementation guide ──────────────────────────────────────────
 *
 * MongoDB collection: admin_daily_activity
 * Document shape:
 *   { userId, userName, roleId, date (YYYY-MM-DD),
 *     firstCheckinAt (unix ms), lastHeartbeatAt (unix ms) }
 * Unique index: { userId: 1, date: 1 }
 *
 * POST /v2/activity/checkin
 *   Body: { userId, userName, roleId, date, screen }
 *   → UPSERT by { userId, date }:
 *       $setOnInsert: { firstCheckinAt: now }
 *       $set:         { userName, roleId, lastHeartbeatAt: now, currentScreen: screen }
 *   Response: { success: true, data: { result: { sessionId, checkedInAt } } }
 *
 * PUT /v2/activity/heartbeat
 *   Body: { userId, sessionId, active, activeMs, screen }
 *     active   = true only when the user actually interacted in the last ~60 s
 *                AND the tab is visible (else they are merely "present").
 *     activeMs = client-accumulated true active time today (authoritative).
 *     screen   = route the user is on (e.g. "/admin/issue_llm").
 *   → UPDATE admin_daily_activity SET lastHeartbeatAt = now,
 *       activeMs = MAX(stored, body.activeMs), currentScreen = screen,
 *       lastActive = active
 *     and append/extend a work segment: if active and the previous heartbeat was
 *     also active within ~90 s, extend the open segment's `to`; otherwise open a
 *     new segment { from: now, to: now, screen }.
 *   Response: { success: true, data: { result: "ok" } }
 *
 * POST /v2/activity/checkout
 *   Body: { userId, sessionId, activeMs, screen }
 *   → same as heartbeat with active=false; closes the open segment.
 *   Response: { success: true, data: { result: "Checked out successfully" } }
 *
 * GET /v2/activity/active-users  (role 20 only)
 *   → sessions where lastHeartbeat within 90 s
 *   Response: { success: true, data: { result: ActiveUserEntry[] } }
 *     each entry SHOULD include: active (bool), activeMs (num), currentScreen (str)
 *
 * GET /v2/activity/daily-log?from=YYYY-MM-DD&to=YYYY-MM-DD[&userId=xxx]
 *   → query admin_daily_activity WHERE date BETWEEN from AND to
 *       AND (userId = ? if provided)  ORDER BY date DESC, firstCheckinAt ASC
 *   Response: { success: true, data: { result: DailyLogEntry[] } }
 * ─────────────────────────────────────────────────────────────────────────
 */

export const activityCheckin = (
  body: { userId: string; userName: string; roleId: number; date: string; screen?: string }
): Promise<AxiosResponse<{ success: boolean; data: { result: { sessionId: string; checkedInAt: number } } }>> =>
  axiosApi.post("/v2/activity/checkin", body, { headers: authHeaders() });

export const activityHeartbeat = (
  body: { userId: string; sessionId: string; active?: boolean; activeMs?: number; screen?: string }
): Promise<AxiosResponse<{ success: boolean; data: { result: string } }>> =>
  axiosApi.put("/v2/activity/heartbeat", body, { headers: authHeaders() });

export const activityCheckout = (
  body: { userId: string; sessionId: string; activeMs?: number; screen?: string }
): Promise<AxiosResponse<{ success: boolean; data: { result: string } }>> =>
  axiosApi.post("/v2/activity/checkout", body, { headers: authHeaders() });

export const getActiveUsers = (): Promise<
  AxiosResponse<{ success: boolean; data: { result: ActiveUserEntry[] } }>
> => axiosApi.get("/v2/activity/active-users", { headers: authHeaders() });

export const getDailyLog = (params: {
  from: string;
  to: string;
  userId?: string;
}): Promise<AxiosResponse<{ success: boolean; data: { result: DailyLogEntry[] } }>> => {
  const query = new URLSearchParams({ from: params.from, to: params.to });
  if (params.userId) query.set("userId", params.userId);
  return axiosApi.get(`/v2/activity/daily-log?${query.toString()}`, { headers: authHeaders() });
};
