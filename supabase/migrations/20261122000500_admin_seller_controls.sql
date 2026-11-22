-- Marketplace account closure with history-preserving deletion and admin review.
alter table public.marketplace_sellers drop constraint marketplace_sellers_status_check;
alter table public.marketplace_sellers add constraint marketplace_sellers_status_check check(status in ('pending','active','rejected','suspended','deleted'));
alter table public.marketplace_sellers add column deleted_at timestamptz, add column deleted_by uuid references auth.users(id), add column deletion_reason text not null default '' check(length(deletion_reason)<=2000);
alter table public.marketplace_sellers add constraint seller_deletion_record check((status='deleted' and deleted_at is not null and deleted_by is not null and length(trim(deletion_reason))>=10) or (status<>'deleted' and deleted_at is null and deleted_by is null and deletion_reason=''));
alter table public.marketplace_activity add column details jsonb not null default '{}';
create index marketplace_seller_deletion_actor_idx on public.marketplace_sellers(deleted_by) where deleted_by is not null;

create function public.marketplace_seller_blockers(_seller_id uuid) returns jsonb language sql stable security definer set search_path=public as $$
 select jsonb_build_object('open_orders',(select count(*) from public.marketplace_orders where seller_id=_seller_id and (status in ('pending','confirmed','shipped','return_requested') or (status='cancelled' and payment_status='paid') or (status='delivered' and payment_status='unpaid'))),'open_cases',(select count(*) from public.marketplace_returns r join public.marketplace_orders o on o.id=r.order_id where o.seller_id=_seller_id and r.status in ('open','reviewing')))
$$;
create function public.guard_marketplace_seller_lifecycle() returns trigger language plpgsql security definer set search_path=public as $$
declare blockers jsonb; admin boolean:=public.has_role(auth.uid(),'admin');
begin
 if TG_OP='INSERT' then
  if new.status='deleted' or new.deleted_at is not null or new.deleted_by is not null or new.deletion_reason<>'' then raise exception 'New seller accounts cannot start deleted'; end if;
  return new;
 end if;
 if not admin and (new.deleted_at is distinct from old.deleted_at or new.deleted_by is distinct from old.deleted_by or new.deletion_reason is distinct from old.deletion_reason or new.status='deleted' or old.status='deleted') then raise exception 'Seller deletion and restoration are admin-only'; end if;
 if old.status='deleted' then
  if not admin or new.status not in ('pending','rejected') then raise exception 'Deleted seller accounts are read-only. Restore to review before approving.'; end if;
  new.deleted_at:=null;new.deleted_by:=null;new.deletion_reason:='';new.approved_at:=null;new.approved_by:=null;
 elsif new.status='deleted' then
  if not admin then raise exception 'Seller deletion is admin-only'; end if;
  if new.id=auth.uid() or public.has_role(new.id,'admin') then raise exception 'Administrator accounts are protected from seller deletion'; end if;
  if length(trim(new.deletion_reason))<10 then raise exception 'A deletion reason of at least 10 characters is required'; end if;
  blockers:=public.marketplace_seller_blockers(new.id);
  if (blockers->>'open_orders')::integer>0 then raise exception 'Resolve open orders and outstanding payment records before deleting this seller'; end if;
  if (blockers->>'open_cases')::integer>0 then raise exception 'Resolve open support cases before deleting this seller'; end if;
  new.deleted_at:=now();new.deleted_by:=auth.uid();new.moderation_note:=new.deletion_reason;
 end if;
 if new.status='suspended' and old.status<>'suspended' and (new.id=auth.uid() or public.has_role(new.id,'admin')) then raise exception 'Administrator accounts are protected from seller suspension'; end if;
 return new;
end $$;
create trigger marketplace_seller_lifecycle_guard before insert or update on public.marketplace_sellers for each row execute function public.guard_marketplace_seller_lifecycle();
create function public.hide_deleted_marketplace_inventory() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='deleted' and old.status is distinct from 'deleted' then update public.marketplace_listings set status='draft' where seller_id=new.id and status='published'; end if;
 return new;
end $$;
create trigger hide_deleted_marketplace_inventory after update of status on public.marketplace_sellers for each row execute function public.hide_deleted_marketplace_inventory();
create function public.guard_deleted_marketplace_inventory() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if exists(select 1 from public.marketplace_sellers where id=new.seller_id and status='deleted') and (TG_OP='INSERT' or new.status='published') then raise exception 'Restore this seller account before adding or publishing products'; end if;
 return new;
