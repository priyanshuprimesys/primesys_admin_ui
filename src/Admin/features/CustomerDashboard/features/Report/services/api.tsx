import { AxiosResponse } from "axios";
import { IExceptionReportRequest } from "../interfaces/ExceptionInterface/ExceptionReportRequest";
import { IExceptionReportDetailsResponseInterface } from "../interfaces/ExceptionInterface/ExceptionReportDetailsResponse";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";




export async function getExceptionReport(exceptionRequest:IExceptionReportRequest):Promise<AxiosResponse<IExceptionReportDetailsResponseInterface>>{
    try{
        const response = await axiosApi.get('/v2/device/trip-report/status',{
            params: exceptionRequest
        });
        return response;
    }catch(error:unknown){
        throw new Error("Network Error");
    }
}