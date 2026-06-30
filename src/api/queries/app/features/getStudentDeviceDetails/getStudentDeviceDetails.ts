import axios, { AxiosResponse } from "axios";
import { IStudentDeviceDetailsInterface } from "../../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";

export async function getStudentDeviceDetails(
  divisionId: string
): Promise<AxiosResponse<IStudentDeviceDetailsInterface>> {
  try {
    const response = await axiosApi.get(
      `/v2/device/all?divisionId=${divisionId}`
    );
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
    return error.response as AxiosResponse<IStudentDeviceDetailsInterface>;
    } else {
      throw new Error("Unexpected Error");
    }
  }
}
