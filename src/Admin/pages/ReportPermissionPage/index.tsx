import ReportModuleProvider from "../../features/ReportPermission/contexts/report-permission-moudle-context"
import ReportPermission from "../../features/ReportPermission/ReportPermission"


export const ReportPermissionPage = () =>{
    return(
        <ReportModuleProvider>
            <ReportPermission/>
        </ReportModuleProvider>
    )
}