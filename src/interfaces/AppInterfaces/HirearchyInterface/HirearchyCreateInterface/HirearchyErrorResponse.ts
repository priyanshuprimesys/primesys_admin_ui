import { SuccessInterface } from "../../SuccessResponseInterface/SuccessInterface"





export interface IHirearchyErrorResponse extends SuccessInterface{
    error:{
        code:number,
        message:string
    }
}