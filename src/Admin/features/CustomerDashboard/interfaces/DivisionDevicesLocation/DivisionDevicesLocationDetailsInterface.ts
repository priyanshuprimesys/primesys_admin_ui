import { SuccessInterface } from "../SuccessInterface";
import { IDivisionDevicesLocationInterface } from "./DivisionDevicesLocationInterface";

export interface IDivisionDevicesLocationDetailsInterface extends SuccessInterface{
    data:{
        result:IDivisionDevicesLocationInterface[]
    }
}