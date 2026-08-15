import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { TicketIcon, WarningIcon, CheckCircleIcon } from "@/components/icons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-mesh px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="h-11 w-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/30">
            <TicketIcon className="h-5.5 w-5.5 text-white" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to Campus IT Helpdesk</p>

          {reset && (
            <div className="mb-5 flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <CheckCircleIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Password updated. Sign in with your new password.</span>
            </div>
          )}
          {error && (
            <div className="mb-5 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              <WarningIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@campus.edu"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-brand-700 hover:text-brand-800">
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-sm text-slate-500 mt-6 text-center">
          No account?{" "}
          <Link href="/signup" className="text-brand-700 font-medium hover:text-brand-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
