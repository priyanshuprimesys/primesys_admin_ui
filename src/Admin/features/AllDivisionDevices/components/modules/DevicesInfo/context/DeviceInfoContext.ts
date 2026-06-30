import { createContext } from "react"




interface DeviceInfo{
    deviceImei:string
    setDeviceImei: React.Dispatch<React.SetStateAction<string>>
}

const defaultValue:DeviceInfo={
    deviceImei:"",
    setDeviceImei:()=>{}
}


export const DeviceInfoContext = createContext(defaultValue);