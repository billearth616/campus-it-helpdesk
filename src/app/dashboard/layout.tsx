import Link from "next/link";
import { getProfile } from "@/lib/getProfile";
import { signOut } from "@/app/auth/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getProfile();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold">
            Campus IT Helpdesk
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:underline">
              Tickets
            </Link>
            <Link href="/dashboard/tickets/new" className="hover:underline">
              New Ticket
            </Link>
            {profile.role === "admin" && (
              <>
                <Link href="/dashboard/admin/categories" className="hover:underline">
                  Categories
                </Link>
                <Link href="/dashboard/admin/users" className="hover:underline">
                  Users
                </Link>
              </>
            )}
            <span className="text-slate-400">
              {profile.full_name} ({profile.role})
            </span>
            <form action={signOut}>
              <button className="text-slate-600 hover:underline" type="submit">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
