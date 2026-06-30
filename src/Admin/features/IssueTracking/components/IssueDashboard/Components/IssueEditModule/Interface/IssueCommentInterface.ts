
export interface IUpdateCommentRequest{
    issueId: string,
    commentId:string,
    updatedText: string,
    updatedBy: string
}





export interface ICommentRequest{
    issueId:string,
    text:string,
    commentedBy:string,
    commentedAt:number
}


export interface IAuditLogs{
    field: string,
    oldValue: string,
    newValue: string,
    updatedBy: string,
    updatedAt: number
}



export interface ICommentResponse{
    id: string,
    sender: string,
    groupName: string,
    senderName: string,
    message: string,
    noteId: string,
    postTime: number,
    isIssue: boolean,
    issueStatus: string,
    priority: string,
    category: string,
    assignee: string,
    assigneeName: string,
    previousAssignee: string,
    transferHistory: [],
    comments: [
        {
            id: string,
            text: string,
            commentedBy: string,
            commentedAt: number
        }
    ],
    tags: [string],
    attachments: [string],
    dueDate: number,
    reopenCount: number,
    statusHistory: [],
    activeStatus: true,
    actionBy: string,
    updatedBy: string,
    updatedAt: number,
    createdBy: string,
    createdAt: number,
    divisionId: string,
    updateAuditLogs: IAuditLogs[]
}


export interface IIssueEditResponse{
    id: string,
    sender: string,
    groupName: string,
    senderName: string,
    message: string,
    noteId: string,
    postTime: number,
    isIssue: boolean,
    issueStatus: string,
    priority: string,
    category: string,
    assignee: string,
    assigneeName: string,
    previousAssignee: string,
    transferHistory: [],
    comments: [
        {
            id: string,
            text: string,
            commentedBy: string,
            commentedAt: number
        }
    ],
    tags: [string],
    attachments: [string],
    dueDate: number,
    reopenCount: number,
    statusHistory: [],
    activeStatus: true,
    actionBy: string,
    updatedBy: string,
    updatedAt: number,
    createdBy: string,
    createdAt: number,
    divisionId: string,
    updateAuditLogs: IAuditLogs[],
    deviceImei: string
}