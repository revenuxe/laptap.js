-- Store fulfilment is configured once and inherited by every admin-owned listing.
alter table public.store_settings add column pickup_hours text not null default '' check(length(pickup_hours)<=200), add column delivery_estimate text not null default '' check(length(delivery_estimate)<=200), add column delivery_terms text not null default '' check(length(delivery_terms)<=2000);
create or replace function public.admin_save_store_settings(_settings jsonb) returns void language plpgsql security definer set search_path=public as $$
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
 update public.store_settings set owner_id=owner,name=trim(s.name),tagline=coalesce(s.tagline,''),email=s.email,phone=s.phone,city=trim(s.city),address=trim(s.address),pickup_hours=coalesce(s.pickup_hours,''),delivery_estimate=coalesce(s.delivery_estimate,''),delivery_terms=coalesce(s.delivery_terms,''),pickup_instructions=coalesce(s.pickup_instructions,''),delivery_available=s.delivery_available,pickup_available=s.pickup_available,delivery_fee=s.delivery_fee,delivery_pincodes=s.delivery_pincodes where id;
 update public.marketplace_listings set seller_name=trim(s.name),location=trim(s.city) where store_owned and (seller_name is distinct from trim(s.name) or location is distinct from trim(s.city));
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action) values(auth.uid(),'store',owner,'Store settings updated');
end $$;
create or replace function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
declare intake public.marketplace_listing_intake;quote jsonb;admin boolean:=public.has_role(auth.uid(),'admin');changed boolean:=false;
begin

 if TG_OP='UPDATE' and new.store_owned is distinct from old.store_owned then raise exception 'Store ownership cannot change';end if;
 if new.store_owned then
  if TG_OP='INSERT' and not admin then raise exception 'Administrator access required';end if;
  if TG_OP='UPDATE' then
   changed:=(to_jsonb(new)-array['delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions','seller_name','location','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path']) is distinct from (to_jsonb(old)-array['delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions','seller_name','location','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path']);
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

-- Generated search values are not populated yet in BEFORE triggers and are not device changes.
create or replace function public.guard_marketplace_verification() returns trigger language plpgsql set search_path=public as $$
begin
 if TG_OP='UPDATE' then
  if new.seller_id is distinct from old.seller_id or new.id is distinct from old.id or new.created_at is distinct from old.created_at then raise exception 'Listing ownership and identity cannot change'; end if;
  if (new.verified_at is distinct from old.verified_at or new.verification_notes is distinct from old.verification_notes) and not public.has_role(auth.uid(),'admin') then raise exception 'Only admins can change verification'; end if;
  if (to_jsonb(new) - 'verified_at' - 'verification_notes' - 'status' - 'catalog_search' - 'seo_path' - 'delivery_available' - 'pickup_available' - 'delivery_fee' - 'delivery_pincodes' - 'pickup_address' - 'pickup_instructions') is distinct from (to_jsonb(old) - 'verified_at' - 'verification_notes' - 'status' - 'catalog_search' - 'seo_path' - 'delivery_available' - 'pickup_available' - 'delivery_fee' - 'delivery_pincodes' - 'pickup_address' - 'pickup_instructions') then
   new.verified_at := null; new.verification_notes := '';
  end if;
 end if;
 if new.verified_at is not null and length(trim(new.verification_notes)) < 20 then raise exception 'An inspection record is required'; end if;
 return new;
end $$;


create function public.apply_store_fulfilment() returns trigger language plpgsql security definer set search_path=public as $$
declare s public.store_settings;
begin
 if not new.store_owned then return new;end if;
 select * into s from public.store_settings where id;
 if s.owner_id is null then raise exception 'Configure your store before listing laptops';end if;
 new.delivery_available:=s.delivery_available;new.pickup_available:=s.pickup_available;
 new.delivery_fee:=case when s.delivery_available then s.delivery_fee else 0 end;
 new.delivery_pincodes:=s.delivery_pincodes;new.pickup_address:=s.address;new.pickup_instructions:=s.pickup_instructions;
 return new;
end $$;
create trigger a_apply_store_fulfilment before insert or update on public.marketplace_listings for each row execute function public.apply_store_fulfilment();
create function public.sync_store_fulfilment() returns trigger language plpgsql security definer set search_path=public as $$
begin
 update public.marketplace_listings set delivery_available=new.delivery_available,pickup_available=new.pickup_available,delivery_fee=case when new.delivery_available then new.delivery_fee else 0 end,delivery_pincodes=new.delivery_pincodes,pickup_address=new.address,pickup_instructions=new.pickup_instructions
 where store_owned and deleted_at is null and (delivery_available,pickup_available,delivery_fee,delivery_pincodes,pickup_address,pickup_instructions) is distinct from (new.delivery_available,new.pickup_available,case when new.delivery_available then new.delivery_fee else 0 end,new.delivery_pincodes,new.address,new.pickup_instructions);
 return new;
end $$;
create trigger sync_store_fulfilment after update on public.store_settings for each row execute function public.sync_store_fulfilment();
revoke execute on function public.apply_store_fulfilment(),public.sync_store_fulfilment() from public,anon,authenticated;
-- Align existing admin inventory when a configured store is already present.
update public.store_settings set id=id where owner_id is not null;
