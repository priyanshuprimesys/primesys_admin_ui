import { createContext } from "react";






interface DeviceCommandProps{
    deviceCommand:string;
    setDeviceCommand: React.Dispatch<React.SetStateAction<string>>;
    periodCommandBool:boolean;
    setPeriodCommandBool: React.Dispatch<React.SetStateAction<boolean>>;
    startTimeOne:string;
    setStartTimeOne: React.Dispatch<React.SetStateAction<string>>;
    endTimeOne:string;
    setEndTimeOne: React.Dispatch<React.SetStateAction<string>>;
    startTimeTwo:string;
    setStartTimeTwo: React.Dispatch<React.SetStateAction<string>>;
    endTimeTwo:string;
    setEndTimeTwo: React.Dispatch<React.SetStateAction<string>>;
    periodCommandNew:string;
    setPeriodCommandNew:React.Dispatch<React.SetStateAction<string>>;
}


const defaultDeviceCommand:DeviceCommandProps ={
    deviceCommand:'',
    setDeviceCommand:() => {},
    periodCommandBool:false,
    setPeriodCommandBool:()=>{},
    startTimeOne:'',
    setStartTimeOne:() =>{},
    endTimeOne:'',
    setEndTimeOne:() =>{},
    startTimeTwo:'',
    setStartTimeTwo:() =>{},
    endTimeTwo:'',
    setEndTimeTwo:() =>{},
    periodCommandNew:'',
    setPeriodCommandNew:() =>{}
}


export const DeviceCommandContext = createContext(defaultDeviceCommand);