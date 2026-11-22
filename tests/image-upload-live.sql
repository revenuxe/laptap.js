create temp table image_upload_results(checks jsonb);
do $$
declare s uuid:=gen_random_uuid(); reservation uuid; i integer; checks jsonb:='[]';
begin
 begin
 insert into auth.users(id,email,aud,role,raw_user_meta_data) values(s,'image-qa-'||s||'@example.invalid','authenticated','authenticated',jsonb_build_object('seller_application',true,'full_name','QA Image Owner','shop_name','QA Image Shop','phone','9000000000','city','Bangalore','business_address','QA business address Bangalore 560001'));
 execute 'set local role authenticated';perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',json_build_object('sub',s,'role','authenticated')::text,true);
 reservation:=public.marketplace_claim_image_upload();
 if reservation is null or not public.marketplace_upload_reserved(s||'/'||reservation||'.webp') then raise exception 'FAILED own reservation';end if;
 if public.marketplace_upload_reserved(gen_random_uuid()||'/'||reservation||'.webp') or public.marketplace_upload_reserved(s||'/'||reservation||'.jpg') or public.marketplace_upload_reserved(s||'/'||gen_random_uuid()||'.webp') then raise exception 'FAILED reservation scope';end if;
 checks:=checks||jsonb_build_object('test','Storage reservations bind the seller, generated object name, and WebP extension','passed',true);
 for i in 1..59 loop if public.marketplace_claim_image_upload() is null then raise exception 'FAILED premature hourly quota';end if;end loop;
 if public.marketplace_claim_image_upload() is not null then raise exception 'FAILED hourly quota';end if;
 checks:=checks||jsonb_build_object('test','Hourly upload quota is enforced in the database','passed',true);
 execute 'reset role';update public.marketplace_image_uploads set created_at=now()-interval '2 hours' where seller_id=s;
 if public.marketplace_upload_reserved(s||'/'||reservation||'.webp') then raise exception 'FAILED expired reservation';end if;
 insert into public.marketplace_image_uploads(seller_id,created_at) select s,now()-interval '2 hours' from generate_series(1,240);
 execute 'set local role authenticated';if public.marketplace_claim_image_upload() is not null then raise exception 'FAILED daily quota';end if;
 checks:=checks||jsonb_build_object('test','Daily limits and reservation expiry prevent repeated unlimited uploads','passed',true);
 execute 'reset role';
 if not exists(select 1 from storage.buckets where id='marketplace-images' and file_size_limit=307200 and allowed_mime_types=array['image/webp']) then raise exception 'FAILED bucket constraints';end if;
 if not exists(select 1 from public.marketplace_listings where catalog_search @@ to_tsquery('simple','Latit:* & 542:*')) then raise exception 'FAILED catalog prefix search';end if;
 checks:=checks||jsonb_build_object('test','Bucket limits and indexed catalog model search are configured','passed',true);
 raise exception using errcode='PZ005',message='Rollback image fixtures';
 exception when sqlstate 'PZ005' then null;end;
 insert into pg_temp.image_upload_results values(checks);
end $$;
select checks as passed_checks from pg_temp.image_upload_results;
