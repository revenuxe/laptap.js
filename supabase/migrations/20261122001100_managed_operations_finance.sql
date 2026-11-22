-- COD finance records and Laptap-only fulfilment. No bank transfer is initiated by these functions.
alter table public.marketplace_orders add column managed_by_laptap boolean not null default false,add column device_amount numeric(12,2) not null default 0,add column buyer_service_fee numeric(12,2) not null default 0,add column handling_fee numeric(12,2) not null default 0,add column commission_amount numeric(12,2) not null default 0,add column commission_rate_bps integer not null default 0,add column seller_net numeric(12,2) not null default 0,add column acceptance_hours integer not null default 48,add column financial_snapshot jsonb not null default '{}';
alter table public.marketplace_orders alter column managed_by_laptap set default true;
create table public.marketplace_order_operations(order_id uuid primary key references public.marketplace_orders(id),stage text not null default 'awaiting_confirmation' check(stage in('awaiting_confirmation','confirmed','inspection_scheduled','inspection_failed','inspection_passed','pickup_scheduled','collected','packed','dispatched','delivered','cancelled')),assigned_to text not null default '' check(length(assigned_to)<=200),inspection_at timestamptz,inspection_status text not null default 'pending' check(inspection_status in('pending','passed','failed')),checks jsonb not null default '{}',report text not null default '' check(length(report)<=5000),collection_at timestamptz,collected_at timestamptz,wipe_confirmed boolean not null default false,packed boolean not null default false,packing_reference text not null default '' check(length(packing_reference)<=300),delivery_reference text not null default '' check(length(delivery_reference)<=300),delivered_at timestamptz,notes text not null default '' check(length(notes)<=5000),updated_at timestamptz not null default now());
create table public.marketplace_settlements(order_id uuid primary key references public.marketplace_orders(id),seller_id uuid not null references auth.users(id),device_amount numeric(12,2) not null check(device_amount>0),commission_amount numeric(12,2) not null check(commission_amount>=0),seller_net numeric(12,2) not null check(seller_net>=0),status text not null default 'pending' check(status in('pending','on_hold','processing','paid','void','recovery_due','recovered')),unlock_at timestamptz,reference text not null default '',paid_at timestamptz,hold_reason text not null default '',recovery_reference text not null default '',destination_snapshot jsonb not null default '{}');
create unique index marketplace_payout_reference_unique on public.marketplace_settlements(lower(trim(reference))) where reference<>'';
create index marketplace_settlements_seller on public.marketplace_settlements(seller_id,status,unlock_at);
create table public.marketplace_payout_profiles(seller_id uuid primary key references public.marketplace_sellers(id),recipient_name text not null check(length(trim(recipient_name)) between 2 and 150),method text not null check(method in('upi','bank')),upi_id text not null default '' check(length(upi_id)<=200),bank_name text not null default '' check(length(bank_name)<=150),account_last4 text not null default '' check(account_last4='' or account_last4 ~ '^[0-9]{4}$'),ifsc text not null default '' check(ifsc='' or ifsc ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),beneficiary_reference text not null default '' check(length(beneficiary_reference)<=200),status text not null default 'pending' check(status in('pending','verified','rejected')),review_note text not null default '' check(length(review_note)<=1000),updated_at timestamptz not null default now());
create table public.marketplace_money_events(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.marketplace_orders(id),kind text not null check(kind in('collection','refund')),amount numeric(12,2) not null check(amount>0),method text not null check(method in('cod','cash','bank','upi')),reference text not null check(length(trim(reference)) between 3 and 300),note text not null default '' check(length(note)<=2000),idempotency_key uuid not null unique,actor_id uuid not null references auth.users(id),created_at timestamptz not null default now());
create unique index marketplace_money_reference_unique on public.marketplace_money_events(kind,lower(trim(reference)));
create index marketplace_money_order on public.marketplace_money_events(order_id,created_at);
create table public.marketplace_order_costs(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.marketplace_orders(id),category text not null check(category in('inspection','pickup','delivery','packaging','support','processing','other')),amount numeric(12,2) not null check(amount>0),reference text not null check(length(trim(reference)) between 3 and 300),note text not null default '',idempotency_key uuid not null unique,actor_id uuid not null references auth.users(id),created_at timestamptz not null default now());
create index marketplace_costs_order on public.marketplace_order_costs(order_id,created_at);
alter table public.marketplace_order_operations enable row level security;alter table public.marketplace_settlements enable row level security;alter table public.marketplace_payout_profiles enable row level security;alter table public.marketplace_money_events enable row level security;alter table public.marketplace_order_costs enable row level security;
create policy "Admins read operations" on public.marketplace_order_operations for select to authenticated using(public.has_role(auth.uid(),'admin'));
create policy "Owner admin read settlements" on public.marketplace_settlements for select to authenticated using(public.has_role(auth.uid(),'admin') or(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())));
create policy "Owner admin read payout destination" on public.marketplace_payout_profiles for select to authenticated using(public.has_role(auth.uid(),'admin') or(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())));
create policy "Admins read money events" on public.marketplace_money_events for select to authenticated using(public.has_role(auth.uid(),'admin'));
create policy "Admins read operating costs" on public.marketplace_order_costs for select to authenticated using(public.has_role(auth.uid(),'admin'));
grant select on public.marketplace_order_operations,public.marketplace_settlements,public.marketplace_payout_profiles,public.marketplace_money_events,public.marketplace_order_costs to authenticated;

