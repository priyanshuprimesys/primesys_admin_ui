import React, { useState } from "react";
import { ReportConfigSummaryResult } from "../data/schema";





interface ReportConfigType {
    reportConfigData: ReportConfigSummaryResult | null;
    setReportConfigData: React.Dispatch<React.SetStateAction<ReportConfigSummaryResult | null>>,
    parentId: string;
    setParentId: React.Dispatch<React.SetStateAction<string>>
}

const ReportConfigContext = React.createContext<ReportConfigType | null>(null);

interface Props { children?: React.ReactNode; }

export default function ReportConfigProvider({ children }: Props) {
    const [reportConfigData, setReportConfigData] = useState<ReportConfigSummaryResult | null>(null);
    const [parentId, setParentId] = useState("");
    return (
        <ReportConfigContext.Provider value={{ setReportConfigData, reportConfigData, parentId, setParentId }}>
            {children}
        </ReportConfigContext.Provider>
    );
}


export const useReportConfig = () => {
    const reportConfigContext = React.useContext(ReportConfigContext);
    if (!reportConfigContext) {
        throw new Error("useReportConfig must be used within a ReportConfigProvider");
    }
    return reportConfigContext;
}

