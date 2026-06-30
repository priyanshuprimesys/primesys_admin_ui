import { ChangeEvent, useContext, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal";
import {
  IssueCategoryItem,
  IssueTicketInterface,
  IssueTicketPriority,
} from "../interfaces/IssueTicketInterface";
import {
  addIssueTicketComment,
  createIssueTicket,
  pickupIssueTicket,
  uploadIssueAttachment,
} from "../services/api";
import { useGetIssueCategories } from "../hooks/GetIssueCategoriesHook";
import { get_all_issue_tickets_query_key } from "../queryKey/queryKey";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../../global/components/input/InputWithSearch/InputWithSearch";
import { useGetStudentDeviceDetailQuery } from "../../../../api/queries/app/hooks/student-device-detail-api-hooks";

interface Props { isOpen: boolean; onClose: () => void; }

const localToTs = (val: string) => Math.floor(new Date(val).getTime() / 1000);
const fmtSize   = (b: number)   => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

const resolveCategories = (raw: unknown): IssueCategoryItem[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as IssueCategoryItem[];
  if (typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  for (const k of ["data", "result", "categories", "items"])
    if (Array.isArray(obj[k])) return obj[k] as IssueCategoryItem[];
  return [];
};
const getCategoryLabel = (c: IssueCategoryItem) => c.category ?? c.categoryName ?? c.name ?? "";
const PRIORITY_OPTIONS: IssueTicketPriority[] = ["HIGH", "MEDIUM", "LOW"];

const extractId = (resData: unknown): string => {
  const d = resData as any;
  return (
    d?.data?.id       ?? d?.data?._id       ??
    d?.result?.id     ?? d?.result?._id     ??
    d?.data?.data?.id ?? d?.data?.data?._id ??
    d?.id             ?? d?._id             ?? ""
  );
};

const flattenCached = (cached: unknown): IssueTicketInterface[] => {
  const inner = (cached as any)?.data?.data;
  if (!inner) return [];
  if (Array.isArray(inner)) return inner as IssueTicketInterface[];
  if (typeof inner !== "object") return [];
  for (const k of ["result", "content", "data", "tickets", "items", "records"]) {
    if (Array.isArray((inner as any)[k])) return (inner as any)[k] as IssueTicketInterface[];
  }
  const vals = Object.values(inner as Record<string, unknown>);
  if (vals.length && Array.isArray(vals[0])) return (vals as IssueTicketInterface[][]).flat();
  return [];
};

/* ─────────────────────────── Modal ─────────────────────────── */

const CreateTicketModal = ({ isOpen, onClose }: Props) => {
  const queryClient   = useQueryClient();
  const { mutateAsync: doCreate  } = useMutation({ mutationFn: createIssueTicket });
  const { mutateAsync: doComment } = useMutation({ mutationFn: addIssueTicketComment });
  const { mutateAsync: doUpload  } = useMutation({ mutationFn: uploadIssueAttachment });
  const { mutateAsync: doPickup  } = useMutation({ mutationFn: pickupIssueTicket });

  const { userDetail } = useContext(UserDetailContext);
  const createdBy     = userDetail.data.result.divisionId;
  const commenterName = userDetail.data.result.userName ?? createdBy;

  const { data: catApiData, isLoading: catLoading } = useGetIssueCategories();
  const categories = useMemo(() => {
    const body = catApiData?.data as any;
    return resolveCategories(body?.data ?? body?.result ?? body);
  }, [catApiData]);

  /* device */
  const [parentId,   setParentId]   = useState("");
  const [deviceImei, setDeviceImei] = useState("");
  const { data: studentData, isSuccess: devicesLoaded, isLoading: devicesLoading } =
    useGetStudentDeviceDetailQuery(parentId);
  const deviceList: any[] = devicesLoaded ? (studentData?.data?.data?.result ?? []) : [];
  const handleImeiSelect = (val: string) => {
    const strVal = String(val ?? "");
    const n = Number(strVal);
    setDeviceImei(!strVal || n === 0 ? "" : strVal);
  };

  /* form fields */
  const [groupName,    setGroupName]    = useState("");
  const [senderName,   setSenderName]   = useState("");
  const [priority,     setPriority]     = useState<string>("MEDIUM");
  const [message,      setMessage]      = useState("");
  const [category,     setCategory]     = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate,      setDueDate]      = useState("");

  /* comment */
  const [pendingComment, setPendingComment] = useState("");

  /* attachments */
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragOver,   setIsDragOver]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* submission */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");

  /* success */
  const [successInfo, setSuccessInfo] = useState<{
    display: string;
    commentError?: string;
    uploadErrors: string[];
  } | null>(null);

  /* category helpers */
  const activeCategory = useMemo(
    () => categories.find(c => getCategoryLabel(c) === category),
    [categories, category]
  );
  const subCategories: string[] = activeCategory?.subcategories ?? activeCategory?.subCategories ?? [];
  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleCategoryChange = (val: string) => { setCategory(val); setSelectedTags([]); };

  /* file helpers */
  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    setIsDragOver(false);
    const incoming = Array.from(fl).filter(f => !pendingFiles.some(a => a.name === f.name && a.size === f.size));
    setPendingFiles(prev => [...prev, ...incoming]);
  };
  const removeFile = (i: number) => setPendingFiles(prev => prev.filter((_, idx) => idx !== i));

  const resetForm = () => {
    setParentId(""); setDeviceImei("");
    setGroupName(""); setSenderName(""); setPriority("MEDIUM"); setMessage("");
    setCategory(""); setSelectedTags([]); setDueDate("");
    setPendingComment(""); setPendingFiles([]);
    setError(""); setIsSubmitting(false); setSuccessInfo(null);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleCreate = async () => {
    if (!groupName.trim()) { setError("Group name is required. Select a division first."); return; }
    if (!deviceImei)       { setError("Device selection is required. Select a division and pick a device."); return; }
    if (!message.trim())   { setError("Issue description is required."); return; }
    setError("");
    setIsSubmitting(true);
    const grpSnap = groupName.trim();
    const msgSnap = message.trim();

    try {
      /* 1. create ticket */
      const res = await doCreate({
        groupName:   grpSnap,
        senderName:  senderName.trim() || undefined,
        priority,
        issueStatus: "OPEN",
        message:     msgSnap,
        category:    category          || undefined,
        tags:        selectedTags.length ? selectedTags : undefined,
        dueDate:     dueDate            ? localToTs(dueDate) : undefined,
        divisionId:  parentId           || undefined,
        deviceImei:  deviceImei         || undefined,
        createdBy,
        assignee:     createdBy,
        assigneeName: commenterName,
      });

      /* 2. extract ticket ID from response */
      let mongoId = extractId(res.data);
      let humanId = (res.data as any)?.data?.ticketId ?? (res.data as any)?.data?.data?.ticketId ?? "";

      /* 3. always refetch list */
      await queryClient.refetchQueries({ queryKey: [get_all_issue_tickets_query_key] });

      /* 4. fallback: find ticket from refreshed list */
      if (!mongoId) {
        const cached   = queryClient.getQueryData([get_all_issue_tickets_query_key]);
        const allTickets = flattenCached(cached);
        const match = allTickets
          .filter(t => t.groupName === grpSnap && t.message === msgSnap)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        mongoId = match?.id ?? "";
        humanId = humanId || (match?.ticketId ?? "");
      }

      if (!mongoId) {
        setError("Ticket was created but its ID could not be determined. Please add comment/attachment from the ticket detail view.");
        setIsSubmitting(false);
        return;
      }

      /* 5. mark as picked up so it carries a real PICKED_UP entry from creation (non-fatal) */
      try {
        await doPickup({ id: mongoId, userId: createdBy, userName: commenterName });
      } catch (e) {
        console.error("Auto-pickup on create failed:", e);
      }

      /* 6. post comment */
      let commentError: string | undefined;
      if (pendingComment.trim()) {
        try {
          await doComment({ id: mongoId, message: pendingComment.trim(), commentedBy: commenterName });
        } catch (e) {
          const ae = e as { response?: { data?: { message?: string } } };
          commentError = ae?.response?.data?.message ?? "Failed to add comment";
        }
      }

      /* 7. upload attachments */
      const uploadErrors: string[] = [];
      for (const file of pendingFiles) {
        try {
          await doUpload({ file, ticketId: mongoId, updatedBy: createdBy });
        } catch (e) {
          const ae = e as { response?: { data?: { message?: string } } };
          uploadErrors.push(ae?.response?.data?.message ?? `Failed to upload: ${file.name}`);
        }
      }

      queryClient.invalidateQueries({ queryKey: [get_all_issue_tickets_query_key] });
      setSuccessInfo({ display: humanId || mongoId, commentError, uploadErrors });
    } catch (err: unknown) {
      const ae = err as { response?: { data?: { message?: string } } };
      setError(ae?.response?.data?.message ?? "Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── render ── */
  return (
    <ChakraUiModal isOpen={isOpen} onClose={handleClose} modalHeader="New Issue Ticket" modalSize="xl">

      {/* ── success view ── */}
      {successInfo ? (
        <div className="space-y-3 py-1">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-emerald-800">Ticket created successfully!</p>
            {successInfo.display && (
              <span className="ml-auto text-[11px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                #{successInfo.display}
              </span>
            )}
          </div>
          {successInfo.commentError && (
            <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              Comment: {successInfo.commentError}
            </p>
          )}
          {successInfo.uploadErrors.map((e, i) => (
            <p key={i} className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              Upload: {e}
            </p>
          ))}
          <div className="flex justify-end pt-1">
            <button type="button" onClick={handleClose}
              className="px-6 py-2 rounded bg-[#075E54] hover:bg-emerald-800 text-white text-sm font-semibold transition-colors">
              Done
            </button>
          </div>
        </div>
      ) : (

      /* ── form view ── */
      <div className="space-y-4 py-1">

        {/* 1. Link Device */}
        <div className="border-2 border-black rounded-lg p-3 space-y-2">
          <h3 className="text-xs font-semibold flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Link Device <span className="text-red-500">*</span>
            <span className="text-[11px] font-normal text-gray-400 ml-1">— auto-fills group name</span>
          </h3>
          <div className="flex gap-2">
            <ParentDataSearchSelect
              divisionId=""
              setInputData={setParentId}
              setParentWhatsAppName={(name: string) => { if (name) setGroupName(name); }}
              placeHolder="Search Division…"
            />
            {parentId && devicesLoading && (
              <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
                <svg className="animate-spin w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading devices…
              </div>
            )}
            {parentId && devicesLoaded && (
              <InputWithSearch
                dataClear={false}
                disabled={false}
                setSelectedValue={handleImeiSelect}
                selectedVal="imeiNo"
                data={deviceList}
                name="name"
                placeHolder="Select Device"
                deviceImei={deviceImei}
              />
            )}
          </div>
          {deviceImei ? (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-50 border border-emerald-200 rounded text-xs">
              <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="font-mono font-semibold text-emerald-800">{deviceImei}</span>
              <button type="button" onClick={() => setDeviceImei("")}
                className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-red-500 font-medium">Select a division, then pick a device. Device is required.</p>
          )}
        </div>

        {/* 2. Group + Sender */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold">
              Group Name (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <input value={groupName} onChange={e => setGroupName(e.target.value)}
              placeholder="Auto-filled from division"
              className="px-2 py-2 border-2 border-gray-300 rounded outline-none focus:border-[#075E54] text-sm" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold">Sender Name</label>
            <input value={senderName} onChange={e => setSenderName(e.target.value)}
              placeholder="e.g. John Doe"
              className="px-2 py-2 border-2 border-gray-300 rounded outline-none focus:border-[#075E54] text-sm" />
          </div>
        </div>

        {/* 3. Priority + Due Date */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}
              className="px-2 py-2 border-2 border-gray-300 rounded outline-none focus:border-[#075E54] text-sm">
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold">Due Date</label>
            <input type="datetime-local" value={dueDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
              className="px-2 py-2 border-2 border-gray-300 rounded outline-none focus:border-[#075E54] text-sm" />
          </div>
        </div>

        {/* Assigned To */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">Assigned To</label>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded cursor-not-allowed">
            <div className="w-6 h-6 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {commenterName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{commenterName}</span>
            <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">You</span>
          </div>
        </div>

        {/* 4. Category + Tags */}
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <label className="text-xs font-semibold block">Category</label>
          <select value={category} onChange={e => handleCategoryChange(e.target.value)}
            disabled={catLoading}
            className="w-full px-2 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#075E54] disabled:opacity-50">
            <option value="">{catLoading ? "Loading…" : "— Select category —"}</option>
            {categories.map((c, i) => {
              const label = getCategoryLabel(c);
              return <option key={c.id ?? i} value={label}>{label}</option>;
            })}
          </select>
          {subCategories.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-500 mb-1.5">
                Tags {selectedTags.length > 0 && <span className="text-emerald-700 font-semibold">({selectedTags.length})</span>}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {subCategories.map(tag => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        active ? "bg-[#075E54] text-white border-[#075E54]" : "bg-white text-gray-600 border-gray-300 hover:border-emerald-500"
                      }`}>
                      {active && <span className="mr-1">✓</span>}{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Issue Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">
            Issue Description <span className="text-red-500">*</span>
          </label>
          <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Describe the issue in detail…"
            className="px-2 py-2 border-2 border-gray-300 rounded outline-none focus:border-[#075E54] text-sm resize-none placeholder-gray-400" />
        </div>

        {/* 6. Comments — same style as TicketDetailModal */}
        <div className="border-2 border-black rounded p-3 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            Comments
            <span className="text-[11px] font-normal text-gray-400">(optional)</span>
          </h2>
          <div className="pt-1 border-t border-gray-200 space-y-1.5">
            <textarea
              rows={2}
              value={pendingComment}
              onChange={e => setPendingComment(e.target.value)}
              placeholder="Write a comment…"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#075E54] focus:ring-1 focus:ring-emerald-200 resize-none placeholder-gray-400"
            />
            <span className="text-[11px] text-gray-400">Will be posted when ticket is created</span>
          </div>
        </div>

        {/* 7. Attachments — same style as TicketDetailModal */}
        <div className="border-2 border-black rounded p-3 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Attachments
            {pendingFiles.length > 0 && (
              <span className="text-[11px] font-normal bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                {pendingFiles.length} queued
              </span>
            )}
            <span className="text-[11px] font-normal text-gray-400">(optional)</span>
          </h2>

          {/* drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-1.5 px-4 py-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragOver ? "border-[#075E54] bg-emerald-50" : "border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xs text-gray-500 font-medium">Drop files here or click to browse</p>
            <p className="text-[11px] text-gray-400">Will be uploaded when ticket is created</p>
            <input ref={fileInputRef} type="file" multiple className="hidden"
              onChange={e => addFiles(e.target.files)}
              onClick={e => { (e.target as HTMLInputElement).value = ""; }} />
          </div>

          {/* pending files */}
          {pendingFiles.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] text-gray-500 font-medium">Queued ({pendingFiles.length}):</p>
              {pendingFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 text-xs text-gray-700 truncate font-medium">{f.name}</span>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{fmtSize(f.size)}</span>
                  <button type="button"
                    onClick={e => { e.stopPropagation(); removeFile(i); }}
                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={handleCreate} disabled={isSubmitting || !deviceImei}
            title={!deviceImei ? "Select a device first" : undefined}
            className="px-6 py-2 rounded bg-[#075E54] hover:bg-emerald-800 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? "Creating…" : "Create Ticket"}
          </button>
          <button type="button" onClick={handleClose}
            className="px-6 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
            Cancel
          </button>
        </div>
      </div>
      )}
    </ChakraUiModal>
  );
};

export default CreateTicketModal;


