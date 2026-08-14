import Link from "next/link";
import { getProfile } from "@/lib/getProfile";
import type { Ticket } from "@/lib/types";

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-slate-200 text-slate-600",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-sky-100 text-sky-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

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

  const isStaff = profile.role === "staff" || profile.role === "admin";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          {isStaff ? "All Tickets" : "My Tickets"}
        </h1>
        <div className="flex gap-2 text-sm">
          {["open", "in_progress", "resolved", "closed"].map((s) => (
            <Link
              key={s}
              href={`/dashboard?status=${s}`}
              className={`px-2 py-1 rounded ${status === s ? "bg-slate-900 text-white" : "bg-white border"}`}
            >
              {s.replace("_", " ")}
            </Link>
          ))}
          {status && (
            <Link href="/dashboard" className="px-2 py-1 rounded bg-white border">
              clear
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {(!tickets || tickets.length === 0) && (
          <p className="p-6 text-sm text-slate-500">No tickets found.</p>
        )}
        {tickets?.map((t: Ticket & { categories: { name: string } | null; creator: { full_name: string } | null }) => (
          <Link
            key={t.id}
            href={`/dashboard/tickets/${t.id}`}
            className="flex items-center justify-between p-4 hover:bg-slate-50"
          >
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-xs text-slate-500">
                {t.categories?.name ?? "Uncategorized"} · by {t.creator?.full_name ?? "Unknown"} ·{" "}
                {new Date(t.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-1 rounded ${priorityColors[t.priority]}`}>
                {t.priority}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${statusColors[t.status]}`}>
                {t.status.replace("_", " ")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
