import axios, { AxiosResponse } from "axios";
import { AuthRequestInterface } from "../../../interfaces/AuthInterface/AuthRquestInterface";
import { AuthResponseInterface } from "../../../interfaces/AuthInterface/AuthResponseInterface";
import { userAxiosApi } from "../../../../../../services/axiosUser/axios-api-client";






export async function getUserLogin(request:AuthRequestInterface):Promise<AxiosResponse<AuthResponseInterface>>{

    try{
        const response = await userAxiosApi.post('/api/v1/auth/authenticate',request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Data not found");
        }else{
            throw new Error("Unexpected Error");
        }
    }

}