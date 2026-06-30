import axios, { AxiosResponse } from "axios";
import { IDeviceInfoDetailResponseInterface } from "../../../../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/Interface/DeviceInfoDetailResponse";
import axiosApi from "../../../../../../../utils/axiosInstance/AxiosConfig";





export async function getDevicesInfo(deviceImei:string):Promise<AxiosResponse<IDeviceInfoDetailResponseInterface>>{
    try{
        const response = axiosApi.get(`/v2/device/device-info-full?deviceImei=${deviceImei}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IDeviceInfoDetailResponseInterface>;
        }
        throw new Error("Device Info not found");
    }
}