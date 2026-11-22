-- Resolve support without stranding an otherwise completed order in return_requested.
create function public.admin_marketplace_resolve_managed_case(_case_id uuid,_decision text,_resolution text,_resume_delivery boolean default false) returns void language plpgsql security definer set search_path=public as $$
declare order_id uuid;o public.marketplace_orders;
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 select r.order_id into order_id from public.marketplace_returns r where id=_case_id;
 select * into o from public.marketplace_orders where id=order_id for update;
 if o.id is null or not o.managed_by_laptap then raise exception 'Choose a managed order support case';end if;
 if _decision not in('reviewing','resolved','declined') or length(trim(coalesce(_resolution,'')))<10 then raise exception 'Record a clear support decision and resolution note';end if;
 update public.marketplace_returns set status=_decision,resolution=left(trim(_resolution),3000) where id=_case_id;
 if _resume_delivery then
  if _decision not in('resolved','declined') or o.status<>'return_requested' or o.payment_status='refunded' or exists(select 1 from public.marketplace_returns where marketplace_returns.order_id=o.id and status in('open','reviewing')) then raise exception 'Resolve every open case before restoring a completed, non-refunded delivery';end if;
  update public.marketplace_orders set status='delivered' where id=o.id;
 end if;
 insert into public.marketplace_activity(actor_id,entity_type,entity_id,action,details) values(auth.uid(),'orders',o.id,'Managed support decision',jsonb_build_object('case_id',_case_id,'decision',_decision,'resume_delivery',_resume_delivery));
end $$;
revoke execute on function public.admin_marketplace_resolve_managed_case(uuid,text,text,boolean) from public,anon;grant execute on function public.admin_marketplace_resolve_managed_case(uuid,text,text,boolean) to authenticated;
