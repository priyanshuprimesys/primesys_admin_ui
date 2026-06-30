import { useContext, useEffect, useState } from "react"
import { DeviceDetailContext } from "./DeviceDetailContext"
import { IStudentDeviceDetailsInterface } from "../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";
import { DeviceExchangeStudentContext } from "../DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";
import { StudentDeviceDetailInitialState } from "../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";










const DeviceDetailProvider = ({children}:any) => {

    const [deviceDetails,setDeviceDetail] = useState<IStudentDeviceDetailsInterface>(StudentDeviceDetailInitialState);
    const [filteredDeviceList,setFilteredDeviceList] = useState<IStudentDeviceDetailsInterface>(StudentDeviceDetailInitialState);
    const {studentDeviceOne,studentDeviceSecond} = useContext(DeviceExchangeStudentContext);


    useEffect(()=>{
        

        if(studentDeviceOne != ''){
            const updatedDetails = {
                ...deviceDetails,
                data:{
                    result: deviceDetails.data.result.filter((item)=> {
                        if(item.deviceId != studentDeviceOne)return item;
                    })
                }
            }
            setFilteredDeviceList(updatedDetails);
        }
        if(studentDeviceSecond != ''){
            const updatedDetails = {
                ...deviceDetails,
                data:{
                    result: deviceDetails.data.result.filter((item)=> {
                        if(item.deviceId != studentDeviceSecond)return item;
                    })
                }
            }
            setFilteredDeviceList(updatedDetails);
        }
        if(studentDeviceOne == '' && studentDeviceSecond == ''){
            setFilteredDeviceList(deviceDetails);
        }
    },[studentDeviceOne,studentDeviceSecond]);


  return (
    <DeviceDetailContext.Provider value={{ deviceDetails,setDeviceDetail,filteredDeviceList,setFilteredDeviceList }}>
      {children}
    </DeviceDetailContext.Provider>
  )
}

export default DeviceDetailProvider
