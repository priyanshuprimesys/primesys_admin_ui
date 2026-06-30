import axios, { AxiosResponse } from "axios";
import { IDataPacketResponse } from "../interface/IOTDataInterface";
import { IOTDataRequest } from "../interface/IOTDataRequest";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";








export async function getIotDataPacket(request: IOTDataRequest): Promise<AxiosResponse<IDataPacketResponse>> {
    try {
        const response = axiosApi.get(`/v2/packets/device-packets?imei=${request.imei}&startTime=${request.startTime}&endTime=${request.endTime}&page=${request.page}&size=${request.size}`);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Network Error")
        } else {
            throw new Error("Unexpexted Error");
        }
    }
}