import { useState } from "react"
import { HirearchyModuleStudentContext } from "./HirearchyModuleStudentContext"
import { IHirearchyCreateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { HirearchyCreateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateInitialStates/HirearchyCreateInitialState";







export const HirearchyModuleStudentProvider = ({children}:any) =>{

    const [hirearchyCreateStudent,setHirearchyCreateStudent] = useState<IHirearchyCreateInterface>(HirearchyCreateInitialState);
    const [hirearchyStudentList,setHirearchyStudentList] = useState<string>('');


    return(
        <HirearchyModuleStudentContext.Provider 
        value={{
            hirearchyCreateStudent,setHirearchyCreateStudent,
            hirearchyStudentList,setHirearchyStudentList
         }}>
            {children}
        </HirearchyModuleStudentContext.Provider>
    )


}