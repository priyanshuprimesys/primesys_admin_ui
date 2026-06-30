import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import { IDeviceInspectionReport, IDeviceInspectionReportResponse, IDeviceInspectionReportResponseList } from "./schema";






export async function getAllDeviceInspectionReportService():Promise<AxiosResponse<IDeviceInspectionReportResponseList>>{
    try{
        const response = await axiosApi.get('/v2/division-logins/get-all-device-inspection-report');
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            throw error.response;
        }
        throw new Error("Network Error");
    }
}


export async function postDeviceInspectionReportService(request:IDeviceInspectionReport):Promise<AxiosResponse<IDeviceInspectionReportResponse>>{
    try{
        const response = await axiosApi.post('/v2/division-logins/save-device-inspection-report',request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            throw error.response;
        }
        throw new Error("Network Error");
    }
}
export async function putDeviceInspectionReportService(request:IDeviceInspectionReport):Promise<AxiosResponse<IDeviceInspectionReportResponse>>{
    try{
        const response = await axiosApi.put(`/v2/division-logins/add-device-inspection-report-by-id?reportId=${request.id}`,request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            throw error.response;
        }
        throw new Error("Network Error");
    }
}