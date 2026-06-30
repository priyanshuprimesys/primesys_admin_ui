import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface DeviceExchangeResponseInterface extends SuccessInterface{
    data:{
        result:string
    }
}