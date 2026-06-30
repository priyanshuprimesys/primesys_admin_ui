



export interface IDeviceCommandHistoryResponseInterface{
    deviceName:string;
    deviceImei: number,
    command: string,
    commandDeliveredMsg: string,
    deviceCommandResponse: string,
    timestamp: number,
    deviceResponseTime: number,
    loginName: string,
    resend: boolean
}