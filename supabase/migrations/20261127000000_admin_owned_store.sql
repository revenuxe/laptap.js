-- Keep historical commerce records; all new inventory is managed by administrators.
create table public.store_settings (
 id boolean primary key default true check(id), owner_id uuid references auth.users(id),
 name text not null default 'Laptap Store' check(length(trim(name)) between 1 and 100),
 tagline text not null default '' check(length(tagline)<=300),
 email text not null default '' check(length(email)<=200), phone text not null default '' check(length(phone)<=25),
 city text not null default '' check(length(city)<=100), address text not null default '' check(length(address)<=2000),
 pickup_instructions text not null default '' check(length(pickup_instructions)<=2000),
 delivery_available boolean not null default false, pickup_available boolean not null default true,
 delivery_fee numeric not null default 0 check(delivery_fee between 0 and 10000), delivery_pincodes text[] not null default '{}'
);
insert into public.store_settings(id) values(true);
alter table public.store_settings enable row level security;
create policy "Public store identity" on public.store_settings for select using(true);
grant select on public.store_settings to anon,authenticated;
revoke insert,update,delete on public.store_settings from anon,authenticated;
alter table public.marketplace_listings add column store_owned boolean not null default false;

create function public.admin_save_store_settings(_settings jsonb) returns void language plpgsql security definer set search_path=public as $$
declare s public.store_settings; owner uuid;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Administrator access required';end if;
 select owner_id into owner from public.store_settings where id for update;
 s:=jsonb_populate_record(null::public.store_settings,_settings);
 if length(trim(coalesce(s.name,'')))<1 or length(trim(coalesce(s.city,'')))<2 or length(trim(coalesce(s.address,'')))<10 or length(trim(coalesce(s.phone,'')))<7 or coalesce(s.email,'') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter the store name, email, phone, city and full address';end if;
 if not coalesce(s.delivery_available,false) and not coalesce(s.pickup_available,false) then raise exception 'Enable delivery or pickup';end if;
 s.delivery_pincodes:=array(select distinct trim(v) from unnest(coalesce(s.delivery_pincodes,'{}')) v where trim(v)<>'');
 if s.delivery_available and (cardinality(s.delivery_pincodes)=0 or exists(select 1 from unnest(s.delivery_pincodes) v where v !~ '^[1-9][0-9]{5}$')) then raise exception 'Enter valid six-digit delivery pincodes';end if;
 owner:=coalesce(owner,auth.uid());
 insert into public.marketplace_sellers(id,shop_name,email,phone,city,full_name,business_address,status)
 values(owner,trim(s.name),s.email,s.phone,trim(s.city),'Store administrator',trim(s.address),'active')
 on conflict(id) do update set shop_name=excluded.shop_name,email=excluded.email,phone=excluded.phone,city=excluded.city,business_address=excluded.business_address;
 update public.store_settings set owner_id=owner,name=trim(s.name),tagline=coalesce(s.tagline,''),email=s.email,phone=s.phone,city=trim(s.city),address=trim(s.address),pickup_instructions=coalesce(s.pickup_instructions,''),delivery_available=s.delivery_available,pickup_available=s.pickup_available,delivery_fee=s.delivery_fee,delivery_pincodes=s.delivery_pincodes where id;
 update public.marketplace_listings set seller_name=trim(s.name),location=trim(s.city) where store_owned and (seller_name is distinct from trim(s.name) or location is distinct from trim(s.city));
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action) values(auth.uid(),'store',owner,'Store settings updated');
end $$;