create function public.prepare_managed_order() returns trigger language plpgsql security definer set search_path=public as $$
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
 new.product_snapshot:=new.product_snapshot||jsonb_build_object('defects',p.defects,'battery',p.battery,'accessories',p.accessories,'official_warranty_until',p.official_warranty_until,'managed_by','Laptap');return new;
end $$;
create trigger a_prepare_managed_order before insert on public.marketplace_orders for each row execute function public.prepare_managed_order();
create function public.initialize_managed_order() returns trigger language plpgsql security definer set search_path=public as $$begin if new.managed_by_laptap then insert into public.marketplace_order_operations(order_id) values(new.id);insert into public.marketplace_settlements(order_id,seller_id,device_amount,commission_amount,seller_net) values(new.id,new.seller_id,new.device_amount,new.commission_amount,new.seller_net);end if;return new;end $$;
create trigger a_initialize_managed_order after insert on public.marketplace_orders for each row execute function public.initialize_managed_order();
create function public.guard_managed_order_workflow() returns trigger language plpgsql security definer set search_path=public as $$
declare ops public.marketplace_order_operations;collected numeric;refunded numeric;
begin
 if not old.managed_by_laptap then return new;end if;
 if new.managed_by_laptap is distinct from old.managed_by_laptap then raise exception 'Managed fulfilment cannot be disabled';end if;
 select * into ops from public.marketplace_order_operations where order_id=old.id;
 if new.status is distinct from old.status then
  if new.status='confirmed' and ops.stage not in('confirmed','inspection_scheduled','inspection_failed','inspection_passed','pickup_scheduled','collected','packed') then raise exception 'Confirm device availability in the Laptap operations workspace';end if;
  if new.status in('shipped','delivered') and(ops.inspection_status<>'passed' or not ops.wipe_confirmed or not ops.packed or ops.collected_at is null) then raise exception 'Laptap inspection, collection, data wipe and packing must be complete before dispatch or delivery';end if;
  if new.status='delivered' and length(trim(ops.delivery_reference))<3 then raise exception 'Record proof of delivery or collection before completion';end if;
 end if;
 if new.payment_status is distinct from old.payment_status then
  if new.payment_status='unpaid' then raise exception 'Recorded payment cannot be reset';end if;
  select coalesce(sum(amount)filter(where kind='collection'),0),coalesce(sum(amount)filter(where kind='refund'),0) into collected,refunded from public.marketplace_money_events where order_id=old.id;
  if new.payment_status='paid' and collected<old.amount then raise exception 'Record actual COD collection in the payment ledger first';end if;
  if new.payment_status='refunded' and(refunded<=0 or refunded<>collected) then raise exception 'Record the completed refund in the payment ledger first';end if;
 end if;
 return new;
end $$;
create trigger zz_guard_managed_order before update on public.marketplace_orders for each row execute function public.guard_managed_order_workflow();
create function public.sync_managed_settlement() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.managed_by_laptap then
  if new.status='delivered' and old.status<>'delivered' then update public.marketplace_settlements set unlock_at=coalesce(unlock_at,now()+make_interval(hours=>new.acceptance_hours)) where order_id=new.id;end if;
  if new.status in('cancelled','refunded') then update public.marketplace_settlements set status=case when status in('paid','recovery_due') then 'recovery_due' else 'void' end,hold_reason=case when status in('paid','recovery_due') then 'Order refunded after payout. Reconcile seller recovery.' else 'Order cancelled or refunded' end where order_id=new.id;update public.marketplace_order_operations set stage=case when new.status='cancelled' then 'cancelled' else stage end,updated_at=now() where order_id=new.id;end if;
 end if;return new;
end $$;
create trigger sync_managed_settlement after update on public.marketplace_orders for each row execute function public.sync_managed_settlement();
revoke execute on function public.prepare_managed_order(),public.initialize_managed_order(),public.guard_managed_order_workflow(),public.sync_managed_settlement() from public,anon,authenticated;

create table public.marketplace_operation_events(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.marketplace_orders(id),stage text not null,created_at timestamptz not null default now());
create index marketplace_operation_events_order on public.marketplace_operation_events(order_id,created_at);
alter table public.marketplace_operation_events enable row level security;
create function public.record_managed_operation_event() returns trigger language plpgsql security definer set search_path=public as $$begin if TG_OP='INSERT' or new.stage is distinct from old.stage then insert into public.marketplace_operation_events(order_id,stage) values(new.order_id,new.stage);end if;return new;end $$;
create trigger managed_operation_event after insert or update on public.marketplace_order_operations for each row execute function public.record_managed_operation_event();
revoke execute on function public.record_managed_operation_event() from public,anon,authenticated;
create function public.marketplace_order_operations_public(_id uuid) returns jsonb language sql stable security definer set search_path=public as $$
 select coalesce((select jsonb_build_object('stage',j.stage,'inspection_at',j.inspection_at,'inspection_status',j.inspection_status,'checks',j.checks,'report',j.report,'collection_at',j.collection_at,'collected_at',j.collected_at,'delivered_at',j.delivered_at,'events',coalesce((select jsonb_agg(jsonb_build_object('stage',e.stage,'created_at',e.created_at) order by e.created_at) from public.marketplace_operation_events e where e.order_id=j.order_id),'[]'::jsonb)) from public.marketplace_order_operations j join public.marketplace_orders o on o.id=j.order_id where j.order_id=_id and(public.has_role(auth.uid(),'admin') or o.buyer_id=auth.uid() or(o.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())))),'{}'::jsonb)
