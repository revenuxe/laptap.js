-- Durable per-account upload quotas; no service-role credential is exposed or required.
create table public.marketplace_image_uploads (
 id uuid primary key default gen_random_uuid(), seller_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create index marketplace_image_uploads_rate on public.marketplace_image_uploads(seller_id,created_at desc);
alter table public.marketplace_image_uploads enable row level security;
revoke all on public.marketplace_image_uploads from anon,authenticated;
create function public.marketplace_claim_image_upload() returns uuid language plpgsql security definer set search_path=public as $$
declare actor uuid:=auth.uid(); reservation uuid;
begin
 if actor is null or not public.marketplace_can_upload() then raise exception 'Seller upload access required';end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text,91512));
 if (select count(*) from public.marketplace_image_uploads where seller_id=actor and created_at>now()-interval '1 hour')>=60 or (select count(*) from public.marketplace_image_uploads where seller_id=actor and created_at>now()-interval '1 day')>=300 then return null;end if;
 delete from public.marketplace_image_uploads where seller_id=actor and created_at<now()-interval '1 day';
 insert into public.marketplace_image_uploads(seller_id) values(actor) returning id into reservation;return reservation;
end $$;
revoke execute on function public.marketplace_claim_image_upload() from public,anon;
grant execute on function public.marketplace_claim_image_upload() to authenticated;
update storage.buckets set file_size_limit=307200,allowed_mime_types=array['image/webp'] where id='marketplace-images';
-- Indexed prefix search and bounded catalog ordering as inventory grows.
alter table public.marketplace_listings add column catalog_search tsvector generated always as (to_tsvector('simple',coalesce(title,'')||' '||coalesce(brand,'')||' '||coalesce(processor,'')||' '||coalesce(location,''))) stored;
create index marketplace_catalog_search_idx on public.marketplace_listings using gin(catalog_search) where status='published';
create index marketplace_catalog_newest_idx on public.marketplace_listings(created_at desc,id) where status='published';
create index marketplace_catalog_price_idx on public.marketplace_listings(price,id) where status='published';

-- Tie storage writes to a quota reservation, including direct Storage API requests.
create function public.marketplace_upload_reserved(_name text) returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.marketplace_image_uploads where seller_id=auth.uid() and _name=seller_id::text||'/'||id::text||'.webp' and created_at>now()-interval '15 minutes')
$$;
revoke execute on function public.marketplace_upload_reserved(text) from public,anon;
grant execute on function public.marketplace_upload_reserved(text) to authenticated;
drop policy "Seller uploads own photos" on storage.objects;
create policy "Seller uploads own photos" on storage.objects for insert to authenticated with check(bucket_id='marketplace-images' and (storage.foldername(name))[1]=auth.uid()::text and public.marketplace_can_upload() and public.marketplace_upload_reserved(name));
