import axios, { AxiosResponse } from "axios";
import { ReportEmailStatusResponse, SystemViewResponse } from "./schema";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";





export async function getAllReportEmailStatus(
    reportDate: number
): Promise<AxiosResponse<ReportEmailStatusResponse>> {
    try {
        const response = axiosApi.get(
            `/api/report-email/status?reportDate=${reportDate}`
        );
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected error");
        }
    }
}


export async function getEmailSystemView(
    reportDate: number
): Promise<AxiosResponse<SystemViewResponse>> {
    try {
        const response = axiosApi.get(
            `/api/report-email/system-view?reportDate=${reportDate}`
        );
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected error");
        }
    }
}
