import axios, { AxiosResponse } from "axios";
import { IRenewDeviceRequestInterface } from "../../../../../interfaces/AppInterfaces/RenewDeviceInterface/RenewDeviceRequestInterface";
import { IRenewDeviceResponseInterface } from "../../../../../interfaces/AppInterfaces/RenewDeviceInterface/RenewDeviceResponseInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";

export async function postRenewDevice(
  renewRequest: IRenewDeviceRequestInterface
): Promise<AxiosResponse<IRenewDeviceResponseInterface>> {
  try {
    const response = axiosApi.put(
      `/v2/device/renew-device-wise?deviceId=${renewRequest.deviceId}&userLoginId=${renewRequest.userLoginId}&days=${renewRequest.days}`
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
