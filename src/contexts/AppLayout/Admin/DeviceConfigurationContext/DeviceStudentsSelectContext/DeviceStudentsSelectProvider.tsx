import { useState } from "react"
import { DeviceStudentSelectContext } from "./DeviceStudentsSelectContext"
import { IDeviceCommandRequestBulkInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandRequestInterface/DeviceCommandRequestBulkInterface";
import { DeviceCommandRequestInitialState } from "../../../../../initialStates/AppInitialStates/DeviceCommandRequestInitialState/DeviceCommandRequestInitialState";






export const DeviceStudentSelectProvider = ({children}:any) =>{

    const [studentSelectedDevices,setStudentSelectedDevices] = useState<IDeviceCommandRequestBulkInterface>(DeviceCommandRequestInitialState);
    const [selectAllStudent,setSelectAllStudent] = useState<boolean>(false);
    const [studentActive,setStudentActive] = useState<string>("all");
    const [studentTypeId,setStudentTypeId] = useState<string>('0');
    const [filteredStudent,setFilteredStudent] = useState<any[]>([]);

    return(
        <DeviceStudentSelectContext.Provider 
        value={{ studentSelectedDevices,setStudentSelectedDevices,
            selectAllStudent,setSelectAllStudent,studentActive,setStudentActive,
            studentTypeId,setStudentTypeId,filteredStudent,setFilteredStudent
         }}>
            {children}
        </DeviceStudentSelectContext.Provider>
    )
}