$$;
revoke execute on function public.marketplace_order_operations_public(uuid) from public,anon;grant execute on function public.marketplace_order_operations_public(uuid) to authenticated;
create function public.admin_marketplace_operation(_order_id uuid,_action text,_data jsonb) returns void language plpgsql security definer set search_path=public as $$
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
  if _action='inspection_passed' then foreach key in array array['display','keyboard','battery','storage','ports','performance','bios','ownership','serial_match'] loop if(_data->'checks'->key) is distinct from 'true'::jsonb then raise exception 'Every inspection check, ownership and serial matching must pass';end if;end loop;end if;
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
revoke execute on function public.admin_marketplace_operation(uuid,text,jsonb) from public,anon;grant execute on function public.admin_marketplace_operation(uuid,text,jsonb) to authenticated;
create function public.guard_managed_physical_verification() returns trigger language plpgsql security definer set search_path=public as $$begin if new.review_status='approved' and new.verified_at is not null and(TG_OP='INSERT' or new.verified_at is distinct from old.verified_at) and not exists(select 1 from public.marketplace_orders o join public.marketplace_order_operations j on j.order_id=o.id where o.listing_id=new.id and j.inspection_status='passed') then raise exception 'Record the actual Laptap order inspection before awarding physical verification';end if;return new;end $$;
create trigger zz_managed_physical_verification before insert or update on public.marketplace_listings for each row execute function public.guard_managed_physical_verification();
revoke execute on function public.guard_managed_physical_verification() from public,anon,authenticated;

create function public.marketplace_payout_blockers(_order_id uuid) returns text[] language plpgsql stable security definer set search_path=public as $$
declare o public.marketplace_orders;s public.marketplace_settlements;problems text[]:='{}';
begin
 select * into o from public.marketplace_orders where id=_order_id;select * into s from public.marketplace_settlements where order_id=_order_id;
 if o.id is null or s.order_id is null then return array['Settlement not found'];end if;
 if not(public.has_role(auth.uid(),'admin') or(o.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()))) then raise exception 'Settlement access denied';end if;
 if o.status<>'delivered' then problems:=array_append(problems,'Delivery or collection is not complete');end if;
 if o.payment_status<>'paid' then problems:=array_append(problems,'Buyer payment has not been fully recorded');end if;
 if s.unlock_at is null or s.unlock_at>now() then problems:=array_append(problems,'Initial acceptance period has not elapsed');end if;
 if s.status not in('pending','processing') then problems:=array_append(problems,'Payout status is '||s.status);end if;
 if not public.marketplace_seller_active(o.seller_id) then problems:=array_append(problems,'Seller account is not active');end if;
 if not exists(select 1 from public.marketplace_payout_profiles where seller_id=o.seller_id and status='verified') then problems:=array_append(problems,'Payout destination needs verification');end if;
 if exists(select 1 from public.marketplace_returns where order_id=o.id and status in('open','reviewing')) then problems:=array_append(problems,'An unresolved return or support case is open');end if;
 if exists(select 1 from public.marketplace_money_events where order_id=o.id and kind='refund') then problems:=array_append(problems,'A refund has been recorded');end if;
 return problems;
end $$;
revoke execute on function public.marketplace_payout_blockers(uuid) from public,anon;grant execute on function public.marketplace_payout_blockers(uuid) to authenticated;
create function public.marketplace_save_payout_profile(_profile jsonb) returns void language plpgsql security definer set search_path=public as $$
declare seller uuid:=auth.uid();method text:=_profile->>'method';
begin
 if seller is null or not public.marketplace_can_upload() then raise exception 'A pending or active seller account is required';end if;
 perform id from public.marketplace_sellers where id=seller for update;
 if exists(select 1 from public.marketplace_settlements where seller_id=seller and status='processing') then raise exception 'A payout is in progress. Update the destination after it is reconciled';end if;
 if method='upi' and trim(coalesce(_profile->>'upi_id','')) !~ '^[A-Za-z0-9._-]{2,}@[A-Za-z0-9.-]{2,}$' then raise exception 'Enter a valid UPI ID';end if;
 if method='bank' and(coalesce(_profile->>'account_last4','') !~ '^[0-9]{4}$' or upper(coalesce(_profile->>'ifsc','')) !~ '^[A-Z]{4}0[A-Z0-9]{6}$' or length(trim(coalesce(_profile->>'bank_name','')))<2) then raise exception 'Enter the bank name, last four account digits and IFSC';end if;
 insert into public.marketplace_payout_profiles(seller_id,recipient_name,method,upi_id,bank_name,account_last4,ifsc) values(seller,trim(_profile->>'recipient_name'),method,case when method='upi' then trim(_profile->>'upi_id') else '' end,case when method='bank' then trim(_profile->>'bank_name') else '' end,case when method='bank' then trim(_profile->>'account_last4') else '' end,case when method='bank' then upper(trim(_profile->>'ifsc')) else '' end)
 on conflict(seller_id) do update set recipient_name=excluded.recipient_name,method=excluded.method,upi_id=excluded.upi_id,bank_name=excluded.bank_name,account_last4=excluded.account_last4,ifsc=excluded.ifsc,status='pending',beneficiary_reference='',review_note='',updated_at=now();
