import { IHirearchyCreateResponseInterface } from "./HirearchyCreateResponseInterface";
import { IHirearchyErrorResponse } from "./HirearchyErrorResponse";






export interface IHirearchySubLoginResponseInterface extends IHirearchyErrorResponse{
    data:{
        result:IHirearchyCreateResponseInterface
    }
}