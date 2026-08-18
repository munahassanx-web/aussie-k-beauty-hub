-- ---------------------------------------------------------------- inventory
CREATE TABLE public.inventory (
  sku text PRIMARY KEY,
  product_name text,
  brand text,
  on_hand integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 3,
  track_inventory boolean NOT NULL DEFAULT true,
  opening_stock_set_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.inventory TO authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfilment staff can read inventory"
  ON public.inventory FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));

CREATE TABLE public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL REFERENCES public.inventory(sku) ON DELETE CASCADE,
  delta integer NOT NULL,
  reason text NOT NULL CHECK (reason IN (
    'initial_stock','purchase_received','sale','return_to_stock','manual_adjustment','damage_writeoff'
  )),
  note text,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  reference text UNIQUE,
  actor uuid,
  resulting_on_hand integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX inventory_movements_sku_idx ON public.inventory_movements (sku, created_at DESC);

GRANT SELECT ON public.inventory_movements TO authenticated;
GRANT ALL ON public.inventory_movements TO service_role;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfilment staff can read inventory movements"
  ON public.inventory_movements FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));

-- ------------------------------------------------------- staff stock actions
CREATE OR REPLACE FUNCTION public.set_opening_stock(
  _sku text, _qty integer, _product_name text DEFAULT NULL, _brand text DEFAULT NULL,
  _low_stock_threshold integer DEFAULT NULL, _note text DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE prev integer; new_qty integer;
BEGIN
  IF NOT public.is_fulfillment_staff(auth.uid()) THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF _qty IS NULL OR _qty < 0 THEN RAISE EXCEPTION 'Opening stock must be zero or more'; END IF;

  INSERT INTO public.inventory (sku, product_name, brand, on_hand, low_stock_threshold, opening_stock_set_at, updated_at)
  VALUES (_sku, _product_name, _brand, _qty, COALESCE(_low_stock_threshold, 3), now(), now())
  ON CONFLICT (sku) DO UPDATE
    SET on_hand = EXCLUDED.on_hand,
        product_name = COALESCE(EXCLUDED.product_name, public.inventory.product_name),
        brand = COALESCE(EXCLUDED.brand, public.inventory.brand),
        low_stock_threshold = COALESCE(_low_stock_threshold, public.inventory.low_stock_threshold),
        opening_stock_set_at = COALESCE(public.inventory.opening_stock_set_at, now()),
        updated_at = now()
  RETURNING on_hand INTO new_qty;

  SELECT COALESCE(SUM(delta), 0) INTO prev FROM public.inventory_movements WHERE sku = _sku;

  INSERT INTO public.inventory_movements (sku, delta, reason, note, actor, resulting_on_hand)
  VALUES (_sku, _qty - prev, 'initial_stock', _note, auth.uid(), new_qty);

  RETURN new_qty;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_inventory_movement(
  _sku text, _delta integer, _reason text, _note text DEFAULT NULL,
  _order_id uuid DEFAULT NULL, _reference text DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_qty integer;
BEGIN
  IF NOT public.is_fulfillment_staff(auth.uid()) THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF _reason NOT IN ('purchase_received','return_to_stock','manual_adjustment','damage_writeoff') THEN
    RAISE EXCEPTION 'Unsupported reason';
  END IF;
  IF _delta = 0 THEN RAISE EXCEPTION 'Adjustment cannot be zero'; END IF;

  SELECT on_hand INTO new_qty FROM public.inventory WHERE sku = _sku FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Set an opening stock count for % first', _sku; END IF;

  UPDATE public.inventory SET on_hand = on_hand + _delta, updated_at = now()
   WHERE sku = _sku RETURNING on_hand INTO new_qty;

  INSERT INTO public.inventory_movements (sku, delta, reason, note, order_id, reference, actor, resulting_on_hand)
  VALUES (_sku, _delta, _reason, _note, _order_id, _reference, auth.uid(), new_qty);

  RETURN new_qty;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_inventory_settings(
  _sku text, _low_stock_threshold integer, _track_inventory boolean
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_fulfillment_staff(auth.uid()) THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  UPDATE public.inventory
     SET low_stock_threshold = GREATEST(0, COALESCE(_low_stock_threshold, low_stock_threshold)),
         track_inventory = COALESCE(_track_inventory, track_inventory),
         updated_at = now()
   WHERE sku = _sku;
  IF NOT FOUND THEN RAISE EXCEPTION 'No inventory row for %', _sku; END IF;
END;
$$;

-- -------------------------------------------------- order-driven decrements
-- Service-role only. `reference` is unique per (order, sku), so a replayed
-- Stripe webhook can never decrement the same order line twice.
CREATE OR REPLACE FUNCTION public.record_order_stock_sale(_order_id uuid, _lines jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  line jsonb; v_sku text; v_qty integer; v_new integer; ref text;
  applied jsonb := '[]'::jsonb; skipped jsonb := '[]'::jsonb;
BEGIN
  FOR line IN SELECT * FROM jsonb_array_elements(COALESCE(_lines, '[]'::jsonb)) LOOP
    v_sku := line->>'sku';
    v_qty := GREATEST(1, COALESCE((line->>'quantity')::int, 1));
    IF v_sku IS NULL THEN CONTINUE; END IF;
    ref := 'sale:' || _order_id::text || ':' || v_sku;

    IF EXISTS (SELECT 1 FROM public.inventory_movements WHERE reference = ref) THEN
      CONTINUE; -- already counted for this order
    END IF;

    SELECT on_hand INTO v_new FROM public.inventory WHERE sku = v_sku AND track_inventory AND opening_stock_set_at IS NOT NULL FOR UPDATE;
    IF NOT FOUND THEN
      skipped := skipped || jsonb_build_object('sku', v_sku, 'quantity', v_qty);
      CONTINUE;
    END IF;

    UPDATE public.inventory SET on_hand = on_hand - v_qty, updated_at = now()
     WHERE sku = v_sku RETURNING on_hand INTO v_new;

    INSERT INTO public.inventory_movements (sku, delta, reason, order_id, reference, resulting_on_hand)
    VALUES (v_sku, -v_qty, 'sale', _order_id, ref, v_new);

    applied := applied || jsonb_build_object('sku', v_sku, 'quantity', v_qty, 'onHand', v_new);
  END LOOP;

  RETURN jsonb_build_object('applied', applied, 'skipped', skipped);
END;
$$;

REVOKE ALL ON FUNCTION public.record_order_stock_sale(uuid, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_order_stock_sale(uuid, jsonb) TO service_role;

-- --------------------------------------------------- minimal public exposure
-- Shoppers learn only WHICH skus are sold out, never how many units exist.
CREATE OR REPLACE FUNCTION public.sold_out_skus()
RETURNS TABLE (sku text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.sku FROM public.inventory i
   WHERE i.track_inventory
     AND i.opening_stock_set_at IS NOT NULL
     AND i.on_hand <= 0
$$;

GRANT EXECUTE ON FUNCTION public.sold_out_skus() TO anon, authenticated, service_role;