end $$;
create function public.admin_marketplace_verify_payout_profile(_seller_id uuid,_verified boolean,_reference text,_note text) returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 if length(trim(coalesce(_note,'')))<5 or(_verified and length(trim(coalesce(_reference,'')))<3) then raise exception 'Record the verification outcome and beneficiary reference';end if;
 update public.marketplace_payout_profiles set status=case when _verified then 'verified' else 'rejected' end,beneficiary_reference=left(trim(coalesce(_reference,'')),200),review_note=left(trim(_note),1000),updated_at=now() where seller_id=_seller_id;
 if not found then raise exception 'Seller payout details are missing';end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action) values(auth.uid(),'sellers',_seller_id,'Payout destination reviewed');
end $$;
revoke execute on function public.marketplace_save_payout_profile(jsonb),public.admin_marketplace_verify_payout_profile(uuid,boolean,text,text) from public,anon;grant execute on function public.marketplace_save_payout_profile(jsonb),public.admin_marketplace_verify_payout_profile(uuid,boolean,text,text) to authenticated;

create function public.admin_marketplace_money_event(_order_id uuid,_kind text,_amount numeric,_method text,_reference text,_note text,_idempotency_key uuid,_completed_externally boolean) returns uuid language plpgsql security definer set search_path=public as $$
declare o public.marketplace_orders;previous public.marketplace_money_events;collected numeric;refunded numeric;result uuid;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 if _completed_externally is distinct from true then raise exception 'Only record money actually collected or a refund already completed';end if;
 select * into o from public.marketplace_orders where id=_order_id for update;
 if o.id is null or not o.managed_by_laptap then raise exception 'Choose a managed order';end if;
 select * into previous from public.marketplace_money_events where idempotency_key=_idempotency_key;
 if previous.id is not null then if previous.order_id<>_order_id or previous.kind<>_kind or previous.amount<>_amount or previous.method<>_method or previous.reference<>trim(_reference) then raise exception 'Payment retry details differ from the recorded transaction';end if;return previous.id;end if;
 select coalesce(sum(amount)filter(where kind='collection'),0),coalesce(sum(amount)filter(where kind='refund'),0) into collected,refunded from public.marketplace_money_events where order_id=_order_id;
 if _amount is null or _amount<=0 or _amount<>round(_amount,2) then raise exception 'Enter a positive amount with at most two decimal places';end if;
 if _kind='collection' then
  if _method not in('cod','cash') then raise exception 'Cash on delivery only';end if;
  if o.status<>'delivered' or collected+_amount>o.amount or refunded>0 then raise exception 'Collect COD only for a delivered order, without over-collection';end if;
 elsif _kind='refund' then
  if o.status not in('return_requested','cancelled') or _amount<>collected-refunded or _amount<=0 then raise exception 'Resolve the return/cancellation and record the full remaining collected amount as refunded';end if;
 else raise exception 'Unknown payment event';end if;
 insert into public.marketplace_money_events(order_id,kind,amount,method,reference,note,idempotency_key,actor_id) values(_order_id,_kind,_amount,_method,trim(_reference),left(trim(coalesce(_note,'')),2000),_idempotency_key,auth.uid()) returning id into result;
 if _kind='collection' and collected+_amount=o.amount then update public.marketplace_orders set payment_status='paid',payment_reference=trim(_reference) where id=_order_id;end if;
 if _kind='refund' then
  if o.status='cancelled' then update public.marketplace_orders set payment_status='refunded',payment_reference=trim(_reference) where id=_order_id;else update public.marketplace_orders set status='refunded',payment_status='refunded',payment_reference=trim(_reference) where id=_order_id;end if;
 end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'orders',_order_id,'Recorded '||_kind,jsonb_build_object('amount',_amount,'event_id',result));return result;
end $$;
create function public.admin_marketplace_record_cost(_order_id uuid,_category text,_amount numeric,_reference text,_note text,_idempotency_key uuid) returns uuid language plpgsql security definer set search_path=public as $$
declare previous public.marketplace_order_costs;result uuid;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 select * into previous from public.marketplace_order_costs where idempotency_key=_idempotency_key;
 if previous.id is not null then if previous.order_id<>_order_id or previous.category<>_category or previous.amount<>_amount or previous.reference<>trim(_reference) then raise exception 'Cost retry differs from the existing entry';end if;return previous.id;end if;
 insert into public.marketplace_order_costs(order_id,category,amount,reference,note,idempotency_key,actor_id) values(_order_id,_category,_amount,trim(_reference),left(trim(coalesce(_note,'')),2000),_idempotency_key,auth.uid()) returning id into result;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'orders',_order_id,'Operating cost recorded',jsonb_build_object('cost_id',result,'amount',_amount,'category',_category));return result;
