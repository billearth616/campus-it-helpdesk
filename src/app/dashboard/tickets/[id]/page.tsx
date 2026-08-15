import { notFound } from "next/navigation";
import { getProfile } from "@/lib/getProfile";
import { updateTicketStatus, addComment, uploadAttachment, deleteAttachment } from "./actions";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { ChatIcon, SendIcon, TagIcon, PaperclipIcon, DownloadIcon, TrashIcon, WarningIcon } from "@/components/icons";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase, profile } = await getProfile();

  const { data: ticket } = await supabase
    .from("tickets")
    .select(
      "*, categories(name), creator:profiles!tickets_created_by_fkey(full_name, email), assignee:profiles!tickets_assigned_to_fkey(full_name)"
    )
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("*, author:profiles(full_name, role)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const { data: attachmentRows } = await supabase
    .from("attachments")
    .select("*, uploader:profiles(full_name)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const attachments = await Promise.all(
    (attachmentRows ?? []).map(async (a) => {
      const { data: signed } = await supabase.storage
        .from("ticket-attachments")
        .createSignedUrl(a.storage_path, 60);
      return { ...a, url: signed?.signedUrl ?? null };
    })
  );

  const isStaff = profile.role === "staff" || profile.role === "admin";

  let staffList: { id: string; full_name: string }[] = [];
  if (isStaff) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("role", ["staff", "admin"]);
    staffList = data ?? [];
  }

  const updateAction = updateTicketStatus.bind(null, id);
  const commentAction = addComment.bind(null, id);
  const uploadAction = uploadAttachment.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          <WarningIcon className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900">{ticket.title}</h1>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-500 mt-2">
              <span className="inline-flex items-center gap-1">
                <TagIcon className="h-3.5 w-3.5" />
                {ticket.categories?.name ?? "Uncategorized"}
              </span>
              <span>&middot;</span>
              <span>
                Submitted by {ticket.creator?.full_name} on{" "}
                {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
        <p className="mt-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {ticket.description}
        </p>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={ticket.priority} />
          {ticket.assignee && (
            <span className="text-xs text-slate-500">
              Assigned to <span className="font-medium text-slate-700">{ticket.assignee.full_name}</span>
            </span>
          )}
        </div>
      </div>

      {isStaff && (
        <div className="bg-brand-50/60 rounded-2xl border border-brand-100 p-6">
          <h2 className="font-semibold mb-3 text-sm text-slate-800">Manage Ticket</h2>
          <form action={updateAction} className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select
                name="status"
                defaultValue={ticket.status}
                className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Assign to</label>
              <select
                name="assigned_to"
                defaultValue={ticket.assigned_to ?? ""}
                className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Unassigned</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors cursor-pointer">
              Update
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold mb-4 text-sm text-slate-800 flex items-center gap-1.5">
          <PaperclipIcon className="h-4 w-4 text-slate-400" />
          Attachments
        </h2>
        <div className="space-y-2 mb-4">
          {attachments.length === 0 && (
            <p className="text-sm text-slate-400">No files attached yet.</p>
          )}
          {attachments.map((a) => {
            const canDelete = isStaff || a.uploaded_by === profile.id;
            const deleteAction = deleteAttachment.bind(null, id, a.id, a.storage_path);
            return (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 border border-slate-100 bg-slate-50/60 rounded-lg px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{a.file_name}</p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(a.file_size)} &middot; {a.uploader?.full_name ?? "Unknown"} &middot;{" "}
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {a.url && (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${a.file_name}`}
                      className="flex items-center justify-center h-8 w-8 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </a>
                  )}
                  {canDelete && (
                    <form action={deleteAction}>
                      <button
                        aria-label={`Delete ${a.file_name}`}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <form action={uploadAction} className="flex gap-2 items-center flex-wrap">
          <input
            name="file"
            type="file"
            required
            className="flex-1 min-w-[12rem] text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 file:cursor-pointer cursor-pointer"
          />
          <button className="inline-flex items-center gap-1.5 bg-brand-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
            <PaperclipIcon className="h-4 w-4" />
            Upload
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2">Images, PDFs, and documents up to 10 MB.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold mb-4 text-sm text-slate-800 flex items-center gap-1.5">
          <ChatIcon className="h-4 w-4 text-slate-400" />
          Comments
        </h2>
        <div className="space-y-3 mb-5">
          {comments?.length === 0 && (
            <p className="text-sm text-slate-400">No comments yet &mdash; be the first to reply.</p>
          )}
          {comments?.map((c) => (
            <div key={c.id} className="border border-slate-100 bg-slate-50/60 rounded-xl p-3.5">
              <p className="text-xs text-slate-500 mb-1">
                <span className="font-medium text-slate-700">{c.author?.full_name}</span>{" "}
                <span className="capitalize">({c.author?.role})</span> &middot;{" "}
                {new Date(c.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-slate-700">{c.body}</p>
            </div>
          ))}
        </div>
        <form action={commentAction} className="flex gap-2">
          <input
            name="body"
            required
            placeholder="Add a comment..."
            className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
          />
          <button className="inline-flex items-center gap-1.5 bg-brand-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
            <SendIcon className="h-4 w-4" />
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
