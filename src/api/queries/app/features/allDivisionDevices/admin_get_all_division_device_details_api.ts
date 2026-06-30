import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { DivisionSingleDeviceResponseInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceResponseInterface";

export async function getAllDivisionDevice(
  divisionId: string
): Promise<AxiosResponse<DivisionSingleDeviceResponseInterface>> {
  try {
    const response = axiosApi.get(
      `/v2/device/all-device-details?divisionId=${divisionId}`
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
