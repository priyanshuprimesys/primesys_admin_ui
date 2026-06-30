import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"
import { IDeviceIssueResponseInterface } from "./DeviceIssueResponseInterface"

export interface IDeviceIssueResponseDetailInterface extends SuccessInterface{
    data: IDeviceIssueResponseInterface[]
}