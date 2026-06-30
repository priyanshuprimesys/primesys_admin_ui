import { useQuery } from "@tanstack/react-query";
import { getAllIssueTickets } from "../services/api";
import { get_all_issue_tickets_query_key } from "../queryKey/queryKey";

export const useGetAllIssueTickets = () => {
  return useQuery({
    queryKey: [get_all_issue_tickets_query_key],
    queryFn: getAllIssueTickets,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    enabled: true,
  });
};
