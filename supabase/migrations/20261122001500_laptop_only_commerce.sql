-- Laptop-only commerce for now. Preserve historical desktop data and orders.
drop policy "Reviewed public inventory or authorised private inventory" on public.marketplace_listings;
create policy "Reviewed public inventory or authorised private inventory" on public.marketplace_listings for select using((category='laptop' and status='published' and(review_status='approved' or is_demo) and public.marketplace_seller_active(seller_id)) or(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())) or public.has_role(auth.uid(),'admin'));
create function public.guard_laptop_only_listing() returns trigger language plpgsql set search_path=public as $$
begin
 if new.category<>'laptop' and(TG_OP='INSERT' or new.status='published' or new.review_status='pending') then raise exception 'Laptap Store currently accepts laptop listings only';end if;
 return new;
end $$;
create trigger a_laptop_only_listing before insert or update on public.marketplace_listings for each row execute function public.guard_laptop_only_listing();
create function public.guard_laptop_only_order() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from public.marketplace_listings where id=new.listing_id and category='laptop') then raise exception 'Laptap Store currently sells laptops only';end if;
 return new;
end $$;
create trigger a_laptop_only_order before insert on public.marketplace_orders for each row execute function public.guard_laptop_only_order();
revoke execute on function public.guard_laptop_only_listing(),public.guard_laptop_only_order() from public,anon,authenticated;
