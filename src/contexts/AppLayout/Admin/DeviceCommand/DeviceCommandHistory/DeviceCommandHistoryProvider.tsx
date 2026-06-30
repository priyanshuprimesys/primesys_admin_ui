import { useState } from "react"
import { DeviceCommandHistoryContext } from "./DeviceCommandHistoryContext"
import { IDeviceCommandHistoryDetailResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryDetailResponse"
import { DeviceCommandHistoryDetailResponseInitialState } from "../../../../../initialStates/AppInitialStates/DeviceCommandHistoryInitialState/DeviceCommandHistoryDetailResponseInitialState"







export const DeviceCommandHistoryProvider = ({children}:any) =>{

    const getTodayStartTime = ():number =>{
        const todayDate = new Date();
        // const yesterday = new Date(todayDate);
        // yesterday.setDate(todayDate.getDate() - 1);
        // const value = yesterday.setHours(0,0,0,0) / 1000;
        const value = (todayDate.getTime() / 1000) - 3600;
        return Math.floor(value);
    }


    const [deviceCommandHistoryDetailData,setDeviceCommandHistoryDetailData] = useState<IDeviceCommandHistoryDetailResponseInterface>(DeviceCommandHistoryDetailResponseInitialState);
    const [commandStartTime,setCommandStartTime] = useState<number>(getTodayStartTime());
    const [commandEndTime,setCommandEndTime] = useState<number>(getTodayStartTime()+7200);
    const [deviceCommandAutoApiCall,setDeviceCommandAutoApiCall] = useState<boolean>(true);
    const [isDataFetching,setIsDataFetching] = useState<boolean>(false);


    return (
        <DeviceCommandHistoryContext.Provider value={{
            deviceCommandHistoryDetailData,setDeviceCommandHistoryDetailData,
            commandStartTime,setCommandStartTime,
            commandEndTime,setCommandEndTime,
            deviceCommandAutoApiCall,setDeviceCommandAutoApiCall,
            isDataFetching,setIsDataFetching
          }}>
            {children}
        </DeviceCommandHistoryContext.Provider>
    )
}


