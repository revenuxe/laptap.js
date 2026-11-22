-- Multi-seller marketplace. Uses the existing auth and admin role system.
create table public.marketplace_listings (
 id uuid primary key default gen_random_uuid(), seller_id uuid not null references auth.users(id),
 seller_name text not null check (length(trim(seller_name)) between 1 and 100),
 title text not null check (length(trim(title)) between 1 and 200), brand text not null check(length(trim(brand)) between 1 and 100),
 category text not null check(category in ('laptop','desktop')), price numeric not null check(price > 0 and price <= 3000000),
 year integer not null check(year between 2000 and extract(year from now())::integer + 1),
 condition text not null check(condition in ('Like new','Excellent','Good','Fair')),
 description text not null check(length(description) between 30 and 5000),
 processor text not null, ram text not null, storage text not null, graphics text not null, display text not null,
 battery text not null, defects text not null check(length(defects) between 5 and 3000), accessories text not null, location text not null,
 official_warranty_until date, seller_warranty_months integer not null default 0 check(seller_warranty_months between 0 and 60),
 warranty_terms text not null default '' check(length(warranty_terms)<=3000),
 images text[] not null check(cardinality(images) between 1 and 8),
 status text not null default 'published' check(status in ('draft','published','sold')),
 verified_at timestamptz, verification_notes text not null default '' check(length(verification_notes)<=2000), created_at timestamptz not null default now(),
 constraint warranty_requires_terms check(seller_warranty_months = 0 or length(trim(warranty_terms)) >= 10)
);
create index marketplace_catalog on public.marketplace_listings(status,created_at desc);
create index marketplace_sellers on public.marketplace_listings(seller_id);
alter table public.marketplace_listings enable row level security;
create policy "Public sees available devices; sellers and admins see own inventory" on public.marketplace_listings for select using(status='published' or seller_id=auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Sellers create own listings" on public.marketplace_listings for insert to authenticated with check(seller_id=auth.uid() and verified_at is null and verification_notes='');
create policy "Sellers and admins update inventory" on public.marketplace_listings for update to authenticated using(seller_id=auth.uid() or public.has_role(auth.uid(),'admin')) with check(seller_id=auth.uid() or public.has_role(auth.uid(),'admin'));
create function public.guard_marketplace_verification() returns trigger language plpgsql set search_path=public as $$
begin
 if TG_OP='UPDATE' then
  if new.seller_id is distinct from old.seller_id or new.id is distinct from old.id or new.created_at is distinct from old.created_at then raise exception 'Listing ownership and identity cannot change'; end if;
  if (new.verified_at is distinct from old.verified_at or new.verification_notes is distinct from old.verification_notes) and not public.has_role(auth.uid(),'admin') then raise exception 'Only admins can change verification'; end if;
  if (to_jsonb(new) - 'verified_at' - 'verification_notes') is distinct from (to_jsonb(old) - 'verified_at' - 'verification_notes') then
   new.verified_at := null; new.verification_notes := '';
  end if;
 end if;
 if new.verified_at is not null and length(trim(new.verification_notes)) < 20 then raise exception 'An inspection record is required'; end if;
 return new;
end $$;
create trigger marketplace_verification_guard before insert or update on public.marketplace_listings for each row execute function public.guard_marketplace_verification();
create table public.marketplace_inquiries (
 id uuid primary key default gen_random_uuid(), listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
 buyer_name text not null check(length(trim(buyer_name)) between 1 and 100),
 email text not null check(length(email)<=200 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text not null check(length(phone) between 7 and 25), message text not null check(length(trim(message)) between 10 and 2000),
 created_at timestamptz not null default now()
);
create index marketplace_inquiries_listing on public.marketplace_inquiries(listing_id,created_at desc);
alter table public.marketplace_inquiries enable row level security;
create policy "Buyers enquire about available devices" on public.marketplace_inquiries for insert to anon,authenticated with check(exists(select 1 from public.marketplace_listings p where p.id=listing_id and p.status='published'));
create policy "Only listing seller and admins read enquiries" on public.marketplace_inquiries for select to authenticated using(public.has_role(auth.uid(),'admin') or exists(select 1 from public.marketplace_listings p where p.id=listing_id and p.seller_id=auth.uid()));
grant select on public.marketplace_listings to anon, authenticated;
grant insert, update on public.marketplace_listings to authenticated;
grant insert on public.marketplace_inquiries to anon, authenticated;
grant select on public.marketplace_inquiries to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('marketplace-images','marketplace-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "Public marketplace photos" on storage.objects for select using(bucket_id='marketplace-images');
create policy "Seller uploads own photos" on storage.objects for insert to authenticated with check(bucket_id='marketplace-images' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Seller removes own photos" on storage.objects for delete to authenticated using(bucket_id='marketplace-images' and (storage.foldername(name))[1]=auth.uid()::text);
