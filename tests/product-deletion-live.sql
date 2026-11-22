-- Rollback-only deletion checks. No real listing is deleted.
create temp table deletion_results(checks jsonb);
do $$
declare a uuid;s uuid:=gen_random_uuid();b uuid:=gen_random_uuid();other uuid:=gen_random_uuid();d uuid:=gen_random_uuid();d2 uuid:=gen_random_uuid();d3 uuid:=gen_random_uuid();p jsonb;policy jsonb;intake jsonb;addr jsonb;r jsonb;o uuid;checks jsonb:='[]';passed jsonb:='{"display":true,"keyboard":true,"battery":true,"storage":true,"ports":true,"performance":true,"bios":true,"ownership":true,"serial_match":true}';
begin
 select user_id into a from public.user_roles where role='admin' limit 1;
 begin
 insert into auth.users(id,email,email_confirmed_at,aud,role,raw_user_meta_data) values(s,'delete-seller-'||s||'@example.invalid',now(),'authenticated','authenticated',jsonb_build_object('seller_application',true,'full_name','QA Seller','shop_name','QA Delete Shop','phone','9000000000','city','Bangalore','business_address','QA private address Bangalore 560001')),(b,'delete-buyer-'||b||'@example.invalid',now(),'authenticated','authenticated','{}'),(other,'delete-other-'||other||'@example.invalid',now(),'authenticated','authenticated','{}');
 perform set_config('request.jwt.claim.sub',a::text,true);update public.marketplace_sellers set status='active' where id=s;
 policy:=public.admin_marketplace_save_policy(public.marketplace_managed_policy()||'{"service_pincodes":["560001"],"hub_address":"QA Laptap hub Bangalore 560001"}');
 select to_jsonb(l)||'{"title":"QA product removal","price":30000,"stock_quantity":2}' into p from public.marketplace_listings l where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
 intake:='{"ownership_confirmed":true,"accepted_terms":true,"collection_address":"QA private collection Bangalore 560001","serial_number":"","diagnostic_notes":"","evidence_paths":[]}';addr:='{"name":"QA Buyer","phone":"9000000001","line1":"QA Buyer house street","city":"Bangalore","state":"Karnataka","pincode":"560001"}';
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',s::text,true);
 perform public.marketplace_save_device(d,p,intake,false,(policy->>'version')::integer);
 perform public.marketplace_save_device(d2,p,intake,true,(policy->>'version')::integer);
 perform public.marketplace_save_device(d3,p,intake,true,(policy->>'version')::integer);
 -- Metadata cannot be forged through ordinary updates, nor can a seller write deletion records.
 update public.marketplace_listings set deleted_at=now(),deleted_by=s where id=d;
 if not exists(select 1 from public.marketplace_listings where id=d and deleted_at is null) then raise exception 'FAILED forged deletion';end if;
 begin insert into public.marketplace_listing_deletions(listing_id,actor_id) values(d,s);raise exception 'FAILED direct tombstone insert';exception when insufficient_privilege then null;end;
 perform set_config('request.jwt.claim.sub',other::text,true);
 begin perform public.marketplace_delete_product(d);raise exception 'FAILED other seller deletion';exception when others then if SQLERRM not like '%product owner or an admin%' then raise;end if;end;
 execute 'set local role anon';perform set_config('request.jwt.claim.sub','',true);
 begin perform public.marketplace_delete_product(d);raise exception 'FAILED anonymous deletion';exception when insufficient_privilege then null;end;
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',s::text,true);
 perform public.marketplace_delete_product(d);perform public.marketplace_delete_product(d);
 if exists(select 1 from public.marketplace_listings where id=d) then raise exception 'FAILED seller deleted visibility';end if;
 begin perform public.marketplace_save_device(d,p,intake,true,(policy->>'version')::integer);raise exception 'FAILED deleted resubmission';exception when others then if SQLERRM not like '%has been deleted%' then raise;end if;end;
 checks:=checks||jsonb_build_object('test','Owner deletion is idempotent; anonymous/other-user deletion and forged metadata are blocked; deleted listings disappear from seller inventory and cannot be resubmitted','passed',true);
 perform set_config('request.jwt.claim.sub',a::text,true);
 if not exists(select 1 from public.marketplace_listings where id=d and deleted_at is not null and deleted_by=s and status='draft') then raise exception 'FAILED retained deletion record';end if;
 perform public.marketplace_delete_product(d2);
 if not exists(select 1 from public.marketplace_activity where entity_id=d2 and action='Product deleted' and actor_id=a) then raise exception 'FAILED admin delete audit';end if;
 perform public.admin_marketplace_review_listing(d3,'approved','',true);
 perform set_config('request.jwt.claim.sub',b::text,true);
 r:=public.marketplace_place_order(gen_random_uuid(),jsonb_build_array(jsonb_build_object('listing_id',d3,'fulfillment_method','delivery')),addr,30299,true);o:=(r->'order_ids'->>0)::uuid;
 perform set_config('request.jwt.claim.sub',s::text,true);perform public.marketplace_delete_product(d3);
 if not exists(select 1 from public.marketplace_seller_orders() where id=o) then raise exception 'FAILED seller order history lost';end if;
 perform set_config('request.jwt.claim.sub',b::text,true);
 if not exists(select 1 from jsonb_array_elements(public.marketplace_buyer_orders()) row where row->>'id'=o::text and row->'product_snapshot'->>'title'='QA product removal') then raise exception 'FAILED buyer history lost';end if;
 begin perform public.marketplace_place_order(gen_random_uuid(),jsonb_build_array(jsonb_build_object('listing_id',d3,'fulfillment_method','delivery')),addr,30299,true);raise exception 'FAILED new checkout deleted';exception when others then if SQLERRM not like '%no longer available%' then raise;end if;end;
 execute 'set local role anon';perform set_config('request.jwt.claim.sub','',true);
 if exists(select 1 from public.marketplace_listings where id in(d,d2,d3)) then raise exception 'FAILED public deleted visibility';end if;
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',a::text,true);
 if not exists(select 1 from public.marketplace_settlements where order_id=o and status='pending' and seller_net=27300) then raise exception 'FAILED settlement history lost';end if;
 begin update public.marketplace_listings set status='published',deleted_at=null,deleted_by=null where id=d3;raise exception 'FAILED deleted republish';exception when others then if SQLERRM not like '%Deleted products cannot be published%' then raise;end if;end;
 perform public.admin_marketplace_operation(o,'confirm','{"note":"QA existing order remains manageable"}');perform public.admin_marketplace_operation(o,'schedule_inspection',jsonb_build_object('assigned_to','QA inspector','inspection_at',now()));perform public.admin_marketplace_operation(o,'inspection_passed',jsonb_build_object('checks',passed,'serial_number','QA-DELETED-UNIT-001','report','QA existing laptop inspected after listing was removed.'));
 if not exists(select 1 from public.marketplace_orders where id=o and status='confirmed') then raise exception 'FAILED retained order operations';end if;
 -- Demo deletion is supported for admins without destroying the demo record.
 perform public.marketplace_delete_product('9af8d415-26e1-4b7d-9f2c-0d7a7e988001');
 if not exists(select 1 from public.marketplace_listings where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001' and deleted_at is not null and is_demo) then raise exception 'FAILED admin demo removal';end if;
 checks:=checks||jsonb_build_object('test','Admins can remove seller/demo listings; removed products cannot be bought or republished; existing buyer/seller orders, payout history and inspection operations remain intact','passed',true);
 raise exception using errcode='PZ009',message='Rollback deletion fixtures';exception when sqlstate 'PZ009' then null;end;
 insert into pg_temp.deletion_results values(checks);
end $$;
select checks as passed_checks from pg_temp.deletion_results;
