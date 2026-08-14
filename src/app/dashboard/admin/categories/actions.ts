"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  if (!name.trim()) return;

  await supabase.from("categories").insert({ name, description });
  revalidatePath("/dashboard/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/dashboard/admin/categories");
}
