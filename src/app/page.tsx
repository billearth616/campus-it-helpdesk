import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-3">Campus IT Helpdesk</h1>
        <p className="text-slate-500 mb-8">
          Submit and track IT support tickets. Students and staff report issues; IT staff
          triage, assign, and resolve them.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="bg-slate-900 text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="border rounded px-5 py-2.5 text-sm font-medium hover:bg-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
