import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { IKeymanSingleDivisionIdInterface } from "./KeymanSingleDivisionIdInterface";





export interface IKeymanSingleDivisionIdDetailsInterface extends SuccessInterface{
    data:{
        result:[IKeymanSingleDivisionIdInterface]
    },
    error:{
        code:number;
        message:string
    }
}