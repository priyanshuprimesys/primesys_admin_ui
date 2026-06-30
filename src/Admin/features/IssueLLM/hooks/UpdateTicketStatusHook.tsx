import { useMutation } from "@tanstack/react-query";
import { updateIssueTicketStatus } from "../services/api";

export const useUpdateTicketStatus = () => {
  return useMutation({
    mutationFn: updateIssueTicketStatus,
  });
};
