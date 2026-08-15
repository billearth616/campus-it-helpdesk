import Link from "next/link";
import { TicketIcon, ClockIcon, UsersIcon, ArrowRightIcon } from "@/components/icons";

const features = [
  {
    Icon: TicketIcon,
    title: "Submit in seconds",
    body: "Report Wi-Fi, hardware, software, or account issues with a simple guided form.",
  },
  {
    Icon: ClockIcon,
    title: "Track every step",
    body: "Follow your ticket from open to resolved, with a full comment history along the way.",
  },
  {
    Icon: UsersIcon,
    title: "Built for IT staff",
    body: "Triage, assign, and resolve tickets across the whole campus from one dashboard.",
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-mesh bg-slate-50">
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <TicketIcon className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-semibold text-slate-900">Campus IT Helpdesk</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Sign in
        </Link>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-6xl w-full mx-auto px-6 py-16 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-medium px-3 py-1 mb-6">
              Campus IT Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              IT problems,{" "}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                resolved fast.
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-md">
              Submit and track IT support tickets. Students and staff report issues; IT staff
              triage, assign, and resolve them &mdash; all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 bg-brand-600 text-white rounded-lg px-5 py-3 text-sm font-semibold shadow-sm shadow-brand-600/20 hover:bg-brand-700 transition-colors"
              >
                Get started
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-slate-700 rounded-lg px-5 py-3 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {features.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-5 shadow-sm"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400">
        Campus IT Helpdesk &amp; Ticketing System
      </footer>
    </div>
  );
}
