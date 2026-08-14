"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateTicketStatus(ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const status = formData.get("status") as string;
  const assigned_to = (formData.get("assigned_to") as string) || null;

  await supabase
    .from("tickets")
    .update({ status, assigned_to })
    .eq("id", ticketId);

  revalidatePath(`/dashboard/tickets/${ticketId}`);
}

export async function addComment(ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const body = formData.get("body") as string;
  if (!body.trim()) return;

  await supabase.from("comments").insert({
    ticket_id: ticketId,
    author_id: user.id,
    body,
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
}
