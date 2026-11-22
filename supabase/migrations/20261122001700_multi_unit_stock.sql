-- Each stock unit gets its own order, inspection, cash receipt and settlement.
alter table public.marketplace_listings add column if not exists stock_quantity integer not null default 1 check(stock_quantity between 1 and 999),add column if not exists stock_available integer not null default 1 check(stock_available between 0 and 999);
update public.marketplace_listings p set stock_available=greatest(0,stock_quantity-(select count(*)::integer from public.marketplace_orders where listing_id=p.id));
drop index if exists public.one_active_order_per_device;
create or replace function public.guard_marketplace_stock() returns trigger language plpgsql security definer set search_path=public as $$
declare used integer;
begin
 if TG_OP='INSERT' then new.stock_available:=new.stock_quantity;return new;end if;
 if new.stock_quantity is distinct from old.stock_quantity and exists(select 1 from public.marketplace_orders where listing_id=old.id) then raise exception 'This listing already has orders. Create a new listing for additional stock';end if;
 select count(*) into used from public.marketplace_orders where listing_id=new.id;
 new.stock_available:=greatest(0,new.stock_quantity-used);
 if new.status='published' and new.stock_available=0 then raise exception 'No stock remains for this listing';end if;
 return new;
end $$;
drop trigger if exists a_guard_marketplace_stock on public.marketplace_listings;
create trigger a_guard_marketplace_stock before insert or update on public.marketplace_listings for each row execute function public.guard_marketplace_stock();
create or replace function public.reserve_marketplace_order_device() returns trigger language plpgsql security definer set search_path=public as $$
begin
 perform id from public.marketplace_listings where id=new.listing_id for update;
 update public.marketplace_listings set status=case when stock_quantity<=(select count(*) from public.marketplace_orders where listing_id=new.listing_id) then 'sold' else status end where id=new.listing_id;
 return new;
end $$;
create or replace function public.guard_marketplace_listing_reservation() returns trigger language plpgsql security definer set search_path=public as $$begin if new.status='published' and new.stock_available<=0 then raise exception 'This listing has no available stock';end if;return new;end $$;
create or replace function public.guard_marketplace_order_stock() returns trigger language plpgsql security definer set search_path=public as $$
declare p public.marketplace_listings;
begin
 select * into p from public.marketplace_listings where id=new.listing_id for update;
 if p.stock_available<1 or p.status<>'published' then raise exception 'This laptop is out of stock';end if;
 return new;
end $$;
drop trigger if exists a_stock_order_guard on public.marketplace_orders;
create trigger a_stock_order_guard before insert on public.marketplace_orders for each row execute function public.guard_marketplace_order_stock();
revoke execute on function public.guard_marketplace_stock(),public.guard_marketplace_order_stock() from public,anon,authenticated;
create or replace function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
declare intake public.marketplace_listing_intake;quote jsonb;admin boolean:=public.has_role(auth.uid(),'admin');changed boolean:=false;
begin
 if new.is_demo then return new;end if;
 if TG_OP='UPDATE' then
  changed:=(to_jsonb(new)-array['stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']) is distinct from(to_jsonb(old)-array['stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']);
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


