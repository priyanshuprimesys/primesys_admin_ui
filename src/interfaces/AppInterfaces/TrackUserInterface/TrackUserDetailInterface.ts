import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { TrackUser } from "./TrackUserInterface";






export interface TrackUserDetailInterface extends SuccessInterface{
    data:{
        result:TrackUser[]
    }
}