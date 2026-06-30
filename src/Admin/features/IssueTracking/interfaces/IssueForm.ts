export enum IssueStatusEnum{
    OPEN = "OPEN",
    INPROGRESS = "INPROGRESS",
    UNDEROBSERVATION = "UNDEROBSERVATION",
    SOFTCLOSE = "SOFTCLOSE",
    CLOSE = "CLOSE"
}


export enum IssueStatusEnumColor{
    OPEN = "#e4ef07",
    INPROGRESS = "#b10202",
    UNDEROBSERVATION = "#ffcfc9",
    SOFTCLOSE = "#6da80a",
    CLOSE = "#0de513"
}

export enum PriorityEnum{
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}

export interface Comments{
    text:string;
    commentedBy:string;
    commentedAt:number
}

export interface IIssueRequestForm{
    wMsgId?:string;
    groupName:string;
    senderName:string;
    message:string;
    noteId?:string;
    postTime:number;
    isIssue:boolean;
    assignee:string;
    issueStatus:IssueStatusEnum;
    priority:PriorityEnum;
    category: string; // issue
    createdBy:string;
    dueDate:number;
    tags: [string], // "null"
    attachments: null, // null
    comments: Comments[]
}


export interface StatusHistory{
    status: IssueStatusEnum;
    changedBy: string;
    changedAt: number;
}

export interface IssueResponseForm{
    id:string;
    sender:string;
    groupName:string;
    senderName:string;
    message:string;
    noteId:string;
    postTime:number;
    isIssue:boolean;
    issueStatus:IssueStatusEnum;
    priority:PriorityEnum;
    category:string;
    assignee:string;
    comments:Comments[];
    tags:[string];
    attachments:null
    dueDate:number;
    statusHistory:[StatusHistory];
    activeStatus:boolean;
    createdBy:string;
    createdAt:number;
}

