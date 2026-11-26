-- Optional regular price for genuine sale comparisons. Checkout still uses price.
alter table public.marketplace_listings add column regular_price numeric check(regular_price is null or (regular_price>=price and regular_price<=3000000));
create or replace function public.admin_save_store_product(_id uuid,_product jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare s public.store_settings;p public.marketplace_listings;existing public.marketplace_listings;new_id uuid:=coalesce(_id,gen_random_uuid());
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Administrator access required';end if;
 select * into s from public.store_settings where id for share;
 if s.owner_id is null then raise exception 'Save your store name and contact details in Store setup first';end if;
 select * into existing from public.marketplace_listings where id=new_id for update;
 if _id is not null and (existing.id is null or existing.deleted_at is not null) then raise exception 'Product is unavailable';end if;
 p:=jsonb_populate_record(null::public.marketplace_listings,_product);
 if p.status not in('draft','published','sold') or p.status is null then raise exception 'Choose a valid visibility';end if;
 if p.delivery_available and (cardinality(p.delivery_pincodes)>500 or exists(select 1 from unnest(p.delivery_pincodes) v where v !~ '^[1-9][0-9]{5}$')) then raise exception 'Enter valid six-digit delivery pincodes';end if;
 if cardinality(p.images) not between 1 and 8 or p.images is null then raise exception 'Add between one and eight photos';end if;
 if exists(select 1 from unnest(p.images) url where not exists(select 1 from storage.objects o where o.bucket_id='marketplace-images' and split_part(url,'/storage/v1/object/public/marketplace-images/',2)=o.name)) then raise exception 'Use photos uploaded to this store';end if;
 if existing.id is null then
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,regular_price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status,stock_quantity,store_owned,delivery_available,pickup_available,delivery_fee,delivery_pincodes,pickup_address,pickup_instructions)
 values(new_id,s.owner_id,s.name,p.title,p.brand,'laptop',p.price,p.regular_price,p.year,p.condition,p.description,p.processor,p.ram,p.storage,p.graphics,coalesce(p.display,''),coalesce(p.battery,''),p.defects,coalesce(p.accessories,''),s.city,p.official_warranty_until,p.seller_warranty_months,coalesce(p.warranty_terms,''),p.images,p.status,p.stock_quantity,true,coalesce(p.delivery_available,s.delivery_available),coalesce(p.pickup_available,s.pickup_available),coalesce(p.delivery_fee,s.delivery_fee),coalesce(p.delivery_pincodes,s.delivery_pincodes),coalesce(p.pickup_address,s.address),coalesce(p.pickup_instructions,s.pickup_instructions));
 else
 update public.marketplace_listings set title=p.title,brand=p.brand,price=p.price,regular_price=p.regular_price,year=p.year,condition=p.condition,description=p.description,processor=p.processor,ram=p.ram,storage=p.storage,graphics=p.graphics,display=coalesce(p.display,''),battery=coalesce(p.battery,''),defects=p.defects,accessories=coalesce(p.accessories,''),official_warranty_until=p.official_warranty_until,seller_warranty_months=p.seller_warranty_months,warranty_terms=coalesce(p.warranty_terms,''),images=p.images,status=p.status,stock_quantity=p.stock_quantity,delivery_available=coalesce(p.delivery_available,existing.delivery_available),pickup_available=coalesce(p.pickup_available,existing.pickup_available),delivery_fee=coalesce(p.delivery_fee,existing.delivery_fee),delivery_pincodes=coalesce(p.delivery_pincodes,existing.delivery_pincodes),pickup_address=coalesce(p.pickup_address,existing.pickup_address),pickup_instructions=coalesce(p.pickup_instructions,existing.pickup_instructions) where id=new_id;
 end if;
 return new_id;
end $$;

create or replace function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
declare intake public.marketplace_listing_intake;quote jsonb;admin boolean:=public.has_role(auth.uid(),'admin');changed boolean:=false;
begin

 if TG_OP='UPDATE' and new.store_owned is distinct from old.store_owned then raise exception 'Store ownership cannot change';end if;
 if new.store_owned then
  if TG_OP='INSERT' and not admin then raise exception 'Administrator access required';end if;
  if TG_OP='UPDATE' then
   changed:=(to_jsonb(new)-array['regular_price','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions','seller_name','location','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path']) is distinct from (to_jsonb(old)-array['regular_price','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions','seller_name','location','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path']);
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
  changed:=(to_jsonb(new)-array['regular_price','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']) is distinct from(to_jsonb(old)-array['regular_price','deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']);
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
create or replace function public.guard_marketplace_verification() returns trigger language plpgsql set search_path=public as $$
begin
 if TG_OP='UPDATE' then
  if new.seller_id is distinct from old.seller_id or new.id is distinct from old.id or new.created_at is distinct from old.created_at then raise exception 'Listing ownership and identity cannot change'; end if;
  if (new.verified_at is distinct from old.verified_at or new.verification_notes is distinct from old.verification_notes) and not public.has_role(auth.uid(),'admin') then raise exception 'Only admins can change verification'; end if;
  if (to_jsonb(new) - 'verified_at' - 'verification_notes' - 'status' - 'catalog_search' - 'seo_path' - 'regular_price' - 'delivery_available' - 'pickup_available' - 'delivery_fee' - 'delivery_pincodes' - 'pickup_address' - 'pickup_instructions') is distinct from (to_jsonb(old) - 'verified_at' - 'verification_notes' - 'status' - 'catalog_search' - 'seo_path' - 'regular_price' - 'delivery_available' - 'pickup_available' - 'delivery_fee' - 'delivery_pincodes' - 'pickup_address' - 'pickup_instructions') then
   new.verified_at := null; new.verification_notes := '';
  end if;
 end if;
 if new.verified_at is not null and length(trim(new.verification_notes)) < 20 then raise exception 'An inspection record is required'; end if;
 return new;
end $$;
