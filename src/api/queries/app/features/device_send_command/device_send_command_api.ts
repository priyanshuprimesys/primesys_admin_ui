import axios, { AxiosResponse } from "axios";
import { IDeviceCommandResponseDetailInteface } from "../../../../../interfaces/AppInterfaces/DeviceCommandRequestInterface/DeviceCommandResponseDetailInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDeviceCommandRequestBulkInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandRequestInterface/DeviceCommandRequestBulkInterface";








export async function postDeviceSendCommand(deviceCommand:IDeviceCommandRequestBulkInterface):Promise<AxiosResponse<IDeviceCommandResponseDetailInteface>>{
    try{
        const response = await axiosApi.post('/v2/device-command/send-command',deviceCommand);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error('No Data Found');
        }
        else{
            throw new Error('An Unexpected Error Found');
        }
    }
} 