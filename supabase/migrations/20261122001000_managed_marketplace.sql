-- Managed marketplace: every listing is reviewed, COD is recorded, and Laptap owns fulfilment.
create table public.marketplace_managed_settings (
 id boolean primary key default true check(id),version integer not null default 1,
 minimum_price numeric(12,2) not null default 1000 check(minimum_price>0),minimum_commission numeric(12,2) not null default 799 check(minimum_commission>=0 and minimum_commission<minimum_price),
 rate_under_10000 integer not null default 1200 check(rate_under_10000 between 0 and 5000),rate_under_20000 integer not null default 1000 check(rate_under_20000 between 0 and 5000),rate_under_40000 integer not null default 900 check(rate_under_40000 between 0 and 5000),rate_under_70000 integer not null default 800 check(rate_under_70000 between 0 and 5000),rate_from_70000 integer not null default 700 check(rate_from_70000 between 0 and 5000),
 buyer_fee numeric(12,2) not null default 299 check(buyer_fee between 0 and 10000),buyer_fee_enabled boolean not null default true,desktop_handling_fee numeric(12,2) not null default 0 check(desktop_handling_fee between 0 and 10000),acceptance_hours integer not null default 48 check(acceptance_hours between 24 and 720),service_pincodes text[] not null default '{}',hub_address text not null default '' check(length(hub_address)<=1000),hub_instructions text not null default '' check(length(hub_instructions)<=1000),delivery_fee numeric(12,2) not null default 0 check(delivery_fee between 0 and 10000),updated_at timestamptz not null default now()
);
insert into public.marketplace_managed_settings(id) values(true);
alter table public.marketplace_managed_settings enable row level security;
create policy "Admins read managed settings" on public.marketplace_managed_settings for select to authenticated using(public.has_role(auth.uid(),'admin'));
grant select on public.marketplace_managed_settings to authenticated;
create function public.marketplace_managed_policy() returns jsonb language sql stable security definer set search_path=public as $$select to_jsonb(p)-'id'-'updated_at' from public.marketplace_managed_settings p where id$$;
revoke execute on function public.marketplace_managed_policy() from public;grant execute on function public.marketplace_managed_policy() to anon,authenticated;
create function public.marketplace_commission_quote(_price numeric,_policy jsonb) returns jsonb language plpgsql immutable set search_path=public as $$
declare rate integer;fee numeric;
begin
 rate:=case when _price<10000 then(_policy->>'rate_under_10000')::integer when _price<20000 then(_policy->>'rate_under_20000')::integer when _price<40000 then(_policy->>'rate_under_40000')::integer when _price<70000 then(_policy->>'rate_under_70000')::integer else(_policy->>'rate_from_70000')::integer end;
 fee:=least(_price,greatest((_policy->>'minimum_commission')::numeric,round(_price*rate/10000,2)));
 return jsonb_build_object('rate',rate,'commission',fee,'net',_price-fee);
end $$;
revoke execute on function public.marketplace_commission_quote(numeric,jsonb) from public;grant execute on function public.marketplace_commission_quote(numeric,jsonb) to anon,authenticated;
create function public.admin_marketplace_save_policy(_policy jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare p public.marketplace_managed_settings;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 select * into p from public.marketplace_managed_settings where id for update;
 if(_policy->>'version')::integer is distinct from p.version then raise exception 'Policy changed. Refresh before saving';end if;
 if jsonb_typeof(_policy->'service_pincodes') is distinct from 'array' or jsonb_array_length(_policy->'service_pincodes')>500 then raise exception 'Enter up to 500 serviceable pincodes';end if;
 if exists(select 1 from jsonb_array_elements_text(_policy->'service_pincodes') c where c !~ '^[1-9][0-9]{5}$') then raise exception 'Invalid service pincode';end if;
 update public.marketplace_managed_settings set version=version+1,minimum_price=(_policy->>'minimum_price')::numeric,minimum_commission=(_policy->>'minimum_commission')::numeric,rate_under_10000=(_policy->>'rate_under_10000')::integer,rate_under_20000=(_policy->>'rate_under_20000')::integer,rate_under_40000=(_policy->>'rate_under_40000')::integer,rate_under_70000=(_policy->>'rate_under_70000')::integer,rate_from_70000=(_policy->>'rate_from_70000')::integer,buyer_fee=(_policy->>'buyer_fee')::numeric,buyer_fee_enabled=(_policy->>'buyer_fee_enabled')::boolean,desktop_handling_fee=(_policy->>'desktop_handling_fee')::numeric,acceptance_hours=(_policy->>'acceptance_hours')::integer,service_pincodes=array(select jsonb_array_elements_text(_policy->'service_pincodes')),hub_address=trim(_policy->>'hub_address'),hub_instructions=trim(_policy->>'hub_instructions'),delivery_fee=(_policy->>'delivery_fee')::numeric,updated_at=now() where id;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'policy',gen_random_uuid(),'Managed policy updated',jsonb_build_object('version',p.version+1));return public.marketplace_managed_policy();
