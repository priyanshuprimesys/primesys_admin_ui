import axios, { AxiosResponse } from "axios";
import { IAllDivisionDevicesDetailsInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDevicesDetails";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";

/**
 *
 * This api is for all division devices call is doesnot need any parameter.
 * It will return all devices from every division
 *
 */

export async function getAllDivisionDevices(): Promise<
  AxiosResponse<IAllDivisionDevicesDetailsInterface>
> {
  try {
    const response = axiosApi.get("/v2/device/all-devices");
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error("No data found");
    } else {
      throw new Error("Unexpected Error Found");
    }
  }
}