end $$;
create function public.admin_marketplace_payout_action(_order_id uuid,_action text,_reference text,_reason text,_completed_externally boolean default false) returns void language plpgsql security definer set search_path=public as $$
declare o public.marketplace_orders;s public.marketplace_settlements;destination public.marketplace_payout_profiles;problems text[];
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 select * into o from public.marketplace_orders where id=_order_id for update;
 select * into s from public.marketplace_settlements where order_id=_order_id for update;
 if s.order_id is null then raise exception 'Settlement not found';end if;
 if _action='start' then
  if s.status<>'pending' then raise exception 'Only pending payouts can be prepared';end if;
  problems:=public.marketplace_payout_blockers(_order_id);if cardinality(problems)>0 then raise exception '%',array_to_string(problems,'; ');end if;
  select * into destination from public.marketplace_payout_profiles where seller_id=s.seller_id for share;
  update public.marketplace_settlements set status='processing',destination_snapshot=to_jsonb(destination)-'review_note',hold_reason='' where order_id=_order_id;
 elsif _action='paid' then
  if s.status='paid' and s.reference=trim(_reference) then return;end if;
  if s.status<>'processing' or _completed_externally is distinct from true or length(trim(coalesce(_reference,'')))<3 then raise exception 'Prepare the eligible payout and confirm an actual external transfer reference';end if;
  problems:=public.marketplace_payout_blockers(_order_id);if cardinality(problems)>0 then raise exception '%',array_to_string(problems,'; ');end if;
  update public.marketplace_settlements set status='paid',reference=trim(_reference),paid_at=now() where order_id=_order_id;
 elsif _action='hold' then
  if s.status not in('pending','processing') or length(trim(coalesce(_reason,'')))<5 then raise exception 'Only unsettled payouts can be held; record a reason';end if;
  update public.marketplace_settlements set status='on_hold',hold_reason=left(trim(_reason),1000) where order_id=_order_id;
 elsif _action='resume' then
  if s.status not in('on_hold','processing') or length(trim(coalesce(_reason,'')))<5 then raise exception 'Record why the hold or failed transfer is being returned to review';end if;
  update public.marketplace_settlements set status='pending',hold_reason=left(trim(_reason),1000),destination_snapshot='{}' where order_id=_order_id;
 elsif _action='recovered' then
  if s.status<>'recovery_due' or _completed_externally is distinct from true or length(trim(coalesce(_reference,'')))<3 then raise exception 'Confirm the seller funds actually recovered and record the reference';end if;
  update public.marketplace_settlements set status='recovered',recovery_reference=trim(_reference) where order_id=_order_id;
 else raise exception 'Unknown payout action';end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'orders',_order_id,'Seller payout '||_action,jsonb_build_object('reason',left(trim(coalesce(_reason,'')),1000),'net_amount',s.seller_net));
end $$;
revoke execute on function public.admin_marketplace_money_event(uuid,text,numeric,text,text,text,uuid,boolean),public.admin_marketplace_record_cost(uuid,text,numeric,text,text,uuid),public.admin_marketplace_payout_action(uuid,text,text,text,boolean) from public,anon;
grant execute on function public.admin_marketplace_money_event(uuid,text,numeric,text,text,text,uuid,boolean),public.admin_marketplace_record_cost(uuid,text,numeric,text,text,uuid),public.admin_marketplace_payout_action(uuid,text,text,text,boolean) to authenticated;
create function public.lock_managed_support_order() returns trigger language plpgsql security definer set search_path=public as $$begin perform id from public.marketplace_orders where id=new.order_id for update;return new;end $$;
create trigger a_lock_managed_support before insert or update on public.marketplace_returns for each row execute function public.lock_managed_support_order();
revoke execute on function public.lock_managed_support_order() from public,anon,authenticated;
create function public.marketplace_report_order_issue(_order_id uuid,_reason text) returns uuid language plpgsql security definer set search_path=public as $$
declare o public.marketplace_orders;result uuid;
begin
 if auth.uid() is null or length(trim(coalesce(_reason,''))) not between 10 and 3000 then raise exception 'Describe the issue in at least 10 characters';end if;
 select * into o from public.marketplace_orders where id=_order_id and buyer_id=auth.uid() for update;
 if o.id is null or o.status not in('delivered','return_requested') then raise exception 'Choose one of your delivered orders';end if;
 select id into result from public.marketplace_returns where order_id=_order_id and status in('open','reviewing') limit 1;
 if result is not null then return result;end if;
 insert into public.marketplace_returns(order_id,reason) values(_order_id,trim(_reason)) returning id into result;
 if o.status='delivered' then update public.marketplace_orders set status='return_requested' where id=_order_id;end if;return result;
end $$;
revoke execute on function public.marketplace_report_order_issue(uuid,text) from public,anon;grant execute on function public.marketplace_report_order_issue(uuid,text) to authenticated;

