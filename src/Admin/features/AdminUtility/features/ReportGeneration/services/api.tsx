import axios, { AxiosError, AxiosResponse } from "axios";
import { IReportGenerateRequestInterface } from "../interfaces/IReportGenerateRequest";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { IReportGenerateResponseInterface } from "../interfaces/IReportGenerateResponse";
import { IOtpRequestInterface } from "../interfaces/IOtpRequestInterface";
import { IOtpVerifyRequestInterface } from "../interfaces/IOtpVerifyRequestInterface";
import { IOtpVerifyResponseInterface } from "../interfaces/IOtpVerifyResponseInterface";




export async function postReportGeneration(request: IReportGenerateRequestInterface): Promise<AxiosResponse<IReportGenerateResponseInterface>> {
    try {
        const response = await axiosApi.post('/v2/division-logins/run-report', request);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const RError = error as AxiosError<IReportGenerateResponseInterface>;
            if (RError.response?.data.success == false) {
                throw new Error(RError.response.data.data.result);
            }
            else {
                throw new Error(error.message);
            }
        }
        else {
            throw new Error("Unknown Error");
        }
    }
}







export async function postOtpGeneration(request: IOtpRequestInterface) {
    try {
        const response = await axios.post(`https://api.mykidtrackers.com/admin-service/api/v1/auth/generate-otp?userId=${request.userId}`);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Network Error");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}






export async function postVerifyOtp(request: IOtpVerifyRequestInterface): Promise<AxiosResponse<IOtpVerifyResponseInterface>> {
    try {
        const response = await axios.post(`https://api.mykidtrackers.com/admin-service/api/v1/auth/verify-otp?userId=${request.userId}&otp=${request.otp}`);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response as AxiosResponse<IOtpVerifyResponseInterface>;
        }
        else {
            throw new Error("Unexpected Error");
        }
    }
}