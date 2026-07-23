import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Sign in — Skin Grocer' },
      { name: 'description', content: 'Sign in to Skin Grocer to join The Restock Club and earn points on every order.' },
      { property: 'og:title', content: 'Sign in — Skin Grocer' },
      { property: 'og:description', content: 'Join The Restock Club — earn points on every order.' },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/club' });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        navigate({ to: '/club' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: '/club' });
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
    else if (!result.redirected) navigate({ to: '/club' });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">The Restock Club</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">
        {mode === 'signin' ? 'Welcome back.' : 'Join the club.'}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Earn points on every order. Unlock member pricing, early drops, and a seasonal gift.
      </p>

      <button
        onClick={handleGoogle}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
          />
        )}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          minLength={8}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-primary"
      >
        {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
      </button>

      <Link to="/" className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
        ← Back to Skin Grocer
      </Link>
    </div>
  );
}
