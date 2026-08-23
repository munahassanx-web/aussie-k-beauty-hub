REVOKE EXECUTE ON FUNCTION public.sold_out_skus() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sold_out_skus() FROM anon;
GRANT EXECUTE ON FUNCTION public.sold_out_skus() TO authenticated;
GRANT EXECUTE ON FUNCTION public.sold_out_skus() TO service_role;