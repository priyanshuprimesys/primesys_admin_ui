import { useQuery } from "@tanstack/react-query"
import { device_keyman_imei_edit_beat_query } from "../queryKeys/queryKeys"
import { getKeymanSingleBeatImeiDetail } from "../features/beat_upload/keymanSingleBeatImeiGet"






export const useGetDeviceImeiEditQuery = (deviceImei:string) =>{
    return useQuery({
        queryKey:[device_keyman_imei_edit_beat_query],
        queryFn:()=> getKeymanSingleBeatImeiDetail(deviceImei),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled:!!deviceImei,
    })
}