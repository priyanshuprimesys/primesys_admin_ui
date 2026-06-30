import axios, { AxiosError, AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDeviceReplaceRequestInterface } from "../../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceReplaceRequestInterface";
import {
  IDeviceReplaceErrorResponseInterface,
  IDeviceReplaceResponseInterface,
} from "../../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceReplaceResponseInterface";

export async function postReplaceDeviceImei(
  replaceRequest: IDeviceReplaceRequestInterface
): Promise<AxiosResponse<IDeviceReplaceResponseInterface>> {
  try {
    const response = axiosApi.put(
      `/v2/device/update-device-imei?oldDeviceImei=${replaceRequest.oldDeviceImei}&newDeviceImei=${replaceRequest.newDeviceImei}`
    );
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const replaceError =
        error as AxiosError<IDeviceReplaceErrorResponseInterface>;
      if (replaceError.response?.data.success === false) {
        throw new Error(replaceError.response.data.error.message);
      } else {
        throw new Error(replaceError.response?.data.error.message);
      }
    } else {
      throw new Error("Unexpected error");
    }
  }
}
