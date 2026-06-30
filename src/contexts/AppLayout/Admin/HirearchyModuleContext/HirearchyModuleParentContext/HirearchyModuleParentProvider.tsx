import { useState } from "react"
import { HirearchyModuleParentContext } from "./HirearchyModuleParentContext"
import { IDivisionParentIdDetailInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdDetailInterface";
import { DivisionParentIdDetailInitialState } from "../../../../../initialStates/AppInitialStates/DivisionParentIdInitialState/DivisionParentIdDetailInitialState";










export const HirearchyModuleParentProvider = ({children}:any) =>{

    const [hirearchyParentId,setHirearchyParentId] = useState<string>('');
    const [hirearchyParentDetailData,setHirearchyParentDetailData] = useState<IDivisionParentIdDetailInterface>(DivisionParentIdDetailInitialState)

    return(
        <HirearchyModuleParentContext.Provider value={{ 
            hirearchyParentId,setHirearchyParentId,
            hirearchyParentDetailData,setHirearchyParentDetailData
             }}>
            {children}
        </HirearchyModuleParentContext.Provider>
    )
}