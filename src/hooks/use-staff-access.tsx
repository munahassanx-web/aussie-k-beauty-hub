import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useAuth } from '@/hooks/use-auth';
import { getStaffCapability, type StaffCapability } from '@/lib/staff-access.functions';

const NONE: StaffCapability = { isStaff: false, isAdmin: false };

/**
 * Staff capability for the signed-in user, resolved on the server.
 * Signed-out or non-staff users always resolve to `{ isStaff: false }`.
 */
export function useStaffAccess() {
  const { user, loading } = useAuth();
  const probe = useServerFn(getStaffCapability);

  const q = useQuery({
    queryKey: ['staff-capability', user?.id ?? null],
    queryFn: () => probe(),
    enabled: Boolean(user),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const capability = user && q.data ? q.data : NONE;
  return {
    ...capability,
    loading: loading || (Boolean(user) && q.isLoading),
    signedIn: Boolean(user),
  };
}
