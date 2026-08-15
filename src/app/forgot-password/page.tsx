import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { TicketIcon, MailIcon, CheckCircleIcon } from "@/components/icons";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-mesh px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="h-11 w-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/30">
            <TicketIcon className="h-5.5 w-5.5 text-white" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {sent ? (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-11 w-11 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircleIcon className="h-5.5 w-5.5 text-emerald-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Check your email</h1>
              <p className="text-sm text-slate-500">
                If an account exists for that address, we&rsquo;ve sent a link to reset your
                password. It may take a minute to arrive.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Forgot password?</h1>
              <p className="text-sm text-slate-500 mb-6">
                Enter your email and we&rsquo;ll send you a reset link.
              </p>
              <form action={requestPasswordReset} className="space-y-4">
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
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  <MailIcon className="h-4 w-4" />
                  Send reset link
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-sm text-slate-500 mt-6 text-center">
          <Link href="/login" className="text-brand-700 font-medium hover:text-brand-800">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
