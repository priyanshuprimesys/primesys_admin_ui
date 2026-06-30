import { AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDivisionRdpsDeleteResponseInterface } from "../../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsDeleteResponseInterface";







export async function deleteDivisionRdps(rdpsId:string):Promise<AxiosResponse<IDivisionRdpsDeleteResponseInterface>>{
    try{
        const response = await axiosApi.patch(`/v2/rdps/delete?rdpsId=${rdpsId}`);
        return response;
    }catch(error:unknown){
        throw new Error("Network Error");
    }
}