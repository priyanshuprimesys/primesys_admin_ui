import axios, { AxiosResponse } from "axios";
import { DeviceLocationDestroyResponse, DeviceLocationResponse, IDeviceDestroyRequest, IDeviceLocationRequest } from "./schema";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";





export async function getDeviceLocations(request: IDeviceLocationRequest): Promise<AxiosResponse<DeviceLocationResponse>> {
    try {
        const response = await axiosApi.get(
            `/v1/device-locations/all?endTime=${request.endTime}&imei=${request.deviceImei}&startTime=${request.startTime}`
        );
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}

export async function deleteLocations(request: IDeviceDestroyRequest): Promise<AxiosResponse<DeviceLocationDestroyResponse>> {
    try {
        const response = await axiosApi.delete('/v1/device-locations/destroy', {
            data: request
        });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        } else {
            throw new Error("Unexpected Error");
        }
    }
}
