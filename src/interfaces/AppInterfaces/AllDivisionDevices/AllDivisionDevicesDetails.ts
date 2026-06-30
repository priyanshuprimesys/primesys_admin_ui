import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { IAllDivisionDeviceInterface } from "./AllDivisionDeviceInterface";



export interface IAllDivisionDevicesDetailsInterface extends SuccessInterface{
    data:{
        result:[IAllDivisionDeviceInterface]
    }
}