end $$;
revoke execute on function public.admin_marketplace_save_policy(jsonb) from public,anon;grant execute on function public.admin_marketplace_save_policy(jsonb) to authenticated;

alter table public.marketplace_listings add column review_status text not null default 'draft' check(review_status in('draft','pending','approved','rejected')),add column commission_terms jsonb not null default '{}',add column verification_fee_eligible boolean not null default true;
create index marketplace_review_queue on public.marketplace_listings(review_status,created_at desc) where not is_demo;
create table public.marketplace_listing_intake(listing_id uuid primary key references public.marketplace_listings(id),seller_id uuid not null references auth.users(id),serial_number text not null default '' check(length(serial_number)<=100),diagnostic_notes text not null default '' check(length(diagnostic_notes)<=3000),evidence_paths text[] not null default '{}',ownership_confirmed boolean not null default false,collection_address text not null default '' check(length(collection_address)<=1000),collection_instructions text not null default '' check(length(collection_instructions)<=1000),policy_snapshot jsonb not null default '{}',accepted_price numeric not null default 0,terms_accepted_at timestamptz,review_note text not null default '' check(length(review_note)<=3000),reviewed_at timestamptz,reviewed_by uuid references auth.users(id));
alter table public.marketplace_listing_intake enable row level security;
create policy "Owner and admin read private listing intake" on public.marketplace_listing_intake for select to authenticated using(public.has_role(auth.uid(),'admin') or(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())));
grant select on public.marketplace_listing_intake to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('marketplace-evidence','marketplace-evidence',false,307200,array['image/webp']);
create policy "Owner admin read private marketplace evidence" on storage.objects for select to authenticated using(bucket_id='marketplace-evidence' and(public.has_role(auth.uid(),'admin') or((storage.foldername(name))[1]=auth.uid()::text and public.marketplace_seller_has_access(auth.uid()))));
create policy "Reserved private evidence upload" on storage.objects for insert to authenticated with check(bucket_id='marketplace-evidence' and(storage.foldername(name))[1]=auth.uid()::text and public.marketplace_can_upload() and public.marketplace_upload_reserved(name));
create policy "Owner removes private marketplace evidence" on storage.objects for delete to authenticated using(bucket_id='marketplace-evidence' and(storage.foldername(name))[1]=auth.uid()::text and public.marketplace_can_upload());

create function public.guard_managed_listing_review() returns trigger language plpgsql security definer set search_path=public as $$
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
  if intake.listing_id is null or length(trim(intake.serial_number))<4 or not intake.ownership_confirmed or intake.terms_accepted_at is null or intake.accepted_price<>new.price or length(trim(intake.collection_address))<10 or(length(trim(intake.diagnostic_notes))<10 and cardinality(intake.evidence_paths)=0) then raise exception 'Seller must complete device details, collection address and accepted commission terms before approval';end if;
  if not public.marketplace_seller_active(new.seller_id) then raise exception 'Approve the seller account before approving this listing';end if;
  if new.price<(intake.policy_snapshot->>'minimum_price')::numeric then raise exception 'Device price is below the accepted marketplace minimum';end if;
  if not new.delivery_available and not new.pickup_available then raise exception 'Configure Laptap delivery areas or a collection hub before publishing';end if;
  quote:=public.marketplace_commission_quote(new.price,intake.policy_snapshot);
  new.commission_terms:=jsonb_build_object('version',intake.policy_snapshot->'version','price',new.price,'rate_bps',quote->'rate','commission',quote->'commission','seller_net',quote->'net','acceptance_hours',intake.policy_snapshot->'acceptance_hours');
 end if;
 if new.status='published' and new.review_status<>'approved' then raise exception 'Only approved listings can be public';end if;
 return new;
