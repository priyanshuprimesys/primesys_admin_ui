import { useState } from "react"
import { DeviceExchangeStudentContext } from "./DeviceExchangeStudentContext"
import { StudentDeviceDetailInitialState } from "../../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";
import { IStudentDeviceDetailsInterface } from "../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";










const DeviceExchangeStudentProvider = ({children}:any) => {

    const [studentDeviceOne,setStudentDeviceOne] = useState<string>('');
    const [studentDeviceSecond,setStudentDeviceSecond] = useState<string>('');
    const [studentDeviceOneName,setStudentDeviceOneName] = useState<string>('');
    const [studentDeviceSecondName,setStudentDeviceSecondName] = useState<string>('');
    const [divisionStudentDevices,setDivisionStudentDevices] = useState<IStudentDeviceDetailsInterface>(StudentDeviceDetailInitialState);
    const [studentDeviceId,setStudentDeviceId] = useState<string>('');


  return (
    <DeviceExchangeStudentContext.Provider 
    value={{ 
      studentDeviceOne,studentDeviceSecond,
      setStudentDeviceOne,setStudentDeviceSecond,
      studentDeviceOneName,studentDeviceSecondName,
      setStudentDeviceOneName,setStudentDeviceSecondName,
      divisionStudentDevices,setDivisionStudentDevices,
      studentDeviceId,setStudentDeviceId }}>
      {children}
    </DeviceExchangeStudentContext.Provider>
  )
}

export default DeviceExchangeStudentProvider