create or replace function public.marketplace_save_device(_id uuid,_product jsonb,_intake jsonb,_submit boolean,_policy_version integer) returns uuid language plpgsql security definer set search_path=public as $$
declare seller public.marketplace_sellers;p public.marketplace_listings;existing public.marketplace_listings;policy jsonb;paths text[];new_id uuid:=coalesce(_id,gen_random_uuid());
begin
 select * into seller from public.marketplace_sellers where id=auth.uid();
 if seller.id is null or seller.status not in('active','pending') then raise exception 'An active or pending seller account is required';end if;
 select * into existing from public.marketplace_listings where id=new_id for update;
 if existing.id is not null and existing.seller_id<>auth.uid() then raise exception 'This listing does not belong to your account';end if;
 if existing.is_demo then raise exception 'Demo listings are managed separately by Laptap';end if;
 policy:=public.marketplace_managed_policy();
 if coalesce(_submit,false) then
  if _policy_version is distinct from(policy->>'version')::integer then raise exception 'Commission terms changed. Refresh and review your estimated payout';end if;
  if coalesce((_intake->>'ownership_confirmed')::boolean,false) is not true or coalesce((_intake->>'accepted_terms')::boolean,false) is not true then raise exception 'Confirm ownership and accept the commission and payout terms';end if;
  if length(trim(coalesce(_intake->>'collection_address','')))<10 then raise exception 'Enter your pickup address';end if;
 end if;
 if coalesce(jsonb_typeof(_intake->'evidence_paths'),'array')<>'array' or coalesce(jsonb_array_length(_intake->'evidence_paths'),0)>8 then raise exception 'Use up to eight private evidence images';end if;
 paths:=array(select jsonb_array_elements_text(coalesce(_intake->'evidence_paths','[]')));
 if exists(select 1 from unnest(paths) path where not exists(select 1 from storage.objects o where o.bucket_id='marketplace-evidence' and o.name=path and split_part(o.name,'/',1)=auth.uid()::text)) then raise exception 'Use evidence uploaded privately by your seller account';end if;

 p:=jsonb_populate_record(null::public.marketplace_listings,_product);
 if coalesce(_submit,false) and p.price<(policy->>'minimum_price')::numeric then raise exception 'Price is below the marketplace minimum';end if;
 if existing.id is null then
  insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status,stock_quantity)
  values(new_id,seller.id,seller.shop_name,p.title,p.brand,p.category,p.price,p.year,p.condition,p.description,p.processor,p.ram,p.storage,p.graphics,p.display,p.battery,p.defects,p.accessories,seller.city,p.official_warranty_until,p.seller_warranty_months,p.warranty_terms,p.images,'draft',coalesce(p.stock_quantity,1));
 else
  update public.marketplace_listings set title=p.title,brand=p.brand,category=p.category,price=p.price,year=p.year,condition=p.condition,description=p.description,processor=p.processor,ram=p.ram,storage=p.storage,graphics=p.graphics,display=p.display,battery=p.battery,defects=p.defects,accessories=p.accessories,official_warranty_until=p.official_warranty_until,seller_warranty_months=p.seller_warranty_months,warranty_terms=p.warranty_terms,images=p.images,stock_quantity=coalesce(p.stock_quantity,1),status='draft' where id=new_id;
 end if;
 insert into public.marketplace_listing_intake(listing_id,seller_id,serial_number,diagnostic_notes,evidence_paths,ownership_confirmed,collection_address,collection_instructions,policy_snapshot,accepted_price,terms_accepted_at)
 values(new_id,seller.id,trim(coalesce(_intake->>'serial_number','')),trim(coalesce(_intake->>'diagnostic_notes','')),paths,coalesce((_intake->>'ownership_confirmed')::boolean,false),trim(coalesce(_intake->>'collection_address','')),trim(coalesce(_intake->>'collection_instructions','')),case when _submit then policy else '{}' end,case when _submit then p.price else 0 end,case when _submit then now() else null end)
 on conflict(listing_id) do update set serial_number=excluded.serial_number,diagnostic_notes=excluded.diagnostic_notes,evidence_paths=excluded.evidence_paths,ownership_confirmed=excluded.ownership_confirmed,collection_address=excluded.collection_address,collection_instructions=excluded.collection_instructions,policy_snapshot=excluded.policy_snapshot,accepted_price=excluded.accepted_price,terms_accepted_at=excluded.terms_accepted_at,review_note='',reviewed_at=null,reviewed_by=null;
 update public.marketplace_listings set review_status=case when _submit then 'pending' else 'draft' end,status='draft',commission_terms='{}' where id=new_id;
 return new_id;
end $$;


