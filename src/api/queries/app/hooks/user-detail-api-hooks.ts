import { useQuery } from "@tanstack/react-query"
import { userDetail } from "../queryKeys/queryKeys"
import { getUserDetail } from "../features/userDetail/getUserDetail";





const useUserDetailQuery = () =>{
    return useQuery({
        queryKey: [userDetail],
        queryFn:() => getUserDetail(),
        refetchOnWindowFocus:false,
        retry:false,
        refetchOnMount:false
    });
}




export {useUserDetailQuery};