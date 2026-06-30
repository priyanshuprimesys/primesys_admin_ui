import axios, { AxiosResponse } from "axios";
import { IDeviceFileUploadInterface, IDeviceFileUploadResponse } from "../interfaces/DevicesFileUploadInterface";
import axiosApi from "../../../../../../../utils/axiosInstance/AxiosConfig";




export async function userDeviceFileUpload(request:IDeviceFileUploadInterface):Promise<AxiosResponse<IDeviceFileUploadResponse>>{
    try{
        const response = await axiosApi.post('/v2/device/upload-device-update-file',{
            file: request.file,
            updatedBy: request.updateBy
        },{
            headers:{
                "Content-Type":"multipart/form-data",
            }
        });
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response)
        {
            return error.response as AxiosResponse<IDeviceFileUploadResponse>;
        }else{
            throw new Error("Unexpected Error");
        }
    }
}