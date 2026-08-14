import { notFound } from "next/navigation";
import { getProfile } from "@/lib/getProfile";
import { updateTicketStatus, addComment } from "./actions";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{ticket.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {ticket.categories?.name ?? "Uncategorized"} · Priority: {ticket.priority} · Submitted
              by {ticket.creator?.full_name} on {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-slate-100">{ticket.status.replace("_", " ")}</span>
        </div>
        <p className="mt-4 text-sm whitespace-pre-wrap">{ticket.description}</p>
        {ticket.assignee && (
          <p className="mt-2 text-xs text-slate-500">Assigned to: {ticket.assignee.full_name}</p>
        )}
      </div>

      {isStaff && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-medium mb-3 text-sm">Manage Ticket</h2>
          <form action={updateAction} className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select name="status" defaultValue={ticket.status} className="border rounded px-2 py-1.5 text-sm">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Assign to</label>
              <select
                name="assigned_to"
                defaultValue={ticket.assigned_to ?? ""}
                className="border rounded px-2 py-1.5 text-sm"
              >
                <option value="">Unassigned</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-slate-900 text-white rounded px-3 py-1.5 text-sm">Update</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-medium mb-3 text-sm">Comments</h2>
        <div className="space-y-3 mb-4">
          {comments?.length === 0 && <p className="text-sm text-slate-400">No comments yet.</p>}
          {comments?.map((c) => (
            <div key={c.id} className="border rounded p-3">
              <p className="text-xs text-slate-500 mb-1">
                {c.author?.full_name} ({c.author?.role}) · {new Date(c.created_at).toLocaleString()}
              </p>
              <p className="text-sm">{c.body}</p>
            </div>
          ))}
        </div>
        <form action={commentAction} className="flex gap-2">
          <input
            name="body"
            required
            placeholder="Add a comment..."
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button className="bg-slate-900 text-white rounded px-3 py-2 text-sm">Post</button>
        </form>
      </div>
    </div>
  );
}
