-- Integration checks against the migrated Supabase database.
-- Uses existing admin and non-admin accounts; every fixture is rolled back.
-- No auth accounts, emails, or real payments are created. Negative test order
-- numbers avoid advancing the live order-number sequence.
create temp table if not exists laptap_marketplace_validation_results(checks jsonb);
do $$
declare
 admin_user uuid; seller_user uuid; admin_device uuid:=gen_random_uuid(); seller_device uuid:=gen_random_uuid();
 test_order uuid:=gen_random_uuid(); test_case uuid:=gen_random_uuid();
 demo_id uuid:='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
 checks jsonb:='[]'; affected integer; total integer;
begin
 select r.user_id into admin_user from public.user_roles r join auth.users u on u.id=r.user_id where r.role='admin' order by u.created_at limit 1;
 select u.id into seller_user from auth.users u where not public.has_role(u.id,'admin') order by u.created_at limit 1;
 if admin_user is null or seller_user is null then raise exception 'Checks require one existing admin and one existing non-admin account'; end if;
 if has_function_privilege('anon','public.make_user_admin(text)','EXECUTE') or has_function_privilege('authenticated','public.make_user_admin(text)','EXECUTE') then raise exception 'TEST FAILED: client roles can grant admin access'; end if;
 checks:=checks||jsonb_build_object('test','Client roles cannot execute the legacy admin-grant function','passed',true);
 if has_function_privilege('anon','public.log_marketplace_activity()','EXECUTE') or has_function_privilege('authenticated','public.register_marketplace_seller()','EXECUTE') then raise exception 'TEST FAILED: internal triggers exposed as client RPCs'; end if;
 checks:=checks||jsonb_build_object('test','Internal trigger functions are not exposed as client RPCs','passed',true);
 begin
  insert into public.marketplace_sellers(id,shop_name,email,phone,city,full_name,business_address,status,approved_by,approved_at)
  select seller_user,'QA seller fixture',coalesce(email,''),'9000000000','Bangalore','QA Seller','QA test business address, Bangalore','active',admin_user,now() from auth.users where id=seller_user
  on conflict(id) do update set full_name='QA Seller',phone='9000000000',business_address='QA test business address, Bangalore',status='active';
  perform set_config('request.jwt.claim.sub',admin_user::text,true);
  perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status)
  select admin_device,admin_user,'QA admin fixture','QA admin device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,'published' from public.marketplace_listings where id=demo_id;
  perform set_config('request.jwt.claim.sub',seller_user::text,true);
  perform set_config('request.jwt.claims',json_build_object('sub',seller_user::text,'role','authenticated')::text,true);
  insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,status)
  select seller_device,seller_user,'QA seller fixture','QA seller device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,official_warranty_until,seller_warranty_months,warranty_terms,images,'published' from public.marketplace_listings where id=demo_id;
  checks:=checks||jsonb_build_object('test','Authenticated sellers create own listings','passed',true);
  begin
   update public.marketplace_listings set verified_at=now(),verification_notes='Attempt to self-verify a test device.' where id=seller_device;
   raise exception 'TEST FAILED: self-verification was allowed';
  exception when others then
   if SQLERRM not like '%Only admins%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Sellers cannot grant verification','passed',true);
  update public.marketplace_listings set price=1 where id=admin_device;
  get diagnostics affected=row_count;
  if affected<>0 then raise exception 'TEST FAILED: seller edited another seller device'; end if;
  checks:=checks||jsonb_build_object('test','Sellers cannot edit another seller inventory','passed',true);
  execute 'set local role anon';
  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('request.jwt.claims','{"role":"anon"}',true);
  select count(*) into total from public.marketplace_listings where id=demo_id;
  if total<>1 then raise exception 'TEST FAILED: anonymous demo browsing failed'; end if;
  checks:=checks||jsonb_build_object('test','Anonymous visitors can browse the demo product','passed',true);
  begin
   insert into public.marketplace_inquiries(listing_id,buyer_name,email,phone,message) values(demo_id,'QA fixture','qa@example.invalid','9000000000','This should not reach a real seller.');
   raise exception 'TEST FAILED: demo accepted an enquiry';
  exception when others then
   if SQLERRM not like '%demo product%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Demo product rejects anonymous enquiries','passed',true);
  insert into public.marketplace_inquiries(listing_id,buyer_name,email,phone,message) values(seller_device,'QA fixture','qa@example.invalid','9000000000','Test enquiry for the seller-owned fixture.'),(admin_device,'QA fixture','qa@example.invalid','9000000000','Test enquiry for the admin-owned fixture.');
  select count(*) into total from public.marketplace_inquiries where listing_id in(seller_device,admin_device);
  if total<>0 then raise exception 'TEST FAILED: anonymous visitors read enquiry contacts'; end if;
  checks:=checks||jsonb_build_object('test','Anonymous visitors cannot read enquiry contact details','passed',true);
  begin
   select count(*) into total from public.marketplace_orders;
   if total<>0 then raise exception 'TEST FAILED: anonymous visitors read orders'; end if;
  exception when insufficient_privilege then null;
  end;
  checks:=checks||jsonb_build_object('test','Anonymous visitors cannot read orders','passed',true);
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub',seller_user::text,true);
  perform set_config('request.jwt.claims',json_build_object('sub',seller_user::text,'role','authenticated')::text,true);
  select count(*) into total from public.marketplace_inquiries where listing_id in(seller_device,admin_device);
  if total<>1 then raise exception 'TEST FAILED: seller enquiry isolation'; end if;
  checks:=checks||jsonb_build_object('test','Seller sees only own product enquiries','passed',true);
  perform set_config('request.jwt.claim.sub',admin_user::text,true);
  perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  select count(*) into total from public.marketplace_inquiries where listing_id in(seller_device,admin_device);
  if total<>2 then raise exception 'TEST FAILED: admin cannot read all test enquiries'; end if;
  checks:=checks||jsonb_build_object('test','Admin can manage all seller enquiries','passed',true);
  update public.marketplace_listings set verified_at=now(),verification_notes='QA inspection: keyboard, display, ports, storage and condition checked.' where id=seller_device;
  if not exists(select 1 from public.marketplace_listings where id=seller_device and verified_at is not null) then raise exception 'TEST FAILED: admin verification'; end if;
  checks:=checks||jsonb_build_object('test','Admin can record actual-device verification','passed',true);
  update public.marketplace_listings set price=price+1 where id=seller_device;
  if exists(select 1 from public.marketplace_listings where id=seller_device and verified_at is not null) then raise exception 'TEST FAILED: changed device retained verification'; end if;
  checks:=checks||jsonb_build_object('test','Editing product details clears inspection status','passed',true);
  update public.marketplace_listings set verified_at=now(),verification_notes='QA reinspection after changed device details; hardware checks recorded.' where id=seller_device;
  update public.marketplace_sellers set status='suspended',moderation_note='QA suspension reason, reverted by transaction rollback.' where id=seller_user;
  execute 'set local role anon';
  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('request.jwt.claims','{"role":"anon"}',true);
  if exists(select 1 from public.marketplace_listings where id=seller_device) then raise exception 'TEST FAILED: suspended seller device remained public'; end if;
  checks:=checks||jsonb_build_object('test','Suspension hides public inventory','passed',true);
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub',seller_user::text,true);
  perform set_config('request.jwt.claims',json_build_object('sub',seller_user::text,'role','authenticated')::text,true);
  begin
   update public.marketplace_listings set price=price+1 where id=seller_device;
   raise exception 'TEST FAILED: suspended seller changed a listing';
  exception when others then
   if SQLERRM not like '%suspended%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Suspended seller cannot change inventory','passed',true);
  perform set_config('request.jwt.claim.sub',admin_user::text,true);
  perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  update public.marketplace_sellers set status='active',moderation_note='' where id=seller_user;
  begin
   update public.marketplace_listings set verified_at=now(),verification_notes='This demo must never be given a real inspection badge.' where id=demo_id;
   raise exception 'TEST FAILED: demo received a verification badge';
  exception when others then
   if SQLERRM not like '%Demo listings cannot%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Demo cannot receive misleading verification','passed',true);
  begin
   insert into public.marketplace_orders(order_number,listing_id,seller_id,buyer_name,email,phone,address,amount) overriding system value values(-9000001,demo_id,admin_user,'QA fixture','qa@example.invalid','9000000000','QA test collection address',28500);
   raise exception 'TEST FAILED: demo accepted an order';
  exception when others then
   if SQLERRM not like '%demo product%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Demo product rejects orders','passed',true);
  insert into public.marketplace_orders(id,order_number,listing_id,seller_id,buyer_name,email,phone,address,amount) overriding system value values(test_order,-9000002,seller_device,seller_user,'QA fixture','qa@example.invalid','9000000000','QA test collection address',28500);
  if not exists(select 1 from public.marketplace_listings where id=seller_device and status='sold' and verified_at is not null) then raise exception 'TEST FAILED: order did not reserve device while preserving inspection'; end if;
  checks:=checks||jsonb_build_object('test','Order atomically reserves stock and preserves inspection','passed',true);
  begin
   insert into public.marketplace_orders(order_number,listing_id,seller_id,buyer_name,email,phone,address,amount) overriding system value values(-9000003,seller_device,seller_user,'QA fixture','qa@example.invalid','9000000000','QA test collection address',28500);
   raise exception 'TEST FAILED: device received a duplicate order';
  exception when others then
   if SQLERRM not like '%not available%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Reserved stock cannot receive another order','passed',true);
  begin
   update public.marketplace_listings set status='published' where id=seller_device;
   raise exception 'TEST FAILED: active-order device was republished';
  exception when others then
   if SQLERRM not like '%active order%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Active-order stock cannot be republished','passed',true);
  begin
   update public.marketplace_orders set status='shipped',courier='QA Courier',tracking_number='QA123' where id=test_order;
   raise exception 'TEST FAILED: order skipped confirmation';
  exception when others then
   if SQLERRM not like '%Invalid order status transition%' then raise; end if;
  end;
  checks:=checks||jsonb_build_object('test','Order cannot skip fulfilment steps','passed',true);
  update public.marketplace_orders set status='confirmed' where id=test_order;
  begin
   update public.marketplace_orders set status='shipped' where id=test_order;
   raise exception 'TEST FAILED: shipment without tracking';
  exception when check_violation then null;
  end;
  checks:=checks||jsonb_build_object('test','Shipment requires courier and tracking','passed',true);
  update public.marketplace_orders set status='shipped',courier='QA Courier',tracking_number='QA123' where id=test_order;
  update public.marketplace_orders set status='delivered' where id=test_order;
  begin
   update public.marketplace_orders set payment_status='paid' where id=test_order;
   raise exception 'TEST FAILED: payment without external reference';
  exception when check_violation then null;
  end;
  checks:=checks||jsonb_build_object('test','Recorded payments require a reference','passed',true);
  update public.marketplace_orders set payment_status='paid',payment_reference='QA-EXTERNAL-123' where id=test_order;
  insert into public.marketplace_returns(id,order_id,reason) values(test_case,test_order,'QA support issue for the rollback-only order.');
  begin
   update public.marketplace_returns set status='resolved' where id=test_case;
   raise exception 'TEST FAILED: support case closed without resolution';
  exception when check_violation then null;
  end;
  checks:=checks||jsonb_build_object('test','Support case requires a resolution before closure','passed',true);
  update public.marketplace_returns set status='resolved',resolution='QA issue investigated and decision recorded.' where id=test_case;
  update public.marketplace_orders set status='return_requested' where id=test_order;
  update public.marketplace_orders set status='refunded',payment_status='refunded',payment_reference='QA-REFUND-123' where id=test_order;
  checks:=checks||jsonb_build_object('test','Delivery, return, and recorded refund lifecycle works','passed',true);
  if not exists(select 1 from public.marketplace_activity where entity_id=test_order) then raise exception 'TEST FAILED: order activity not logged'; end if;
  checks:=checks||jsonb_build_object('test','Order operations generate audit records','passed',true);
  begin
   insert into public.marketplace_activity(entity_type,entity_id,action) values('orders',test_order,'Tampered');
   raise exception 'TEST FAILED: admin client fabricated an audit record';
  exception when insufficient_privilege then null;
  end;
  checks:=checks||jsonb_build_object('test','Application clients cannot fabricate audit events','passed',true);
  raise exception using errcode='PZ001',message='Rollback all integration fixtures';
 exception when sqlstate 'PZ001' then null;
 end;
 -- PL/pgSQL variables survive the exception; fixture rows and profile changes do not.
 insert into pg_temp.laptap_marketplace_validation_results values(checks);
end $$;
select checks as passed_checks from pg_temp.laptap_marketplace_validation_results;
