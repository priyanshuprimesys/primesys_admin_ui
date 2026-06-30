import { useContext, useMemo, useState } from "react";
import { HirearchyModuleParentContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext";
import { IDivisionParentIdInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdInterface";
import { getDesignation } from "../../hooks/getDesignation";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const getOwnDeviceCount = (node: IDivisionParentIdInterface): number => {
    if (Array.isArray(node.device_imeis)) {
        return node.device_imeis.filter(x => String(x).trim() !== '').length;
    }
    if (node.device_list) {
        return node.device_list.split(',').filter(x => x.trim() !== '').length;
    }
    return 0;
};

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

const coverageTier = (count: number): { label: string; bg: string; text: string; ring: string } => {
    if (count === 0)  return { label: "No devices",   bg: "bg-red-50",     text: "text-red-700",     ring: "ring-red-200"     };
    if (count < 10)   return { label: "Low coverage", bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200"   };
    if (count < 50)   return { label: "Moderate",     bg: "bg-blue-50",    text: "text-blue-700",    ring: "ring-blue-200"    };
    return               { label: "Well covered",  bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };
};

const LEVEL_HEADER: Record<number, string> = {
    1: "bg-gray-800 text-white",
    2: "bg-blue-700 text-white",
    3: "bg-purple-700 text-white",
    4: "bg-amber-600 text-white",
    5: "bg-pink-700 text-white",
};

/* ── component ───────────────────────────────────────────────────────────── */

const DeviceHeatmap = () => {
    const { hirearchyParentDetailData } = useContext(HirearchyModuleParentContext);
    const [search, setSearch] = useState("");

    const grouped = useMemo(() => {
        const map: Record<number, IDivisionParentIdInterface[]> = {};
        const q = search.trim().toLowerCase();
        hirearchyParentDetailData.data.result.forEach(item => {
            if (q && !item.name?.toLowerCase().includes(q)) return;
            const lvl = item.dept_id ?? 1;
            if (!map[lvl]) map[lvl] = [];
            map[lvl].push(item);
        });
        return map;
    }, [hirearchyParentDetailData.data.result, search]);

    const levels = Object.keys(grouped).map(Number).sort((a, b) => a - b);

    const allItems: IDivisionParentIdInterface[] = hirearchyParentDetailData.data.result;
    const deviceCountMap = useMemo(() => buildCumulativeMap(allItems), [allItems]);
    const total      = allItems.length;
    const noCoverage = allItems.filter(x => (deviceCountMap.get(x.id) ?? 0) === 0).length;
    const avgDevices = total > 0
        ? Math.round(allItems.reduce((s, x) => s + (deviceCountMap.get(x.id) ?? 0), 0) / total)
        : 0;

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Select a parent division to view device coverage</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* summary bar */}
            <div className="flex flex-wrap gap-3">
                {[
                    { label: "Total Divisions", value: total,                            cls: "bg-gray-100 text-gray-800" },
                    { label: "No Devices",       value: noCoverage,                       cls: noCoverage > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700" },
                    { label: "Avg Devices/Div",  value: avgDevices,                       cls: "bg-blue-100 text-blue-700" },
                    { label: "Full Coverage",    value: total - noCoverage,               cls: "bg-emerald-100 text-emerald-700" },
                ].map(s => (
                    <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${s.cls}`}>
                        <span className="text-xs font-semibold">{s.label}:</span>
                        <span className="text-xs font-bold">{s.value}</span>
                    </div>
                ))}

                {/* legend */}
                <div className="flex items-center gap-3 ml-auto">
                    {[
                        { label: "0",    bg: "bg-red-200"     },
                        { label: "1–9",  bg: "bg-amber-200"   },
                        { label: "10–49",bg: "bg-blue-200"    },
                        { label: "50+",  bg: "bg-emerald-200" },
                    ].map(l => (
                        <div key={l.label} className="flex items-center gap-1">
                            <span className={`w-3 h-3 rounded-sm ${l.bg}`} />
                            <span className="text-[10px] text-gray-500">{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* search */}
            <div className="relative max-w-xs">
                <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                </span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Filter divisions…"
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-600 w-full" />
            </div>

            {/* heatmap grid by level */}
            {levels.map(lvl => (
                <div key={lvl} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    {/* level header */}
                    <div className={`flex items-center justify-between px-4 py-2 ${LEVEL_HEADER[lvl] ?? "bg-gray-700 text-white"}`}>
                        <span className="font-bold text-sm">{getDesignation(lvl)}</span>
                        <span className="text-xs opacity-80">{grouped[lvl].length} division{grouped[lvl].length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* cards grid */}
                    <div className="p-3 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                        {grouped[lvl]
                            .sort((a, b) => (deviceCountMap.get(a.id) ?? 0) - (deviceCountMap.get(b.id) ?? 0))
                            .map(item => {
                                const count = deviceCountMap.get(item.id) ?? 0;
                                const own   = getOwnDeviceCount(item);
                                const tier  = coverageTier(count);
                                return (
                                    <div key={item.id}
                                        className={`rounded-lg p-3 ring-1 ${tier.bg} ${tier.ring} ${!item.active_status ? "opacity-50" : ""}`}>
                                        <p className={`text-xs font-bold truncate ${tier.text}`} title={item.name}>
                                            {item.name}
                                        </p>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <div className="flex flex-col">
                                                <span className={`text-lg font-black leading-none ${tier.text}`}>{count}</span>
                                                {count !== own && (
                                                    <span className="text-[9px] text-gray-400 font-medium mt-0.5">{own} own</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${tier.bg} ${tier.text} ring-1 ${tier.ring}`}>
                                                    {tier.label}
                                                </span>
                                                {!item.active_status && (
                                                    <span className="text-[9px] text-gray-400 font-medium">Inactive</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* mini bar */}
                                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, count / 100 * 100)}%`,
                                                    background: count === 0 ? "#fc8181" : count < 10 ? "#f6ad55" : count < 50 ? "#63b3ed" : "#68d391"
                                                }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeviceHeatmap;
