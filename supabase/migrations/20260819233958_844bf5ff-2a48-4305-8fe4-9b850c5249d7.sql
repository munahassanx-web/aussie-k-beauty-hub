INSERT INTO public.authenticity_cards
  (order_id, card_ref, token_hash, token_prefix, status, version, checklist, verified_at)
VALUES
  ('0726f4f5-36c1-4e05-a612-0a0d7720b164', 'SG-TEST-0001',
   'b084589564cc8335274d0e023c0d176c5dd49dc3f6ea594a67dbaea4653b2d25', 'TESTTO', 'active', 1,
   '{"products_match":true,"branded_packaging":true,"catalogue_match":true,"packaging_inspected":true,"approved_sourcing_channel":false}'::jsonb,
   now()),
  ('1ced53c5-cd18-4a87-9d8a-b6d306d1af96', 'SG-TEST-0002',
   'a7760c6753d18251327d73727ebf12777796a2d699098fbf27b34ac9320a1f5c', 'TESTTO', 'revoked', 1,
   '{"products_match":true,"branded_packaging":true,"catalogue_match":true,"packaging_inspected":true}'::jsonb,
   now());

INSERT INTO public.authenticity_card_items (card_id, position, product_name, brand, quantity, sku)
SELECT c.id, 0, 'Real Hyaluronic Toner 200ml', 'WELLAGE', 1, 'wellage_real_hyaluronic_toner_200ml_onetime'
FROM public.authenticity_cards c WHERE c.card_ref = 'SG-TEST-0001';

INSERT INTO public.authenticity_card_items (card_id, position, product_name, brand, quantity, sku)
SELECT c.id, 1, 'Hyper PDRN Repair Ampoule 30ml', 'WELLAGE', 2, 'wellage_hyper_pdrn_repair_ampoule_30ml_onetime'
FROM public.authenticity_cards c WHERE c.card_ref = 'SG-TEST-0001';