import { useContext, useEffect } from "react"
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import { HirearchyModuleParentContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext"
import { useGetStudentDeviceDetailQuery } from "../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { useGetDivisionParentId } from "../../../../../api/queries/app/hooks/division-parent-id-api-hooks";
import { StudentDeviceDetailInitialState } from "../../../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";




const HirearchyParentDataSearch = () => {

    const {setHirearchyParentId,hirearchyParentId,setHirearchyParentDetailData} = useContext(HirearchyModuleParentContext);


    const {data,isSuccess,isError} = useGetStudentDeviceDetailQuery(hirearchyParentId);
    const {data:parentData,isSuccess:parentSuccess} = useGetDivisionParentId(hirearchyParentId);
    const {setStudentDeviceDetail} = useContext(StudentDeviceDetailContext);

    useEffect(()=>{
      if(isSuccess)
      {
        setStudentDeviceDetail(data.data);
      }else if(isError)
      {
        setStudentDeviceDetail(StudentDeviceDetailInitialState);
      }
    },[isSuccess,data,isError]);

    useEffect(()=>{
      if(parentSuccess)
      {
        setHirearchyParentDetailData(parentData.data);
      }
    },[parentData,parentSuccess]);


  return (
    <div>
      <ParentDataSearchSelect placeHolder="Search Parent" setInputData={setHirearchyParentId}/>
    </div>
  )
}

export default HirearchyParentDataSearch
