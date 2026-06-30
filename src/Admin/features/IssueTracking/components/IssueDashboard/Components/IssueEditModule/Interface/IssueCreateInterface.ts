import { SuccessInterface } from "../../../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"


export interface ICommentInterface{
    id:string,
    text: string,
    commentedBy: string,
    commentedAt: number
}


export interface ICreateIssueInterface{
    wMsgId: string,
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
    comments: ICommentInterface[],
    tags: string[],
    attachments: string[],
    dueDate: number,
    createdBy: string,
    divisionId: string,
    deviceImei: number
}



export interface IIssueCreateResponse{
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
    assigneeName:string,
    comments: [
        {
            "id": string,
            "text": string,
            "commentedBy": string,
            "commentedAt": number
        }
    ],
    tags: [
        string
    ],
    attachments: [],
    dueDate: number,
    statusHistory: [
        {
            "status": string,
            "changedBy": string,
            "changedAt": number
        }
    ],
    activeStatus: boolean,
    createdBy: string,
    createdAt: number,
    divisionId: string
}

export interface ICreateResponseDetail extends SuccessInterface{
    data:{
        result: IIssueCreateResponse
    },
    errors:{
        message: string
    }
}