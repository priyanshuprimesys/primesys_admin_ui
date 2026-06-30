import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

export interface IIssuePostResponseInterface extends SuccessInterface{
    data: {
        result: string
    }
}