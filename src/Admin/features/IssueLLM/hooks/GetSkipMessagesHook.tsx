import { useQuery } from "@tanstack/react-query";
import { getSkipMessages } from "../services/api";
import { get_skip_messages_query_key } from "../queryKey/queryKey";

export const useGetSkipMessages = () => {
  return useQuery({
    queryKey: [get_skip_messages_query_key],
    queryFn: getSkipMessages,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
