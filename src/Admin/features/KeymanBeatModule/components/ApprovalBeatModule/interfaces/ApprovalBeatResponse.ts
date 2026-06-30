import { SuccessInterface } from "../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"


export interface IApprovalBeats{
    id: string,
    startTime: number,
    endTime: number,
    breakStartTime: number,
    breakEndTime: number,
    tripStartKm: number,
    tripEndKm: number,
    sectionName: string,
    seasonId: null,
    activeStatus: boolean,
    approvedStatus: boolean,
    approvedBy: null,
    studentId: null,
    deviceImei: number,
    deviceNo: number,
    version: null,
    createdAt: number,
    updatedAt: null,
    shiftType: number,
    deviceTypeId: number,
    tripNo: number,
    device_name: string,
    refFileName: string,
    createdBy: string,
    updatedBy: null,
    tripTime: number,
    tstart_time: number,
    tendTime: number,
    tshiftType: number
}

export interface IApprovalBeatDevice{
    deviceImei: string,
    beats: IApprovalBeats[]
}

export interface IApprovalBeatDivision{
    refFileName:string,
    devices: IApprovalBeatDevice[],
    createdAt:number
}

export interface IApprovalBeatResponse extends SuccessInterface{
    data:{
        result: IApprovalBeatDivision[]
    },
    error:{
        code:number,
        message:string
    }
}