create or replace function public.marketplace_place_order(_checkout_id uuid,_items jsonb,_address jsonb,_expected_total numeric,_accept_terms boolean) returns jsonb language plpgsql security definer set search_path=public as $$
declare buyer uuid:=auth.uid();buyer_email text;canonical jsonb;fingerprint text;previous public.marketplace_checkouts;item jsonb;device public.marketplace_listings;method text;total numeric:=0;contact_name text;contact_phone text;delivery_address text;pincode text;placed uuid[]:='{}';order_id uuid;fee numeric;snapshot jsonb;policy jsonb;service_fee numeric;handling numeric;units integer;unit_index integer;total_units integer;
begin
 if buyer is null then raise exception 'Sign in to place an order';end if;
 select email into buyer_email from auth.users where id=buyer and email_confirmed_at is not null;
 if buyer_email is null then raise exception 'Confirm your email before placing an order';end if;
 if _checkout_id is null or _accept_terms is distinct from true then raise exception 'Review and accept the order terms';end if;
 if coalesce(jsonb_typeof(_items),'')<>'array' then raise exception 'Choose devices to order';end if;
 if jsonb_array_length(_items) not between 1 and 8 then raise exception 'Order between 1 and 8 individual devices';end if;
 if coalesce(jsonb_typeof(_address),'')<>'object' then raise exception 'Enter your contact details';end if;
 if(select count(distinct value->>'listing_id') from jsonb_array_elements(_items))<>jsonb_array_length(_items) then raise exception 'Each individual device can appear only once';end if;
 if exists(select 1 from jsonb_array_elements(_items) v where coalesce(v->>'quantity','1') !~ '^[1-8]$') then raise exception 'Choose a whole quantity from 1 to 8';end if;
 select sum(coalesce((v->>'quantity')::integer,1)) into total_units from jsonb_array_elements(_items) v;
 if total_units>8 then raise exception 'Order up to 8 laptops per checkout';end if;
 contact_name:=trim(coalesce(_address->>'name',''));contact_phone:=regexp_replace(coalesce(_address->>'phone',''),'[ -]','','g');pincode:=trim(coalesce(_address->>'pincode',''));
 if length(contact_name) not between 2 and 100 or contact_phone !~ '^[6-9][0-9]{9}$' then raise exception 'Enter your full name and a valid Indian mobile number';end if;
 if length(coalesce(_address->>'line1',''))>300 or length(coalesce(_address->>'line2',''))>300 or length(coalesce(_address->>'city',''))>100 or length(coalesce(_address->>'state',''))>100 then raise exception 'Address details are too long';end if;
 select jsonb_agg(value order by value->>'listing_id') into canonical from jsonb_array_elements(_items);
 fingerprint:=md5(jsonb_build_object('items',canonical,'address',_address,'total',_expected_total)::text);
 perform pg_advisory_xact_lock(hashtextextended(buyer::text,170901));
 select * into previous from public.marketplace_checkouts where id=_checkout_id;
 if previous.id is not null then
  if previous.buyer_id<>buyer or previous.request_fingerprint<>fingerprint then raise exception 'Checkout details changed. Review your order and try again';end if;
  return jsonb_build_object('checkout_id',_checkout_id,'order_ids',(select jsonb_agg(id order by order_number) from public.marketplace_orders where checkout_id=_checkout_id and buyer_id=buyer));
 end if;
 if(select count(*) from public.marketplace_checkouts where buyer_id=buyer and created_at>now()-interval '1 day')>=20 then raise exception 'Daily checkout limit reached. Contact Laptap for help';end if;
 if(select count(*) from public.marketplace_orders where buyer_id=buyer and status='pending')+total_units>12 then raise exception 'You have several orders awaiting confirmation. Contact Laptap before placing more';end if;
 perform id from public.marketplace_managed_settings where id for share;policy:=public.marketplace_managed_policy();
 -- Consistent lock order prevents two carts or seller deletion from racing stock reservation.
 perform s.id from public.marketplace_sellers s where s.id in(select p.seller_id from public.marketplace_listings p where p.id in(select(value->>'listing_id')::uuid from jsonb_array_elements(canonical))) order by s.id for share;
 perform p.id from public.marketplace_listings p where p.id in(select(value->>'listing_id')::uuid from jsonb_array_elements(canonical)) order by p.id for update;
 for item in select value from jsonb_array_elements(canonical) loop
  select * into device from public.marketplace_listings where id=(item->>'listing_id')::uuid;
  if device.id is null or device.status<>'published' or device.review_status<>'approved' or device.is_demo or not public.marketplace_seller_active(device.seller_id) then raise exception 'A device is no longer available. Review your cart';end if;
  units:=coalesce((item->>'quantity')::integer,1);
  if units>device.stock_available then raise exception 'Not enough stock for %. Available: %',device.title,device.stock_available;end if;
  if device.seller_id=buyer then raise exception 'You cannot purchase your own device';end if;
  service_fee:=case when(policy->>'buyer_fee_enabled')::boolean and device.verification_fee_eligible then(policy->>'buyer_fee')::numeric else 0 end;handling:=case when device.category='desktop' then(policy->>'desktop_handling_fee')::numeric else 0 end;
  total:=total+units*(service_fee+handling);
  method:=coalesce(item->>'fulfillment_method','');
  if method='delivery' then
   if not device.delivery_available then raise exception 'Delivery is not offered for this device';end if;
   if pincode !~ '^[1-9][0-9]{5}$' or length(trim(coalesce(_address->>'line1','')))<5 or length(trim(coalesce(_address->>'city','')))<2 or length(trim(coalesce(_address->>'state','')))<2 then raise exception 'Complete your delivery address';end if;
   if cardinality(device.delivery_pincodes)>0 and not(pincode=any(device.delivery_pincodes)) then raise exception 'This seller does not deliver to your pincode. Choose pickup if available';end if;
   total:=total+units*(device.price+device.delivery_fee);
  elsif method='pickup' then
   if not device.pickup_available or length(trim(device.pickup_address))<10 then raise exception 'Store pickup is not offered for this device';end if;
   total:=total+units*device.price;
  else raise exception 'Choose delivery or store pickup for each device';end if;
 end loop;
 if _expected_total is null or _expected_total<>total then raise exception 'A price or delivery fee changed. Refresh checkout and review the total';end if;
 insert into public.marketplace_checkouts(id,buyer_id,request_fingerprint) values(_checkout_id,buyer,fingerprint);
 for item in select value from jsonb_array_elements(canonical) loop
  select * into device from public.marketplace_listings where id=(item->>'listing_id')::uuid;
  method:=item->>'fulfillment_method';fee:=case when method='delivery' then device.delivery_fee else 0 end;
  delivery_address:=case when method='pickup' then device.pickup_address else concat_ws(', ',trim(_address->>'line1'),nullif(trim(_address->>'line2'),''),trim(_address->>'city'),trim(_address->>'state'),pincode) end;
  snapshot:=jsonb_build_object('title',device.title,'image',device.images[1],'brand',device.brand,'condition',device.condition,'year',device.year,'ram',device.ram,'storage',device.storage,'seller_name',device.seller_name,'seo_path',device.seo_path,'price',device.price,'pickup_address',case when method='pickup' then device.pickup_address else '' end,'pickup_instructions',case when method='pickup' then device.pickup_instructions else '' end,'seller_warranty_months',device.seller_warranty_months,'warranty_terms',device.warranty_terms);
  for unit_index in 1..coalesce((item->>'quantity')::integer,1) loop
  insert into public.marketplace_orders(listing_id,seller_id,buyer_id,checkout_id,buyer_name,email,phone,address,amount,shipping_fee,fulfillment_method,payment_method,product_snapshot)
  values(device.id,device.seller_id,buyer,_checkout_id,contact_name,buyer_email,contact_phone,delivery_address,device.price+fee,fee,method,case when method='pickup' then 'pay_at_pickup' else 'cod' end,snapshot) returning id into order_id;
  placed:=array_append(placed,order_id);
  end loop;
 end loop;
 return jsonb_build_object('checkout_id',_checkout_id,'order_ids',to_jsonb(placed));
