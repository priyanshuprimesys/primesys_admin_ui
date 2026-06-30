import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"

export interface IDeviceIssueByIdInterface {
    ticketId?: string,
    actionBy: string,
    activeStatus: boolean,
    createdAt: number,
    createdBy: string,
    groupName: string,
    id: string,
    isIssue: boolean,
    message: string,
    noteId: string
    postTime: number,
    sender: string,
    senderName: string,
    updatedAt: number,
    wmsgId: string
}




export interface IDeviceIssueDetailsByIdInterface extends SuccessInterface{
    data: IDeviceIssueByIdInterface[]
}