create or replace function public.guard_marketplace_order() returns trigger language plpgsql set search_path=public as $$
declare device public.marketplace_listings;admin boolean:=public.has_role(auth.uid(),'admin');seller boolean;buyer boolean;
begin
 if TG_OP='INSERT' then
  if not admin and (auth.uid() is null or new.buyer_id is distinct from auth.uid() or new.checkout_id is null or not exists(select 1 from public.marketplace_checkouts c where c.id=new.checkout_id and c.buyer_id=auth.uid())) then raise exception 'Only admins or authenticated checkout can create orders';end if;
  perform id from public.marketplace_sellers where id=new.seller_id for share;
  select * into device from public.marketplace_listings where id=new.listing_id for update;
  if device.id is null or device.status<>'published' or not public.marketplace_seller_active(device.seller_id) then raise exception 'Device is not available for an order';end if;
  if new.seller_id<>device.seller_id then raise exception 'Seller must match the listing';end if;
  if new.status<>'pending' then raise exception 'New orders must begin as pending';end if;
  if not admin and (new.payment_status<>'unpaid' or new.payment_reference<>'' or new.admin_notes<>'' or new.payment_method not in ('cod','pay_at_pickup') or new.amount<>device.price+new.buyer_service_fee+new.handling_fee+case when new.fulfillment_method='delivery' then device.delivery_fee else 0 end) then raise exception 'Invalid checkout pricing or payment';end if;
 else
  if new.id<>old.id or new.listing_id<>old.listing_id or new.seller_id<>old.seller_id or new.order_number<>old.order_number or new.created_at<>old.created_at then raise exception 'Order identity cannot change';end if;
  if (old.checkout_id is not null or old.managed_by_laptap) and (to_jsonb(new)-'status'-'payment_status'-'payment_reference'-'courier'-'tracking_number'-'admin_notes'-'cancellation_reason') is distinct from (to_jsonb(old)-'status'-'payment_status'-'payment_reference'-'courier'-'tracking_number'-'admin_notes'-'cancellation_reason') then raise exception 'Checkout details cannot change after placement';end if;
  if not admin then
   if old.managed_by_laptap and old.seller_id=auth.uid() then raise exception 'Laptap manages inspection, pickup and delivery for this order';end if;
   seller:=old.seller_id=auth.uid() and public.marketplace_seller_active(auth.uid());buyer:=old.buyer_id=auth.uid();
   if seller then
    if (to_jsonb(new)-'status'-'courier'-'tracking_number'-'cancellation_reason') is distinct from (to_jsonb(old)-'status'-'courier'-'tracking_number'-'cancellation_reason') then raise exception 'Sellers cannot change payment, customer, or internal order details';end if;
    if not((old.status='pending' and new.status in ('pending','confirmed','cancelled')) or(old.status='confirmed' and new.status in ('confirmed','cancelled','shipped','delivered')) or(old.status='shipped' and new.status in ('shipped','delivered'))) then raise exception 'Seller fulfilment transition is not permitted';end if;
   elsif buyer then
    if not((old.status='pending' and old.payment_status='unpaid' and new.status='cancelled') or(old.status='delivered' and new.status='return_requested')) or(to_jsonb(new)-'status'-'cancellation_reason') is distinct from(to_jsonb(old)-'status'-'cancellation_reason') then raise exception 'Only unpaid, unconfirmed orders can be cancelled by their buyer';end if;
   else raise exception 'Only admins or the approved listing seller can manage this order';end if;
  end if;
  if new.status='cancelled' and new.status is distinct from old.status and old.checkout_id is not null and length(trim(new.cancellation_reason))<5 then raise exception 'Enter a cancellation reason';end if;
  if new.status<>old.status and not((old.status='pending' and new.status in ('confirmed','cancelled')) or(old.status='confirmed' and(new.status in ('shipped','cancelled') or(new.status='delivered' and old.fulfillment_method='pickup'))) or(old.status='shipped' and new.status in ('delivered','return_requested')) or(old.status='delivered' and new.status='return_requested') or(old.status='return_requested' and new.status in ('refunded','delivered'))) then raise exception 'Invalid order status transition';end if;
 end if;
 return new;
end $$;


create or replace function public.marketplace_place_order(_checkout_id uuid,_items jsonb,_address jsonb,_expected_total numeric,_accept_terms boolean) returns jsonb language plpgsql security definer set search_path=public as $$
declare buyer uuid:=auth.uid();buyer_email text;canonical jsonb;fingerprint text;previous public.marketplace_checkouts;item jsonb;device public.marketplace_listings;method text;total numeric:=0;contact_name text;contact_phone text;delivery_address text;pincode text;placed uuid[]:='{}';order_id uuid;fee numeric;snapshot jsonb;policy jsonb;service_fee numeric;handling numeric;
begin
 if buyer is null then raise exception 'Sign in to place an order';end if;
 select email into buyer_email from auth.users where id=buyer and email_confirmed_at is not null;
 if buyer_email is null then raise exception 'Confirm your email before placing an order';end if;
 if _checkout_id is null or _accept_terms is distinct from true then raise exception 'Review and accept the order terms';end if;
 if coalesce(jsonb_typeof(_items),'')<>'array' then raise exception 'Choose devices to order';end if;
 if jsonb_array_length(_items) not between 1 and 8 then raise exception 'Order between 1 and 8 individual devices';end if;
 if coalesce(jsonb_typeof(_address),'')<>'object' then raise exception 'Enter your contact details';end if;
 if(select count(distinct value->>'listing_id') from jsonb_array_elements(_items))<>jsonb_array_length(_items) then raise exception 'Each individual device can appear only once';end if;
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
 if(select count(*) from public.marketplace_orders where buyer_id=buyer and status='pending')+jsonb_array_length(_items)>12 then raise exception 'You have several orders awaiting confirmation. Contact Laptap before placing more';end if;
 perform id from public.marketplace_managed_settings where id for share;policy:=public.marketplace_managed_policy();
 -- Consistent lock order prevents two carts or seller deletion from racing stock reservation.
 perform s.id from public.marketplace_sellers s where s.id in(select p.seller_id from public.marketplace_listings p where p.id in(select(value->>'listing_id')::uuid from jsonb_array_elements(canonical))) order by s.id for share;
 perform p.id from public.marketplace_listings p where p.id in(select(value->>'listing_id')::uuid from jsonb_array_elements(canonical)) order by p.id for update;
 for item in select value from jsonb_array_elements(canonical) loop
  select * into device from public.marketplace_listings where id=(item->>'listing_id')::uuid;
  if device.id is null or device.status<>'published' or device.review_status<>'approved' or device.is_demo or not public.marketplace_seller_active(device.seller_id) then raise exception 'A device is no longer available. Review your cart';end if;
  if device.seller_id=buyer then raise exception 'You cannot purchase your own device';end if;
  service_fee:=case when(policy->>'buyer_fee_enabled')::boolean and device.verification_fee_eligible then(policy->>'buyer_fee')::numeric else 0 end;handling:=case when device.category='desktop' then(policy->>'desktop_handling_fee')::numeric else 0 end;
  total:=total+service_fee+handling;
  method:=coalesce(item->>'fulfillment_method','');
  if method='delivery' then
   if not device.delivery_available then raise exception 'Delivery is not offered for this device';end if;
   if pincode !~ '^[1-9][0-9]{5}$' or length(trim(coalesce(_address->>'line1','')))<5 or length(trim(coalesce(_address->>'city','')))<2 or length(trim(coalesce(_address->>'state','')))<2 then raise exception 'Complete your delivery address';end if;
   if cardinality(device.delivery_pincodes)>0 and not(pincode=any(device.delivery_pincodes)) then raise exception 'This seller does not deliver to your pincode. Choose pickup if available';end if;
   total:=total+device.price+device.delivery_fee;
  elsif method='pickup' then
   if not device.pickup_available or length(trim(device.pickup_address))<10 then raise exception 'Store pickup is not offered for this device';end if;
   total:=total+device.price;
  else raise exception 'Choose delivery or store pickup for each device';end if;
 end loop;
 if _expected_total is null or _expected_total<>total then raise exception 'A price or delivery fee changed. Refresh checkout and review the total';end if;
 insert into public.marketplace_checkouts(id,buyer_id,request_fingerprint) values(_checkout_id,buyer,fingerprint);
 for item in select value from jsonb_array_elements(canonical) loop
  select * into device from public.marketplace_listings where id=(item->>'listing_id')::uuid;
  method:=item->>'fulfillment_method';fee:=case when method='delivery' then device.delivery_fee else 0 end;
  delivery_address:=case when method='pickup' then device.pickup_address else concat_ws(', ',trim(_address->>'line1'),nullif(trim(_address->>'line2'),''),trim(_address->>'city'),trim(_address->>'state'),pincode) end;
  snapshot:=jsonb_build_object('title',device.title,'image',device.images[1],'brand',device.brand,'condition',device.condition,'year',device.year,'ram',device.ram,'storage',device.storage,'seller_name',device.seller_name,'seo_path',device.seo_path,'price',device.price,'pickup_address',case when method='pickup' then device.pickup_address else '' end,'pickup_instructions',case when method='pickup' then device.pickup_instructions else '' end,'seller_warranty_months',device.seller_warranty_months,'warranty_terms',device.warranty_terms);
  insert into public.marketplace_orders(listing_id,seller_id,buyer_id,checkout_id,buyer_name,email,phone,address,amount,shipping_fee,fulfillment_method,payment_method,product_snapshot)
  values(device.id,device.seller_id,buyer,_checkout_id,contact_name,buyer_email,contact_phone,delivery_address,device.price+fee,fee,method,case when method='pickup' then 'pay_at_pickup' else 'cod' end,snapshot) returning id into order_id;
  placed:=array_append(placed,order_id);
 end loop;
 return jsonb_build_object('checkout_id',_checkout_id,'order_ids',to_jsonb(placed));
