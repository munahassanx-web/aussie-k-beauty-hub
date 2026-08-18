import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Sign in — Skin Grocer' },
      {
        name: 'description',
        content:
          'Sign in to your Skin Grocer account to see your order history, restock what you already use, and revisit your application guides. An account is optional — guest checkout is always available.',
      },
      { property: 'og:title', content: 'Sign in — Skin Grocer' },
      { property: 'og:description', content: 'Order history, restocking and application guides in one place.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'og:url', content: 'https://skingrocer.com.au/auth' },
      { name: 'robots', content: 'noindex, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/auth' }],
  }),
  component: AuthPage,
});

type Mode = 'signin' | 'signup' | 'forgot' | 'reset';

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // A password-recovery link lands back here with a recovery session, so show
    // the "set a new password" form instead of bouncing to the account page.
    const isRecovery =
      typeof window !== 'undefined' &&
      (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery'));
    if (isRecovery) {
      setMode('reset');
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/account' });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        if (data.session) navigate({ to: '/account' });
        else setNotice('Check your inbox to confirm your email address, then sign in.');
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: '/account' });
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        setNotice('If that email has an account, we’ve sent a reset link. Check your inbox.');
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        navigate({ to: '/account' });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (result.error) setError(result.error.message ?? 'Google sign-in failed');
    else if (!result.redirected) navigate({ to: '/account' });
  }

  const heading =
    mode === 'signup'
      ? 'Create your account.'
      : mode === 'forgot'
        ? 'Reset your password.'
        : mode === 'reset'
          ? 'Choose a new password.'
          : 'Welcome back.';

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Account</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">{heading}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {mode === 'forgot'
          ? 'Enter the email address on your account and we’ll send you a reset link.'
          : mode === 'reset'
            ? 'Enter a new password of at least 8 characters.'
            : 'Your account keeps your order history, restock list and application guides together. You never need one to buy — guest checkout is always available.'}
      </p>

      {(mode === 'signin' || mode === 'signup') && (
        <>
          <button
            onClick={handleGoogle}
            className="mt-8 flex min-h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Continue with Google
          </button>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            aria-label="Your name"
            className="min-h-11 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
          />
        )}
        {mode !== 'reset' && (
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            aria-label="Email"
            className="min-h-11 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
          />
        )}
        {mode !== 'forgot' && (
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'reset' ? 'New password' : 'Password'}
            minLength={8}
            aria-label={mode === 'reset' ? 'New password' : 'Password'}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            className="min-h-11 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
          />
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" aria-live="polite" className="text-sm text-foreground">
            {notice}
          </p>
        )}
        <button
          disabled={busy}
          className="min-h-11 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {busy
            ? 'Please wait…'
            : mode === 'signin'
              ? 'Sign in'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'forgot'
                  ? 'Send reset link'
                  : 'Save new password'}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
        {mode === 'signin' && (
          <>
            <button type="button" onClick={() => setMode('signup')} className="min-h-11 hover:text-primary">
              Don’t have an account? Create one
            </button>
            <button type="button" onClick={() => setMode('forgot')} className="min-h-11 hover:text-primary">
              Forgot your password?
            </button>
          </>
        )}
        {(mode === 'signup' || mode === 'forgot') && (
          <button type="button" onClick={() => setMode('signin')} className="min-h-11 hover:text-primary">
            Already have an account? Sign in
          </button>
        )}
      </div>

      <Link
        to="/"
        className="mt-8 min-h-11 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        ← Back to Skin Grocer
      </Link>
    </div>
  );
}
