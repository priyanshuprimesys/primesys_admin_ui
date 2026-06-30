import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";



export interface ISkippedIssueInterface{
    id: string,
    sender: string,
    groupName: string,
    senderName: string,
    message: string,
    divisionId: string,
    noteId: string,
    postTime: number,
    isIssue: boolean,
    activeStatus: boolean
}

export interface ISkippedIssueDetailInterface extends SuccessInterface{
    data: [ISkippedIssueInterface]
}