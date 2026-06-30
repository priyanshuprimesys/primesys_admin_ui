import { createContext } from "react";






interface DevicePeriodProps{
    devicePeriodCommand:string;
    setDevicePeriodCommnad: React.Dispatch<React.SetStateAction<string>>;
}



const periodDefaultValue:DevicePeriodProps ={
    devicePeriodCommand:'',
    setDevicePeriodCommnad:() => {}
}


export const DevicePeriodCommandContext = createContext(periodDefaultValue);