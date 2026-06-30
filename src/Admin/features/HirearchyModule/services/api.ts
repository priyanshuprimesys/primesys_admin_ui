import axios, { AxiosResponse } from "axios";
import { IEmailMasterResponse } from "../interfaces/EmailMasterInterface";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";







export async function getReportEmailMaster(): Promise<AxiosResponse<IEmailMasterResponse>> {
    try {
        const response = await axiosApi.get("/v2/division-logins/get-report-email-master");
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.statusText)
        }
        throw new Error("Network Error");
    }
}