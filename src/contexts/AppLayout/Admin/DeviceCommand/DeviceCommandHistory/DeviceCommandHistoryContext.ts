import { createContext } from "react";
import { DeviceCommandHistoryDetailResponseInitialState } from "../../../../../initialStates/AppInitialStates/DeviceCommandHistoryInitialState/DeviceCommandHistoryDetailResponseInitialState";
import { IDeviceCommandHistoryDetailResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryDetailResponse";



interface DeviceCommandProps{
    deviceCommandHistoryDetailData:IDeviceCommandHistoryDetailResponseInterface;
    setDeviceCommandHistoryDetailData: React.Dispatch<React.SetStateAction<IDeviceCommandHistoryDetailResponseInterface>>;
    commandStartTime:number;
    setCommandStartTime:React.Dispatch<React.SetStateAction<number>>;
    commandEndTime:number;
    setCommandEndTime: React.Dispatch<React.SetStateAction<number>>;
    deviceCommandAutoApiCall:boolean;
    setDeviceCommandAutoApiCall: React.Dispatch<React.SetStateAction<boolean>>;
    isDataFetching:boolean;
    setIsDataFetching: React.Dispatch<React.SetStateAction<boolean>>;
}



const defaultDeviceCommandValue:DeviceCommandProps={
    deviceCommandHistoryDetailData:DeviceCommandHistoryDetailResponseInitialState,
    setDeviceCommandHistoryDetailData:()=>{},
    commandStartTime:0,
    setCommandStartTime:()=>{},
    commandEndTime:0,
    setCommandEndTime:()=>{},
    deviceCommandAutoApiCall:true,
    setDeviceCommandAutoApiCall:() =>{},
    isDataFetching:false,
    setIsDataFetching:() =>{}
}



export const DeviceCommandHistoryContext = createContext(defaultDeviceCommandValue);