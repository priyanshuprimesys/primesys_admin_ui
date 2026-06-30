import { useMutation } from "@tanstack/react-query";
import { rdps_recalculate_mutation } from "../queryKeys/queryKeys";
import { IRdpsRecalculateRequestInterface } from "../../../../Admin/features/AdminUtility/features/RdpsCalculate/interface/RdpsRecalculateRequestInterface";
import { getRdpsRecalculate } from "../features/rdpsRecalculate/getRdpsRecalculate";
import { useToast } from "@chakra-ui/react";

export const useRdpsRecalculateMutation  = () => {

  const toast = useToast();
  return useMutation({
    mutationKey: [rdps_recalculate_mutation],
    mutationFn: (renewRequest: IRdpsRecalculateRequestInterface) => {
      return getRdpsRecalculate(renewRequest);
    },
    retry: false,
    onError(){
        toast({
            status:'error',
            title:'Report Generation Error',
            description:"Please wait someone is generating report",
            isClosable:true,
            duration:1700,
            variant:'subtle'
        })
    }
  });
};
