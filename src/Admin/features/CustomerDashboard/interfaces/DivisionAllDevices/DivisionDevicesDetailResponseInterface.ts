import { SuccessInterface } from "../SuccessInterface";
import { IDivisionDevicesInterface } from "./DivisionDevicesInterface";

export interface IDivisionDevicesDetailResponseInterface extends SuccessInterface{
    data:{
        result:IDivisionDevicesInterface[]
    }
}