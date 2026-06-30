import axios, { AxiosResponse } from "axios";
import { IUpdateDivisionDevicesInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/UpdateDivisionDevicesInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDivisionSingleDeviceUpdateResponseInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceUpdateResponseInterface";

export async function updateDivisionDeviceData(
  updateDeviceRequest: IUpdateDivisionDevicesInterface
): Promise<AxiosResponse<IDivisionSingleDeviceUpdateResponseInterface>> {
  try {
    const response = await axiosApi.put("/v2/device", updateDeviceRequest);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
    return error.response as AxiosResponse<IDivisionSingleDeviceUpdateResponseInterface>;
    } else {
      throw new Error("Unexpected Error");
    }
  }
}
