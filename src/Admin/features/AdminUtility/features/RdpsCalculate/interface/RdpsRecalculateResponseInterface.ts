import { SuccessInterface } from "../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

export interface IRdpsRecalculateResponseInterface extends SuccessInterface{
    data:{
        result: string
    }
}