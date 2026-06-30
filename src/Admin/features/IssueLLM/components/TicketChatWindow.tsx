import { useMemo, useState } from "react";
import { IssueTicketInterface, IssueTicketPriority, IssueTicketStatus, TransferMember } from "../interfaces/IssueTicketInterface";
import TicketCard from "./TicketCard";

interface TicketChatWindowProps {
  groupName: string;
  tickets: IssueTicketInterface[];
  onPickup: (ticket: IssueTicketInterface) => void;
  onNotIssue?: (ticket: IssueTicketInterface) => void;
  onViewDetail: (ticket: IssueTicketInterface) => void;
  updatingIds: Set<string>;
  transferMembers?: TransferMember[];
  onAssign?: (ticket: IssueTicketInterface, memberId: string, memberName: string) => void;
}

const STATUS_DOT: Record<IssueTicketStatus, { color: string; label: string }> = {
  OPEN:        { color: "bg-amber-400",   label: "Open"        },
  IN_PROGRESS: { color: "bg-sky-400",     label: "In Progress" },
  RESOLVED:    { color: "bg-lime-400",    label: "Resolved"    },
  CLOSED:      { color: "bg-gray-400",    label: "Closed"      },
};

const STATUSES: IssueTicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"];

const STATUS_RANK: Record<IssueTicketStatus, number> = { OPEN: 0, IN_PROGRESS: 1, CLOSED: 2, RESOLVED: 3 };

type Tab = IssueTicketStatus | "ALL";

const TAB_STYLE: Record<Tab, string> = {
  ALL:         "text-gray-700",
  OPEN:        "text-amber-700",
  IN_PROGRESS: "text-sky-700",
  RESOLVED:    "text-lime-700",
  CLOSED:      "text-gray-500",
};

const SLA_H     = 4;
const PICKUP_MS = 60 * 60 * 1000;

const isOverdue = (t: IssueTicketInterface) => {
  const isDone = t.issueStatus === "CLOSED" || t.issueStatus === "RESOLVED";
  if (t.issueStatus === "OPEN" && (Date.now() - new Date(t.createdAt).getTime()) > SLA_H * 3_600_000) return true;
  if (!t.assignee || isDone) return false;
  const entry = t.statusHistory?.find(h => h.status === "IN_PROGRESS");
  const ms = entry?.changedAt
    ? (String(entry.changedAt).length > 10 ? entry.changedAt : entry.changedAt * 1000)
    : (t.postTime ? (String(t.postTime).length > 10 ? t.postTime : t.postTime * 1000) : null);
  return !!ms && (Date.now() - ms) > PICKUP_MS;
};

type QuickFilter = IssueTicketPriority | "UNASSIGNED" | "OVERDUE";

