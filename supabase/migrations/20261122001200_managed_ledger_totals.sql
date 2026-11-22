-- Keep dashboard totals authoritative even when the visible ledger is paginated.
create function public.admin_marketplace_order_finance(_order_id uuid) returns jsonb language plpgsql stable security definer set search_path=public as $$
begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required';end if;
 return jsonb_build_object('collected',(select coalesce(sum(amount),0) from public.marketplace_money_events where order_id=_order_id and kind='collection'),'refunded',(select coalesce(sum(amount),0) from public.marketplace_money_events where order_id=_order_id and kind='refund'),'cost_total',(select coalesce(sum(amount),0) from public.marketplace_order_costs where order_id=_order_id),'transaction_count',(select count(*) from public.marketplace_money_events where order_id=_order_id),'cost_count',(select count(*) from public.marketplace_order_costs where order_id=_order_id));
end $$;
revoke execute on function public.admin_marketplace_order_finance(uuid) from public,anon;grant execute on function public.admin_marketplace_order_finance(uuid) to authenticated;
create index marketplace_managed_orders_created on public.marketplace_orders(created_at desc,id) where managed_by_laptap;
-- Submitted evidence is part of the review record. Only unreferenced uploads may be removed.
drop policy "Owner removes private marketplace evidence" on storage.objects;
create policy "Owner removes unreferenced private evidence" on storage.objects for delete to authenticated using(bucket_id='marketplace-evidence' and(storage.foldername(name))[1]=auth.uid()::text and public.marketplace_can_upload() and not exists(select 1 from public.marketplace_listing_intake i where i.seller_id=auth.uid() and name=any(i.evidence_paths)));
