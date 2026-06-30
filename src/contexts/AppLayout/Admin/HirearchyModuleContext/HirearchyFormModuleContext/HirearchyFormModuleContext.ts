import { createContext, MutableRefObject } from "react";
import { IHirearchyCreateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { HirearchyCreateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateInitialStates/HirearchyCreateInitialState";
import { IHirearchySubLoginResponseInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchySubLoginResponseInterface";
import { HirearchySubLoginResponseInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateResponse/HirearchySubLoginResponseInitialState";








interface FormModuleProps {
    hirearchyNameRef: MutableRefObject<HTMLInputElement | null>;
    hirearchyEmailRef: MutableRefObject<HTMLInputElement | null>;
    hirearchyShortNameRef: MutableRefObject<HTMLInputElement | null>;
    hirearchyDeparmentId: string;
    setHirearchyDeparmentId: React.Dispatch<React.SetStateAction<string>>;
    hirearchyDepartmentParentId: string;
    setHirearchyDepartmentParentId: React.Dispatch<React.SetStateAction<string>>;
    hireachyMobileNumberRef: MutableRefObject<HTMLInputElement | null>;
    hirearchyStudentListRef: MutableRefObject<string>;
    hirearchyCreateForm: IHirearchyCreateInterface;
    setHirearchyCreateForm: React.Dispatch<React.SetStateAction<IHirearchyCreateInterface>>;
    hirearchyCreateFormRef: MutableRefObject<IHirearchyCreateInterface>;
    refetchTableData:boolean;
    setRefetchTableData: React.Dispatch<React.SetStateAction<boolean>>;
    hirearchyCreateResponse: IHirearchySubLoginResponseInterface;
    setHirearchyCreateResponse: React.Dispatch<React.SetStateAction<IHirearchySubLoginResponseInterface>>;
}


const FormModuleDefaultValue: FormModuleProps = {
    hirearchyNameRef: { current: null },
    hirearchyEmailRef: { current: null },
    hirearchyShortNameRef:{current:null},
    hirearchyDeparmentId: '',
    setHirearchyDeparmentId:()=>{},
    hirearchyDepartmentParentId: '',
    setHirearchyDepartmentParentId:() =>{},
    hireachyMobileNumberRef:{current:null},
    hirearchyStudentListRef: { current: '' },
    hirearchyCreateForm: HirearchyCreateInitialState,
    setHirearchyCreateForm: () => { },
    hirearchyCreateFormRef:{current:HirearchyCreateInitialState},
    refetchTableData:false,
    setRefetchTableData:() =>{},
    hirearchyCreateResponse:HirearchySubLoginResponseInitialState,
    setHirearchyCreateResponse:() => {}
}




export const HirearchyFormModuleContext = createContext(FormModuleDefaultValue);