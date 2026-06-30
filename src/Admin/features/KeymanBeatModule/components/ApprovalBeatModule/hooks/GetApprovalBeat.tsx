import { useQuery } from "@tanstack/react-query"
import { BeatApprovalQueryKey } from "../service/queryKey"
import { getApprovalBeats } from "../service/api"



export const GetApprovalBeat = () =>{
    return useQuery({
        queryKey:[BeatApprovalQueryKey],
        queryFn:getApprovalBeats,
        retry:1,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled:true
    })
}