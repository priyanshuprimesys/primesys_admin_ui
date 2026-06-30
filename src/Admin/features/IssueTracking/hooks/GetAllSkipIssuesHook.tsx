import { useQuery } from "@tanstack/react-query"
import { getAllSkipIssues } from "../services/api"



export const GetAllSkipIssuesHook = () =>{
    return useQuery({
        queryKey:["get-all-skip-issues"],
        queryFn:getAllSkipIssues,
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:true,
        enabled:true
    })
}