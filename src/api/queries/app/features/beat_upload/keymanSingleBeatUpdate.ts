import axios from "axios";
import { IKeymanFormikEditInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";









export async function keymanUpdateSingleBeatUpdate(keymanUpdateRequest: IKeymanFormikEditInterface) {
    try {
        const response = axiosApi.put(`/v2/beat/update-device-beat`, keymanUpdateRequest);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error("Data not found");
        }
        else {
            throw new Error("Unexpected error");
        }
    }
}