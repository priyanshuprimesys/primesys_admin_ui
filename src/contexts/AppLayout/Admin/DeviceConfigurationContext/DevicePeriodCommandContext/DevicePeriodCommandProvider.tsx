import { useState } from "react"
import { DevicePeriodCommandContext } from "./DevicePeriodCommandContext"











export const DevicePeriodCommandProvider = ({children}:any) =>{

    const [devicePeriodCommand,setDevicePeriodCommnad] = useState<string>('');

    return(
        <DevicePeriodCommandContext.Provider  value={{ devicePeriodCommand,setDevicePeriodCommnad }}>
        {children}
    </DevicePeriodCommandContext.Provider>
    )


}