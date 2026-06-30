import { IStudentDeviceDetailsInterface } from "../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";
import { StudentDeviceInitialState } from "./StudentDeviceInitialState";



export const StudentDeviceDetailInitialState:IStudentDeviceDetailsInterface ={
    data: {
        result: [StudentDeviceInitialState]
    },
    success: false,
    error: {
        code: 0,
        message: ""
    }
}