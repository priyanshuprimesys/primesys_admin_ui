import { useQuery } from "@tanstack/react-query"
import { getDevicesInfo } from "../services/api";



export const GetDeviceInformation = (deviceImei:string) => {
    return useQuery({
        queryKey:['device-query-get-info',deviceImei],
        queryFn:() => getDevicesInfo(deviceImei),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        // Skip 0/"0"/empty — device-info-full returns 401 for a non-existent
        // device, which would trip the global axios 401→refresh→logout path.
        enabled: !!deviceImei && deviceImei !== "0" && Number(deviceImei) > 0
    });
}