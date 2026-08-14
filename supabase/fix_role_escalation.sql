-- Security fix: prevent a user from granting themselves admin/staff via
-- the "Users can update own profile" RLS policy (that policy allows
-- updating the row but doesn't restrict which columns change).

create or replace function prevent_role_self_escalation()
returns trigger as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not is_admin() then
    raise exception 'Only admins can change user roles';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists profiles_prevent_role_escalation on profiles;
create trigger profiles_prevent_role_escalation
before update on profiles
for each row execute function prevent_role_self_escalation();

-- Bootstrap: promote the seeded admin test account to admin now
-- (runs as postgres via the SQL editor, so auth.uid() is null and the
-- guard above does not block it).
update profiles set role = 'admin' where email = 'admin.test@campushelpdesk.dev';
