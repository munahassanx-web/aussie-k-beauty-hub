REVOKE ALL ON FUNCTION public.set_opening_stock(text,integer,text,text,integer,text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.apply_inventory_movement(text,integer,text,text,uuid,text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_inventory_settings(text,integer,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_opening_stock(text,integer,text,text,integer,text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.apply_inventory_movement(text,integer,text,text,uuid,text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_inventory_settings(text,integer,boolean) TO authenticated, service_role;