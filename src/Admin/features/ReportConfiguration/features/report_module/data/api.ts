import axios from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { ReportModuleResponse, UpdateReportModulePayload, UpdateReportModuleResponse } from "./schema";


export async function fetchReportModules(divisionId: string): Promise<ReportModuleResponse> {

    try {

        const response =
            await axiosApi.get(
                `/api/report/report-module-list?divisionId=${divisionId}`
            );

        return response.data;

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {

            throw new Error(
                error.response?.data?.message ??
                "Failed to fetch modules"
            );
        }

        throw new Error(
            "Unexpected Error"
        );
    }
}

export async function updateReportModules(
    payload: UpdateReportModulePayload
): Promise<UpdateReportModuleResponse> {

    try {

        const response = await axiosApi.put(
            `/api/report/update-module-list`,
            payload
        );

        return response.data;

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {

            throw new Error(
                error.response?.data?.message ??
                "Failed to update modules"
            );
        }

        throw new Error(
            "Unexpected Error"
        );
    }
}