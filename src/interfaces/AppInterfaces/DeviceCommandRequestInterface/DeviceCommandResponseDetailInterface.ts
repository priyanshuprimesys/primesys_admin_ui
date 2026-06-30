import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { IDeviceCommandSendResponse } from "./DeviceCommandResponseInterface";






export interface IDeviceCommandResponseDetailInteface extends SuccessInterface{
    data:{
        result:[IDeviceCommandSendResponse]
    }
}