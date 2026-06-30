import { useState } from 'react';
import { CustomerReportModuleContext } from './CustomerReportModuleContext';
import { ReportModuleDetailInterface } from '../../interfaces/ReportModuleInterface/ReportModuleDetailInterface';
import { ReportModuleDetailInitialState } from '../../initialState/ReportModuleInitialState/ReportModuleDetailInitialState';





const CustomerReportModuleProvider = ({children}:any) =>{

    const [reportModule,setReportModule] = useState<ReportModuleDetailInterface>(ReportModuleDetailInitialState);


    return(
        <CustomerReportModuleContext.Provider value={{
            reportModule,setReportModule
        }}>
            {children}
        </CustomerReportModuleContext.Provider>
    )
}

export default CustomerReportModuleProvider;