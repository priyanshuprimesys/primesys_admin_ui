import { useContext, useEffect, useState } from "react";
import ReportPermissionTable from "./features/report-permission-table/ReportPermissionTable";
import { DivisionLoginTrackUsersContext } from "../../../contexts/AppLayout/Admin/DivisionLoginTrackUsersContext/DivisionLoginTrackUsersContext";
import { useReportModule } from "./contexts/report-permission-moudle-context";
import { useGetReportModules, useGetReportPermission } from "./data/report-permission-query";
import { IReportPermissionModule } from "./data/schema";
import ReportPermissionDivisionSelect from "./components/ReportPermissionDivisionSelect";



const ReportPermission = () => {

    const { data } = useGetReportModules();

    const [divisionId, setDivisionId] = useState<string>("");
    const { divisionLoginTrackUserDetails } = useContext(DivisionLoginTrackUsersContext);
    const { setReportModule } = useReportModule();
    // const { data: allDivisions, isSuccess } = useGetAllDivisions();
    const { data: reportPermission, isSuccess } = useGetReportPermission(divisionId);


    useEffect(() => {
        if (reportPermission?.data.data.result && divisionId && data?.data && isSuccess) {
            const reportModuleList = reportPermission.data.data.result.moduleList;
            const reportModuleArr: IReportPermissionModule[] = [];
            data.data.forEach((module) => {
                const moduleObj = reportModuleList?.some((item) => item === module.id);
                const report: IReportPermissionModule = {
                    id: module.id,
                    moduleName: module.moduleName,
                    displayName: module.displayName,
                    displayOrder: module.displayOrder,
                    subModules: module.subModules,
                    active: moduleObj
                };
                reportModuleArr.push(report);
            });
            setReportModule(reportModuleArr);
        }
        else if (divisionId == "") {
            setReportModule(null);
        }
    }, [divisionLoginTrackUserDetails, divisionId, isSuccess, reportPermission]);



    return (
        <div>
            <div>
                <ReportPermissionDivisionSelect setInputData={setDivisionId} placeHolder="Search Division......." />
            </div>

            <div className="mt-6">
                <ReportPermissionTable divisionId={divisionId} />
            </div>
        </div>
    )
}


export default ReportPermission;