-- All buyers, sellers, checkouts, inventory and orders below are rollback-only fixtures.
create temp table checkout_results(checks jsonb);
do $$
declare a uuid;s uuid:=gen_random_uuid();b uuid:=gen_random_uuid();other uuid:=gen_random_uuid();d1 uuid:=gen_random_uuid();d2 uuid:=gen_random_uuid();d3 uuid:=gen_random_uuid();cod_order uuid;cid uuid:=gen_random_uuid();result jsonb;again jsonb;orders jsonb;items jsonb;address jsonb;delivery_order uuid;pickup_order uuid;checks jsonb:='[]';
begin
 select user_id into a from public.user_roles where role='admin' limit 1;
 begin
 insert into auth.users(id,email,email_confirmed_at,aud,role,raw_user_meta_data) values(s,'checkout-seller-'||s||'@example.invalid',now(),'authenticated','authenticated',jsonb_build_object('seller_application',true,'full_name','QA Seller','shop_name','QA Pickup Store','phone','9000000000','city','Bangalore','business_address','QA business address Bangalore 560001')),(b,'checkout-buyer-'||b||'@example.invalid',now(),'authenticated','authenticated','{}'),(other,'checkout-other-'||other||'@example.invalid',now(),'authenticated','authenticated','{}');
 perform set_config('request.jwt.claim.sub',a::text,true);perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 update public.marketplace_sellers set status='active' where id=s;
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,status,delivery_available,pickup_available,delivery_fee,delivery_pincodes,pickup_address,pickup_instructions)
 select v,s,'QA Pickup Store','QA checkout device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,'Bangalore',seller_warranty_months,warranty_terms,images,'published',true,true,600,array['560001'],'QA Store, Test Road, Bangalore 560001','Collect only after confirmation' from public.marketplace_listings cross join unnest(array[d1,d2]) v where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
 items:=jsonb_build_array(jsonb_build_object('listing_id',d1,'fulfillment_method','delivery'),jsonb_build_object('listing_id',d2,'fulfillment_method','pickup'));address:=jsonb_build_object('name','QA Buyer','phone','9000000001','line1','QA House, Test Street','line2','','city','Bangalore','state','Karnataka','pincode','560001');
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',b::text,true);perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
 begin perform public.marketplace_place_order(cid,items,address,1,true);raise exception 'FAILED price tampering';exception when others then if SQLERRM not like '%price or delivery fee changed%' then raise;end if;end;
 begin perform public.marketplace_place_order(cid,items,jsonb_set(address,'{pincode}','"400001"'),57600,true);raise exception 'FAILED pincode';exception when others then if SQLERRM not like '%does not deliver%' then raise;end if;end;
 begin perform public.marketplace_place_order(cid,items,address,57600,false);raise exception 'FAILED consent';exception when others then if SQLERRM not like '%accept the order terms%' then raise;end if;end;
 checks:=checks||jsonb_build_object('test','Checkout rejects altered totals, unsupported pincodes and missing consent','passed',true);
 result:=public.marketplace_place_order(cid,items,address,57600,true);again:=public.marketplace_place_order(cid,items,address,57600,true);
 if result<>again then raise exception 'FAILED idempotency';end if;
 orders:=public.marketplace_buyer_orders();if jsonb_array_length(orders)<>2 then raise exception 'FAILED buyer order count';end if;
 select(value->>'id')::uuid into delivery_order from jsonb_array_elements(orders) where value->>'fulfillment_method'='delivery';select(value->>'id')::uuid into pickup_order from jsonb_array_elements(orders) where value->>'fulfillment_method'='pickup';
 if not exists(select 1 from jsonb_array_elements(orders) o where o->>'payment_method'='cod' and (o->>'amount')::numeric=29100) or not exists(select 1 from jsonb_array_elements(orders) o where o->>'payment_method'='pay_at_pickup' and(o->>'amount')::numeric=28500) then raise exception 'FAILED calculated totals';end if;
 if exists(select 1 from jsonb_array_elements(orders)o where o?'admin_notes' or o?'payment_reference') then raise exception 'FAILED internal fields';end if;
 if exists(select 1 from public.marketplace_orders) then raise exception 'FAILED buyer direct table privacy';end if;
 checks:=checks||jsonb_build_object('test','Mixed delivery/pickup checkout is atomic, server-priced and idempotent; buyer data excludes internal fields','passed',true);
 perform set_config('request.jwt.claim.sub',other::text,true);perform set_config('request.jwt.claims',json_build_object('sub',other,'role','authenticated')::text,true);
 if public.marketplace_buyer_orders()<>'[]'::jsonb then raise exception 'FAILED cross-buyer privacy';end if;
 begin perform public.marketplace_cancel_buyer_order(delivery_order,'Other buyer cancellation');raise exception 'FAILED cross-buyer cancellation';exception when others then if SQLERRM not like '%can no longer be cancelled%' then raise;end if;end;
 begin perform public.marketplace_place_order(gen_random_uuid(),jsonb_build_array(jsonb_build_object('listing_id',d1,'fulfillment_method','delivery')),address,29100,true);raise exception 'FAILED oversell';exception when others then if SQLERRM not like '%no longer available%' then raise;end if;end;
 checks:=checks||jsonb_build_object('test','Other accounts cannot read or cancel orders, and reserved devices cannot be ordered again','passed',true);
 perform set_config('request.jwt.claim.sub',b::text,true);perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
 perform public.marketplace_cancel_buyer_order(delivery_order,'QA change of delivery plans');
 perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',json_build_object('sub',s,'role','authenticated')::text,true);
 perform public.marketplace_seller_order_action(pickup_order,'confirmed','','','');
 begin perform public.marketplace_seller_order_action(pickup_order,'shipped','QA Courier','QA123','');raise exception 'FAILED pickup shipment';exception when check_violation then null;end;
 perform public.marketplace_seller_order_action(pickup_order,'delivered','','','');
 update public.marketplace_listings set title='QA changed title after purchase' where id=d2;
 perform set_config('request.jwt.claim.sub',b::text,true);perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
 orders:=public.marketplace_buyer_orders();
 if not exists(select 1 from jsonb_array_elements(orders)o where o->>'id'=pickup_order::text and o->>'status'='delivered' and o->'product_snapshot'->>'title'='QA checkout device' and jsonb_array_length(o->'events')=3) then raise exception 'FAILED pickup lifecycle or snapshot';end if;
 checks:=checks||jsonb_build_object('test','Buyers cancel pending orders; sellers confirm and complete pickup without courier details; snapshots and timelines persist','passed',true);
 execute 'reset role';perform set_config('request.jwt.claim.sub',a::text,true);perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,status,delivery_available,delivery_fee,delivery_pincodes)
 select d3,s,seller_name,'QA COD delivery device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,'published',true,600,array['560001'] from public.marketplace_listings where id=d2;
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',b::text,true);perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
 result:=public.marketplace_place_order(gen_random_uuid(),jsonb_build_array(jsonb_build_object('listing_id',d3,'fulfillment_method','delivery')),address,29100,true);cod_order:=(result->'order_ids'->>0)::uuid;
 perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',json_build_object('sub',s,'role','authenticated')::text,true);
 perform public.marketplace_seller_order_action(cod_order,'confirmed','','','');
 begin perform public.marketplace_seller_order_action(cod_order,'shipped','','','');raise exception 'FAILED missing tracking';exception when check_violation then null;end;
 perform public.marketplace_seller_order_action(cod_order,'shipped','QA Courier','QA-TRACK-123','');
 perform public.marketplace_seller_order_action(cod_order,'delivered','QA Courier','QA-TRACK-123','');
 perform set_config('request.jwt.claim.sub',a::text,true);perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 update public.marketplace_orders set payment_status='paid',payment_reference='QA-COD-RECEIPT-123' where id=cod_order;
 perform set_config('request.jwt.claim.sub',b::text,true);perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
 orders:=public.marketplace_buyer_orders();
 if not exists(select 1 from jsonb_array_elements(orders)o where o->>'id'=cod_order::text and o->>'status'='delivered' and o->>'payment_status'='paid' and o->>'tracking_number'='QA-TRACK-123' and jsonb_array_length(o->'events')=4) then raise exception 'FAILED COD delivery lifecycle';end if;
 checks:=checks||jsonb_build_object('test','Buyer COD order proceeds through seller acceptance, validated tracking, delivery and admin payment recording','passed',true);
 raise exception using errcode='PZ006',message='Rollback checkout fixtures';
 exception when sqlstate 'PZ006' then null;end;
 insert into pg_temp.checkout_results values(checks);
end $$;
select checks as passed_checks from pg_temp.checkout_results;
