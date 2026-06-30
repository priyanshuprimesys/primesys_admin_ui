import { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal";
import {
  ActivityEntry,
  IssueCategoryItem,
  IssueResolution,
  IssueTicketComment,
  IssueTicketInterface,
  IssueTicketPriority,
  IssueTicketStatus,
  IssueTicketTransferHistory,
  TransferMember,
} from "../interfaces/IssueTicketInterface";
import {
  addIssueTicketComment, closeIssueTicket, deleteIssueAttachment,
  editIssueTicketComment, getTicketActivity, getTransferHistory,
  getTransferMembers, reopenIssueTicket, resolveIssueTicket,
  transferIssueTicket, updateIssueTicket, uploadIssueAttachment,
} from "../services/api";
import { useGetAllIssueTickets } from "../hooks/GetAllTicketsHook";
import { useGetIssueCategories } from "../hooks/GetIssueCategoriesHook";
import { get_all_issue_tickets_query_key } from "../queryKey/queryKey";
import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../../global/components/input/InputWithSearch/InputWithSearch";
import { useGetStudentDeviceDetailQuery } from "../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { GetDeviceInfoByImei } from "../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/hooks/GetDeviceInfoByImei";
import { IssueDeviceInformation } from "../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/components/IssueDeviceInformation";
import { DeviceInfoDetailResponse } from "../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/Initialstate/DeviceInfoInitialstate";
import { IDeviceInfoDetailResponseInterface } from "../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/Interface/DeviceInfoDetailResponse";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

interface Props {
  ticket: IssueTicketInterface;
  isOpen: boolean;
  onClose: () => void;
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

const fmtCommentDate = (iso?: string) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString("en-IN", { hour12: false }); } catch { return iso; }
};

const formatDt = (iso: string) => {
  try { return new Date(iso).toLocaleString("en-IN", { hour12: false }); } catch { return "—"; }
};

