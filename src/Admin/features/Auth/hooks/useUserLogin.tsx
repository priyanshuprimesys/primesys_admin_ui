import { useMutation } from "@tanstack/react-query"
import { ILoginRequestInterface } from "../interfaces/LoginRequestInterface";
import { useContext } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthLayout/AuthenticationContext/AuthenticationContext";
import AuthService from "../../../../api/services/AuthService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { loginQueryKey } from "../services/queryKey";
import { authenticateUser } from "../services/api";




export const useGetLogin = () =>{

    const {SetIsAuthenticated} = useContext(AuthenticationContext);
    const navigation = useNavigate();
    const toast = useToast();

    return useMutation({
        mutationKey:[loginQueryKey],
        mutationFn:(request:ILoginRequestInterface)=>{
            return authenticateUser(request.email,request.password);
        },
        retry:false,
        onSuccess(data){
            SetIsAuthenticated(true);
            navigation("/admin");
            toast({
                title:"Account Login",
                description:"Account Logged In",
                status:"success",
                duration:1500,
                position:'top-right',
                isClosable:true
            });
            AuthService.saveLocalLoginInfo(data.data.access_token);
        },
        onError(){
            SetIsAuthenticated(false);
            AuthService.clearLoginToken();
        }
    })
}