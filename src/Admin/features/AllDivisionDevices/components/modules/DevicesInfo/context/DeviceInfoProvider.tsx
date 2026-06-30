import { useState } from "react"
import { DeviceInfoContext } from "./DeviceInfoContext"




export const DeviceInfoProvider = ({children}:any) =>{

    const [deviceImei,setDeviceImei] = useState<string>("");

    return(
        <DeviceInfoContext.Provider value={{
            deviceImei,setDeviceImei
        }}>
            {children}
        </DeviceInfoContext.Provider>
    )
}