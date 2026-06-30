import { useMutation } from "@tanstack/react-query"
import { IssueUploadComment } from "../services/api"
import { ICommentRequest } from "../Interface/IssueCommentInterface"
import { toast } from "react-toastify"






export const UpdateComment = () =>{
    return useMutation({
        mutationKey:['commnet-update-key'],
        mutationFn:(request:ICommentRequest)=>{
            return IssueUploadComment(request);
        },
        retry: false,
        onSuccess:()=>{
            toast.success("Comment Created",{
                delay:900,
                pauseOnHover:false
            })
        }
    })
}