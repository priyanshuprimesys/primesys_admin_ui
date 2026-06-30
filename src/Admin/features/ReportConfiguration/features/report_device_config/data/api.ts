import axios from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { DivisionConfigStatusRequest, IDeviceReportConfigResponse, IDeviceReportConfigStatusResponse, IDivisionDeviceReportConfigResponse, ReportDeviceConfigStatus } from "./schema";





export async function fetchDivisionReportDeviceConfig(divisionId: string, deviceTypeId: number): Promise<IDeviceReportConfigResponse> {
    try {
        const response = await axiosApi.get(`/api/v1/report-config/devices?divisionId=${divisionId}&deviceTypeId=${deviceTypeId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}

export async function updateDeviceReportStatus(request: ReportDeviceConfigStatus): Promise<IDeviceReportConfigStatusResponse> {
    try {
        const response = await axiosApi.put("/api/v1/report-config/device-report-status", request);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}
export async function updateDivisionDeviceReportStatus(request: DivisionConfigStatusRequest): Promise<IDivisionDeviceReportConfigResponse> {
    try {
        const response = await axiosApi.put("/api/v1/report-config/division-device-status", request);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}

