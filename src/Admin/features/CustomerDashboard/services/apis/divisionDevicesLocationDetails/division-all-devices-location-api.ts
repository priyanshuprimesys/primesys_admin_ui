import axios, { AxiosResponse } from "axios";
import { userAxiosApi } from "../../../../../../services/axiosUser/axios-api-client";
import { IDivisionDevicesLocationDetailsInterface } from "../../../interfaces/DivisionDevicesLocation/DivisionDevicesLocationDetailsInterface";






export async function getDivisionDevicesLocation(divisionId:string):Promise<AxiosResponse<IDivisionDevicesLocationDetailsInterface>>{
    try{
        const response = await userAxiosApi.get(`/v2/device/all/location?divisionId=${divisionId}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Network Error");
        }else{
            throw new Error("Unexpected Error");
        }
    }
}