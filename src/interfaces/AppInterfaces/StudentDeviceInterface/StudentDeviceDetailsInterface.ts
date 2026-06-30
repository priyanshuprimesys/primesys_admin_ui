import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";
import { IStudentDevice } from "./StudentDeviceInterface";




export interface IStudentDeviceDetailsInterface extends SuccessInterface{
    data:{
        result:IStudentDevice[]
    },
    error: {
        code: number,
        message: string
    }
}


