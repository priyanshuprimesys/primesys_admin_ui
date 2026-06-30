import { createContext } from "react";
import { StudentDeviceDetailInitialState } from "../../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";
import { IStudentDeviceDetailsInterface } from "../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";





interface StudentDeviceProps{
    studentDeviceDetail:IStudentDeviceDetailsInterface;
    setStudentDeviceDetail:React.Dispatch<React.SetStateAction<IStudentDeviceDetailsInterface>>;
    isStudentDetailLoading:boolean;
    setIsSutdentLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isStudentDetailSuccess:boolean;
    setIsStudentDetailSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    studentDeviceLoading:boolean;
    setStudentDeviceLoading: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCommand:string;
    setSelectedCommand: React.Dispatch<React.SetStateAction<string>>;
    customCommand:boolean;
    setCustomCommand: React.Dispatch<React.SetStateAction<boolean>>;
    hirearchyDeviceTypeId:string;
    setHirearchyDeviceType: React.Dispatch<React.SetStateAction<string>>;
}



const studentDefaultValue:StudentDeviceProps ={
    studentDeviceDetail:StudentDeviceDetailInitialState,
    setStudentDeviceDetail:() => {},
    isStudentDetailLoading:false,
    setIsSutdentLoading:()=>{},
    isStudentDetailSuccess:false,
    setIsStudentDetailSuccess:() =>{},
    studentDeviceLoading:false,
    setStudentDeviceLoading:() =>{},
    selectedCommand:'',
    setSelectedCommand:() =>{},
    customCommand:false,
    setCustomCommand:() => {},
    hirearchyDeviceTypeId:'',
    setHirearchyDeviceType:()=>{}
}




export const StudentDeviceDetailContext = createContext(studentDefaultValue);