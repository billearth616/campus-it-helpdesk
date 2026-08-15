"use client";

import { useActionState, useState } from "react";
import { createUserByAdmin, type CreateUserState } from "./actions";
import { PlusIcon, WarningIcon, CheckCircleIcon } from "@/components/icons";

const initialState: CreateUserState = {};

export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createUserByAdmin, initialState);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 p-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <PlusIcon className="h-4 w-4 text-brand-600" />
          Add User
        </span>
        <span className="text-xs text-slate-400">{open ? "Hide" : "Create an account directly"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4">
          {state.success ? (
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <CheckCircleIcon className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Account created for <span className="font-medium">{state.success.email}</span>.</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">
                  Temporary password &mdash; share this with the user securely. It will not be shown again.
                </p>
                <code className="text-sm font-mono font-medium text-slate-800 break-all">
                  {state.success.tempPassword}
                </code>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="self-start text-xs font-medium text-brand-700 hover:text-brand-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form action={formAction} className="space-y-3">
              {state.error && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  <WarningIcon className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[10rem]">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full name</label>
                  <input
                    name="fullName"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                <div className="flex-1 min-w-[12rem]">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                  <select
                    name="role"
                    defaultValue="student"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="student">Student</option>
                    <option value="staff">IT Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                A random temporary password is generated and shown once after creation &mdash;
                the account is confirmed and ready to sign in immediately.
              </p>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-1.5 bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {pending ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
