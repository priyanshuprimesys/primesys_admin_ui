import { IIssueRequestForm, IssueStatusEnum, PriorityEnum, IssueResponseForm } from '../interfaces/IssueForm';

export const IssueRequestFormInitialState: IIssueRequestForm={
    groupName: "",
    senderName: "",
    message: "",
    postTime: Math.floor(new Date().getTime() / 1000),
    assignee: "",
    isIssue: false,
    issueStatus: IssueStatusEnum.OPEN,
    priority: PriorityEnum.HIGH,
    category: "",
    createdBy: "",
    dueDate: Math.floor(new Date().getTime() / 1000 + 86400),
    tags: ["null"],
    attachments: null,
    comments: []
}




export const IssueResponseFormInitialState: IssueResponseForm = {
    id: '',
    sender: '',
    groupName: '',
    senderName: '',
    message: '',
    noteId: '',
    postTime: 0,
    isIssue: false,
    issueStatus: IssueStatusEnum.OPEN,
    priority: PriorityEnum.HIGH,
    category: '',
    assignee: '',
    comments: [],
    tags: [""],
    attachments: null,
    dueDate: 0,
    statusHistory:[
        {
            status: IssueStatusEnum.OPEN ,
            changedBy: "",
            changedAt: 0
        }
    ],
    activeStatus: false,
    createdBy: '',
    createdAt: 0
}