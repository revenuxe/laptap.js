-- Seller applications, approval-gated publishing, and private seller operations.
alter table public.marketplace_sellers drop constraint marketplace_sellers_status_check;
alter table public.marketplace_sellers drop constraint suspension_requires_reason;
alter table public.marketplace_sellers alter column status set default 'pending';
alter table public.marketplace_sellers add constraint marketplace_sellers_status_check check(status in ('pending','active','rejected','suspended'));
alter table public.marketplace_sellers add constraint seller_review_requires_reason check(status not in ('rejected','suspended') or length(trim(moderation_note))>=10);
alter table public.marketplace_sellers
 add column full_name text not null default '' check(length(full_name)<=100),
 add column business_address text not null default '' check(length(business_address)<=2000),
 add column about text not null default '' check(length(about)<=2000),
 add column tax_id text not null default '' check(length(tax_id)<=20),
 add column approved_at timestamptz,
 add column approved_by uuid references auth.users(id);
update public.marketplace_sellers s set full_name=coalesce(u.raw_user_meta_data->>'full_name',''), approved_at=case when s.status='active' then s.created_at else null end from auth.users u where u.id=s.id;
create index marketplace_seller_review_queue on public.marketplace_sellers(status,created_at desc);

create function public.guard_marketplace_seller_profile() returns trigger language plpgsql set search_path=public as $$
declare admin boolean:=public.has_role(auth.uid(),'admin'); trusted_database_role boolean:=current_user in ('postgres','supabase_admin','supabase_auth_admin');
begin
 if TG_OP='UPDATE' and (new.id is distinct from old.id or new.created_at is distinct from old.created_at) then raise exception 'Seller identity cannot change'; end if;
 if TG_OP='INSERT' and not admin and not trusted_database_role then
  if new.id is distinct from auth.uid() or new.status<>'pending' or new.approved_at is not null or new.approved_by is not null or new.moderation_note<>'' then raise exception 'Seller applications must start pending'; end if;
 end if;
 if TG_OP='UPDATE' and not admin and not trusted_database_role then
  if old.id is distinct from auth.uid() then raise exception 'Only the seller or an admin can edit this profile'; end if;
  if old.status='suspended' then raise exception 'This seller account is suspended. Contact Laptap for help.'; end if;
  if new.email is distinct from old.email or new.approved_at is distinct from old.approved_at or new.approved_by is distinct from old.approved_by then raise exception 'Account and approval details are managed by Laptap'; end if;
  if new.status is distinct from old.status and not(old.status='rejected' and new.status='pending') then raise exception 'Only admins can approve or suspend sellers'; end if;
  if new.moderation_note is distinct from old.moderation_note then raise exception 'Review notes are managed by Laptap'; end if;
  if old.status='rejected' and new.status='pending' then new.moderation_note:=''; new.approved_at:=null; new.approved_by:=null; end if;
  if old.status='active' and (new.shop_name is distinct from old.shop_name or new.business_address is distinct from old.business_address or new.tax_id is distinct from old.tax_id) then
   new.status:='pending';new.approved_at:=null;new.approved_by:=null;new.moderation_note:='';
  end if;
 end if;
 if new.status='pending' and (length(trim(new.full_name))<2 or length(trim(new.shop_name))<3 or length(trim(new.phone))<7 or length(trim(new.city))<2 or length(trim(new.business_address))<10) then raise exception 'Complete your name, shop, phone, city, and business address before submitting'; end if;
 if admin and new.status='active' and (TG_OP='INSERT' or old.status is distinct from 'active') then
  if length(trim(new.full_name))<2 or length(trim(new.phone))<7 or length(trim(new.city))<2 or length(trim(new.business_address))<10 then raise exception 'A complete seller application is required before approval'; end if;
  new.approved_at:=now();new.approved_by:=auth.uid();new.moderation_note:='';
 end if;
 return new;
end $$;
create trigger marketplace_seller_profile_guard before insert or update on public.marketplace_sellers for each row execute function public.guard_marketplace_seller_profile();
create policy "Users submit own pending seller application" on public.marketplace_sellers for insert to authenticated with check(id=auth.uid() and status='pending' and approved_at is null and approved_by is null and moderation_note='');
create policy "Sellers update own business profile" on public.marketplace_sellers for update to authenticated using(id=auth.uid()) with check(id=auth.uid());

