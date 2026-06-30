import { createContext } from "react";
import { IStudentDeviceDetailsInterface } from "../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";
import { StudentDeviceDetailInitialState } from "../../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";







interface DeviceStudentProps{
    studentDeviceOne:string;
    studentDeviceSecond:string;
    setStudentDeviceOne: React.Dispatch<React.SetStateAction<string>>;
    setStudentDeviceSecond: React.Dispatch<React.SetStateAction<string>>;
    studentDeviceOneName:string;
    studentDeviceSecondName:string;
    setStudentDeviceOneName: React.Dispatch<React.SetStateAction<string>>;
    setStudentDeviceSecondName: React.Dispatch<React.SetStateAction<string>>;
    divisionStudentDevices:IStudentDeviceDetailsInterface;
    setDivisionStudentDevices: React.Dispatch<React.SetStateAction<IStudentDeviceDetailsInterface>>;
    studentDeviceId:string;
    setStudentDeviceId: React.Dispatch<React.SetStateAction<string>>;
}



const DeviceStudentDefaultValue:DeviceStudentProps ={
    studentDeviceOne:'',
    studentDeviceSecond:'',
    setStudentDeviceOne:() => {},
    setStudentDeviceSecond:() => {},
    studentDeviceOneName:'',
    studentDeviceSecondName:'',
    setStudentDeviceOneName:() => {},
    setStudentDeviceSecondName:() =>{},
    divisionStudentDevices: StudentDeviceDetailInitialState,
    setDivisionStudentDevices:() =>{},
    studentDeviceId:'',
    setStudentDeviceId:() =>{}
}


export const DeviceExchangeStudentContext = createContext(DeviceStudentDefaultValue);