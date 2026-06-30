import { useContext, useEffect, useMemo, useState } from "react";
import { useGetAllIssueTickets } from "./hooks/GetAllTicketsHook";
import { usePickupTicket } from "./hooks/PickupTicketHook";
import { IssueTicketInterface, TransferMember } from "./interfaces/IssueTicketInterface";
import GroupSidebar from "./components/GroupSidebar";
import TicketChatWindow from "./components/TicketChatWindow";
import TicketDetailModal from "./components/TicketDetailModal";
import CreateTicketModal from "./components/CreateTicketModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_all_issue_tickets_query_key } from "./queryKey/queryKey";
import { closeIssueTicket, getTransferMembers, transferIssueTicket, updateIssueTicket } from "./services/api";
import { UserDetailContext } from "../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

const todayStr = () => new Date().toISOString().slice(0, 10);
const daysAgoStr = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

const groupByGroupName = (flat: IssueTicketInterface[]) =>
  flat.reduce<Record<string, IssueTicketInterface[]>>((acc, t) => {
    const key = t.groupName || "Unknown Group";
    (acc[key] ??= []).push(t);
    return acc;
  }, {});

const resolveTickets = (
  raw: unknown
): { tickets: IssueTicketInterface[]; groupedTickets: Record<string, IssueTicketInterface[]> } => {
  if (!raw) return { tickets: [], groupedTickets: {} };

  if (Array.isArray(raw)) {
    const tickets = raw as IssueTicketInterface[];
    return { tickets, groupedTickets: groupByGroupName(tickets) };
  }

  if (typeof raw !== "object") return { tickets: [], groupedTickets: {} };

  const obj = raw as Record<string, unknown>;

  for (const key of ["result", "content", "data", "tickets", "items", "records"]) {
    if (Array.isArray(obj[key])) {
      const tickets = obj[key] as IssueTicketInterface[];
      return { tickets, groupedTickets: groupByGroupName(tickets) };
    }
  }

  const firstVal = Object.values(obj)[0];
  if (Array.isArray(firstVal) && firstVal.length > 0 && (firstVal[0] as IssueTicketInterface).ticketId) {
    const groupedTickets = obj as Record<string, IssueTicketInterface[]>;
    const tickets = Object.values(groupedTickets).flat();
    return { tickets, groupedTickets };
  }

  return { tickets: [], groupedTickets: {} };
};

