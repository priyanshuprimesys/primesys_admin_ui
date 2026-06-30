import { useState } from "react";
import { format } from "date-fns";
import { Alert, AlertIcon, Badge, Button, Spinner } from "@chakra-ui/react";
import { useGetAllReportEmailStatusQuery } from "./data/queryOptions";
import { EmailStatus, ProcessType, ReportEmail, ReportEmailQueueLogDTO } from "./data/schema";
import { getDeviceNumberToTypeName } from "../KeymanBeatModule/services/deviceNumberTypeToString";

type StatusFilter = "all" | EmailStatus;

const STATUS_CONFIG: Record<string, { bar: string; badge: string; label: string }> = {
    [EmailStatus.PENDING]:           { bar: "bg-orange-400", badge: "orange", label: "Pending"           },
    [EmailStatus.GENERATING_REPORT]: { bar: "bg-blue-400",   badge: "blue",   label: "Generating Report" },
    [EmailStatus.READY]:             { bar: "bg-cyan-400",   badge: "cyan",   label: "Ready"             },
    [EmailStatus.SENDING]:           { bar: "bg-purple-400", badge: "purple", label: "Sending"           },
    [EmailStatus.SENT]:              { bar: "bg-green-400",  badge: "green",  label: "Sent"              },
    [EmailStatus.FAILED]:            { bar: "bg-red-400",    badge: "red",    label: "Failed"            },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string; colorScheme: string }[] = [
    { value: "all",                          label: "All",        colorScheme: "gray"   },
    { value: EmailStatus.PENDING,            label: "Pending",    colorScheme: "orange" },
    { value: EmailStatus.GENERATING_REPORT,  label: "Generating", colorScheme: "blue"   },
    { value: EmailStatus.READY,              label: "Ready",      colorScheme: "cyan"   },
    { value: EmailStatus.SENDING,            label: "Sending",    colorScheme: "purple" },
    { value: EmailStatus.SENT,               label: "Sent",       colorScheme: "green"  },
    { value: EmailStatus.FAILED,             label: "Failed",     colorScheme: "red"    },
];

const PROCESS_TYPE_LABEL: Record<ProcessType, string> = {
    [ProcessType.SEND_REPORT_EMAIL]: "Report Email",
    [ProcessType.SEND_PARENT_EMAIL]: "Parent Email",
};

const MIN_VALID_TS = 1_000_000_000;

function fmtTime(ts: number | null | undefined): string {
    if (ts == null || ts < MIN_VALID_TS) return "—";
    return format(new Date(ts * 1000), "dd MMM yyyy, hh:mm a");
}

function fmtDate(ts: number | null | undefined): string {
    if (ts == null || ts < MIN_VALID_TS) return "—";
    return format(new Date(ts * 1000), "dd MMM yyyy");
}

function toDisplayDate(unixSec: number): string {
    return format(new Date(unixSec * 1000), "yyyy-MM-dd");
}

function toUnixSec(dateStr: string): number {
    const [year, month, day] = dateStr.split("-").map(Number);
    return Math.floor(new Date(year, month - 1, day).getTime() / 1000);
}

// ─── summary stats ────────────────────────────────────────────────────────────

function SummaryStats({ items }: { items: ReportEmail[] }) {
    const total      = items.length;
    const pending    = items.filter(i => i.status === EmailStatus.PENDING).length;
    const generating = items.filter(i => i.status === EmailStatus.GENERATING_REPORT).length;
    const ready      = items.filter(i => i.status === EmailStatus.READY).length;
    const sending    = items.filter(i => i.status === EmailStatus.SENDING).length;
    const sent       = items.filter(i => i.status === EmailStatus.SENT).length;
    const failed     = items.filter(i => i.status === EmailStatus.FAILED).length;

    const stats = [
        { label: "Total",      value: total,      color: "text-gray-700",   bg: "bg-gray-100"  },
        { label: "Pending",    value: pending,    color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Generating", value: generating, color: "text-blue-600",   bg: "bg-blue-50"   },
        { label: "Ready",      value: ready,      color: "text-cyan-600",   bg: "bg-cyan-50"   },
        { label: "Sending",    value: sending,    color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Sent",       value: sent,       color: "text-green-600",  bg: "bg-green-50"  },
        { label: "Failed",     value: failed,     color: "text-red-600",    bg: "bg-red-50"    },
    ];

    return (
        <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-gray-100">
            {stats.map(s => (
                <div key={s.label} className={`flex flex-col items-center px-4 py-2 rounded-xl ${s.bg} min-w-[72px]`}>
                    <span className={`text-2xl font-bold leading-tight ${s.color}`}>{s.value}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">{s.label}</span>
                </div>
            ))}
        </div>
    );
}

// ─── detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-2 text-xs">
            <span className="text-gray-400 shrink-0 w-36">{label}</span>
            <span className="text-gray-700 font-medium break-all">{value}</span>
        </div>
    );
}

