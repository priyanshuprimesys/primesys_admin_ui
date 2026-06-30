import { useQuery } from "@tanstack/react-query"
import { getAllIssues } from "../services/api"






export const GetAllIssues = () =>{
    return useQuery({
        queryKey:['get-all-issues-dashboard'],
        queryFn:getAllIssues,
        retry:false,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus:true,
        enabled:true
    })
}