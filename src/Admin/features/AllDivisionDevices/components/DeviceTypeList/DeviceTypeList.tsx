import { useContext } from "react";
import DataTable from "../../../../../global/components/DataTable/DataTable";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface"
import { IDeviceType } from "../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface"
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";






export const DeviceTypeList = () => {

    const { deviceType } = useContext(DeviceTypeContext);

    const columns: DataTableColumnInterface<IDeviceType>[] = [
        {
            accessorKey: "deviceType",
            header: "Device Type",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "deviceTypeId",
            header: "Device Type Id",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "deviceNameStartWith",
            header: "Device Name Start",
            cell: (props) => <>{props.getValue()}</>
        }
    ];


    return (
        <div>
            <DataTable
                additionalHeader={true}
                columns={columns}
                data={deviceType?.data ? deviceType.data.result : []}
                headerClassName="font-semibold py-1"
                bodyClassName="py-2 px-1 text-left font-medium border-b-2 border-b-gray-700"
                tableHeadCss="border-2 text-left border-gray-600 bg-dark text-white"
                tableCss="border-2 border-gray-700"
                headerFilter={true}
            />
        </div>
    )
}