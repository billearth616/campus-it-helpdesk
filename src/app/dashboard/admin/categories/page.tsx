import { getProfile } from "@/lib/getProfile";
import { redirect } from "next/navigation";
import { addCategory, deleteCategory } from "./actions";

export default async function CategoriesAdminPage() {
  const { supabase, profile } = await getProfile();
  if (profile.role !== "admin") redirect("/dashboard");

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Manage Categories</h1>

      <form action={addCategory} className="bg-white rounded-lg shadow p-4 flex gap-2">
        <input name="name" placeholder="Category name" required className="flex-1 border rounded px-3 py-2 text-sm" />
        <input name="description" placeholder="Description" className="flex-1 border rounded px-3 py-2 text-sm" />
        <button className="bg-slate-900 text-white rounded px-3 py-2 text-sm">Add</button>
      </form>

      <div className="bg-white rounded-lg shadow divide-y">
        {categories?.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-slate-500">{c.description}</p>
            </div>
            <form action={deleteCategory.bind(null, c.id)}>
              <button className="text-xs text-red-600 hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
