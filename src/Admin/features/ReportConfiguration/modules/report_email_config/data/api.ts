import axios from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { ReportEmailConfigResponse, ReportEmailDivisionSendingResponse, ReportEmailRequest } from "./schema";


export async function sendReportEmail(
    request: ReportEmailRequest
): Promise<ReportEmailDivisionSendingResponse> {
    try {
        const response = await axiosApi.post("/api/report/scheduleEmail", request);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to send email"
            );
        }
        throw new Error("Unexpected Error");
    }
}




export async function fetchReportLog(
    divisionId: string,
    deviceTypeId: number,
    reportDate: number
): Promise<ReportEmailConfigResponse> {

    try {

        const response = await axiosApi.get(
            `/api/report/email-log`,
            {
                params: {
                    divisionId,
                    deviceTypeId,
                    reportDate,
                },
            }
        );

        return response.data;

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                "Data not found"
            );
        }

        throw new Error("Unexpected Error");
    }
}
