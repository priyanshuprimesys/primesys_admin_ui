import { useContext, useState } from "react"
import ParentDataSearchSelect from "../../../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import { useGetStudentDeviceDetailQuery } from "../../../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import InputWithSearch from "../../../../../../../global/components/input/InputWithSearch/InputWithSearch";
import { DeviceInfoContext } from "../context/DeviceInfoContext";




export const DeviceDivisionStudents = () =>{

    const [parentId,setParentId] = useState<string>("");
    const {data} = useGetStudentDeviceDetailQuery(parentId);
    const {setDeviceImei} = useContext(DeviceInfoContext);

    return(
        <div className="flex gap-7">
            <ParentDataSearchSelect setInputData={setParentId} placeHolder="Search Division...." />
            <InputWithSearch 
                dataClear={parentId === "" ? true : false}
                disabled={parentId=== "" ? true : false} 
                setSelectedValue={setDeviceImei} 
                selectedVal="imeiNo" 
                data={data ? data.data.data?.result : []} 
                name="name" 
                placeHolder="Enter Student Name"
            />
        </div>
    )
}