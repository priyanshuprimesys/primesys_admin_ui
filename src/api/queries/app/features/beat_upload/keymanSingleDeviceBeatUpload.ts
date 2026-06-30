import axios from "axios";
import { IKeyManFormikRequestInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";







export async function postKeymanSingleDeviceBeatUpload(singleBeatRequest:IKeyManFormikRequestInterface){
    try{
        const response = axiosApi.post(`v2/beat/upload-single-device-beat`,singleBeatRequest);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Data not found");
        }
        else{
            throw new Error("Unexpected Error");
        }
    }
}