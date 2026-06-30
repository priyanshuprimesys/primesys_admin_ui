import { createContext } from "react";


interface DivisionCountInterface{
    allDeviceCount:number;
    setAllDeviceCount: React.Dispatch<React.SetStateAction<number>>;
    OnDeviceCount:number;
    setOnDeviceCount: React.Dispatch<React.SetStateAction<number>>;
    OnTodayDeviceCount:number;
    setOnTodayDeviceCount: React.Dispatch<React.SetStateAction<number>>;
    OffTodayDeviceCount:number;
    setOffTodayDeviceCount: React.Dispatch<React.SetStateAction<number>>;
    OffLast48DeviceCount:number;
    setOffLast48DeviceCount: React.Dispatch<React.SetStateAction<number>>;
}


const DivisionDefaultValue:DivisionCountInterface={
    allDeviceCount: 0,
    setAllDeviceCount: () => { },
    OnDeviceCount: 0,
    setOnDeviceCount: () => { },
    OnTodayDeviceCount: 0,
    setOnTodayDeviceCount: () => { },
    OffTodayDeviceCount: 0,
    setOffTodayDeviceCount: () => { },
    OffLast48DeviceCount: 0,
    setOffLast48DeviceCount: () => { },
}


export const DivisionDeviceCountContext = createContext(DivisionDefaultValue);