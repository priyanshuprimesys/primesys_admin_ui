import { SuccessInterface } from "../../SuccessResponseInterface/SuccessInterface"
import { IDivisionParentIdInterface } from "./DivisionParentIdInterface"





export interface IDivisionParentIdDetailInterface extends SuccessInterface{
    data:{
        result:[IDivisionParentIdInterface]
    }
}