import {useContext, useEffect, useState } from "react";
import { useGetDeviceDetailsQuery } from "../../../../../api/queries/app/hooks/devices-detail-hooks";
import { useGetTrackUserQuery } from "../../../../../api/queries/app/hooks/track-user-api-hooks";
import InputWithSearchParent from "../InputBox/InputWithSearch/InputWithSearchParent";
import InputWithSearchStudent from "../InputBox/InputWithSearch/InputWithSearchStudent";
import { DeviceExchangeStudentContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";
import { DeviceDetailContext } from "../../../../../contexts/AppLayout/DeviceDetailContext/DeviceDetailContext";
import { StudentDeviceDetailInitialState } from "../../../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";
import { useToast } from "@chakra-ui/react";

const DeviceSearchHeader = () => {

  const [divisionId,setDivisionId] = useState<string>('');
  const {setStudentDeviceOne,setStudentDeviceSecond,setStudentDeviceOneName,setStudentDeviceSecondName,setDivisionStudentDevices} = useContext(DeviceExchangeStudentContext);
  const {setDeviceDetail,setFilteredDeviceList} = useContext(DeviceDetailContext);

  const {data}  = useGetTrackUserQuery();
  const {data:divisionDeviceData,isSuccess} = useGetDeviceDetailsQuery(divisionId);
  const toast = useToast();

  useEffect(()=>{
    if(isSuccess){
      setDeviceDetail(divisionDeviceData.data);
      setFilteredDeviceList(divisionDeviceData.data);
      setDivisionStudentDevices(divisionDeviceData.data);
    }else{
      setDivisionStudentDevices(StudentDeviceDetailInitialState);
    }
  },[divisionDeviceData]);

  useEffect(()=>{
    if(divisionDeviceData?.data.error){
      toast({
        title:"Device Error",
        description: divisionDeviceData.data.error.message,
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
  },[divisionDeviceData])



  const handleDivisionId = (division:string)=>{
    setDivisionId(division);
  }

 


  return (
    <div>
      <div className="w-full mb-4">
      <InputWithSearchParent 
       trackUserData={data?.data} 
       placeHolder="Enter Parent Name" 
       setDivisionId={handleDivisionId}/>
      </div>

    <div className="flex gap-6">
    <InputWithSearchStudent 
       placeHolder="Enter Old Device" 
       setStudentDeviceId={setStudentDeviceOne}
       setStudentDeviceName={setStudentDeviceOneName}  />

       <InputWithSearchStudent 
       placeHolder="Enter New Device" 
       setStudentDeviceId={setStudentDeviceSecond}
       setStudentDeviceName={setStudentDeviceSecondName}  />
    </div>

    </div>
  )
}

export default DeviceSearchHeader;
