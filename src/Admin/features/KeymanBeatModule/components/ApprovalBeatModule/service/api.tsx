import axios, { AxiosError, AxiosResponse } from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { IApprovalBeatResponse } from "../interfaces/ApprovalBeatResponse";
import { IBeatApproveRequest } from "../interfaces/BeatApproveInterface";
import { IDestroyBeatRequest } from "../interfaces/DestroyBeatRequest";
import { IBeatDestroyResponse } from "../interfaces/DestroyBeatResponse";




export async function getApprovalBeats(): Promise<AxiosResponse<IApprovalBeatResponse>> {
    try {
        const response = await axiosApi.get('/v2/beat/unapproved/grouped-by-ref-file');
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const RError = error as AxiosError<IApprovalBeatResponse>;
            if (RError.response?.data.success == false) {
                throw new Error(RError.response.data.error.message);
            }
            else {
                throw new Error(error.message);
            }

        } else {
            throw new Error("Unexpected Error");
        }
    }
}



export async function approveUploadedBeat(request: IBeatApproveRequest): Promise<AxiosResponse<IApprovalBeatResponse>> {
    try {
        const response = await axiosApi.patch(`/v2/beat/approve-device-beat?beatId=${request.beatId}&updatedBy=${request.updatedBy}`);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const RError = error as AxiosError<IApprovalBeatResponse>;
            if (RError.response?.data.success == false) {
                throw new Error(RError.response.data.error.message);
            }
            else {
                throw new Error(error.message);
            }

        } else {
            throw new Error("Unexpected Error");
        }
    }
}

export async function destroyUploadedBeat(request: IDestroyBeatRequest): Promise<AxiosResponse<IBeatDestroyResponse>> {
    try {
        const response = await axiosApi.delete(`/v2/beat/delete-device-beat-approval-file?refFileName=${request.refFileName}&updatedBy=${request.updatedBy}`);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const RError = error as AxiosError<IApprovalBeatResponse>;
            if (RError.response?.data.success == false) {
                throw new Error(RError.response.data.error.message);
            }
            else {
                throw new Error(error.message);
            }

        } else {
            throw new Error("Unexpected Error");
        }
    }
}

