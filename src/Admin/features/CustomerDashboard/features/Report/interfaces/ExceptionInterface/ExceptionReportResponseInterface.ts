import { IExceptionTripReportResponseInterface } from "./ExceptionTripReportResponse";

export interface IExceptionReportResponseInterface{
    tripStartKm: number;
    tripEndKm: number;
    tripStartTime: number;
    tripEndTime: number;
    tripAvgSpeed: number;
    tripMaxSpeed:number;
    distanceCoverTrip: number;
    tripDistanceTobeCoverKm: number;
    reportOfTheDay: number;
    actualStartTime: number;
    actualEndTime: number;
    deviceImei: number;
    deviceName: string;
    allocatedTrips: number;
    actualTrips: number;
    deviceNo:number;
    sectionName:string;
    remark: string;
    tripList: IExceptionTripReportResponseInterface[];
}