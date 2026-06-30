import { useState } from "react"
import { DeviceCommandContext } from "./DeviceCommandContext"








export const DeviceCommandProvider = ({children}:any) =>{

    const [deviceCommand,setDeviceCommand] = useState<string>('');
    const [periodCommandBool,setPeriodCommandBool] = useState<boolean>(false);
    const [startTimeOne,setStartTimeOne] = useState<string>('');
    const [endTimeOne,setEndTimeOne] = useState<string>('');
    const [startTimeTwo,setStartTimeTwo] = useState<string>('');
    const [endTimeTwo,setEndTimeTwo] = useState<string>('');
    const [periodCommandNew,setPeriodCommandNew] = useState<string>('');

    return(
        <DeviceCommandContext.Provider value={{ 
            deviceCommand,setDeviceCommand,
            periodCommandBool,setPeriodCommandBool,
            startTimeOne,setStartTimeOne,
            endTimeOne,setEndTimeOne,
            startTimeTwo,setStartTimeTwo,
            endTimeTwo,setEndTimeTwo,
            periodCommandNew,setPeriodCommandNew }}>
            {children}
        </DeviceCommandContext.Provider>
    )
}