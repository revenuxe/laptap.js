-- Managed COD orders must never start already paid, including orders entered by admins.
create function public.guard_managed_payment_integrity() returns trigger language plpgsql security definer set search_path=public as $$
declare collected numeric;refunded numeric;
begin
 if not new.managed_by_laptap then return new;end if;
 if TG_OP='INSERT' then
  if new.payment_status<>'unpaid' or new.payment_reference<>'' then raise exception 'Managed orders start unpaid. Record actual cash collection after fulfilment';end if;
 end if;
 if new.payment_method not in('cod','pay_at_pickup') then raise exception 'Managed checkout currently supports cash on delivery or cash at the Laptap hub only';end if;
 if new.payment_status='paid' then
  select coalesce(sum(amount)filter(where kind='collection'),0),coalesce(sum(amount)filter(where kind='refund'),0) into collected,refunded from public.marketplace_money_events where order_id=new.id;
  if collected<>new.amount or refunded<>0 then raise exception 'A paid managed order must have complete, unrefunded COD receipts';end if;
 end if;
 return new;
end $$;
create trigger zzz_managed_payment_integrity before insert or update on public.marketplace_orders for each row execute function public.guard_managed_payment_integrity();
revoke execute on function public.guard_managed_payment_integrity() from public,anon,authenticated;
-- Preserve recovered status and the original transfer history on subsequent note-only updates.
create or replace function public.sync_managed_settlement() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.managed_by_laptap then
  if new.status='delivered' and old.status<>'delivered' then update public.marketplace_settlements set unlock_at=coalesce(unlock_at,now()+make_interval(hours=>new.acceptance_hours)) where order_id=new.id;end if;
  if new.status in('cancelled','refunded') and(new.status is distinct from old.status or new.payment_status is distinct from old.payment_status) then
   update public.marketplace_settlements set status=case when status in('paid','recovery_due') then 'recovery_due' when status='recovered' then 'recovered' else 'void' end,hold_reason=case when status in('paid','recovery_due') then 'Order refunded after payout. Reconcile seller recovery.' else 'Order cancelled or refunded' end where order_id=new.id;
   update public.marketplace_order_operations set stage=case when new.status='cancelled' then 'cancelled' else stage end,updated_at=now() where order_id=new.id;
  end if;
 end if;return new;
end $$;
