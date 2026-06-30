export interface SkipMessageInterface {
  id: string;
  sender: string;
  groupName: string;
  senderName: string;
  message: string;
  divisionId: string;
  noteId: string;
  postTime: number;
  isIssue: boolean;
  activeStatus: boolean;
  converted?: boolean;
  convertedTicketId?: string;
  convertedBy?: string;
  convertedAt?: number;
}
