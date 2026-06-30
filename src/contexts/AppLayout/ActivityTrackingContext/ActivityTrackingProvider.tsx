import { useActivityTracking } from '../../../hooks/useActivityTracking';

// Mounts the tracking hook once at the top of the authenticated tree.
// No context value is exposed — the hook manages everything internally.
export const ActivityTrackingProvider = ({ children }: any) => {
  useActivityTracking();
  return <>{children}</>;
};
