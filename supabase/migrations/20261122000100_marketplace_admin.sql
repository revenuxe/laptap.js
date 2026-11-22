-- Admin operations for the marketplace. Apply after 20261122000000_marketplace.sql.
-- PostgreSQL indexes and tables share a relation namespace.
alter index public.marketplace_sellers rename to marketplace_listings_seller_id_idx;
create table public.marketplace_sellers (
 id uuid primary key references auth.users(id), shop_name text not null check(length(trim(shop_name)) between 1 and 100),
 email text not null default '', phone text not null default '', city text not null default '',
 status text not null default 'active' check(status in ('active','suspended')),
 moderation_note text not null default '' check(length(moderation_note)<=2000), created_at timestamptz not null default now(),
 constraint suspension_requires_reason check(status='active' or length(trim(moderation_note))>=10)
);
alter table public.marketplace_sellers enable row level security;
create policy "Admins manage marketplace sellers" on public.marketplace_sellers for all to authenticated using(public.has_role(auth.uid(),'admin')) with check(public.has_role(auth.uid(),'admin'));
create policy "Sellers read own marketplace profile" on public.marketplace_sellers for select to authenticated using(id=auth.uid());
grant select,insert,update on public.marketplace_sellers to authenticated;
insert into public.marketplace_sellers(id,shop_name,email,city)
 select distinct on (p.seller_id) p.seller_id,p.seller_name,coalesce(u.email,''),p.location from public.marketplace_listings p join auth.users u on u.id=p.seller_id order by p.seller_id,p.created_at desc;
create function public.marketplace_seller_active(seller uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.marketplace_sellers where id=seller and status='active') $$;
create function public.register_marketplace_seller() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.marketplace_sellers(id,shop_name,email,city) select new.seller_id,new.seller_name,coalesce(email,''),new.location from auth.users where id=new.seller_id on conflict(id) do nothing;
 if not public.marketplace_seller_active(new.seller_id) and not public.has_role(auth.uid(),'admin') then raise exception 'Your seller account is suspended. Contact Laptap for help.'; end if;
 return new;
end $$;
create trigger register_marketplace_seller before insert or update on public.marketplace_listings for each row execute function public.register_marketplace_seller();
drop policy "Public sees available devices; sellers and admins see own inventory" on public.marketplace_listings;
create policy "Available devices from active sellers or private inventory" on public.marketplace_listings for select using((status='published' and public.marketplace_seller_active(seller_id)) or seller_id=auth.uid() or public.has_role(auth.uid(),'admin'));
alter table public.marketplace_inquiries add column status text not null default 'new' check(status in ('new','contacted','closed')), add column admin_notes text not null default '' check(length(admin_notes)<=3000);
grant update(status,admin_notes) on public.marketplace_inquiries to authenticated;
create policy "Admins manage buyer enquiries" on public.marketplace_inquiries for update to authenticated using(public.has_role(auth.uid(),'admin')) with check(public.has_role(auth.uid(),'admin'));
-- Buyers cannot inject moderation fields when creating an enquiry.
drop policy "Buyers enquire about available devices" on public.marketplace_inquiries;
create policy "Buyers enquire about available devices" on public.marketplace_inquiries for insert to anon,authenticated with check(status='new' and admin_notes='' and exists(select 1 from public.marketplace_listings p where p.id=listing_id and p.status='published' and public.marketplace_seller_active(p.seller_id)));
create table public.marketplace_orders (
 id uuid primary key default gen_random_uuid(), order_number bigint generated always as identity unique,
 listing_id uuid not null references public.marketplace_listings(id), seller_id uuid not null references public.marketplace_sellers(id),
 buyer_name text not null check(length(trim(buyer_name)) between 1 and 100),
 email text not null check(length(email)<=200 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text not null check(length(phone) between 7 and 25), address text not null check(length(trim(address)) between 10 and 2000),
 amount numeric not null check(amount>0 and amount<=3000000),
 status text not null default 'pending' check(status in ('pending','confirmed','shipped','delivered','cancelled','return_requested','refunded')),
 payment_status text not null default 'unpaid' check(payment_status in ('unpaid','paid','refunded')),
 payment_reference text not null default '' check(length(payment_reference)<=300), tracking_number text not null default '' check(length(tracking_number)<=300), courier text not null default '' check(length(courier)<=100),
 admin_notes text not null default '' check(length(admin_notes)<=3000), created_at timestamptz not null default now(),
 constraint recorded_payment_requires_reference check(payment_status='unpaid' or length(trim(payment_reference))>=3),
 constraint shipped_requires_tracking check(status not in ('shipped','delivered') or (length(trim(tracking_number))>=3 and length(trim(courier))>=2)),
 constraint refunded_requires_record check(status<>'refunded' or payment_status='refunded')
);
create unique index one_active_order_per_device on public.marketplace_orders(listing_id) where status<>'cancelled';
create index marketplace_orders_created on public.marketplace_orders(created_at desc);
alter table public.marketplace_orders enable row level security;
create policy "Admins manage store orders" on public.marketplace_orders for all to authenticated using(public.has_role(auth.uid(),'admin')) with check(public.has_role(auth.uid(),'admin'));
-- Order contact details and internal notes remain admin-only.
grant select,insert,update on public.marketplace_orders to authenticated;
grant usage,select on sequence public.marketplace_orders_order_number_seq to authenticated;
create function public.guard_marketplace_order() returns trigger language plpgsql set search_path=public as $$
declare device public.marketplace_listings;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Only admins can manage store orders'; end if;
 if TG_OP='INSERT' then
  select * into device from public.marketplace_listings where id=new.listing_id for update;
  if device.id is null or device.status<>'published' or not public.marketplace_seller_active(device.seller_id) then raise exception 'Device is not available for an order'; end if;
  if new.seller_id<>device.seller_id then raise exception 'Seller must match the listing'; end if;
  if new.status<>'pending' then raise exception 'New orders must begin as pending'; end if;
 elsif TG_OP='UPDATE' then
  if new.id<>old.id or new.listing_id<>old.listing_id or new.seller_id<>old.seller_id or new.order_number<>old.order_number or new.created_at<>old.created_at then raise exception 'Order identity cannot change'; end if;
  if new.status<>old.status and not (
   (old.status='pending' and new.status in ('confirmed','cancelled')) or
   (old.status='confirmed' and new.status in ('shipped','cancelled')) or
   (old.status='shipped' and new.status in ('delivered','return_requested')) or
   (old.status='delivered' and new.status='return_requested') or
   (old.status='return_requested' and new.status in ('refunded','delivered'))
  ) then raise exception 'Invalid order status transition'; end if;
 end if;
 return new;
end $$;
create trigger marketplace_order_guard before insert or update on public.marketplace_orders for each row execute function public.guard_marketplace_order();
-- Reserving a single-device listing and creating its order happen in one transaction.
create function public.reserve_marketplace_order_device() returns trigger language plpgsql set search_path=public as $$
begin
 if TG_OP='INSERT' then update public.marketplace_listings set status='sold' where id=new.listing_id; end if;
 -- Cancellation does not automatically relist a device; admins must inspect availability first.
 return new;
end $$;
create trigger marketplace_order_reservation after insert on public.marketplace_orders for each row execute function public.reserve_marketplace_order_device();
create table public.marketplace_returns (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.marketplace_orders(id),
 reason text not null check(length(trim(reason)) between 10 and 3000), status text not null default 'open' check(status in ('open','reviewing','resolved','declined')),
 resolution text not null default '' check(length(resolution)<=3000), created_at timestamptz not null default now(),
 constraint resolved_case_requires_notes check(status in ('open','reviewing') or length(trim(resolution))>=10)
);
alter table public.marketplace_returns enable row level security;
create policy "Admins manage returns and support" on public.marketplace_returns for all to authenticated using(public.has_role(auth.uid(),'admin')) with check(public.has_role(auth.uid(),'admin'));
grant select,insert,update on public.marketplace_returns to authenticated;
create table public.marketplace_activity (
 id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), entity_type text not null, entity_id uuid not null,
 action text not null, created_at timestamptz not null default now()
);
alter table public.marketplace_activity enable row level security;
create policy "Admins read marketplace activity" on public.marketplace_activity for select to authenticated using(public.has_role(auth.uid(),'admin'));
grant select on public.marketplace_activity to authenticated;
create function public.log_marketplace_activity() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action) values(auth.uid(),replace(TG_TABLE_NAME,'marketplace_',''),new.id,case when TG_OP='INSERT' then 'Created' when TG_TABLE_NAME='marketplace_listings' and (to_jsonb(new)->>'verified_at') is distinct from (to_jsonb(old)->>'verified_at') then 'Verification changed' else 'Updated' end);
 return new;
