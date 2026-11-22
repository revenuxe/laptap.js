-- Disposable fixtures are rolled back; no real accounts are changed.
create temp table admin_seller_results(result jsonb);
do $$
declare a uuid; s uuid:=gen_random_uuid(); p jsonb; d uuid:=gen_random_uuid(); o uuid:=gen_random_uuid(); checks jsonb:='[]';
begin
 select user_id into a from public.user_roles where role='admin' limit 1;
 begin
 insert into auth.users(id,email,aud,role,raw_user_meta_data) values(s,'admin-controls-'||s||'@example.invalid','authenticated','authenticated',jsonb_build_object('seller_application',true,'full_name','QA Owner','shop_name','QA Controls Shop','phone','9000000000','city','Bangalore','business_address','QA business address, Bangalore 560001'));
 execute 'set local role authenticated';
 perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',json_build_object('sub',s,'role','authenticated')::text,true);
 begin perform public.admin_marketplace_seller_preview(s);raise exception 'FAILED unauthorized preview';exception when others then if SQLERRM not like '%Admin access required%' then raise;end if;end;
 begin perform public.admin_marketplace_seller_action(s,'delete','Valid QA deletion reason','QA Controls Shop');raise exception 'FAILED unauthorized delete';exception when others then if SQLERRM not like '%Admin access required%' then raise;end if;end;
 checks:=checks||jsonb_build_object('test','Seller cannot call admin lifecycle RPCs','passed',true);
 perform set_config('request.jwt.claim.sub',a::text,true);perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 update public.marketplace_sellers set status='active' where id=s;
 insert into public.marketplace_seller_admin_notes(seller_id,body) values(s,'QA private review note');
 begin perform public.admin_marketplace_seller_action(s,'delete','Valid QA deletion reason','wrong');raise exception 'FAILED confirmation';exception when others then if SQLERRM not like '%exact shop name%' then raise;end if;end;
 begin perform public.admin_marketplace_seller_action(s,'delete',null,'QA Controls Shop');raise exception 'FAILED null reason';exception when others then if SQLERRM not like '%action reason%' then raise;end if;end;
 checks:=checks||jsonb_build_object('test','Exact confirmation and substantive reason required','passed',true);
 perform public.admin_marketplace_seller_action(s,'suspend','QA suspension for review');
 if public.marketplace_can_upload() is not true then raise exception 'FAILED admin access';end if;
 perform public.admin_marketplace_seller_action(s,'reactivate','QA reactivation reviewed');
 execute 'reset role';
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,status)
 select d,s,'QA Controls Shop','QA lifecycle device',brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,'Bangalore',seller_warranty_months,warranty_terms,images,'published' from public.marketplace_listings where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
 execute 'set local role authenticated';
 insert into public.marketplace_orders(id,order_number,listing_id,seller_id,buyer_name,email,phone,address,amount) overriding system value values(o,-9300001,d,s,'QA Buyer','qa@example.invalid','9000000000','QA delivery address Bangalore',28500);
 begin perform public.admin_marketplace_seller_action(s,'delete','QA deletion fully reviewed','QA Controls Shop');raise exception 'FAILED open order deletion';exception when others then if SQLERRM not like '%Resolve open orders%' then raise;end if;end;
 update public.marketplace_orders set status='cancelled' where id=o;
 insert into public.marketplace_returns(order_id,reason) values(o,'QA unresolved support issue');
 begin perform public.admin_marketplace_seller_action(s,'delete','QA deletion fully reviewed','QA Controls Shop');raise exception 'FAILED open case deletion';exception when others then if SQLERRM not like '%Resolve open support cases%' then raise;end if;end;
 update public.marketplace_returns set status='resolved',resolution='QA issue resolved and recorded' where order_id=o;
 update public.marketplace_listings set status='published' where id=d;
 checks:=checks||jsonb_build_object('test','Open orders and unresolved support cases block deletion','passed',true);
 perform public.admin_marketplace_seller_action(s,'delete','QA deletion fully reviewed','QA Controls Shop');
 if not exists(select 1 from public.marketplace_sellers where id=s and status='deleted' and deleted_at is not null and deleted_by=a) then raise exception 'FAILED deletion metadata';end if;
 if not exists(select 1 from public.marketplace_listings where id=d and status='draft') then raise exception 'FAILED hidden stock';end if;
 checks:=checks||jsonb_build_object('test','Suspension, reactivation and audited deletion succeed for admin','passed',true);
 perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',json_build_object('sub',s,'role','authenticated')::text,true);
 if public.marketplace_can_upload() or public.marketplace_seller_has_access(s) then raise exception 'FAILED deleted access';end if;
 if exists(select 1 from public.marketplace_seller_admin_notes where seller_id=s) then raise exception 'FAILED private notes leaked';end if;
 begin update public.marketplace_sellers set status='pending' where id=s;raise exception 'FAILED self restore';exception when others then if SQLERRM not like '%admin-only%' then raise;end if;end;
 checks:=checks||jsonb_build_object('test','Deleted seller loses marketplace access and cannot read admin notes or restore itself','passed',true);
 perform set_config('request.jwt.claim.sub',a::text,true);perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 perform public.admin_marketplace_seller_action(s,'restore','QA restore for business review');
 if not exists(select 1 from public.marketplace_sellers where id=s and status='pending' and deleted_at is null and approved_at is null) then raise exception 'FAILED restore review';end if;
 if not exists(select 1 from public.marketplace_seller_admin_notes where seller_id=s) then raise exception 'FAILED retained notes';end if;
 checks:=checks||jsonb_build_object('test','Restoration requires approval again and preserves private history','passed',true);
 raise exception using errcode='PZ003',message='Rollback admin control fixtures';
 exception when sqlstate 'PZ003' then null;end;
 if exists(select 1 from auth.users where id=s) then raise exception 'FAILED fixture rollback';end if;
 insert into pg_temp.admin_seller_results values(checks);
end $$;
select result as passed_checks from pg_temp.admin_seller_results;
