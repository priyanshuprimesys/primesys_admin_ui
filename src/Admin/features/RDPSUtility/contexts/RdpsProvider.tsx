import { useState } from "react"
import { RdpsContext } from "./RdpsContext"
import { IDivisionRdpsResponseInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";










export const RdpsProvider = ({children}:{children:any}) =>{

    const [rdpsData,setRdpsData] = useState<IDivisionRdpsResponseInterface | null>(null);
    const [rdpsApiLoading,setRdpsApiLoading] = useState<boolean>(false);

    return(
        <RdpsContext.Provider value={{
            rdpsData,setRdpsData,
            rdpsApiLoading,setRdpsApiLoading
        }}>
            {children}
        </RdpsContext.Provider>
    )
}