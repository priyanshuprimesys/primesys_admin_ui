import { useQuery } from "@tanstack/react-query"
import { getTrackuser } from "../queryKeys/queryKeys"
import { getTrackUserDetail } from "../features/getTrackUser/getTrackUserDetail"





export const useGetTrackUserQuery = () =>{
    return useQuery({
        queryKey:[getTrackuser],
        queryFn:()=> getTrackUserDetail(),
        enabled:true,
        retryOnMount:false,
        refetchOnWindowFocus:false,
        retry:false
    })
}