end $$;
-- Keep audit records minimal: buyer contact details and private notes are not copied.
create trigger audit_marketplace_listings after insert or update on public.marketplace_listings for each row execute function public.log_marketplace_activity();
create trigger audit_marketplace_sellers after insert or update on public.marketplace_sellers for each row execute function public.log_marketplace_activity();
create trigger audit_marketplace_orders after insert or update on public.marketplace_orders for each row execute function public.log_marketplace_activity();
create trigger audit_marketplace_returns after insert or update on public.marketplace_returns for each row execute function public.log_marketplace_activity();
create trigger audit_marketplace_inquiries after update on public.marketplace_inquiries for each row execute function public.log_marketplace_activity();
create function public.guard_marketplace_listing_reservation() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='published' and exists(select 1 from public.marketplace_orders where listing_id=new.id and status<>'cancelled') then raise exception 'This device has an active order and cannot be republished'; end if;
 return new;
end $$;
create trigger marketplace_listing_reservation_guard before update on public.marketplace_listings for each row execute function public.guard_marketplace_listing_reservation();
-- A suspended seller may be reviewed by admins, but new orders cannot start in a refunded state.
create function public.guard_marketplace_order_initial_payment() returns trigger language plpgsql set search_path=public as $$
begin
 if new.payment_status='refunded' then raise exception 'A new order cannot start with a refund'; end if;
 return new;
end $$;
create trigger marketplace_order_initial_payment_guard before insert on public.marketplace_orders for each row execute function public.guard_marketplace_order_initial_payment();
revoke delete on public.marketplace_orders, public.marketplace_returns, public.marketplace_sellers, public.marketplace_activity from anon,authenticated;
-- Availability updates do not invalidate the physical device inspection.
create or replace function public.guard_marketplace_verification() returns trigger language plpgsql set search_path=public as $$
begin
 if TG_OP='UPDATE' then
  if new.seller_id is distinct from old.seller_id or new.id is distinct from old.id or new.created_at is distinct from old.created_at then raise exception 'Listing ownership and identity cannot change'; end if;
  if (new.verified_at is distinct from old.verified_at or new.verification_notes is distinct from old.verification_notes) and not public.has_role(auth.uid(),'admin') then raise exception 'Only admins can change verification'; end if;
  if (to_jsonb(new) - 'verified_at' - 'verification_notes' - 'status') is distinct from (to_jsonb(old) - 'verified_at' - 'verification_notes' - 'status') then
   new.verified_at := null; new.verification_notes := '';
  end if;
 end if;
 if new.verified_at is not null and length(trim(new.verification_notes)) < 20 then raise exception 'An inspection record is required'; end if;
 return new;
end $$;
