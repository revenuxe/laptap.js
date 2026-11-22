-- Rollback-only private listing defaults. No email or real listing changes.
create temp table defaults_results(checks jsonb);
do $$
declare a uuid;s uuid:=gen_random_uuid();other uuid:=gen_random_uuid();d uuid:=gen_random_uuid();d2 uuid:=gen_random_uuid();p jsonb;intake jsonb;r jsonb;checks jsonb:='[]';
begin
 select user_id into a from public.user_roles where role='admin' limit 1;
 begin
 insert into auth.users(id,email,email_confirmed_at,aud,role,raw_user_meta_data) select id,'defaults-'||id||'@example.invalid',now(),'authenticated','authenticated',jsonb_build_object('seller_application',true,'full_name','QA Seller','shop_name','QA Defaults Shop','phone','9000000000','city','Bangalore','business_address','QA original shop address 560001') from unnest(array[s,other]) id;
 perform set_config('request.jwt.claim.sub',a::text,true);update public.marketplace_sellers set status='active' where id in(s,other);
 select to_jsonb(l)||'{"title":"QA remembered defaults","price":30000,"seller_warranty_months":6,"warranty_terms":"QA warranty coverage exclusions and contact process"}' into p from public.marketplace_listings l where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
 intake:='{"ownership_confirmed":false,"accepted_terms":false,"collection_address":"QA saved pickup address 560002","collection_instructions":"QA weekdays after 2pm","serial_number":"","diagnostic_notes":"","evidence_paths":[]}';
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',s::text,true);
 if public.marketplace_listing_defaults()<>'{}'::jsonb then raise exception 'FAILED initial empty defaults';end if;
 perform public.marketplace_save_device(d,p,intake,false,1);
 r:=public.marketplace_listing_defaults();
 if r->>'collection_address'<>'QA saved pickup address 560002' or r->>'collection_instructions'<>'QA weekdays after 2pm' or(r->>'seller_warranty_months')::integer<>6 or r->>'warranty_terms'<>p->>'warranty_terms' then raise exception 'FAILED saved defaults';end if;
 if r?'serial_number' or r?'accepted_terms' or r?'ownership_confirmed' or r?'price' or r?'evidence_paths' then raise exception 'FAILED copied per-product or consent fields';end if;
 perform set_config('request.jwt.claim.sub',other::text,true);
 if public.marketplace_listing_defaults()<>'{}'::jsonb or exists(select 1 from public.marketplace_seller_listing_defaults where seller_id=s) then raise exception 'FAILED other seller privacy';end if;
 begin insert into public.marketplace_seller_listing_defaults(seller_id,collection_address) values(s,'QA attacker address');raise exception 'FAILED direct prefs write';exception when insufficient_privilege then null;end;
 execute 'set local role anon';perform set_config('request.jwt.claim.sub','',true);
 begin perform public.marketplace_listing_defaults();raise exception 'FAILED anonymous prefs';exception when insufficient_privilege then null;end;
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',s::text,true);
 -- An unsuccessful listing save must leave remembered details unchanged.
 begin perform public.marketplace_save_device(gen_random_uuid(),p||'{"price":-1}',intake||'{"collection_address":"QA must not persist address"}',false,1);raise exception 'FAILED invalid product';exception when check_violation then null;end;
 if public.marketplace_listing_defaults()<>r then raise exception 'FAILED non-atomic defaults';end if;
 perform public.marketplace_save_device(d2,p||'{"seller_warranty_months":0,"warranty_terms":""}',intake||'{"collection_address":"QA revised pickup address 560003","collection_instructions":""}',false,1);
 r:=public.marketplace_listing_defaults();if r->>'collection_address'<>'QA revised pickup address 560003' or(r->>'seller_warranty_months')::integer<>0 or r->>'warranty_terms'<>'' or r->>'collection_instructions'<>'' then raise exception 'FAILED updated defaults';end if;
 perform public.marketplace_delete_product(d2);
 if public.marketplace_listing_defaults()<>r then raise exception 'FAILED deleting listing removed preferences';end if;
 checks:=checks||jsonb_build_object('test','Pickup address/instructions and warranty defaults persist atomically with saves, update on later saves, remain private to the seller, and survive deletion; product-specific data and consent are not copied','passed',true);
 raise exception using errcode='PZ010',message='Rollback defaults fixtures';exception when sqlstate 'PZ010' then null;end;
 insert into pg_temp.defaults_results values(checks);
end $$;
select checks as passed_checks from pg_temp.defaults_results;
