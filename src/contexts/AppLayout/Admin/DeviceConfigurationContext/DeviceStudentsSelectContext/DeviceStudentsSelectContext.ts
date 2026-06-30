import { createContext } from "react";
import { IDeviceCommandRequestBulkInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandRequestInterface/DeviceCommandRequestBulkInterface";
import { DeviceCommandRequestInitialState } from "../../../../../initialStates/AppInitialStates/DeviceCommandRequestInitialState/DeviceCommandRequestInitialState";








interface DeviceStudentsProps{
    studentSelectedDevices:IDeviceCommandRequestBulkInterface;
    selectAllStudent:boolean;
    studentActive:string;
    studentTypeId:string;
    filteredStudent:any[];
    setStudentSelectedDevices: React.Dispatch<React.SetStateAction<IDeviceCommandRequestBulkInterface>>;
    setSelectAllStudent: React.Dispatch<React.SetStateAction<boolean>>;
    setStudentActive:React.Dispatch<React.SetStateAction<string>>;
    setStudentTypeId:React.Dispatch<React.SetStateAction<string>>;
    setFilteredStudent: React.Dispatch<React.SetStateAction<any[]>>;
}


const defaultDeviceStudentValue:DeviceStudentsProps ={
    studentSelectedDevices:DeviceCommandRequestInitialState,
    selectAllStudent:false,
    studentActive:"all",
    studentTypeId:'0',
    filteredStudent:[],
    setStudentSelectedDevices:() =>{},
    setSelectAllStudent:()=>{},
    setStudentActive:() => {},
    setStudentTypeId:()=>{},
    setFilteredStudent:() =>{}
}


export const DeviceStudentSelectContext = createContext(defaultDeviceStudentValue);