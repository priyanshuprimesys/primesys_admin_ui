import { useContext, useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { DataTableContext } from "../../../../../contexts/AppLayout/DataTableContext/DataTableContext";
import { useGetAdminDivisionDevice } from "../../../../../api/queries/app/hooks/admin_get_all_division_device_api_hooks";
import { IDivisionSingleDeviceInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceInterface";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import EditButton from "../EditButton/EditButton";
import DivisionDeviceSearch from "../DivisionDeviceSearch/DivisionDeviceSearch";
import DataTable from "../../../../../global/components/DataTable/DataTable";
import AddSingleDevice from "../DivisionDevice/AddSingleDevice/AddSingleDevice";
import AddBulkDevice from "../AddBulkDevice/AddBulkDevice";
import DivisionExcelExport from "../DivisionExcelExport/DivisionExcelExport";
import EditDeviceModal from "../EditDeviceModal/EditDeviceModal";
import AddBulkDeviceModal from "../AddBulkDevice/AddBulkDeviceModal";
import AddSingleDeviceModal from "../DivisionDevice/AddSingleDevice/AddSingleDeviceModal";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import { updateDivisionDeviceData } from "../../../../../api/queries/app/features/allDivisionDevices/update_division_device_api";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import DeviceReadOnlyDrawer from "../DeviceReadOnlyDrawer/DeviceReadOnlyDrawer";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import { copyToClipboard } from "../../../../../utils/clipboard/copyToClipboard";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const tsMs = (v: number) => (String(v).length > 10 ? v : v * 1000);

const daysToExpiry = (item: IDivisionSingleDeviceInterface): number | null => {
    const exp = (item as any).devicePayment?.expiry_date;
    if (!exp) return null;
    return Math.ceil((tsMs(exp) - Date.now()) / 86_400_000);
};

const DivisionIdDevices = () => {
    const [parentId,    setParentId]    = useState<string>("");
    const [deviceData,  setDeviceData]  = useState<IDivisionSingleDeviceInterface[]>([]);
    const [search,      setSearch]      = useState("");
    const [typeFilter,  setTypeFilter]  = useState<number | "all">("all");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isBulkDeviceOpen, onOpen: onOpenBulkDevice, onClose: onBulkDeviceClose } = useDisclosure();
    const { isOpen: isAddSingleDevice, onOpen: onOpenAddSingleDevice, onClose: onCloseAddSingleDevice } = useDisclosure();

    const { deviceType } = useContext(DeviceTypeContext);
    const { tableInstance, globalFilter } = useContext(DataTableContext);
    const { mutateAsync: doUpdate } = useMutation({ mutationFn: updateDivisionDeviceData });

    const { data, isFetching, isSuccess, refetch } = useGetAdminDivisionDevice(parentId);
    const [deviceEditId, setDeviceEditId] = useState<string>("");
    const [viewDevice,   setViewDevice]   = useState<IDivisionSingleDeviceInterface | null>(null);

    /* transfer + column-visibility state */
    const [showTransfer,  setShowTransfer]  = useState(false);
    const [transferTarget,setTransferTarget]= useState("");
    const [transferring,  setTransferring]  = useState(false);
    const [showColMenu,   setShowColMenu]   = useState(false);
    const [hiddenCols,    setHiddenCols]    = useState<Set<string>>(new Set());

    useEffect(() => {
        if (parentId === "") {
            setDeviceData([]);
        } else if (isSuccess) {
            setDeviceData(data.data.data.result);
        } else if (!isSuccess) {
            setDeviceData([]);
        }
    }, [parentId, data]);

    const getTypeName = (id: number): string =>
        deviceType?.data.result.find(d => d.deviceTypeId === id)?.deviceType ?? `Type ${id}`;

    const filtered = useMemo(() => {
        let rows = deviceData;
        if (typeFilter !== "all") rows = rows.filter(x => x.deviceTypeId === typeFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(x =>
                x.deviceName?.toLowerCase().includes(q) ||
                String(x.deviceImei).includes(q)        ||
                x.deviceSimNo?.toLowerCase().includes(q)
            );
        }
        return rows;
    }, [deviceData, typeFilter, search]);

    /* rows that "Select all" should pick: when the table's own search box is
       active, use its filtered rows (tableInstance); otherwise the toolbar set */
    const selectableRows = useMemo(() => {
        if (globalFilter && Array.isArray(tableInstance) && tableInstance.length > 0) {
            return tableInstance as IDivisionSingleDeviceInterface[];
        }
        return filtered;
    }, [globalFilter, tableInstance, filtered]);

    const stats = useMemo(() => {
        const active  = deviceData.filter(x => (x as any).active_status).length;
        const byType  = new Map<number, number>();
        deviceData.forEach(d => byType.set(d.deviceTypeId, (byType.get(d.deviceTypeId) ?? 0) + 1));
        return { total: deviceData.length, active, inactive: deviceData.length - active, byType };
    }, [deviceData]);

    const toggleSelect = (id: string) =>
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const bulkSetActive = async (active: boolean) => {
        const count = selectedIds.size;
        const items = deviceData.filter(x => selectedIds.has(x.id));
        try {
            await Promise.all(items.map(item => doUpdate({ ...item, activeStatus: active } as any)));
            useSuccessNotification(`${count} device${count !== 1 ? 's' : ''} ${active ? 'activated' : 'deactivated'}`);
        } catch {
            alert("Some updates failed. Please retry.");
        } finally {
            setSelectedIds(new Set());
            refetch();
        }
    };

    const bulkSetReport = async (enabled: boolean) => {
        const count = selectedIds.size;
        const items = deviceData.filter(x => selectedIds.has(x.id));
        try {
            await Promise.all(items.map(item => doUpdate({ ...item, activeStatus: (item as any).active_status, reportEnable: enabled } as any)));
            useSuccessNotification(`Report ${enabled ? 'enabled' : 'disabled'} for ${count} device${count !== 1 ? 's' : ''}`);
        } catch {
            alert("Some updates failed. Please retry.");
        } finally {
            setSelectedIds(new Set());
            refetch();
        }
    };

    const bulkTransfer = async () => {
        if (!transferTarget) { alert("Select a target division"); return; }
        const count = selectedIds.size;
        const items = deviceData.filter(x => selectedIds.has(x.id));
        setTransferring(true);
        try {
            await Promise.all(items.map(item => doUpdate({ ...item, activeStatus: (item as any).active_status, divisionId: transferTarget } as any)));
            useSuccessNotification(`${count} device${count !== 1 ? 's' : ''} moved to new division`);
            setShowTransfer(false);
            setTransferTarget("");
            setSelectedIds(new Set());
            refetch();
        } catch {
            alert("Transfer failed. Please retry.");
        } finally {
            setTransferring(false);
        }
    };

    const columns: DataTableColumnInterface<IDivisionSingleDeviceInterface>[] = [
        {
            accessorKey: "deviceName",
            size: 15,
            header: "Device Name",
            cell: (props) => <span className="font-medium">{props.getValue() as string}</span>,
            meta: { filterVariant: "number" },
        },
        {
            accessorKey: "deviceImei",
            size: 20,
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
            accessorKey: "deviceSimNo",
            size: 17,
            header: "Sim No",
            cell: (props) => {
                const sim = props.getValue() as string;
                if (!sim) return <span className="text-gray-400">—</span>;
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs">{sim}</span>
                        <button onClick={e => { e.stopPropagation(); copyToClipboard(String(sim)); }}
                            title="Copy Sim No" className="text-gray-400 hover:text-gray-700 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                );
            },
        },
        {
            accessorKey: "version",
            size: 13,
            header: "Device Version",
            cell: (props) => {
                const v = (props.row.original as any).deviceVersion ?? props.getValue();
                return v ? <span className="text-xs">{v as string}</span> : <span className="text-gray-400">—</span>;
            },
        },
        {
            accessorKey: "simServiceProvider",
            size: 12,
            header: "SIM Provider",
            cell: (props) => {
                const p = props.getValue() as string;
                return p ? <span className="text-xs">{p}</span> : <span className="text-gray-400">—</span>;
            },
        },
        {
            accessorKey: "deviceSimImeiNo",
            size: 21,
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
            size: 13,
            header: "Device Type",
            cell: (props) => {
                const id  = props.getValue() as number;
                const cls =
                    id === 1 ? "bg-blue-100 text-blue-700"    :
                    id === 2 ? "bg-purple-100 text-purple-700" :
                    id === 3 ? "bg-amber-100 text-amber-700"   :
                    id === 4 ? "bg-pink-100 text-pink-700"     :
                    id === 5 ? "bg-teal-100 text-teal-700"     :
                    id === 6 ? "bg-indigo-100 text-indigo-700" :
                    id === 7 ? "bg-orange-100 text-orange-700" :
                               "bg-gray-100 text-gray-600";
                return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cls}`}>{getTypeName(id)}</span>;
            },
            meta: { filterVariant: "number" },
        },
        {
            accessorKey: "deviceNo",
            size: 9,
            header: "Device No.",
            cell: (props) => <>{props.getValue()}</>,
            meta: { filterVariant: "number" },
        },
        {
            accessorKey: "devicePayment",
            size: 9,
            header: "Expiry",
            cell: (props) => {
                const item = props.row.original as IDivisionSingleDeviceInterface;
                const days = daysToExpiry(item);
                if (days === null) return <span className="text-xs text-gray-400">—</span>;
                const cls = days <= 0 ? "bg-red-100 text-red-700 ring-1 ring-red-200 animate-pulse"
                    : days <= 30 ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                    : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
                return (
                    <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>
                        {days <= 0 ? "Expired" : `${days}d`}
                    </span>
                );
            },
        },
        {
            accessorKey: "reportEnable",
            size: 10,
            header: "Report",
            cell: (props) => {
                const enabled = props.getValue() as boolean;
                return (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${enabled ? "bg-sky-100 text-sky-700" : "bg-gray-200 text-gray-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-sky-500 animate-pulse" : "bg-gray-400"}`} />
                        {enabled ? "Active" : "Inactive"}
                    </span>
                );
            },
        },
        {
            accessorKey: "active_status",
            size: 10,
            header: "Status",
            cell: (props) => (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${(props.getValue() as boolean) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(props.getValue() as boolean) ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    {(props.getValue() as boolean) ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            accessorKey: "id",
            size: 12,
            header: "Action",
            cell: (props) => {
                const id   = props.getValue() as string;
                const item = props.row.original as IDivisionSingleDeviceInterface;
                return (
                    <div className="flex items-center gap-1.5">
                        <input type="checkbox" checked={selectedIds.has(id)} onChange={() => toggleSelect(id)}
                            onClick={e => e.stopPropagation()}
                            className="w-4 h-4 rounded border-gray-400 cursor-pointer accent-gray-800" />
                        <button onClick={() => setViewDevice(item)} title="View details"
                            className="p-1 rounded bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        <EditButton onHandleClick={() => { setDeviceEditId(id); onOpen(); }} />
                    </div>
                );
            },
            meta: { filterVariant: "number" },
        },
    ];

    /* toggleable columns (Action column always visible) */
    const COL_LABELS: Record<string, string> = {
        deviceName:   "Device Name",
        deviceImei:   "IMEI No",
        deviceSimNo:  "Sim No",
        version:           "Device Version",
        simServiceProvider:"SIM Provider",
        deviceSimImeiNo:   "SIM IMSI No",
        deviceTypeId: "Device Type",
        deviceNo:     "Device No.",
        devicePayment:"Expiry",
        reportEnable: "Report",
        active_status:"Status",
    };
    const visibleColumns = columns.filter(c => !hiddenCols.has(c.accessorKey as string));

    const toggleCol = (key: string) =>
        setHiddenCols(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

    return (
        <>
            <div className="text-center mb-2">
                <h1 className="text-lg font-bold">Division Devices</h1>
            </div>

            <DivisionDeviceSearch onClickParentSearch={id => { setParentId(id); setSelectedIds(new Set()); }} />

            {/* ── Stats ── */}
            {deviceData.length > 0 && (
                <div className="flex flex-wrap gap-3 my-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200">
                        <span className="text-xs font-semibold text-gray-600">Total:</span>
                        <span className="text-xs font-bold text-gray-800">{stats.total}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-700">Active: {stats.active}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-xs font-semibold text-red-700">Inactive: {stats.inactive}</span>
                    </div>
                    {[...stats.byType.entries()].sort(([a], [b]) => a - b).map(([typeId, count]) => (
                        <div key={typeId}
                            onClick={() => setTypeFilter(typeFilter === typeId ? "all" : typeId)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${typeFilter === typeId ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                            <span className="text-xs font-semibold">{getTypeName(typeId)}: {count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Toolbar ── */}
            {deviceData.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400 pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </span>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search name, IMEI, SIM…"
                            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-700 w-64" />
                    </div>

                    {/* Device Type filter (prepopulated) */}
                    <select
                        value={typeFilter === "all" ? "" : String(typeFilter)}
                        onChange={e => setTypeFilter(e.target.value === "" ? "all" : Number(e.target.value))}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-700 bg-white"
                    >
                        <option value="">All Device Types</option>
                        {deviceType?.data.result.map(d => (
                            <option key={d.deviceTypeId} value={d.deviceTypeId}>{d.deviceType}</option>
                        ))}
                    </select>

                    {/* Columns dropdown */}
                    <div className="relative">
                        <button onClick={() => setShowColMenu(v => !v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:border-gray-500 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Columns
                        </button>
                        {showColMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowColMenu(false)} />
                                <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-44">
                                    {Object.entries(COL_LABELS).map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs">
                                            <input type="checkbox" checked={!hiddenCols.has(key)} onChange={() => toggleCol(key)}
                                                className="w-3.5 h-3.5 rounded accent-gray-800" />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {selectedIds.size > 0 ? (
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-gray-500 font-medium">{selectedIds.size} selected</span>
                            <button onClick={() => bulkSetActive(true)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">Activate</button>
                            <button onClick={() => bulkSetActive(false)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">Deactivate</button>
                            <button onClick={() => bulkSetReport(true)}
                                className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors">Report On</button>
                            <button onClick={() => bulkSetReport(false)}
                                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors">Report Off</button>
                            <button onClick={() => { setTransferTarget(""); setShowTransfer(true); }}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">Move</button>
                            <button onClick={() => setSelectedIds(new Set())}
                                className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition-colors">Clear</button>
                        </div>
                    ) : (
                        <button onClick={() => setSelectedIds(new Set(selectableRows.map(x => x.id)))}
                            className="ml-auto text-xs text-gray-500 hover:text-gray-700 underline">
                            Select all{globalFilter ? " matching" : typeFilter !== "all" ? ` ${getTypeName(typeFilter)}` : ""} ({selectableRows.length})
                        </button>
                    )}
                </div>
            )}

            <DataTable
                isLoading={isFetching}
                additionalHeader={true}
                additionHeaderComponent={[
                    <a download className="flex justify-end text-blue-700 underline underline-offset-1"
                        href="http://primesystrack.co.in/templates/device_upload_sheet.xlsx">
                        Download Bulk Template
                    </a>,
                    <AddSingleDevice parentID={parentId} onHandleClick={onOpenAddSingleDevice} />,
                    <AddBulkDevice parentId={parentId} onBulkAdd={onOpenBulkDevice} />,
                    <DivisionExcelExport divisionDevicesData={filtered} />,
                ]}
                columns={visibleColumns}
                data={filtered}
                headerClassName="font-semibold py-1"
                bodyClassName="py-2 px-1 text-left font-medium border-b-2 border-b-gray-700"
                tableHeadCss="border-2 text-left border-gray-600 bg-dark text-white"
                tableCss="border-2 border-gray-700"
                headerFilter={false}
            />

            {isOpen && (
                <EditDeviceModal
                    data={data?.data ? data.data.data.result : []}
                    deviceId={deviceEditId}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}
            {isBulkDeviceOpen && (
                <AddBulkDeviceModal parentId={parentId} isOpen={isBulkDeviceOpen} onClose={onBulkDeviceClose} />
            )}
            {isAddSingleDevice && (
                <AddSingleDeviceModal parentID={parentId} isOpen={isAddSingleDevice} onClose={onCloseAddSingleDevice} />
            )}
            {viewDevice && (
                <DeviceReadOnlyDrawer device={viewDevice} onClose={() => setViewDevice(null)} />
            )}

            {/* ── Bulk transfer modal ── */}
            {showTransfer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !transferring && setShowTransfer(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90vw] overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 bg-gray-900">
                            <span className="text-white font-semibold text-sm">Move {selectedIds.size} Device{selectedIds.size !== 1 ? "s" : ""}</span>
                            <button onClick={() => !transferring && setShowTransfer(false)} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Target Division</label>
                                <ParentDataSearchSelect placeHolder="Search target division…" setInputData={setTransferTarget} />
                            </div>
                            <p className="text-[11px] text-amber-600 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                Selected devices will be reassigned to the chosen division.
                            </p>
                            <div className="flex gap-2 pt-1">
                                <button onClick={() => setShowTransfer(false)} disabled={transferring}
                                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={bulkTransfer} disabled={transferring || !transferTarget}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    {transferring ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Moving…
                                        </>
                                    ) : "Confirm Move"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DivisionIdDevices;