-- New signups can apply without a session when email confirmation is required.
create function public.capture_marketplace_seller_application() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.raw_user_meta_data->>'seller_application'='true' then
  insert into public.marketplace_sellers(id,shop_name,email,phone,city,full_name,business_address,about,tax_id,status)
  values(new.id,left(trim(coalesce(new.raw_user_meta_data->>'shop_name','')),100),coalesce(new.email,''),left(trim(coalesce(new.raw_user_meta_data->>'phone','')),25),left(trim(coalesce(new.raw_user_meta_data->>'city','')),100),left(trim(coalesce(new.raw_user_meta_data->>'full_name','')),100),left(trim(coalesce(new.raw_user_meta_data->>'business_address','')),2000),left(trim(coalesce(new.raw_user_meta_data->>'about','')),2000),left(trim(coalesce(new.raw_user_meta_data->>'tax_id','')),20),'pending') on conflict(id) do nothing;
 end if;
 return new;
end $$;
create trigger capture_marketplace_seller_application after insert on auth.users for each row execute function public.capture_marketplace_seller_application();

create or replace function public.register_marketplace_seller() returns trigger language plpgsql security definer set search_path=public as $$
declare seller public.marketplace_sellers;
begin
 select * into seller from public.marketplace_sellers where id=new.seller_id;
 if seller.id is null then raise exception 'Register a seller account before adding products'; end if;
 if not public.has_role(auth.uid(),'admin') then
  if seller.status not in ('pending','active') then raise exception 'Your seller account is %; contact Laptap or review your application',seller.status; end if;
  if seller.status='pending' and new.status<>'draft' then raise exception 'Admin approval is required before publishing products'; end if;
  new.seller_name:=seller.shop_name;new.location:=seller.city;
 end if;
 return new;
end $$;
create function public.sync_approved_marketplace_shop() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='active' then
  update public.marketplace_listings set seller_name=new.shop_name,location=new.city where seller_id=new.id and (seller_name is distinct from new.shop_name or location is distinct from new.city);
 end if;
 return new;
end $$;
create trigger sync_approved_marketplace_shop after update of shop_name,city,status on public.marketplace_sellers for each row execute function public.sync_approved_marketplace_shop();

create function public.marketplace_can_upload() returns boolean language sql stable set search_path=public as $$ select public.has_role(auth.uid(),'admin') or exists(select 1 from public.marketplace_sellers where id=auth.uid() and status in ('pending','active')) $$;
drop policy "Seller uploads own photos" on storage.objects;
create policy "Seller uploads own photos" on storage.objects for insert to authenticated with check(bucket_id='marketplace-images' and (storage.foldername(name))[1]=auth.uid()::text and public.marketplace_can_upload());

alter table public.marketplace_inquiries add column seller_notes text not null default '' check(length(seller_notes)<=3000);
grant update(status,seller_notes) on public.marketplace_inquiries to authenticated;
create policy "Approved sellers follow up own enquiries" on public.marketplace_inquiries for update to authenticated using(exists(select 1 from public.marketplace_listings p where p.id=listing_id and p.seller_id=auth.uid()) and public.marketplace_seller_active(auth.uid())) with check(exists(select 1 from public.marketplace_listings p where p.id=listing_id and p.seller_id=auth.uid()) and public.marketplace_seller_active(auth.uid()));
create function public.guard_seller_enquiry_update() returns trigger language plpgsql set search_path=public as $$
begin
 if not public.has_role(auth.uid(),'admin') and ((to_jsonb(new)-'status'-'seller_notes') is distinct from (to_jsonb(old)-'status'-'seller_notes')) then raise exception 'Sellers may only update follow-up status and their own notes'; end if;
 return new;
end $$;
create trigger guard_seller_enquiry_update before update on public.marketplace_inquiries for each row execute function public.guard_seller_enquiry_update();
drop policy "Buyers enquire about available devices" on public.marketplace_inquiries;
create policy "Buyers enquire about available devices" on public.marketplace_inquiries for insert to anon,authenticated with check(status='new' and admin_notes='' and seller_notes='' and exists(select 1 from public.marketplace_listings p where p.id=listing_id and p.status='published' and public.marketplace_seller_active(p.seller_id)));

