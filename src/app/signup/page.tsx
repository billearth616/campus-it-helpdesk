import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold mb-1">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Campus IT Helpdesk</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form action={signUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              name="fullName"
              type="text"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">I am a</label>
            <select
              name="role"
              className="w-full border rounded px-3 py-2 text-sm"
              defaultValue="student"
            >
              <option value="student">Student</option>
              <option value="staff">IT Staff</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Admin accounts are promoted manually by an administrator.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white rounded py-2 text-sm font-medium hover:bg-slate-800"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-slate-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
