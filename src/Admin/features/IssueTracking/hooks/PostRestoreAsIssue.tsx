import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IRestoreInterface } from "../interfaces/SkipIssueInterface"
import { getRestoreMessageAsIssue } from "../services/api"
import { toast } from "react-toastify"
import { get_issue_message_query_key } from "../queryKey/queryKey"






export const PostRestoreAsIssue = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey:["get-restore-as-issue"],
        mutationFn:(request:IRestoreInterface)=> {
            return getRestoreMessageAsIssue(request)
        },
        retry:false,
        onSuccess:()=>{
            toast.success("Successfully restored");
            queryClient.invalidateQueries({queryKey:["get-all-skip-issues"]});
            queryClient.invalidateQueries({queryKey:[get_issue_message_query_key]});
        },
        onError:()=>{
            toast.error("Restoration failed");
        }
    })
}