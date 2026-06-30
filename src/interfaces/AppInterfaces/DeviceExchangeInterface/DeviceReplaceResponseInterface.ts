import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface"


export interface IDeviceReplaceErrorResponseInterface extends SuccessInterface{
    error:{
        code:number;
        message:string
    }
}







export interface IDeviceReplaceResponseInterface extends SuccessInterface{
    data:{
        result:{
            "id": string,
            "deviceImei": number,
            "reportTimeMargin": number,
            "reportDistMargin": number,
            "onTrackMargin": number,
            "shiftType": number,
            "parentId": number,
            "divisionId": string,
            "studentId": string,
            "deviceName": string,
            "lastName": string,
            "deviceSimNo": string,
            "deviceSimImeiNo": any,
            "deviceNo": number,
            "showGoogleAddress": boolean,
            "reportAsIndependentRdps": boolean,
            "version": any,
            "devicePayment": {
                "payment_plan_id": number,
                "device_imei": any,
                "payment_renew_date": number,
                "expiry_date": number,
                "updated_by": any
            },
            "location": any,
            "createdAt": any,
            "lastModified": any,
            "deviceTypeId": number,
            "deviceUserType": string,
            "reportEnable": boolean,
            "trackPids": [],
            "pidUpdate": number,
            "tripWiseReport": boolean
        }
    }
    error:{
        code:number;
        message:string
    }
}