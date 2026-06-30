import { SuccessInterface } from "../../SuccessResponseInterface/SuccessInterface"
import { IDeviceCommandHistoryResponseInterface } from "./DeviceCommandHistoryResponseInterface"






export interface IDeviceCommandHistoryDetailResponseInterface extends SuccessInterface{
    data:{
        result:[IDeviceCommandHistoryResponseInterface]
    }
}