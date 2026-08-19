-- =====================================================================
-- Phase 1: per-order QR authenticity / provenance cards
-- Additive only. Does not touch orders, payments, inventory or emails.
-- =====================================================================

CREATE TABLE public.authenticity_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  card_ref text NOT NULL UNIQUE,
  token_hash text NOT NULL UNIQUE,
  token_prefix text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  version integer NOT NULL DEFAULT 1,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  issued_by uuid,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  verified_at timestamp with time zone,
  revoked_at timestamp with time zone,
  revoked_reason text,
  scan_count integer NOT NULL DEFAULT 0,
  first_scanned_at timestamp with time zone,
  last_scanned_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT authenticity_cards_status_check
    CHECK (status IN ('active','revoked','superseded'))
);

CREATE INDEX authenticity_cards_order_idx ON public.authenticity_cards (order_id);
CREATE UNIQUE INDEX authenticity_cards_one_active_per_order
  ON public.authenticity_cards (order_id) WHERE status = 'active';

GRANT SELECT ON public.authenticity_cards TO authenticated;
GRANT ALL ON public.authenticity_cards TO service_role;
ALTER TABLE public.authenticity_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfilment staff can read authenticity cards"
  ON public.authenticity_cards FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));

CREATE TRIGGER trg_authenticity_cards_updated
  BEFORE UPDATE ON public.authenticity_cards
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- ---------------------------------------------------------------- items
CREATE TABLE public.authenticity_card_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.authenticity_cards(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  product_name text NOT NULL,
  brand text,
  quantity integer NOT NULL DEFAULT 1,
  sku text,
  -- Phase 2 evidence slots. Stay NULL until a real record backs them, so the
  -- public page can never render an unsupported provenance claim.
  batch_code text,
  origin_country text,
  supplier_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX authenticity_card_items_card_idx ON public.authenticity_card_items (card_id);

GRANT SELECT ON public.authenticity_card_items TO authenticated;
GRANT ALL ON public.authenticity_card_items TO service_role;
ALTER TABLE public.authenticity_card_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfilment staff can read authenticity card items"
  ON public.authenticity_card_items FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));

-- --------------------------------------------------------------- events
CREATE TABLE public.authenticity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.authenticity_cards(id) ON DELETE CASCADE,
  event text NOT NULL,
  actor uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT authenticity_events_event_check
    CHECK (event IN ('issued','verified','reissued','revoked','scanned'))
);

CREATE INDEX authenticity_events_card_idx ON public.authenticity_events (card_id, created_at DESC);

GRANT SELECT ON public.authenticity_events TO authenticated;
GRANT ALL ON public.authenticity_events TO service_role;
ALTER TABLE public.authenticity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfilment staff can read authenticity events"
  ON public.authenticity_events FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));

-- ============================== controlled staff write paths ==========

CREATE OR REPLACE FUNCTION public.issue_authenticity_card(
  _order_id uuid,
  _card_ref text,
  _token_hash text,
  _token_prefix text,
  _checklist jsonb,
  _items jsonb,
  _reissue_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  prev record;
  new_id uuid;
  next_version integer := 1;
  item jsonb;
  idx integer := 0;
BEGIN
  IF NOT public.is_fulfillment_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.orders WHERE id = _order_id) THEN
    RAISE EXCEPTION 'Unknown order';
  END IF;

  -- Required checklist evidence. Optional keys (e.g. sourcing channel) are
  -- deliberately NOT required and only display when explicitly confirmed.
  IF COALESCE((_checklist->>'products_match')::boolean, false) = false
     OR COALESCE((_checklist->>'branded_packaging')::boolean, false) = false
     OR COALESCE((_checklist->>'catalogue_match')::boolean, false) = false
     OR COALESCE((_checklist->>'packaging_inspected')::boolean, false) = false THEN
    RAISE EXCEPTION 'Complete the required verification checklist before issuing a card';
  END IF;

  SELECT id, version INTO prev
    FROM public.authenticity_cards
   WHERE order_id = _order_id AND status = 'active'
   FOR UPDATE;

  IF FOUND THEN
    next_version := prev.version + 1;
    UPDATE public.authenticity_cards
       SET status = 'superseded', updated_at = now()
     WHERE id = prev.id;
    INSERT INTO public.authenticity_events (card_id, event, actor, metadata)
    VALUES (prev.id, 'reissued', auth.uid(),
            jsonb_build_object('reason', _reissue_reason, 'superseded_by_version', next_version));
  END IF;

  INSERT INTO public.authenticity_cards
    (order_id, card_ref, token_hash, token_prefix, version, checklist, issued_by, verified_at)
  VALUES
    (_order_id, _card_ref, _token_hash, _token_prefix, next_version, _checklist, auth.uid(), now())
  RETURNING id INTO new_id;

  FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(_items, '[]'::jsonb)) LOOP
    INSERT INTO public.authenticity_card_items
      (card_id, position, product_name, brand, quantity, sku)
    VALUES
      (new_id, idx, COALESCE(item->>'product_name','Item'), item->>'brand',
       GREATEST(1, COALESCE((item->>'quantity')::int, 1)), item->>'sku');
    idx := idx + 1;
  END LOOP;

  INSERT INTO public.authenticity_events (card_id, event, actor, metadata)
  VALUES (new_id, CASE WHEN next_version > 1 THEN 'reissued' ELSE 'issued' END, auth.uid(),
          jsonb_build_object('version', next_version, 'reason', _reissue_reason));
  INSERT INTO public.authenticity_events (card_id, event, actor, metadata)
  VALUES (new_id, 'verified', auth.uid(), jsonb_build_object('checklist', _checklist));

  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.revoke_authenticity_card(_card_id uuid, _reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_fulfillment_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF _reason IS NULL OR length(btrim(_reason)) < 3 THEN
    RAISE EXCEPTION 'A revoke reason is required';
  END IF;

  UPDATE public.authenticity_cards
     SET status = 'revoked', revoked_at = now(), revoked_reason = btrim(_reason), updated_at = now()
   WHERE id = _card_id AND status <> 'revoked';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found or already revoked';
  END IF;

  INSERT INTO public.authenticity_events (card_id, event, actor, metadata)
  VALUES (_card_id, 'revoked', auth.uid(), jsonb_build_object('reason', btrim(_reason)));
END;
$function$;

-- Scan recording: timestamp + counter only. No IP, agent, or identity.
CREATE OR REPLACE FUNCTION public.record_authenticity_scan(_card_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.authenticity_cards
     SET scan_count = scan_count + 1,
         first_scanned_at = COALESCE(first_scanned_at, now()),
         last_scanned_at = now()
   WHERE id = _card_id;

  INSERT INTO public.authenticity_events (card_id, event, metadata)
  VALUES (_card_id, 'scanned', '{}'::jsonb);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.record_authenticity_scan(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_authenticity_scan(uuid) TO service_role;