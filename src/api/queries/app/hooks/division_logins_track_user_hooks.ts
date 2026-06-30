import { useQuery } from "@tanstack/react-query"
import { division_login_track_user_key } from "../queryKeys/queryKeys"
import { getDivisonLoginTrackUserDetail } from "../features/division_logins_track_user_id/division_logins_track_user_id_api"







export const useGetDivisionLoginTrackUser = () =>{
    return useQuery({
        queryKey:[division_login_track_user_key],
        queryFn:()=> getDivisonLoginTrackUserDetail(),
        enabled:true,
        retryOnMount:false,
        refetchOnWindowFocus:false,
        retry:false
    })
}