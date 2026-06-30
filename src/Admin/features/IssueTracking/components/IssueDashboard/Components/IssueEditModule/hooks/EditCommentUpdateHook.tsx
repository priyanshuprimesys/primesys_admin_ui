import { useMutation } from "@tanstack/react-query"
import { IUpdateCommentRequest } from "../Interface/IssueCommentInterface"
import { IssueEditComment } from "../services/api"
import { toast } from "react-toastify"





export const EditCommentUpdateHook = () =>{
    return useMutation({
        mutationKey:["update-edit-comment"],
        mutationFn:(request: IUpdateCommentRequest)=>{
            return IssueEditComment(request);
        },
        retry:false,
        onSuccess:()=>{
            toast.success("Issue Updated Successfully")
        }
    })
}