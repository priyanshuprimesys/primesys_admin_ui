import { useState } from "react"
import { DivisionRdpsContext } from "./DivisionRdpsContext"
import { IDivisionRdpsResponseInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface"
import { DivisionRdpsResponseInitialState } from "../../../../initialStates/AppInitialStates/DivisionRdpsInitialState/DivisionRdpsResponseInitialState"

export const DivisionRdpsProvider = ({children}:any) => {

    const [divisionRdpsData,setDivisionRdpsData] = useState<IDivisionRdpsResponseInterface>(DivisionRdpsResponseInitialState);

  return (
    <DivisionRdpsContext.Provider value={{
        divisionRdpsData,setDivisionRdpsData
    }}>
        {children}
    </DivisionRdpsContext.Provider>
  )
}
