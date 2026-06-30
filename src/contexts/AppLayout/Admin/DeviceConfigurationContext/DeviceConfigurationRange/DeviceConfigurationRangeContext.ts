import { createContext } from "react";





interface RangeProps{
    deviceRangeOne: string;
    setDeviceRangeOne: React.Dispatch<React.SetStateAction<string>>;
    deviceRangeTwo: string;
    setDeviceRangeTwo: React.Dispatch<React.SetStateAction<string>>;
}


const defaultRangeProps:RangeProps={
    deviceRangeOne:'',
    setDeviceRangeOne:() => {},
    deviceRangeTwo:'',
    setDeviceRangeTwo:() => {}
}


export const DeviceConfigurationRangeContext = createContext(defaultRangeProps);