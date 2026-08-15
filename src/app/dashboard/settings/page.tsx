import { getProfile } from "@/lib/getProfile";
import { changeOwnPassword } from "@/app/auth/actions";
import { WarningIcon, CheckCircleIcon, LockIcon } from "@/components/icons";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; updated?: string }>;
}) {
  const { error, updated } = await searchParams;
  const { profile } = await getProfile();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Account</h2>
        <dl className="text-sm space-y-1.5">
          <div className="flex gap-2">
            <dt className="text-slate-500 w-20 shrink-0">Name</dt>
            <dd className="text-slate-800 font-medium">{profile.full_name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-500 w-20 shrink-0">Email</dt>
            <dd className="text-slate-800 font-medium">{profile.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-500 w-20 shrink-0">Role</dt>
            <dd className="text-slate-800 font-medium capitalize">{profile.role}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Change password</h2>

        {updated && (
          <div className="mb-4 flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <CheckCircleIcon className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Password updated.</span>
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            <WarningIcon className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form action={changeOwnPassword} className="space-y-4">
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
            className="inline-flex items-center gap-1.5 bg-brand-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors cursor-pointer"
          >
            <LockIcon className="h-4 w-4" />
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
