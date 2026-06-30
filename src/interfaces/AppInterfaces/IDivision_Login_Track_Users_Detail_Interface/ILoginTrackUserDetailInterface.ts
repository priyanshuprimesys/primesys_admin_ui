import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { ILoginTrackUserInterface } from "./ILoginTrackUserInterface";





export interface ILoginTrackUserDetailInterface extends SuccessInterface{
    data:{
        result:ILoginTrackUserInterface[]
    }
}