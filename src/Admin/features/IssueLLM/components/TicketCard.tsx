import { IssueTicketInterface, IssueTicketStatus, IssueTicketPriority, TransferMember } from "../interfaces/IssueTicketInterface";

interface TicketCardProps {
  ticket: IssueTicketInterface;
  onPickup: (ticket: IssueTicketInterface) => void;
  onNotIssue?: (ticket: IssueTicketInterface) => void;
  onViewDetail: (ticket: IssueTicketInterface) => void;
  isUpdating: boolean;
  transferMembers?: TransferMember[];
  onAssign?: (ticket: IssueTicketInterface, memberId: string, memberName: string) => void;
  hideActions?: boolean;
}

const formatInfoLine = (iso: string) => {
  try {
    const d = new Date(iso);
    const day   = d.getDate();
    const month = d.getMonth() + 1;
    const year  = String(d.getFullYear()).slice(2);
    const hh    = String(d.getHours()).padStart(2, "0");
    const mm    = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hh}:${mm}`;
  } catch {
    return "";
  }
};

const fmtUnix = (ts?: number): string => {
  if (!ts) return "";
  const d = String(ts).length > 10 ? new Date(ts) : new Date(ts * 1000);
  const day   = d.getDate();
  const month = d.getMonth() + 1;
  const year  = String(d.getFullYear()).slice(2);
  const hh    = String(d.getHours()).padStart(2, "0");
  const mm    = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hh}:${mm}`;
};

const getAgeLabel = (iso: string): string => {
  try {
    const ms  = Date.now() - new Date(iso).getTime();
    const min = Math.floor(ms / 60000);
    if (min < 1)  return "just now";
    if (min < 60) return `${min}m ago`;
    const h = Math.floor(min / 60);
    if (h < 24)  return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return ""; }
};

const SLA_HOURS = 4;
const PICKUP_OVERDUE_MS = 60 * 60 * 1000; // 1 hour

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

const PRIORITY_BORDER: Record<IssueTicketPriority, string> = {
  CRITICAL: "border-l-purple-600",
  HIGH:     "border-l-red-500",
  MEDIUM:   "border-l-amber-400",
  LOW:      "border-l-blue-400",
};

