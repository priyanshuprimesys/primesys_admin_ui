import axios, { AxiosResponse } from "axios";
import { IBulkLocationChangeResponse, ILocationTransferRequest } from "./schema";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";

export async function bulkChangeLocation(
    request: ILocationTransferRequest
): Promise<AxiosResponse<IBulkLocationChangeResponse>> {
    try {
        const response = await axiosApi.post("/api/location/transfer-location", request);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message ?? "Failed to update locations");
        }
        throw new Error("Unexpected Error");
    }
}

export async function revertLocation(
    request: ILocationTransferRequest
): Promise<AxiosResponse<IBulkLocationChangeResponse>> {
    try {
        const response = await axiosApi.post("/api/location/revert-location", request);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message ?? "Failed to revert locations");
        }
        throw new Error("Unexpected Error");
    }
}

export async function destroyLocation(
    request: ILocationTransferRequest
): Promise<AxiosResponse<IBulkLocationChangeResponse>> {
    try {
        const response = await axiosApi.post("/api/location/destroy-location", request);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message ?? "Failed to destroy locations");
        }
        throw new Error("Unexpected Error");
    }
}
