import { createContext } from 'react';
import { ExceptionReportDetailsResponseInitialState } from '../../initialState/ExceptionReportInitialState/ExceptionReportDetailResponseInitialState';
import { IExceptionReportDetailsResponseInterface } from '../../interfaces/ExceptionInterface/ExceptionReportDetailsResponse';




interface ExceptionInterface{
    exceptionReportData: IExceptionReportDetailsResponseInterface,
    setExceptionReportData: React.Dispatch<React.SetStateAction<IExceptionReportDetailsResponseInterface>>
}

const defaultValue:ExceptionInterface={
    exceptionReportData: ExceptionReportDetailsResponseInitialState,
    setExceptionReportData:()=> {}
}


export const ExceptionReportContext = createContext(defaultValue);