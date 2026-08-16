import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useWishlist } from '@/lib/wishlist';

export function HeartIcon({ filled, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d="M12 20s-7-4.35-7-9.15A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.85C19 15.65 12 20 12 20z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Save/unsave a product. Signed-out visitors are prompted to sign in
 * instead of the click silently doing nothing.
 */
export function WishlistButton({
  productId,
  productName,
  variant = 'icon',
  className = '',
}: {
  productId: string;
  productName: string;
  variant?: 'icon' | 'inline';
  className?: string;
}) {
  const { has, toggle, signedIn } = useWishlist();
  const navigate = useNavigate();
  const saved = has(productId);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggle(productId);
    if (result === 'signed-out') {
      toast('Sign in to save favourites', {
        description: 'Create a free account to keep your wishlist across devices.',
        action: { label: 'Sign in', onClick: () => navigate({ to: '/auth' }) },
      });
      return;
    }
    toast.success(result === 'added' ? `${productName} saved to your wishlist` : `${productName} removed from your wishlist`);
  };

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-7 py-3 text-xs uppercase tracking-wider transition-colors hover:bg-secondary ${saved ? 'text-primary' : 'text-foreground'} ${className}`}
      >
        <HeartIcon filled={saved} size={16} />
        {saved ? 'Saved to wishlist' : 'Save to wishlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      title={signedIn ? undefined : 'Sign in to save favourites'}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-colors hover:text-primary ${saved ? 'text-primary' : 'text-foreground/70'} ${className}`}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
