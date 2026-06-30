import { useQuery } from "@tanstack/react-query"
import { getIssueCategories } from "../services/api"





export const GetIssueCategories = () =>{
    return useQuery({
        queryKey:["get-issue-categories-query"],
        queryFn: getIssueCategories,
        retry: false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled: true
    })
}