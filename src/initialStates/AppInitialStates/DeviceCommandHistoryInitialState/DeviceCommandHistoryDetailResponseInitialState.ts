import { IDeviceCommandHistoryDetailResponseInterface } from "../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryDetailResponse";
import { DeviceCommandHistoryReponseIntialState } from "./DeviceCommandHistoryResponseInitialState";




export const DeviceCommandHistoryDetailResponseInitialState:IDeviceCommandHistoryDetailResponseInterface={
    data:{
        result:[DeviceCommandHistoryReponseIntialState]
    },
    success:false
}