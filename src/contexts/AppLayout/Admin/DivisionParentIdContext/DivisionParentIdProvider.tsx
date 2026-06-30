import { useState } from "react"
import { DivisionParentIdContext } from "./DivisionParentIdContext"
import { IDivisionParentIdDetailInterface } from "../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdDetailInterface";
import { DivisionParentIdDetailInitialState } from "../../../../initialStates/AppInitialStates/DivisionParentIdInitialState/DivisionParentIdDetailInitialState";










export const DivisionParentIdProvider = ({ children }: any) => {

    const [divisionParentIdDetail, setDivisionParentIdDetail] = useState<IDivisionParentIdDetailInterface>(DivisionParentIdDetailInitialState);
    const [parentDivisionId,setParentDivisionId] = useState<string>('');

    return (
        <DivisionParentIdContext.Provider value={{ divisionParentIdDetail,setDivisionParentIdDetail,parentDivisionId,setParentDivisionId }}>
            {children}
        </DivisionParentIdContext.Provider>
    )



}