-- Sellers get their own fulfilment data, never private admin notes or payment references.
create function public.marketplace_seller_orders() returns table(id uuid,order_number bigint,listing_id uuid,seller_id uuid,buyer_name text,email text,phone text,address text,amount numeric,status text,payment_status text,courier text,tracking_number text,created_at timestamptz) language sql stable security definer set search_path=public as $$
 select o.id,o.order_number,o.listing_id,o.seller_id,o.buyer_name,o.email,o.phone,o.address,o.amount,o.status,o.payment_status,o.courier,o.tracking_number,o.created_at from public.marketplace_orders o where o.seller_id=auth.uid() order by o.created_at desc
$$;
create or replace function public.guard_marketplace_order() returns trigger language plpgsql set search_path=public as $$
declare device public.marketplace_listings;
begin
 if not public.has_role(auth.uid(),'admin') then
  if TG_OP<>'UPDATE' or old.seller_id is distinct from auth.uid() or not public.marketplace_seller_active(auth.uid()) then raise exception 'Only admins or the approved listing seller can manage this order'; end if;
  if (to_jsonb(new)-'status'-'courier'-'tracking_number') is distinct from (to_jsonb(old)-'status'-'courier'-'tracking_number') then raise exception 'Sellers cannot change payment, customer, or internal order details'; end if;
  if not((old.status='confirmed' and new.status in ('confirmed','shipped')) or (old.status='shipped' and new.status in ('shipped','delivered'))) then raise exception 'Seller fulfilment transition is not permitted'; end if;
  return new;
 end if;
 if TG_OP='INSERT' then
  select * into device from public.marketplace_listings where id=new.listing_id for update;
  if device.id is null or device.status<>'published' or not public.marketplace_seller_active(device.seller_id) then raise exception 'Device is not available for an order'; end if;
  if new.seller_id<>device.seller_id then raise exception 'Seller must match the listing'; end if;
  if new.status<>'pending' then raise exception 'New orders must begin as pending'; end if;
 elsif TG_OP='UPDATE' then
  if new.id<>old.id or new.listing_id<>old.listing_id or new.seller_id<>old.seller_id or new.order_number<>old.order_number or new.created_at<>old.created_at then raise exception 'Order identity cannot change'; end if;
  if new.status<>old.status and not((old.status='pending' and new.status in ('confirmed','cancelled')) or (old.status='confirmed' and new.status in ('shipped','cancelled')) or (old.status='shipped' and new.status in ('delivered','return_requested')) or (old.status='delivered' and new.status='return_requested') or (old.status='return_requested' and new.status in ('refunded','delivered'))) then raise exception 'Invalid order status transition'; end if;
 end if;
 return new;
end $$;
create function public.marketplace_seller_fulfil(_order_id uuid,_status text,_courier text,_tracking text) returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.marketplace_seller_active(auth.uid()) then raise exception 'An approved seller account is required'; end if;
 if _status not in ('confirmed','shipped','delivered') then raise exception 'Invalid seller fulfilment status'; end if;
 update public.marketplace_orders set status=_status,courier=left(trim(_courier),100),tracking_number=left(trim(_tracking),300) where id=_order_id and seller_id=auth.uid();
 if not found then raise exception 'Order not found for this seller'; end if;
end $$;
revoke execute on function public.guard_marketplace_seller_profile(),public.capture_marketplace_seller_application(),public.sync_approved_marketplace_shop(),public.guard_seller_enquiry_update() from public,anon,authenticated;
revoke execute on function public.marketplace_seller_orders(),public.marketplace_seller_fulfil(uuid,text,text,text),public.marketplace_can_upload() from public,anon;
grant execute on function public.marketplace_seller_orders(),public.marketplace_seller_fulfil(uuid,text,text,text),public.marketplace_can_upload() to authenticated;
create function public.marketplace_seller_inquiries() returns setof public.marketplace_inquiries language sql stable security definer set search_path=public as $$
 select q.* from public.marketplace_inquiries q join public.marketplace_listings p on p.id=q.listing_id where p.seller_id=auth.uid() order by q.created_at desc
$$;
revoke execute on function public.marketplace_seller_inquiries() from public,anon;
grant execute on function public.marketplace_seller_inquiries() to authenticated;

create index marketplace_seller_approver_idx on public.marketplace_sellers(approved_by) where approved_by is not null;
