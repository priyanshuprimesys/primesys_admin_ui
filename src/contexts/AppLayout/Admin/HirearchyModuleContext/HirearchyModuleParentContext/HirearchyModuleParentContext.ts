import { createContext } from "react";
import { IDivisionParentIdDetailInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdDetailInterface";
import { DivisionParentIdDetailInitialState } from "../../../../../initialStates/AppInitialStates/DivisionParentIdInitialState/DivisionParentIdDetailInitialState";







interface HirearchyProps{
    hirearchyParentId:string;
    setHirearchyParentId:React.Dispatch<React.SetStateAction<string>>;
    hirearchyParentDetailData:IDivisionParentIdDetailInterface;
    setHirearchyParentDetailData: React.Dispatch<React.SetStateAction<IDivisionParentIdDetailInterface>>
}


const defaultHirearchyValue:HirearchyProps={
    hirearchyParentId:'',
    setHirearchyParentId:() => {},
    hirearchyParentDetailData:DivisionParentIdDetailInitialState,
    setHirearchyParentDetailData:()=>{}
}



export const HirearchyModuleParentContext = createContext(defaultHirearchyValue);