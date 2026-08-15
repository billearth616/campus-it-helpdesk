import Link from "next/link";
import { updatePassword } from "@/app/auth/actions";
import { TicketIcon, WarningIcon, LockIcon } from "@/components/icons";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-mesh px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="h-11 w-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/30">
            <TicketIcon className="h-5.5 w-5.5 text-white" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Set a new password</h1>
          <p className="text-sm text-slate-500 mb-6">Choose a new password for your account.</p>

          {error && (
            <div className="mb-5 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              <WarningIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form action={updatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Re-enter password"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors cursor-pointer"
            >
              <LockIcon className="h-4 w-4" />
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
