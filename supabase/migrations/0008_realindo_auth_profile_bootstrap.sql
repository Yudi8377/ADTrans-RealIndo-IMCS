-- ADTRANS REALINDO IMCS
-- Bootstrap a RealIndo profile for newly provisioned Supabase Auth users.
-- The default role is STAFF; elevated roles must be assigned explicitly by an administrator.

create or replace function imcs_private.handle_new_realindo_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare realindo_org uuid;
begin
  select id into realindo_org from public.organizations where code='REALINDO' and active=true limit 1;
  if realindo_org is null then raise exception 'REALINDO organization is not configured'; end if;
  insert into public.profiles(id,organization_id,full_name,role,active)
  values(new.id,realindo_org,coalesce(new.raw_user_meta_data->>'full_name',split_part(coalesce(new.email,''),'@',1)),'STAFF',true)
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function imcs_private.handle_new_realindo_user() from public;
grant execute on function imcs_private.handle_new_realindo_user() to postgres;

drop trigger if exists on_auth_user_created_realindo on auth.users;
create trigger on_auth_user_created_realindo
after insert on auth.users
for each row execute function imcs_private.handle_new_realindo_user();
