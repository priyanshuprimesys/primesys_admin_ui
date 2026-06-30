import { useMutation } from "@tanstack/react-query"
import { customer_auth_key } from "../../../queryKey/queryKey"
import { AuthRequestInterface } from "../../../interfaces/AuthInterface/AuthRquestInterface"
import { getUserLogin } from "../../../services/apis/CustomerLogin/customer-login-api"
import { setCustomerAuthToken } from "../../../services/AuthService/AuthService"
import { useContext } from "react"
import { CustomerLoginDetailContext } from "../../../context/CustomerLoginDetailContext/CustomerLoginDetailContext"





export const useCustomerAuthenticate = () =>{

    const {setCustomerLogged} = useContext(CustomerLoginDetailContext);

    return useMutation({
        mutationKey:[customer_auth_key],
        mutationFn:(request:AuthRequestInterface)=>{
            return getUserLogin(request);
        },
        retry:false,
        onSuccess:(data)=>{
            setCustomerAuthToken(data.data.access_token);
            setCustomerLogged(true);
        }
    })
}