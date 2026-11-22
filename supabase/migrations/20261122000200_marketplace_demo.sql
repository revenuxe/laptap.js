-- One public sample listing, with server-enforced protection against real transactions.
alter table public.marketplace_listings add column is_demo boolean not null default false;
create function public.guard_marketplace_demo_listing() returns trigger language plpgsql set search_path=public as $$
begin
 if (TG_OP='INSERT' and new.is_demo) or (TG_OP='UPDATE' and new.is_demo is distinct from old.is_demo) then
  if not public.has_role(auth.uid(),'admin') then raise exception 'Only admins may manage demo listings'; end if;
 end if;
 if new.is_demo and new.verified_at is not null then raise exception 'Demo listings cannot receive a real inspection badge'; end if;
 return new;
end $$;
create trigger marketplace_demo_listing_guard before insert or update on public.marketplace_listings for each row execute function public.guard_marketplace_demo_listing();
create function public.prevent_demo_marketplace_transactions() returns trigger language plpgsql set search_path=public as $$
begin
 if exists(select 1 from public.marketplace_listings where id=new.listing_id and is_demo) then raise exception 'This is a demo product and cannot receive enquiries or orders'; end if;
 return new;
end $$;
create trigger marketplace_demo_order_guard before insert on public.marketplace_orders for each row execute function public.prevent_demo_marketplace_transactions();
create trigger marketplace_demo_inquiry_guard before insert on public.marketplace_inquiries for each row execute function public.prevent_demo_marketplace_transactions();
do $$
declare demo_owner uuid;
begin
 select r.user_id into demo_owner from public.user_roles r join auth.users u on u.id=r.user_id where r.role='admin' order by u.created_at limit 1;
 if demo_owner is null then raise exception 'An existing admin account is required for the demo product'; end if;
 perform set_config('request.jwt.claim.sub',demo_owner::text,true);
 perform set_config('request.jwt.claims',json_build_object('sub',demo_owner::text,'role','authenticated')::text,true);
 insert into public.marketplace_listings(
  id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status,is_demo
 ) values (
  '9af8d415-26e1-4b7d-9f2c-0d7a7e988001',demo_owner,'Laptap Demo Store','Demo - Dell Latitude 5420','Dell','laptop',28500,2022,'Excellent',
  'Sample listing for exploring the Laptap Store. This is not real stock and is not available to purchase. The image is illustrative. Specifications, condition, price, and warranty information are examples only.',
  'Intel Core i5, 11th Gen','16 GB DDR4','512 GB NVMe SSD','Intel Iris Xe','14-inch Full HD',
  'Example: 82% battery health. No actual battery has been assessed.',
  'Example condition: minor cosmetic marks on the base. No physical device has been inspected.',
  'Example: laptop and original power adapter','Bangalore',null,6,
  'Sample warranty information only. No actual seller warranty or coverage applies to this demo product.',
  array['/assets/sell-laptop-cutout.webp'],'published',true
 ) on conflict(id) do nothing;
end $$;
