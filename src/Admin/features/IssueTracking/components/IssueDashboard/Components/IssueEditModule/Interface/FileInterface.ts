import { SuccessInterface } from "../../../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";



export interface IUploadRequest{
    file: File,
    updatedBy:string
}


export interface IUploadFileResponse extends SuccessInterface{
    data:{
        result: string
    },
    errors:{
        message:string
    }
}