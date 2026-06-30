import { useQuery } from "@tanstack/react-query"
import { device_keyman_divisionId_beat_query } from "../queryKeys/queryKeys"
import { getKeymanSingleDivisionIdDetail } from "../features/beat_upload/keymanSIngleDivisionIdGet"









export const useGetKeymanBeatDivisionQuery = (divisionId:string,deviceType:string) =>{
    return useQuery({
        queryKey:[device_keyman_divisionId_beat_query,deviceType],
        queryFn:() => getKeymanSingleDivisionIdDetail(divisionId,deviceType),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled: !!divisionId && !!deviceType
    })
}