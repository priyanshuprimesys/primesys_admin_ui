import { useRef, useState } from "react"
import { HirearchyFormModuleContext } from "./HirearchyFormModuleContext"
import { IHirearchyCreateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { HirearchyCreateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateInitialStates/HirearchyCreateInitialState";
import { IHirearchySubLoginResponseInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchySubLoginResponseInterface";
import { HirearchySubLoginResponseInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateResponse/HirearchySubLoginResponseInitialState";












export const HireachyFormModuleProvider = ({children}:any) => {

    const hirearchyNameRef = useRef<HTMLInputElement | null>(null);  
    const hirearchyShortNameRef = useRef<HTMLInputElement | null>(null);  
    const hirearchyEmailRef = useRef<HTMLInputElement | null>(null);
    const hireachyMobileNumberRef = useRef<HTMLInputElement | null>(null);
    const hirearchyStudentListRef = useRef<string>('');
    const hirearchyCreateFormRef = useRef<IHirearchyCreateInterface>(HirearchyCreateInitialState);
    const [hirearchyDeparmentId,setHirearchyDeparmentId] = useState<string>('');
    const [hirearchyDepartmentParentId,setHirearchyDepartmentParentId] = useState<string>('');
    const [hirearchyCreateForm,setHirearchyCreateForm] = useState<IHirearchyCreateInterface>(HirearchyCreateInitialState);
    const [refetchTableData,setRefetchTableData] = useState<boolean>(false);
    const [hirearchyCreateResponse,setHirearchyCreateResponse] = useState<IHirearchySubLoginResponseInterface>(HirearchySubLoginResponseInitialState)


    return(
        <HirearchyFormModuleContext.Provider value={{
            hirearchyNameRef,
            hirearchyEmailRef,
            hirearchyShortNameRef,
            hireachyMobileNumberRef,
            hirearchyDeparmentId,setHirearchyDeparmentId,
            hirearchyDepartmentParentId,setHirearchyDepartmentParentId,
            hirearchyStudentListRef,
            hirearchyCreateForm,setHirearchyCreateForm,
            hirearchyCreateFormRef,
            refetchTableData,setRefetchTableData,
            hirearchyCreateResponse,setHirearchyCreateResponse
          }}>
            {children}
        </HirearchyFormModuleContext.Provider>
    )
}