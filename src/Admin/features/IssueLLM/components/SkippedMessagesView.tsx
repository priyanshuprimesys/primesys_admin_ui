import { useContext, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { useGetSkipMessages } from "../hooks/GetSkipMessagesHook";
import { convertSkipMessage } from "../services/api";
import { get_all_issue_tickets_query_key, get_skip_messages_query_key } from "../queryKey/queryKey";
import { SkipMessageInterface } from "../interfaces/SkipMessageInterface";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const todayStr = () => new Date().toISOString().slice(0, 10);

const fmtTs = (ts?: number) => {
  if (!ts) return "—";
  const d = String(ts).length > 10 ? new Date(ts) : new Date(ts * 1000);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
};

/* Normalise a raw record to canonical camelCase, tolerating snake_case
   field names from the backend (sender_name, group_name, skipped_at, …). */
const normalizeSkip = (r: any): SkipMessageInterface => ({
  id:                r.id ?? r._id ?? "",
  sender:            r.sender ?? "",
  groupName:         r.groupName ?? r.group_name ?? "",
  senderName:        r.senderName ?? r.sender_name ?? "",
  message:           r.message ?? "",
  divisionId:        r.divisionId ?? r.division_id ?? "",
  noteId:            r.noteId ?? r.note_id ?? "",
  // skipped_at is the backend's timestamp name; fall back to postTime
  postTime:          r.postTime ?? r.post_time ?? r.skipped_at ?? r.skippedAt ?? 0,
  isIssue:           r.isIssue ?? r.is_issue ?? false,
  activeStatus:      r.activeStatus ?? r.active_status ?? true,
  converted:         r.converted ?? false,
  convertedTicketId: r.convertedTicketId ?? r.converted_ticket_id ?? undefined,
  convertedBy:       r.convertedBy ?? r.converted_by ?? undefined,
  convertedAt:       r.convertedAt ?? r.converted_at ?? undefined,
});

const resolveMessages = (raw: unknown): SkipMessageInterface[] => {
  if (!raw) return [];
  let arr: any[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["result", "data", "content", "items", "records"]) {
      if (Array.isArray(obj[key])) { arr = obj[key] as any[]; break; }
    }
  }
  return arr.map(normalizeSkip);
};

/* ── Left panel ──────────────────────────────────────────────────────────── */

interface LeftPanelProps {
  groups: Record<string, SkipMessageInterface[]>;
  selected: string | null;
  onSelect: (g: string) => void;
}

