import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface"



export interface IKeyManFileUploadResponseInterface extends SuccessInterface{
    data:{
        result:{
            validRecords:number;
            invalidRecords:number;
            errorDescription: any | null
        }
    }
}


export interface IKyemanBulkUploadResponseInterface extends SuccessInterface{
    data:{
        result:{
            validRecords:number;
            invalidRecords:number;
            errorDescription: any | null
        }
    }
    error:{
        code:number;
        message:string;
    }
}


export interface IKeymanBulkUploadErrorResponseInterface extends SuccessInterface{
    error:{
        code:number,
        message:string
    }
}
