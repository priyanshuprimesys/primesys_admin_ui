import { useContext, useEffect, useState } from "react"
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import { useGetStudentDeviceDetailQuery } from "../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";





const ParentSearchSelect = () => {
    
    const [parentId,setParentId] = useState<string>('');
    const {setStudentDeviceDetail,setStudentDeviceLoading} = useContext(StudentDeviceDetailContext);



    const {data,isSuccess,isLoading} = useGetStudentDeviceDetailQuery(parentId);

    useEffect(()=>{
      if(isSuccess){
        setStudentDeviceLoading(false);
        setStudentDeviceDetail(data.data);
      }
      if(isLoading){
        setStudentDeviceLoading(isLoading);
      }
    },[isSuccess,data,isLoading]);


  return (
    <div className="w-full">
        <ParentDataSearchSelect
         placeHolder="Select Parent"
         setInputData={setParentId}
         />
    </div>
  )
}

export default ParentSearchSelect
