-- Fix: functions must pin search_path so they can resolve `public.profiles`
-- and `public.user_role` when invoked from the auth schema's trigger context.

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
