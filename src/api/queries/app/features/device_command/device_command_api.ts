import axios, { AxiosResponse } from "axios";
import { IDeviceCommandDetailInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandDetailInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";








export async function getDeviceCommand(): Promise<AxiosResponse<IDeviceCommandDetailInterface>>{
    try{
        const response = await axiosApi.get('v2/device-command');
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error('Not Data Found');
        }else{
            throw new Error('An Unexpected error occurred');
        }
    }
}