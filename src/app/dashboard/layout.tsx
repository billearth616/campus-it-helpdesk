import Link from "next/link";
import { getProfile } from "@/lib/getProfile";
import { signOut } from "@/app/auth/actions";
import { TicketIcon, PlusIcon, TagIcon, UsersIcon, SignOutIcon, GearIcon, BarChartIcon } from "@/components/icons";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getProfile();
  const initials = profile.full_name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleStyles: Record<string, string> = {
    admin: "bg-accent-50 text-accent-700",
    staff: "bg-brand-50 text-brand-700",
    student: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <TicketIcon className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 hidden sm:inline">Campus IT Helpdesk</span>
          </Link>

          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
            >
              <TicketIcon className="h-4 w-4" />
              <span className="hidden md:inline">Tickets</span>
            </Link>
            <Link
              href="/dashboard/tickets/new"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden md:inline">New Ticket</span>
            </Link>
            {profile.role === "admin" && (
              <>
                <Link
                  href="/dashboard/admin/categories"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  <TagIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Categories</span>
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  <UsersIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Users</span>
                </Link>
                <Link
                  href="/dashboard/admin/analytics"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  <BarChartIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Analytics</span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/settings"
              className="hidden sm:flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-slate-800">{profile.full_name}</p>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-medium capitalize ${roleStyles[profile.role]}`}
                >
                  {profile.role}
                </span>
              </div>
            </Link>
            <Link
              href="/dashboard/settings"
              aria-label="Settings"
              className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors sm:hidden"
            >
              <GearIcon className="h-4.5 w-4.5" />
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Sign out"
                className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <SignOutIcon className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
