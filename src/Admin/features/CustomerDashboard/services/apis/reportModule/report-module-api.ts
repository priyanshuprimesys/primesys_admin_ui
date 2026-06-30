import axios, { AxiosResponse } from "axios";
import { ReportModuleDetailInterface } from "../../../interfaces/ReportModuleInterface/ReportModuleDetailInterface";
import { userAxiosApi } from "../../../../../../services/axiosUser/axios-api-client";




export async function getCustomerReportModule(divisionId:string):Promise<AxiosResponse<ReportModuleDetailInterface>>{
    try{
        const response = userAxiosApi.get(`/v2/division-logins/get-report-module?divisionId=${divisionId}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error("Network Error");
        }else{
            throw new Error("Unexpected Error");
        }
    }
}