end $$;
create trigger z_managed_listing_review before insert or update on public.marketplace_listings for each row execute function public.guard_managed_listing_review();
revoke execute on function public.guard_managed_listing_review() from public,anon,authenticated;
drop policy "Available devices or authorised private inventory" on public.marketplace_listings;
create policy "Reviewed public inventory or authorised private inventory" on public.marketplace_listings for select using((status='published' and(review_status='approved' or is_demo) and public.marketplace_seller_active(seller_id)) or(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid())) or public.has_role(auth.uid(),'admin'));

create function public.marketplace_save_device(_id uuid,_product jsonb,_intake jsonb,_submit boolean,_policy_version integer) returns uuid language plpgsql security definer set search_path=public as $$
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
  if length(trim(coalesce(_intake->>'serial_number','')))<4 or length(trim(coalesce(_intake->>'collection_address','')))<10 then raise exception 'Enter the serial number and private collection address';end if;
 end if;
 if coalesce(jsonb_typeof(_intake->'evidence_paths'),'array')<>'array' or coalesce(jsonb_array_length(_intake->'evidence_paths'),0)>8 then raise exception 'Use up to eight private evidence images';end if;
 paths:=array(select jsonb_array_elements_text(coalesce(_intake->'evidence_paths','[]')));
 if exists(select 1 from unnest(paths) path where not exists(select 1 from storage.objects o where o.bucket_id='marketplace-evidence' and o.name=path and split_part(o.name,'/',1)=auth.uid()::text)) then raise exception 'Use evidence uploaded privately by your seller account';end if;
 if coalesce(_submit,false) and length(trim(coalesce(_intake->>'diagnostic_notes','')))<10 and cardinality(paths)=0 then raise exception 'Add diagnostic notes or a private diagnostic screenshot';end if;
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
revoke execute on function public.marketplace_save_device(uuid,jsonb,jsonb,boolean,integer) from public,anon;grant execute on function public.marketplace_save_device(uuid,jsonb,jsonb,boolean,integer) to authenticated;
create function public.admin_marketplace_review_listing(_id uuid,_decision text,_note text,_fee_eligible boolean default true) returns void language plpgsql security definer set search_path=public as $$
declare p public.marketplace_listings;policy public.marketplace_managed_settings;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 select * into p from public.marketplace_listings where id=_id for update;
 if p.id is null or p.is_demo then raise exception 'Choose a submitted device listing';end if;
 if p.review_status<>'pending' then raise exception 'Only pending submissions can be reviewed';end if;
 if _decision not in('approved','rejected') then raise exception 'Choose approve or request changes';end if;
 if _decision='rejected' and length(trim(_note))<10 then raise exception 'Give the seller a clear reason of at least 10 characters';end if;
 select * into policy from public.marketplace_managed_settings where id;
 update public.marketplace_listings set review_status=_decision,status=case when _decision='approved' then 'published' else 'draft' end,delivery_available=cardinality(policy.service_pincodes)>0,delivery_pincodes=policy.service_pincodes,delivery_fee=policy.delivery_fee,pickup_available=length(trim(policy.hub_address))>=10,pickup_address=policy.hub_address,pickup_instructions=policy.hub_instructions,verification_fee_eligible=_fee_eligible where id=_id;
 update public.marketplace_listing_intake set review_note=left(trim(coalesce(_note,'')),3000),reviewed_at=now(),reviewed_by=auth.uid() where listing_id=_id;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'listings',_id,'Listing '||_decision,jsonb_build_object('review_note',left(trim(coalesce(_note,'')),3000)));
end $$;
revoke execute on function public.admin_marketplace_review_listing(uuid,text,text,boolean) from public,anon;grant execute on function public.admin_marketplace_review_listing(uuid,text,text,boolean) to authenticated;
