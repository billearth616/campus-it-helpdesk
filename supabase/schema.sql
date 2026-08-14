-- Campus IT Helpdesk & Ticketing System
-- Database schema + Row Level Security policies (Supabase / Postgres)

-- =========================
-- 1. ENUM TYPES
-- =========================
create type user_role as enum ('student', 'staff', 'admin');
create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
create type ticket_priority as enum ('low', 'medium', 'high', 'urgent');

-- =========================
-- 2. PROFILES
-- (extends Supabase auth.users with app-level role info)
-- =========================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role user_role not null default 'student',
  created_at timestamptz not null default now()
);

-- =========================
-- 3. CATEGORIES
-- =========================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- =========================
-- 4. TICKETS
-- =========================
create table tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status ticket_status not null default 'open',
  priority ticket_priority not null default 'medium',
  category_id uuid references categories(id) on delete set null,
  created_by uuid not null references profiles(id) on delete cascade,
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- 5. COMMENTS (ticket activity/notes)
-- =========================
create table comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- =========================
-- 6. updated_at trigger for tickets
-- =========================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tickets_set_updated_at
before update on tickets
for each row execute function set_updated_at();

-- =========================
-- 7. Auto-create profile on signup
-- =========================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- =========================
-- 8. ROW LEVEL SECURITY
-- =========================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table tickets enable row level security;
alter table comments enable row level security;

-- Helper: is the current user staff or admin?
create or replace function is_staff_or_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$ language sql security definer stable set search_path = public;

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- PROFILES policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Staff/admin can view all profiles" on profiles
  for select using (is_staff_or_admin());
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Admin can update any profile" on profiles
  for update using (is_admin());

-- CATEGORIES policies
create policy "Anyone authenticated can view categories" on categories
  for select using (auth.role() = 'authenticated');
create policy "Admin manages categories" on categories
  for all using (is_admin()) with check (is_admin());

-- TICKETS policies
create policy "Users view own tickets" on tickets
  for select using (auth.uid() = created_by);
create policy "Staff/admin view all tickets" on tickets
  for select using (is_staff_or_admin());
create policy "Users create own tickets" on tickets
  for insert with check (auth.uid() = created_by);
create policy "Users update own open tickets" on tickets
  for update using (auth.uid() = created_by and status = 'open');
create policy "Staff/admin update any ticket" on tickets
  for update using (is_staff_or_admin());
create policy "Admin delete tickets" on tickets
  for delete using (is_admin());

-- COMMENTS policies
create policy "Ticket participants view comments" on comments
  for select using (
    exists (
      select 1 from tickets t
      where t.id = comments.ticket_id
      and (t.created_by = auth.uid() or is_staff_or_admin())
    )
  );
create policy "Ticket participants add comments" on comments
  for insert with check (
    auth.uid() = author_id
    and exists (
      select 1 from tickets t
      where t.id = comments.ticket_id
      and (t.created_by = auth.uid() or is_staff_or_admin())
    )
  );

-- =========================
-- 9. Seed categories
-- =========================
insert into categories (name, description) values
  ('Hardware', 'Laptops, desktops, peripherals, lab equipment'),
  ('Software', 'Application errors, installs, licensing'),
  ('Network', 'Wi-Fi, VPN, connectivity issues'),
  ('Account Access', 'Password resets, login/permission issues'),
  ('Other', 'Anything not covered above');
