import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

export interface IRestoreInterface{
    issueId:string;
    userId:string;
}


export interface IRestoreResponse extends SuccessInterface{
    data:{
        result:string
    }
}