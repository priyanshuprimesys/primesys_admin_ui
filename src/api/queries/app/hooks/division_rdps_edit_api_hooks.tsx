import { useMutation, useQueryClient } from "@tanstack/react-query"
import { division_rdps_edit_query, division_rdps_get_query } from "../queryKeys/queryKeys";
import { getRdpsEditData } from "../features/division_rdps_upload/division_rdps_edit_upload_api";
import { IDivisionRdpsEditInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsEditInterface";
import { useToast } from "@chakra-ui/react";




export const useGetDivisionRdpsUpdate = () =>{
    
    const toast = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey:[division_rdps_edit_query],
        mutationFn:(rdpsRequest:IDivisionRdpsEditInterface)=>{
            return getRdpsEditData(rdpsRequest);
        },
        retry:false,
        onSuccess:(data)=>{
            if(data.data.success===true){
                toast({
                    title:"RDPS Success",
                    status:"success",
                    description:"RDPS updated successfully"
                });

                queryClient.invalidateQueries({queryKey:[division_rdps_get_query]})
            }
        }
    });
}