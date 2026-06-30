import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDeviceTypeResponse } from "../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";

export async function getAllDeviceTypes(
): Promise<AxiosResponse<IDeviceTypeResponse>> {
    try {
        const response = axiosApi.get(
            '/v2/device/device-types'
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
