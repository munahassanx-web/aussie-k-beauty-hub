-- 1. Fulfilment guard: only genuinely paid LIVE orders can advance through
-- packing/dispatch/delivery. Enforced in the database so no client, server
-- function or direct call can bypass it.
create or replace function public.guard_order_fulfilment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.fulfillment_status is distinct from old.fulfillment_status
     and new.fulfillment_status in ('packed','shipped','delivered') then
    if coalesce(new.environment,'sandbox') <> 'live' then
      raise exception 'Test/sandbox orders cannot be fulfilled or dispatched';
    end if;
    if coalesce(new.status,'pending') not in ('paid','partially_refunded') then
      raise exception 'Only a paid order can be packed, dispatched or delivered (payment status: %)', coalesce(new.status,'pending');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_order_fulfilment on public.orders;
create trigger trg_guard_order_fulfilment
before update on public.orders
for each row execute function public.guard_order_fulfilment();

-- 2. Honest ledger backfill for paid orders that never had a confirmation
-- attempt (they predate the webhook wiring). This records NOT-sent, so staff
-- can see the gap and choose to send manually. No email is sent by this.
insert into public.order_notifications (order_id, kind, status, provider, recipient_masked, subject, error, attempts)
select o.id,
       'order_confirmation',
       'skipped',
       'none',
       null,
       null,
       'No confirmation was attempted for this order — it predates automated confirmation from the payment webhook. Eligible for a manual send.',
       0
from public.orders o
where o.status = 'paid'
  and not exists (
    select 1 from public.order_notifications n
    where n.order_id = o.id and n.kind = 'order_confirmation'
  );