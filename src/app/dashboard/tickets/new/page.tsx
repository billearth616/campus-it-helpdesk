import { createClient } from "@/lib/supabase/server";
import { createTicket } from "./actions";

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">Submit a New Ticket</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <form action={createTicket} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category_id" className="w-full border rounded px-3 py-2 text-sm">
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select name="priority" defaultValue="medium" className="w-full border rounded px-3 py-2 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
