import { useQueryClient } from "@tanstack/react-query";
import { device_command_history_query } from "../../../../../../api/queries/app/queryKeys/queryKeys";
import "../../../../../../global/styles/GlobalCss.css";
import { useContext } from "react";
import { DeviceCommandHistoryContext } from "../../../../../../contexts/AppLayout/Admin/DeviceCommand/DeviceCommandHistory/DeviceCommandHistoryContext";

const RefreshButton = () => {
  const {
    setDeviceCommandAutoApiCall,
    setCommandStartTime,
    setCommandEndTime,
    setIsDataFetching
  } = useContext(DeviceCommandHistoryContext);
  const queryClient = useQueryClient();

  const todayStartTime = Math.floor(new Date().getTime() / 1000 - 3600);
  const todayEndTime = Math.floor(todayStartTime + 7200);

  const handleRefreshData = () => {
    setIsDataFetching(false);
    queryClient.invalidateQueries({ queryKey: [device_command_history_query] });
      setCommandStartTime(0);
      setCommandEndTime(0);
      setTimeout(() => {
        setCommandStartTime(todayStartTime);
        setCommandEndTime(todayEndTime);
      }, 0);
    setDeviceCommandAutoApiCall(true);
  };

//   useEffect(() => {
//     if (commandEndTime && commandStartTime) {
//       setCommandStartTime(todayStartTime);
//       setCommandEndTime(todayEndTime);
     
//     }
//   }, [commandEndTime, commandStartTime]);

  return (
    <button
      type="button"
      onClick={handleRefreshData}
      className="px-2 py-2 text-white border border-gray-200 rounded ripple bg-theme-cardLinkColor"
    >
      Refresh
    </button>
  );
};

export default RefreshButton;
