import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateEditIssue } from "../services/api"
import { toast } from "react-toastify"
import { IIssueUpdateEditInterface } from "../Interface/IssueEditInterface"
import { get_issue_data_by_id_query_key } from "../../../../../queryKey/queryKey"







export const UpdateIssueHook = () =>{
    
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-issue-mutation'],
        mutationFn:(requst:IIssueUpdateEditInterface)=>{
            return updateEditIssue(requst);
        },
        retry:false,
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:[get_issue_data_by_id_query_key]});
            if(data.data.success){
                toast.success("Issue Updated successfully",{
                    pauseOnHover:false,
                    delay: 1200
                });
            }
        },
        onError:()=>{

        }
    })
}