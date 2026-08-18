-- Warehouse staff must only be able to change fulfilment fields on orders.
REVOKE ALL ON public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES ON public.orders FROM authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT UPDATE (
  fulfillment_status,
  tracking_number,
  shipping_carrier,
  shipping_service,
  shipment_id,
  label_status,
  label_url,
  label_reference,
  shipping_provider,
  shipping_cost_actual_cents,
  ops_notes,
  packed_at,
  shipped_at,
  dispatched_at,
  fulfillment_updated_at,
  fulfillment_updated_by,
  updated_at
) ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;