end $$;

alter table public.marketplace_order_operations add column if not exists serial_number text not null default '' check(length(serial_number)<=100);
update public.marketplace_order_operations j set serial_number=i.serial_number from public.marketplace_orders o join public.marketplace_listing_intake i on i.listing_id=o.listing_id where j.order_id=o.id;
create or replace function public.admin_marketplace_operation(_order_id uuid,_action text,_data jsonb) returns void language plpgsql security definer set search_path=public as $$
declare o public.marketplace_orders;j public.marketplace_order_operations;key text;target text;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 select * into o from public.marketplace_orders where id=_order_id for update;
 select * into j from public.marketplace_order_operations where order_id=_order_id for update;
 if o.id is null or not o.managed_by_laptap then raise exception 'Choose a managed order';end if;
 if o.status in('cancelled','refunded','return_requested','delivered') then raise exception 'Use support and finance controls for a completed, cancelled or disputed order';end if;
 if _action='confirm' then
  if o.status<>'pending' or j.stage<>'awaiting_confirmation' or length(trim(coalesce(_data->>'note','')))<5 then raise exception 'Confirm availability with the seller and add a note';end if;
  target:='confirmed';update public.marketplace_order_operations set stage=target,notes=left(trim(_data->>'note'),5000),updated_at=now() where order_id=_order_id;
  update public.marketplace_orders set status='confirmed' where id=_order_id;
 elsif _action='schedule_inspection' then
  if o.status<>'confirmed' or j.stage not in('confirmed','inspection_failed','inspection_scheduled') then raise exception 'Confirm availability before scheduling inspection';end if;
  if length(trim(coalesce(_data->>'assigned_to','')))<2 or nullif(_data->>'inspection_at','') is null then raise exception 'Choose an inspector and inspection time';end if;
  target:='inspection_scheduled';update public.marketplace_order_operations set stage=target,assigned_to=left(trim(_data->>'assigned_to'),200),inspection_at=(_data->>'inspection_at')::timestamptz,inspection_status='pending',updated_at=now() where order_id=_order_id;
 elsif _action in('inspection_passed','inspection_failed') then
  if j.stage<>'inspection_scheduled' or length(trim(coalesce(_data->>'report','')))<20 or jsonb_typeof(_data->'checks') is distinct from 'object' then raise exception 'Schedule the inspection and complete a condition report';end if;
  if _action='inspection_passed' then
   if length(coalesce(nullif(trim(_data->>'serial_number'),''),j.serial_number,''))<4 then raise exception 'Laptap must record the physical serial number before passing inspection';end if;
   if nullif(trim(_data->>'serial_number'),'') is not null then
    if exists(select 1 from public.marketplace_order_operations other_job join public.marketplace_orders other_order on other_order.id=other_job.order_id where other_order.listing_id=o.listing_id and other_job.order_id<>o.id and lower(trim(other_job.serial_number))=lower(trim(_data->>'serial_number'))) then raise exception 'This serial number is already assigned to another laptop in this listing';end if;
    update public.marketplace_order_operations set serial_number=left(trim(_data->>'serial_number'),100) where order_id=o.id;
   end if;
   foreach key in array array['display','keyboard','battery','storage','ports','performance','bios','ownership','serial_match'] loop if(_data->'checks'->key) is distinct from 'true'::jsonb then raise exception 'Every inspection check, ownership and serial matching must pass';end if;end loop;end if;
  target:=_action;update public.marketplace_order_operations set stage=target,inspection_status=case when _action='inspection_passed' then 'passed' else 'failed' end,checks=_data->'checks',report=left(trim(_data->>'report'),5000),updated_at=now() where order_id=_order_id;
  update public.marketplace_listings set verified_at=case when _action='inspection_passed' then now() else null end,verification_notes=case when _action='inspection_passed' then left(trim(_data->>'report'),2000) else '' end where id=o.listing_id and stock_quantity=1;
 elsif _action='schedule_pickup' then
  if j.stage not in('inspection_passed','pickup_scheduled') or nullif(_data->>'collection_at','') is null then raise exception 'Pass inspection and choose a seller pickup time';end if;
  target:='pickup_scheduled';update public.marketplace_order_operations set stage=target,collection_at=(_data->>'collection_at')::timestamptz,updated_at=now() where order_id=_order_id;
 elsif _action='collect' then
  if j.stage<>'pickup_scheduled' or length(trim(coalesce(_data->>'reference','')))<3 then raise exception 'Schedule pickup and enter a collection proof reference';end if;
  target:='collected';update public.marketplace_order_operations set stage=target,collected_at=now(),notes=left(notes||E'\nCollection proof: '||trim(_data->>'reference'),5000),updated_at=now() where order_id=_order_id;
 elsif _action='pack' then
  if j.stage<>'collected' or(_data->>'wipe_confirmed')::boolean is distinct from true or(_data->>'packed')::boolean is distinct from true or length(trim(coalesce(_data->>'reference','')))<3 then raise exception 'Confirm the actual data wipe, serial-matched packaging and packing proof';end if;
  target:='packed';update public.marketplace_order_operations set stage=target,wipe_confirmed=true,packed=true,packing_reference=left(trim(_data->>'reference'),300),updated_at=now() where order_id=_order_id;
 elsif _action='dispatch' then
  if j.stage<>'packed' or o.fulfillment_method<>'delivery' then raise exception 'Only packed delivery orders can be dispatched';end if;
  target:='dispatched';update public.marketplace_order_operations set stage=target,updated_at=now() where order_id=_order_id;
  update public.marketplace_orders set status='shipped',courier=left(trim(coalesce(_data->>'courier','')),100),tracking_number=left(trim(coalesce(_data->>'tracking','')),300) where id=_order_id;
 elsif _action='deliver' then
  if not((o.fulfillment_method='delivery' and j.stage='dispatched') or(o.fulfillment_method='pickup' and j.stage='packed')) or length(trim(coalesce(_data->>'reference','')))<3 then raise exception 'Complete fulfilment preparation and record delivery or hub collection proof';end if;
  target:='delivered';update public.marketplace_order_operations set stage=target,delivery_reference=left(trim(_data->>'reference'),300),delivered_at=now(),updated_at=now() where order_id=_order_id;
  update public.marketplace_orders set status='delivered' where id=_order_id;
 else raise exception 'Unknown operations action';end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'orders',_order_id,'Laptap operations updated',jsonb_build_object('stage',target));
