import { useEffect, useMemo, useState } from "react";
import { useGetAdminDivisionDevice } from "../../../../../api/queries/app/hooks/admin_get_all_division_device_api_hooks";
import { IDivisionSingleDeviceInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceInterface";
import DivisionDeviceSearch from "../DivisionDeviceSearch/DivisionDeviceSearch";
import DivisionExcelExport from "../DivisionExcelExport/DivisionExcelExport";
import { getDeviceTypeName } from "../../utils/getDeviceTypeName";
import { copyToClipboard } from "../../../../../utils/clipboard/copyToClipboard";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const tsMs = (v: number) => (String(v).length > 10 ? v : v * 1000);

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtDateTime = (v?: number | null) => {
    if (!v) return "Never";
    const d = new Date(tsMs(v));
    return `${String(d.getDate()).padStart(2,"0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

const daysSince = (v?: number | null): number | null => {
    if (!v) return null;
    return Math.floor((Date.now() - tsMs(v)) / 86_400_000);
};

/* ── component ───────────────────────────────────────────────────────────── */

const THRESHOLDS = [7, 14, 30] as const;

const StaleDevicesView = () => {
    const [parentId,   setParentId]   = useState("");
    const [deviceData, setDeviceData] = useState<IDivisionSingleDeviceInterface[]>([]);
    const [threshold,  setThreshold]  = useState<number>(7);
    const [search,     setSearch]     = useState("");

    const { data, isFetching, isSuccess } = useGetAdminDivisionDevice(parentId);

    useEffect(() => {
        if (parentId === "") setDeviceData([]);
        else if (isSuccess)  setDeviceData(data.data.data.result);
        else                 setDeviceData([]);
    }, [parentId, data]);

    const stale = useMemo(() => {
        return deviceData
            .map(d => ({ ...d, age: daysSince(d.updatedAt) }))
            .filter(d => d.age !== null && d.age >= threshold)
            .filter(d => {
                if (!search.trim()) return true;
                const q = search.toLowerCase();
                return d.deviceName?.toLowerCase().includes(q) || String(d.deviceImei).includes(q);
            })
            .sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
    }, [deviceData, threshold, search]);

    const neverReported = deviceData.filter(d => !d.updatedAt).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <DivisionDeviceSearch onClickParentSearch={setParentId} />
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-500">Silent for at least</span>
                    {THRESHOLDS.map(t => (
                        <button key={t} onClick={() => setThreshold(t)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${threshold === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            {t}d
                        </button>
                    ))}
                </div>
            </div>

            {/* summary */}
            {deviceData.length > 0 && (
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200">
                        <span className="text-xs font-semibold text-gray-600">Total:</span>
                        <span className="text-xs font-bold">{deviceData.length}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 ring-1 ring-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-semibold text-amber-700">Stale (≥{threshold}d): {stale.length}</span>
                    </div>
                    {neverReported > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 ring-1 ring-red-200">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-semibold text-red-700">Never reported: {neverReported}</span>
                        </div>
                    )}
                    <div className="ml-auto">
                        <DivisionExcelExport divisionDevicesData={stale} />
                    </div>
                </div>
            )}

            {/* search */}
            {deviceData.length > 0 && (
                <div className="relative max-w-xs">
                    <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search name or IMEI…"
                        className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-700 w-full" />
                </div>
            )}

            {/* states */}
            {isFetching ? (
                <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                </div>
            ) : !parentId ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                    <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">Select a division to find stale devices</p>
                </div>
            ) : stale.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-emerald-600 gap-2">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold">All devices reported within {threshold} days</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                                <th className="px-4 py-3">Device Name</th>
                                <th className="px-4 py-3">IMEI</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Last Reported</th>
                                <th className="px-4 py-3 text-center">Silent For</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stale.map((d, i) => {
                                const age = d.age ?? 0;
                                const critical = age >= 30;
                                return (
                                    <tr key={d.id} className={`transition-colors ${critical ? "bg-red-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                                        <td className="px-4 py-3 font-medium text-gray-800">{d.deviceName}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                {d.deviceImei}
                                                <button onClick={() => copyToClipboard(String(d.deviceImei))} title="Copy IMEI"
                                                    className="text-gray-400 hover:text-gray-700">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600">{getDeviceTypeName(d.deviceTypeId) || `Type ${d.deviceTypeId}`}</td>
                                        <td className="px-4 py-3 text-xs text-gray-700">{fmtDateTime(d.updatedAt)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full ${critical ? "bg-red-100 text-red-700 ring-1 ring-red-200 animate-pulse" : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"}`}>
                                                {age}d
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${(d as any).active_status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${(d as any).active_status ? "bg-emerald-500" : "bg-red-500"}`} />
                                                {(d as any).active_status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StaleDevicesView;
