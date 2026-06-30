import { useQuery } from "@tanstack/react-query";
import { getIssueCategories } from "../services/api";
import { get_issue_categories_query_key } from "../queryKey/queryKey";

export const useGetIssueCategories = () => {
  return useQuery({
    queryKey: [get_issue_categories_query_key],
    queryFn: getIssueCategories,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
