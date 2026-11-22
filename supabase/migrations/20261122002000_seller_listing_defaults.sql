-- Private, account-specific defaults for recurring pickup and warranty details.
create table public.marketplace_seller_listing_defaults(
 seller_id uuid primary key references public.marketplace_sellers(id),
 collection_address text not null default '' check(length(collection_address)<=1000),
 collection_instructions text not null default '' check(length(collection_instructions)<=1000),
 seller_warranty_months integer not null default 0 check(seller_warranty_months between 0 and 60),
 warranty_terms text not null default '' check(length(warranty_terms)<=3000),
 updated_at timestamptz not null default now()
);
alter table public.marketplace_seller_listing_defaults enable row level security;
create policy "Seller reads own listing defaults" on public.marketplace_seller_listing_defaults for select to authenticated using(seller_id=auth.uid() and public.marketplace_seller_has_access(auth.uid()));
grant select on public.marketplace_seller_listing_defaults to authenticated;
revoke insert,update,delete on public.marketplace_seller_listing_defaults from anon,authenticated;
-- Existing sellers start with their latest saved real listing.
insert into public.marketplace_seller_listing_defaults(seller_id,collection_address,collection_instructions,seller_warranty_months,warranty_terms)
select distinct on(p.seller_id) p.seller_id,i.collection_address,i.collection_instructions,p.seller_warranty_months,p.warranty_terms from public.marketplace_listings p join public.marketplace_listing_intake i on i.listing_id=p.id where not p.is_demo and p.deleted_at is null order by p.seller_id,p.created_at desc,p.id;
create function public.marketplace_listing_defaults() returns jsonb language plpgsql stable security definer set search_path=public as $$
begin
 if auth.uid() is null or not public.marketplace_seller_has_access(auth.uid()) then raise exception 'Seller access required';end if;
 return coalesce((select jsonb_build_object('collection_address',collection_address,'collection_instructions',collection_instructions,'seller_warranty_months',seller_warranty_months,'warranty_terms',warranty_terms) from public.marketplace_seller_listing_defaults where seller_id=auth.uid()),'{}'::jsonb);
end $$;
revoke execute on function public.marketplace_listing_defaults() from public,anon;grant execute on function public.marketplace_listing_defaults() to authenticated;

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
 insert into public.marketplace_seller_listing_defaults(seller_id,collection_address,collection_instructions,seller_warranty_months,warranty_terms)
 values(seller.id,case when length(trim(coalesce(_intake->>'collection_address','')))>=10 then trim(_intake->>'collection_address') else seller.business_address end,trim(coalesce(_intake->>'collection_instructions','')),p.seller_warranty_months,p.warranty_terms)
 on conflict(seller_id) do update set collection_address=case when length(trim(coalesce(_intake->>'collection_address','')))>=10 then excluded.collection_address else marketplace_seller_listing_defaults.collection_address end,collection_instructions=excluded.collection_instructions,seller_warranty_months=excluded.seller_warranty_months,warranty_terms=excluded.warranty_terms,updated_at=now();
 return new_id;
end $$;


