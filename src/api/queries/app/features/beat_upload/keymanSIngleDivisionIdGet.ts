import axios, { AxiosResponse } from "axios";
import { IKeymanSingleDivisionIdDetailsInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanSingleDivisionIdDetailsInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";









export async function getKeymanSingleDivisionIdDetail(divisionId:string,deviceType:string): Promise<AxiosResponse<IKeymanSingleDivisionIdDetailsInterface>>{
    try{
        const response = axiosApi.get(`/v2/beat/get-device-type-beat?divisionId=${divisionId}&deviceType=${deviceType}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IKeymanSingleDivisionIdDetailsInterface>;
        }
        else{
            throw new Error("Unexpected error");
        }
    }
}