// ─── log entry ────────────────────────────────────────────────────────────────

function LogEntry({ log, index }: { log: ReportEmailQueueLogDTO; index: number }) {
    const cfg = STATUS_CONFIG[log.status] ?? { badge: "gray", label: log.status, bar: "bg-gray-300" };
    const hasError = !!log.errorMessage;
    const processLabel = PROCESS_TYPE_LABEL[log.processType] ?? log.processType;

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            {/* log header */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                    <Badge colorScheme={log.processType === ProcessType.SEND_REPORT_EMAIL ? "blue" : "purple"}
                        variant="subtle" fontSize="10px" px={2} py={0.5} borderRadius="full">
                        {processLabel}
                    </Badge>
                </div>
                <Badge colorScheme={cfg.badge} variant="subtle" fontSize="10px" px={2} py={0.5} borderRadius="full">
                    {cfg.label}
                </Badge>
            </div>

            {/* log details */}
            <div className="px-3 py-2.5 space-y-1.5">
                <DetailRow label="Sent To"         value={log.emailSentTo || "—"}             />
                <DetailRow label="Division"        value={log.processDivisionName || "—"}     />
                <DetailRow label="Triggered By"    value={log.triggeredBy || "—"}             />
                <DetailRow label="Process Started" value={fmtTime(log.processingStartedAt)}   />
                <DetailRow label="Created At"      value={fmtTime(log.createdAt)}             />

                {hasError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
                        <p className="text-[10px] font-semibold text-red-500 mb-0.5">Error</p>
                        <p className="text-xs text-red-700 break-words">{log.errorMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── card ─────────────────────────────────────────────────────────────────────

function EmailCard({ item }: { item: ReportEmail }) {
    const [expanded, setExpanded] = useState(false);
    const status = item.status ?? "UNKNOWN";
    const cfg = STATUS_CONFIG[status] ?? { bar: "bg-gray-300", badge: "gray", label: status };
    const hasError = !!item.errorMessage;
    const hasLogs  = item.reportEmailLogs?.length > 0;
    const deviceTypeName = item.deviceTypeId != null
        ? (getDeviceNumberToTypeName(item.deviceTypeId) || `Type ${item.deviceTypeId}`)
        : "—";

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* status color bar */}
            <div className={`h-1.5 w-full ${cfg.bar}`} />

            <div className="p-4 flex flex-col flex-1">

                {/* ── header ── */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate" title={item.divisionName ?? ""}>
                            {item.divisionName ?? "—"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{deviceTypeName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge colorScheme={cfg.badge} variant="subtle" fontSize="10px" px={2} py={0.5} borderRadius="full">
                            {cfg.label}
                        </Badge>
                        {item.sent ? (
                            <Badge colorScheme="green" variant="subtle" fontSize="10px" px={2} py={0.5} borderRadius="full">
                                ✓ Sent
                            </Badge>
                        ) : (
                            <Badge colorScheme="red" variant="subtle" fontSize="10px" px={2} py={0.5} borderRadius="full">
                                ✕ Not Sent
                            </Badge>
                        )}
                        {(item.retryCount ?? 0) > 0 && (
                            <Badge colorScheme="orange" variant="outline" fontSize="10px" px={2} py={0.5} borderRadius="full">
                                ↻ {item.retryCount} {item.retryCount === 1 ? "retry" : "retries"}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* ── primary info ── */}
                <div className="space-y-1.5 mb-3">
                    <DetailRow label="Report Date"     value={fmtDate(item.reportDate)}       />
                    <DetailRow label="Process Started" value={fmtTime(item.processStartedAt)} />
                    <DetailRow label="Report End Time" value={fmtTime(item.reportEndTime)}    />
                    <DetailRow label="Report Lock Time" value={fmtTime(item.reportLockTime)}  />
                    {item.triggeredBy && (
                        <DetailRow label="Triggered By" value={item.triggeredBy} />
                    )}
                    {item.sentAt && (
                        <DetailRow label="Sent At" value={fmtTime(item.sentAt)} />
                    )}
                </div>

                {/* ── error block ── */}
                {hasError && (
                    <div className="mb-3 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs font-semibold text-red-600 mb-1">Error</p>
                        <p className="text-xs text-red-700 break-words">{item.errorMessage}</p>
                    </div>
                )}

                {/* ── expand toggle ── */}
                <button
                    onClick={() => setExpanded(p => !p)}
                    className="mt-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 transition-colors pt-2"
                >
                    <span>{expanded ? "▲ Hide" : "▼ More"} Details</span>
                    {hasLogs && (
                        <span className="ml-1 bg-blue-100 text-blue-600 rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                            {item.reportEmailLogs.length} log{item.reportEmailLogs.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </button>

                {/* ── expanded section ── */}
                {expanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">

                        {/* extra timestamps + ids */}
                        <div className="space-y-1.5">
                            <DetailRow label="Created At"  value={fmtTime(item.createdAt)}  />
                            <DetailRow label="Updated At"  value={fmtTime(item.updatedAt)}  />
                            {item.id && <DetailRow label="ID" value={item.id} />}
                            {item.divisionId && <DetailRow label="Division ID" value={item.divisionId} />}
                        </div>

                        {/* email logs */}
                        {hasLogs && (
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2">
                                    Email Logs ({item.reportEmailLogs.length})
                                </p>
                                <div className="space-y-2">
                                    {item.reportEmailLogs.map((log, i) => (
                                        <LogEntry key={log.id} log={log} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export const EmailDashboard = () => {
    const [selectedDate, setSelectedDate] = useState<number>(
        Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
    );
    const [searchQuery,  setSearchQuery]  = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const { data, isLoading, isError } = useGetAllReportEmailStatusQuery(selectedDate);
    const allItems: ReportEmail[] = data?.data?.data?.result ?? [];

    const visibleItems = allItems
        .filter(i => statusFilter === "all" || i.status === statusFilter)
        .filter(i => !searchQuery || (i.divisionName ?? "").toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">

                {/* ── header ── */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Email Dashboard</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-44"
                            value={toDisplayDate(selectedDate)}
                            max={format(new Date(), "yyyy-MM-dd")}
                            onChange={e => setSelectedDate(toUnixSec(e.target.value))}
                        />
                        <input
                            placeholder="Search division..."
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-52"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <div className="flex gap-1 flex-wrap">
                            {FILTER_OPTIONS.map(({ value, label, colorScheme }) => (
                                <Button
                                    key={value} size="sm" borderRadius="lg" colorScheme={colorScheme}
                                    variant={statusFilter === value ? "solid" : "outline"}
                                    onClick={() => setStatusFilter(value)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                        {!isLoading && allItems.length > 0 && (
                            <span className="ml-auto text-sm text-gray-500">
                                {visibleItems.length}{visibleItems.length !== allItems.length ? `/${allItems.length}` : ""} item{allItems.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── summary ── */}
                {!isLoading && allItems.length > 0 && <SummaryStats items={allItems} />}

                {/* ── body ── */}
                <div className="px-6 py-5">
                    {isLoading && (
                        <div className="flex items-center justify-center gap-3 py-16">
                            <Spinner size="sm" color="blue.500" />
                            <span className="text-sm text-gray-500">Loading...</span>
                        </div>
                    )}

                    {isError && !isLoading && (
                        <Alert status="error" borderRadius="lg">
                            <AlertIcon />
                            Failed to load email data. Please try again.
                        </Alert>
                    )}

                    {!isLoading && !isError && allItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                            <span className="text-4xl">📭</span>
                            <span className="text-sm">No email records found for the selected date.</span>
                        </div>
                    )}

                    {!isLoading && !isError && allItems.length > 0 && visibleItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                            <span className="text-4xl">🔍</span>
                            <span className="text-sm">No items match your filters.</span>
                        </div>
                    )}

                    {!isLoading && !isError && visibleItems.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visibleItems.map(item => (
                                <EmailCard
                                    key={item.id ?? `${item.divisionId}-${item.deviceTypeId}`}
                                    item={item}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
