import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../utils/axiosInstance/AxiosConfig";



export type getDataInterface = {
    path:string;
}






export async function getData<T>({path}:getDataInterface):Promise<AxiosResponse<T>>{
    try{
        const response = await axiosApi.get<T>(path);
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