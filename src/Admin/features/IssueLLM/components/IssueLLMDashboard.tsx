import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IssueTicketInterface, IssueTicketStatus } from "../interfaces/IssueTicketInterface";
import { useGetAllIssueTickets } from "../hooks/GetAllTicketsHook";
import { get_all_issue_tickets_query_key } from "../queryKey/queryKey";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { pickupIssueTicket } from "../services/api";
import TicketReadOnlyModal from "./TicketReadOnlyModal";
import TicketDetailModal from "./TicketDetailModal";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const fmtIso = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
  } catch { return "—"; }
};

const fmtTs = (ts?: number) => {
  if (!ts) return "—";
  const d = String(ts).length > 10 ? new Date(ts) : new Date(ts * 1000);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
};

const resolveFlat = (raw: unknown): IssueTicketInterface[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as IssueTicketInterface[];
  if (typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  for (const key of ["result", "content", "data", "tickets", "items", "records"])
    if (Array.isArray(obj[key])) return obj[key] as IssueTicketInterface[];
  const first = Object.values(obj)[0];
  if (Array.isArray(first) && first.length > 0 && (first[0] as IssueTicketInterface).ticketId)
    return Object.values(obj).flat() as IssueTicketInterface[];
  return [];
};

/* ── status config ───────────────────────────────────────────────────────── */

const STATUS_CFG: Record<IssueTicketStatus, { label: string; bg: string; text: string; dot: string; bar: string }> = {
  OPEN:        { label: "Open",        bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400",   bar: "bg-amber-400"   },
  IN_PROGRESS: { label: "In Progress", bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500",     bar: "bg-red-500"     },
  RESOLVED:    { label: "Resolved",    bg: "bg-lime-100",    text: "text-lime-700",    dot: "bg-lime-500",    bar: "bg-lime-500"    },
  CLOSED:      { label: "Closed",      bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" },
};

const STATUS_ORDER: IssueTicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"];

const STATUS_RANK: Record<IssueTicketStatus, number> = { OPEN: 0, IN_PROGRESS: 1, CLOSED: 2, RESOLVED: 3 };

const PICKUP_OVERDUE_MS = 60 * 60 * 1000;

const tsMs = (ts: number) => (String(ts).length > 10 ? ts : ts * 1000);

const isToday = (ms: number) =>
  new Date(ms).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);

/** Pickup time straight from status_history: PICKED_UP, falling back to IN_PROGRESS. */
const getPickedUpMs = (ticket: IssueTicketInterface): number | null => {
  const entry =
    ticket.statusHistory?.find(h => h.status === "PICKED_UP") ??
    ticket.statusHistory?.find(h => h.status === "IN_PROGRESS");
  if (entry?.changedAt) return tsMs(entry.changedAt);
  // Manually-created tickets are self-assigned at creation with no pickup entry,
  // so they're considered picked up at the moment they were created.
  if (ticket.assignee && ticket.createdAt) return new Date(ticket.createdAt).getTime();
  return null;
};

/** Pickup time used for overdue maths. */
const getPickupMs = (ticket: IssueTicketInterface): number | null => getPickedUpMs(ticket);

/** Time the ticket was closed or resolved (latest such entry in status_history). */
const getDoneMs = (ticket: IssueTicketInterface): number | null => {
  const entry = [...(ticket.statusHistory ?? [])].reverse()
    .find(h => h.status === "CLOSED" || h.status === "RESOLVED");
  return entry?.changedAt ? tsMs(entry.changedAt) : null;
};

const fmtElapsed = (ms: number) => {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const isPickupOverdue = (ticket: IssueTicketInterface): boolean => {
  const isDone = ticket.issueStatus === "CLOSED" || ticket.issueStatus === "RESOLVED";
  if (!ticket.assignee || isDone) return false;
  const pickupMs = getPickupMs(ticket);
  return !!pickupMs && (Date.now() - pickupMs) > PICKUP_OVERDUE_MS;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

/* ── component ───────────────────────────────────────────────────────────── */

interface Props { filterByUser?: boolean; }

const PAGE_SIZE = 25;

const IssueLLMDashboard = ({ filterByUser = false }: Props) => {
  const { data, isLoading, dataUpdatedAt } = useGetAllIssueTickets();
  const queryClient = useQueryClient();
  const { userDetail } = useContext(UserDetailContext);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pickingUpId, setPickingUpId] = useState<string | null>(null);
  const [detailTicket, setDetailTicket] = useState<IssueTicketInterface | null>(null);
  const [editTicket,   setEditTicket]   = useState<IssueTicketInterface | null>(null);

  const { mutateAsync: doPickup } = useMutation({ mutationFn: pickupIssueTicket });

  const [dateFrom, setDateFrom] = useState(todayStr());
  const [dateTo,   setDateTo]   = useState(todayStr());
  const [appliedFrom, setAppliedFrom] = useState(todayStr());
  const [appliedTo,   setAppliedTo]   = useState(todayStr());
  const [pickedTodayOnly, setPickedTodayOnly] = useState(filterByUser);

  const handleApplyRange = () => {
    setAppliedFrom(dateFrom);
    setAppliedTo(dateTo);
    setPage(1);
  };

  const userId    = userDetail.data.result.divisionId;
  const userName  = userDetail.data.result.userName;

  const innerData = (data?.data as { data?: unknown } | undefined)?.data;
  const allTickets = resolveFlat(innerData);

  const tickets = useMemo(() => {
    const fromMs = new Date(appliedFrom + "T00:00:00").getTime();
    const toMs   = new Date(appliedTo   + "T23:59:59").getTime();
    const scoped = filterByUser ? allTickets.filter(t => t.assignee === userId) : allTickets;
    const base = pickedTodayOnly
      ? scoped.filter(t => {
          const m = getPickedUpMs(t);
          return m !== null && isToday(m);
        })
      : scoped.filter(t => {
          const ts = new Date(t.createdAt).getTime();
          if (ts >= fromMs && ts <= toMs) return true;
          // Carry over still-unresolved issues from previous days: an OPEN or
          // IN_PROGRESS ticket stays visible regardless of when it was created,
          // as long as it wasn't created after the range end.
          const unresolved = t.issueStatus === "OPEN" || t.issueStatus === "IN_PROGRESS";
          return unresolved && ts <= toMs;
        });
    return [...base].sort((a, b) => {
      const rankDiff = (STATUS_RANK[a.issueStatus] ?? 99) - (STATUS_RANK[b.issueStatus] ?? 99);
      if (rankDiff !== 0) return rankDiff;
      const numA = parseInt((a.ticketId ?? "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.ticketId ?? "").replace(/\D/g, ""), 10) || 0;
      return numB - numA;
    });
  }, [allTickets, filterByUser, userId, appliedFrom, appliedTo, pickedTodayOnly]);

  const counts = useMemo(() => ({
    OPEN:        tickets.filter(t => t.issueStatus === "OPEN").length,
    IN_PROGRESS: tickets.filter(t => t.issueStatus === "IN_PROGRESS").length,
    RESOLVED:    tickets.filter(t => t.issueStatus === "RESOLVED").length,
    CLOSED:      tickets.filter(t => t.issueStatus === "CLOSED").length,
  }), [tickets]);

  const total = tickets.length;

  const filtered = useMemo(() => {
    if (!search.trim()) return tickets;
    const q = search.toLowerCase();
    return tickets.filter(t =>
      t.groupName?.toLowerCase().includes(q) ||
      t.senderName?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q) ||
      t.summary?.toLowerCase().includes(q) ||
      t.issueStatus?.toLowerCase().includes(q)
    );
  }, [tickets, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  /* ── auto-refresh: last updated timer ── */
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);
  const lastUpdatedText = dataUpdatedAt
    ? (() => {
        const s = Math.floor((now - dataUpdatedAt) / 1000);
        if (s < 10) return "just now";
        if (s < 60) return `${s}s ago`;
        return `${Math.floor(s / 60)}m ago`;
      })()
    : null;

  /* ── new-tickets banner ── */
  const prevOpenRef = useRef<number | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    const cur = allTickets.filter(t => t.issueStatus === "OPEN").length;
    if (prevOpenRef.current !== null && cur > prevOpenRef.current) setShowBanner(true);
    prevOpenRef.current = cur;
  }, [allTickets]);

  /* ── today's summary (filterByUser only) ── */
  const todaySummary = useMemo(() => {
    if (!filterByUser) return null;
    const myAll = allTickets.filter(t => t.assignee === userId);

    const pickedToday = myAll.filter(t => {
      const m = getPickedUpMs(t);
      return m !== null && isToday(m);
    }).length;

    const resolvedToday = myAll.filter(t => {
      const m = getDoneMs(t);
      return m !== null && isToday(m);
    }).length;

    const pending = myAll.filter(t =>
      t.issueStatus === "OPEN" || t.issueStatus === "IN_PROGRESS"
    ).length;

    // Avg resolution time: pickup → close/resolve, over tickets resolved today.
    const responseMins = myAll
      .map(t => {
        const done   = getDoneMs(t);
        const pickup = getPickedUpMs(t);
        if (done === null || pickup === null || !isToday(done)) return null;
        return (done - pickup) / 60_000;
      })
      .filter((v): v is number => v !== null && v >= 0);

    const avg = responseMins.length
      ? responseMins.reduce((a, b) => a + b, 0) / responseMins.length
      : null;
    const fmtMin = (m: number) => m < 60 ? `${Math.round(m)}m` : `${Math.floor(m / 60)}h ${Math.round(m % 60)}m`;

    return { pickedToday, resolvedToday, pending, avgResponse: avg !== null ? fmtMin(avg) : "—" };
  }, [allTickets, filterByUser, userId]);

  /* ── export CSV ── */
  const exportCSV = () => {
    const headers = ["Ticket ID","Group","Sender","Message","Status","Priority","Assignee","Created At"];
    const rows = filtered.map(t => [
      t.ticketId, t.groupName, t.senderName ?? "",
      (t.message || t.summary || "").replace(/\n/g, " "),
      t.issueStatus, t.priority, t.assigneeName ?? "", t.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `issues-${appliedFrom}-to-${appliedTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePickup = async (ticket: IssueTicketInterface) => {
    if (pickingUpId) return;
    setPickingUpId(ticket.id);
    try {
      await doPickup({ id: ticket.id, userId, userName });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to pick up ticket");
    } finally {
      setPickingUpId(null);
    }
  };

  return (
    <>
    <div className="h-full flex flex-col bg-gray-50 px-4 pt-3 pb-2 overflow-hidden">

      {/* ── New-tickets banner ── */}
      {showBanner && (
        <div className="flex-shrink-0 mb-2 flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md">
          <svg className="w-4 h-4 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          New tickets have arrived since your last view.
          <button
            onClick={() => setShowBanner(false)}
            className="ml-auto text-emerald-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Today's summary (my dashboard only) ── */}
      {todaySummary && (
        <div className="flex-shrink-0 mb-3 flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Today</span>
          {[
            { label: "Picked Up",  value: todaySummary.pickedToday,   color: "text-indigo-700 bg-indigo-50 ring-indigo-200"   },
            { label: "Resolved",   value: todaySummary.resolvedToday,  color: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
            { label: "Pending",    value: todaySummary.pending,        color: "text-amber-700 bg-amber-50 ring-amber-200"       },
            { label: "Avg Response", value: todaySummary.avgResponse, color: "text-sky-700 bg-sky-50 ring-sky-200"             },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1 rounded-full ring-1 ${s.color}`}>
              <span className="text-xs font-semibold">{s.label}:</span>
              <span className="text-xs font-bold">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 mb-3 flex flex-wrap items-center gap-3">
        {filterByUser && (
          <span className="text-sm font-semibold text-gray-600 mr-1">{userName} status:</span>
        )}
        {STATUS_ORDER.map(s => {
          const cfg = STATUS_CFG[s];
          return (
            <div key={s} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${cfg.bg} border border-opacity-30`}>
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}:</span>
              <span className={`text-xs font-bold ${cfg.text}`}>{counts[s]}</span>
            </div>
          );
        })}
        <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200">
          <span className="text-xs font-semibold text-gray-600">Total Issue:</span>
          <span className="text-xs font-bold text-gray-800">{total}</span>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      {total > 0 && (
        <div className="flex-shrink-0 mb-3 flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
          {STATUS_ORDER.map(s => {
            const pct = (counts[s] / total) * 100;
            return pct > 0 ? (
              <div
                key={s}
                style={{ width: `${pct}%` }}
                className={`${STATUS_CFG[s].bar} transition-all duration-500`}
                title={`${STATUS_CFG[s].label}: ${counts[s]}`}
              />
            ) : null;
          })}
        </div>
      )}

      {/* ── Table card ─────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* toolbar */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
          {/* date range */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">From</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={e => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">To</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={e => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              onClick={handleApplyRange}
              disabled={pickedTodayOnly}
              className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Apply
            </button>
            <button
              onClick={() => { setPickedTodayOnly(v => !v); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ring-1 transition-colors ${
                pickedTodayOnly
                  ? "bg-indigo-600 text-white ring-indigo-600"
                  : "bg-white text-indigo-700 ring-indigo-200 hover:bg-indigo-50"
              }`}
              title="Show only tickets picked up today (ignores the date range)"
            >
              Picked up today
            </button>
          </div>

          {/* search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by group, sender, message…"
              className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {!filterByUser && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors whitespace-nowrap"
                title="Export filtered list to CSV"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            )}
            <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            {lastUpdatedText && (
              <span className="text-[11px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {lastUpdatedText}
              </span>
            )}
          </div>
        </div>

        {/* table — only this section scrolls */}
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                <th className="px-4 py-3 w-[9%]">Ticket ID</th>
                <th className="px-4 py-3 w-[14%]">Group Name</th>
                <th className="px-4 py-3 w-[10%]">Sender Name</th>
                <th className="px-4 py-3 w-[21%]">Message</th>
                <th className="px-4 py-3 w-[10%]">Sent Time</th>
                <th className="px-4 py-3 w-[10%]">Picked At</th>
                <th className="px-4 py-3 w-[8%]">Status</th>
                <th className="px-4 py-3 w-[11%]">Assignee</th>
                <th className="px-4 py-3 w-[11%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                    Loading tickets…
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                pageData.map((ticket, i) => {
                  const cfg      = STATUS_CFG[ticket.issueStatus] ?? STATUS_CFG.OPEN;
                  const overdue  = isPickupOverdue(ticket);
                  const pickupMs = overdue ? getPickupMs(ticket) : null;
                  const elapsed  = pickupMs ? Date.now() - pickupMs : 0;
                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => !filterByUser && setDetailTicket(ticket)}
                      className={`transition-colors ${!filterByUser ? "cursor-pointer" : ""} ${overdue ? "bg-orange-50 hover:bg-orange-100" : `hover:bg-emerald-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}`}
                    >
                      <td className="px-4 py-3 text-xs font-mono font-semibold text-gray-700 whitespace-nowrap">
                        {ticket.ticketId || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 truncate">
                        {ticket.groupName || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 truncate">
                        {ticket.senderName || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p className="line-clamp-2 leading-snug">
                          {ticket.message || ticket.summary || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {fmtIso(ticket.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {fmtTs(getPickedUpMs(ticket) ?? undefined)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
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
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold truncate ${
                          ticket.assigneeName ? "text-sky-700" : "text-gray-400 italic"
                        }`}>
                          {ticket.assigneeName ? (
                            <>
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {ticket.assigneeName}
                            </>
                          ) : "Unassigned"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Pick Up / Picked badge */}
                          {ticket.assignee ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              Picked
                            </span>
                          ) : (
                            <button
                              onClick={e => { e.stopPropagation(); handlePickup(ticket); }}
                              disabled={pickingUpId === ticket.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                              title="Pick up this ticket"
                            >
                              {pickingUpId === ticket.id ? (
                                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                </svg>
                              )}
                              Pick Up
                            </button>
                          )}

                          {/* Edit button — Issue Dashboard only */}
                          {filterByUser && (
                            <button
                              onClick={e => { e.stopPropagation(); setEditTicket(ticket); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[10px] font-bold hover:bg-gray-700 transition-colors whitespace-nowrap"
                              title="Edit ticket"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* pagination — pinned at bottom */}
        <div className="flex-shrink-0 flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-gray-50">
          <span className="text-xs text-gray-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md text-xs font-medium bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              ‹‹ Prev
            </button>
            <span className="text-xs text-gray-500 font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md text-xs font-medium bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next ››
            </button>
          </div>
        </div>
      </div>

    </div>

    {detailTicket && (
      <TicketReadOnlyModal
        ticket={detailTicket}
        isOpen
        onClose={() => setDetailTicket(null)}
      />
    )}

    {editTicket && (
      <TicketDetailModal
        ticket={editTicket}
        isOpen
        onClose={() => {
          setEditTicket(null);
          queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
        }}
      />
    )}
    </>
  );
};

export default IssueLLMDashboard;


