import { SuccessInterface } from "../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"




export interface IBeatDestroyResponse extends SuccessInterface {
    error: {
        code: number,
        message: string
    }
}