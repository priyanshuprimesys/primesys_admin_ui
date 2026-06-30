import { useQuery } from "@tanstack/react-query"
import { device_command_query_key } from "../queryKeys/queryKeys"
import { getDeviceCommand } from "../features/device_command/device_command_api"







export const useGetDeviceCommand = ()=>{
    return useQuery({
        queryKey:[device_command_query_key],
        queryFn:()=> getDeviceCommand(),
        enabled:true,
        retryOnMount:false,
        refetchOnWindowFocus:false,
        retry:false
    })
}