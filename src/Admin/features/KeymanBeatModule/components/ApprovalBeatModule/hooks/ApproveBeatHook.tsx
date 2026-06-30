import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveUploadedBeat } from "../service/api"
import { IBeatApproveRequest } from "../interfaces/BeatApproveInterface";
import { BeatApprovalQueryKey } from "../service/queryKey";




export const ApproveBeatHook = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey:['approve-beat-key-mutation'],
        mutationFn:(request:IBeatApproveRequest)=>{
            return approveUploadedBeat(request);
        },
        retry:false,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:[BeatApprovalQueryKey]});
        }
    })
}