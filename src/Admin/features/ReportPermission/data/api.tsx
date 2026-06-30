import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import { IAllDivisionListResponse, IDivisionAllInterface, IReportPermissionModule, IReportPermissionPatchRequest, IReportPermissionResponse } from "./schema";





export async function getAllReportModules(): Promise<AxiosResponse<IReportPermissionModule[]>> {
    try {
        const response = await axiosApi.get('/v2/modules');
        return response;
    } catch (error: unknown) {
        throw new Error("Report Module error");
    }
}





export async function patchUpdateReportModulePermission(payload: IReportPermissionPatchRequest): Promise<AxiosResponse<IReportPermissionResponse>> {
    try {
        const response = await axiosApi.patch('/api/v2/report-permission/update-permission', payload);
        return response;
    } catch (error: unknown) {
        throw new Error("")
    }
}


export async function getAllDivisionDetail(): Promise<AxiosResponse<IDivisionAllInterface>> {
    try {
        const response = await axiosApi.get('/v2/division-logins/get-all-division');
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error('No Data Found');
        } else {
            throw new Error('An Unexpected Error Occurred');
        }
    }
}
export async function getAllDivisionList(): Promise<AxiosResponse<IAllDivisionListResponse>> {
    try {
        const response = await axiosApi.get('/v2/division-logins/division-list');
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error('No Data Found');
        } else {
            throw new Error('An Unexpected Error Occurred');
        }
    }
}

export async function getReportPermissionById(id: string): Promise<AxiosResponse<IReportPermissionResponse>> {
    try {
        const response = await axiosApi.get(`/api/v2/report-permission?id=${id}`);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error('No Data Found');
        } else {
            throw new Error('An Unexpected Error Occurred');
        }
    }
}