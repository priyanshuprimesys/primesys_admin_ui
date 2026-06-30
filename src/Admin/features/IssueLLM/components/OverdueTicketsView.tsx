import { useMemo, useState } from "react";
import { useGetAllIssueTickets } from "../hooks/GetAllTicketsHook";
import { IssueTicketInterface, IssueTicketStatus } from "../interfaces/IssueTicketInterface";

/* ── constants ───────────────────────────────────────────────────────────── */

const SLA_H     = 4;
const PICKUP_MS = 60 * 60 * 1000;

/* ── helpers ─────────────────────────────────────────────────────────────── */

const resolveFlat = (raw: unknown): IssueTicketInterface[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as IssueTicketInterface[];
  if (typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  for (const key of ["result", "content", "data", "tickets", "items", "records"])
    if (Array.isArray(obj[key])) return obj[key] as IssueTicketInterface[];
  const first = Object.values(obj)[0];
  if (Array.isArray(first) && (first[0] as IssueTicketInterface)?.ticketId)
    return Object.values(obj).flat() as IssueTicketInterface[];
  return [];
};

const tsMs = (v: number) => (String(v).length > 10 ? v : v * 1000);

const fmtElapsed = (ms: number) => {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const fmtTs = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
  } catch { return "—"; }
};

type OverdueType = "SLA" | "PICKUP";

interface OverdueEntry {
  ticket: IssueTicketInterface;
  type: OverdueType;
  elapsedMs: number;
}

const getOverdue = (tickets: IssueTicketInterface[]): OverdueEntry[] => {
  const result: OverdueEntry[] = [];
  for (const t of tickets) {
    const isDone = t.issueStatus === "CLOSED" || t.issueStatus === "RESOLVED";
    if (isDone) continue;

    // SLA breach: OPEN ticket not yet picked up, older than SLA_H
    if (t.issueStatus === "OPEN" && !t.assignee) {
      const elapsed = Date.now() - new Date(t.createdAt).getTime();
      if (elapsed > SLA_H * 3_600_000) {
        result.push({ ticket: t, type: "SLA", elapsedMs: elapsed });
        continue;
      }
    }

    // Pickup overdue: assigned but not resolved within PICKUP_MS
    if (t.assignee) {
      const ipEntry = t.statusHistory?.find(h => h.status === "IN_PROGRESS");
      const pickupMs = ipEntry?.changedAt
        ? tsMs(ipEntry.changedAt)
        : t.postTime ? tsMs(t.postTime) : null;
      if (pickupMs) {
        const elapsed = Date.now() - pickupMs;
        if (elapsed > PICKUP_MS) {
          result.push({ ticket: t, type: "PICKUP", elapsedMs: elapsed });
        }
      }
    }
  }
  return result.sort((a, b) => b.elapsedMs - a.elapsedMs);
};

/* ── status badge config ─────────────────────────────────────────────────── */

const STATUS_BADGE: Record<IssueTicketStatus, string> = {
  OPEN:        "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  IN_PROGRESS: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  RESOLVED:    "bg-lime-50 text-lime-700 ring-1 ring-lime-200",
  CLOSED:      "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
};

const STATUS_LABEL: Record<IssueTicketStatus, string> = {
  OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed",
};

/* ── component ───────────────────────────────────────────────────────────── */

