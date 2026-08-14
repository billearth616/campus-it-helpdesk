"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateUserRole(userId: string, formData: FormData) {
  const supabase = await createClient();
  const role = formData.get("role") as string;
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/dashboard/admin/users");
}
