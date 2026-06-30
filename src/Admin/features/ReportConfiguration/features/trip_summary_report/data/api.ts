import axios from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { TripReportSummaryRequest, TripStatusSummaryResponse, TripSummaryRegenerateRequest, TripSummaryRegenerateResponse } from "./schema";







export async function fetchTripSummaryReport(request: TripReportSummaryRequest): Promise<TripStatusSummaryResponse> {
    try {
        const response = await axiosApi.get(`/api/report/trip-report-summary?divisionId=${request.divisionId}&deviceType=${request.deviceType}&startDateTime=${request.startDateTime}&endDateTime=${request.endDateTime}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}



export async function regenerateTripSummary(request: TripSummaryRegenerateRequest): Promise<TripSummaryRegenerateResponse> {
    try {
        const response = await axiosApi.post(`/api/report/regenerate-trip-summary`, request);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}
export async function deleteTripSummary(request: TripSummaryRegenerateRequest): Promise<TripSummaryRegenerateResponse> {
    try {
        const response = await axiosApi.delete(`/api/report/destroy-trip-summary-report`, { data: request });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}