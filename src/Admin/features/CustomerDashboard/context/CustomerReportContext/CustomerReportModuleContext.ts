import { createContext } from "react";
import { ReportModuleDetailInitialState } from "../../initialState/ReportModuleInitialState/ReportModuleDetailInitialState";
import { ReportModuleDetailInterface } from "../../interfaces/ReportModuleInterface/ReportModuleDetailInterface";





interface ReportModuleInterface{
    reportModule: ReportModuleDetailInterface;
    setReportModule: React.Dispatch<React.SetStateAction<ReportModuleDetailInterface>>;
}

const ReportModuleValue:ReportModuleInterface = {
    reportModule:ReportModuleDetailInitialState,
    setReportModule:() => {}
}



export const CustomerReportModuleContext = createContext(ReportModuleValue);