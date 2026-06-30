import { useState } from "react";
import { IssueTicketInterface, IssueTicketStatus } from "../interfaces/IssueTicketInterface";
import { TicketPriorityBadge, TicketStatusBadge } from "./TicketStatusBadge";

const STATUS_RANK: Record<IssueTicketStatus, number> = { OPEN: 0, IN_PROGRESS: 1, CLOSED: 2, RESOLVED: 3 };

const PICKUP_OVERDUE_MS = 60 * 60 * 1000;

const getPickupMs = (ticket: IssueTicketInterface): number | null => {
  const entry = ticket.statusHistory?.find(h => h.status === "IN_PROGRESS");
  if (entry?.changedAt) {
    const ts = entry.changedAt;
    return String(ts).length > 10 ? ts : ts * 1000;
  }
  if (ticket.assignee && ticket.postTime) {
    const ts = ticket.postTime;
    return String(ts).length > 10 ? ts : ts * 1000;
  }
  return null;
};

const fmtElapsed = (ms: number) => {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

interface TicketGroupSectionProps {
  groupName: string;
  tickets: IssueTicketInterface[];
}

const formatDate = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
};

const TicketGroupSection = ({ groupName, tickets }: TicketGroupSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const openCount = tickets.filter((t) => t.issueStatus === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.issueStatus === "IN_PROGRESS").length;

  return (
    <div className="mb-4 border border-zinc-300 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-dark text-white"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold">{groupName}</span>
          <span className="text-xs bg-zinc-600 px-2 py-0.5 rounded-full">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </span>
          {openCount > 0 && (
            <span className="text-xs bg-red-700 px-2 py-0.5 rounded-full">
              {openCount} open
            </span>
          )}
          {inProgressCount > 0 && (
            <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded-full">
              {inProgressCount} in progress
            </span>
          )}
        </div>
        <span className="text-sm ml-4">{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-100 text-left">
                <th className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap">Ticket ID</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Priority</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Category</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Summary</th>
                <th className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap">Sender</th>
                <th className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tickets
                .slice()
                .sort((a, b) => {
                  const rankDiff = (STATUS_RANK[a.issueStatus] ?? 99) - (STATUS_RANK[b.issueStatus] ?? 99);
                  if (rankDiff !== 0) return rankDiff;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((ticket) => {
                  const isDone   = ticket.issueStatus === "CLOSED" || ticket.issueStatus === "RESOLVED";
                  const pickupMs = !isDone && ticket.assignee ? getPickupMs(ticket) : null;
                  const elapsed  = pickupMs ? Date.now() - pickupMs : 0;
                  const overdue  = !!pickupMs && elapsed > PICKUP_OVERDUE_MS;
                  return (
                  <tr
                    key={ticket.id}
                    className={`border-t border-gray-200 transition-colors ${overdue ? "bg-orange-50 hover:bg-orange-100" : "hover:bg-zinc-50"}`}
                  >
                    <td className="px-4 py-2 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                      {ticket.ticketId}
                    </td>
                    <td className="px-4 py-2">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1 items-start">
                        <TicketStatusBadge status={ticket.issueStatus} />
                        {overdue && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-100 ring-1 ring-orange-300 px-1.5 py-0.5 rounded-full animate-pulse">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {fmtElapsed(elapsed)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-600 capitalize whitespace-nowrap">
                      {ticket.category ?? "—"}
                    </td>
                    <td className="px-4 py-2 max-w-xs">
                      <p className="truncate text-gray-700" title={ticket.summary ?? ticket.message}>
                        {ticket.summary || ticket.message || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                      {ticket.senderName || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                      {formatDate(ticket.createdAt)}
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

export default TicketGroupSection;