end $$;


-- Keep batch size visible to staff without exposing per-unit serials.
create or replace function public.prepare_managed_order() returns trigger language plpgsql security definer set search_path=public as $$
declare p public.marketplace_listings;policy public.marketplace_managed_settings;terms jsonb;
begin
 if not new.managed_by_laptap then return new;end if;
 select * into policy from public.marketplace_managed_settings where id for share;
 select * into p from public.marketplace_listings where id=new.listing_id;
 if p.review_status<>'approved' or p.is_demo or p.commission_terms='{}' then raise exception 'This listing must pass Laptap review before an order can be placed';end if;
 terms:=p.commission_terms;
 new.device_amount:=p.price;new.buyer_service_fee:=case when policy.buyer_fee_enabled and p.verification_fee_eligible then policy.buyer_fee else 0 end;new.handling_fee:=case when p.category='desktop' then policy.desktop_handling_fee else 0 end;
 new.shipping_fee:=case when new.fulfillment_method='delivery' then p.delivery_fee else 0 end;
 new.amount:=new.device_amount+new.buyer_service_fee+new.handling_fee+new.shipping_fee;
 new.commission_amount:=(terms->>'commission')::numeric;new.commission_rate_bps:=(terms->>'rate_bps')::integer;new.seller_net:=(terms->>'seller_net')::numeric;new.acceptance_hours:=(terms->>'acceptance_hours')::integer;
 if(terms->>'price')::numeric<>p.price or new.seller_net+new.commission_amount<>p.price then raise exception 'Listing price and agreed seller terms differ. Review the listing again';end if;
 new.financial_snapshot:=jsonb_build_object('seller_terms',terms,'buyer_policy_version',policy.version,'device_amount',new.device_amount,'service_fee',new.buyer_service_fee,'handling_fee',new.handling_fee,'delivery_fee',new.shipping_fee,'total',new.amount,'managed_by','Laptap');
 new.product_snapshot:=new.product_snapshot||jsonb_build_object('stock_quantity',p.stock_quantity,'defects',p.defects,'battery',p.battery,'accessories',p.accessories,'official_warranty_until',p.official_warranty_until,'managed_by','Laptap');return new;
end $$;
