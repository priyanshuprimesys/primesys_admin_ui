import { SuccessInterface } from "../../../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"


export interface ICommand{
    command: string,
    timestamp: number,
    deliveredMsg: string,
    loginName: string,
    deviceResponse: any,
    deviceResponseTime: any
}


export interface ICommandsInterface{
    latestFnSet: ICommand
    latestFn: ICommand
    latestSosSet: ICommand
    latestSos: ICommand
    latestHbtSet: ICommand
    latestHbt: ICommand
    latestTimerSet: ICommand
    latestTimer: ICommand
    latestPeriodSet: ICommand
    latestPeriod: ICommand
    latestStatus: ICommand
    latestParam: ICommand
}


export interface IDeviceSubInfo{
    deviceImei: number,
    reportTimeMargin: number,
    reportDistMargin: number,
    onTrackMargin: number,
    deviceName: string,
    deviceSimNo: string,
    deviceSimImeiNo: string,
    deviceNo: number,
    reportEnable: boolean
}

export interface ITripInfoInterface{
    startTime: number,
    endTime: number,
    breakStartTime: number,
    breakEndTime: number,
    tripStartKm: number,
    tripEndKm: number,
    sectionName: string,
    approvedStatus: boolean,
    createdAt: number,
    deviceTypeId: number,
    tripNo: number,
    createdBy: string
}

export interface ILocationInterface{
    id: string,
    deviceImei: number,
    geoLocation: {
        type: string,
        coordinates: [
            number,
            number
        ]
    },
    speed: number,
    timestamp: number,
    status: {
        gpsRealTime: number,
        gpsPosition: number,
        lonDirection: string,
        latDirection: string,
        course: number
    },
    satelliteNo: number,
    nearestRdps: {
        geoLocation: {
            type: string,
            coordinates: [
                number,
                number
            ]
        },
        featureDetail: string,
        kilometer: number,
        distance: number,
        distanceDiff: number
    },
    voltageLevel: number,
    gsmSignalStrength: number
}


export interface IDeviceInfoInterface{
    id:string;
    deviceImei:number;
    commands:ICommandsInterface
    deviceInfo: IDeviceSubInfo
    tripInfo: ITripInfoInterface[]
    location: ILocationInterface
    
}



export interface IDeviceInfoDetailResponseInterface extends SuccessInterface{
    data:{
        result: IDeviceInfoInterface
    },
    errors:{
        message:string
    }
}