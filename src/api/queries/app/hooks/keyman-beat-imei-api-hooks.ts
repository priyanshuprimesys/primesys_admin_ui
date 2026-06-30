import { useQuery } from "@tanstack/react-query"
import { device_keyman_imei_beat_query } from "../queryKeys/queryKeys"
import { getKeymanSingleBeatImeiDetail } from "../features/beat_upload/keymanSingleBeatImeiGet"
import { IKeymanBeatRequestInterface } from "../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanBeatRequestInterface"
import { getKeymanSingleDivisionIdDetail } from "../features/beat_upload/keymanSIngleDivisionIdGet"








export const useGetKeymanBeatImeiDivisionQuery = (keymanRequest:IKeymanBeatRequestInterface) =>{

    return useQuery({
        queryKey:[device_keyman_imei_beat_query,keymanRequest],
        queryFn:()=> {
            if(keymanRequest.deviceImei && keymanRequest.deviceImei !== "")
            {
               return getKeymanSingleBeatImeiDetail(keymanRequest.deviceImei)
            }
            else if(keymanRequest.deviceType && keymanRequest.divisionId && keymanRequest.deviceType !== "")
            {
               return getKeymanSingleDivisionIdDetail(keymanRequest.divisionId,keymanRequest.deviceType);
            }
            throw new Error("Unable to find records");
        },
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        // enabled:!!keymanRequest.deviceImei || !!keymanRequest.deviceType
    })
}