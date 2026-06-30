import axiosApi from '../../../utils/axiosInstance/AxiosConfig';
import { authToken } from '../../../api/services/AuthService';

/* Explicit admin bearer header — these run in the admin shell, so use the
   admin token (auth_id), not the customer token. */
const authHeaders = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(authToken);
    if (!raw) return {};
    return { Authorization: `Bearer ${JSON.parse(raw)}` };
  } catch {
    return {};
  }
};

export interface CheckinResponse {
  sessionId: string;
  checkedInAt: number;
}

export interface ActiveUser {
  sessionId: string;
  userId: string;
  userName: string;
  roleId: number;
  checkedInAt: number;
  lastHeartbeat: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  userName: string;
  roleId: number;
  date: string;
  firstCheckinAt: number;
  lastHeartbeatAt: number;
}

export async function checkin(
  userId: string,
  userName: string,
  roleId: number
): Promise<CheckinResponse> {
  const res = await axiosApi.post('/v2/activity/checkin', { userId, userName, roleId }, { headers: authHeaders() });
  return res.data?.data?.result as CheckinResponse;
}

export async function heartbeat(sessionId: string, userId: string): Promise<void> {
  await axiosApi.put('/v2/activity/heartbeat', { sessionId, userId }, { headers: authHeaders() });
}

// Uses fetch keepalive so it fires even during beforeunload
export function checkoutBeacon(sessionId: string, userId: string): void {
  const token = localStorage.getItem(authToken);
  const parsed = token ? JSON.parse(token) : '';
  const base = import.meta.env.VITE_ADMIN_API_URL ?? '';
  fetch(`${base}/v2/activity/checkout`, {
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${parsed}`,
    },
    body: JSON.stringify({ sessionId, userId }),
  }).catch(() => {/* fire-and-forget */});
}

export async function getActiveUsers(): Promise<ActiveUser[]> {
  const res = await axiosApi.get('/v2/activity/active-users', { headers: authHeaders() });
  return (res.data?.data?.result ?? []) as ActiveUser[];
}

export async function getDailyLog(
  from: string,
  to: string,
  userId?: string
): Promise<DailyLog[]> {
  const params: Record<string, string> = { from, to };
  if (userId) params.userId = userId;
  const res = await axiosApi.get('/v2/activity/daily-log', { params, headers: authHeaders() });
  return (res.data?.data?.result ?? []) as DailyLog[];
}
