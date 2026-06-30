import { useState } from "react"
import { DeviceExchangeParentContext } from "./DeviceExchangeParentContext"











const DeviceExchangeParentProvider = ({children}:any) => {

    const [isDeviceParentIdValid,setIsDeviceParentIdValid] = useState<boolean>(false);
    const [parentDeviceName,setParentDeviceName] = useState<string>('');


  return (
    <DeviceExchangeParentContext.Provider value={{ isDeviceParentIdValid,setIsDeviceParentIdValid,parentDeviceName,setParentDeviceName }}>
      {children}
    </DeviceExchangeParentContext.Provider>
  )
}

export default DeviceExchangeParentProvider
