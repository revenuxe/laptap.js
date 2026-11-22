-- Serialize per-listing serial assignment and prevent a single unit from verifying a full batch.
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
   perform pg_advisory_xact_lock(hashtextextended(o.listing_id::text,717));
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



create or replace function public.guard_managed_physical_verification() returns trigger language plpgsql security definer set search_path=public as $$begin if new.stock_quantity>1 and new.verified_at is not null then raise exception 'Batch listings are inspected per laptop after purchase; do not verify the entire batch';end if;if new.review_status='approved' and new.verified_at is not null and(TG_OP='INSERT' or new.verified_at is distinct from old.verified_at) and not exists(select 1 from public.marketplace_orders o join public.marketplace_order_operations j on j.order_id=o.id where o.listing_id=new.id and j.inspection_status='passed') then raise exception 'Record the actual Laptap order inspection before awarding physical verification';end if;return new;end $$;
