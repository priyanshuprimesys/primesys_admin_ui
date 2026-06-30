import { useState } from "react"
import { StudentDeviceDetailContext } from "./StudentDeviceDetailContext"
import { IStudentDeviceDetailsInterface } from "../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface"
import { StudentDeviceDetailInitialState } from "../../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState"







export const StudentDeviceDetailProvider = ({children}:any) => {

    const [studentDeviceDetail,setStudentDeviceDetail] = useState<IStudentDeviceDetailsInterface>(StudentDeviceDetailInitialState);
    const [studentDeviceLoading,setStudentDeviceLoading] = useState<boolean>(false);
    const [selectedCommand,setSelectedCommand] = useState<string>('');
    const [customCommand,setCustomCommand] = useState<boolean>(false);
    const [isStudentDetailLoading,setIsSutdentLoading] = useState<boolean>(false);
    const [isStudentDetailSuccess,setIsStudentDetailSuccess] = useState<boolean>(false);
    const [hirearchyDeviceTypeId,setHirearchyDeviceType] = useState<string>('');


    return(
        <StudentDeviceDetailContext.Provider 
        value={{ studentDeviceDetail,setStudentDeviceDetail,
            studentDeviceLoading,setStudentDeviceLoading,
            selectedCommand,setSelectedCommand,
            customCommand,setCustomCommand,
            isStudentDetailLoading,setIsSutdentLoading,
            isStudentDetailSuccess,setIsStudentDetailSuccess,
            hirearchyDeviceTypeId,setHirearchyDeviceType
         }}>
            {children}
        </StudentDeviceDetailContext.Provider>
    )
}