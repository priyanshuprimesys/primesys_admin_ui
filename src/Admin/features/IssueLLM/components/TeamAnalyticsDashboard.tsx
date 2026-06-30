import { useContext, useMemo, useRef, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip,
  AreaChart, Area,
} from "recharts";
import { useGetAllIssueTickets } from "../hooks/GetAllTicketsHook";
import { IssueTicketInterface, IssueTicketPriority, IssueTicketStatus } from "../interfaces/IssueTicketInterface";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import TicketDetailModal from "./TicketDetailModal";

/* ── helpers ─────────────────────────────────────────────────────────────── */

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

const tsMs = (ts: number) => (String(ts).length > 10 ? ts : ts * 1000);

/* Pickup time from status_history: PICKED_UP, falling back to IN_PROGRESS.
   Manually-created (self-assigned) tickets fall back to createdAt. */
const getPickupMs = (ticket: IssueTicketInterface): number | null => {
  const entry =
    ticket.statusHistory?.find(h => h.status === "PICKED_UP") ??
    ticket.statusHistory?.find(h => h.status === "IN_PROGRESS");
  if (entry?.changedAt) return tsMs(entry.changedAt);
  if (ticket.assignee && ticket.createdAt) return new Date(ticket.createdAt).getTime();
  return null;
};

const toDateStr    = (d: Date) => d.toISOString().slice(0, 10);
const today        = () => toDateStr(new Date());
const daysAgo      = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return toDateStr(d); };
const startOfWeek  = () => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return toDateStr(d); };
const startOfMonth = () => { const d = new Date(); d.setDate(1); return toDateStr(d); };
const shortDate    = (iso: string) => { const d = new Date(iso); return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`; };
const fmtDuration  = (hours: number) => {
  if (!isFinite(hours) || hours < 0) return "—";
  if (hours < 1)  return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
};

/* ── date presets ────────────────────────────────────────────────────────── */

type Preset = "today" | "yesterday" | "week" | "month" | "custom";

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today",     label: "Today"      },
  { key: "yesterday", label: "Yesterday"  },
  { key: "week",      label: "This Week"  },
  { key: "month",     label: "This Month" },
  { key: "custom",    label: "Custom"     },
];

const presetRange = (key: Preset): { from: string; to: string } => {
  const t = today();
  switch (key) {
    case "today":     return { from: t,            to: t };
    case "yesterday": return { from: daysAgo(1),   to: daysAgo(1) };
    case "week":      return { from: startOfWeek(), to: t };
    case "month":     return { from: startOfMonth(), to: t };
    default:          return { from: "",            to: "" };
  }
};

/* ── palettes ────────────────────────────────────────────────────────────── */

const STATUS_COLORS: Record<IssueTicketStatus, string> = {
  OPEN:        "#f59e0b",
  IN_PROGRESS: "#ef4444",
  RESOLVED:    "#84cc16",
  CLOSED:      "#10b981",
};

const PRIORITY_COLORS: Record<IssueTicketPriority, string> = {
  CRITICAL: "#7c3aed",
  HIGH:     "#ef4444",
  MEDIUM:   "#f59e0b",
  LOW:      "#10b981",
};

const STATUSES: IssueTicketStatus[]     = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITIES: IssueTicketPriority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const STATUS_LABELS: Record<IssueTicketStatus, string> = {
  OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed",
};

const MEMBER_COLORS = [
  "#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6",
  "#ec4899","#14b8a6","#f97316","#3b82f6","#84cc16",
];

const HOUR_LABELS = ["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a",
                     "12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"];

const SLA_H = 4; // hours before a ticket is considered an SLA breach

/* ── reusable components ─────────────────────────────────────────────────── */

const StatCard = ({ label, value, sub, color, icon }: {
  label: string; value: number | string; sub?: string; color: string; icon?: React.ReactNode;
}) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl p-4 shadow-sm border ${color} min-w-[118px]`}>
    {icon && <div className="mb-1 opacity-70">{icon}</div>}
    <span className="text-2xl font-bold">{value}</span>
    {sub && <span className="text-[10px] text-gray-400 mt-0.5 text-center">{sub}</span>}
    <span className="text-xs font-medium mt-1 text-center leading-snug">{label}</span>
  </div>
);

const SectionTitle = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="flex items-baseline gap-2 mb-3">
    <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

const EmptyChart = ({ text = "No data for this period" }: { text?: string }) => (
  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">{text}</div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs z-50">
      {label && <p className="font-semibold text-gray-800 mb-2">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.name ?? p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.fill ?? p.stroke ?? p.color }} />
          <span className="text-gray-500">{p.name ?? p.dataKey}:</span>
          <span className="font-bold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── main component ──────────────────────────────────────────────────────── */

