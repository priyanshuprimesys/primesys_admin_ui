import { IIssueInterface } from "../interfaces/DeviceIssueInterface";

export const IssueInitialState:IIssueInterface={
    id: "",
    sender: "",
    groupName: "",
    senderName: "",
    message: "",
    noteId: "",
    postTime: 0,
    isIssue: false,
    activeStatus: false,
    divisionId: ""
}