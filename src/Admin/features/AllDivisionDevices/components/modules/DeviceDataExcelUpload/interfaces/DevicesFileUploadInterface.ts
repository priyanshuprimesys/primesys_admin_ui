import { SuccessInterface } from "../../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"


export interface IDeviceFileUploadInterface{
    file: any,
    updateBy:string
}


export interface IDeviceFileUploadResponse extends SuccessInterface{
    data:{
        result:{
            validRecords: number,
            invalidRecords: number,
            errorDescription: string
        }
    },
    error:{
        message:string
    }
}