"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category_id = (formData.get("category_id") as string) || null;
  const priority = (formData.get("priority") as string) || "medium";

  if (!title.trim() || !description.trim()) {
    redirect("/dashboard/tickets/new?error=Title and description are required");
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      title,
      description,
      category_id,
      priority,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/dashboard/tickets/new?error=${encodeURIComponent(error?.message ?? "Could not create ticket")}`);
  }

  redirect(`/dashboard/tickets/${data.id}`);
}