create function public.admin_save_store_product(_id uuid,_product jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare s public.store_settings;p public.marketplace_listings;existing public.marketplace_listings;new_id uuid:=coalesce(_id,gen_random_uuid());
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Administrator access required';end if;
 select * into s from public.store_settings where id for share;
 if s.owner_id is null then raise exception 'Save your store name and contact details in Store setup first';end if;
 select * into existing from public.marketplace_listings where id=new_id for update;
 if _id is not null and (existing.id is null or existing.deleted_at is not null) then raise exception 'Product is unavailable';end if;
 p:=jsonb_populate_record(null::public.marketplace_listings,_product);
 if p.status not in('draft','published','sold') or p.status is null then raise exception 'Choose a valid visibility';end if;
 if cardinality(p.images) not between 1 and 8 or p.images is null then raise exception 'Add between one and eight photos';end if;
 if exists(select 1 from unnest(p.images) url where not exists(select 1 from storage.objects o where o.bucket_id='marketplace-images' and split_part(url,'/storage/v1/object/public/marketplace-images/',2)=o.name)) then raise exception 'Use photos uploaded to this store';end if;
 if existing.id is null then
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status,stock_quantity,store_owned,delivery_available,pickup_available,delivery_fee,delivery_pincodes,pickup_address,pickup_instructions)
 values(new_id,s.owner_id,s.name,p.title,p.brand,'laptop',p.price,p.year,p.condition,p.description,p.processor,p.ram,p.storage,p.graphics,coalesce(p.display,''),coalesce(p.battery,''),p.defects,coalesce(p.accessories,''),s.city,p.official_warranty_until,p.seller_warranty_months,coalesce(p.warranty_terms,''),p.images,p.status,p.stock_quantity,true,s.delivery_available,s.pickup_available,s.delivery_fee,s.delivery_pincodes,s.address,s.pickup_instructions);
 else
 update public.marketplace_listings set title=p.title,brand=p.brand,price=p.price,year=p.year,condition=p.condition,description=p.description,processor=p.processor,ram=p.ram,storage=p.storage,graphics=p.graphics,display=coalesce(p.display,''),battery=coalesce(p.battery,''),defects=p.defects,accessories=coalesce(p.accessories,''),official_warranty_until=p.official_warranty_until,seller_warranty_months=p.seller_warranty_months,warranty_terms=coalesce(p.warranty_terms,''),images=p.images,status=p.status,stock_quantity=p.stock_quantity where id=new_id;
 end if;
 return new_id;
end $$;
revoke execute on function public.admin_save_store_settings(jsonb),public.admin_save_store_product(uuid,jsonb) from public,anon;
grant execute on function public.admin_save_store_settings(jsonb),public.admin_save_store_product(uuid,jsonb) to authenticated;

-- Old seller entry points cannot continue creating inventory outside the admin workspace.
drop trigger if exists capture_marketplace_seller_application on auth.users;
create or replace function public.marketplace_can_upload() returns boolean language sql stable set search_path=public as $$ select public.has_role(auth.uid(),'admin') $$;
create policy "Admins create store inventory" on public.marketplace_listings for insert to authenticated with check(public.has_role(auth.uid(),'admin'));
do $$ declare item record;begin
 for item in select policyname from pg_policies where schemaname='public' and tablename in('marketplace_listings','marketplace_sellers') and cmd in('INSERT','UPDATE','ALL') and policyname not in('Admins create store inventory','Admins manage marketplace sellers') loop
 execute format('drop policy %I on public.%I',item.policyname,(select tablename from pg_policies where schemaname='public' and policyname=item.policyname and tablename in('marketplace_listings','marketplace_sellers') limit 1));
 end loop;
end $$;
create policy "Admins update store inventory" on public.marketplace_listings for update to authenticated using(public.has_role(auth.uid(),'admin')) with check(public.has_role(auth.uid(),'admin'));
do $$ declare f record;begin
 for f in select p.oid::regprocedure signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in('marketplace_seller_orders','marketplace_seller_inquiries','marketplace_seller_fulfil','marketplace_seller_order_action','marketplace_seller_finance','marketplace_seller_payout_profile','marketplace_save_device','marketplace_listing_defaults','marketplace_delete_product') loop
 execute format('revoke execute on function %s from public,anon,authenticated',f.signature);
 end loop;
end $$;
-- Admin deletion remains available, with an explicit role check in the wrapper.
create function public.admin_delete_store_product(_id uuid) returns void language plpgsql security definer set search_path=public as $$ begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Administrator access required';end if;
 perform public.marketplace_delete_product(_id);
end $$;
revoke execute on function public.admin_delete_store_product(uuid) from public,anon;
grant execute on function public.admin_delete_store_product(uuid) to authenticated;

