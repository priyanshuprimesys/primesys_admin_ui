import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ICreateIssueInterface } from "../Interface/IssueCreateInterface"
import { createIssue } from "../services/api"
import { toast } from "react-toastify"
import { get_issue_message_query_key } from "../../../../../queryKey/queryKey"







export const CreateIssueHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-issue-mutation'],
        mutationFn: (requst: ICreateIssueInterface) => {
            return createIssue(requst);
        },
        retry: false,
        onSuccess: (data) => {
            if (data.data.success) {
                toast.success("Issue created successfully", {
                    pauseOnHover: false,
                    delay: 1200
                });
                queryClient.invalidateQueries({ queryKey: [get_issue_message_query_key] })
            }
        },
        onError: () => {

        }
    })
}