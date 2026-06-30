import { useState } from "react"
import { DeviceConfigurationRangeContext } from "./DeviceConfigurationRangeContext"

const DeviceConfigurationRangeProvider = ({children}:any) => {

  const [deviceRangeOne,setDeviceRangeOne] = useState<string>('');
  const [deviceRangeTwo,setDeviceRangeTwo] = useState<string>('');

  return (
    <>
      <DeviceConfigurationRangeContext.Provider value={{ 
        deviceRangeOne,setDeviceRangeOne,deviceRangeTwo,setDeviceRangeTwo
       }}>
        {children}
      </DeviceConfigurationRangeContext.Provider>
    </>
  )
}

export default DeviceConfigurationRangeProvider
