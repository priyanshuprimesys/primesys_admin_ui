import { useMutation } from "@tanstack/react-query";
import { IIssueRequestForm } from "../interfaces/IssueForm";
import { post_issue_admin } from "../queryKey/queryKey";
import { postIssue } from "../services/api";



export const usePostIssue = () =>{

    // const {userDetail} = useContext(UserDetailContext);
    // const queryClient = useQueryClient();
    // const toast = useToast();


    return useMutation({
        mutationKey:[post_issue_admin],
        mutationFn:(request:IIssueRequestForm)=>{
            return postIssue(request)
        },
        retry:false
    })
}