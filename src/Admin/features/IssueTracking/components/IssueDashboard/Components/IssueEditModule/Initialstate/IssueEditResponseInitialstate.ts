import { IIssueEditResponse } from "../Interface/IssueCommentInterface";


export const IssueEditResponseInitialState: IIssueEditResponse={
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
    previousAssignee: "",
    transferHistory: [],
    comments: [{
        id: "",
        text: "",
        commentedBy: "",
        commentedAt: 0
    }],
    tags: [""],
    attachments: [""],
    dueDate: 0,
    reopenCount: 0,
    statusHistory: [],
    activeStatus: true,
    actionBy: "",
    updatedBy: "",
    updatedAt: 0,
    createdBy: "",
    createdAt: 0,
    divisionId: "",
    updateAuditLogs: [],
    deviceImei: ""
}