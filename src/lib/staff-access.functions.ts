import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

/**
 * Server-authoritative staff capability probe.
 *
 * Returns only the two booleans the UI needs to decide what to render — never
 * role rows, never other users' roles. Authorisation for the actual admin data
 * still lives in each admin server function plus RLS; this is presentation only.
 */
export type StaffCapability = { isStaff: boolean; isAdmin: boolean };

export const getStaffCapability = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffCapability> => {
    const supabase = context.supabase as any;
    const [staff, admin] = await Promise.all([
      supabase.rpc('is_fulfillment_staff', { _user_id: context.userId }),
      supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' }),
    ]);
    return { isStaff: staff.data === true, isAdmin: admin.data === true };
  });
