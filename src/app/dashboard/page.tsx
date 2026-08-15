import Link from "next/link";
import { getProfile } from "@/lib/getProfile";
import type { Ticket, TicketStatus } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { InboxIcon, CircleDotIcon, ClockIcon, CheckCircleIcon, ArchiveIcon } from "@/components/icons";

const statusFilters: { value: TicketStatus; label: string; Icon: typeof CircleDotIcon }[] = [
  { value: "open", label: "Open", Icon: CircleDotIcon },
  { value: "in_progress", label: "In progress", Icon: ClockIcon },
  { value: "resolved", label: "Resolved", Icon: CheckCircleIcon },
  { value: "closed", label: "Closed", Icon: ArchiveIcon },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { supabase, profile } = await getProfile();

  let query = supabase
    .from("tickets")
    .select("*, categories(name), creator:profiles!tickets_created_by_fkey(full_name)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: tickets } = await query;
  const { data: allTickets } = await supabase.from("tickets").select("status");

  const isStaff = profile.role === "staff" || profile.role === "admin";
  const counts = {
    open: allTickets?.filter((t) => t.status === "open").length ?? 0,
    in_progress: allTickets?.filter((t) => t.status === "in_progress").length ?? 0,
    resolved: allTickets?.filter((t) => t.status === "resolved").length ?? 0,
    closed: allTickets?.filter((t) => t.status === "closed").length ?? 0,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isStaff ? "All Tickets" : "My Tickets"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isStaff ? "Triage and manage every ticket across campus." : "Track the status of issues you've reported."}
          </p>
        </div>
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center gap-1.5 bg-brand-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors self-start"
        >
          New Ticket
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statusFilters.map(({ value, label, Icon }) => (
          <div key={value} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1.5">{counts[value]}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
        {statusFilters.map(({ value, label }) => (
          <Link
            key={value}
            href={`/dashboard?status=${value}`}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              status === value
                ? "bg-brand-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {label}
          </Link>
        ))}
        {status && (
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-full font-medium text-slate-500 hover:text-slate-700"
          >
            Clear filter
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {(!tickets || tickets.length === 0) && (
          <div className="flex flex-col items-center justify-center gap-2 p-14 text-center">
            <InboxIcon className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No tickets found.</p>
          </div>
        )}
        {tickets?.map((t: Ticket & { categories: { name: string } | null; creator: { full_name: string } | null }) => (
          <Link
            key={t.id}
            href={`/dashboard/tickets/${t.id}`}
            className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{t.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.categories?.name ?? "Uncategorized"} &middot; by {t.creator?.full_name ?? "Unknown"} &middot;{" "}
                {new Date(t.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <PriorityBadge priority={t.priority} />
              <StatusBadge status={t.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
