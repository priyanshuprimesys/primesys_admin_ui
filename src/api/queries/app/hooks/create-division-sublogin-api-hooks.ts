import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  division_parent_key, division_sublogin_query_key } from "../queryKeys/queryKeys";
import { IHirearchyCreateInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { postDivisionSubLogin } from "../features/division_sublogin/create_division_sublogin_api";








export const PostCreateDivisionSubLogin = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey:[division_sublogin_query_key],
        mutationFn:(createDivisionSubLogin:IHirearchyCreateInterface)=>{
           return  postDivisionSubLogin(createDivisionSubLogin)
        },
        onSuccess(){
            queryClient.invalidateQueries({queryKey:[division_parent_key],exact:true});
        },
        retry:false,
    })
}