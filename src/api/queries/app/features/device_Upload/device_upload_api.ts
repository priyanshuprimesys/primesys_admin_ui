import axios, { AxiosResponse } from "axios";
import {
  IAddBulkDeviceResponseInterface,
  IAddBulkDevicesInterface,
} from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/AddBulkDevicesInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";

export async function postUploadDevice(
  deviceUploadRequest: IAddBulkDevicesInterface
): Promise<AxiosResponse<IAddBulkDeviceResponseInterface>> {
  try {
    const response = axiosApi.post(
      "/v2/device/upload",
      {
        file: deviceUploadRequest.file,
        device: JSON.stringify(deviceUploadRequest.device),
        deviceStartSerialNo: deviceUploadRequest.deviceStartSerialNo,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
