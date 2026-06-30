import { useQuery } from "@tanstack/react-query"
import { IDeviceCommandHistoryRequestInterface } from "../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryRequest/DeviceCommandHistoryRequestInterface"
import { device_command_history_query } from "../queryKeys/queryKeys"
import getDeviceCommandHistory from "../features/device_command_history/device_command_history_api"
import { useContext } from "react"
import { DeviceCommandHistoryContext } from "../../../../contexts/AppLayout/Admin/DeviceCommand/DeviceCommandHistory/DeviceCommandHistoryContext"








export const useGetDeviceCommandHistory = (commandHistory:IDeviceCommandHistoryRequestInterface) =>{

    const {deviceCommandAutoApiCall} = useContext(DeviceCommandHistoryContext);


    return useQuery({
        queryKey:[device_command_history_query],
        queryFn:() => getDeviceCommandHistory(commandHistory),
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        refetchInterval:deviceCommandAutoApiCall  ? 30000 : false,
        refetchIntervalInBackground:false,
        retry:false,
        enabled: commandHistory.startTime !== 0 && commandHistory.endTime !== 0
    })
}

