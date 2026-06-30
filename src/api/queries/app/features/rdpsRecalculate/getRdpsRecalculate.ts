import axios, { AxiosError, AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IRdpsRecalculateRequestInterface } from "../../../../../Admin/features/AdminUtility/features/RdpsCalculate/interface/RdpsRecalculateRequestInterface";
import { IRdpsRecalculateResponseInterface } from "../../../../../Admin/features/AdminUtility/features/RdpsCalculate/interface/RdpsRecalculateResponseInterface";








export async function getRdpsRecalculate(request:IRdpsRecalculateRequestInterface): Promise<AxiosResponse<IRdpsRecalculateResponseInterface>> {
    try{
        const response = await axiosApi.post(`/v2/division-logins/run-recalculate-rdps`,request);
        return response;
    }catch(error:unknown){
       if(axios.isAxiosError(error)){
            const RError = error as AxiosError<IRdpsRecalculateResponseInterface>;
            if(RError.response?.data.success == false)
            {
                throw new Error(RError.response.data.data.result);
            }
            else{
                throw new Error(error.message);
            }
        }
        else{
            throw new Error("Unknown Error");
        }
    }
}