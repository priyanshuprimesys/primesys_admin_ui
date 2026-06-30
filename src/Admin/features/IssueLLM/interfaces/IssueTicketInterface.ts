import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

export type IssueTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface IssueTicketComment {
  msg_hash?: string;
  message?: string;
  source_message_id?: string;
  received_at?: string;
  appended_at?: string;
  commentedBy?: string;
}
export type IssueTicketPriority = "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";

export type IssueResolution = "FIXED" | "WONT_FIX" | "DUPLICATE" | "INVALID" | "CANNOT_REPRODUCE";

export interface ActivityEntry {
  type: string;
  timestamp: number;
  actor: string;
  description: string;
  details?: Record<string, unknown>;
}

export interface IssueTicketStatusHistory {
  status: string;
  changedBy: string | null;
  changedAt: number;
}

export interface IssueTicketTransferHistory {
  from?: string;
  fromName?: string;
  to?: string;
  toName?: string;
  transferredBy?: string;
  reason?: string;
  transferredAt?: number;
}

export interface TransferMember {
  id: string;
  name: string;
  userName: string;
  roleId: number;
  mobileNo?: string;
  trackDivisionId?: string;
}


export interface IssueCategoryItem {
  id?: string;
  category?: string;
  categoryName?: string;
  name?: string;
  subcategories?: string[];
  subCategories?: string[];
}

export interface IssueTicketInterface {
  id: string;
  ticketId: string;
  groupName: string;
  divisionId?: string;
  issueStatus: IssueTicketStatus;
  priority: IssueTicketPriority;
  description?: string;
  summary?: string;
  suggestedAction?: string;
  category?: string;
  tags?: string[];
  message?: string;
  senderName?: string;
  sender?: string;
  context?: string;
  affectedDevices?: string[];
  deviceImei?: string;
  assignedTo?: string;
  assignee?: string;
  assigneeName?: string;
  activeStatus?: boolean;
  isIssue?: boolean;
  sourceMessageId?: string;
  postTime?: number;
  dueDate?: number;
  statusHistory: IssueTicketStatusHistory[];
  transfer_history?: IssueTicketTransferHistory[];
  attachments?: string[];
  comments: IssueTicketComment[];
  createdAt: string;
}

export interface IssueTicketResponseInterface extends SuccessInterface {
  data: IssueTicketInterface[];
}

export const StatusColorMap: Record<IssueTicketStatus, string> = {
  OPEN: "#bb2124",
  IN_PROGRESS: "#F6C203",
  RESOLVED: "#22bb33",
  CLOSED: "#6b7280",
};

export const PriorityColorMap: Record<IssueTicketPriority, string> = {
  HIGH:     "#bb2124",
  MEDIUM:   "#F6C203",
  LOW:      "#22bb33",
  CRITICAL: "#7c3aed",
};
