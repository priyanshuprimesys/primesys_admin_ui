import axios, { AxiosError, AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IKeyManFormikBulkRequestInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import { IKeymanBulkUploadErrorResponseInterface, IKyemanBulkUploadResponseInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManFileUploadResponseInterface";







async function postKeyManMultipleFileUpload(keymanMultipleFile:IKeyManFormikBulkRequestInterface):Promise<AxiosResponse<IKyemanBulkUploadResponseInterface>>{
    try{
        const response = await axiosApi.post("/v2/beat/upload-device-no-beat-file",{
            file:keymanMultipleFile.file,
            beat:JSON.stringify(keymanMultipleFile.beat),
        },{
            headers:{
                "Content-Type":"multipart/form-data",
            }
        });
        return response;
    }catch(error:unknown)
    {
        if(axios.isAxiosError(error))
        {
            const RError = error as AxiosError<IKeymanBulkUploadErrorResponseInterface>;
            if(RError.response?.data.success == false)
            {
                throw new Error(RError.response.data.error.message);
            }
            else{
                throw new Error(error.message);
            }
           
        }else{
            throw new Error("Unexpected Error");
        }
    }
}



export default postKeyManMultipleFileUpload;