import { IDeviceCommandHistoryResponseInterface } from "../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryResponseInterface";




export const DeviceCommandHistoryReponseIntialState:IDeviceCommandHistoryResponseInterface={
    deviceName:'',
    deviceImei: 0,
    command: "",
    commandDeliveredMsg: "",
    deviceCommandResponse: "",
    timestamp: 0,
    deviceResponseTime: 0,
    loginName: "",
    resend: false
}