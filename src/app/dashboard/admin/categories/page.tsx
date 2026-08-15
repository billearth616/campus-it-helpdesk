import { getProfile } from "@/lib/getProfile";
import { redirect } from "next/navigation";
import { addCategory, deleteCategory } from "./actions";
import { TagIcon, PlusIcon, TrashIcon } from "@/components/icons";

export default async function CategoriesAdminPage() {
  const { supabase, profile } = await getProfile();
  if (profile.role !== "admin") redirect("/dashboard");

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
        <p className="text-sm text-slate-500 mt-0.5">Organize tickets by the type of issue.</p>
      </div>

      <form action={addCategory} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-2">
        <input
          name="name"
          placeholder="Category name"
          required
          className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
        />
        <input
          name="description"
          placeholder="Description"
          className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
        />
        <button className="inline-flex items-center gap-1.5 bg-brand-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer shrink-0">
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {categories?.length === 0 && (
          <p className="p-6 text-sm text-slate-400 text-center">No categories yet.</p>
        )}
        {categories?.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-brand-50 flex items-center justify-center">
                <TagIcon className="h-4.5 w-4.5 text-brand-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500 truncate">{c.description}</p>
              </div>
            </div>
            <form action={deleteCategory.bind(null, c.id)}>
              <button
                aria-label={`Delete ${c.name}`}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
