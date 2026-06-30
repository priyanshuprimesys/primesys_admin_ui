import { useMutation } from "@tanstack/react-query";
import { pickupIssueTicket } from "../services/api";

export const usePickupTicket = () => {
  return useMutation({
    mutationFn: pickupIssueTicket,
  });
};
