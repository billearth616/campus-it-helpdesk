import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles links from Supabase auth emails (password recovery, invites,
// email-change confirmation) and establishes a session from them, then
// sends the user on to `next`. Supabase's hosted verify endpoint can land
// here two different ways depending on project/template configuration, so
// both are handled:
//  - `?code=...`               (PKCE — the default for new projects)
//  - `?token_hash=...&type=...` (used when a template links here directly)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  const errorUrl = new URL("/login", request.url);
  errorUrl.searchParams.set("error", "That link is invalid or has expired. Please try again.");
  return NextResponse.redirect(errorUrl);
}
