import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import { get_issue_data_by_id_query_key, get_issue_message_query_key, post_issue_message_query_key } from "../queryKey/queryKey"
import { getDataById, isIssuePickable, postIssueMessageStatus } from "../services/api"
import { IIssuePostInterface } from "../interfaces/IssuePostInterface"
import { useToast } from "@chakra-ui/react"
import { useContext } from "react"
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext"


export const ISSUE_BASE_KEY="issue-pickable-query";


export const usePostIssueMessage = () =>{

    const {userDetail} = useContext(UserDetailContext);
    const queryClient = useQueryClient();
    const toast = useToast();


    return useMutation({
        mutationKey:[post_issue_message_query_key],
        mutationFn:(request:IIssuePostInterface)=>{
            return postIssueMessageStatus(request)
        },
        retry:false,
        onSuccess:(data)=>{
            toast({
                title: data.data.data.result,
                status:'success',
                isClosable:true,
                duration:1500,
            });
            queryClient.invalidateQueries({queryKey:[get_issue_message_query_key]});
            queryClient.fetchQuery({queryKey:[get_issue_data_by_id_query_key],
                queryFn:()=> getDataById(userDetail.data.result.divisionId)
            });
        },
        onError:(error)=>{
            toast({
                title: error.message,
                status:"error",
                isClosable:true,
                duration:900
            });
        }
    })
}



export const issuePickableQuery = (noteId:string) =>{
    return queryOptions({
        queryKey:[ISSUE_BASE_KEY,noteId],
        queryFn:() => isIssuePickable(noteId),
        retry: 1,
    })
}