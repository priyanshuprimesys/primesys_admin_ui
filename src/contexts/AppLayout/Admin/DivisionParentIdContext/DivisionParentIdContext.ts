import { createContext } from "react";
import { IDivisionParentIdDetailInterface } from "../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdDetailInterface";
import { DivisionParentIdDetailInitialState } from "../../../../initialStates/AppInitialStates/DivisionParentIdInitialState/DivisionParentIdDetailInitialState";






interface DivisionIdProps{
    parentDivisionId:string;
    setParentDivisionId:React.Dispatch<React.SetStateAction<string>>;
    divisionParentIdDetail:IDivisionParentIdDetailInterface;
    setDivisionParentIdDetail: React.Dispatch<React.SetStateAction<IDivisionParentIdDetailInterface>>;
}


const defaultDivisionValue:DivisionIdProps ={
    parentDivisionId:'',
    setParentDivisionId:()=>{},
    divisionParentIdDetail:DivisionParentIdDetailInitialState,
    setDivisionParentIdDetail:() =>{}
}



export const DivisionParentIdContext = createContext(defaultDivisionValue);