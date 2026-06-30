import { useQuery } from "@tanstack/react-query"
import { get_issue_message_query_key } from "../queryKey/queryKey";
import { getUserMessage } from "../services/api";





export const useGetIssueMessage = () => {
    return useQuery({
        queryKey: [get_issue_message_query_key],
        queryFn: () => getUserMessage(),
        retry: false,
        refetchOnMount: false,
        refetchInterval: 50000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });
}