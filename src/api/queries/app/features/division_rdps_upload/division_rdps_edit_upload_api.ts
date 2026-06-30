import { AxiosResponse } from "axios";
import { IDivisionRdpsEditInterface } from "../../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsEditInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDivisionRdpsEditResponseInterface } from "../../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsEditResponseInterface";








export async function getRdpsEditData(request:IDivisionRdpsEditInterface):Promise<AxiosResponse<IDivisionRdpsEditResponseInterface>>{
    try{
        const response = await axiosApi.put(`/v2/rdps`,request);
        return response;
    }catch(error:unknown){
        throw new Error("Network Error");
    }
}