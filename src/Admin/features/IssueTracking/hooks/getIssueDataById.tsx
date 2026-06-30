import { useQuery } from "@tanstack/react-query";
import { get_issue_data_by_id_query_key } from "../queryKey/queryKey";
import { getDataById } from "../services/api";






export const useGetIssueDataById = (request:string) =>{
    return useQuery({
        queryKey:[get_issue_data_by_id_query_key],
        queryFn:()=> getDataById(request),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled:!!request,
    });
}