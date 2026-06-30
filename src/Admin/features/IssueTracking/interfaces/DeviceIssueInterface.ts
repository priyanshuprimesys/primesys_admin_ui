import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

export interface IDeviceIssueInterface extends SuccessInterface{

}



export interface IIssueInterface{
    id: string,
    sender:string,
    groupName: string,
    senderName: string,
    message: string,
    noteId: string,
    postTime: number,
    isIssue: boolean,
    activeStatus: boolean,
    divisionId:string;
}


export interface IMsgInterface{
    id:number,
    sender:string,
    groupName:string,
    senderName:string,
    messageCount:string,
    postTime:number,
    children: IIssueInterface[]
}