import axios, { AxiosResponse } from "axios";
import { IDeviceCommandHistoryRequestInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryRequest/DeviceCommandHistoryRequestInterface";
import { IDeviceCommandHistoryDetailResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryDetailResponse";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";








async function getDeviceCommandHistory(commandHistoryRequest:IDeviceCommandHistoryRequestInterface): Promise<AxiosResponse<IDeviceCommandHistoryDetailResponseInterface>>{

    try{
        const response = await axiosApi.get(`/v2/device-command/history?startTime=${commandHistoryRequest.startTime}&endTime=${commandHistoryRequest.endTime}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error('Data Not Found');
        }else{
            throw new Error('Unexpected Error Found');
        }
    }
}



export default getDeviceCommandHistory;