import axios, { AxiosResponse } from "axios";
import { TrackUserDetailInterface } from "../../../../../interfaces/AppInterfaces/TrackUserInterface/TrackUserDetailInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";








export async function getTrackUserDetail(): Promise<AxiosResponse<TrackUserDetailInterface>> {
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