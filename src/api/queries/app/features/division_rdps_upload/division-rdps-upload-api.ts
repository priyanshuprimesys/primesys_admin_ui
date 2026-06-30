import axios, { AxiosResponse } from "axios";
import { RdpsFomrikInterface } from "../../../../../interfaces/AppInterfaces/RdpsInterface/RdpsInterface";
import { RdpsResponseInterface } from "../../../../../interfaces/AppInterfaces/RdpsInterface/RdpsResponseInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";








export async function postDivisionRdps(request:RdpsFomrikInterface):Promise<AxiosResponse<RdpsResponseInterface>>{
    try{
        const response = await axiosApi.post('/v2/rdps/upload-rdps-file',{
            file:request.file,
            divisionId:request.divisionId
        },{
            headers:{
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Network Error");
        }else{
            throw new Error("Unexpected error");
        }
    }
}