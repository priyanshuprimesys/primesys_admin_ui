import { useQuery } from "@tanstack/react-query";
import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal";
import { IssueTicketInterface, IssueTicketStatus } from "../interfaces/IssueTicketInterface";
import { getTicketActivity, getTransferHistory } from "../services/api";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmtDate = (d: Date): string => {
  const day = String(d.getDate()).padStart(2, "0");
  const mon = MONTHS[d.getMonth()];
  const yr  = String(d.getFullYear()).slice(2);
  const hh  = String(d.getHours()).padStart(2, "0");
  const mm  = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${mon} ${yr}, ${hh}:${mm}`;
};

const fmtIso = (iso?: string): string => {
  if (!iso) return "—";
  try { return fmtDate(new Date(iso)); } catch { return "—"; }
};

const fmtUnix = (ts?: number): string => {
  if (!ts) return "—";
  const d = String(ts).length > 10 ? new Date(ts) : new Date(ts * 1000);
  return fmtDate(d);
};

const attachmentFullUrl  = (p: string) => `http://mykiddytracker.com/${p}`;
const attachmentFileName = (p: string) => p.split("/").pop()?.split("?")[0] ?? p;
const getExt = (n: string) => { const p = n.split("."); return p.length > 1 ? p.pop()!.toLowerCase() : ""; };
const isImg  = (n: string) => ["jpg","jpeg","png","gif","webp","bmp","svg"].includes(getExt(n));
const isPdf  = (n: string) => getExt(n) === "pdf";

const downloadFile = async (path: string) => {
  const url = attachmentFullUrl(path);
  const name = attachmentFileName(path);
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const obj  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = obj; a.download = name; a.click();
    URL.revokeObjectURL(obj);
  } catch { window.open(url, "_blank", "noopener,noreferrer"); }
};

/* ── status config ───────────────────────────────────────────────────────── */

