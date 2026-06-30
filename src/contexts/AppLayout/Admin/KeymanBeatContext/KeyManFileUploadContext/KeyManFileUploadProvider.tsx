import { useState } from "react"
import { KeyManFileUploadContext } from "./KeyManFileUploadContext"
import { IKeymanBeatRequestInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanBeatRequestInterface";
import { KeymanBeatRequestInitialState } from "../../../../../initialStates/AppInitialStates/KeyManBeatInitialState/KeymanBeatRequestInitialState";

const KeyManFileUploadProvider = ({children}:any) => {
    const [parentDivisionId,setParentDivisionId] = useState<string>('');
    const [studentDeviceImei,setStudentDeviceImei] = useState<string>('');
    const [studentDeviceType,setStudentDeviceType] = useState<string>('');
    const [keymanBeatDetailRequest,setKeymanBeatDetailRequest] = useState<IKeymanBeatRequestInterface>(KeymanBeatRequestInitialState);
    const [studentDeviceTypeName,setStudentDeviceTypeName] = useState<string>("");
    const [studentDeviceNo,setStudentDeviceNo] = useState<number>(0);
    const[beatModuleDetailData,setBeatModuleDetailData] = useState<any[]>([])


  return (
    <KeyManFileUploadContext.Provider value={{ 
        parentDivisionId,setParentDivisionId,
        studentDeviceImei,setStudentDeviceImei,
        studentDeviceType,setStudentDeviceType,
        keymanBeatDetailRequest,setKeymanBeatDetailRequest,
        studentDeviceTypeName,setStudentDeviceTypeName,
        studentDeviceNo,setStudentDeviceNo,
        beatModuleDetailData,setBeatModuleDetailData
     }}>
      {children}
    </KeyManFileUploadContext.Provider>
  )
}

export default KeyManFileUploadProvider;
