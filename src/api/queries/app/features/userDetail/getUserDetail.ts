import axios, { AxiosResponse } from "axios";
import { UserDetailInterface } from "../../../../../interfaces/AppInterfaces/UserDetailInterface/UserDetailInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";








export async function getUserDetail(): Promise<AxiosResponse<UserDetailInterface>> {
    try {
        const response = await axiosApi.get('/api/v2/users/details');
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error('User Data Not Found');
        } else {
            throw new Error('An Unexpected Error Found');
        }
    }

}