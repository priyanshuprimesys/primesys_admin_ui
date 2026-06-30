import axios from "axios";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import { CommonReportResponse, DeleteReportResponse, RegenerateReportRequest, ReportConfigDetailResponse, ReportConfigSummaryResponse, StatusUpdateReportResponse } from "./schema";
import { ReportLogResponse } from "./reportLogSchema";




export async function fetchReportConfig(divisionId: string): Promise<ReportConfigSummaryResponse> {
    try {
        const response = await axiosApi.get(`/api/report/config?divisionId=${divisionId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}



export async function fetchReportConfigDetails(divisionId: string): Promise<ReportConfigDetailResponse> {
    try {
        const response = await axiosApi.get(`/api/report/config-detail?divisionId=${divisionId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}



export async function fetchReportLog(
    divisionId: string,
    deviceTypeId: number,
    reportDate: number
): Promise<ReportLogResponse> {

    try {

        const response = await axiosApi.get(
            `/api/report/log`,
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




export async function deleteReportLog(
    reportId: string
): Promise<DeleteReportResponse> {
    try {
        const response = await axiosApi.delete(`/api/report/destroy-log`, {
            data: {
                reportId,
            },
        });

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}

export async function updateReportLogStatus(
    reportId: string,
    divisionId: string,
    deviceTypeId: number,
    reportDate: number,
    status: string
): Promise<StatusUpdateReportResponse> {

    try {

        const response =
            await axiosApi.put(
                "/api/report/report-log-status",
                {},
                {
                    params: {
                        reportId,
                        divisionId,
                        deviceTypeId,
                        reportDate,
                        status,
                    },
                }
            );

        return response.data;

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {

            throw new Error(
                error.response?.data?.message ??
                "Failed to update report status"
            );
        }

        throw new Error("Unexpected Error");
    }
}


export async function fetchRegenerateReportLog(request: RegenerateReportRequest): Promise<CommonReportResponse> {
    try {
        const response = await axiosApi.post(`/api/report/regenerate-report-log`, request);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}