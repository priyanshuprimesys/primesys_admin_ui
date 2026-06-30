import axios, { AxiosResponse } from "axios";
import { IRenewDivisionRequestInterface } from "../../../../../interfaces/AppInterfaces/RenewDivisionInterface/RenewDivisionRequestInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IRenewDivisionResponseInterface } from "../../../../../interfaces/AppInterfaces/RenewDivisionInterface/RenewDivisionResponseInterface";

export async function postRenewDivision(
  renewRequest: IRenewDivisionRequestInterface
): Promise<AxiosResponse<IRenewDivisionResponseInterface>> {
  try {
    const response = axiosApi.put(
      `/v2/device/renew-device-division-wise?divisionId=${renewRequest.divisionId}&userLoginId=${renewRequest.userLoginId}&days=${renewRequest.days}`
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
