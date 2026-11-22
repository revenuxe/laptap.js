-- Generated search values are not populated yet in BEFORE triggers and are not device changes.
create or replace function public.guard_marketplace_verification() returns trigger language plpgsql set search_path=public as $$
begin
 if TG_OP='UPDATE' then
  if new.seller_id is distinct from old.seller_id or new.id is distinct from old.id or new.created_at is distinct from old.created_at then raise exception 'Listing ownership and identity cannot change'; end if;
  if (new.verified_at is distinct from old.verified_at or new.verification_notes is distinct from old.verification_notes) and not public.has_role(auth.uid(),'admin') then raise exception 'Only admins can change verification'; end if;
  if (to_jsonb(new) - 'verified_at' - 'verification_notes' - 'status' - 'catalog_search' - 'seo_path') is distinct from (to_jsonb(old) - 'verified_at' - 'verification_notes' - 'status' - 'catalog_search' - 'seo_path') then
   new.verified_at := null; new.verification_notes := '';
  end if;
 end if;
 if new.verified_at is not null and length(trim(new.verification_notes)) < 20 then raise exception 'An inspection record is required'; end if;
 return new;
end $$;
