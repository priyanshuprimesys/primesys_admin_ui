import { useContext, useMemo, useState } from "react";
import DataTable from "../../../../../global/components/DataTable/DataTable";
import { IAdminDevicesInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDeviceInterface";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { AdminDevicesContext } from "../../../../../contexts/AppLayout/AdminDevicesContext/AdminDevicesContext";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import DeviceTypeDistribution from "../DeviceTypeDistribution/DeviceTypeDistribution";
import { copyToClipboard } from "../../../../../utils/clipboard/copyToClipboard";

const AllDivisionDevices = () => {
    const { adminDevices } = useContext(AdminDevicesContext);
    const { deviceType }   = useContext(DeviceTypeContext);

    const [search,     setSearch]     = useState("");
    const [typeFilter, setTypeFilter] = useState<number | "all">("all");

    const allRows = adminDevices?.data?.result ?? [];

    const getTypeName = (id: number): string =>
        deviceType?.data.result.find(d => d.deviceTypeId === id)?.deviceType ?? `Type ${id}`;

    const filtered = useMemo(() => {
        let data = allRows;
        if (typeFilter !== "all") data = data.filter(x => x.deviceTypeId === typeFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(x =>
                x.name?.toLowerCase().includes(q)         ||
                String(x.imeiNo).includes(q)              ||
                x.divisionName?.toLowerCase().includes(q) ||
                x.simNo?.toLowerCase().includes(q)
            );
        }
        return data;
    }, [allRows, typeFilter, search]);

    /* stats */
    const stats = useMemo(() => {
        const byType = new Map<number, number>();
        allRows.forEach(d => byType.set(d.deviceTypeId, (byType.get(d.deviceTypeId) ?? 0) + 1));
        return { total: allRows.length, byType };
    }, [allRows]);

    /* unique device types in data */
    const typeOptions = useMemo(() =>
        [...new Map(allRows.map(d => [d.deviceTypeId, getTypeName(d.deviceTypeId)])).entries()]
            .sort((a, b) => a[0] - b[0]),
        [allRows, deviceType]
    );

    /* distribution for donut chart */
    const distribution = useMemo(() =>
        [...stats.byType.entries()].map(([id, count]) => ({ name: getTypeName(id), count })),
        [stats, deviceType]
    );

    const columns: DataTableColumnInterface<IAdminDevicesInterface>[] = [
        {
            accessorKey: "name",
            size: 13,
            header: "Device Name",
            cell: (props) => <span className="font-medium">{props.getValue() as string}</span>,
        },
        {
            accessorKey: "imeiNo",
            size: 17,
            header: "IMEI No",
            cell: (props) => {
                const imei = props.getValue() as number;
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs">{imei}</span>
                        <button onClick={e => { e.stopPropagation(); copyToClipboard(String(imei)); }}
                            title="Copy IMEI" className="text-gray-400 hover:text-gray-700 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                );
            },
        },
        {
            accessorKey: "simNo",
            size: 14,
            header: "Sim No",
            cell: (props) => <>{props.getValue()}</>,
        },
        {
            accessorKey: "version",
            size: 9,
            header: "Device Version",
            cell: (props) => {
                const v = (props.row.original as any).deviceVersion ?? props.getValue();
                return v ? <span className="text-xs">{v as string}</span> : <span className="text-gray-400">—</span>;
            },
        },
        {
            accessorKey: "simServiceProvider",
            size: 9,
            header: "SIM Provider",
            cell: (props) => {
                const p = props.getValue() as string;
                return p ? <span className="text-xs">{p}</span> : <span className="text-gray-400">—</span>;
            },
        },
        {
            accessorKey: "deviceSimImeiNo",
            size: 17,
            header: "SIM IMSI No",
            cell: (props) => {
                const imsi = props.getValue() as string;
                if (!imsi) return <span className="text-gray-400">—</span>;
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs">{imsi}</span>
                        <button onClick={e => { e.stopPropagation(); copyToClipboard(String(imsi)); }}
                            title="Copy SIM IMSI" className="text-gray-400 hover:text-gray-700 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                );
            },
        },
        {
            accessorKey: "deviceTypeId",
            size: 10,
            header: "Device Type",
            cell: (props) => {
                const id  = props.getValue() as number;
                const name = getTypeName(id);
                const cls =
                    id === 1 ? "bg-blue-100 text-blue-700"     :
                    id === 2 ? "bg-purple-100 text-purple-700"  :
                    id === 3 ? "bg-amber-100 text-amber-700"    :
                    id === 4 ? "bg-pink-100 text-pink-700"      :
                    id === 5 ? "bg-teal-100 text-teal-700"      :
                    id === 6 ? "bg-indigo-100 text-indigo-700"  :
                    id === 7 ? "bg-orange-100 text-orange-700"  :
                               "bg-gray-100 text-gray-600";
                return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cls}`}>{name}</span>;
            },
        },
        {
            accessorKey: "deviceNo",
            size: 6,
            header: "Device No.",
            cell: (props) => <>{props.getValue()}</>,
        },
        {
            accessorKey: "divisionName",
            size: 15,
            header: "Division Name",
            cell: (props) => <span className="font-medium text-sm">{props.getValue() as string}</span>,
        },
        {
            accessorKey: "divisionId",
            size: 11,
            header: "Division ID",
            cell: (props) => <span className="text-xs text-gray-500 font-mono">{props.getValue() as string}</span>,
        },
    ];

    return (
        <div>
            {/* ── Distribution chart ── */}
            {allRows.length > 0 && (
                <div className="mb-3">
                    <DeviceTypeDistribution distribution={distribution} title="Device Type Distribution (All Divisions)" />
                </div>
            )}

            {/* ── Stats row ── */}
            {allRows.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200">
                        <span className="text-xs font-semibold text-gray-600">Total:</span>
                        <span className="text-xs font-bold text-gray-800">{stats.total}</span>
                    </div>
                    {[...stats.byType.entries()].sort(([a], [b]) => a - b).map(([typeId, count]) => (
                        <div key={typeId}
                            onClick={() => setTypeFilter(typeFilter === typeId ? "all" : typeId)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                                typeFilter === typeId ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}>
                            <span className="text-xs font-semibold">{getTypeName(typeId)}:</span>
                            <span className="text-xs font-bold">{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
                {/* search */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, IMEI, division, SIM…"
                        className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-700 w-72" />
                </div>

                {/* type filter */}
                {typeOptions.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        <button onClick={() => setTypeFilter("all")}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${typeFilter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            All ({allRows.length})
                        </button>
                        {typeOptions.map(([id, name]) => (
                            <button key={id} onClick={() => setTypeFilter(typeFilter === id ? "all" : id)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${typeFilter === id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                {name} ({stats.byType.get(id) ?? 0})
                            </button>
                        ))}
                    </div>
                )}

                <span className="ml-auto text-xs text-gray-400">{filtered.length} device{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                headerClassName="font-semibold py-1"
                bodyClassName="py-2 px-1 text-left font-medium border-b-2 border-b-gray-700"
                tableHeadCss="border-2 text-left border-gray-600 bg-dark text-white"
                tableCss="border-2 border-gray-700"
                headerFilter={true}
            />
        </div>
    );
};

export default AllDivisionDevices;