const IssueLLM = () => {
  const { data, isLoading, isError } = useGetAllIssueTickets();
  const queryClient = useQueryClient();
  const { mutateAsync: pickupTicket } = usePickupTicket();
  const { mutateAsync: doTransfer }      = useMutation({ mutationFn: transferIssueTicket });
  const { mutateAsync: doUpdateStatus }  = useMutation({ mutationFn: updateIssueTicket });
  const { mutateAsync: doClose }         = useMutation({ mutationFn: closeIssueTicket });
  const { userDetail } = useContext(UserDetailContext);
  const { data: membersData } = useQuery({
    queryKey: ["transfer-members"],
    queryFn:  getTransferMembers,
    staleTime: 5 * 60 * 1000,
  });
  const transferMembers: TransferMember[] =
    ((membersData?.data as any)?.data?.result ?? []);
  const canAssign = userDetail.data.result.roleId === 20;
  const [selectedGroup,  setSelectedGroup]  = useState<string | null>(null);
  const [updatingIds,    setUpdatingIds]    = useState<Set<string>>(new Set());
  const [detailTicket,   setDetailTicket]   = useState<IssueTicketInterface | null>(null);
  const [createOpen,     setCreateOpen]     = useState(false);
  const [globalSearch,   setGlobalSearch]   = useState("");
  const [globalFocus,    setGlobalFocus]    = useState(false);
  const [assignedIds,    setAssignedIds]    = useState<Set<string>>(new Set());

  const [dateFrom,     setDateFrom]     = useState(daysAgoStr(30));
  const [dateTo,       setDateTo]       = useState(todayStr());
  const [appliedFrom,  setAppliedFrom]  = useState(daysAgoStr(30));
  const [appliedTo,    setAppliedTo]    = useState(todayStr());

  const handleApplyRange = () => { setAppliedFrom(dateFrom); setAppliedTo(dateTo); };

  const innerData = (data?.data as { data?: unknown } | undefined)?.data;
  const { tickets: allTickets } = useMemo(() => resolveTickets(innerData), [innerData]);

  const tickets = useMemo(() => {
    const fromMs = new Date(appliedFrom + "T00:00:00").getTime();
    const toMs   = new Date(appliedTo   + "T23:59:59").getTime();
    return allTickets.filter(t => {
      const ts = new Date(t.createdAt).getTime();
      return ts >= fromMs && ts <= toMs;
    });
  }, [allTickets, appliedFrom, appliedTo]);

  const groupedTickets = useMemo(() => groupByGroupName(tickets), [tickets]);

  /* ── metrics ── */
  const openCount     = useMemo(() => tickets.filter(t => t.issueStatus === "OPEN").length,        [tickets]);
  const ipCount       = useMemo(() => tickets.filter(t => t.issueStatus === "IN_PROGRESS").length, [tickets]);
  const resolvedCount = useMemo(() => tickets.filter(t => t.issueStatus === "RESOLVED").length,    [tickets]);
  const closedCount   = useMemo(() => tickets.filter(t => t.issueStatus === "CLOSED").length,      [tickets]);
  const overdueCount  = useMemo(() => {
    const now = Date.now() / 1000;
    return tickets.filter(t =>
      t.dueDate && t.dueDate < now &&
      t.issueStatus !== "CLOSED" && t.issueStatus !== "RESOLVED"
    ).length;
  }, [tickets]);

  /* ── global search ── */
  const globalResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return tickets.filter(t =>
      t.ticketId?.toLowerCase().includes(q)   ||
      t.senderName?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q)    ||
      t.groupName?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [tickets, globalSearch]);

  // auto-select first group on initial load
  useEffect(() => {
    const groups = Object.keys(groupedTickets);
    if (selectedGroup === null && groups.length > 0) {
      setSelectedGroup(groups[0]);
    }
    // deselect if the group was filtered out
    if (selectedGroup !== null && groups.length > 0 && !groupedTickets[selectedGroup]) {
      setSelectedGroup(groups[0]);
    }
  }, [groupedTickets, selectedGroup]);

  const selectedTickets = selectedGroup
    ? (groupedTickets[selectedGroup] ?? []).filter(t => !assignedIds.has(t.id))
    : [];

  const handlePickup = async (ticket: IssueTicketInterface) => {
    const { divisionId, userName } = userDetail.data.result;
    if (!divisionId || !userName) {
      alert("Your account details haven't loaded yet. Please refresh the page and try again.");
      return;
    }
    setUpdatingIds(prev => new Set(prev).add(ticket.id));
    try {
      await pickupTicket({
        id: ticket.id,
        userId: divisionId,
        userName,
      });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      setDetailTicket(ticket);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = axiosErr?.response?.data?.message ?? "Failed to pickup ticket";
      const status = axiosErr?.response?.status;
      console.error(`Pickup failed [${status}]:`, axiosErr?.response?.data);
      alert(msg);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(ticket.id);
        return next;
      });
    }
  };

  const handleNotAnIssue = async (ticket: IssueTicketInterface) => {
    const { divisionId } = userDetail.data.result;
    if (!divisionId) {
      alert("Your account details haven't loaded yet. Please refresh the page and try again.");
      return;
    }
    if (!window.confirm(`Mark ticket ${ticket.ticketId ?? ""} as "Not an issue"? It will be closed.`)) {
      return;
    }
    setUpdatingIds(prev => new Set(prev).add(ticket.id));
    try {
      await doClose({
        id: ticket.id,
        closedBy: divisionId,
        note: "Not an issue",
      });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = axiosErr?.response?.data?.message ?? "Failed to close ticket";
      console.error(`Close (not an issue) failed [${axiosErr?.response?.status}]:`, axiosErr?.response?.data);
      alert(msg);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(ticket.id);
        return next;
      });
    }
  };

  const handleAssign = async (ticket: IssueTicketInterface, memberId: string, memberName: string) => {
    const { divisionId } = userDetail.data.result;
    if (!divisionId) {
      alert("Your account details haven't loaded yet. Please refresh the page and try again.");
      return;
    }
    setAssignedIds(prev => new Set(prev).add(ticket.id));
    try {
      await doTransfer({
        id: ticket.id,
        toAssignee: memberId,
        toAssigneeName: memberName,
        transferredBy: divisionId,
        reason: "Assigned by admin",
      });
      await doUpdateStatus({
        id: ticket.id,
        updatedBy: divisionId,
        issueStatus: "IN_PROGRESS",
      });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
    } catch (err: unknown) {
      setAssignedIds(prev => { const s = new Set(prev); s.delete(ticket.id); return s; });
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Assignment failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Loading tickets…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-600 text-sm">
        Failed to load tickets. Please refresh.
      </div>
    );
  }

  if (allTickets.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-2 text-gray-400 text-sm">
        <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>No tickets found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top bar: date range + global search + New Ticket ── */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-gray-200 bg-white flex-shrink-0 flex-wrap">
        {/* Date range */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500">From</span>
          <input
            type="date" value={dateFrom} max={dateTo}
            onChange={e => setDateFrom(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <span className="text-xs font-semibold text-gray-500">To</span>
          <input
            type="date" value={dateTo} min={dateFrom}
            onChange={e => setDateTo(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            onClick={handleApplyRange}
            className="px-3 py-1 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Global search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            onFocus={() => setGlobalFocus(true)}
            onBlur={() => setTimeout(() => setGlobalFocus(false), 150)}
            placeholder="Search tickets by ID, name, message…"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 bg-gray-50"
          />
          {globalFocus && globalResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {globalResults.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onMouseDown={() => { setGlobalSearch(""); setDetailTicket(t); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0 transition-colors"
                >
                  <span className="font-mono text-[11px] font-bold text-[#075E54] flex-shrink-0">{t.ticketId}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{t.senderName || "—"}</p>
                    <p className="text-[11px] text-gray-400 truncate">{t.groupName}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    t.issueStatus === "OPEN"        ? "bg-amber-100 text-amber-700" :
                    t.issueStatus === "IN_PROGRESS" ? "bg-sky-100 text-sky-700"     :
                    t.issueStatus === "RESOLVED"    ? "bg-lime-100 text-lime-700"   :
                                                      "bg-gray-100 text-gray-500"
                  }`}>{t.issueStatus.replace("_", " ")}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Ticket */}
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#075E54] hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-sm flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* ── Metrics strip ── */}
      {tickets.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-b border-gray-200 flex-shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            Open: <span className="font-bold">{openCount}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200">
            In Progress: <span className="font-bold">{ipCount}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-50 text-lime-700 ring-1 ring-lime-200">
            Resolved: <span className="font-bold">{resolvedCount}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200">
            Closed: <span className="font-bold">{closedCount}</span>
          </span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              Overdue: <span className="font-bold">{overdueCount}</span>
            </span>
          )}
          <span className="ml-auto text-[11px] text-gray-400">{tickets.length} total · {Object.keys(groupedTickets).length} groups</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden rounded-lg border border-zinc-200 shadow-md">
      <GroupSidebar
        groupedTickets={groupedTickets}
        selectedGroup={selectedGroup}
        onSelect={setSelectedGroup}
      />

      {selectedGroup ? (
        <TicketChatWindow
          groupName={selectedGroup}
          tickets={selectedTickets}
          onPickup={handlePickup}
          onNotIssue={handleNotAnIssue}
          onViewDetail={ticket => setDetailTicket(ticket)}
          updatingIds={updatingIds}
          transferMembers={canAssign ? transferMembers : undefined}
          onAssign={canAssign ? handleAssign : undefined}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">Select a group to view tickets</p>
          <p className="text-xs text-gray-400">{Object.keys(groupedTickets).length} groups · {tickets.length} tickets</p>
        </div>
      )}

      {detailTicket && (
        <TicketDetailModal
          ticket={detailTicket}
          isOpen={!!detailTicket}
          onClose={() => setDetailTicket(null)}
        />
      )}
      </div>

      <CreateTicketModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default IssueLLM;


