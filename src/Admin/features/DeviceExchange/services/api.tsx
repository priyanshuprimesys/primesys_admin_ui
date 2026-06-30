import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig"
import { DeviceExchageGetRequest } from "../interface/DeviceExchageGetRequest";
import { IDeviceExchangeDetailsInterface } from "../interface/DeviceExchangeResponseInterface";




export async function getExchangeDevices(exchangeRequest: DeviceExchageGetRequest): Promise<AxiosResponse<IDeviceExchangeDetailsInterface>> {
  try {
    const response = axiosApi.get(
      `/v2/device/get-exchange-device?page=${exchangeRequest.page}&size=${exchangeRequest.size}&sort=timestamp,desc&userLoginId=${exchangeRequest.userLoginId}`
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
