"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = (formData.get("role") as string) || "student";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function siteOrigin() {
  const h = await headers();
  return h.get("origin") ?? `https://${h.get("host")}`;
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const origin = await siteOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?type=recovery&next=/reset-password`,
  });

  // Always redirect to the same "check your email" state, whether or not
  // the address is registered — avoids leaking which emails have accounts.
  redirect("/forgot-password?sent=1");
}

async function changePassword(formData: FormData, formPath: string) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password.length < 6) {
    redirect(`${formPath}?error=${encodeURIComponent("Password must be at least 6 characters.")}`);
  }
  if (password !== confirmPassword) {
    redirect(`${formPath}?error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`${formPath}?error=${encodeURIComponent(error.message)}`);
  }

  return true;
}

// Used by /reset-password (after clicking the emailed recovery link).
export async function updatePassword(formData: FormData) {
  await changePassword(formData, "/reset-password");
  redirect("/login?reset=1");
}

// Used by the logged-in "Change password" form in dashboard settings.
export async function changeOwnPassword(formData: FormData) {
  await changePassword(formData, "/dashboard/settings");
  redirect("/dashboard/settings?updated=1");
}
