-- Revoke default EXECUTE on SECURITY DEFINER functions from PUBLIC/authenticated.
-- handle_new_user and tg_updated_at are only invoked by triggers, not by user calls.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_updated_at() FROM PUBLIC, anon, authenticated;

-- my_points_balance is called by signed-in users. Switch to SECURITY INVOKER so
-- RLS on points_ledger governs access (users can already read their own rows).
CREATE OR REPLACE FUNCTION public.my_points_balance()
 RETURNS integer
 LANGUAGE sql
 STABLE
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(SUM(delta), 0)::INTEGER FROM public.points_ledger WHERE user_id = auth.uid();
$function$;