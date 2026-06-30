import { useState } from "react"
import { ExceptionReportContext } from "./ExceptionReportContext"
import { IExceptionReportDetailsResponseInterface } from "../../interfaces/ExceptionInterface/ExceptionReportDetailsResponse"
import { ExceptionReportDetailsResponseInitialState } from "../../initialState/ExceptionReportInitialState/ExceptionReportDetailResponseInitialState"






export const ExceptionReportProvider = ({children}:any) => {

    const [exceptionReportData,setExceptionReportData] = useState<IExceptionReportDetailsResponseInterface>(ExceptionReportDetailsResponseInitialState);

    return (
        <ExceptionReportContext.Provider value={{
            exceptionReportData,setExceptionReportData
        }}>
        {children}
        </ExceptionReportContext.Provider>
    )
}