const OverdueTicketsView = () => {
  const { data, isLoading } = useGetAllIssueTickets();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | OverdueType>("ALL");

  const allTickets = useMemo(() => {
    const inner = (data?.data as { data?: unknown } | undefined)?.data;
    return resolveFlat(inner);
  }, [data]);

  const overdueList = useMemo(() => getOverdue(allTickets), [allTickets]);

  const filtered = useMemo(() => {
    let list = typeFilter === "ALL" ? overdueList : overdueList.filter(e => e.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.ticket.ticketId?.toLowerCase().includes(q) ||
        e.ticket.groupName?.toLowerCase().includes(q) ||
        e.ticket.senderName?.toLowerCase().includes(q) ||
        e.ticket.message?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [overdueList, typeFilter, search]);

  const slaCnt    = overdueList.filter(e => e.type === "SLA").length;
  const pickupCnt = overdueList.filter(e => e.type === "PICKUP").length;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Loading overdue tickets…
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 px-4 pt-3 pb-2 overflow-hidden">

      {/* ── Header stats ── */}
      <div className="flex-shrink-0 mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 ring-1 ring-red-200">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-700">SLA Breach:</span>
          <span className="text-xs font-bold text-red-700">{slaCnt}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 ring-1 ring-orange-200">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-semibold text-orange-700">Pickup Overdue:</span>
          <span className="text-xs font-bold text-orange-700">{pickupCnt}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200">
          <span className="text-xs font-semibold text-gray-600">Total Overdue:</span>
          <span className="text-xs font-bold text-gray-800">{overdueList.length}</span>
        </div>
        <div className="ml-auto text-xs text-gray-400">
          SLA threshold: {SLA_H}h · Pickup threshold: 1h
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* toolbar */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50 flex-wrap">
          {/* type filter */}
          <div className="flex gap-1.5">
            {(["ALL", "SLA", "PICKUP"] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  typeFilter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-300 text-gray-600 hover:border-gray-500"
                }`}
              >
                {f === "ALL" ? "All" : f === "SLA" ? "SLA Breach" : "Pickup Overdue"}
              </button>
            ))}
          </div>

          {/* search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tickets…"
              className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} ticket{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* table */}
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                <th className="px-4 py-3 w-[8%]">Ticket ID</th>
                <th className="px-4 py-3 w-[7%]">Type</th>
                <th className="px-4 py-3 w-[13%]">Group</th>
                <th className="px-4 py-3 w-[10%]">Sender</th>
                <th className="px-4 py-3 w-[22%]">Message</th>
                <th className="px-4 py-3 w-[8%]">Status</th>
                <th className="px-4 py-3 w-[8%]">Priority</th>
                <th className="px-4 py-3 w-[12%]">Assignee</th>
                <th className="px-4 py-3 w-[10%]">Created At</th>
                <th className="px-4 py-3 w-[8%] text-center">Elapsed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    {overdueList.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-sm">No overdue tickets — all clear!</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No results for this filter.</span>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(({ ticket: t, type, elapsedMs }, i) => {
                  const statusBadge = STATUS_BADGE[t.issueStatus] ?? STATUS_BADGE.OPEN;
                  const isHigh = elapsedMs > 8 * 3_600_000;
                  return (
                    <tr
                      key={t.id}
                      className={`transition-colors ${
                        isHigh
                          ? "bg-red-50/60 hover:bg-red-50"
                          : i % 2 === 0 ? "bg-white hover:bg-orange-50/40" : "bg-gray-50/50 hover:bg-orange-50/40"
                      }`}
                    >
                      <td className="px-4 py-3 text-xs font-mono font-bold text-[#075E54] whitespace-nowrap">
                        {t.ticketId || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {type === "SLA" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 ring-1 ring-red-200 px-1.5 py-0.5 rounded-full">
                            SLA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 ring-1 ring-orange-200 px-1.5 py-0.5 rounded-full">
                            Pickup
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 truncate">{t.groupName || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 truncate">{t.senderName || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <p className="line-clamp-2 leading-snug">{t.message || t.summary || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${statusBadge}`}>
                          {STATUS_LABEL[t.issueStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${
                          t.priority === "CRITICAL" ? "text-purple-600" :
                          t.priority === "HIGH"     ? "text-red-600"    :
                          t.priority === "MEDIUM"   ? "text-amber-600"  : "text-emerald-600"
                        }`}>{t.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 truncate">
                        {t.assigneeName || <span className="italic text-gray-400">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtTs(t.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          isHigh
                            ? "bg-red-100 text-red-700 ring-1 ring-red-300 animate-pulse"
                            : "bg-orange-100 text-orange-700 ring-1 ring-orange-200"
                        }`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {fmtElapsed(elapsedMs)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverdueTicketsView;