const PRIORITY_BADGE: Record<IssueTicketPriority, string> = {
  CRITICAL: "bg-purple-50 text-purple-700 ring-1 ring-purple-300",
  HIGH:     "bg-red-50 text-red-700 ring-1 ring-red-200",
  MEDIUM:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  LOW:      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

const STATUS_BADGE: Record<IssueTicketStatus, string> = {
  OPEN:        "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  IN_PROGRESS: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  RESOLVED:    "bg-lime-50 text-lime-700 ring-1 ring-lime-200",
  CLOSED:      "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
};

const STATUS_LABEL: Record<IssueTicketStatus, string> = {
  OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed",
};

const TicketCard = ({ ticket, onPickup, onNotIssue, isUpdating, transferMembers, onAssign, hideActions }: TicketCardProps) => {
  const isPickedUp = ticket.issueStatus === "IN_PROGRESS";
  const isDone     = ticket.issueStatus === "CLOSED" || ticket.issueStatus === "RESOLVED";

  const borderClass   = PRIORITY_BORDER[ticket.priority] ?? PRIORITY_BORDER.LOW;
  const priorityBadge = PRIORITY_BADGE[ticket.priority]  ?? PRIORITY_BADGE.LOW;
  const statusBadge   = STATUS_BADGE[ticket.issueStatus] ?? STATUS_BADGE.OPEN;
  const ageLabel      = getAgeLabel(ticket.createdAt);
  const isSLA         = ticket.issueStatus === "OPEN" &&
    (Date.now() - new Date(ticket.createdAt).getTime()) > SLA_HOURS * 3_600_000;

  const pickupMs      = getPickupMs(ticket);
  const elapsedMs     = pickupMs ? Date.now() - pickupMs : 0;
  const isPickupOverdue = !!ticket.assignee && !isDone && elapsedMs > PICKUP_OVERDUE_MS;

  const receivedAt  = fmtUnix(ticket.postTime);
  const pickedUpEntry = ticket.statusHistory?.find(h => h.status === "IN_PROGRESS");
  const pickedUpAt  = fmtUnix(pickedUpEntry?.changedAt);
  const doneEntry   = ticket.statusHistory
    ? [...ticket.statusHistory].reverse().find(h => h.status === "CLOSED" || h.status === "RESOLVED")
    : undefined;
  const doneAt      = fmtUnix(doneEntry?.changedAt);
  const doneLabel   = doneEntry?.status === "RESOLVED" ? "Resolved" : doneEntry?.status === "CLOSED" ? "Closed" : "";

  return (
    <div className="mb-2 px-3">
      <div className={`rounded-xl shadow-sm border border-l-[3px] ${borderClass} overflow-hidden hover:shadow-md transition-shadow ${isPickupOverdue ? "bg-orange-50 border-orange-200 ring-1 ring-orange-300" : "bg-white border-gray-100"}`}>

        {/* ── Info strip (first row) ── */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex-wrap">
          <span className="text-base font-mono font-bold text-[#075E54] tracking-wide">{ticket.ticketId ?? "—"}</span>
          <span className="w-px h-4 bg-gray-300 flex-shrink-0" />
          <span className="text-sm"><span className="font-bold text-gray-700">Name:</span> <span className="font-semibold text-gray-800">{ticket.senderName || "—"}</span></span>
          <span className="w-px h-4 bg-gray-300 flex-shrink-0" />
          <span className="text-sm">
            <span className="font-bold text-gray-700">Time:</span>{" "}
            <span className="text-gray-600">{formatInfoLine(ticket.createdAt)}</span>
            {ageLabel && <span className="ml-1.5 text-[11px] text-gray-800">({ageLabel})</span>}
          </span>
          {(isSLA || isPickupOverdue) && (
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              {isSLA && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 ring-1 ring-red-200 px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  SLA
                </span>
              )}
              {isPickupOverdue && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-100 ring-1 ring-orange-300 px-2 py-0.5 rounded-full animate-pulse">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fmtElapsed(elapsedMs)} unresolved
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Time details row ── */}
        {(receivedAt || pickedUpAt || doneAt) && (
          <div className="flex items-center gap-4 px-4 py-1.5 bg-white border-b border-gray-100 flex-wrap">
            {receivedAt && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="font-semibold text-gray-600">Received:</span>
                <span>{receivedAt}</span>
              </span>
            )}
            {pickedUpAt && (
              <>
                {receivedAt && <span className="w-px h-3 bg-gray-200 flex-shrink-0" />}
                <span className="flex items-center gap-1 text-[11px] text-sky-600">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                  <span className="font-semibold">Picked Up:</span>
                  <span>{pickedUpAt}</span>
                </span>
              </>
            )}
            {doneAt && doneLabel && (
              <>
                {(receivedAt || pickedUpAt) && <span className="w-px h-3 bg-gray-200 flex-shrink-0" />}
                <span className={`flex items-center gap-1 text-[11px] ${doneEntry?.status === "RESOLVED" ? "text-lime-700" : "text-emerald-700"}`}>
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">{doneLabel}:</span>
                  <span>{doneAt}</span>
                </span>
              </>
            )}
          </div>
        )}

        {/* ── Message body ── */}
        <div className="px-3 pb-2">
          <p className="text-sm text-gray-600 whitespace-pre-line break-words leading-relaxed line-clamp-3">
            {ticket.message || ticket.summary || "—"}
          </p>
        </div>

        {/* ── Footer: badges + actions ── */}
        <div className="flex items-center justify-between px-3 pb-3 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}>
              {STATUS_LABEL[ticket.issueStatus]}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${priorityBadge}`}>
              {ticket.priority}
            </span>
            {(ticket.assigneeName || hideActions) && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 ring-1 ring-sky-200 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {ticket.assigneeName || "Unassigned"}
              </span>
            )}
          </div>

          {!hideActions && (
            <div className="flex items-center gap-2">
              {/* Assign select — only for unassigned, not-yet-picked-up OPEN tickets */}
              {!isDone && !isPickedUp && !isUpdating && !ticket.assigneeName && onAssign && transferMembers && transferMembers.length > 0 && (
                <select
                  defaultValue=""
                  onChange={e => {
                    const id = e.target.value;
                    if (!id) return;
                    const member = transferMembers.find(m => m.id === id);
                    onAssign(ticket, id, member?.name ?? id);
                    e.target.value = "";
                  }}
                  className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 text-gray-600 bg-white outline-none focus:border-emerald-400 cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <option value="">Assign ▾</option>
                  {transferMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              )}
              {!isDone && !ticket.assignee && onNotIssue && (
                <button
                  disabled={isUpdating || isPickedUp}
                  onClick={() => onNotIssue(ticket)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Not an issue
                </button>
              )}
              {!isDone && !ticket.assignee && (
                <button
                  disabled={isUpdating || isPickedUp}
                  onClick={() => onPickup(ticket)}
                  className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold bg-[#075E54] hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isUpdating ? "…" : "Pickup"}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TicketCard;


