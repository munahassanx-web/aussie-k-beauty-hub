import { createServerFn } from '@tanstack/react-start';

import { stockRequestSchema } from '@/lib/stock-request';

export const submitStockRequest = createServerFn({ method: 'POST' })
  .inputValidator((data) => stockRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { recordStockRequest } = await import('@/lib/stock-request.server');
    return recordStockRequest(data);
  });
