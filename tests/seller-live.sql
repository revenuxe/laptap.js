-- All auth users, profiles, inventory and order fixtures roll back. No emails are sent.
create temp table if not exists laptap_seller_validation_results(checks jsonb);
do $$
declare admin_user uuid; applicant uuid:=gen_random_uuid(); device_id uuid:=gen_random_uuid(); admin_device uuid:=gen_random_uuid(); own_order uuid:=gen_random_uuid(); admin_order uuid:=gen_random_uuid(); inquiry_id uuid:=gen_random_uuid(); affected integer; payload jsonb; checks jsonb:='[]'; demo_id uuid:='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
begin
 select user_id into admin_user from public.user_roles where role='admin' limit 1;
 if admin_user is null then raise exception 'An existing admin is required'; end if;
 begin
  insert into auth.users(id,email,aud,role,raw_user_meta_data) values(applicant,'seller-qa-'||applicant::text||'@example.invalid','authenticated','authenticated',jsonb_build_object('seller_application',true,'full_name','QA Applicant','shop_name','QA Seller Shop','phone','9000000000','city','Bangalore','business_address','QA business address, Bangalore 560001','about','QA test shop','tax_id','','status','active'));
  if not exists(select 1 from public.marketplace_sellers where id=applicant and status='pending' and approved_at is null and full_name='QA Applicant') then raise exception 'FAILED: signup did not create a pending application'; end if;
  checks:=checks||jsonb_build_object('test','Signup captures business details as pending even when metadata requests approval','passed',true);
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub',applicant::text,true);perform set_config('request.jwt.claims',json_build_object('sub',applicant::text,'role','authenticated')::text,true);
  begin
   update public.marketplace_sellers set status='active' where id=applicant;
   raise exception 'FAILED: applicant self-approved';
  exception when others then if SQLERRM not like '%Only admins%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Sellers cannot approve their own application','passed',true);
  begin
   update public.marketplace_sellers set approved_by=admin_user,approved_at=now() where id=applicant;
   raise exception 'FAILED: seller forged approval identity';
  exception when others then if SQLERRM not like '%approval details%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Approval identity and timestamp cannot be forged','passed',true);
  if exists(select 1 from public.marketplace_sellers where id=admin_user) then raise exception 'FAILED: private business profiles leaked'; end if;
  checks:=checks||jsonb_build_object('test','Sellers cannot read another business profile','passed',true);
  if not public.marketplace_can_upload() then raise exception 'FAILED: pending applicant cannot prepare photos'; end if;
  insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,status)
  select device_id,applicant,'Forged shop name','QA applicant device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,'Forged city',seller_warranty_months,warranty_terms,images,'draft' from public.marketplace_listings where id=demo_id;
  if not exists(select 1 from public.marketplace_listings where id=device_id and status='draft' and seller_name='QA Seller Shop' and location='Bangalore') then raise exception 'FAILED: draft ownership or business identity'; end if;
  checks:=checks||jsonb_build_object('test','Pending sellers can prepare drafts with canonical shop identity','passed',true);
  begin
   update public.marketplace_listings set status='published' where id=device_id;
   raise exception 'FAILED: pending seller published';
  exception when others then if SQLERRM not like '%Admin approval%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Publishing is blocked before admin approval','passed',true);
  perform set_config('request.jwt.claim.sub',admin_user::text,true);perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  begin
   update public.marketplace_sellers set status='rejected',moderation_note='' where id=applicant;
   raise exception 'FAILED: rejection without a reason';
  exception when check_violation then null; end;
  update public.marketplace_sellers set status='rejected',moderation_note='Please provide the complete business details.' where id=applicant;
  checks:=checks||jsonb_build_object('test','Rejection requires a reason visible to the seller','passed',true);
  perform set_config('request.jwt.claim.sub',applicant::text,true);perform set_config('request.jwt.claims',json_build_object('sub',applicant::text,'role','authenticated')::text,true);
  update public.marketplace_sellers set status='pending',business_address='QA corrected business address, Bangalore 560001' where id=applicant;
  if not exists(select 1 from public.marketplace_sellers where id=applicant and status='pending' and moderation_note='') then raise exception 'FAILED: rejection resubmission'; end if;
  checks:=checks||jsonb_build_object('test','Rejected sellers can revise and resubmit for review','passed',true);
  perform set_config('request.jwt.claim.sub',admin_user::text,true);perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  update public.marketplace_sellers set status='active' where id=applicant;
  if not exists(select 1 from public.marketplace_sellers where id=applicant and status='active' and approved_at is not null and approved_by=admin_user) then raise exception 'FAILED: approval record missing'; end if;
  checks:=checks||jsonb_build_object('test','Admin approval records reviewer and timestamp','passed',true);
  insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,status)
  select admin_device,admin_user,'QA admin shop','QA admin device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,'published' from public.marketplace_listings where id=demo_id;
  perform set_config('request.jwt.claim.sub',applicant::text,true);perform set_config('request.jwt.claims',json_build_object('sub',applicant::text,'role','authenticated')::text,true);
  update public.marketplace_listings set status='published' where id=device_id;
  update public.marketplace_sellers set shop_name='QA Renamed Shop' where id=applicant;
  if not exists(select 1 from public.marketplace_sellers where id=applicant and status='pending' and approved_at is null) then raise exception 'FAILED: business identity did not trigger review'; end if;
  execute 'set local role anon';perform set_config('request.jwt.claim.sub','',true);perform set_config('request.jwt.claims','{"role":"anon"}',true);
  if exists(select 1 from public.marketplace_listings where id=device_id) then raise exception 'FAILED: identity changes left unreviewed stock public'; end if;
  checks:=checks||jsonb_build_object('test','Business identity changes trigger reapproval and hide public stock','passed',true);
  execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',admin_user::text,true);perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  update public.marketplace_sellers set status='active' where id=applicant;
  if not exists(select 1 from public.marketplace_listings where id=device_id and seller_name='QA Renamed Shop') then raise exception 'FAILED: approved branding did not sync to products'; end if;
  checks:=checks||jsonb_build_object('test','Approved shop branding syncs to its products','passed',true);
  insert into public.marketplace_inquiries(id,listing_id,buyer_name,email,phone,message) values(inquiry_id,device_id,'QA Buyer','buyer@example.invalid','9000000000','Can you confirm the battery condition and pickup availability?');
  insert into public.marketplace_orders(id,order_number,listing_id,seller_id,buyer_name,email,phone,address,amount,admin_notes,payment_reference) overriding system value values(own_order,-9100001,device_id,applicant,'QA Buyer','buyer@example.invalid','9000000000','QA buyer delivery address, Bangalore',28500,'Private admin-only note','Private transaction reference'),(admin_order,-9100002,admin_device,admin_user,'QA Other Buyer','other@example.invalid','9000000001','QA other buyer address, Bangalore',28500,'Private admin-only note','Private transaction reference');
  update public.marketplace_orders set status='confirmed' where id=own_order;
  perform set_config('request.jwt.claim.sub',applicant::text,true);perform set_config('request.jwt.claims',json_build_object('sub',applicant::text,'role','authenticated')::text,true);
  select to_jsonb(o) into payload from public.marketplace_seller_orders() o where id=own_order;
  if payload is null or payload ? 'admin_notes' or payload ? 'payment_reference' then raise exception 'FAILED: seller order projection leaked internal fields'; end if;
  if exists(select 1 from public.marketplace_seller_orders() where id=admin_order) then raise exception 'FAILED: seller read another seller order'; end if;
  checks:=checks||jsonb_build_object('test','Order RPC exposes own fulfilment details without admin notes or transaction references','passed',true);
  if exists(select 1 from public.marketplace_orders where id=own_order) then raise exception 'FAILED: direct order table exposed private fields'; end if;
  checks:=checks||jsonb_build_object('test','Direct order-table reads remain admin-only','passed',true);
  begin
   perform public.marketplace_seller_fulfil(admin_order,'shipped','QA Courier','QA123');
   raise exception 'FAILED: seller fulfilled another seller order';
  exception when others then if SQLERRM not like '%not found for this seller%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Sellers cannot fulfil another seller order','passed',true);
  begin
   perform public.marketplace_seller_fulfil(own_order,'delivered','QA Courier','QA123');
   raise exception 'FAILED: seller skipped shipment';
  exception when others then if SQLERRM not like '%transition%' then raise; end if; end;
  begin
   perform public.marketplace_seller_fulfil(own_order,'shipped','','');
   raise exception 'FAILED: seller shipped without tracking';
  exception when check_violation then null; end;
  perform public.marketplace_seller_fulfil(own_order,'shipped','QA Courier','QA123');
  perform public.marketplace_seller_fulfil(own_order,'delivered','QA Courier','QA123');
  if not exists(select 1 from public.marketplace_seller_orders() where id=own_order and status='delivered') then raise exception 'FAILED: seller fulfilment flow'; end if;
  checks:=checks||jsonb_build_object('test','Seller fulfilment enforces shipment steps and tracking','passed',true);
  begin
   perform public.marketplace_seller_fulfil(own_order,'refunded','QA Courier','QA123');
   raise exception 'FAILED: seller issued a refund status';
  exception when others then if SQLERRM not like '%Invalid seller fulfilment%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Sellers cannot issue admin payment or refund operations','passed',true);
  if not exists(select 1 from public.marketplace_seller_inquiries() where id=inquiry_id) then raise exception 'FAILED: seller inbox retrieval'; end if;
  update public.marketplace_inquiries set status='contacted',seller_notes='QA seller followed up with the buyer.' where id=inquiry_id;
  begin
   update public.marketplace_inquiries set admin_notes='Attempt to change private admin text' where id=inquiry_id;
   raise exception 'FAILED: seller changed admin follow-up notes';
  exception when others then if SQLERRM not like '%only update follow-up%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Seller follow-up can change its status and notes but not admin notes','passed',true);
  perform set_config('request.jwt.claim.sub',admin_user::text,true);perform set_config('request.jwt.claims',json_build_object('sub',admin_user::text,'role','authenticated')::text,true);
  update public.marketplace_sellers set status='suspended',moderation_note='QA account pause for rollback-only checks.' where id=applicant;
  perform set_config('request.jwt.claim.sub',applicant::text,true);perform set_config('request.jwt.claims',json_build_object('sub',applicant::text,'role','authenticated')::text,true);
  if public.marketplace_can_upload() then raise exception 'FAILED: suspended seller may upload new media'; end if;
  begin
   update public.marketplace_sellers set status='active' where id=applicant;
   raise exception 'FAILED: seller unpaused their account';
  exception when others then if SQLERRM not like '%suspended%' then raise; end if; end;
  checks:=checks||jsonb_build_object('test','Suspension blocks uploads and self-reactivation','passed',true);
  if has_function_privilege('anon','public.marketplace_seller_orders()','EXECUTE') or has_function_privilege('anon','public.marketplace_seller_inquiries()','EXECUTE') or has_function_privilege('anon','public.marketplace_seller_fulfil(uuid,text,text,text)','EXECUTE') then raise exception 'FAILED: seller operations exposed anonymously'; end if;
  checks:=checks||jsonb_build_object('test','Seller operations require authentication','passed',true);
  raise exception using errcode='PZ002',message='Rollback seller fixtures';
 exception when sqlstate 'PZ002' then null;
 end;
 insert into pg_temp.laptap_seller_validation_results values(checks);
end $$;
select checks as passed_checks from pg_temp.laptap_seller_validation_results;
