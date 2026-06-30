import { SuccessInterface } from "../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

export interface IBeatUploadJSON{
    divisionId:string,
    deviceImei:string,
    deviceName:string,
    deviceNo:string,
    updatedBy:string,
    updatedAt:string,
    sectionName:string,
    beatId:string,
    activeStatus:boolean,
    startTime:string,
    endTime:string,
    bstartTime:string,
    bendTime:string,
    tstartKm:string,
    tendKm:string,
    deviceTypeId:string,
    sendAutoPeriodCommand:boolean
}

export interface IBeatUploadFileRequest{
    file:any;
    beat:IBeatUploadJSON
}


export interface IBeatUploadResponse extends SuccessInterface{
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