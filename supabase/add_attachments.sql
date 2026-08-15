-- Campus IT Helpdesk & Ticketing System
-- Incremental migration: file attachments on tickets.
-- Run this once against your Supabase project (SQL editor), after schema.sql.

-- =========================
-- 1. ATTACHMENTS TABLE
-- =========================
create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  uploaded_by uuid not null references profiles(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  file_size bigint not null,
  content_type text,
  created_at timestamptz not null default now()
);

alter table attachments enable row level security;

-- Same participant rule as comments: the ticket's creator, or any staff/admin.
create policy "Ticket participants view attachments" on attachments
  for select using (
    exists (
      select 1 from tickets t
      where t.id = attachments.ticket_id
      and (t.created_by = auth.uid() or is_staff_or_admin())
    )
  );

create policy "Ticket participants upload attachments" on attachments
  for insert with check (
    auth.uid() = uploaded_by
    and exists (
      select 1 from tickets t
      where t.id = attachments.ticket_id
      and (t.created_by = auth.uid() or is_staff_or_admin())
    )
  );

create policy "Uploader or staff/admin can delete attachments" on attachments
  for delete using (auth.uid() = uploaded_by or is_staff_or_admin());

-- =========================
-- 2. STORAGE BUCKET
-- Private bucket; objects are stored under "{ticket_id}/{uuid}-{filename}"
-- so folder-scoped policies below can check ticket participation.
-- =========================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ticket-attachments',
  'ticket-attachments',
  false,
  10485760, -- 10 MB
  array[
    'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip'
  ]
)
on conflict (id) do nothing;

create policy "Ticket participants read attachment files"
on storage.objects for select
using (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1 from tickets t
    where t.id::text = (storage.foldername(name))[1]
    and (t.created_by = auth.uid() or is_staff_or_admin())
  )
);

create policy "Ticket participants upload attachment files"
on storage.objects for insert
with check (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1 from tickets t
    where t.id::text = (storage.foldername(name))[1]
    and (t.created_by = auth.uid() or is_staff_or_admin())
  )
);

create policy "Uploader or staff/admin can delete attachment files"
on storage.objects for delete
using (
  bucket_id = 'ticket-attachments'
  and (
    owner = auth.uid()
    or exists (
      select 1 from tickets t
      where t.id::text = (storage.foldername(name))[1]
      and is_staff_or_admin()
    )
  )
);
