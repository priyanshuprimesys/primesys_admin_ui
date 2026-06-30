import { IDeviceIssueResponseInterface } from "../interfaces/DeviceIssueResponseInterface";



export const DeviceIssueResponseInitialState:IDeviceIssueResponseInterface={
    id: "",
    sender: "",
    groupName: "",
    senderName: "",
    message: "",
    noteId: "",
    postTime: 0,
    isIssue: false,
    issueStatus: "",
    priority: "",
    category: "",
    assignee: "",
    assigneeName: "",
    previousAssignee: undefined,
    transferHistory: [],
    comments: [{
        id: "",
        text: "",
        commentedBy: "",
        commentedAt: 0
    }],
    tags: [],
    attachments: [],
    dueDate: 0,
    reopenCount: undefined,
    statusHistory: undefined,
    activeStatus: false,
    actionBy: "",
    updatedBy: "",
    updatedAt: 0,
    createdBy: "",
    createdAt: 0,
    divisionId: "",
    commentAuditLogs: undefined,
    updateAuditLogs: undefined,
    deviceImei: undefined,
    wmsgId: undefined
}