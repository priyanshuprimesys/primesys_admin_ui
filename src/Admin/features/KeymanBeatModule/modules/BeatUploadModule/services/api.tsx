import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { IBeatUploadFileRequest, IBeatUploadResponse } from "../interfaces/IBeatUploadInterface";




export async function uploadBeatModuleExcelFile(request:IBeatUploadFileRequest):Promise<AxiosResponse<IBeatUploadResponse>>{
    try{
        const response = axiosApi.post('/v2/beat/upload-device-no-beat-file',{
            file: request.file,
            beat: JSON.stringify(request.beat),
        },{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IBeatUploadResponse>;
        }
        throw new Error("Upload Error");
    }
}