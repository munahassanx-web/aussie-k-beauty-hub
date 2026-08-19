-- Staff read path for the Operations panel. RLS still restricts rows to
-- fulfilment staff/admins; without table grants PostgREST returns a
-- permission error before RLS is ever evaluated.
GRANT SELECT ON public.authenticity_cards TO authenticated;
GRANT SELECT ON public.authenticity_card_items TO authenticated;
GRANT SELECT ON public.authenticity_events TO authenticated;
GRANT ALL ON public.authenticity_cards TO service_role;
GRANT ALL ON public.authenticity_card_items TO service_role;
GRANT ALL ON public.authenticity_events TO service_role;

-- These SECURITY DEFINER functions must never be callable anonymously.
REVOKE ALL ON FUNCTION public.issue_authenticity_card(uuid, text, text, text, jsonb, jsonb, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.revoke_authenticity_card(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.record_authenticity_scan(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.issue_authenticity_card(uuid, text, text, text, jsonb, jsonb, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.revoke_authenticity_card(uuid, text) TO authenticated, service_role;
-- Scan counting happens only inside the server-side verification lookup.
GRANT EXECUTE ON FUNCTION public.record_authenticity_scan(uuid) TO service_role;