const LeftPanel = ({ groups, selected, onSelect }: LeftPanelProps) => {
  const [search, setSearch] = useState("");

  const sorted = Object.keys(groups)
    .sort((a, b) => {
      const pendingA = groups[a].filter(m => !m.converted).length;
      const pendingB = groups[b].filter(m => !m.converted).length;
      if (pendingB !== pendingA) return pendingB - pendingA;
      const latestA = Math.max(...groups[a].map(m => m.postTime ?? 0));
      const latestB = Math.max(...groups[b].map(m => m.postTime ?? 0));
      return latestB - latestA;
    })
    .filter(g => g.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200" style={{ width: 300, minWidth: 260 }}>

      {/* header */}
      <div className="bg-[#075E54] px-4 py-3 flex-shrink-0">
        <h2 className="text-white font-bold text-[15px] tracking-wide">Skipped Messages</h2>
        <p className="text-emerald-300 text-[11px] mt-0.5">{Object.keys(groups).length} group{Object.keys(groups).length !== 1 ? "s" : ""}</p>
      </div>

      {/* search */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center bg-white rounded-lg px-3 py-1.5 gap-2 border border-gray-200">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search groups…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs outline-none text-gray-700 bg-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* group list */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-xs">No groups found</div>
        ) : (
          sorted.map(groupName => {
            const msgs        = groups[groupName];
            const pending     = msgs.filter(m => !m.converted).length;
            const latest      = msgs.reduce((a, b) => (b.postTime ?? 0) > (a.postTime ?? 0) ? b : a);
            const isSelected  = selected === groupName;
            const initial     = groupName.charAt(0).toUpperCase();

            return (
              <div
                key={groupName}
                onClick={() => onSelect(groupName)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-gray-100 transition-colors relative ${
                  isSelected
                    ? "bg-emerald-50 border-l-[3px] border-l-[#075E54]"
                    : "hover:bg-gray-50 border-l-[3px] border-l-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-sm">{initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-sm truncate font-semibold ${isSelected ? "text-[#075E54]" : "text-gray-800"}`}>
                      {groupName}
                    </span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 tabular-nums">
                      {fmtTs(latest.postTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 gap-1">
                    <p className="text-xs text-gray-500 truncate flex-1 leading-snug">
                      {latest.message || ""}
                    </p>
                    {pending > 0 && (
                      <span className="bg-orange-400 text-white text-[11px] rounded-full px-1.5 py-0.5 flex-shrink-0 font-bold min-w-[20px] text-center">
                        {pending}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* ── Right panel ─────────────────────────────────────────────────────────── */

interface RightPanelProps {
  groupName: string;
  messages: SkipMessageInterface[];
  convertingId: string | null;
  onConvert: (msg: SkipMessageInterface) => void;
}

const RightPanel = ({ groupName, messages, convertingId, onConvert }: RightPanelProps) => {
  const [search, setSearch] = useState("");
  const [showConverted, setShowConverted] = useState(false);

  const filtered = useMemo(() => {
    let list = showConverted ? messages : messages.filter(m => !m.converted);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.message?.toLowerCase().includes(q) ||
        m.senderName?.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => (b.postTime ?? 0) - (a.postTime ?? 0));
  }, [messages, search, showConverted]);

  const pendingCount   = messages.filter(m => !m.converted).length;
  const convertedCount = messages.filter(m =>  m.converted).length;
  const initial        = groupName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full bg-gray-50 overflow-hidden">

      {/* header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#075E54] flex-shrink-0 shadow-md">
        <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">{groupName}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-emerald-200 text-[11px]">
              <span className="font-bold text-white">{pendingCount}</span> pending
            </span>
            <span className="text-emerald-200 text-[11px]">
              <span className="font-bold text-white">{convertedCount}</span> converted
            </span>
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1.5 gap-2 border border-gray-200 flex-1 max-w-xs">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search messages…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs outline-none text-gray-700 bg-transparent placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => setShowConverted(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            showConverted
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400 hover:text-emerald-700"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          {showConverted ? "Hide Converted" : "Show Converted"}
        </button>
        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
          {filtered.length} message{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm font-medium">No messages found</p>
          </div>
        ) : (
          filtered.map(msg => (
            <MessageCard
              key={msg.id}
              msg={msg}
              isConverting={convertingId === msg.id}
              onConvert={onConvert}
            />
          ))
        )}
      </div>
    </div>
  );
};

/* ── Message card ────────────────────────────────────────────────────────── */

interface MessageCardProps {
  msg: SkipMessageInterface;
  isConverting: boolean;
  onConvert: (msg: SkipMessageInterface) => void;
}

const MessageCard = ({ msg, isConverting, onConvert }: MessageCardProps) => {
  const senderInitial = (msg.senderName || "?")[0].toUpperCase();

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-200 shadow-sm border-l-4 ${
      msg.converted
        ? "border-l-emerald-400 bg-emerald-50/40 border border-emerald-100 opacity-80"
        : "border-l-orange-400 bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-0.5"
    }`}>
      {/* card header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${
        msg.converted
          ? "bg-emerald-50 border-b border-emerald-100"
          : "bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100"
      }`}>
        {/* avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-sm text-white ${
          msg.converted ? "bg-emerald-500" : "bg-gradient-to-br from-orange-400 to-amber-500"
        }`}>
          {senderInitial}
        </div>

        {/* name + time */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-extrabold text-gray-900 tracking-wide truncate">
            {msg.senderName || "Unknown"}
          </span>
          <span className={`flex items-center gap-1 text-xs font-semibold whitespace-nowrap px-2 py-0.5 rounded-full ${
            msg.converted
              ? "bg-emerald-100 text-emerald-700"
              : "bg-orange-100 text-orange-700"
          }`}>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fmtTs(msg.postTime)}
          </span>
        </div>

        {/* action */}
        {msg.converted ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full flex-shrink-0 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Converted
          </span>
        ) : (
          <button
            onClick={() => onConvert(msg)}
            disabled={isConverting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-[11px] font-bold
              hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex-shrink-0 whitespace-nowrap shadow-md hover:shadow-orange-200"
            title="Move to Issue Ticket"
          >
            {isConverting ? (
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            )}
            {isConverting ? "Converting…" : "Move to Issue Ticket"}
          </button>
        )}
      </div>

      {/* message body */}
      <div className="px-4 py-3">
        <p className={`text-sm leading-relaxed whitespace-pre-line font-medium ${
          msg.converted ? "text-gray-500" : "text-gray-800"
        }`}>
          {msg.message || "—"}
        </p>
      </div>

      {/* converted meta */}
      {msg.converted && msg.convertedTicketId && (
        <div className="px-4 py-2 bg-emerald-100/60 border-t border-emerald-200 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[11px] text-emerald-700 font-semibold">
            Ticket: <span className="font-mono">{msg.convertedTicketId}</span>
          </span>
          {msg.convertedBy && (
            <span className="text-[11px] text-emerald-600 ml-2">by {msg.convertedBy}</span>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Main view ───────────────────────────────────────────────────────────── */

const SkippedMessagesView = () => {
  const { data, isLoading } = useGetSkipMessages();
  const queryClient = useQueryClient();
  const { userDetail } = useContext(UserDetailContext);
  const userId = userDetail.data.result.divisionId;

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [convertingId,  setConvertingId]  = useState<string | null>(null);

  const [dateFrom,    setDateFrom]    = useState(todayStr());
  const [dateTo,      setDateTo]      = useState(todayStr());
  const [appliedFrom, setAppliedFrom] = useState(todayStr());
  const [appliedTo,   setAppliedTo]   = useState(todayStr());

  const handleApplyRange = () => { setAppliedFrom(dateFrom); setAppliedTo(dateTo); };

  const { mutateAsync: doConvert } = useMutation({ mutationFn: convertSkipMessage });

  const rawMessages: SkipMessageInterface[] = useMemo(() => {
    const body = (data?.data as { data?: unknown } | undefined)?.data;
    return resolveMessages(body ?? data?.data);
  }, [data]);

  const allMessages = useMemo(() => {
    const fromMs = new Date(appliedFrom + "T00:00:00").getTime();
    const toMs   = new Date(appliedTo   + "T23:59:59").getTime();
    return rawMessages.filter(m => {
      if (!m.postTime) return false;
      const ms = String(m.postTime).length > 10 ? m.postTime : m.postTime * 1000;
      return ms >= fromMs && ms <= toMs;
    });
  }, [rawMessages, appliedFrom, appliedTo]);

  const groupedMessages = useMemo(() => {
    const map: Record<string, SkipMessageInterface[]> = {};
    for (const msg of allMessages) {
      const key = msg.groupName || "Unknown Group";
      if (!map[key]) map[key] = [];
      map[key].push(msg);
    }
    return map;
  }, [allMessages]);

  const selectedMessages = selectedGroup ? (groupedMessages[selectedGroup] ?? []) : [];

  const handleConvert = async (msg: SkipMessageInterface) => {
    if (convertingId) return;
    setConvertingId(msg.id);
    try {
      await doConvert({ id: msg.id, convertedBy: userId });
      queryClient.invalidateQueries({ queryKey: [get_skip_messages_query_key] });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to convert message to ticket");
    } finally {
      setConvertingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm">Loading skipped messages…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Date range bar ── */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">From</span>
        <input
          type="date" value={dateFrom} max={dateTo}
          onChange={e => setDateFrom(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">To</span>
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
        <span className="ml-auto text-xs text-gray-400">
          {allMessages.length} message{allMessages.length !== 1 ? "s" : ""} · {Object.keys(groupedMessages).length} group{Object.keys(groupedMessages).length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-lg border border-zinc-200 shadow-md">
      <LeftPanel
        groups={groupedMessages}
        selected={selectedGroup}
        onSelect={setSelectedGroup}
      />

      {selectedGroup ? (
        <RightPanel
          groupName={selectedGroup}
          messages={selectedMessages}
          convertingId={convertingId}
          onConvert={handleConvert}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-4 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-600 text-sm">Select a group</p>
            <p className="text-xs text-gray-400 mt-1">Choose a group from the left to view its skipped messages</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SkippedMessagesView;