const CHIP_CFG: { key: QuickFilter; label: string; cls: string; activeClass: string }[] = [
  { key: "CRITICAL",   label: "Critical",   cls: "bg-purple-50 text-purple-700 ring-purple-200",   activeClass: "bg-purple-600 text-white ring-purple-600"   },
  { key: "HIGH",       label: "High",       cls: "bg-red-50 text-red-700 ring-red-200",             activeClass: "bg-red-600 text-white ring-red-600"         },
  { key: "MEDIUM",     label: "Medium",     cls: "bg-amber-50 text-amber-700 ring-amber-200",       activeClass: "bg-amber-500 text-white ring-amber-500"     },
  { key: "LOW",        label: "Low",        cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", activeClass: "bg-emerald-600 text-white ring-emerald-600" },
  { key: "UNASSIGNED", label: "Unassigned", cls: "bg-gray-100 text-gray-600 ring-gray-300",         activeClass: "bg-gray-700 text-white ring-gray-700"       },
  { key: "OVERDUE",    label: "Overdue",    cls: "bg-orange-50 text-orange-700 ring-orange-200",    activeClass: "bg-orange-500 text-white ring-orange-500"   },
];

const TicketChatWindow = ({ groupName, tickets, onPickup, onNotIssue, onViewDetail, updatingIds, transferMembers, onAssign }: TicketChatWindowProps) => {
  const [search,       setSearch]       = useState("");
  const [activeTab,    setActiveTab]    = useState<Tab>("OPEN");
  const [activeChips,  setActiveChips]  = useState<Set<QuickFilter>>(new Set());
  const initial = groupName.charAt(0).toUpperCase();

  const toggleChip = (key: QuickFilter) =>
    setActiveChips(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const tabCounts: Record<Tab, number> = {
    ALL:         tickets.length,
    OPEN:        tickets.filter(t => t.issueStatus === "OPEN").length,
    IN_PROGRESS: tickets.filter(t => t.issueStatus === "IN_PROGRESS").length,
    RESOLVED:    tickets.filter(t => t.issueStatus === "RESOLVED").length,
    CLOSED:      tickets.filter(t => t.issueStatus === "CLOSED").length,
  };

  const tabFiltered = activeTab === "ALL" ? tickets : tickets.filter(t => t.issueStatus === activeTab);

  const filtered = useMemo(() => {
    const priorityChips = (["CRITICAL","HIGH","MEDIUM","LOW"] as IssueTicketPriority[])
      .filter(p => activeChips.has(p));

    return tabFiltered
      .filter(t => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          t.ticketId?.toLowerCase().includes(q)  ||
          t.message?.toLowerCase().includes(q)   ||
          t.senderName?.toLowerCase().includes(q)||
          t.summary?.toLowerCase().includes(q)
        );
      })
      .filter(t => {
        if (activeChips.size === 0) return true;
        if (priorityChips.length > 0 && !priorityChips.includes(t.priority as IssueTicketPriority)) return false;
        if (activeChips.has("UNASSIGNED") && t.assignee) return false;
        if (activeChips.has("OVERDUE") && !isOverdue(t)) return false;
        return true;
      })
      .sort((a, b) => {
        const rankDiff = (STATUS_RANK[a.issueStatus] ?? 99) - (STATUS_RANK[b.issueStatus] ?? 99);
        if (rankDiff !== 0) return rankDiff;
        const numA = parseInt((a.ticketId ?? "").replace(/\D/g, ""), 10) || 0;
        const numB = parseInt((b.ticketId ?? "").replace(/\D/g, ""), 10) || 0;
        return numB - numA;
      });
  }, [tabFiltered, search, activeChips]);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full bg-gray-50 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#075E54] flex-shrink-0 shadow-md">

        {/* Avatar — same style as sidebar */}
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm">{initial}</span>
        </div>

        {/* Group name + status counts */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] text-white truncate leading-tight">{groupName}</p>
          <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
            <span className="text-[11px] text-emerald-300">{tickets.length} tickets</span>
            {STATUSES.map(s => {
              const count = tickets.filter(t => t.issueStatus === s).length;
              if (!count) return null;
              const cfg = STATUS_DOT[s];
              return (
                <span key={s} className="flex items-center gap-1 text-[11px] text-emerald-100">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
                  <span>{cfg.label}: {count}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Search — same rounded-lg style as sidebar */}
        <div className="flex items-center bg-[#065048] rounded-lg px-3 py-1.5 gap-2 w-52 flex-shrink-0 border border-emerald-800">
          <svg className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search messages…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs outline-none bg-transparent text-white placeholder-emerald-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-emerald-300 hover:text-white transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex items-center px-2 bg-white border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        {(["ALL", "OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"] as Tab[]).map(tab => {
          const count  = tabCounts[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                active
                  ? `border-[#075E54] ${TAB_STYLE[tab]} bg-emerald-50/60`
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab === "ALL" ? "All" : tab.replace("_", " ")}
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  active ? "bg-[#075E54] text-white" : "bg-gray-200 text-gray-500"
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Quick-filter chips ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100 flex-wrap flex-shrink-0">
        <span className="text-[10px] font-semibold text-gray-400 uppercase mr-1">Filter:</span>
        {CHIP_CFG.map(chip => {
          const active = activeChips.has(chip.key);
          return (
            <button
              key={chip.key}
              onClick={() => toggleChip(chip.key)}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ring-1 transition-all ${active ? chip.activeClass : chip.cls}`}
            >
              {chip.label}
            </button>
          );
        })}
        {activeChips.size > 0 && (
          <button
            onClick={() => setActiveChips(new Set())}
            className="text-[11px] text-gray-400 hover:text-gray-600 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Ticket list ── */}
      <div className="flex-1 overflow-y-auto py-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm">{search ? "No results found" : "No tickets"}</span>
          </div>
        ) : (
          filtered.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPickup={onPickup}
              onNotIssue={onNotIssue}
              onViewDetail={onViewDetail}
              isUpdating={updatingIds.has(ticket.id)}
              transferMembers={transferMembers}
              onAssign={onAssign}
              hideActions={activeTab === "ALL"}
            />
          ))
        )}
      </div>

      {/* ── Footer count ── */}
      {filtered.length > 0 && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-400 text-center">
          Showing {filtered.length} of {tabCounts[activeTab]} {activeTab === "ALL" ? "" : activeTab.replace("_"," ").toLowerCase() + " "}tickets
        </div>
      )}
    </div>
  );
};

export default TicketChatWindow;


