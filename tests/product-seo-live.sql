create temp table seo_validation(results jsonb);
do $$
declare a uuid; d uuid:=gen_random_uuid(); route text; checks jsonb:='[]';
begin
 select user_id into a from public.user_roles where role='admin' limit 1;
 begin
 perform set_config('request.jwt.claim.sub',a::text,true);perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 if not exists(select 1 from public.marketplace_listings where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001' and seo_path='dell/latitude/5420') then raise exception 'FAILED readable path';end if;
 insert into public.marketplace_listings(id,seller_id,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,status)
 select d,a,seller_name,title,brand,category,price,year,condition,description,processor,ram,storage,graphics,display,battery,defects,accessories,location,seller_warranty_months,warranty_terms,images,'draft' from public.marketplace_listings where id='9af8d415-26e1-4b7d-9f2c-0d7a7e988001';
 select seo_path into route from public.marketplace_listings where id=d;
 if route='dell/latitude/5420' or route not like 'dell/latitude/5420-%' or route like '%'||d::text||'%' then raise exception 'FAILED duplicate URL';end if;
 checks:=checks||jsonb_build_object('test','Duplicate models use readable configuration suffixes without UUIDs','passed',true);
 update public.marketplace_listings set title='Updated QA title',seo_path='malicious/new/path' where id=d;
 if not exists(select 1 from public.marketplace_listings where id=d and seo_path=route) then raise exception 'FAILED stable path';end if;
 checks:=checks||jsonb_build_object('test','Product URLs stay stable after title edits or path tampering','passed',true);
 raise exception using errcode='PZ004',message='Rollback SEO fixtures';
 exception when sqlstate 'PZ004' then null;end;
 insert into pg_temp.seo_validation values(checks);
end $$;
select results as passed_checks from pg_temp.seo_validation;
