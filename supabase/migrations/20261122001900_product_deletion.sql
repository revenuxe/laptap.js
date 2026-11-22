-- Reversible record removal: hide listings while preserving existing order and financial history.
alter table public.marketplace_listings add column deleted_at timestamptz,add column deleted_by uuid references auth.users(id);
create table public.marketplace_listing_deletions(listing_id uuid primary key references public.marketplace_listings(id),actor_id uuid not null references auth.users(id),deleted_at timestamptz not null default now());
alter table public.marketplace_listing_deletions enable row level security;
revoke all on public.marketplace_listing_deletions from anon,authenticated;
create function public.derive_marketplace_listing_deletion() returns trigger language plpgsql security definer set search_path=public as $$
declare deletion public.marketplace_listing_deletions;
begin
 select * into deletion from public.marketplace_listing_deletions where listing_id=new.id;
 new.deleted_at:=deletion.deleted_at;new.deleted_by:=deletion.actor_id;
 if new.deleted_at is not null then
  if new.status='published' then raise exception 'Deleted products cannot be published';end if;
  new.status:='draft';
 end if;
 return new;
end $$;
create trigger a_derive_listing_deletion before insert or update on public.marketplace_listings for each row execute function public.derive_marketplace_listing_deletion();
revoke execute on function public.derive_marketplace_listing_deletion() from public,anon,authenticated;
create function public.marketplace_delete_product(_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare p public.marketplace_listings;admin boolean:=public.has_role(auth.uid(),'admin');
begin
 if auth.uid() is null then raise exception 'Sign in to delete a product';end if;
 select * into p from public.marketplace_listings where id=_id for update;
 if p.id is null or not(admin or(p.seller_id=auth.uid() and exists(select 1 from public.marketplace_sellers where id=auth.uid() and status in('active','pending')))) then raise exception 'Only the product owner or an admin can delete this product';end if;
 if p.deleted_at is not null then return;end if;
 insert into public.marketplace_listing_deletions(listing_id,actor_id) values(_id,auth.uid());
 update public.marketplace_listings set status='draft' where id=_id;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'listings',_id,'Product deleted',jsonb_build_object('previous_status',p.status,'retained_for_order_history',exists(select 1 from public.marketplace_orders where listing_id=_id)));
end $$;
revoke execute on function public.marketplace_delete_product(uuid) from public,anon;grant execute on function public.marketplace_delete_product(uuid) to authenticated;
drop policy "Reviewed public inventory or authorised private inventory" on public.marketplace_listings;
create policy "Reviewed public inventory or authorised private inventory" on public.marketplace_listings for select using(public.has_role(auth.uid(),'admin') or(deleted_at is null and((category='laptop' and status='published' and(review_status='approved' or is_demo) and public.marketplace_seller_active(seller_id)) or(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())))));
create index marketplace_live_listings on public.marketplace_listings(created_at desc) where deleted_at is null;

create or replace function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
declare intake public.marketplace_listing_intake;quote jsonb;admin boolean:=public.has_role(auth.uid(),'admin');changed boolean:=false;
begin
 if new.is_demo then return new;end if;
 if TG_OP='UPDATE' then
  changed:=(to_jsonb(new)-array['deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']) is distinct from(to_jsonb(old)-array['deleted_at','deleted_by','stock_available','status','review_status','commission_terms','verification_fee_eligible','verified_at','verification_notes','catalog_search','seo_path','delivery_available','pickup_available','delivery_fee','delivery_pincodes','pickup_address','pickup_instructions']);
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
 if existing.deleted_at is not null then raise exception 'This product has been deleted. Create a new listing instead';end if;
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


