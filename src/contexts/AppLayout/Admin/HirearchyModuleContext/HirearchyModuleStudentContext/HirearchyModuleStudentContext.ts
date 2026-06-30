import { createContext } from "react";
import { IHirearchyCreateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { HirearchyCreateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateInitialStates/HirearchyCreateInitialState";






interface HirearchyStudentProps{
    hirearchyCreateStudent:IHirearchyCreateInterface;
    setHirearchyCreateStudent:React.Dispatch<React.SetStateAction<IHirearchyCreateInterface>>;
    hirearchyStudentList:string;
    setHirearchyStudentList: React.Dispatch<React.SetStateAction<string>>;
}



const defaultHirearchyValue:HirearchyStudentProps={
    hirearchyCreateStudent:HirearchyCreateInitialState,
    setHirearchyCreateStudent:() => {},
    hirearchyStudentList:'',
    setHirearchyStudentList:() => {}
}



export const HirearchyModuleStudentContext = createContext(defaultHirearchyValue);