const STATUS_CFG: Record<IssueTicketStatus, { label: string; bg: string; text: string; dot: string }> = {
  OPEN:        { label: "Open",        bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400"   },
  IN_PROGRESS: { label: "In Progress", bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
  RESOLVED:    { label: "Resolved",    bg: "bg-lime-100",    text: "text-lime-700",    dot: "bg-lime-500"    },
  CLOSED:      { label: "Closed",      bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const PRIORITY_CFG: Record<string, string> = {
  CRITICAL: "text-purple-700 bg-purple-50 ring-1 ring-purple-200",
  HIGH:     "text-red-700 bg-red-50 ring-1 ring-red-200",
  MEDIUM:   "text-amber-700 bg-amber-50 ring-1 ring-amber-200",
  LOW:      "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200",
};

/* ── info row ────────────────────────────────────────────────────────────── */

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="font-semibold text-gray-500 w-28 flex-shrink-0">{label}</span>
    <span className="text-gray-800 flex-1 min-w-0">{children}</span>
  </div>
);

/* ── component ───────────────────────────────────────────────────────────── */

interface Props {
  ticket: IssueTicketInterface;
  isOpen: boolean;
  onClose: () => void;
}

const TicketReadOnlyModal = ({ ticket, isOpen, onClose }: Props) => {

  const { data: actData } = useQuery({
    queryKey: ["ticket-activity-ro", ticket.id],
    queryFn:  () => getTicketActivity(ticket.id),
    staleTime: 0,
    enabled: isOpen,
  });

  const { data: histData } = useQuery({
    queryKey: ["transfer-history-ro", ticket.id],
    queryFn:  () => getTransferHistory(ticket.id),
    staleTime: 0,
    enabled: isOpen,
  });

  const activity     = (actData?.data as any)?.data;
  const actEntries   = Array.isArray(activity) ? activity : [];
  const xferHistory  = (histData?.data as any)?.data?.result ?? ticket.transfer_history ?? [];

  const cfg = STATUS_CFG[ticket.issueStatus] ?? STATUS_CFG.OPEN;

  /* pick-up and done times from statusHistory */
  const ipEntry   = ticket.statusHistory?.find(h => h.status === "IN_PROGRESS");
  const doneEntry = ticket.statusHistory
    ? [...ticket.statusHistory].reverse().find(h => h.status === "CLOSED" || h.status === "RESOLVED")
    : undefined;

  return (
    <ChakraUiModal
      isOpen={isOpen}
      onClose={onClose}
      modalHeader={`Issue Details — #${ticket.ticketId}`}
      modalSize="3xl"
    >
      <div className="flex flex-col gap-4 pb-4 max-h-[80vh] overflow-y-auto px-1">

        {/* ── Top info strip ── */}
        <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 px-5 py-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${cfg.bg} ${cfg.text}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${PRIORITY_CFG[ticket.priority] ?? ""}`}>
            {ticket.priority}
          </span>
          {ticket.assigneeName && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 ring-1 ring-sky-200 px-3 py-1 rounded-lg">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {ticket.assigneeName}
            </span>
          )}
          {ticket.category && (
            <span className="text-xs text-gray-500 font-medium">
              Category: <span className="font-semibold text-gray-700">{ticket.category}</span>
            </span>
          )}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ticket.tags.map(tag => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-[#075E54] text-white font-semibold">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Details card ── */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Details</span>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            <InfoRow label="Ticket ID"><span className="font-mono font-bold text-[#075E54]">{ticket.ticketId || "—"}</span></InfoRow>
            <InfoRow label="Group">{ticket.groupName || "—"}</InfoRow>
            <InfoRow label="Sender">{ticket.senderName || "—"}</InfoRow>
            <InfoRow label="Received At">{fmtUnix(ticket.postTime)}</InfoRow>
            <InfoRow label="Ticket Created">{fmtIso(ticket.createdAt)}</InfoRow>
            {ipEntry && <InfoRow label="Picked Up At">{fmtUnix(ipEntry.changedAt)}</InfoRow>}
            {doneEntry && (
              <InfoRow label={doneEntry.status === "RESOLVED" ? "Resolved At" : "Closed At"}>
                {fmtUnix(doneEntry.changedAt)}
              </InfoRow>
            )}
            {ticket.dueDate && <InfoRow label="Due Date">{fmtUnix(ticket.dueDate)}</InfoRow>}
            {ticket.deviceImei && <InfoRow label="Device IMEI"><span className="font-mono">{ticket.deviceImei}</span></InfoRow>}
          </div>
        </div>

        {/* ── Message card ── */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Customer Message</span>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {ticket.message ?? ticket.summary ?? "—"}
            </p>
          </div>
        </div>

        {/* ── Comments card (read-only) ── */}
        {ticket.comments && ticket.comments.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Comments</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">{ticket.comments.length}</span>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-52 overflow-y-auto">
              {ticket.comments.map((c, i) => (
                <div key={c.msg_hash ?? i} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-white">{(c.commentedBy ?? "?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{c.message ?? "—"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {c.commentedBy && <span className="text-xs font-bold text-gray-600">{c.commentedBy}</span>}
                      {(c.appended_at ?? c.received_at) && (
                        <span className="text-[11px] text-gray-400">
                          {new Date(c.appended_at ?? c.received_at!).toLocaleString("en-IN", { hour12: false })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Activity timeline ── */}
        {actEntries.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Activity</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">{actEntries.length}</span>
            </div>
            <div className="px-5 py-4 max-h-52 overflow-y-auto">
              <div className="relative pl-5 space-y-3">
                <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-200" />
                {[...actEntries].reverse().map((e: any, i: number) => {
                  const ts = String(e.timestamp).length > 10 ? new Date(e.timestamp) : new Date(e.timestamp * 1000);
                  const dot =
                    e.type === "RESOLVED" ? "bg-lime-500"  :
                    e.type === "CLOSED"   ? "bg-gray-500"  :
                    e.type === "REOPENED" ? "bg-sky-500"   :
                    e.type === "COMMENT"  ? "bg-blue-400"  :
                    e.type === "TRANSFER" ? "bg-amber-500" : "bg-[#075E54]";
                  return (
                    <div key={i} className="relative">
                      <div className={`absolute -left-3 top-1.5 w-2 h-2 rounded-full ${dot} ring-2 ring-white`} />
                      <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{e.type?.replace(/_/g, " ")}</span>
                        <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{e.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {e.actor && <span className="text-[11px] font-semibold text-gray-600">{e.actor}</span>}
                          <span className="text-[11px] text-gray-400">{ts.toLocaleString("en-IN", { hour12: false })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Attachments (view/download only) ── */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Attachments</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">{ticket.attachments.length}</span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {ticket.attachments.map((path, i) => {
                const name = attachmentFileName(path);
                const url  = attachmentFullUrl(path);
                const ext  = getExt(name);
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
                    {isImg(name)
                      ? <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      : isPdf(name)
                      ? <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      : <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    }
                    <span className="flex-1 text-xs font-medium text-gray-700 truncate" title={name}>{name}</span>
                    {ext && <span className="text-[10px] font-mono uppercase text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded flex-shrink-0">{ext}</span>}
                    <a href={url} target="_blank" rel="noopener noreferrer" title="View"
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                    <button type="button" title="Download" onClick={() => downloadFile(path)}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Transfer history ── */}
        {xferHistory.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Transfer History</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">{xferHistory.length}×</span>
            </div>
            <div className="px-5 py-4 max-h-48 overflow-y-auto">
              <div className="relative pl-4 space-y-3">
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
                {xferHistory.map((h: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-2.5 top-1.5 w-2 h-2 rounded-full bg-[#075E54] ring-2 ring-white" />
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase w-8">From</span>
                        <span className="text-gray-700 font-semibold truncate">{h.fromName ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-[#075E54] uppercase w-8">To</span>
                        <span className="text-[#075E54] font-semibold truncate">{h.toName ?? "—"}</span>
                      </div>
                      {h.reason && <p className="text-gray-500 pt-0.5 border-t border-gray-100 truncate">{h.reason}</p>}
                      {h.transferredAt && (
                        <p className="text-gray-400">{new Date(h.transferredAt).toLocaleString("en-IN", { hour12: false })}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </ChakraUiModal>
  );
};

export default TicketReadOnlyModal;
