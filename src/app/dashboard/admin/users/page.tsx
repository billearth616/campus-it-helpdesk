import { getProfile } from "@/lib/getProfile";
import { redirect } from "next/navigation";
import { updateUserRole } from "./actions";

export default async function UsersAdminPage() {
  const { supabase, profile } = await getProfile();
  if (profile.role !== "admin") redirect("/dashboard");

  const { data: users } = await supabase.from("profiles").select("*").order("created_at");

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Manage Users</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {users?.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium">{u.full_name}</p>
              <p className="text-xs text-slate-500">{u.email}</p>
            </div>
            <form action={updateUserRole.bind(null, u.id)} className="flex gap-2 items-center">
              <select name="role" defaultValue={u.role} className="border rounded px-2 py-1 text-sm">
                <option value="student">Student</option>
                <option value="staff">IT Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button className="text-xs bg-slate-900 text-white rounded px-2 py-1">Save</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
