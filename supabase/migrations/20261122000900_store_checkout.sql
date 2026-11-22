-- Seller-defined fulfilment and authenticated, atomic COD / pickup checkout.
alter table public.marketplace_listings add column delivery_available boolean not null default false,add column pickup_available boolean not null default false,add column delivery_fee numeric not null default 0 check(delivery_fee between 0 and 10000),add column delivery_pincodes text[] not null default '{}',add column pickup_address text not null default '' check(length(pickup_address)<=1000),add column pickup_instructions text not null default '' check(length(pickup_instructions)<=1000),add constraint marketplace_pickup_address_required check(status<>'published' or not pickup_available or length(trim(pickup_address))>=10);
-- Existing listings stay enquiry-only until their seller chooses fulfilment options.
create table public.marketplace_checkouts(id uuid primary key,buyer_id uuid not null references auth.users(id),request_fingerprint text not null,created_at timestamptz not null default now());
create index marketplace_checkouts_buyer on public.marketplace_checkouts(buyer_id,created_at desc);
alter table public.marketplace_checkouts enable row level security;
revoke all on public.marketplace_checkouts from anon,authenticated;
alter table public.marketplace_orders add column buyer_id uuid references auth.users(id),add column checkout_id uuid references public.marketplace_checkouts(id),add column fulfillment_method text not null default 'delivery' check(fulfillment_method in ('delivery','pickup')),add column payment_method text not null default 'external' check(payment_method in ('external','cod','pay_at_pickup')),add column shipping_fee numeric not null default 0 check(shipping_fee between 0 and 10000),add column product_snapshot jsonb not null default '{}',add column cancellation_reason text not null default '' check(length(cancellation_reason)<=1000);
create index marketplace_orders_buyer on public.marketplace_orders(buyer_id,created_at desc) where buyer_id is not null;
create index marketplace_orders_checkout on public.marketplace_orders(checkout_id) where checkout_id is not null;
alter table public.marketplace_orders drop constraint shipped_requires_tracking;
alter table public.marketplace_orders add constraint shipped_requires_tracking check(fulfillment_method='pickup' or status not in ('shipped','delivered') or(length(trim(tracking_number))>=3 and length(trim(courier))>=2)),add constraint pickup_cannot_ship check(fulfillment_method<>'pickup' or status<>'shipped');
create table public.marketplace_order_events(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.marketplace_orders(id),status text not null,created_at timestamptz not null default now());
create index marketplace_order_events_order on public.marketplace_order_events(order_id,created_at);
alter table public.marketplace_order_events enable row level security;
revoke all on public.marketplace_order_events from anon,authenticated;
create function public.record_marketplace_order_event() returns trigger language plpgsql security definer set search_path=public as $$ begin if TG_OP='INSERT' or new.status is distinct from old.status then insert into public.marketplace_order_events(order_id,status) values(new.id,new.status);end if;return new;end $$;
create trigger record_marketplace_order_event after insert or update on public.marketplace_orders for each row execute function public.record_marketplace_order_event();
revoke execute on function public.record_marketplace_order_event() from public,anon,authenticated;

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
  if not admin and (new.payment_status<>'unpaid' or new.payment_reference<>'' or new.admin_notes<>'' or new.payment_method not in ('cod','pay_at_pickup') or new.amount<>device.price+case when new.fulfillment_method='delivery' then device.delivery_fee else 0 end) then raise exception 'Invalid checkout pricing or payment';end if;
 else
  if new.id<>old.id or new.listing_id<>old.listing_id or new.seller_id<>old.seller_id or new.order_number<>old.order_number or new.created_at<>old.created_at then raise exception 'Order identity cannot change';end if;
  if old.checkout_id is not null and (to_jsonb(new)-'status'-'payment_status'-'payment_reference'-'courier'-'tracking_number'-'admin_notes'-'cancellation_reason') is distinct from (to_jsonb(old)-'status'-'payment_status'-'payment_reference'-'courier'-'tracking_number'-'admin_notes'-'cancellation_reason') then raise exception 'Checkout details cannot change after placement';end if;
  if not admin then
   seller:=old.seller_id=auth.uid() and public.marketplace_seller_active(auth.uid());buyer:=old.buyer_id=auth.uid();
   if seller then
    if (to_jsonb(new)-'status'-'courier'-'tracking_number'-'cancellation_reason') is distinct from (to_jsonb(old)-'status'-'courier'-'tracking_number'-'cancellation_reason') then raise exception 'Sellers cannot change payment, customer, or internal order details';end if;
    if not((old.status='pending' and new.status in ('pending','confirmed','cancelled')) or(old.status='confirmed' and new.status in ('confirmed','cancelled','shipped','delivered')) or(old.status='shipped' and new.status in ('shipped','delivered'))) then raise exception 'Seller fulfilment transition is not permitted';end if;
   elsif buyer then
    if old.status<>'pending' or old.payment_status<>'unpaid' or new.status<>'cancelled' or(to_jsonb(new)-'status'-'cancellation_reason') is distinct from(to_jsonb(old)-'status'-'cancellation_reason') then raise exception 'Only unpaid, unconfirmed orders can be cancelled by their buyer';end if;
   else raise exception 'Only admins or the approved listing seller can manage this order';end if;
  end if;
  if new.status='cancelled' and new.status is distinct from old.status and old.checkout_id is not null and length(trim(new.cancellation_reason))<5 then raise exception 'Enter a cancellation reason';end if;
  if new.status<>old.status and not((old.status='pending' and new.status in ('confirmed','cancelled')) or(old.status='confirmed' and(new.status in ('shipped','cancelled') or(new.status='delivered' and old.fulfillment_method='pickup'))) or(old.status='shipped' and new.status in ('delivered','return_requested')) or(old.status='delivered' and new.status='return_requested') or(old.status='return_requested' and new.status in ('refunded','delivered'))) then raise exception 'Invalid order status transition';end if;
 end if;
 return new;
