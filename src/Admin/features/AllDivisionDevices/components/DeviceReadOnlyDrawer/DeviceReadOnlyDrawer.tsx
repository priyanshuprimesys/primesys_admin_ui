import { IDivisionSingleDeviceInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceInterface";
import { getDeviceTypeName } from "../../utils/getDeviceTypeName";
import { copyToClipboard } from "../../../../../utils/clipboard/copyToClipboard";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const tsMs = (v: number) => (String(v).length > 10 ? v : v * 1000);

const fmtTs = (v?: number | null) => {
    if (!v) return "—";
    const d = new Date(tsMs(v));
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${String(d.getDate()).padStart(2,"0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

const daysTo = (v?: number | null): number | null => {
    if (!v) return null;
    return Math.ceil((tsMs(v) - Date.now()) / 86_400_000);
};

const lastSeen = (v?: number | null) => {
    if (!v) return "Unknown";
    const h = Math.floor((Date.now() - tsMs(v)) / 3_600_000);
    if (h < 1)  return "< 1h ago";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const SHIFT_LABEL: Record<number, string> = { 0: "Default", 1: "Day", 2: "Night" };

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
        <span className="text-xs font-semibold text-gray-400 w-32 flex-shrink-0">{label}</span>
        <span className="text-xs text-gray-800 flex-1 min-w-0">{children}</span>
    </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 overflow-hidden mb-3">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        </div>
        <div className="px-4 py-2">{children}</div>
    </div>
);

/* ── component ───────────────────────────────────────────────────────────── */

interface Props {
    device: IDivisionSingleDeviceInterface | null;
    onClose: () => void;
}

const DeviceReadOnlyDrawer = ({ device, onClose }: Props) => {
    if (!device) return null;

    const exp        = (device as any).devicePayment?.expiry_date;
    const renewDate  = (device as any).devicePayment?.renewal_date ?? (device as any).devicePayment?.payment_renew_date;
    const planId     = (device as any).devicePayment?.payment_plan_id;
    const daysLeft   = daysTo(exp);
    const expClass   = daysLeft === null ? "" : daysLeft <= 0 ? "text-red-600 font-bold" : daysLeft <= 30 ? "text-amber-600 font-bold" : "text-emerald-600 font-bold";

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* backdrop */}
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* panel */}
            <div className="w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">

                {/* header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-gray-900 flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(device.deviceName || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{device.deviceName}</p>
                        <p className="text-gray-400 text-xs font-mono">{device.deviceImei}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* scrollable body */}
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#f1f3f8]">

                    {/* status strip */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${(device as any).active_status ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-100 text-red-700 ring-1 ring-red-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${(device as any).active_status ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                            {(device as any).active_status ? "Active" : "Inactive"}
                        </span>
                        {daysLeft !== null && (
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${daysLeft <= 0 ? "bg-red-100 text-red-700 ring-red-200 animate-pulse" : daysLeft <= 30 ? "bg-amber-100 text-amber-700 ring-amber-200" : "bg-emerald-100 text-emerald-700 ring-emerald-200"}`}>
                                {daysLeft <= 0 ? "Expired" : `${daysLeft}d until expiry`}
                            </span>
                        )}
                        {device.reportEnable && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-200">Reports On</span>
                        )}
                    </div>

                    <Section title="Device Info">
                        <Row label="Device Name">{device.deviceName || "—"}</Row>
                        <Row label="IMEI">
                            <div className="flex items-center gap-2">
                                <span className="font-mono">{device.deviceImei}</span>
                                <button
                                    onClick={() => copyToClipboard(String(device.deviceImei))}
                                    className="text-gray-400 hover:text-gray-700 transition-colors"
                                    title="Copy IMEI"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </Row>
                        <Row label="SIM No">{device.deviceSimNo || "—"}</Row>
                        <Row label="SIM IMEI">{device.deviceSimImeiNo || "—"}</Row>
                        <Row label="Device No.">{device.deviceNo}</Row>
                        <Row label="Device Type">{getDeviceTypeName(device.deviceTypeId) || `Type ${device.deviceTypeId}`}</Row>
                        <Row label="User Type">{device.deviceUserType || "—"}</Row>
                        <Row label="Shift">{SHIFT_LABEL[device.shiftType] ?? `Shift ${device.shiftType}`}</Row>
                        <Row label="Division ID">{device.divisionId}</Row>
                    </Section>

                    <Section title="Payment">
                        <Row label="Plan ID">{planId ?? "—"}</Row>
                        <Row label="Expiry Date">
                            <span className={expClass}>{fmtTs(exp)} {daysLeft !== null ? `(${daysLeft <= 0 ? "expired" : daysLeft + "d left"})` : ""}</span>
                        </Row>
                        <Row label="Renewal Date">{fmtTs(renewDate)}</Row>
                    </Section>

                    <Section title="Report Settings">
                        <Row label="Report Enable">{device.reportEnable ? "Yes" : "No"}</Row>
                        <Row label="Trip Wise Report">{device.tripWiseReport ? "Yes" : "No"}</Row>
                        <Row label="Report Time Margin">{device.reportTimeMargin} min</Row>
                        <Row label="Report Dist Margin">{device.reportDistMargin} m</Row>
                        <Row label="On-Track Margin">{device.onTrackMargin} m</Row>
                        <Row label="SIM Provider">{(device as any).simServiceProvider || "—"}</Row>
                    </Section>

                    {(device as any).location && (
                        <Section title="Last Location">
                            <Row label="Coordinates">
                                {(device as any).location?.geoLocation?.coordinates
                                    ? `${(device as any).location.geoLocation.coordinates[1]?.toFixed(5)}, ${(device as any).location.geoLocation.coordinates[0]?.toFixed(5)}`
                                    : "—"}
                            </Row>
                            <Row label="Speed">{(device as any).location?.speed ?? "—"} km/h</Row>
                            <Row label="GSM Signal">{(device as any).location?.gsmSignalStrength ?? "—"}</Row>
                            <Row label="Voltage">{(device as any).location?.voltageLevel ?? "—"}</Row>
                        </Section>
                    )}

                    <Section title="Timestamps">
                        <Row label="Activation">{fmtTs((device as any).activationDate)}</Row>
                        <Row label="Last Updated">{lastSeen(device.updatedAt)}</Row>
                        <Row label="Created At">{fmtTs((device as any).createdAt)}</Row>
                        <Row label="Last Modified">{fmtTs((device as any).lastModified)}</Row>
                    </Section>

                </div>
            </div>
        </div>
    );
};

export default DeviceReadOnlyDrawer;
