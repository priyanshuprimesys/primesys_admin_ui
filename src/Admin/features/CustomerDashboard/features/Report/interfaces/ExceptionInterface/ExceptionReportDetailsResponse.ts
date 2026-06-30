import { SuccessInterface } from "../../../../interfaces/SuccessInterface";
import { IExceptionReportResponseInterface } from "./ExceptionReportResponseInterface";

export interface IExceptionReportDetailsResponseInterface extends SuccessInterface{
    data:{
        result:IExceptionReportResponseInterface[]
    }
}