import { getProfile } from "@/lib/getProfile";
import { redirect } from "next/navigation";
import { updateUserRole } from "./actions";

export default async function UsersAdminPage() {
  const { supabase, profile } = await getProfile();
  if (profile.role !== "admin") redirect("/dashboard");

  const { data: users } = await supabase.from("profiles").select("*").order("created_at");

  const roleStyles: Record<string, string> = {
    admin: "bg-accent-50 text-accent-700",
    staff: "bg-brand-50 text-brand-700",
    student: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">Promote staff and admins, or adjust roles.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {users?.map((u) => {
          const initials = u.full_name
            .split(" ")
            .map((p: string) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return (
            <div key={u.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 shrink-0 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{u.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
              </div>
              <form action={updateUserRole.bind(null, u.id)} className="flex gap-2 items-center shrink-0">
                <span className={`hidden sm:inline text-[11px] px-1.5 py-0.5 rounded font-medium capitalize ${roleStyles[u.role]}`}>
                  {u.role}
                </span>
                <select
                  name="role"
                  defaultValue={u.role}
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="student">Student</option>
                  <option value="staff">IT Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="text-xs bg-brand-600 text-white rounded-lg px-3 py-1.5 font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
                  Save
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
