import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../utils/axiosInstance/AxiosConfig";



export type getDataInterface = {
    path:string;
    postRequest:any
}






export async function postData<T>({path,postRequest}:getDataInterface):Promise<AxiosResponse<T>>{
    try{
        const response = await axiosApi.post(`${path}`,postRequest);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Network Error");
        }
        else{
            throw new Error("Unexpected Error");
        }
    }

}