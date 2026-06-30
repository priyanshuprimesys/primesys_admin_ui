import axios, { AxiosResponse } from "axios";
import { IAddDivisionFormikDevicesInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/AddDivisionDevicesInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IDivisionDeviceResponseInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionDeviceResponseInterface";

export async function postDivisionDeviceData(
  divisionDeviceRequest: IAddDivisionFormikDevicesInterface
): Promise<AxiosResponse<IDivisionDeviceResponseInterface>> {
  try {
    const response = await axiosApi.post("/v2/device", divisionDeviceRequest);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error("Data not found");
    } else {
      throw new Error("Unexpected Error");
    }
  }
}
