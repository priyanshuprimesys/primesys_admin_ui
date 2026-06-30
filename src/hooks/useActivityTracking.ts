import { useContext, useEffect, useRef } from 'react';
import { UserDetailContext } from '../contexts/AppLayout/UserDetailContext/UserDetailContext';
import { checkin, heartbeat, checkoutBeacon } from '../Admin/services/activity/activity-api';

const HEARTBEAT_INTERVAL_MS = 30_000;

export function useActivityTracking() {
  const { userDetail } = useContext(UserDetailContext);
  const sessionIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userIdRef = useRef<string>('');

  const user = userDetail?.data?.result;

  useEffect(() => {
    if (!user?.userName) return;

    const userId = user.userName;
    const userName = user.userName;
    const roleId = user.roleId;
    userIdRef.current = userId;

    // checkin — open a new session
    checkin(userId, userName, roleId)
      .then((res) => {
        sessionIdRef.current = res.sessionId;

        // start heartbeat every 30 s
        intervalRef.current = setInterval(() => {
          if (sessionIdRef.current) {
            heartbeat(sessionIdRef.current, userId).catch(() => {/* ignore */});
          }
        }, HEARTBEAT_INTERVAL_MS);
      })
      .catch(() => {/* auth not ready yet — non-fatal */});

    // checkout on tab close / refresh
    const handleUnload = () => {
      if (sessionIdRef.current) {
        checkoutBeacon(sessionIdRef.current, userId);
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      // cleanup on logout / user change
      window.removeEventListener('beforeunload', handleUnload);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionIdRef.current) {
        checkoutBeacon(sessionIdRef.current, userIdRef.current);
        sessionIdRef.current = null;
      }
    };
  }, [user?.userName]); // re-runs if user changes (login/logout)
}
