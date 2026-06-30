import { ColumnDef } from "@tanstack/react-table";
import { DivisionSingleResponse } from "../../../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceResponseInterface";
import { useMemo } from "react";



export const columns = useMemo<ColumnDef<DivisionSingleResponse>[]>(
    () => [
        {
            accessorKey: 'id',
            header: () => <div>Sl No</div>,
            cell: (row) => { ++row.row.index },
            filterFn: 'equalsString',
        },
        {
            accessorKey: 'deviceImei',
            header: () => <div>Imei</div>,
            cell: (info) => info.getValue(),
            filterFn: 'includesStringSensitive',
        },
        {
            id: 'reportTimeMargin',
            accessorFn: (row) => row.reportTimeMargin,
            cell: (info) => info.getValue(),
            header: () => <div>Time Margin</div>,
        },
        {
            id: 'reportDistMargin',
            accessorFn: (row) => row.reportDistMargin,
            cell: (info) => info.getValue(),
            header: () => <div>Dist. Margin</div>,
        },
        {
            id: 'onTrackMargin',
            accessorFn: (row) => row.onTrackMargin,
            cell: (info) => info.getValue(),
            header: () => <div>Track Margin</div>,
        },
        {
            id: 'deviceName',
            accessorFn: (row) => row.deviceName,
            cell: (info) => info.getValue(),
            header: () => <div>Name</div>,
        },
        {
            id: "deviceSimNo",
            accessorFn: (row) => `${row} ${row.deviceSimNo}`,
            header: 'Sim No',
            cell: (info) => info.getValue(),
        },
        {
            id: "deviceSimImeiNo",
            accessorFn: (row) => `${row} ${row.deviceSimImeiNo}`,
            header: 'Device Sim No',
            cell: (info) => info.getValue(),
        },
        {
            id: "deviceNo",
            accessorFn: (row) => `${row} ${row.deviceNo}`,
            header: 'Device No',
            cell: (info) => info.getValue(),
        },
        {
            id: "tripWiseReport",
            accessorFn: (row) => `${row} ${row.tripWiseReport}`,
            header: 'TripWise Report',
            cell: (info) => info.getValue(),
        },
        {
            id: "active_status",
            accessorFn: (row) => `${row} ${row.active_status}`,
            header: 'Active',
            cell: (info) => info.getValue(),
        },
        {
            id: "reportEnable",
            accessorFn: (row) => `${row} ${row.reportEnable}`,
            header: 'Report Enable',
            cell: (info) => info.getValue(),
        },
    ],
    [],
)