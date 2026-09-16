ALTER TABLE public.authenticity_card_items
  ADD COLUMN size text,
  ADD COLUMN supplier text,
  ADD COLUMN received_in_melbourne_on date,
  ADD COLUMN checked_on date,
  ADD COLUMN printed_date_type text,
  ADD COLUMN printed_date date,
  ADD COLUMN packaging_seal_status text,
  ADD COLUMN product_condition text,
  ADD COLUMN verification_status text NOT NULL DEFAULT 'Checked before dispatch',
  ADD CONSTRAINT authenticity_item_supplier_check CHECK (supplier IS NULL OR supplier IN ('UMMA', 'Seoul4PM')),
  ADD CONSTRAINT authenticity_item_printed_date_type_check CHECK (printed_date_type IS NULL OR printed_date_type IN ('Expiry date', 'Manufactured date')),
  ADD CONSTRAINT authenticity_item_printed_date_pair_check CHECK ((printed_date_type IS NULL) = (printed_date IS NULL)),
  ADD CONSTRAINT authenticity_item_verification_status_check CHECK (verification_status = 'Checked before dispatch');

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

  IF COALESCE((_checklist->>'products_match')::boolean, false) = false
     OR COALESCE((_checklist->>'branded_packaging')::boolean, false) = false
     OR COALESCE((_checklist->>'catalogue_match')::boolean, false) = false
     OR COALESCE((_checklist->>'packaging_inspected')::boolean, false) = false THEN
    RAISE EXCEPTION 'Complete the required verification checklist before issuing a card';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(_items, '[]'::jsonb)) LOOP
    IF NULLIF(btrim(item->>'size'), '') IS NULL
       OR NULLIF(btrim(item->>'supplier'), '') IS NULL
       OR (item->>'supplier') NOT IN ('UMMA', 'Seoul4PM')
       OR NULLIF(item->>'received_in_melbourne_on', '') IS NULL
       OR NULLIF(item->>'checked_on', '') IS NULL
       OR NULLIF(btrim(item->>'batch_code'), '') IS NULL
       OR NULLIF(btrim(item->>'packaging_seal_status'), '') IS NULL
       OR NULLIF(btrim(item->>'product_condition'), '') IS NULL THEN
      RAISE EXCEPTION 'Complete every required product verification field before issuing a card';
    END IF;
    IF ((NULLIF(item->>'printed_date_type', '') IS NULL) <> (NULLIF(item->>'printed_date', '') IS NULL)) THEN
      RAISE EXCEPTION 'Printed date type and date must be recorded together';
    END IF;
  END LOOP;

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
      (card_id, position, product_name, brand, quantity, sku, size, supplier,
       received_in_melbourne_on, checked_on, batch_code, printed_date_type,
       printed_date, packaging_seal_status, product_condition, verification_status)
    VALUES
      (new_id, idx, COALESCE(item->>'product_name','Item'), item->>'brand',
       GREATEST(1, COALESCE((item->>'quantity')::int, 1)), item->>'sku',
       btrim(item->>'size'), item->>'supplier',
       (item->>'received_in_melbourne_on')::date, (item->>'checked_on')::date,
       btrim(item->>'batch_code'), NULLIF(item->>'printed_date_type', ''),
       NULLIF(item->>'printed_date', '')::date, btrim(item->>'packaging_seal_status'),
       btrim(item->>'product_condition'), 'Checked before dispatch');
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

REVOKE ALL ON FUNCTION public.issue_authenticity_card(uuid, text, text, text, jsonb, jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_authenticity_card(uuid, text, text, text, jsonb, jsonb, text) TO authenticated, service_role;