end $$;
create trigger guard_deleted_marketplace_inventory before insert or update on public.marketplace_listings for each row execute function public.guard_deleted_marketplace_inventory();
create function public.marketplace_seller_has_access(_seller_id uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.marketplace_sellers where id=_seller_id and status<>'deleted') $$;
drop policy "Available devices from active sellers or private inventory" on public.marketplace_listings;
create policy "Available devices or authorised private inventory" on public.marketplace_listings for select using((status='published' and public.marketplace_seller_active(seller_id)) or (seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())) or public.has_role(auth.uid(),'admin'));
create or replace function public.marketplace_seller_orders() returns table(id uuid,order_number bigint,listing_id uuid,seller_id uuid,buyer_name text,email text,phone text,address text,amount numeric,status text,payment_status text,courier text,tracking_number text,created_at timestamptz) language sql stable security definer set search_path=public as $$
 select o.id,o.order_number,o.listing_id,o.seller_id,o.buyer_name,o.email,o.phone,o.address,o.amount,o.status,o.payment_status,o.courier,o.tracking_number,o.created_at from public.marketplace_orders o where o.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()) order by o.created_at desc
$$;
create or replace function public.marketplace_seller_inquiries() returns setof public.marketplace_inquiries language sql stable security definer set search_path=public as $$
 select q.* from public.marketplace_inquiries q join public.marketplace_listings p on p.id=q.listing_id where p.seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()) order by q.created_at desc
$$;
drop policy "Seller removes own photos" on storage.objects;
create policy "Seller removes own photos" on storage.objects for delete to authenticated using(bucket_id='marketplace-images' and (storage.foldername(name))[1]=auth.uid()::text and public.marketplace_can_upload());

create table public.marketplace_seller_admin_notes(id uuid primary key default gen_random_uuid(),seller_id uuid not null references public.marketplace_sellers(id),body text not null check(length(trim(body)) between 3 and 4000),created_by uuid not null default auth.uid() references auth.users(id),created_at timestamptz not null default now());
create index marketplace_seller_admin_notes_lookup on public.marketplace_seller_admin_notes(seller_id,created_at desc);
alter table public.marketplace_seller_admin_notes enable row level security;
create policy "Admins read private seller notes" on public.marketplace_seller_admin_notes for select to authenticated using(public.has_role(auth.uid(),'admin'));
create policy "Admins add private seller notes" on public.marketplace_seller_admin_notes for insert to authenticated with check(public.has_role(auth.uid(),'admin') and created_by=auth.uid());
grant select,insert on public.marketplace_seller_admin_notes to authenticated;
revoke update,delete on public.marketplace_seller_admin_notes from anon,authenticated;

create or replace function public.log_marketplace_activity() returns trigger language plpgsql security definer set search_path=public as $$
declare change_details jsonb:='{}'; event_name text; entity text:=replace(TG_TABLE_NAME,'marketplace_',''); event_entity_id uuid:=new.id;
begin
 event_name:=case when TG_OP='INSERT' then 'Created' else 'Updated' end;
 if TG_OP='UPDATE' and TG_TABLE_NAME='marketplace_sellers' and (to_jsonb(new)->>'status') is distinct from (to_jsonb(old)->>'status') then
  event_name:=case to_jsonb(new)->>'status' when 'deleted' then 'Seller deleted' when 'suspended' then 'Seller suspended' when 'active' then 'Seller approved' when 'rejected' then 'Seller rejected' else case when to_jsonb(old)->>'status'='deleted' then 'Seller restored' else 'Seller submitted for review' end end;
  change_details:=jsonb_build_object('previous_status',to_jsonb(old)->>'status','status',to_jsonb(new)->>'status','reason',case when to_jsonb(new)->>'status'='deleted' then to_jsonb(new)->>'deletion_reason' else to_jsonb(new)->>'moderation_note' end);
 elsif TG_OP='UPDATE' and TG_TABLE_NAME='marketplace_listings' and (to_jsonb(new)->>'verified_at') is distinct from (to_jsonb(old)->>'verified_at') then event_name:='Verification changed';
 elsif TG_TABLE_NAME='marketplace_seller_admin_notes' then entity:='sellers';event_entity_id:=(to_jsonb(new)->>'seller_id')::uuid;event_name:='Internal note added';change_details:=jsonb_build_object('note_id',new.id);
 end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),entity,event_entity_id,event_name,change_details);
 return new;
