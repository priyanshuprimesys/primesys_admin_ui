import axios from "axios";
import { IKeymanSingleBeatDeleteInterface } from '../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface';
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";







export async function keymanSingleBeatDelete(keymanBeatDelRequest:IKeymanSingleBeatDeleteInterface){
    try{
        const response = await axiosApi.patch(`/v2/beat/delete-device-beat?beatId=${keymanBeatDelRequest.beatId}&updatedBy=${keymanBeatDelRequest.updatedBy}`);
        return response;
    }catch(error:unknown)
    {
        if(axios.isAxiosError(error))
        {
            throw new Error("Beat not found");
        }
        else{
            throw new Error("Unexpected Error");
        }
    }
}