const TeamAnalyticsDashboard = () => {
  const { data, isLoading } = useGetAllIssueTickets();
  const { userDetail } = useContext(UserDetailContext);

  const [preset,   setPreset]   = useState<Preset>("today");
  const [fromDate, setFromDate] = useState(today());
  const [toDate,   setToDate]   = useState(today());

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [detailTicket,     setDetailTicket]     = useState<IssueTicketInterface | null>(null);

  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [emailFrom, setEmailFrom] = useState("");
  const [emailTo,   setEmailTo]   = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const emailPanelRef = useRef<HTMLDivElement>(null);

  const openEmailPanel = () => {
    setEmailFrom(fromDate);
    setEmailTo(toDate);
    setShowPreview(false);
    setShowEmailPanel(true);
    setTimeout(() => emailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const handleOpenMail = () => {
    const subject = encodeURIComponent(`My Issue Report — ${emailFrom} to ${emailTo}`);
    const body    = encodeURIComponent(buildEmailBody());
    window.open(`mailto:${userDetail.data.result.emailID}?subject=${subject}&body=${body}`, "_blank");
  };

  const applyPreset = (key: Preset) => {
    setPreset(key);
    if (key !== "custom") {
      const r = presetRange(key);
      setFromDate(r.from);
      setToDate(r.to);
    }
  };

  const innerData  = (data?.data as { data?: unknown } | undefined)?.data;
  const allTickets = resolveFlat(innerData);

  /* ── pickup-date-filtered tickets ──
     A picked-up ticket counts in the range by its PICKUP date (not created).
     A ticket never picked up (e.g. unassigned OPEN backlog) falls back to its
     created date, so the open backlog still shows in the status counts. */
  const tickets = useMemo(() =>
    allTickets.filter(t => {
      const ms = getPickupMs(t);
      const d  = ms !== null
        ? toDateStr(new Date(ms))
        : (t.createdAt ? toDateStr(new Date(t.createdAt)) : "");
      if (!d) return false;
      if (fromDate && d < fromDate) return false;
      if (toDate   && d > toDate)   return false;
      return true;
    }),
    [allTickets, fromDate, toDate]
  );

  /* ── per-assignee map ── */
  const assigneeMap = useMemo(() => {
    const map = new Map<string, {
      id: string; name: string;
      OPEN: number; IN_PROGRESS: number; RESOLVED: number; CLOSED: number;
      total: number; resolutionHours: number[];
    }>();
    for (const t of tickets) {
      if (!t.assignee) continue;
      const key   = t.assignee;
      const label = t.assigneeName ?? t.assignee;
      if (!map.has(key))
        map.set(key, { id: key, name: label, OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0, total: 0, resolutionHours: [] });
      const e = map.get(key)!;
      e[t.issueStatus] = (e[t.issueStatus] ?? 0) + 1;
      e.total += 1;

      // resolution time: strictly from pickup (PICKED_UP, fallback IN_PROGRESS) → close/resolve
      // tickets without a pickup entry are skipped (no sent-time fallback)
      if ((t.issueStatus === "CLOSED" || t.issueStatus === "RESOLVED") && t.statusHistory?.length) {
        const closeEntry  = [...t.statusHistory].reverse()
          .find(h => h.status === "CLOSED" || h.status === "RESOLVED");
        const pickupEntry = t.statusHistory.find(h => h.status === "PICKED_UP")
          ?? t.statusHistory.find(h => h.status === "IN_PROGRESS");
        if (closeEntry?.changedAt && pickupEntry?.changedAt) {
          const pickupMs = String(pickupEntry.changedAt).length > 10
            ? pickupEntry.changedAt
            : pickupEntry.changedAt * 1000;
          const closedMs = String(closeEntry.changedAt).length > 10
            ? closeEntry.changedAt
            : closeEntry.changedAt * 1000;
          const hrs = (closedMs - pickupMs) / (1000 * 60 * 60);
          if (hrs >= 0) e.resolutionHours.push(hrs);
        }
      }
    }
    return map;
  }, [tickets]);

  const assigneeData = useMemo(() =>
    [...assigneeMap.values()]
      .map(r => ({
        ...r,
        avgResolution: r.resolutionHours.length
          ? r.resolutionHours.reduce((a, b) => a + b, 0) / r.resolutionHours.length
          : null,
      }))
      .sort((a, b) => b.total - a.total),
    [assigneeMap]
  );

  /* ── status counts ── */
  const statusCounts = useMemo(() =>
    STATUSES.map(s => ({
      name: STATUS_LABELS[s],
      value: tickets.filter(t => t.issueStatus === s).length,
      color: STATUS_COLORS[s],
    })),
    [tickets]
  );

  /* ── priority counts ── */
  const priorityCounts = useMemo(() =>
    PRIORITIES.map(p => ({
      name: p,
      value: tickets.filter(t => t.priority === p).length,
      color: PRIORITY_COLORS[p],
    })),
    [tickets]
  );

  /* ── top groups ── */
  const groupData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tickets) {
      const g = (t.groupName || "Unknown").replace(/ GPS GROUP/i, "").replace(/ GPS Group/i, "").trim();
      map.set(g, (map.get(g) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [tickets]);

  /* ── hourly volume ── */
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: HOUR_LABELS[h], count: 0, h }));
    for (const t of tickets) {
      if (t.createdAt) hours[new Date(t.createdAt).getHours()].count++;
    }
    return hours;
  }, [tickets]);

  const peakHour = useMemo(() =>
    hourlyData.reduce((a, b) => (b.count > a.count ? b : a), hourlyData[0]),
    [hourlyData]
  );

  /* ── daily pick+close trend ── */
  const dailyTrend = useMemo(() => {
    const picksMap  = new Map<string, number>();
    const closedMap = new Map<string, number>();
    for (const t of tickets) {
      if (!t.createdAt) continue;
      const d = toDateStr(new Date(t.createdAt));
      if (t.assignee) picksMap.set(d, (picksMap.get(d) ?? 0) + 1);
      if (t.issueStatus === "CLOSED" || t.issueStatus === "RESOLVED") closedMap.set(d, (closedMap.get(d) ?? 0) + 1);
    }
    const allDates = new Set([...picksMap.keys(), ...closedMap.keys()]);
    return [...allDates].sort().map(date => ({
      label: shortDate(date),
      Picks:  picksMap.get(date) ?? 0,
      Closed: closedMap.get(date) ?? 0,
    }));
  }, [tickets]);

  /* ── category breakdown ── */
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tickets) {
      if (t.category?.trim()) map.set(t.category.trim(), (map.get(t.category.trim()) ?? 0) + 1);
    }
    return [...map.entries()].sort(([, a], [, b]) => b - a).slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [tickets]);

  /* ── pick vs closed per member ── */
  const pickClosedData = useMemo(() =>
    assigneeData.map(r => ({ name: r.name, Picked: r.total, Closed: r.CLOSED + r.RESOLVED })),
    [assigneeData]
  );

  /* ── SLA heatmap ── */
  const slaHeatmap = useMemo(() => {
    const from = fromDate || daysAgo(30);
    const to   = toDate   || today();

    // generate day columns
    const cols: string[] = [];
    const cur = new Date(from + "T00:00:00");
    const end = new Date(to   + "T23:59:59");
    while (cur <= end) {
      cols.push(toDateStr(new Date(cur)));
      cur.setDate(cur.getDate() + 1);
    }
    if (cols.length === 0) return null;

    // group-day breach map
    const breachMap = new Map<string, Map<string, number>>();
    for (const t of tickets) {
      if (!t.createdAt) continue;
      const createdMs  = new Date(t.createdAt).getTime();
      const ticketDay  = toDateStr(new Date(t.createdAt));
      const group      = (t.groupName || "Unknown").replace(/ GPS GROUP/i,"").replace(/ GPS Group/i,"").trim();

      let breached = false;
      const ipEntry = t.statusHistory?.find(h => h.status === "IN_PROGRESS");
      if (ipEntry?.changedAt) {
        const ipMs = String(ipEntry.changedAt).length > 10 ? ipEntry.changedAt : ipEntry.changedAt * 1000;
        breached = (ipMs - createdMs) > SLA_H * 3_600_000;
      } else if (t.issueStatus === "OPEN") {
        breached = (Date.now() - createdMs) > SLA_H * 3_600_000;
      }
      if (!breached) continue;

      if (!breachMap.has(group)) breachMap.set(group, new Map());
      const dm = breachMap.get(group)!;
      dm.set(ticketDay, (dm.get(ticketDay) ?? 0) + 1);
    }

    // top 20 groups by total breaches
    const groups = [...breachMap.entries()]
      .map(([name, dm]) => ({ name, total: [...dm.values()].reduce((a, b) => a + b, 0), dm }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 20);

    const allCounts = groups.flatMap(g => [...g.dm.values()]);
    const maxCell   = Math.max(1, ...allCounts);
    const totalBreaches = allCounts.reduce((a, b) => a + b, 0);

    return { cols, groups, maxCell, totalBreaches };
  }, [tickets, fromDate, toDate]);

  /* ── summary numbers ── */
  const total        = tickets.length;
  const totalPicked  = tickets.filter(t => t.assignee).length;
  const unassigned   = tickets.filter(t => !t.assignee).length;
  const inProgress   = tickets.filter(t => t.issueStatus === "IN_PROGRESS").length;
  const resolved     = tickets.filter(t => t.issueStatus === "RESOLVED").length;
  const closed       = tickets.filter(t => t.issueStatus === "CLOSED" || t.issueStatus === "RESOLVED").length;
  const highPriority = tickets.filter(t => t.priority === "HIGH").length;
  const teamSize     = assigneeMap.size;
  const closeRate    = totalPicked > 0 ? Math.round((closed / totalPicked) * 100) : 0;
  const nowSec       = Date.now() / 1000;
  const overdue      = tickets.filter(t =>
    t.dueDate && t.dueDate < nowSec &&
    t.issueStatus !== "CLOSED" && t.issueStatus !== "RESOLVED"
  ).length;

  const allResHours  = assigneeData.flatMap(r => r.resolutionHours ?? []);
  const avgResolution = allResHours.length
    ? allResHours.reduce((a, b) => a + b, 0) / allResHours.length
    : null;

  const topPicker = assigneeData[0];
  const topCloser = [...assigneeData].sort((a, b) => (b.CLOSED + b.RESOLVED) - (a.CLOSED + a.RESOLVED))[0];
  const avgPerMember = teamSize > 0 ? (totalPicked / teamSize).toFixed(1) : "0";

  /* ── email body builder (logged-in user only) ── */
  const buildEmailBody = () => {
    const myId    = userDetail.data.result.divisionId;
    const dateRange = emailFrom && emailTo ? `${emailFrom} to ${emailTo}` : "All time";

    // my tickets in the selected date range
    const myTickets = tickets.filter(t => t.assignee === myId);

    const me = assigneeMap.get(myId);
    const myRate   = me && me.total > 0 ? Math.round(((me.CLOSED + (me.RESOLVED || 0)) / me.total) * 100) : 0;
    const myAvgRes = me?.resolutionHours?.length
      ? fmtDuration(me.resolutionHours.reduce((a, b) => a + b, 0) / me.resolutionHours.length)
      : "—";

    // group-wise breakdown
    const groupMap = new Map<string, { total: number; OPEN: number; IN_PROGRESS: number; RESOLVED: number; CLOSED: number }>();
    for (const t of myTickets) {
      const g = (t.groupName || "Unknown").trim();
      if (!groupMap.has(g)) groupMap.set(g, { total: 0, OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 });
      const e = groupMap.get(g)!;
      e.total += 1;
      if (t.issueStatus === "OPEN")        e.OPEN        += 1;
      if (t.issueStatus === "IN_PROGRESS") e.IN_PROGRESS += 1;
      if (t.issueStatus === "RESOLVED")    e.RESOLVED    += 1;
      if (t.issueStatus === "CLOSED")      e.CLOSED      += 1;
    }
    const groupRows = [...groupMap.entries()]
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([name, s]) =>
        `  ${name.padEnd(32)} Total:${String(s.total).padStart(4)}  Open:${String(s.OPEN).padStart(3)}  InProg:${String(s.IN_PROGRESS).padStart(3)}  Resolved:${String(s.RESOLVED).padStart(3)}  Closed:${String(s.CLOSED).padStart(3)}`
      ).join("\n");

    // priority breakdown
    const priMap = new Map<string, number>();
    for (const t of myTickets) {
      const p = t.priority ?? "UNKNOWN";
      priMap.set(p, (priMap.get(p) ?? 0) + 1);
    }
    const priRows = [...priMap.entries()]
      .sort(([, a], [, b]) => b - a)
      .map(([p, c]) => `  ${p.padEnd(10)}: ${c}`)
      .join("\n");

    // overdue (for me)
    const nowSec  = Date.now() / 1000;
    const myOverdue = myTickets.filter(t =>
      t.dueDate && t.dueDate < nowSec &&
      t.issueStatus !== "CLOSED" && t.issueStatus !== "RESOLVED"
    ).length;

    return `My Issue Report
==============================================
Period      : ${dateRange}
User        : ${userDetail.data.result.userName}
Email       : ${userDetail.data.result.emailID}

PERFORMANCE SUMMARY
-------------------
Tickets Assigned : ${me?.total       ?? 0}
Open             : ${me?.OPEN        ?? 0}
In Progress      : ${me?.IN_PROGRESS ?? 0}
Resolved         : ${me?.RESOLVED    ?? 0}
Closed           : ${me?.CLOSED      ?? 0}
Overdue          : ${myOverdue}
Avg Resolution   : ${myAvgRes}
Close Rate       : ${myRate}%

PRIORITY BREAKDOWN
------------------
${priRows || "  No tickets for this period."}

GROUP / DIVISION WISE ISSUE COUNT
----------------------------------
${groupRows || "  No tickets for this period."}

==============================================
Generated from the Issue Tracking Analytics Dashboard.`;
  };



  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading analytics…</div>;
  }

  return (
    <>
    <div className="h-full overflow-y-auto bg-gray-50 px-5 py-4 space-y-5">

      {/* ══ Date Filter ════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
        <span className="text-xs font-semibold text-gray-500">Filter by Date:</span>
        <div className="flex gap-1.5 flex-wrap">
          {PRESETS.map(p => (
            <button key={p.key} onClick={() => applyPreset(p.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                preset === p.key ? "bg-[#075E54] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <label className="text-xs text-gray-500 font-medium">From</label>
          <input type="date" value={fromDate} max={toDate || today()}
            onChange={e => { setFromDate(e.target.value); setPreset("custom"); }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          <label className="text-xs text-gray-500 font-medium">To</label>
          <input type="date" value={toDate} min={fromDate} max={today()}
            onChange={e => { setToDate(e.target.value); setPreset("custom"); }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          {(fromDate || toDate) && (
            <button onClick={() => { setFromDate(""); setToDate(""); setPreset("custom"); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50">
              Clear
            </button>
          )}
        </div>
        <button
          onClick={openEmailPanel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#075E54] hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors ml-2 flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Report
        </button>
      </div>

      {/* ══ Email Report Panel ══════════════════════════════════════════════ */}
      {showEmailPanel && (
        <div ref={emailPanelRef} className="bg-white rounded-2xl border border-emerald-200 shadow-sm px-4 py-4 space-y-3">
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Prepare Analytics Report Email</h3>
            </div>
            <button onClick={() => { setShowEmailPanel(false); setShowPreview(false); }}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* date + recipient row */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">From</label>
              <input type="date" value={emailFrom} max={emailTo || today()}
                onChange={e => { setEmailFrom(e.target.value); setShowPreview(false); }}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">To</label>
              <input type="date" value={emailTo} min={emailFrom} max={today()}
                onChange={e => { setEmailTo(e.target.value); setShowPreview(false); }}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-gray-500">Recipient</label>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-xs text-gray-600 truncate">{userDetail.data.result.emailID}</span>
                <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full flex-shrink-0">You</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                disabled={!emailFrom || !emailTo}
                onClick={() => setShowPreview(v => !v)}
                className="px-4 py-1.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? "Hide Preview" : "Preview"}
              </button>
              <button
                disabled={!emailFrom || !emailTo}
                onClick={handleOpenMail}
                className="px-4 py-1.5 bg-[#075E54] hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Open in Mail
              </button>
            </div>
          </div>

          {/* inline preview */}
          {showPreview && (
            <div className="mt-1 border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600">Email Preview</span>
              </div>
              <pre className="px-4 py-3 text-xs text-gray-700 font-mono whitespace-pre-wrap leading-relaxed bg-white max-h-96 overflow-y-auto">
                {buildEmailBody()}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ══ Stat Cards ═════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-3">
        <StatCard label="Total Tickets"   value={total}           color="bg-white border-gray-200 text-gray-800" />
        <StatCard label="Picked Up"       value={totalPicked}     color="bg-indigo-50 border-indigo-200 text-indigo-800" />
        <StatCard label="Unassigned"      value={unassigned}      color="bg-yellow-50 border-yellow-200 text-yellow-800" />
        <StatCard label="In Progress"     value={inProgress}      color="bg-red-50 border-red-200 text-red-800" />
        <StatCard label="Resolved"        value={resolved}        color="bg-lime-50 border-lime-200 text-lime-800" />
        <StatCard label="Closed + Resolved" value={closed}         color="bg-emerald-50 border-emerald-200 text-emerald-800" />
        <StatCard label="High Priority"   value={highPriority}    color="bg-rose-50 border-rose-200 text-rose-800" />
        <StatCard label="Overdue"         value={overdue}         color={overdue > 0 ? "bg-orange-50 border-orange-300 text-orange-800" : "bg-gray-50 border-gray-200 text-gray-500"} />
        <StatCard label="Close Rate"      value={`${closeRate}%`} color="bg-emerald-50 border-teal-200 text-emerald-800" />
        <StatCard label="Avg Resolution"  value={avgResolution !== null ? fmtDuration(avgResolution) : "—"} color="bg-sky-50 border-sky-200 text-sky-800" />
        <StatCard label="Team Members"    value={teamSize}        color="bg-purple-50 border-purple-200 text-purple-800" />
        <StatCard label="Avg Picks/Member" value={avgPerMember}   color="bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800" />
        {topPicker && <StatCard label="Top Picker" value={topPicker.name.split(" ")[0]} sub={`${topPicker.total} picks`} color="bg-emerald-50 border-emerald-200 text-emerald-800" />}
        {(topCloser?.CLOSED + topCloser?.RESOLVED) > 0 && <StatCard label="Top Closer" value={topCloser.name.split(" ")[0]} sub={`${topCloser.CLOSED + topCloser.RESOLVED} closed`} color="bg-cyan-50 border-cyan-200 text-cyan-800" />}
        {peakHour?.count > 0 && <StatCard label="Peak Hour" value={peakHour.hour} sub={`${peakHour.count} tickets`} color="bg-violet-50 border-violet-200 text-violet-800" />}
      </div>

      {/* ══ Row 1: Status by Member + Status Pie ═══════════════════════════ */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Tickets by Status per Member" />
          {assigneeData.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={assigneeData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={v => STATUS_LABELS[v as IssueTicketStatus] ?? v} />
                {STATUSES.map(s => (
                  <Bar key={s} dataKey={s} name={s} stackId="a" fill={STATUS_COLORS[s]}
                    radius={s === "CLOSED" ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Status Distribution" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusCounts.filter(d => d.value > 0)} cx="50%" cy="50%"
                innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {statusCounts.filter(d => d.value > 0).map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <PieTooltip formatter={(v, n) => [v, STATUS_LABELS[n as IssueTicketStatus] ?? n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-1">
            {statusCounts.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Row 2: Priority Pie + Top Groups ═══════════════════════════════ */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Priority Breakdown" sub={`${highPriority} high priority`} />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={priorityCounts.filter(d => d.value > 0)} cx="50%" cy="50%"
                innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {priorityCounts.filter(d => d.value > 0).map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <PieTooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-1">
            {priorityCounts.map(p => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-gray-600">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${total ? Math.round((p.value/total)*100) : 0}%`, background: p.color }} />
                  </div>
                  <span className="font-semibold text-gray-800 w-6 text-right">{p.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Top Groups by Ticket Volume" sub={`top ${groupData.length}`} />
          {groupData.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={groupData} margin={{ top: 4, right: 40, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Tickets" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {groupData.map((_, i) => (
                    <Cell key={i} fill={MEMBER_COLORS[i % MEMBER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ══ Row 3: Picked vs Closed + Daily Area Trend ═════════════════════ */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Picked vs Closed per Member" />
          {pickClosedData.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={pickClosedData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Picked" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={26} />
                <Bar dataKey="Closed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Daily Pick & Close Trend" />
          {dailyTrend.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={dailyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <defs>
                  <linearGradient id="gPick"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Picks"  stroke="#6366f1" strokeWidth={2} fill="url(#gPick)"  dot={{ r: 3, fill: "#6366f1" }} />
                <Area type="monotone" dataKey="Closed" stroke="#10b981" strokeWidth={2} fill="url(#gClose)" dot={{ r: 3, fill: "#10b981" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ══ Row 4: Hourly Volume ════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <SectionTitle title="Hourly Ticket Volume" sub={peakHour?.count > 0 ? `peak at ${peakHour.hour} (${peakHour.count} tickets)` : undefined} />
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={hourlyData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barCategoryGap="10%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#9ca3af" }} interval={1} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Tickets" radius={[3, 3, 0, 0]}>
              {hourlyData.map((entry, i) => (
                <Cell key={i}
                  fill={entry.h >= 9 && entry.h <= 18 ? "#6366f1" : entry.h >= 6 && entry.h <= 20 ? "#a5b4fc" : "#e5e7eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400 justify-end">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />Business hours</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-300 inline-block" />Extended hours</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-200 inline-block" />Night</span>
        </div>
      </div>

      {/* ══ Row 5: Category Breakdown (shown only if data exists) ══════════ */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Category Breakdown" sub={`${categoryData.length} categories`} />
          <div className="space-y-2.5">
            {categoryData.map((c, i) => {
              const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-32 truncate flex-shrink-0">{c.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: MEMBER_COLORS[i % MEMBER_COLORS.length] }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-10 text-right">{c.count}</span>
                  <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ Row 5b: Group-Level SLA Heatmap ═══════════════════════════════ */}
      {slaHeatmap && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Group-Level SLA Heatmap
                <span className="ml-2 text-xs font-normal text-gray-400">response &gt; {SLA_H}h</span>
              </h2>
              {slaHeatmap.totalBreaches > 0 ? (
                <p className="text-xs text-gray-400 mt-0.5">
                  <span className="font-semibold text-red-600">{slaHeatmap.totalBreaches}</span> SLA breach{slaHeatmap.totalBreaches !== 1 ? "es" : ""} across{" "}
                  <span className="font-semibold text-gray-700">{slaHeatmap.groups.length}</span> group{slaHeatmap.groups.length !== 1 ? "s" : ""}
                </p>
              ) : (
                <p className="text-xs text-emerald-600 mt-0.5 font-semibold">No SLA breaches in this period</p>
              )}
            </div>
            {/* legend */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-gray-400 mr-1">Breaches:</span>
              {[
                { label: "0",    bg: "#f9fafb", border: "#e5e7eb" },
                { label: "1",    bg: "#fef9c3" },
                { label: "2–3",  bg: "#fde68a" },
                { label: "4–6",  bg: "#fb923c" },
                { label: "7+",   bg: "#ef4444" },
                { label: "max",  bg: "#b91c1c" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-sm flex-shrink-0 border border-gray-200"
                    style={{ background: l.bg, borderColor: l.border ?? "transparent" }} />
                  <span className="text-[10px] text-gray-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {slaHeatmap.totalBreaches === 0 ? (
            <div className="flex items-center justify-center h-24 text-emerald-600 text-sm font-medium gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All groups responded within SLA for this period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${160 + slaHeatmap.cols.length * 26}px` }}>

                {/* column date headers */}
                <div className="flex mb-1" style={{ paddingLeft: 160 }}>
                  {slaHeatmap.cols.map((col, ci) => {
                    const d     = new Date(col + "T00:00:00");
                    const isFirst  = ci === 0 || d.getDate() === 1;
                    const dayNum   = d.getDate();
                    const monthAb  = d.toLocaleString("en", { month: "short" });
                    return (
                      <div
                        key={col}
                        className="flex-shrink-0 text-center"
                        style={{ width: 24, marginRight: 2 }}
                        title={col}
                      >
                        <span className="text-[9px] text-gray-400 leading-none">
                          {isFirst ? `${dayNum} ${monthAb}` : dayNum}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* group rows */}
                <div className="space-y-0.5">
                  {slaHeatmap.groups.map(({ name, total, dm }) => (
                    <div key={name} className="flex items-center gap-0" title={`${name} — ${total} breach${total !== 1 ? "es" : ""}`}>
                      {/* group label */}
                      <div
                        className="flex-shrink-0 text-right pr-2 text-[11px] text-gray-600 font-medium truncate"
                        style={{ width: 158 }}
                        title={name}
                      >
                        {name}
                      </div>
                      {/* cells */}
                      {slaHeatmap.cols.map(col => {
                        const count = dm.get(col) ?? 0;
                        const t     = count / slaHeatmap.maxCell;
                        const bg    = count === 0 ? "#f9fafb"
                          : t <= 0.15 ? "#fef9c3"
                          : t <= 0.35 ? "#fde68a"
                          : t <= 0.60 ? "#fb923c"
                          : t <= 0.85 ? "#ef4444"
                          :             "#b91c1c";
                        return (
                          <div
                            key={col}
                            className="flex-shrink-0 rounded-sm border border-white/60"
                            style={{ width: 24, height: 20, marginRight: 2, background: bg }}
                            title={count > 0 ? `${name}\n${col}\n${count} breach${count !== 1 ? "es" : ""}` : `${name}\n${col}\nNo breaches`}
                          />
                        );
                      })}
                      {/* total badge */}
                      <span className="ml-2 text-[10px] font-bold text-red-600 flex-shrink-0">{total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ Row 6: Member Performance Cards ════════════════════════════════ */}
      {assigneeData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <SectionTitle title="Member Performance" sub={`${teamSize} active members`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {assigneeData.map((member, idx) => {
              const rate      = member.total > 0 ? Math.round(((member.CLOSED + (member.RESOLVED || 0)) / member.total) * 100) : 0;
              const color     = MEMBER_COLORS[idx % MEMBER_COLORS.length];
              const avgRes    = member.resolutionHours?.length
                ? member.resolutionHours.reduce((a: number, b: number) => a + b, 0) / member.resolutionHours.length
                : null;
              const slowClose = (member.resolutionHours ?? []).filter(h => h > 1).length;
              return (
                <div key={member.name} className="rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: color }}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-gray-800 truncate">{member.name}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Picked</span><span className="font-bold text-indigo-600">{member.total}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Open</span><span className="font-semibold text-amber-600">{member.OPEN || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">In Progress</span><span className="font-semibold text-red-500">{member.IN_PROGRESS || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Resolved</span><span className="font-semibold text-lime-600">{member.RESOLVED || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Closed</span><span className="font-bold text-emerald-600">{member.CLOSED || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Avg Resolve</span><span className="font-semibold text-sky-600">{avgRes !== null ? fmtDuration(avgRes) : "—"}</span></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">&gt; 1hr Close</span>
                      {slowClose > 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold ring-1 ring-orange-200">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {slowClose}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Close rate</span><span className="font-semibold text-gray-600">{rate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${rate}%`, background: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ Row 7: Leaderboard Table ════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Team Leaderboard</h2>
          <span className="text-xs text-gray-400">{teamSize} members · {totalPicked} picks · {closed} closed · {closeRate}% close rate</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-xs font-semibold uppercase tracking-wide">
                <th className="px-3 py-2.5 text-left text-gray-400">#</th>
                <th className="px-3 py-2.5 text-left text-gray-400">Member</th>
                <th className="px-3 py-2.5 text-center text-indigo-400">Picked</th>
                <th className="px-3 py-2.5 text-center" style={{ color: STATUS_COLORS.OPEN }}>Open</th>
                <th className="px-3 py-2.5 text-center" style={{ color: STATUS_COLORS.IN_PROGRESS }}>In Prog</th>
                <th className="px-3 py-2.5 text-center" style={{ color: STATUS_COLORS.RESOLVED }}>Resolved</th>
                <th className="px-3 py-2.5 text-center" style={{ color: STATUS_COLORS.CLOSED }}>Closed</th>
                <th className="px-3 py-2.5 text-center text-sky-400">Avg Resolve</th>
                <th className="px-3 py-2.5 text-center text-orange-400">&gt; 1hr Close</th>
                <th className="px-3 py-2.5 text-center text-emerald-400">Close Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assigneeData.length === 0 ? (
                <tr><td colSpan={10} className="py-10 text-center text-gray-400 text-sm">No data for this period.</td></tr>
              ) : (
                assigneeData.map((row, i) => {
                  const rate        = row.total > 0 ? Math.round(((row.CLOSED + (row.RESOLVED || 0)) / row.total) * 100) : 0;
                  const avgRes      = row.resolutionHours?.length
                    ? row.resolutionHours.reduce((a: number, b: number) => a + b, 0) / row.resolutionHours.length
                    : null;
                  const slowClose   = (row.resolutionHours ?? []).filter(h => h > 1).length;
                  return (
                    <tr key={row.name} onClick={() => setSelectedMemberId(row.id)} className={`cursor-pointer transition-colors hover:bg-indigo-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                      <td className="px-3 py-2.5 text-gray-400 font-medium text-xs">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: MEMBER_COLORS[i % MEMBER_COLORS.length] }}>
                            {row.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 text-xs">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] px-2 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{row.total}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold text-amber-600">{row.OPEN || "—"}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold text-red-500">{row.IN_PROGRESS || "—"}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold text-lime-600">{row.RESOLVED || "—"}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-bold text-emerald-600">{row.CLOSED || "—"}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold text-sky-600">{avgRes !== null ? fmtDuration(avgRes) : "—"}</td>
                      <td className="px-3 py-2.5 text-center">
                        {slowClose > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold ring-1 ring-orange-200">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {slowClose}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-emerald-700">{rate}%</span>
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
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

    {/* ══ Member Issue Slide-over ══════════════════════════════════════════ */}
    {selectedMemberId && (() => {
      const memberData    = assigneeMap.get(selectedMemberId);
      const memberTickets = tickets.filter(t => t.assignee === selectedMemberId);
      if (!memberData) return null;
      return (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedMemberId(null)} />

          {/* panel */}
          <div className="w-1/2 h-full bg-white shadow-2xl flex flex-col overflow-hidden">

            {/* header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gray-900 flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: MEMBER_COLORS[[...assigneeMap.keys()].indexOf(selectedMemberId) % MEMBER_COLORS.length] }}>
                {memberData.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{memberData.name}</p>
                <p className="text-gray-400 text-xs">{memberTickets.length} tickets in selected period</p>
              </div>
              <button onClick={() => setSelectedMemberId(null)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* stat strip */}
            <div className="flex gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0 flex-wrap">
              {([
                { label: "Open",        val: memberData.OPEN,        cls: "bg-amber-50 text-amber-700 ring-amber-200"   },
                { label: "In Progress", val: memberData.IN_PROGRESS,  cls: "bg-sky-50 text-sky-700 ring-sky-200"        },
                { label: "Closed",      val: memberData.CLOSED,       cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
                { label: "Resolved",    val: memberData.RESOLVED,     cls: "bg-lime-50 text-lime-700 ring-lime-200"     },
              ] as const).map(s => (
                <span key={s.label} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${s.cls}`}>
                  {s.label}: <span className="font-bold">{s.val}</span>
                </span>
              ))}
            </div>

            {/* ticket table */}
            <div className="flex-1 overflow-y-auto">
              {memberTickets.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No tickets found.</div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-800 text-gray-300 text-left uppercase tracking-wide font-semibold">
                      <th className="px-4 py-2.5">Ticket ID</th>
                      <th className="px-4 py-2.5">Group</th>
                      <th className="px-4 py-2.5">Sender</th>
                      <th className="px-4 py-2.5">Message</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Priority</th>
                      <th className="px-4 py-2.5 whitespace-nowrap">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {memberTickets.map((t, i) => {
                      return (
                        <tr key={t.id} onClick={() => setDetailTicket(t)} className={`cursor-pointer transition-colors hover:bg-indigo-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                          <td className="px-4 py-2.5 font-mono font-bold text-[#075E54] whitespace-nowrap">{t.ticketId || "—"}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-700 truncate max-w-[100px]">{t.groupName || "—"}</td>
                          <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{t.senderName || "—"}</td>
                          <td className="px-4 py-2.5 text-gray-500">
                            {t.message && <p className="whitespace-pre-wrap break-words leading-snug">{t.message}</p>}
                            {t.summary && t.summary !== t.message && (
                              <p className={`whitespace-pre-wrap break-words leading-snug ${t.message ? "mt-1 text-[11px] text-gray-400 italic" : ""}`}>{t.summary}</p>
                            )}
                            {!t.message && !t.summary && <span>—</span>}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
                              style={{ background: STATUS_COLORS[t.issueStatus] + "22", color: STATUS_COLORS[t.issueStatus] }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[t.issueStatus] }} />
                              {STATUS_LABELS[t.issueStatus]}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`font-semibold ${
                              t.priority === "CRITICAL" ? "text-purple-600" :
                              t.priority === "HIGH"     ? "text-red-500"    :
                              t.priority === "MEDIUM"   ? "text-amber-500"  : "text-emerald-500"
                            }`}>{t.priority}</span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                            {new Date(t.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"2-digit", hour:"2-digit", minute:"2-digit", hour12:false })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      );
    })()}

    {detailTicket && (
      <TicketDetailModal
        ticket={detailTicket}
        isOpen
        onClose={() => setDetailTicket(null)}
      />
    )}
    </>
  );
};

export default TeamAnalyticsDashboard;


