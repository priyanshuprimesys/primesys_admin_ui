import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { IDeviceCommandInterface } from "./DeviceCommandInterface";






export interface IDeviceCommandDetailInterface extends SuccessInterface{
    data:{
        result:IDeviceCommandInterface[]
    }
}