import { useMutation, useQueryClient } from "@tanstack/react-query"
import { division_rdps_delete_query, division_rdps_get_query } from "../queryKeys/queryKeys";
import { useToast } from "@chakra-ui/react";
import { deleteDivisionRdps } from "../features/division_rdps_upload/division-rdps-delete-api";





export const useDeleteDivisionRdps = () =>{
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:[division_rdps_delete_query],
        mutationFn:(rdpsId:string)=>{
            return deleteDivisionRdps(rdpsId);
        },
        retry:false,
        onSuccess:(data)=>{
            toast({
                title:"RDPS Status",
                description:data.data.data.result,
                isClosable:true,
                duration:2800,
                status:"success"
            });
            queryClient.invalidateQueries({queryKey:[division_rdps_get_query]});
        }
    })
}