import { createContext } from "react";
import { IDivisionRdpsResponseInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";





interface IRdpsInterface{
    rdpsData: IDivisionRdpsResponseInterface | null,
    setRdpsData: React.Dispatch<React.SetStateAction<IDivisionRdpsResponseInterface | null>>,
    rdpsApiLoading: boolean,
    setRdpsApiLoading: React.Dispatch<React.SetStateAction<boolean>>
}


const defaultRdps: IRdpsInterface = {
    rdpsData: null,
    setRdpsData:() => {},
    rdpsApiLoading: false,
    setRdpsApiLoading:() =>{}
}


export const RdpsContext = createContext<IRdpsInterface>(defaultRdps);