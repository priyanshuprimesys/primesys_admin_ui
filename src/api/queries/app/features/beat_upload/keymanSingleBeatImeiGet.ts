import axios, { AxiosResponse } from "axios";
import { IKeymanSingleBeatImeiDetailsInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanSingleBeatImeiDetailsInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";







export async function getKeymanSingleBeatImeiDetail(deviceImei:string): Promise<AxiosResponse<IKeymanSingleBeatImeiDetailsInterface>>{
    try{
        const response = axiosApi.get(`/v2/beat/get-device-beat?deviceImei=${deviceImei}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error))
        {
            return error.response as AxiosResponse<IKeymanSingleBeatImeiDetailsInterface>;
        }
        else{
            throw new Error("Unexpected error");
        }
    }
}