const tsToLocal = (ts?: number): string => {
  if (!ts) return "";
  const d = String(ts).length > 10 ? new Date(ts) : new Date(ts * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const localToTs = (val: string): number => Math.floor(new Date(val).getTime() / 1000);

const attachmentFullUrl  = (path: string) => `http://mykiddytracker.com/${path}`;
const attachmentFileName = (path: string) => path.split("/").pop()?.split("?")[0] ?? path;
const getFileExt = (name: string) => {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
};
const isImage = (name: string) => ["jpg","jpeg","png","gif","webp","bmp","svg"].includes(getFileExt(name));
const isPdf   = (name: string) => getFileExt(name) === "pdf";

const downloadFile = async (path: string) => {
  const url      = attachmentFullUrl(path);
  const fileName = attachmentFileName(path);
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    // fallback: open in new tab if fetch is blocked (e.g. CORS)
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/* ── resolve flat ticket array from varied API shapes ────────────────────── */

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

/* ── resolve categories from varied API shapes ───────────────────────────── */

const resolveCategories = (raw: unknown): IssueCategoryItem[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as IssueCategoryItem[];
  if (typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  for (const key of ["data", "result", "categories", "items"])
    if (Array.isArray(obj[key])) return obj[key] as IssueCategoryItem[];
  return [];
};

const getCategoryLabel = (c: IssueCategoryItem) => c.category ?? c.categoryName ?? c.name ?? "";

/* ── component ───────────────────────────────────────────────────────────── */

const TicketDetailModal = ({ ticket, isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending }                 = useMutation({ mutationFn: updateIssueTicket });
  const { mutateAsync: addComment,  isPending: isAdding       } = useMutation({ mutationFn: addIssueTicketComment });
  const { mutateAsync: editComment } = useMutation({ mutationFn: editIssueTicketComment });
  const { mutateAsync: uploadFile,    isPending: isUploading   } = useMutation({ mutationFn: uploadIssueAttachment });
  const { mutateAsync: doTransfer,    isPending: isTransferring } = useMutation({ mutationFn: transferIssueTicket });
  const { mutateAsync: doResolve,     isPending: isResolving   } = useMutation({ mutationFn: resolveIssueTicket });
  const { mutateAsync: doClose,       isPending: isClosing     } = useMutation({ mutationFn: closeIssueTicket });
  const { mutateAsync: doReopen,      isPending: isReopening   } = useMutation({ mutationFn: reopenIssueTicket });
  const { mutateAsync: doDeleteFile } = useMutation({ mutationFn: deleteIssueAttachment });
  const { data: membersData } = useQuery({ queryKey: ["transfer-members"], queryFn: getTransferMembers, staleTime: 5 * 60 * 1000 });
  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ["transfer-history", ticket.id],
    queryFn:  () => getTransferHistory(ticket.id),
    staleTime: 0,
    enabled:  isOpen,
  });
  const { data: activityData } = useQuery({
    queryKey: ["ticket-activity", ticket.id],
    queryFn:  () => getTicketActivity(ticket.id),
    staleTime: 0,
    enabled:  isOpen,
  });
  const { userDetail } = useContext(UserDetailContext);
  const updatedBy  = userDetail.data.result.divisionId;
  const commenterName = userDetail.data.result.userName ?? updatedBy;

  /* ── categories API ── */
  const { data: catApiData, isLoading: catLoading } = useGetIssueCategories();
  const categories = useMemo(() => {
    // catApiData.data = axios response body = { success, data: [...] } or [...] directly
    const body = catApiData?.data as any;
    return resolveCategories(body?.data ?? body?.result ?? body);
  }, [catApiData]);

  /* ── device search state (pre-populated from ticket) ── */
  const [parentId,   setParentId]   = useState<string>(ticket.divisionId ?? "");
  const [deviceImei, setDeviceImei] = useState<string>(ticket.deviceImei ?? "");
  const { data: studentData, isSuccess } = useGetStudentDeviceDetailQuery(parentId);
  const { data: deviceInfoData }         = GetDeviceInfoByImei(deviceImei);
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfoDetailResponseInterface>(DeviceInfoDetailResponse);

  /* guard: reject IMEI = 0 / "0" / "" from InputWithSearch */
  const handleImeiSelect = (val: string) => {
    const n = Number(val);
    setDeviceImei(!val || n === 0 ? "" : val);
  };

  /* ── form state ── */
  const [status,       setStatus]       = useState<string>(ticket.issueStatus);
  const [priority,     setPriority]     = useState<string>(ticket.priority);
  const [category,     setCategory]     = useState<string>(ticket.category ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(ticket.tags ?? []);
  const [dueDate,      setDueDate]      = useState<string>(tsToLocal(ticket.dueDate));

  /* ── comment state ── */
  const [comments,     setComments]     = useState<IssueTicketComment[]>(
    Array.isArray(ticket.comments) ? ticket.comments : []
  );
  const [newComment,   setNewComment]   = useState<string>("");
  const [showTemplates, setShowTemplates] = useState(false);

  const TEMPLATES = [
    "We are looking into this.",
    "This has been resolved. Please let us know if you face any further issues.",
    "Could you please provide more details about the issue?",
    "We have escalated this to the relevant team.",
    "The issue has been identified and we are working on a fix.",
    "Your ticket has been assigned to a specialist.",
    "We apologise for the inconvenience. This is being addressed.",
  ];
  const [editingIdx,   setEditingIdx]   = useState<number | null>(null);
  const [editText,     setEditText]     = useState<string>("");

  /* ── attachment state ── */
  const [attachments,     setAttachments]     = useState<File[]>([]);
  const [uploadedNames,   setUploadedNames]   = useState<string[]>([]);
  const [uploadError,     setUploadError]     = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver,      setIsDragOver]      = useState(false);

  /* ── transfer state ── */
  const transferHistory: IssueTicketTransferHistory[] =
    (historyData?.data as any)?.data?.result ?? ticket.transfer_history ?? [];
  const [selectedMemberId,   setSelectedMemberId]   = useState<string>("");
  const [transferReason,     setTransferReason]     = useState<string>("");
  const [showTransfer,       setShowTransfer]       = useState<boolean>(false);

  /* ── lifecycle state ── */
  const [resolveOpen,   setResolveOpen]   = useState(false);
  const [closeOpen,     setCloseOpen]     = useState(false);
  const [reopenOpen,    setReopenOpen]    = useState(false);
  const [resolution,    setResolution]    = useState<IssueResolution>("FIXED");
  const [lifecycleNote, setLifecycleNote] = useState("");

  const rawActivity = (activityData?.data as any)?.data;
  const activityEntries: ActivityEntry[] = Array.isArray(rawActivity)
    ? rawActivity
    : Array.isArray(rawActivity?.result)
      ? rawActivity.result
      : [];

  /* ── customer history ── */
  const { data: allTicketData } = useGetAllIssueTickets();
  const customerHistory = useMemo(() => {
    if (!ticket.senderName && !ticket.sender) return [];
    const inner = (allTicketData?.data as { data?: unknown } | undefined)?.data;
    const all   = resolveFlat(inner);
    return all
      .filter(t =>
        t.id !== ticket.id &&
        (t.senderName === ticket.senderName || (t.sender && t.sender === ticket.sender))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [allTicketData, ticket]);

  /* selected category's subcategories */
  const activeCategory = useMemo(
    () => categories.find(c => getCategoryLabel(c) === category),
    [categories, category]
  );
  const subCategories: string[] =
    activeCategory?.subcategories ?? activeCategory?.subCategories ?? [];

  const toggleTag = (tag: string) =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSelectedTags([]);
  };

  useEffect(() => { setDeviceInfo(DeviceInfoDetailResponse); }, []);

  useEffect(() => {
    if (deviceInfoData?.data.success) setDeviceInfo(deviceInfoData.data);
    else setDeviceInfo(DeviceInfoDetailResponse);
  }, [deviceInfoData]);

  const handleAddComment = async () => {
    const msg = newComment.trim();
    if (!msg) return;
    try {
      await addComment({ id: ticket.id, message: msg, commentedBy: commenterName });
      const now = new Date().toISOString();
      setComments(prev => [
        ...prev,
        { message: msg, commentedBy: commenterName, appended_at: now, received_at: now },
      ]);
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to add comment");
    }
  };

  const startEdit = (idx: number, c: IssueTicketComment) => {
    setEditingIdx(idx);
    setEditText(c.message ?? c.source_message_id ?? "");
  };

  const handleSaveEdit = (idx: number, c: IssueTicketComment) => {
    const msg = editText.trim();
    if (!msg) return;
    // update UI immediately
    setComments(prev => prev.map((x, i) => i === idx ? { ...x, message: msg } : x));
    setEditingIdx(null);
    // persist via API if this is an admin comment (has msg_hash)
    if (c.msg_hash) {
      editComment({ id: ticket.id, msgHash: c.msg_hash, message: msg })
        .then(() => queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] }))
        .catch((err: unknown) => {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          alert(axiosErr?.response?.data?.message ?? "Failed to sync comment with server");
        });
    }
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming).filter(
      f => !attachments.some(a => a.name === f.name && a.size === f.size)
    );
    setAttachments(prev => [...prev, ...newFiles]);
    setUploadError("");
  };

  const removeAttachment = (index: number) =>
    setAttachments(prev => prev.filter((_, i) => i !== index));

  const handleUploadAttachments = async () => {
    if (!attachments.length) return;
    setUploadError("");
    const results: string[] = [];
    for (const file of attachments) {
      try {
        await uploadFile({ file, ticketId: ticket.id, updatedBy });
        results.push(file.name);
      } catch {
        setUploadError(`Failed to upload: ${file.name}`);
        return;
      }
    }
    setUploadedNames(prev => [...prev, ...results]);
    setAttachments([]);
  };

  const fmtFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const transferMembers: TransferMember[] =
    ((membersData?.data as any)?.data?.result ?? []).filter(
      (m: TransferMember) => m.id !== updatedBy
    );

  const handleTransfer = async () => {
    if (!selectedMemberId || !transferReason.trim()) return;
    const member = transferMembers.find(m => m.id === selectedMemberId);
    if (!member) return;
    try {
      await doTransfer({
        id: ticket.id,
        toAssignee: member.id,
        toAssigneeName: member.name,
        transferredBy: updatedBy,
        reason: transferReason.trim(),
      });
      setSelectedMemberId("");
      setTransferReason("");
      setShowTransfer(false);
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      refetchHistory();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Transfer failed");
    }
  };

  const handleResolve = async () => {
    try {
      await doResolve({ id: ticket.id, resolution, resolvedBy: updatedBy, note: lifecycleNote.trim() || undefined });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to resolve ticket");
    }
  };

  const handleClose = async () => {
    try {
      await doClose({ id: ticket.id, closedBy: updatedBy, note: lifecycleNote.trim() || undefined });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to close ticket");
    }
  };

  const handleReopen = async () => {
    try {
      await doReopen({ id: ticket.id, reopenedBy: updatedBy, note: lifecycleNote.trim() || undefined });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to reopen ticket");
    }
  };

  const handleDeleteAttachment = async (path: string) => {
    if (!window.confirm(`Delete "${attachmentFileName(path)}"?`)) return;
    try {
      await doDeleteFile({ id: ticket.id, fileName: path, deletedBy: updatedBy });
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message ?? "Failed to delete attachment");
    }
  };

  const canSubmit = !!deviceImei;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      const origTags    = ticket.tags ?? [];
      const tagsChanged = selectedTags.length !== origTags.length || selectedTags.some(t => !origTags.includes(t));
      const origDueDateLocal = tsToLocal(ticket.dueDate);

      const payload: Parameters<typeof mutateAsync>[0] = { id: ticket.id, updatedBy };

      if (status    !== ticket.issueStatus)          payload.issueStatus = status;
      if (priority  !== ticket.priority)              payload.priority    = priority;
      if (category  !== (ticket.category ?? ""))      payload.category    = category || undefined;
      if (tagsChanged)                                payload.tags        = selectedTags.length ? selectedTags : undefined;
      if (dueDate   !== origDueDateLocal)             payload.dueDate     = dueDate ? localToTs(dueDate) : undefined;
      if (deviceImei && deviceImei !== (ticket.deviceImei ?? "")) payload.deviceImei = deviceImei;
      if (parentId   && parentId   !== (ticket.divisionId ?? "")) payload.divisionId  = parentId;

      await mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number }; message?: string; code?: string };
      const msg = axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Failed to update ticket";
      console.error("Update failed:", err);
      alert(msg);
    }
  };

  return (
    <ChakraUiModal isOpen={isOpen} onClose={onClose} modalHeader={`Issue Edit — #${ticket.ticketId}`} modalSize="full">
      <div className="flex h-[84vh] overflow-hidden rounded-xl border border-gray-200 shadow-sm">

        {/* ═══════════════ LEFT PANEL — Device ═══════════════ */}
        <div className="w-[38%] flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
          {/* panel header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#0D1526] border-b border-[#1D3759] flex-shrink-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-widest">Device Link</span>
          </div>
          {/* search inputs */}
          <div className="px-4 py-3 flex flex-col gap-2 border-b border-gray-200 bg-white flex-shrink-0">
            <ParentDataSearchSelect
              divisionId={ticket.divisionId ?? ""}
              setInputData={setParentId}
              placeHolder="Search Division…"
            />
            {(isSuccess && studentData?.data?.success) || parentId ? (
              <InputWithSearch
                dataClear={parentId === ""}
                disabled={parentId === ""}
                setSelectedValue={handleImeiSelect}
                selectedVal="imeiNo"
                data={studentData?.data?.data?.result ?? []}
                name="name"
                placeHolder="Select Device"
                deviceImei={deviceImei}
              />
            ) : null}
          </div>
          {/* device info */}
          <div className="flex-1 overflow-y-auto p-2">
            <IssueDeviceInformation deviceInfo={deviceInfo} />
          </div>
        </div>

        {/* ═══════════════ RIGHT PANEL — Form ═══════════════ */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">

          {/* info strip */}
          <div className="flex items-center flex-wrap gap-y-2 px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <span className="text-sm text-gray-500 pr-5">
              Group: <span className="font-bold text-gray-900">{ticket.groupName}</span>
            </span>
            <span className="hidden sm:block w-px h-5 bg-gray-300 mr-5 flex-shrink-0" />
            <span className="text-sm text-gray-500 pr-5">
              From: <span className="font-bold text-gray-900">{ticket.senderName ?? "—"}</span>
            </span>
            <span className="hidden sm:block w-px h-5 bg-gray-300 mr-5 flex-shrink-0" />
            <span className="text-sm text-gray-500 pr-5">
              Created: <span className="font-bold text-gray-900">{formatDt(ticket.createdAt)}</span>
            </span>
            {ticket.assigneeName && (
              <>
                <span className="hidden sm:block w-px h-5 bg-gray-300 mr-5 flex-shrink-0" />
                <span className="text-sm text-gray-500">
                  Assignee: <span className="font-bold text-[#075E54]">{ticket.assigneeName}</span>
                </span>
              </>
            )}
          </div>

          {/* scrollable sections */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-[#e8eaf0]">

            {/* ── Card: Status / Priority / IMEI / Due ── */}
            <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ticket Details</span>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-4">

                {/* Status */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors ${
                      status === "OPEN"        ? "border-red-300    bg-red-50    text-red-700"    :
                      status === "IN_PROGRESS" ? "border-amber-300  bg-amber-50  text-amber-700"  :
                      status === "RESOLVED"    ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                                                 "border-gray-300   bg-gray-100  text-gray-600"
                    }`}>
                    {(["OPEN","IN_PROGRESS","RESOLVED","CLOSED"] as IssueTicketStatus[]).map(s => (
                      <option key={s} value={s}>{s.replace("_"," ")}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors ${
                      priority === "CRITICAL" ? "border-purple-400 bg-purple-50 text-purple-700"  :
                      priority === "HIGH"     ? "border-red-300    bg-red-50    text-red-700"      :
                      priority === "MEDIUM"   ? "border-amber-300  bg-amber-50  text-amber-700"    :
                                               "border-emerald-300 bg-emerald-50 text-emerald-700"
                    }`}>
                    {(["CRITICAL","HIGH","MEDIUM","LOW"] as IssueTicketPriority[]).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Due Date</label>
                  <input type="datetime-local" value={dueDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-emerald-100" />
                </div>

                {/* Device IMEI */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                    Device IMEI
                    {!deviceImei && <span className="ml-1.5 text-amber-500 font-normal normal-case text-[11px]">— select from left panel</span>}
                  </label>
                  <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors ${
                    deviceImei ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50"
                  }`}>
                    <svg className={`w-4 h-4 flex-shrink-0 ${deviceImei ? "text-emerald-600" : "text-gray-400"}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className={`font-mono text-sm font-semibold flex-1 ${deviceImei ? "text-emerald-800" : "text-gray-400"}`}>
                      {deviceImei || "No device selected"}
                    </span>
                    {deviceImei && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Linked
                      </span>
                    )}
                  </div>
                </div>

                {/* Lifecycle actions */}
                <div className="col-span-2 border-t border-gray-100 pt-3">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Lifecycle</p>

                  {/* OPEN / IN_PROGRESS → Resolve + Close */}
                  {(ticket.issueStatus === "OPEN" || ticket.issueStatus === "IN_PROGRESS") && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => { setResolveOpen(v => !v); setCloseOpen(false); setLifecycleNote(""); }}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${resolveOpen ? "bg-gray-200 text-gray-700" : "bg-lime-600 text-white hover:bg-lime-700"}`}>
                          {resolveOpen ? "Cancel" : "Resolve"}
                        </button>
                        <button type="button" onClick={() => { setCloseOpen(v => !v); setResolveOpen(false); setLifecycleNote(""); }}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${closeOpen ? "bg-gray-200 text-gray-700" : "bg-gray-600 text-white hover:bg-gray-700"}`}>
                          {closeOpen ? "Cancel" : "Close Ticket"}
                        </button>
                      </div>
                      {resolveOpen && (
                        <div className="space-y-3 p-3 bg-lime-50 border border-lime-200 rounded-xl">
                          <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Resolution Type</label>
                            <select value={resolution} onChange={e => setResolution(e.target.value as IssueResolution)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-200 bg-white">
                              {(["FIXED","WONT_FIX","DUPLICATE","INVALID","CANNOT_REPRODUCE"] as IssueResolution[]).map(r => (
                                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Note (optional)</label>
                            <textarea rows={2} value={lifecycleNote} onChange={e => setLifecycleNote(e.target.value)}
                              placeholder="Resolution note…"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-200 resize-none placeholder-gray-400 bg-white" />
                          </div>
                          <button type="button" onClick={handleResolve} disabled={isResolving}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-lime-600 text-white text-xs font-semibold hover:bg-lime-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {isResolving ? "Resolving…" : "Confirm Resolve"}
                          </button>
                        </div>
                      )}
                      {closeOpen && (
                        <div className="space-y-3 p-3 bg-gray-100 border border-gray-300 rounded-xl">
                          <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Note (optional)</label>
                            <textarea rows={2} value={lifecycleNote} onChange={e => setLifecycleNote(e.target.value)}
                              placeholder="Closing note…"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200 resize-none placeholder-gray-400 bg-white" />
                          </div>
                          <button type="button" onClick={handleClose} disabled={isClosing}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {isClosing ? "Closing…" : "Confirm Close"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RESOLVED / CLOSED → Reopen */}
                  {(ticket.issueStatus === "RESOLVED" || ticket.issueStatus === "CLOSED") && (
                    <div className="space-y-3">
                      <button type="button" onClick={() => { setReopenOpen(v => !v); setLifecycleNote(""); }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${reopenOpen ? "bg-gray-200 text-gray-700" : "bg-sky-600 text-white hover:bg-sky-700"}`}>
                        {reopenOpen ? "Cancel" : "Reopen Ticket"}
                      </button>
                      {reopenOpen && (
                        <div className="space-y-3 p-3 bg-sky-50 border border-sky-200 rounded-xl">
                          <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Note (optional)</label>
                            <textarea rows={2} value={lifecycleNote} onChange={e => setLifecycleNote(e.target.value)}
                              placeholder="Reason for reopening…"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 resize-none placeholder-gray-400 bg-white" />
                          </div>
                          <button type="button" onClick={handleReopen} disabled={isReopening}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {isReopening ? "Reopening…" : "Confirm Reopen"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

      {/* ── Card: Customer Message ── */}
      <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-gray-50 border-b border-gray-200">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Customer Message</span>
        </div>
        <div className="px-5 py-2.5">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {ticket.message ?? ticket.summary ?? "—"}
          </p>
        </div>
      </div>
            {/* ── Card: Category & Tags ── */}
            <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Category & Tags</span>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Category</label>
                  <select value={category} onChange={e => handleCategoryChange(e.target.value)} disabled={catLoading}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50">
                    <option value="">{catLoading ? "Loading…" : "— Select category —"}</option>
                    {categories.map((c, i) => {
                      const label = getCategoryLabel(c);
                      return <option key={c.id ?? label ?? i} value={label}>{label}</option>;
                    })}
                  </select>
                </div>
                {subCategories.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Tags
                      {selectedTags.length > 0 && <span className="ml-2 text-emerald-700 normal-case font-semibold">· {selectedTags.length} selected</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subCategories.map(tag => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button key={tag} type="button" onClick={() => toggleTag(tag)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                              active
                                ? "bg-[#075E54] text-white border-[#075E54] shadow-md scale-105"
                                : "bg-white text-gray-500 border-gray-300 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50"
                            }`}>
                            {active && (
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedTags.length > 0 && subCategories.length === 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#075E54] text-white">
                        {tag}
                        <button onClick={() => toggleTag(tag)} className="hover:text-red-300">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>



            {/* ── Card: Comments ── */}
            <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Comments</span>
                  {comments.length > 0 && (
                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{comments.length}</span>
                  )}
                </div>
                {ticket.ticketId && (
                  <span className="text-[11px] font-mono font-semibold text-[#075E54] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    #{ticket.ticketId}
                  </span>
                )}
              </div>
              <div className="px-5 py-2.5 space-y-3">
                {/* comment list */}
                {comments.length > 0 && (
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {comments.map((c, i) => (
                      <div key={c.msg_hash ?? i} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <span className="text-[10px] font-bold text-white">
                            {(c.commentedBy ?? "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingIdx === i ? (
                            <div className="space-y-1.5">
                              <textarea rows={2} value={editText} onChange={e => setEditText(e.target.value)} autoFocus
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#075E54] focus:ring-1 focus:ring-emerald-200 resize-none" />
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleSaveEdit(i, c)}
                                  className="px-3 py-1 rounded-lg bg-[#075E54] text-white text-xs font-semibold hover:bg-emerald-800 transition-colors">Save</button>
                                <button type="button" onClick={() => setEditingIdx(null)}
                                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 text-xs hover:bg-gray-100 transition-colors">Cancel</button>
                                {!editText.trim() && <span className="text-[11px] text-amber-500">Type a message</span>}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-xl px-3 py-2 group border border-gray-100">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm text-gray-800 whitespace-pre-line flex-1">{c.message ?? "—"}</p>
                                <button onClick={() => startEdit(i, c)} title="Edit"
                                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {c.commentedBy && (
                                  <span className="text-xs font-bold text-gray-700">{c.commentedBy}</span>
                                )}
                                {(c.appended_at || c.received_at) && (
                                  <>
                                    <span className="text-gray-300 text-[11px]">·</span>
                                    <span className="text-[11px] text-gray-400">
                                      {c.appended_at ? fmtCommentDate(c.appended_at) : fmtCommentDate(c.received_at!)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* add comment */}
                <div className="pt-1.5 border-t border-gray-100 space-y-2">
                  {/* template picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTemplates(v => !v)}
                      className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                      </svg>
                      Templates
                      <svg className={`w-3 h-3 transition-transform ${showTemplates ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showTemplates && (
                      <div className="absolute bottom-full mb-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-80">
                        {TEMPLATES.map((tpl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setNewComment(tpl); setShowTemplates(false); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors border-b border-gray-50 last:border-0"
                          >
                            {tpl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                      placeholder="Write a comment…"
                      onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#075E54] focus:ring-1 focus:ring-emerald-200 placeholder-gray-400 bg-gray-50" />
                    <button onClick={handleAddComment} disabled={isAdding || !newComment.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#075E54] text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isAdding ? "Adding…" : "Add Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card: Activity Timeline ── */}
            <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Activity</span>
                {activityEntries.length > 0 && (
                  <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activityEntries.length}</span>
                )}
              </div>
              <div className="px-5 py-4 max-h-64 overflow-y-auto">
                {activityEntries.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-2">No activity recorded yet.</p>
                ) : (
                  <div className="relative pl-5 space-y-3">
                    <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-200" />
                    {[...activityEntries].reverse().map((entry, i) => {
                      const ts = String(entry.timestamp).length > 10
                        ? new Date(entry.timestamp)
                        : new Date(entry.timestamp * 1000);
                      const dotColor =
                        entry.type === "RESOLVED" ? "bg-lime-500"  :
                        entry.type === "CLOSED"   ? "bg-gray-500"  :
                        entry.type === "REOPENED" ? "bg-sky-500"   :
                        entry.type === "COMMENT"  ? "bg-blue-400"  :
                        entry.type === "TRANSFER" ? "bg-amber-500" :
                        "bg-[#075E54]";
                      return (
                        <div key={i} className="relative">
                          <div className={`absolute -left-3 top-1.5 w-2 h-2 rounded-full ${dotColor} ring-2 ring-white`} />
                          <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{entry.type?.replace(/_/g, " ")}</span>
                            <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{entry.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {entry.actor && (
                                <span className="text-[11px] font-semibold text-gray-600">{entry.actor}</span>
                              )}
                              <span className="text-[11px] text-gray-400">
                                {ts.toLocaleString("en-IN", { hour12: false })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Card: Attachments ── */}
            <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Attachments</span>
                {(ticket.attachments?.length ?? 0) + uploadedNames.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {(ticket.attachments?.length ?? 0) + uploadedNames.length}
                  </span>
                )}
              </div>
              <div className="px-5 py-4 space-y-4">

                {/* saved attachments */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Saved ({ticket.attachments.length})</p>
                    {ticket.attachments.map((path, i) => {
                      const name = attachmentFileName(path);
                      const url  = attachmentFullUrl(path);
                      const ext  = getFileExt(name);
                      return (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                          {isImage(name)
                            ? <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            : isPdf(name)
                            ? <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            : <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          }
                          <span className="flex-1 text-xs font-medium text-gray-800 truncate" title={name}>{name}</span>
                          {ext && <span className="text-[10px] font-mono uppercase text-gray-400 flex-shrink-0 bg-white px-1.5 py-0.5 rounded border border-gray-200">{ext}</span>}
                          <a href={url} target="_blank" rel="noopener noreferrer" title="View"
                            className="flex-shrink-0 p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <button type="button" title="Download" onClick={() => downloadFile(path)}
                            className="flex-shrink-0 p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button type="button" title="Delete attachment" onClick={() => handleDeleteAttachment(path)}
                            className="flex-shrink-0 p-1.5 rounded-lg bg-white border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* compact attach button */}
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => { e.preventDefault(); setIsDragOver(false); addFiles(e.dataTransfer.files); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed transition-colors ${
                    isDragOver ? "border-[#075E54] bg-emerald-50" : "border-gray-300 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-gray-300 text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Attach files
                  </button>
                  <span className="text-xs text-gray-400">or drop files here</span>
                  <input ref={fileInputRef} type="file" multiple className="hidden"
                    onChange={e => addFiles(e.target.files)}
                    onClick={e => { (e.target as HTMLInputElement).value = ""; }} />
                </div>

                {/* pending files */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Pending ({attachments.length})</p>
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="flex-1 text-xs text-gray-700 truncate font-medium">{file.name}</span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">{fmtFileSize(file.size)}</span>
                        <button type="button" onClick={e => { e.stopPropagation(); removeAttachment(i); }}
                          className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {uploadError && <p className="text-xs text-red-500 font-medium">{uploadError}</p>}
                    <button type="button" onClick={handleUploadAttachments} disabled={isUploading}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#075E54] text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {isUploading ? "Uploading…" : `Upload ${attachments.length} file${attachments.length > 1 ? "s" : ""}`}
                    </button>
                  </div>
                )}

                {/* uploaded this session */}
                {uploadedNames.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Uploaded this session</p>
                    {uploadedNames.map((name, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-emerald-700 font-medium truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Card: Transfer ── */}
            <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transfer</span>
                  {transferHistory.length > 0 && (
                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {transferHistory.length}×
                    </span>
                  )}
                </div>
                <button type="button" onClick={() => setShowTransfer(v => !v)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    showTransfer
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-[#075E54] text-white hover:bg-emerald-800"
                  }`}>
                  {showTransfer ? "Cancel" : "Transfer Ticket"}
                </button>
              </div>
              <div className="px-5 py-4 space-y-4">

                {/* transfer form */}
                {showTransfer && (
                  <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Assign To</label>
                      <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#075E54] focus:ring-1 focus:ring-emerald-100 bg-white">
                        <option value="">— Select member —</option>
                        {transferMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Reason</label>
                      <textarea rows={2} value={transferReason} onChange={e => setTransferReason(e.target.value)}
                        placeholder="Reason for transfer…"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#075E54] focus:ring-1 focus:ring-emerald-200 resize-none placeholder-gray-400 bg-white" />
                    </div>
                    <button type="button" onClick={handleTransfer}
                      disabled={isTransferring || !selectedMemberId || !transferReason.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#075E54] text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {isTransferring ? "Transferring…" : "Confirm Transfer"}
                    </button>
                  </div>
                )}

                {/* transfer history timeline */}
                {transferHistory.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">History</p>
                    <div className="relative pl-4 space-y-3">
                      <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
                      {transferHistory.map((h, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-2.5 top-1.5 w-2 h-2 rounded-full bg-[#075E54] ring-2 ring-white" />
                          <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 text-xs space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-gray-400 uppercase w-8 flex-shrink-0">From</span>
                              <span className="text-gray-700 font-semibold truncate">{h.fromName ?? "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-[#075E54] uppercase w-8 flex-shrink-0">To</span>
                              <span className="text-[#075E54] font-semibold truncate">{h.toName ?? "—"}</span>
                            </div>
                            {h.reason && (
                              <p className="text-gray-500 pt-0.5 border-t border-gray-200 truncate">{h.reason}</p>
                            )}
                            {h.transferredAt && (
                              <p className="text-gray-400">
                                {new Date(h.transferredAt).toLocaleString("en-IN", { hour12: false })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!showTransfer && transferHistory.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-2">No transfer history</p>
                )}
              </div>
            </div>

            {/* ── Card: Customer History ── */}
            {(customerHistory.length > 0 || ticket.senderName) && (
              <div className="rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Customer History</span>
                    {customerHistory.length > 0 && (
                      <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {customerHistory.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{ticket.senderName || "—"}</span>
                </div>
                <div className="px-5 py-3">
                  {customerHistory.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-2">No previous tickets from {ticket.senderName || "this customer"}.</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {customerHistory.map(t => (
                        <div key={t.id} className="flex items-start gap-2.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-[11px] font-bold text-[#075E54]">{t.ticketId}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                t.issueStatus === "OPEN"        ? "bg-amber-100 text-amber-700" :
                                t.issueStatus === "IN_PROGRESS" ? "bg-sky-100 text-sky-700"     :
                                t.issueStatus === "RESOLVED"    ? "bg-lime-100 text-lime-700"   :
                                                                  "bg-gray-100 text-gray-500"
                              }`}>{t.issueStatus.replace("_", " ")}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                t.priority === "HIGH"   ? "bg-red-50 text-red-600"     :
                                t.priority === "MEDIUM" ? "bg-amber-50 text-amber-600" :
                                                          "bg-emerald-50 text-emerald-600"
                              }`}>{t.priority}</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{t.message || t.summary || "—"}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {(() => { try { return new Date(t.createdAt).toLocaleString("en-IN", { hour12: false }); } catch { return t.createdAt; } })()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>{/* end scrollable */}

          {/* ── sticky action bar ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-white">
            {!canSubmit && (
              <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Select a device to enable save
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isPending || !canSubmit}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#075E54] hover:bg-emerald-800 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
                {isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </div>

        </div>{/* end right panel */}
      </div>
    </ChakraUiModal>
  );
};

export default TicketDetailModal;

