"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/getProfile";

export async function updateUserRole(userId: string, formData: FormData) {
  const supabase = await createClient();
  const role = formData.get("role") as string;
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/dashboard/admin/users");
}

export type CreateUserState = {
  error?: string;
  success?: { email: string; tempPassword: string };
};

function generateTempPassword() {
  // 16 random bytes, base64url-encoded -> ~22 chars, meets Supabase's
  // minimum password strength without ever being human-guessable.
  return randomBytes(16).toString("base64url");
}

export async function createUserByAdmin(
  _prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  // Defense-in-depth: this action uses the service-role client below, which
  // bypasses Row Level Security entirely, so the admin check must happen
  // here rather than relying on RLS the way every other mutation in this
  // app does.
  const { profile } = await getProfile();
  if (profile.role !== "admin") {
    return { error: "Only admins can create users." };
  }

  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const role = formData.get("role") as string;

  if (!fullName || !email) {
    return { error: "Full name and email are required." };
  }
  if (!["student", "staff", "admin"].includes(role)) {
    return { error: "Invalid role." };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        "Server is missing SUPABASE_SERVICE_ROLE_KEY — an admin needs to add it to the environment before accounts can be created here.",
    };
  }

  const tempPassword = generateTempPassword();

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });

    if (error) {
      return { error: error.message };
    }
  } catch {
    return { error: "Could not reach the user-management service. Please try again." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: { email, tempPassword } };
}
