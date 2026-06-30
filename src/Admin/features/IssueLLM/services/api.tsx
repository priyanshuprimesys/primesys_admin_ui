import axios, { AxiosResponse } from "axios";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import { ActivityEntry, IssueCategoryItem, IssueTicketResponseInterface, IssueTicketTransferHistory, TransferMember } from "../interfaces/IssueTicketInterface";
import { SkipMessageInterface } from "../interfaces/SkipMessageInterface";

export async function getAllIssueTickets(): Promise<AxiosResponse<IssueTicketResponseInterface>> {
  try {
    const response = await axiosApi.get("/v2/issue-ticket/all");
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error("Issue tickets not found");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateIssueTicketStatus(
  request: { id: string; issueStatus: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  try {
    const response = await axiosApi.put("/v2/issue-ticket/", request);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error("Failed to update ticket status");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateIssueTicket(
  request: {
    id: string;
    updatedBy: string;
    issueStatus?: string;
    priority?: string;
    category?: string;
    tags?: string[];
    dueDate?: number;
    deviceImei?: string;
    divisionId?: string;
  }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  const response = await axiosApi.put(`/v2/issue-ticket/${id}`, body);
  return response;
}

export async function getIssueCategories(): Promise<AxiosResponse<{ success: boolean; data: IssueCategoryItem[] }>> {
  try {
    const response = await axiosApi.get("/v2/issue/issue-categories");
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error("Failed to fetch issue categories");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function addIssueTicketComment(
  request: { id: string; message: string; commentedBy: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  const response = await axiosApi.post(`/v2/issue-ticket/${id}/comment`, body);
  return response;
}

export async function editIssueTicketComment(
  request: { id: string; msgHash: string; message: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, msgHash, ...body } = request;
  const response = await axiosApi.put(`/v2/issue-ticket/${id}/comment/${msgHash}`, body);
  return response;
}

export async function pickupIssueTicket(
  request: { id: string; userId: string; userName: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  const response = await axiosApi.post(`/v2/issue-ticket/${id}/pickup`, body);
  return response;
}

export async function createIssueTicket(
  request: {
    groupName: string;
    priority: string;
    issueStatus?: string;
    message?: string;
    description?: string;
    senderName?: string;
    category?: string;
    tags?: string[];
    dueDate?: number;
    divisionId?: string;
    deviceImei?: string;
    createdBy: string;
    assignee?: string;
    assigneeName?: string;
  }
): Promise<AxiosResponse<{ success: boolean; data?: { id: string } }>> {
  const response = await axiosApi.post("/v2/issue-ticket", request);
  return response;
}

export async function getTransferMembers(): Promise<AxiosResponse<{ data: { result: TransferMember[] } }>> {
  const response = await axiosApi.get("/v2/issue-ticket/transfer-members");
  return response;
}

export async function getTransferHistory(
  id: string
): Promise<AxiosResponse<{ data: { result: IssueTicketTransferHistory[] } }>> {
  const response = await axiosApi.get(`/v2/issue-ticket/${id}/transfer-history`);
  return response;
}

export async function transferIssueTicket(
  request: { id: string; toAssignee: string; toAssigneeName: string; transferredBy: string; reason: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  const response = await axiosApi.post(`/v2/issue-ticket/${id}/transfer`, body);
  return response;
}

export async function resolveIssueTicket(
  request: { id: string; resolution: string; resolvedBy: string; note?: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  return axiosApi.post(`/v2/issue-ticket/${id}/resolve`, body);
}

export async function closeIssueTicket(
  request: { id: string; closedBy: string; note?: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  return axiosApi.post(`/v2/issue-ticket/${id}/close`, body);
}

export async function reopenIssueTicket(
  request: { id: string; reopenedBy: string; note?: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, ...body } = request;
  return axiosApi.post(`/v2/issue-ticket/${id}/reopen`, body);
}

export async function deleteIssueAttachment(
  request: { id: string; fileName: string; deletedBy: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, fileName, deletedBy } = request;
  return axiosApi.delete(
    `/v2/issue-ticket/${id}/attachment?fileName=${encodeURIComponent(fileName)}&deletedBy=${encodeURIComponent(deletedBy)}`
  );
}

export async function getTicketActivity(
  id: string
): Promise<AxiosResponse<{ data: { result: ActivityEntry[] }; success: boolean }>> {
  return axiosApi.get(`/v2/issue-ticket/${id}/activity`);
}

export async function uploadIssueAttachment(
  request: { file: File; ticketId: string; updatedBy: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const formData = new FormData();
  formData.append("file", request.file);
  formData.append("ticketId", request.ticketId);
  formData.append("updatedBy", request.updatedBy);
  const response = await axiosApi.post(
    "/v2/issue-ticket/upload-attachment",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response;
}

export async function getSkipMessages(): Promise<AxiosResponse<{ success: boolean; data: SkipMessageInterface[] }>> {
  const response = await axiosApi.get("/v2/issue-ticket/skip-messages");
  return response;
}

export async function convertSkipMessage(
  request: { id: string; convertedBy: string }
): Promise<AxiosResponse<{ success: boolean }>> {
  const { id, convertedBy } = request;
  const response = await axiosApi.post(
    `/v2/issue-ticket/skip-messages/${id}/convert?convertedBy=${encodeURIComponent(convertedBy)}`
  );
  return response;
}
