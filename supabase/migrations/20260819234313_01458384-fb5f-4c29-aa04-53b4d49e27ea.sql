DELETE FROM public.authenticity_events
 WHERE card_id IN (SELECT id FROM public.authenticity_cards WHERE card_ref LIKE 'SG-TEST-%');
DELETE FROM public.authenticity_card_items
 WHERE card_id IN (SELECT id FROM public.authenticity_cards WHERE card_ref LIKE 'SG-TEST-%');
DELETE FROM public.authenticity_cards WHERE card_ref LIKE 'SG-TEST-%';