end $$;
revoke execute on function public.marketplace_place_order(uuid,jsonb,jsonb,numeric,boolean) from public,anon;
grant execute on function public.marketplace_place_order(uuid,jsonb,jsonb,numeric,boolean) to authenticated;


create function public.marketplace_money_summary(_order_id uuid) returns jsonb language sql stable security definer set search_path=public as $$
 select case when exists(select 1 from public.marketplace_orders o where o.id=_order_id and(public.has_role(auth.uid(),'admin') or o.buyer_id=auth.uid() or(o.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())))) then jsonb_build_object('collected',coalesce(sum(amount)filter(where kind='collection'),0),'refunded',coalesce(sum(amount)filter(where kind='refund'),0)) else '{}'::jsonb end from public.marketplace_money_events where order_id=_order_id
$$;
create function public.marketplace_settlement_public(_order_id uuid) returns jsonb language plpgsql stable security definer set search_path=public as $$
declare s public.marketplace_settlements;problems text[];
begin
 select * into s from public.marketplace_settlements where order_id=_order_id;
 if s.order_id is null then return '{}'::jsonb;end if;
 if not(public.has_role(auth.uid(),'admin') or(s.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()))) then raise exception 'Settlement access denied';end if;
 problems:=public.marketplace_payout_blockers(_order_id);
 return jsonb_build_object('order_id',s.order_id,'status',s.status,'device_amount',s.device_amount,'commission_amount',s.commission_amount,'seller_net',s.seller_net,'unlock_at',s.unlock_at,'reference',s.reference,'paid_at',s.paid_at,'hold_reason',s.hold_reason,'recovery_reference',s.recovery_reference,'eligible',cardinality(problems)=0,'blockers',to_jsonb(problems));
end $$;
create function public.marketplace_seller_finance(_offset integer default 0) returns jsonb language plpgsql stable security definer set search_path=public as $$
declare seller uuid:=auth.uid();profile jsonb;rows jsonb;summary jsonb;total integer;
begin
 if seller is null or not public.marketplace_seller_has_access(seller) then raise exception 'Seller access required';end if;
 select to_jsonb(p) into profile from public.marketplace_payout_profiles p where seller_id=seller;
 select jsonb_build_object('pending',coalesce(sum(seller_net)filter(where status in('pending','processing','on_hold')),0),'paid',coalesce(sum(seller_net)filter(where status='paid'),0),'recovery_due',coalesce(sum(seller_net)filter(where status='recovery_due'),0)) into summary from public.marketplace_settlements where seller_id=seller;
 select count(*) into total from public.marketplace_settlements where seller_id=seller;
 select coalesce(jsonb_agg(public.marketplace_settlement_public(s.order_id)||jsonb_build_object('order_number',o.order_number,'title',o.product_snapshot->>'title','created_at',o.created_at) order by o.created_at desc),'[]'::jsonb) into rows from(select st.* from public.marketplace_settlements st join public.marketplace_orders ord on ord.id=st.order_id where st.seller_id=seller order by ord.created_at desc,st.order_id offset greatest(0,least(_offset,100000)) limit 24)s join public.marketplace_orders o on o.id=s.order_id;
 return jsonb_build_object('profile',profile,'summary',summary,'settlements',rows,'has_more',total>greatest(0,_offset)+24);
