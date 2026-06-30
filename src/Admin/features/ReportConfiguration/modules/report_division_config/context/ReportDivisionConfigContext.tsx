import React, { useState } from "react";





interface ReportDivisionConfigType {
    divisionId: string;
    setDivisionId: React.Dispatch<React.SetStateAction<string>>;
    deviceTypeId: number;
    setDeviceTypeId: React.Dispatch<React.SetStateAction<number>>;
    reportDate: number;
    setReportDate: React.Dispatch<React.SetStateAction<number>>;
}


const ReportDivisionConfigContext = React.createContext<ReportDivisionConfigType | null>(null);


export default function ReportDivisionConfigProvider({ children }: { children: React.ReactNode }) {
    const [divisionId, setDivisionId] = useState<string>("");
    const [deviceTypeId, setDeviceTypeId] = useState<number>(0);
    const [reportDate, setReportDate] = useState<number>(0);

    const value: ReportDivisionConfigType = {
        divisionId,
        setDivisionId,
        deviceTypeId,
        setDeviceTypeId,
        reportDate,
        setReportDate
    };

    return (
        <ReportDivisionConfigContext.Provider value={value}>
            {children}
        </ReportDivisionConfigContext.Provider>
    );
}



export const useReportDivisionConfig = () => {
    const context = React.useContext(ReportDivisionConfigContext);
    if (!context) {
        throw new Error("useReportDivisionConfig must be used within a ReportDivisionConfigProvider");
    }
    return context;
};