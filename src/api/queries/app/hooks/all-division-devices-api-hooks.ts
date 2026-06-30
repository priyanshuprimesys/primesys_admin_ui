import { useQuery } from "@tanstack/react-query"
import { all_division_devices_query } from "../queryKeys/queryKeys"
import { getAllDivisionDevices } from "../features/allDivisionDevices/AllDivisionDevices_api"







export const useGetAllDivisionDevicesQuery = () =>{
    return useQuery({
        queryKey:[all_division_devices_query],
        queryFn:()=> getAllDivisionDevices(),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        // refetchOnReconnect:false,
        enabled:false,
    });
}