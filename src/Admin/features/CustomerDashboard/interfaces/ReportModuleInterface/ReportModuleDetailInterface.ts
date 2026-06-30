import { SuccessInterface } from "../SuccessInterface"
import { ReportModuleInterface } from "./ReportModuleInterface"

export interface ReportModuleDetailInterface extends SuccessInterface{
    data:{
        result:ReportModuleInterface[]
    }
}