create or replace function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
declare intake public.marketplace_listing_intake;quote jsonb;admin boolean:=public.has_role(auth.uid(),'admin');changed boolean:=false;
begin

 if TG_OP='UPDATE' and new.store_owned is distinct from old.store_owned then raise exception 'Store ownership cannot change';end if;
 if new.store_owned then
  if TG_OP='INSERT' and not admin then raise exception 'Administrator access required';end if;
  if TG_OP='UPDATE' then
   changed:=(to_jsonb(new)-array['seller_name','location','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path']) is distinct from (to_jsonb(old)-array['seller_name','location','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path']);
   if changed and not admin then raise exception 'Administrator access required';end if;
   if changed and exists(select 1 from public.marketplace_orders where listing_id=old.id and status not in('cancelled','refunded')) then raise exception 'This laptop has active orders. Complete them before changing product details';end if;
  end if;
  if new.status='published' and not new.delivery_available and not new.pickup_available then raise exception 'Enable delivery or pickup before publishing';end if;
  new.review_status:='approved';new.verification_fee_eligible:=false;
  new.commission_terms:=jsonb_build_object('version',0,'price',new.price,'rate_bps',10000,'commission',new.price,'seller_net',0,'acceptance_hours',0);
  return new;
 end if;
 if new.is_demo then return new;end if;
 if TG_OP='UPDATE' then
  changed:=(to_jsonb(new)-array['deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']) is distinct from(to_jsonb(old)-array['deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']);
  if changed and exists(select 1 from public.marketplace_orders where listing_id=old.id and status not in('cancelled','refunded')) then raise exception 'This device is in a Laptap-managed order. Contact the team before changing its details';end if;
  if changed and old.review_status='approved' then new.review_status:='pending';new.status:='draft';new.commission_terms:='{}';new.verified_at:=null;new.verification_notes:='';end if;
 end if;
 if not admin then
  if new.review_status in('approved','rejected') and(TG_OP='INSERT' or new.review_status is distinct from old.review_status) then raise exception 'Only Laptap can approve or reject a listing';end if;
  if (TG_OP='INSERT' and new.commission_terms<>'{}') or(TG_OP='UPDATE' and new.commission_terms is distinct from old.commission_terms and new.commission_terms<>'{}') then raise exception 'Commission terms are assigned during admin review';end if;
  if new.status='published' and(TG_OP='INSERT' or old.status<>'published') then raise exception 'Submit this device for Laptap review before it goes live';end if;
  if TG_OP='UPDATE' then new.delivery_available:=old.delivery_available;new.pickup_available:=old.pickup_available;new.delivery_fee:=old.delivery_fee;new.delivery_pincodes:=old.delivery_pincodes;new.pickup_address:=old.pickup_address;new.pickup_instructions:=old.pickup_instructions;new.verification_fee_eligible:=old.verification_fee_eligible;else new.delivery_available:=false;new.pickup_available:=false;new.delivery_fee:=0;new.delivery_pincodes:='{}';new.pickup_address:='';new.pickup_instructions:='';end if;
 end if;
 if new.review_status='approved' and(TG_OP='INSERT' or old.review_status<>'approved') then
  if not admin then raise exception 'Admin review is required';end if;
  select * into intake from public.marketplace_listing_intake where listing_id=new.id;
  if intake.listing_id is null or not intake.ownership_confirmed or intake.terms_accepted_at is null or intake.accepted_price<>new.price or length(trim(intake.collection_address))<10 then raise exception 'Seller must confirm ownership, collection address and commission terms before approval';end if;
  if not public.marketplace_seller_active(new.seller_id) then raise exception 'Approve the seller account before approving this listing';end if;
  if new.price<(intake.policy_snapshot->>'minimum_price')::numeric then raise exception 'Device price is below the accepted marketplace minimum';end if;
  if not new.delivery_available and not new.pickup_available then raise exception 'Configure Laptap delivery areas or a collection hub before publishing';end if;
  quote:=public.marketplace_commission_quote(new.price,intake.policy_snapshot);
  new.commission_terms:=jsonb_build_object('version',intake.policy_snapshot->'version','price',new.price,'rate_bps',quote->'rate','commission',quote->'commission','seller_net',quote->'net','acceptance_hours',intake.policy_snapshot->'acceptance_hours');
 end if;
 if new.status='published' and new.review_status<>'approved' then raise exception 'Only approved listings can be public';end if;
 return new;
end $$;
