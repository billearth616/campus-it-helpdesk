import { getProfile } from "@/lib/getProfile";
import { redirect } from "next/navigation";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import type { Ticket, TicketStatus, TicketPriority } from "@/lib/types";

const statusMeta: Record<TicketStatus, { label: string; colorClass: string }> = {
  open: { label: "Open", colorClass: "bg-blue-600" },
  in_progress: { label: "In progress", colorClass: "bg-amber-600" },
  resolved: { label: "Resolved", colorClass: "bg-emerald-600" },
  closed: { label: "Closed", colorClass: "bg-slate-500" },
};

const priorityMeta: Record<TicketPriority, { label: string; colorClass: string }> = {
  low: { label: "Low", colorClass: "bg-slate-500" },
  medium: { label: "Medium", colorClass: "bg-sky-600" },
  high: { label: "High", colorClass: "bg-orange-600" },
  urgent: { label: "Urgent", colorClass: "bg-red-600" },
};

function formatDuration(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 48) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

export default async function AnalyticsPage() {
  const { supabase, profile } = await getProfile();
  if (profile.role !== "admin") redirect("/dashboard");

  const { data } = await supabase
    .from("tickets")
    .select("*, categories(name), assignee:profiles!tickets_assigned_to_fkey(full_name)");

  const tickets = (data ?? []) as (Ticket & {
    categories: { name: string } | null;
    assignee: { full_name: string } | null;
  })[];

  const byStatus = (Object.keys(statusMeta) as TicketStatus[]).map((status) => ({
    label: statusMeta[status].label,
    value: tickets.filter((t) => t.status === status).length,
    colorClass: statusMeta[status].colorClass,
  }));

  const byPriority = (Object.keys(priorityMeta) as TicketPriority[]).map((priority) => ({
    label: priorityMeta[priority].label,
    value: tickets.filter((t) => t.priority === priority).length,
    colorClass: priorityMeta[priority].colorClass,
  }));

  const categoryNames = [...new Set(tickets.map((t) => t.categories?.name ?? "Uncategorized"))].sort();
  const byCategory = categoryNames.map((name) => ({
    label: name,
    value: tickets.filter((t) => (t.categories?.name ?? "Uncategorized") === name).length,
  }));

  const assignedTickets = tickets.filter((t) => t.assignee);
  const staffNames = [...new Set(assignedTickets.map((t) => t.assignee!.full_name))].sort();
  const byStaff = staffNames.map((name) => ({
    label: name,
    value: assignedTickets.filter((t) => t.assignee!.full_name === name).length,
  }));
  const unassignedCount = tickets.length - assignedTickets.length;

  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");
  const avgResolutionHours =
    resolvedTickets.length === 0
      ? null
      : resolvedTickets.reduce((sum, t) => {
          const hours = (new Date(t.updated_at).getTime() - new Date(t.created_at).getTime()) / 3_600_000;
          return sum + Math.max(hours, 0);
        }, 0) / resolvedTickets.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Operational overview across all tickets.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total tickets</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{tickets.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Avg. resolution time</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">
            {avgResolutionHours === null ? "—" : formatDuration(avgResolutionHours)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Unassigned</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{unassignedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Active staff</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{staffNames.length}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Tickets by status</h2>
          <HorizontalBarChart data={byStatus} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Tickets by priority</h2>
          <HorizontalBarChart data={byPriority} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Tickets by category</h2>
          <HorizontalBarChart data={byCategory} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Staff workload (assigned tickets)</h2>
          <HorizontalBarChart data={byStaff} emptyLabel="No tickets assigned yet" />
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Resolution time is measured from ticket creation to its last status/assignment
        change, for tickets currently Resolved or Closed — an approximation, since the
        schema does not record a dedicated &ldquo;resolved at&rdquo; timestamp separate
        from general updates.
      </p>
    </div>
  );
}
