import { createContext } from "react";
import { DivisionRdpsResponseInitialState } from "../../../../initialStates/AppInitialStates/DivisionRdpsInitialState/DivisionRdpsResponseInitialState";
import { IDivisionRdpsResponseInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";




interface DivisionRdpsInterface{
    divisionRdpsData:IDivisionRdpsResponseInterface,
    setDivisionRdpsData: React.Dispatch<React.SetStateAction<IDivisionRdpsResponseInterface>>
}


const defaultValue:DivisionRdpsInterface={
    divisionRdpsData: DivisionRdpsResponseInitialState,
    setDivisionRdpsData:() => {}
}


export const DivisionRdpsContext = createContext(defaultValue);