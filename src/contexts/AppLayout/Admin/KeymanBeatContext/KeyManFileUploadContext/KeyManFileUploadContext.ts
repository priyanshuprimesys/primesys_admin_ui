import { createContext } from "react";
import { IKeymanBeatRequestInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanBeatRequestInterface";
import { KeymanBeatRequestInitialState } from "../../../../../initialStates/AppInitialStates/KeyManBeatInitialState/KeymanBeatRequestInitialState";


interface KeyManUploadProps{
    parentDivisionId:string;
    setParentDivisionId:React.Dispatch<React.SetStateAction<string>>;
    studentDeviceImei:string;
    setStudentDeviceImei:React.Dispatch<React.SetStateAction<string>>;
    studentDeviceType:string;
    setStudentDeviceType:React.Dispatch<React.SetStateAction<string>>;
    beatModuleDetailData:any[];
    setBeatModuleDetailData: React.Dispatch<React.SetStateAction<any[]>>;
    keymanBeatDetailRequest:IKeymanBeatRequestInterface;
    setKeymanBeatDetailRequest: React.Dispatch<React.SetStateAction<IKeymanBeatRequestInterface>>;
    studentDeviceTypeName:string;
    setStudentDeviceTypeName: React.Dispatch<React.SetStateAction<string>>;
    studentDeviceNo:number;
    setStudentDeviceNo: React.Dispatch<React.SetStateAction<number>>;
}


const KeyManUploadDefaultValue:KeyManUploadProps={
    parentDivisionId:'',
    setParentDivisionId:() =>{},
    studentDeviceImei:'',
    setStudentDeviceImei:() => {},
    studentDeviceType:'',
    setStudentDeviceType:() => {},
    beatModuleDetailData:[],
    setBeatModuleDetailData:() => {},
    keymanBeatDetailRequest:KeymanBeatRequestInitialState,
    setKeymanBeatDetailRequest:() => {},
    studentDeviceTypeName:"",
    setStudentDeviceTypeName:() => {},
    studentDeviceNo:0,
    setStudentDeviceNo:()=> {},
}



export const KeyManFileUploadContext = createContext(KeyManUploadDefaultValue);