-- Non-technical seller intake. Laptap still records serial matching and full checks at inspection.
alter table public.marketplace_listings alter column year drop not null;
create or replace function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
declare intake public.marketplace_listing_intake;quote jsonb;admin boolean:=public.has_role(auth.uid(),'admin');changed boolean:=false;
begin
 if new.is_demo then return new;end if;
 if TG_OP='UPDATE' then
  changed:=(to_jsonb(new)-array['status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']) is distinct from(to_jsonb(old)-array['status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']);
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
  insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status)
  values(new_id,seller.id,seller.shop_name,p.title,p.brand,p.category,p.price,p.year,p.condition,p.description,p.processor,p.ram,p.storage,p.graphics,p.display,p.battery,p.defects,p.accessories,seller.city,p.official_warranty_until,p.seller_warranty_months,p.warranty_terms,p.images,'draft');
 else
  update public.marketplace_listings set title=p.title,brand=p.brand,category=p.category,price=p.price,year=p.year,condition=p.condition,description=p.description,processor=p.processor,ram=p.ram,storage=p.storage,graphics=p.graphics,display=p.display,battery=p.battery,defects=p.defects,accessories=p.accessories,official_warranty_until=p.official_warranty_until,seller_warranty_months=p.seller_warranty_months,warranty_terms=p.warranty_terms,images=p.images,status='draft' where id=new_id;
 end if;
 insert into public.marketplace_listing_intake(listing_id,seller_id,serial_number,diagnostic_notes,evidence_paths,ownership_confirmed,collection_address,collection_instructions,policy_snapshot,accepted_price,terms_accepted_at)
 values(new_id,seller.id,trim(coalesce(_intake->>'serial_number','')),trim(coalesce(_intake->>'diagnostic_notes','')),paths,coalesce((_intake->>'ownership_confirmed')::boolean,false),trim(coalesce(_intake->>'collection_address','')),trim(coalesce(_intake->>'collection_instructions','')),case when _submit then policy else '{}' end,case when _submit then p.price else 0 end,case when _submit then now() else null end)
 on conflict(listing_id) do update set serial_number=excluded.serial_number,diagnostic_notes=excluded.diagnostic_notes,evidence_paths=excluded.evidence_paths,ownership_confirmed=excluded.ownership_confirmed,collection_address=excluded.collection_address,collection_instructions=excluded.collection_instructions,policy_snapshot=excluded.policy_snapshot,accepted_price=excluded.accepted_price,terms_accepted_at=excluded.terms_accepted_at,review_note='',reviewed_at=null,reviewed_by=null;
 update public.marketplace_listings set review_status=case when _submit then 'pending' else 'draft' end,status='draft',commission_terms='{}' where id=new_id;
 return new_id;
end $$;

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
   if length(coalesce(nullif(trim(_data->>'serial_number'),''),(select serial_number from public.marketplace_listing_intake where listing_id=o.listing_id),''))<4 then raise exception 'Laptap must record the physical serial number before passing inspection';end if;
   if nullif(trim(_data->>'serial_number'),'') is not null then update public.marketplace_listing_intake set serial_number=left(trim(_data->>'serial_number'),100) where listing_id=o.listing_id;end if;
   foreach key in array array['display','keyboard','battery','storage','ports','performance','bios','ownership','serial_match'] loop if(_data->'checks'->key) is distinct from 'true'::jsonb then raise exception 'Every inspection check, ownership and serial matching must pass';end if;end loop;end if;
  target:=_action;update public.marketplace_order_operations set stage=target,inspection_status=case when _action='inspection_passed' then 'passed' else 'failed' end,checks=_data->'checks',report=left(trim(_data->>'report'),5000),updated_at=now() where order_id=_order_id;
  update public.marketplace_listings set verified_at=case when _action='inspection_passed' then now() else null end,verification_notes=case when _action='inspection_passed' then left(trim(_data->>'report'),2000) else '' end where id=o.listing_id;
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

create or replace function public.assign_marketplace_seo_path() returns trigger language plpgsql security definer set search_path=public as $$
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
 base:=base||'-'||trim(both '-' from regexp_replace(lower(new.ram||'-'||new.storage||'-'||coalesce(new.year::text,'year-not-provided')),'[^a-z0-9]+','-','g'));candidate:=base;
 while exists(select 1 from public.marketplace_listings where seo_path=candidate and id<>new.id) loop suffix:=suffix+1;candidate:=base||'-listing-'||suffix;end loop;
 end if;
 new.seo_path:=candidate;return new;
end $$;
