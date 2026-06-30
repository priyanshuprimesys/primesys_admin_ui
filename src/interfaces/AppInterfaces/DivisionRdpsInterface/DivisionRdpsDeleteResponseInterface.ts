import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IDivisionRdpsDeleteResponseInterface extends SuccessInterface{
    data:{
        result:string
    }
}