import { createContext } from "react";
import {IStudentDeviceDetailsInterface } from "../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";
import { StudentDeviceDetailInitialState } from "../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";





interface DeviceDetailProps{
    deviceDetails:IStudentDeviceDetailsInterface;
    setDeviceDetail: React.Dispatch<React.SetStateAction<IStudentDeviceDetailsInterface>>;
    filteredDeviceList:IStudentDeviceDetailsInterface;
    setFilteredDeviceList: React.Dispatch<React.SetStateAction<IStudentDeviceDetailsInterface>>;
}



const DeviceDetailDefaultValue:DeviceDetailProps ={
    deviceDetails:StudentDeviceDetailInitialState,
    setDeviceDetail:() =>{},
    filteredDeviceList:StudentDeviceDetailInitialState,
    setFilteredDeviceList:() =>{}
}




export const DeviceDetailContext = createContext(DeviceDetailDefaultValue);