import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { IAnalyticsRequest } from "../interfaces/IAnalyticsRequest";
import { IAnalyticsDetailResponseInterface } from "../interfaces/IAnalyticsResponse";





export async function getIssueDashboardAnalytics(request:IAnalyticsRequest):Promise<AxiosResponse<IAnalyticsDetailResponseInterface>>{
    try{
        const response = axiosApi.get(`v2/issue/issue-analytics?assigneeId${request.assigneeId}&page=${request.page}&size=${request.size}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IAnalyticsDetailResponseInterface>;
        }
        throw new Error("Analytics not found");
    }
}