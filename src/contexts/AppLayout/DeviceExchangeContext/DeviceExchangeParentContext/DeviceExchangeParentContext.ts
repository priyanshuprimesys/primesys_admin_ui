import { createContext } from "react";






interface DeviceParentProps{
    isDeviceParentIdValid:boolean;
    setIsDeviceParentIdValid: React.Dispatch<React.SetStateAction<boolean>>;
    parentDeviceName:string;
    setParentDeviceName: React.Dispatch<React.SetStateAction<string>>;
}



const DeviceParentDefaultValue:DeviceParentProps ={
    isDeviceParentIdValid:false,
    setIsDeviceParentIdValid:() =>{},
    parentDeviceName:'',
    setParentDeviceName:()=> {}
}



export const DeviceExchangeParentContext = createContext(DeviceParentDefaultValue);