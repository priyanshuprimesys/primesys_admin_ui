import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface RdpsResponseInterface extends SuccessInterface{
    data:{
        result:string;
    }
}