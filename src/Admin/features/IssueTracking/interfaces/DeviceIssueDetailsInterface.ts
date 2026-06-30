import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";
import { IIssueInterface } from "./DeviceIssueInterface";

export interface IDeviceIssueDetailsInterface extends SuccessInterface {
    data: IIssueInterface[]
}