end $$;

create function public.marketplace_place_order(_checkout_id uuid,_items jsonb,_address jsonb,_expected_total numeric,_accept_terms boolean) returns jsonb language plpgsql security definer set search_path=public as $$
declare buyer uuid:=auth.uid();buyer_email text;canonical jsonb;fingerprint text;previous public.marketplace_checkouts;item jsonb;device public.marketplace_listings;method text;total numeric:=0;contact_name text;contact_phone text;delivery_address text;pincode text;placed uuid[]:='{}';order_id uuid;fee numeric;snapshot jsonb;
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
 -- Consistent lock order prevents two carts or seller deletion from racing stock reservation.
 perform s.id from public.marketplace_sellers s where s.id in(select p.seller_id from public.marketplace_listings p where p.id in(select(value->>'listing_id')::uuid from jsonb_array_elements(canonical))) order by s.id for share;
 perform p.id from public.marketplace_listings p where p.id in(select(value->>'listing_id')::uuid from jsonb_array_elements(canonical)) order by p.id for update;
 for item in select value from jsonb_array_elements(canonical) loop
  select * into device from public.marketplace_listings where id=(item->>'listing_id')::uuid;
  if device.id is null or device.status<>'published' or device.is_demo or not public.marketplace_seller_active(device.seller_id) then raise exception 'A device is no longer available. Review your cart';end if;
  if device.seller_id=buyer then raise exception 'You cannot purchase your own device';end if;
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

create function public.marketplace_buyer_orders() returns jsonb language sql stable security definer set search_path=public as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',o.id,'order_number',o.order_number,'checkout_id',o.checkout_id,'listing_id',o.listing_id,'amount',o.amount,'shipping_fee',o.shipping_fee,'status',o.status,'payment_status',o.payment_status,'payment_method',o.payment_method,'fulfillment_method',o.fulfillment_method,'buyer_name',o.buyer_name,'email',o.email,'phone',o.phone,'address',o.address,'courier',o.courier,'tracking_number',o.tracking_number,'cancellation_reason',o.cancellation_reason,'created_at',o.created_at,'product_snapshot',o.product_snapshot,'events',coalesce((select jsonb_agg(jsonb_build_object('status',e.status,'created_at',e.created_at) order by e.created_at) from public.marketplace_order_events e where e.order_id=o.id),'[]'::jsonb)) order by o.created_at desc),'[]'::jsonb) from(select * from public.marketplace_orders where buyer_id=auth.uid() order by created_at desc limit 200)o
$$;
create function public.marketplace_cancel_buyer_order(_order_id uuid,_reason text) returns void language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null or length(trim(coalesce(_reason,''))) not between 5 and 1000 then raise exception 'Enter a cancellation reason of at least 5 characters';end if;
 update public.marketplace_orders set status='cancelled',cancellation_reason=trim(_reason) where id=_order_id and buyer_id=auth.uid() and status='pending' and payment_status='unpaid';
 if not found then raise exception 'This order can no longer be cancelled here. Contact Laptap for help';end if;
end $$;
revoke execute on function public.marketplace_buyer_orders(),public.marketplace_cancel_buyer_order(uuid,text) from public,anon;
grant execute on function public.marketplace_buyer_orders(),public.marketplace_cancel_buyer_order(uuid,text) to authenticated;

-- Extend the safe seller projection, keeping payment references and admin notes private.
drop function public.marketplace_seller_orders();
create function public.marketplace_seller_orders() returns table(id uuid,order_number bigint,listing_id uuid,seller_id uuid,buyer_name text,email text,phone text,address text,amount numeric,status text,payment_status text,courier text,tracking_number text,created_at timestamptz,fulfillment_method text,payment_method text,shipping_fee numeric,product_snapshot jsonb,cancellation_reason text) language sql stable security definer set search_path=public as $$
 select o.id,o.order_number,o.listing_id,o.seller_id,o.buyer_name,o.email,o.phone,o.address,o.amount,o.status,o.payment_status,o.courier,o.tracking_number,o.created_at,o.fulfillment_method,o.payment_method,o.shipping_fee,o.product_snapshot,o.cancellation_reason from public.marketplace_orders o where o.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()) order by o.created_at desc
$$;
create function public.marketplace_seller_order_action(_order_id uuid,_status text,_courier text default '',_tracking text default '',_reason text default '') returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.marketplace_seller_active(auth.uid()) then raise exception 'An approved seller account is required';end if;
 if _status not in('confirmed','cancelled','shipped','delivered') then raise exception 'Invalid fulfilment action';end if;
 update public.marketplace_orders set status=_status,courier=left(trim(_courier),100),tracking_number=left(trim(_tracking),300),cancellation_reason=case when _status='cancelled' then left(trim(_reason),1000) else cancellation_reason end where id=_order_id and seller_id=auth.uid();
 if not found then raise exception 'Order not found for this seller';end if;
end $$;
revoke execute on function public.marketplace_seller_orders(),public.marketplace_seller_order_action(uuid,text,text,text,text) from public,anon;
grant execute on function public.marketplace_seller_orders(),public.marketplace_seller_order_action(uuid,text,text,text,text) to authenticated;
