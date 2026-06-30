import { IReportPermissionModule } from "../data/schema";
import React, { useState } from "react";



interface IReportModuleContext {
    reportModule: IReportPermissionModule[] | null,
    setReportModule: React.Dispatch<React.SetStateAction<IReportPermissionModule[] | null>>
}

const ReportModuleContext = React.createContext<IReportModuleContext | null>(null);



export default function ReportModuleProvider({ children }: { children: React.ReactNode }) {

    const [reportModule, setReportModule] = useState<IReportPermissionModule[] | null>(null);

    return (
        <ReportModuleContext.Provider value={{
            reportModule, setReportModule
        }}>
            {children}
        </ReportModuleContext.Provider>
    )
}



export const useReportModule = () => {
    const reportContext = React.useContext(
        ReportModuleContext
    );

    if (!reportContext) {
        throw new Error("useReportModule Context has to be inside ReportModuleContext");
    }
    return reportContext;
}