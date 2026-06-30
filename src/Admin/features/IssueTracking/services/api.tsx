import axios, { AxiosResponse } from "axios";
import { IDeviceIssueDetailsInterface } from "../interfaces/DeviceIssueDetailsInterface";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import { IIssuePostInterface } from "../interfaces/IssuePostInterface";
import { IIssuePostResponseInterface } from "../interfaces/IssuePostResponseInterface";
import { IDeviceIssueResponseDetailInterface } from "../interfaces/DeviceIssueResponseDetailInterface";
import { IIssueRequestForm, IssueResponseForm } from "../interfaces/IssueForm";
import { ISkippedIssueDetailInterface } from "../interfaces/SkippedIssueInterface";
import { IDashboardAnalyticsResponse, IDashboardRequestInterface } from "../interfaces/DashboardAnalytics";
import { IRestoreInterface, IRestoreResponse } from "../interfaces/SkipIssueInterface";

export async function getUserMessage(): Promise<AxiosResponse<IDeviceIssueDetailsInterface>> {
  try {
    const response = await axiosApi.get('/v2/issue/get-whatsapp-msg');
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}

// 6961e25fc651d109f132b645

export async function postIssueMessageStatus(request:IIssuePostInterface):Promise<AxiosResponse<IIssuePostResponseInterface>>{
  try
  {
    const response = await axiosApi.patch(`/v2/issue/pick-up?noteId=${request.noteId}&userId=${request.userId}&action=${request.action}`);
    return response;
  }
  catch(error:unknown)
  {
    if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}

export async function isIssuePickable(noteId:string):Promise<AxiosResponse<IIssuePostResponseInterface>>{
  try
  {
    const response = await axiosApi.get(`/v2/issue/is-pickable?noteId=${noteId}`);
    return response;
  }
  catch(error:unknown)
  {
    if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}



export async function postIssue(request:IIssueRequestForm):Promise<AxiosResponse<IssueResponseForm>>{
  try{
    const response = await axiosApi.post(`v2/issue`,request);
    return response;
  }catch(error:unknown){
   if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}

export async function getDataById(request:string):Promise<AxiosResponse<IDeviceIssueResponseDetailInterface>>{
  try{
    const response = await axiosApi.get(`/v2/issue/get-issue-of-member?userId=${request}`);
    return response;
  }catch(error:unknown)
  {
    if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}


export async function getAllIssues():Promise<AxiosResponse<IDeviceIssueResponseDetailInterface>>{
  try{
    const response = await axiosApi.get(`/v2/issue/get-issue-of-member?userId=all`);
    return response;
  }catch(error:unknown)
  {
    if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}


export async function getAllSkipIssues():Promise<AxiosResponse<ISkippedIssueDetailInterface>>{
  try{
    const response = await axiosApi.get(`/v2/issue/get-whatsapp-skipped-msg`);
    return response;
  }catch(error:unknown)
  {
    if (axios.isAxiosError(error)) {
      throw new Error("User Data Not Found");
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}

export async function getDashboardAnalytics(request:IDashboardRequestInterface):Promise<AxiosResponse<IDashboardAnalyticsResponse>>{
  try{
    const response = await axiosApi.get(`/v2/issue/detail-analytics?assigneeId=${request.assigneeId}&page=${request.page}&size=${request.size}`);
    return response;
  }catch(error:unknown)
  {
    if (axios.isAxiosError(error) && error.response) {
      return error.response as AxiosResponse<IDashboardAnalyticsResponse>;
    } else {
      throw new Error("An Unexpected Error Found");
    }
  }
}



export async function getRestoreMessageAsIssue(request:IRestoreInterface):Promise<AxiosResponse<IRestoreResponse>>{
  try{
    const response = await axiosApi.patch(`/v2/issue/restore-as-issue?issueId=${request.issueId}&userId=${request.userId}`);
    return response;
  }catch(error:unknown){
    if(axios.isAxiosError(error) && error.response){
      return error.response as AxiosResponse<IRestoreResponse>;
    }
    throw new Error("Couldn't restore as an Issue");
  }
}