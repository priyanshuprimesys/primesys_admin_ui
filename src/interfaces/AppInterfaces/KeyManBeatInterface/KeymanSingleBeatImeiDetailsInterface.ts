import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { IKeymanSingleBeatImeiInterface } from "./KeymanSingleBeatImeiInterface";




export interface IKeymanSingleBeatImeiDetailsInterface extends SuccessInterface{
    data:{
        result:[IKeymanSingleBeatImeiInterface]
    },
    error:{
        code:number,
        message:string
    }
}