import { createContext } from "react";
import { DeviceExchangeResponseInitialState } from "../../../../initialStates/AppInitialStates/DeviceExchangeInitialState/DeivceExchangeResponseInitialState";
import { DeviceExchangeResponseInterface } from "../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceExchangeResponseInterface";





interface DeviceExchangeResponseProps{
    exchangeDataResponse:DeviceExchangeResponseInterface;
    setExchangeDataResponse: React.Dispatch<React.SetStateAction<DeviceExchangeResponseInterface>>;
}


const DeviceExchangeDefaultValue:DeviceExchangeResponseProps ={
    exchangeDataResponse:DeviceExchangeResponseInitialState,
    setExchangeDataResponse:() => {}
}




export const DeviceExchangeResponseContext = createContext(DeviceExchangeDefaultValue);