import { useState } from "react";
import { DivisionDeviceCountContext } from "./DivisionDeviceCountContext";







const DivisionDeviceCountProvider = ({children}:any)=>{
    const [OnDeviceCount,setOnDeviceCount] = useState<number>(0);
    const [allDeviceCount,setAllDeviceCount] = useState<number>(0);
    const [OnTodayDeviceCount,setOnTodayDeviceCount] = useState<number>(0);
    const [OffLast48DeviceCount,setOffLast48DeviceCount] = useState<number>(0);
    const [OffTodayDeviceCount,setOffTodayDeviceCount] = useState<number>(0);

    return(
        <DivisionDeviceCountContext.Provider value={{
            OnDeviceCount,setOnDeviceCount,
            OnTodayDeviceCount,setOnTodayDeviceCount,
            OffLast48DeviceCount, setOffLast48DeviceCount,
            OffTodayDeviceCount,setOffTodayDeviceCount,
            allDeviceCount,setAllDeviceCount
        }}>
            {children}
        </DivisionDeviceCountContext.Provider>
    )
}


export default DivisionDeviceCountProvider;