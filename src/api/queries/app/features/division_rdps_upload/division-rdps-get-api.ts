import { AxiosResponse } from "axios";
import { IDivisionRdpsResponseInterface } from "../../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";




export async function getDivisionRdpsData(divisionId:string):Promise<AxiosResponse<IDivisionRdpsResponseInterface>>{
    try{
        const response = await axiosApi.get(`/v2/rdps/division-rdps-data?divisionId=${divisionId}`);
        return response;
    }catch(error:unknown){
        throw new Error("Network Error");
    }
}