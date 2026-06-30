import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { ErrorStatus } from "../../../../../constants/error/ErrorStatus";
import { DeviceExchangeResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceExchangeResponseInterface";










export async function exchangeDevicePost(oldDeviceId:string,newDeviceId:string,userId:string): Promise<AxiosResponse<DeviceExchangeResponseInterface>>{
    try{
        const response = await axiosApi.put(`/v2/device/exchange-device?oldDeviceId=${oldDeviceId}&newDeviceId=${newDeviceId}&userLoginId=${userId}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error('Device Exchange Failed');
        }else{
            throw new Error(ErrorStatus.unexpectedError);
        }
    }
}