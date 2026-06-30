import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { ILoginTrackUserDetailInterface } from "../../../../../interfaces/AppInterfaces/IDivision_Login_Track_Users_Detail_Interface/ILoginTrackUserDetailInterface";









export async function getDivisonLoginTrackUserDetail(): Promise<AxiosResponse<ILoginTrackUserDetailInterface>> {
    try {
        const response = await axiosApi.get('/v2/division-logins/get-track-user');
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error('No Data Found');
        } else {
            throw new Error('An Unexpected Error Occurred');
        }
    }
}