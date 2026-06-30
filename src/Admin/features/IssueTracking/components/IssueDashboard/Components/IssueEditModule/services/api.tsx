import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../../../../../utils/axiosInstance/AxiosConfig";
import { IDeviceInfoDetailResponseInterface } from "../Interface/DeviceInfoDetailResponse";
import { ICreateIssueInterface, ICreateResponseDetail } from "../Interface/IssueCreateInterface";
import { IUploadFileResponse, IUploadRequest } from "../Interface/FileInterface";
import { ICommentRequest, ICommentResponse, IUpdateCommentRequest } from "../Interface/IssueCommentInterface";
import { IIssueUpdateEditInterface, IssueUpdateEditResponse } from "../Interface/IssueEditInterface";
import { IIssueCategoriesResponse } from "../Interface/IssueCategoriesInterface";




export async function getDeviceInfoWithDeviceImei(imei:string):Promise<AxiosResponse<IDeviceInfoDetailResponseInterface>>{
    try{
        const response = await axiosApi.get(`/v2/device/device-info-full?deviceImei=${imei}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IDeviceInfoDetailResponseInterface>;
        }
        throw new Error("Details not found");
    }
}



export async function createIssue(request: ICreateIssueInterface):Promise<AxiosResponse<ICreateResponseDetail>>{
    try{
        const response = await axiosApi.post('/v2/issue/create-issue',request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<ICreateResponseDetail>;
        }
        throw new Error("Issue not created");
    }
}

export async function updateEditIssue(request: IIssueUpdateEditInterface):Promise<AxiosResponse<IssueUpdateEditResponse>>{
    try{
        const response = await axiosApi.put('/v2/issue',request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IssueUpdateEditResponse>;
        }
        throw new Error("Issue not created");
    }
}



export async function IssueUploadFile(request:IUploadRequest):Promise<AxiosResponse<IUploadFileResponse>>{
    try{
        const response = await axiosApi.post('/v2/issue/upload-issue-attachment-file',request,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IUploadFileResponse>;
        }
        throw new Error("No file uploaded");
    }
}


export async function IssueUploadComment(request:ICommentRequest):Promise<AxiosResponse<ICommentResponse>>{
    try{
        const response = await axiosApi.post('/v2/issue/comment',request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<ICommentResponse>;
        }
        throw new Error("No file uploaded");
    }
}


export async function IssueEditComment(request:IUpdateCommentRequest):Promise<AxiosResponse<ICommentResponse>>{
    try{
        const response = await axiosApi.put('/v2/issue/comment',request);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<ICommentResponse>;
        }
        throw new Error("No file uploaded");
    }
}


export async function getIssueCategories():Promise<AxiosResponse<IIssueCategoriesResponse>>{
    try{
        const response = await axiosApi.get('/v2/issue/issue-categories');
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error) && error.response){
            return error.response as AxiosResponse<IIssueCategoriesResponse>;
        }
        throw new Error("Issue categories not found");
    }
}