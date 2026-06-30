import { useMutation } from "@tanstack/react-query";
import { renew_division_query } from "../queryKeys/queryKeys";
import { postRenewDivision } from "../features/renewDevice/renew-division-api";
import { IRenewDivisionRequestInterface } from "../../../../interfaces/AppInterfaces/RenewDivisionInterface/RenewDivisionRequestInterface";

export const useRenewDivisionQuery = () => {
  return useMutation({
    mutationKey: [renew_division_query],
    mutationFn: (renewRequest: IRenewDivisionRequestInterface) => {
      return postRenewDivision(renewRequest);
    },
    retry: false,
  });
};
