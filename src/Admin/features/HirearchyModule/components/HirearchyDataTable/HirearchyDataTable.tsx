import { useContext, useMemo, useState } from "react"
import { HirearchyModuleParentContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext"
import DataTable from "../../../../../global/components/DataTable/DataTable"
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface"
import { IDivisionParentIdInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdInterface"
import { getDesignation } from "../../hooks/getDesignation"
import AddHirearchyModal from "../AddHirearchyModal/AddHirearchyModal"
import EditButton from "../Button/EditButton"
import TableModal from "../../../../../global/components/DataTable/components/TableModal/TableModal"
import EditHirearchyModal from "../EditHireachyModal/EditHirearchyModal"
import AddTrackUserModal from "../TrackUser/AddTrackUser/AddTrackUserModal"
import AddTrackUserButton from "../TrackUser/Button/AddTrackUserButton"
import ExcelExport from "../DataExport/ExcelExport"
import { useDisclosure } from "@chakra-ui/react"
import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal"
import { postUpdateDivisionSubLogin } from "../../../../../api/queries/app/hooks/update-division-sublogin-api"
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification"

/* ── helpers ─────────────────────────────────────────────────────────────── */

/* own device count — prefer the clean device_imeis array, fall back to
   splitting the legacy comma-separated device_list string */
const getOwnDeviceCount = (node: IDivisionParentIdInterface): number => {
    if (Array.isArray(node.device_imeis)) {
        return node.device_imeis.filter(x => String(x).trim() !== '').length;
    }
    if (node.device_list) {
        return node.device_list.split(',').filter(x => x.trim() !== '').length;
    }
    return 0;
};

/* Sum own devices + all descendant devices.
   Descendants = nodes whose path contains nodeId as a segment. */
const buildCumulativeMap = (
    allNodes: IDivisionParentIdInterface[]
): Map<string, number> => {
    const map = new Map<string, number>();
    allNodes.forEach(node => {
        const total = allNodes
            .filter(item => {
                if (item.id === node.id) return true;
                const parts = item.path?.split(',').filter(p => p.trim() !== '') ?? [];
                return parts.includes(node.id);
            })
            .reduce((sum, item) => sum + getOwnDeviceCount(item), 0);
        map.set(node.id, total);
    });
    return map;
};

// const generatePassword = (): string => {
//     const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
//     return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
// };

/* ── component ───────────────────────────────────────────────────────────── */

const HirearchyDataTable = () => {
    const { hirearchyParentDetailData } = useContext(HirearchyModuleParentContext);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { mutate: doUpdate } = postUpdateDivisionSubLogin();

    const [trackUserModal, setTrackUserModal] = useState<boolean>(false);
    const [dataId, setDataId] = useState<string>('');
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [visiblePwd, setVisiblePwd] = useState<Set<string>>(new Set());
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    // const [resettingId, setResettingId] = useState<string | null>(null);

    const allRows: IDivisionParentIdInterface[] = hirearchyParentDetailData.data.result;

    // cumulative device count: own + all descendants
    const deviceCountMap = useMemo(() => buildCumulativeMap(allRows), [allRows]);

    const filteredData = useMemo(() => {
        let data = allRows;
        if (statusFilter === "active") data = data.filter(x => x.active_status);
        if (statusFilter === "inactive") data = data.filter(x => !x.active_status);
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(x =>
                x.name?.toLowerCase().includes(q) ||
                x.username?.toLowerCase().includes(q) ||
                x.mobile_no?.toLowerCase().includes(q)
            );
        }
        return data;
    }, [allRows, statusFilter, search]);

    const filterEditData = allRows.filter(x => x.id === dataId);

    const togglePwd = (id: string) => setVisiblePwd(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleSelect = (id: string) => setSelectedIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const bulkSetActive = (active: boolean) => {
        const count = selectedIds.size;
        selectedIds.forEach(id => {
            const item = allRows.find(x => x.id === id);
            if (item) doUpdate({ ...item, active_status: active } as any);
        });
        setSelectedIds(new Set());
        useSuccessNotification(`${count} entr${count === 1 ? 'y' : 'ies'} ${active ? 'activated' : 'deactivated'}`);
    };

    // const resetPassword = (item: IDivisionParentIdInterface) => {
    //     const newPass = generatePassword();
    //     setResettingId(item.id);
    //     doUpdate({ ...item, password: newPass } as any, {
    //         onSettled: () => {
    //             setResettingId(null);
    //             useSuccessNotification(`Password reset for ${item.name} → ${newPass}`);
    //         },
    //     });
    // };

    const columns: DataTableColumnInterface<IDivisionParentIdInterface>[] = [
        {
            accessorKey: "name",
            header: "Department Name",
            cell: (props) => <span className="font-medium text-sm">{props.getValue() as string}</span>
        },
        {
            accessorKey: "password",
            header: "Password",
            cell: (props) => {
                const row = props.row.original as IDivisionParentIdInterface;
                const vis = visiblePwd.has(row.id);
                return (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-sm font-mono truncate max-w-[100px] ${vis ? "text-gray-800" : "tracking-widest text-gray-400"}`}>
                            {vis ? props.getValue() as string : "••••••••"}
                        </span>
                        <button onClick={() => togglePwd(row.id)} title={vis ? "Hide" : "Show"}
                            className="text-gray-400 hover:text-gray-700 flex-shrink-0 transition-colors">
                            {vis
                                ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            }
                        </button>
                    </div>
                );
            }
        },
        {
            accessorKey: "username",
            header: "Email",
            cell: (props) => <span className="text-sm text-gray-600">{props.getValue() as string}</span>
        },
        {
            accessorKey: "mobile_no",
            header: "Mobile No.",
            cell: (props) => <span className="text-sm">{props.getValue() as string}</span>
        },
        {
            accessorKey: "dept_id",
            header: "Designation",
            cell: (props) => {
                const d = props.getValue() as number;
                const cls =
                    d === 2 ? "bg-blue-100 text-blue-700" :
                        d === 3 ? "bg-purple-100 text-purple-700" :
                            d === 4 ? "bg-amber-100 text-amber-700" :
                                d === 5 ? "bg-pink-100 text-pink-700" :
                                    "bg-gray-100 text-gray-600";
                return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cls}`}>{getDesignation(d)}</span>;
            }
        },
        {
            accessorKey: "active_status",
            header: "Status",
            cell: (props) => (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${props.getValue() ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${props.getValue() ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    {props.getValue() ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            accessorKey: "device_list",
            header: "Devices (incl. sub)",
            cell: (props) => {
                const row = props.row.original as IDivisionParentIdInterface;
                const own = getOwnDeviceCount(row);
                const total = deviceCountMap.get(row.id) ?? own;
                const cls =
                    total === 0 ? "bg-red-100 text-red-600" :
                        total < 10 ? "bg-amber-100 text-amber-700" :
                            total < 50 ? "bg-blue-100 text-blue-700" :
                                "bg-emerald-100 text-emerald-700";
                return (
                    <div className="flex flex-col items-start gap-0.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${cls}`}>
                            {total === 0 && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
                            {total}
                        </span>
                        {total !== own && (
                            <span className="text-[10px] text-gray-400 pl-1">{own} own</span>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: "id",
            header: "Action",
            cell: (props) => {
                const id = props.getValue() as string;
                return (
                    <div className="flex items-center gap-1.5">
                        <input type="checkbox" checked={selectedIds.has(id)} onChange={() => toggleSelect(id)}
                            onClick={e => e.stopPropagation()}
                            className="w-4 h-4 rounded border-gray-400 cursor-pointer accent-gray-800" />
                        {id !== '' && <EditButton onClickButton={() => { setDataId(id); onOpen(); }} />}
                    </div>
                );
            }
        },
    ];

    const total = allRows.length;
    const activeN = allRows.filter(x => x.active_status).length;
    const inactiveN = total - activeN;

    return (
        <div>
            {/* ── Toolbar: search + filter chips + bulk actions ── */}
            <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 bg-white border border-zinc-300 rounded-t-xl mt-2">
                {/* search */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, email, mobile…"
                        className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-700 w-60" />
                </div>

                {/* status chips */}
                <div className="flex gap-1.5">
                    {([
                        { k: "all" as const, label: `All (${total})`, on: "bg-gray-900 text-white", off: "bg-gray-100 text-gray-600 hover:bg-gray-200" },
                        { k: "active" as const, label: `Active (${activeN})`, on: "bg-emerald-600 text-white", off: "bg-gray-100 text-gray-600 hover:bg-gray-200" },
                        { k: "inactive" as const, label: `Inactive (${inactiveN})`, on: "bg-red-600 text-white", off: "bg-gray-100 text-gray-600 hover:bg-gray-200" },
                    ]).map(f => (
                        <button key={f.k} onClick={() => setStatusFilter(f.k)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${statusFilter === f.k ? f.on : f.off}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* bulk actions */}
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-gray-500 font-medium">{selectedIds.size} selected</span>
                        <button onClick={() => bulkSetActive(true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">Activate</button>
                        <button onClick={() => bulkSetActive(false)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">Deactivate</button>
                        <button onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition-colors">Clear</button>
                    </div>
                ) : (
                    <button onClick={() => setSelectedIds(new Set(filteredData.map(x => x.id)))}
                        className="ml-auto text-xs text-gray-500 hover:text-gray-700 underline">
                        Select all ({filteredData.length})
                    </button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                tableHeadCss="bg-dark"
                tableCss="border border-zinc-400 rounded-b-xl"
                headerClassName="text-gray-300 font-bold py-2 text-left"
                bodyClassName="border-b border-gray-300 py-2 text-left px-2"
                onTableAction={true}
                modalName="Add Hirearchy"
                btnName="Add Sublogin"
                hideColumn="device_list"
                tableHeaderColumn="device_list"
                modalComponent={<AddHirearchyModal />}
                additionalHeader={true}
                additionHeaderComponent={[
                    <ExcelExport hirerarchyData={hirearchyParentDetailData} />,
                    <AddTrackUserButton onHandleClick={() => setTrackUserModal(true)} />
                ]}
            />

            {isOpen && filterEditData.length > 0 && (
                <ChakraUiModal modalSize="xl" scroll={true} onClose={onClose} isOpen={isOpen}
                    children={<EditHirearchyModal onClose={onClose} editData={filterEditData} />}
                    modalHeader="Edit Hirearchy" />
            )}
            {trackUserModal && (
                <TableModal setModalActive={setTrackUserModal}
                    children={<AddTrackUserModal setAddTrackModalShow={setTrackUserModal} />}
                    headerName="Add Track User" />
            )}
        </div>
    );
};

export default HirearchyDataTable;
