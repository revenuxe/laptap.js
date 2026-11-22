alter table public.marketplace_listings add column seo_path text unique;
create function public.assign_marketplace_seo_path() returns trigger language plpgsql security definer set search_path=public as $$
declare brand_slug text; name_slug text; parts text[]; base text; candidate text; suffix integer:=1;
begin
 if TG_OP='UPDATE' and old.seo_path is not null then new.seo_path:=old.seo_path;return new;end if;
 perform pg_advisory_xact_lock(728194521);
 brand_slug:=trim(both '-' from regexp_replace(lower(new.brand),'[^a-z0-9]+','-','g'));
 name_slug:=trim(both '-' from regexp_replace(lower(regexp_replace(new.title,'^Demo\s*-\s*','','i')),'[^a-z0-9]+','-','g'));
 if name_slug like brand_slug||'-%' then name_slug:=substr(name_slug,length(brand_slug)+2);end if;
 parts:=string_to_array(name_slug,'-');
 base:=coalesce(nullif(brand_slug,''),'device')||'/'||coalesce(nullif(parts[1],''),'model');
 if array_length(parts,1)>1 then base:=base||'/'||array_to_string(parts[2:array_length(parts,1)],'-');end if;
 candidate:=base;
 if exists(select 1 from public.marketplace_listings where seo_path=candidate and id<>new.id) then
 base:=base||'-'||trim(both '-' from regexp_replace(lower(new.ram||'-'||new.storage||'-'||new.year),'[^a-z0-9]+','-','g'));candidate:=base;
 while exists(select 1 from public.marketplace_listings where seo_path=candidate and id<>new.id) loop suffix:=suffix+1;candidate:=base||'-listing-'||suffix;end loop;
 end if;
 new.seo_path:=candidate;return new;
end $$;
create trigger assign_marketplace_seo_path before insert or update on public.marketplace_listings for each row execute function public.assign_marketplace_seo_path();
update public.marketplace_listings set seo_path=seo_path where seo_path is null;
alter table public.marketplace_listings alter column seo_path set not null;
revoke execute on function public.assign_marketplace_seo_path() from public,anon,authenticated;