end $$;
create trigger audit_marketplace_seller_admin_notes after insert on public.marketplace_seller_admin_notes for each row execute function public.log_marketplace_activity();

create function public.admin_marketplace_seller_preview(_seller_id uuid) returns jsonb language plpgsql stable security definer set search_path=public as $$
declare seller public.marketplace_sellers; blockers jsonb; protected boolean;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required'; end if;
 select * into seller from public.marketplace_sellers where id=_seller_id;
 if seller.id is null then raise exception 'Seller not found'; end if;
 blockers:=public.marketplace_seller_blockers(_seller_id);protected:=_seller_id=auth.uid() or public.has_role(_seller_id,'admin');
 return blockers||jsonb_build_object('seller_id',seller.id,'shop_name',seller.shop_name,'status',seller.status,'total_products',(select count(*) from public.marketplace_listings where seller_id=_seller_id),'published_products',(select count(*) from public.marketplace_listings where seller_id=_seller_id and status='published'),'total_orders',(select count(*) from public.marketplace_orders where seller_id=_seller_id),'protected_account',protected,'can_delete',not protected and seller.status<>'deleted' and (blockers->>'open_orders')::integer=0 and (blockers->>'open_cases')::integer=0);
end $$;
create function public.admin_marketplace_seller_action(_seller_id uuid,_action text,_reason text,_confirmation text default '') returns jsonb language plpgsql security definer set search_path=public as $$
declare seller public.marketplace_sellers; target_status text;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required'; end if;
 if length(trim(coalesce(_reason,'')))<10 or length(_reason)>2000 then raise exception 'Enter an action reason between 10 and 2000 characters'; end if;
 select * into seller from public.marketplace_sellers where id=_seller_id for update;
 if seller.id is null then raise exception 'Seller not found'; end if;
 if _action in ('delete','suspend') and (_seller_id=auth.uid() or public.has_role(_seller_id,'admin')) then raise exception 'Administrator accounts are protected'; end if;
 if _action='delete' then
  if seller.status='deleted' then raise exception 'Seller account is already deleted'; end if;
  if trim(coalesce(_confirmation,''))<>seller.shop_name then raise exception 'Type the exact shop name to confirm deletion'; end if;
  update public.marketplace_sellers set status='deleted',deletion_reason=trim(_reason) where id=_seller_id;
 elsif _action='suspend' then
  if seller.status in ('deleted','suspended') then raise exception 'Only non-deleted, non-suspended sellers can be suspended'; end if;
  update public.marketplace_sellers set status='suspended',moderation_note=trim(_reason) where id=_seller_id;
 elsif _action='reactivate' then
  if seller.status<>'suspended' then raise exception 'Only suspended sellers can be reactivated'; end if;
  update public.marketplace_sellers set status='active' where id=_seller_id;
 elsif _action='restore' then
  if seller.status<>'deleted' then raise exception 'Only deleted sellers can be restored'; end if;
  target_status:=case when length(trim(seller.full_name))>=2 and length(trim(seller.shop_name))>=3 and length(trim(seller.phone))>=7 and length(trim(seller.city))>=2 and length(trim(seller.business_address))>=10 then 'pending' else 'rejected' end;
  update public.marketplace_sellers set status=target_status,moderation_note='Account restored for review. '||trim(_reason) where id=_seller_id;
 else raise exception 'Unknown seller action'; end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'sellers',_seller_id,'Admin seller action',jsonb_build_object('action',_action,'reason',trim(_reason)));
 return public.admin_marketplace_seller_preview(_seller_id);
end $$;
revoke execute on function public.marketplace_seller_blockers(uuid),public.guard_marketplace_seller_lifecycle(),public.hide_deleted_marketplace_inventory(),public.guard_deleted_marketplace_inventory() from public,anon,authenticated;
revoke execute on function public.admin_marketplace_seller_preview(uuid),public.admin_marketplace_seller_action(uuid,text,text,text) from public,anon;
grant execute on function public.admin_marketplace_seller_preview(uuid),public.admin_marketplace_seller_action(uuid,text,text,text) to authenticated;
grant execute on function public.marketplace_seller_has_access(uuid) to anon,authenticated;

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
  -- Serialize new orders against seller deletion and suspension.
  perform id from public.marketplace_sellers where id=new.seller_id for share;
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

revoke execute on function public.marketplace_seller_has_access(uuid) from public;
grant execute on function public.marketplace_seller_has_access(uuid) to anon,authenticated;