end $$;
revoke execute on function public.marketplace_money_summary(uuid),public.marketplace_settlement_public(uuid),public.marketplace_seller_finance(integer) from public,anon;
grant execute on function public.marketplace_money_summary(uuid),public.marketplace_settlement_public(uuid),public.marketplace_seller_finance(integer) to authenticated;

create or replace function public.marketplace_buyer_orders() returns jsonb language sql stable security definer set search_path=public as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',o.id,'order_number',o.order_number,'checkout_id',o.checkout_id,'listing_id',o.listing_id,'amount',o.amount,'shipping_fee',o.shipping_fee,'status',o.status,'payment_status',o.payment_status,'payment_method',o.payment_method,'fulfillment_method',o.fulfillment_method,'buyer_name',o.buyer_name,'email',o.email,'phone',o.phone,'address',o.address,'courier',o.courier,'tracking_number',o.tracking_number,'cancellation_reason',o.cancellation_reason,'created_at',o.created_at,'product_snapshot',o.product_snapshot,'managed_by_laptap',o.managed_by_laptap,'device_amount',o.device_amount,'buyer_service_fee',o.buyer_service_fee,'handling_fee',o.handling_fee,'acceptance_hours',o.acceptance_hours,'operations',public.marketplace_order_operations_public(o.id),'money',public.marketplace_money_summary(o.id),'issues',coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'reason',r.reason,'status',r.status,'resolution',r.resolution)) from public.marketplace_returns r where r.order_id=o.id),'[]'::jsonb),'events',coalesce((select jsonb_agg(jsonb_build_object('status',e.status,'created_at',e.created_at) order by e.created_at) from public.marketplace_order_events e where e.order_id=o.id),'[]'::jsonb)) order by o.created_at desc),'[]'::jsonb) from(select * from public.marketplace_orders where buyer_id=auth.uid() order by created_at desc limit 200)o
$$;

drop function public.marketplace_seller_orders();
create function public.marketplace_seller_orders() returns table(id uuid,order_number bigint,listing_id uuid,seller_id uuid,buyer_name text,email text,phone text,address text,amount numeric,status text,payment_status text,courier text,tracking_number text,created_at timestamptz,fulfillment_method text,payment_method text,shipping_fee numeric,product_snapshot jsonb,cancellation_reason text,managed_by_laptap boolean,device_amount numeric,buyer_service_fee numeric,handling_fee numeric,commission_amount numeric,commission_rate_bps integer,seller_net numeric,acceptance_hours integer,operations jsonb,payout jsonb) language sql stable security definer set search_path=public as $$
 select o.id,o.order_number,o.listing_id,o.seller_id,o.buyer_name,o.email,o.phone,o.address,o.amount,o.status,o.payment_status,o.courier,o.tracking_number,o.created_at,o.fulfillment_method,o.payment_method,o.shipping_fee,o.product_snapshot,o.cancellation_reason,o.managed_by_laptap,o.device_amount,o.buyer_service_fee,o.handling_fee,o.commission_amount,o.commission_rate_bps,o.seller_net,o.acceptance_hours,public.marketplace_order_operations_public(o.id),public.marketplace_settlement_public(o.id) from public.marketplace_orders o where o.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()) order by o.created_at desc
$$;

revoke execute on function public.marketplace_seller_orders() from public,anon;grant execute on function public.marketplace_seller_orders() to authenticated;
create function public.admin_marketplace_cancel_managed_order(_order_id uuid,_reason text) returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 if length(trim(coalesce(_reason,'')))<10 then raise exception 'Enter a cancellation reason of at least 10 characters';end if;
 perform id from public.marketplace_orders where id=_order_id for update;
 if exists(select 1 from public.marketplace_order_operations where order_id=_order_id and collected_at is not null) then raise exception 'Device already collected. Resolve through support before cancellation';end if;
 update public.marketplace_orders set status='cancelled',cancellation_reason=trim(_reason) where id=_order_id and managed_by_laptap and status in('pending','confirmed');
 if not found then raise exception 'Only unfulfilled managed orders can be cancelled';end if;
end $$;
revoke execute on function public.admin_marketplace_cancel_managed_order(uuid,text) from public,anon;grant execute on function public.admin_marketplace_cancel_managed_order(uuid,text) to authenticated;
create or replace function public.marketplace_seller_blockers(_seller_id uuid) returns jsonb language sql stable security definer set search_path=public as $$
 select jsonb_build_object('open_orders',(select count(*) from public.marketplace_orders o where o.seller_id=_seller_id and (o.status in('pending','confirmed','shipped','return_requested') or(o.status='cancelled' and o.payment_status='paid') or(o.status='delivered' and o.payment_status='unpaid') or exists(select 1 from public.marketplace_settlements s where s.order_id=o.id and s.status in('pending','processing','on_hold','recovery_due')))),'open_cases',(select count(*) from public.marketplace_returns r join public.marketplace_orders o on o.id=r.order_id where o.seller_id=_seller_id and r.status in('open','reviewing')))
$$;
