import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IDeviceCommandRequestBulkInterface } from "../../../../interfaces/AppInterfaces/DeviceCommandRequestInterface/DeviceCommandRequestBulkInterface"
import { device_command_history_query, device_send_command } from "../queryKeys/queryKeys";
import { postDeviceSendCommand } from "../features/device_send_command/device_send_command_api";







const usePostSendDeviceCommand = () =>{

    const queryClient = useQueryClient();


    return useMutation({
        mutationKey:[device_send_command],
        mutationFn:(payload:IDeviceCommandRequestBulkInterface) => {
            return postDeviceSendCommand(payload);
        },
        onSuccess(){
            queryClient.invalidateQueries({queryKey:[device_command_history_query]})
        },
        retry:false
    })
}



export {usePostSendDeviceCommand};