import { useContext, useEffect,} from "react";
import InputWithSearch from "../../../../../global/components/input/InputWithSearch/InputWithSearch"
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import { KeyManFileUploadContext } from "../../../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext";
import { useGetStudentDeviceDetailQuery } from "../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import DeviceTypeSelect from "../DeviceType/DeviceTypeSelect";
import { Button } from "@chakra-ui/react";
import { toast } from "react-toastify";



interface KeymanBeatInterface{
  onHandleClick:()=> void;
}

const KeymanBeatSearch: React.FC<KeymanBeatInterface> = ({onHandleClick}) => {

  const {parentDivisionId,setParentDivisionId,studentDeviceImei,setStudentDeviceNo, setStudentDeviceImei,studentDeviceType,setStudentDeviceType,setStudentDeviceTypeName} = useContext(KeyManFileUploadContext);
  const {data} = useGetStudentDeviceDetailQuery(parentDivisionId);

  useEffect(()=>{
    if(data?.data.success == false){
      toast.error(`${data.data.error.message}`,
        {
          position:"top-right",
        }
      )
      return;
    }
  },[data]);

  useEffect(()=>{
    if(parentDivisionId === "")
    {
      setStudentDeviceType("");
    }
  },[parentDivisionId]);

  
  return (
    <div className="flex items-center justify-between gap-4">
      <ParentDataSearchSelect placeHolder="Enter Parent Name" setInputData={setParentDivisionId} />
      <InputWithSearch 
      dataClear={parentDivisionId === "" ? true : false}
       setDeviceNo={setStudentDeviceNo} 
       setAdditonalSelectData={setStudentDeviceTypeName} 
       disabled={parentDivisionId=== "" ? true : studentDeviceType === "" ? false : true} 
       setSelectedValue={setStudentDeviceImei} 
       selectedVal="imeiNo" 
       data={data ? data.data.data?.result : []} 
       name="name" 
       placeHolder="Enter Student Name"
        />
      <DeviceTypeSelect disabled={parentDivisionId === "" ? true : studentDeviceImei != "" ? true : false} setSelectValue={setStudentDeviceType} />
      <Button disabled={parentDivisionId === "" ? true : studentDeviceImei != "" || studentDeviceType != "" ?  false :true} onClick={onHandleClick} className="overflow-hidden !w-1/2 !bg-dark !text-white ">
        Get Beat
      </Button>
    </div>
  )
}

export default KeymanBeatSearch
