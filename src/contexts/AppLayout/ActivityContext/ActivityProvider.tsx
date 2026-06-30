import { ReactNode, useContext } from "react";
import { ActivityContext } from "./ActivityContext";
import { UserDetailContext } from "../UserDetailContext/UserDetailContext";
import { useActivityTracker } from "../../../Admin/features/IssueLLM/hooks/useActivityTracker";

/*
 * Mounts the activity tracker once, at the app-shell level, so check-in /
 * heartbeat / check-out run on every admin page (not just the Issue LLM tab).
 * The hook is a no-op until a userId is present, so it is safe to mount before
 * the user-detail query resolves.
 */
export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const { userDetail } = useContext(UserDetailContext);
  const userId   = userDetail.data.result.divisionId;
  const userName = userDetail.data.result.userName;
  const roleId   = userDetail.data.result.roleId;

  const { isActive, workingMs } = useActivityTracker(userId, userName, roleId);

  return (
    <ActivityContext.Provider value={{ isActive, workingMs }}>
      {children}
    </ActivityContext.Provider>
  );
};
