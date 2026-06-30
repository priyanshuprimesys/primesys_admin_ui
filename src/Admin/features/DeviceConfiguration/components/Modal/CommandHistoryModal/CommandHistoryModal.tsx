import { useContext, useState } from "react";
import DateTimePicker from "../../../../../../global/components/input/DateTimePicker/DateTimePicker";
import ChakraUiModal from "../../../../../../global/components/Modals/components/ChakraUiModal";
import { DeviceCommandHistoryContext } from "../../../../../../contexts/AppLayout/Admin/DeviceCommand/DeviceCommandHistory/DeviceCommandHistoryContext";
import { useQueryClient } from "@tanstack/react-query";
import { device_command_history_query } from "../../../../../../api/queries/app/queryKeys/queryKeys";
import getDeviceCommandHistory from "../../../../../../api/queries/app/features/device_command_history/device_command_history_api";

interface CommandHistoryProps {
  isOpen: boolean;
  onOpen?: boolean;
  onClose: () => void;
}

const CommandHistoryModal: React.FC<CommandHistoryProps> = ({
  onClose,
  isOpen,
}) => {
  const [startTimeStamp, setStartTimeStamp] = useState<string>("");
  const [endTimeStamp, setEndTimeStamp] = useState<string>("");
  const { setDeviceCommandAutoApiCall ,setIsDataFetching} = useContext(
    DeviceCommandHistoryContext
  );

  /**
   * Using query client a feature of tanstack query to access api calling in different file without calling the created hooks.
   */
  const queryClient = useQueryClient();

  /**
   * * Function which will work on submit
   * It will convert time string which it will get from <DateTimePicker/> component to timestamp;
   */

  const onHandleSubmit = () => {
    //Here time is being converted into seconds from milliseconds
    /**
     * Unix timestamps are represented in seconds not milliseconds
     * .getTime() will convert date string into number and show us in milliseconds
     * 1 second = 1000 milliseconds
     * To convert the timestamp from milliseconds to seconds we divide it by 1000
     */
    const startTime = new Date(startTimeStamp).getTime() / 1000;
    const endTime = new Date(endTimeStamp).getTime() / 1000;

    /**
     * If any of the time is not selected then it will return will alert
     */
    if(startTimeStamp == "" || endTimeStamp == "")
    {
      return alert("Please select time");
    }

    if (startTime > endTime) {
      alert("Start Time Cannot be greater than end time");
    } else {
      /***
       * * Api call that will again call data will new starttime and endtime
       */
      setIsDataFetching(true);
      queryClient.fetchQuery({queryKey:[device_command_history_query],queryFn:()=>getDeviceCommandHistory({startTime:startTime,endTime:endTime})});

      setDeviceCommandAutoApiCall(false);
    }
    onClose();
  };



  return (
    <>
      <ChakraUiModal
        onHandleClick={onHandleSubmit}
        onClose={onClose}
        isOpen={isOpen}
        modalHeader="Command History"
        successButtonName="Submit"
        errorButtonName="Cancel"
      >
        <>
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div>
              <h3 className="font-semibold">Start Date Time</h3>
              <DateTimePicker
                date={startTimeStamp}
                onDateChange={(e)=>setStartTimeStamp(e.target.value)}
              />
            </div>
            <div>
              <h3 className="font-semibold">End Date Time</h3>
              <DateTimePicker
                date={endTimeStamp}
                onDateChange={(e) => setEndTimeStamp(e.target.value)}
              />
            </div>
          </div>
        </>
      </ChakraUiModal>
    </>
  );
};

export default CommandHistoryModal;
