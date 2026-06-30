import axios, { AxiosResponse } from "axios";
import { IDivisionDevicesDetailResponseInterface } from "../../../interfaces/DivisionAllDevices/DivisionDevicesDetailResponseInterface";
import { userAxiosApi } from "../../../../../../services/axiosUser/axios-api-client";






export async function getDivisionAllDevices(divisionId:string):Promise<AxiosResponse<IDivisionDevicesDetailResponseInterface>>{
    try{
        const response = await userAxiosApi.get(`/v2/device/all?divisionId=${divisionId}`);
        return response
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Data not found");
        }
        else{
            throw new Error("Unexpected Error");
        }
    }
}