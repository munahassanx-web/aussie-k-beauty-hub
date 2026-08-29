import { z } from 'zod';

/** Shared shape for the "ask us to stock it" request form. */
export const stockRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(255, 'Email must be less than 255 characters'),
  name: z.string().trim().max(100, 'Name must be less than 100 characters').optional(),
  productBrand: z.string().trim().max(120, 'Brand must be less than 120 characters').optional(),
  productName: z
    .string()
    .trim()
    .min(2, 'Tell us which product you want')
    .max(200, 'Product name must be less than 200 characters'),
  note: z.string().trim().max(1000, 'Note must be less than 1000 characters').optional(),
  source: z.string().trim().max(60).optional(),
});

export type StockRequestData = z.infer<typeof stockRequestSchema>;
