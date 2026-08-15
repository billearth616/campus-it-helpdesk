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

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB, matches the storage bucket limit

export async function uploadAttachment(ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    redirect(`/dashboard/tickets/${ticketId}?error=${encodeURIComponent("Choose a file to upload.")}`);
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    redirect(`/dashboard/tickets/${ticketId}?error=${encodeURIComponent("File is too large (10 MB max).")}`);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${ticketId}/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("ticket-attachments")
    .upload(storagePath, file, { contentType: file.type || undefined });

  if (uploadError) {
    redirect(`/dashboard/tickets/${ticketId}?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { error: insertError } = await supabase.from("attachments").insert({
    ticket_id: ticketId,
    uploaded_by: user.id,
    file_name: file.name,
    storage_path: storagePath,
    file_size: file.size,
    content_type: file.type || null,
  });

  if (insertError) {
    // Clean up the orphaned storage object if the row insert failed.
    await supabase.storage.from("ticket-attachments").remove([storagePath]);
    redirect(`/dashboard/tickets/${ticketId}?error=${encodeURIComponent(insertError.message)}`);
  }

  revalidatePath(`/dashboard/tickets/${ticketId}`);
}

export async function deleteAttachment(ticketId: string, attachmentId: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("ticket-attachments").remove([storagePath]);
  await supabase.from("attachments").delete().eq("id", attachmentId);
  revalidatePath(`/dashboard/tickets/${ticketId}`);
}
