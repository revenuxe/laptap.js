-- Per-listing delivery and pickup overrides for the admin editor.
create or replace function public.admin_save_store_product(_id uuid,_product jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare s public.store_settings;p public.marketplace_listings;existing public.marketplace_listings;new_id uuid:=coalesce(_id,gen_random_uuid());
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Administrator access required';end if;
 select * into s from public.store_settings where id for share;
 if s.owner_id is null then raise exception 'Save your store name and contact details in Store setup first';end if;
 select * into existing from public.marketplace_listings where id=new_id for update;
 if _id is not null and (existing.id is null or existing.deleted_at is not null) then raise exception 'Product is unavailable';end if;
 p:=jsonb_populate_record(null::public.marketplace_listings,_product);
 if p.status not in('draft','published','sold') or p.status is null then raise exception 'Choose a valid visibility';end if;
 if p.delivery_available and (cardinality(p.delivery_pincodes)>500 or exists(select 1 from unnest(p.delivery_pincodes) v where v !~ '^[1-9][0-9]{5}$')) then raise exception 'Enter valid six-digit delivery pincodes';end if;
 if cardinality(p.images) not between 1 and 8 or p.images is null then raise exception 'Add between one and eight photos';end if;
 if exists(select 1 from unnest(p.images) url where not exists(select 1 from storage.objects o where o.bucket_id='marketplace-images' and split_part(url,'/storage/v1/object/public/marketplace-images/',2)=o.name)) then raise exception 'Use photos uploaded to this store';end if;
 if existing.id is null then
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status,stock_quantity,store_owned,delivery_available,pickup_available,delivery_fee,delivery_pincodes,pickup_address,pickup_instructions)
 values(new_id,s.owner_id,s.name,p.title,p.brand,'laptop',p.price,p.year,p.condition,p.description,p.processor,p.ram,p.storage,p.graphics,coalesce(p.display,''),coalesce(p.battery,''),p.defects,coalesce(p.accessories,''),s.city,p.official_warranty_until,p.seller_warranty_months,coalesce(p.warranty_terms,''),p.images,p.status,p.stock_quantity,true,coalesce(p.delivery_available,s.delivery_available),coalesce(p.pickup_available,s.pickup_available),coalesce(p.delivery_fee,s.delivery_fee),coalesce(p.delivery_pincodes,s.delivery_pincodes),coalesce(p.pickup_address,s.address),coalesce(p.pickup_instructions,s.pickup_instructions));
 else
 update public.marketplace_listings set title=p.title,brand=p.brand,price=p.price,year=p.year,condition=p.condition,description=p.description,processor=p.processor,ram=p.ram,storage=p.storage,graphics=p.graphics,display=coalesce(p.display,''),battery=coalesce(p.battery,''),defects=p.defects,accessories=coalesce(p.accessories,''),official_warranty_until=p.official_warranty_until,seller_warranty_months=p.seller_warranty_months,warranty_terms=coalesce(p.warranty_terms,''),images=p.images,status=p.status,stock_quantity=p.stock_quantity,delivery_available=coalesce(p.delivery_available,existing.delivery_available),pickup_available=coalesce(p.pickup_available,existing.pickup_available),delivery_fee=coalesce(p.delivery_fee,existing.delivery_fee),delivery_pincodes=coalesce(p.delivery_pincodes,existing.delivery_pincodes),pickup_address=coalesce(p.pickup_address,existing.pickup_address),pickup_instructions=coalesce(p.pickup_instructions,existing.pickup_instructions) where id=new_id;
 end if;
 return new_id;
end $$;
