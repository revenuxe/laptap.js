-- Restrict direct RPC access to internal trigger functions. Existing triggers continue
-- to run; their row security and admin-role checks remain in effect.
revoke execute on function
 public.guard_marketplace_verification(),
 public.register_marketplace_seller(),
 public.guard_marketplace_order(),
 public.reserve_marketplace_order_device(),
 public.log_marketplace_activity(),
 public.guard_marketplace_listing_reservation(),
 public.guard_marketplace_order_initial_payment(),
 public.guard_marketplace_demo_listing(),
 public.prevent_demo_marketplace_transactions(),
 public.handle_new_user(),
 public.rls_auto_enable(),
 public.assign_sell_order_number()
from public,anon,authenticated;
-- This legacy function grants admin access; it is not a client-side capability.
revoke execute on function public.make_user_admin(text) from public,anon,authenticated;
grant execute on function public.make_user_admin(text) to service_role;
-- These helpers are used by the existing pickup-order trigger.
alter function public.generate_sell_order_number() set search_path=public;
alter function public.assign_sell_order_number() set search_path=public;
-- Explicit grants retain the two safe boolean helpers used inside row policies.
revoke execute on function public.marketplace_seller_active(uuid) from public;
grant execute on function public.marketplace_seller_active(uuid) to anon,authenticated,service_role;
create index marketplace_orders_seller_id_idx on public.marketplace_orders(seller_id);
create index marketplace_orders_listing_id_idx on public.marketplace_orders(listing_id);
create index marketplace_returns_order_id_idx on public.marketplace_returns(order_id);
create index marketplace_activity_entity_idx on public.marketplace_activity(entity_type,entity_id);
