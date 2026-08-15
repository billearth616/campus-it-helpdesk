# Campus IT Helpdesk & Ticketing System

CSCD602 Advanced Software Engineering — Capstone Project

## Project Overview
A web application for reporting, triaging, and resolving campus IT support
tickets. Students/staff submit issues; IT staff triage, assign, and resolve
them; admins manage categories and user roles.

## Main Features
- Email/password authentication with role-based accounts (student, staff, admin)
- Ticket submission with category and priority
- Role-scoped ticket visibility (own tickets vs. all tickets) enforced by database Row Level Security
- Status workflow (open → in progress → resolved → closed) and staff assignment
- Per-ticket comment thread
- Admin category management
- Admin user-role management
- Admin can create new user accounts directly (any role), with an immediately-usable one-time temporary password

## Technology Stack
- **Frontend/App layer:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js Server Actions
- **Database & Auth:** Supabase (Postgres + Auth + Row Level Security)
- **Hosting:** Vercel

## How to Access the Application
See `Links.txt` (or the project's top-level documentation) for:
- Live application URL
- Test user credentials (student and staff)
- Admin credentials
- Source-code repository link

## Local Development Setup
```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase URL, anon key, and service-role key
# Run app/supabase/schema.sql once against your Supabase project (SQL editor)
npm run dev
```

## Known Limitations
- No email notifications on ticket updates (planned — see Maintenance & Future Evolution doc).
- No file attachments on tickets yet.
- No automated end-to-end test suite; testing was manual and scenario-based given the project timeline (see Testing Report).
- No SLA timers/escalation automation yet.

## Special Instructions for Testing
- Sign up creates a `student` or `staff` account directly; `admin` accounts must be promoted from an existing account, or created directly, via **Admin → Users** (see Links.txt for a pre-seeded admin login).
- Admin → Users → **Add User** creates an account of any role immediately (no email confirmation needed) and shows a one-time temporary password to hand to the new user.
- Categories are pre-seeded (Hardware, Software, Network, Account Access, Other) via `app/supabase/schema.sql`.

## Acknowledgements
Built with Next.js, React, Tailwind CSS, and Supabase — all used under their respective open-source/free-tier licenses.
