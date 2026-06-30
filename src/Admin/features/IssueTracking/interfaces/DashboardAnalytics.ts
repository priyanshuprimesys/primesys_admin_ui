import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"

export interface IPriorityResponse{
    priority: string,
    status: string,
    count: number
}



export interface IAnalyticsContent{
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
    comments: [],
    tags: [],
    attachments: [],
    dueDate: number,
    statusHistory: [
        {
            status: string,
            changedBy: string,
            changedAt: number
        }
    ],
    activeStatus: boolean,
    createdBy: string,
    createdAt: number,
    divisionId: string,
    deviceImei: string
}




export interface IDashboardAnalytics{
    global_issue_status: {
        SOFTCLOSE: number,
        CLOSE: number,
        UNDEROBSERVATION: number,
        INPROGRESS: number,
        OPEN: number
    },
    global_priority: {
        HIGH: number,
        MEDIUM: number,
        LOW: number
    },
    global_category: [],
    global_tags: [],
    user_issue_status: {
        SOFTCLOSE: number,
        CLOSE: number,
        UNDEROBSERVATION: number,
        INPROGRESS: number,
        OPEN: number
    },
    user_priority: {
        HIGH: number,
        MEDIUM: number,
        LOW: number
    },
    user_category: [],
    user_tags: [],
    filter_issue_count: [],
    combination_counts: [],
    raw_issues: []
}


export interface IDashboardAnalyticsResponse extends SuccessInterface{
    data:{
        result: IDashboardAnalytics
    }
}


export interface IDashboardRequestInterface{
    startEpoch?: number;
    endEpoch?: number;
    trendMode?:string;
    assigneeId:string;
    page:number;
    size: number;
}