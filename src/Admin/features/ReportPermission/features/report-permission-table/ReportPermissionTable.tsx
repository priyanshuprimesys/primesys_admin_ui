import DataTable from "../../../../../global/components/DataTable/DataTable";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { Switch } from '@chakra-ui/react'
import { IReportPermissionModule } from "../../data/schema";
import { useReportModule } from "../../contexts/report-permission-moudle-context";
import { TiTick } from "react-icons/ti";
import { useReportModuleMutation } from "../../data/queryOptions";
import { useContext } from "react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";


const ReportPermissionTable = ({ divisionId }: { divisionId: string }) => {

    const { reportModule } = useReportModule();
    const { userDetail } = useContext(UserDetailContext);
    const { mutate, isPending } = useReportModuleMutation();

    const handleReportModule = (e: React.ChangeEvent<HTMLInputElement>, row: any) => {
        const { checked } = e.target;
        if (checked) {
            const moduleList: string[] = reportModule?.filter((item) => item.active).map(item => item.id) ?? [];
            moduleList?.push(row.id);
            mutate({
                divisionId: divisionId,
                modulesList: moduleList,
                modifiedBy: userDetail.data.result.userName
            })
        } else if (!checked) {
            const moduleList: string[] = reportModule?.filter((item) => item.active).map(item => item.id).filter((item) => item !== row.id) ?? [];
            mutate({
                divisionId: divisionId,
                modulesList: moduleList,
                modifiedBy: userDetail.data.result.userName
            })
        }
    }


    const columns: DataTableColumnInterface<IReportPermissionModule>[] = [
        {
            accessorKey: "moduleName",
            header: "Module Name"
        },
        {
            accessorKey: "displayName",
            header: "Report Name",
        },
        {
            accessorKey: "displayOrder",
            header: "Display Order"
        },
        {
            accessorKey: "subModules",
            header: "Sub Modules",
            cell: (props) => <span>{props.getValue() === null ? "Null" : <TiTick color="green" size={18} />}</span>
        },
        {
            accessorKey: "active",
            header: "Active",
            cell: (props) => <><Switch disabled={isPending} size={'md'} onChange={(e) => handleReportModule(e, props.row.original)} isChecked={props.getValue()} /></>
        },
    ]

    return (
        <>
            <DataTable
                columns={columns}
                data={reportModule ? reportModule : []}
                tableHeadCss="border-2 border-primaryDark"
                headerClassName="px-4 text-left text-sm font-semibold"
                tableBodyCss="border-2 px-2 border-primaryDark"
                bodyClassName="text-left px-4 py-1 text-xs border-b-[1px] border-b-gray-800"
            />
        </>
    )
}


export default ReportPermissionTable;