import { useQuery } from "@tanstack/react-query"
import { getDeviceInfoWithDeviceImei } from "../services/api"



export const GetDeviceInfoByImei = (Imei:string) =>{
    return useQuery({
        queryKey:['get-device-info-by-info'],
        queryFn:()=> getDeviceInfoWithDeviceImei(Imei),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        // Skip 0/"0"/empty — device-info-full returns 401 for a non-existent
        // device, which would trip the global axios 401→refresh→logout path.
        enabled: !!Imei && Imei !== "0" && Number(Imei) > 0
    })
}