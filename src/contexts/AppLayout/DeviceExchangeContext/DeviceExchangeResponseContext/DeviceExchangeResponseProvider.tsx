import { useState } from "react"
import { DeviceExchangeResponseInitialState } from "../../../../initialStates/AppInitialStates/DeviceExchangeInitialState/DeivceExchangeResponseInitialState";
import { DeviceExchangeResponseInterface } from "../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceExchangeResponseInterface";
import { DeviceExchangeResponseContext } from "./DeviceExchangeResponseContext";












const DeviceExchangeResponseProvider = ({children}:any) => {

    const [exchangeDataResponse,setExchangeDataResponse] = useState<DeviceExchangeResponseInterface>(DeviceExchangeResponseInitialState);


  return (
    <>
      <DeviceExchangeResponseContext.Provider value={{ exchangeDataResponse,setExchangeDataResponse }}>
            {children}
      </DeviceExchangeResponseContext.Provider>
    </>
  )
}

export default DeviceExchangeResponseProvider
