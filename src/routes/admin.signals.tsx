import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { generateDraft, listDrafts, listSignals, runHarvest } from "@/lib/signals.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/signals")({
  head: () => ({
    meta: [
      { title: "Seoul Signal desk — Skin Grocer admin" },
      { name: "description", content: "Internal research desk: harvested Korean beauty signals and newsletter drafts awaiting approval." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Seoul Signal desk — Skin Grocer admin" },
      { property: "og:description", content: "Internal research desk for The Skin Grocery List." },
    ],
  }),
  component: SignalDesk,
});

function SignalDesk() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const fetchSignals = useServerFn(listSignals);
  const fetchDrafts = useServerFn(listDrafts);
  const harvest = useServerFn(runHarvest);
  const draft = useServerFn(generateDraft);

  const signalsQ = useQuery({
    queryKey: ["signals"],
    queryFn: () => fetchSignals(),
    enabled: Boolean(user),
    retry: false,
  });
  const draftsQ = useQuery({
    queryKey: ["drafts"],
    queryFn: () => fetchDrafts(),
    enabled: Boolean(user),
    retry: false,
  });

  const harvestM = useMutation({
    mutationFn: () => harvest(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["signals"] }),
  });
  const draftM = useMutation({
    mutationFn: () => draft(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drafts"] }),
  });

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;

  if (!user) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          You need to sign in to reach the research desk.{" "}
          <Link to="/auth" className="underline">Sign in</Link>
        </p>
      </Shell>
    );
  }

  const denied = signalsQ.isError && /admin/i.test(String(signalsQ.error));

  return (
    <Shell>
      {denied && (
        <p className="rounded-sm border border-destructive/40 bg-destructive/5 p-4 text-sm">
          This account isn't an admin. Ask for the admin role to be added to {user.email}.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => harvestM.mutate()}
          disabled={harvestM.isPending}
          className="rounded-full bg-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60"
        >
          {harvestM.isPending ? "Harvesting…" : "Harvest signals now"}
        </button>
        <button
          onClick={() => draftM.mutate()}
          disabled={draftM.isPending}
          className="rounded-full border border-input px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] disabled:opacity-60"
        >
          {draftM.isPending ? "Drafting issue…" : "Draft next issue"}
        </button>
      </div>

      {harvestM.data && (
        <p className="text-sm text-muted-foreground">
          Saved {harvestM.data.saved} items — Reddit {harvestM.data.counts.reddit}, YouTube{" "}
          {harvestM.data.counts.youtube}
          {!harvestM.data.youtubeEnabled && " (no API key)"}, Korean web {harvestM.data.counts.web}
          {!harvestM.data.firecrawlEnabled && " (Firecrawl not connected)"}.
        </p>
      )}
      {harvestM.isError && <Err e={harvestM.error} />}
      {draftM.isError && <Err e={draftM.error} />}

      <section>
        <h2 className="font-display text-2xl">Drafts</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {(draftsQ.data ?? []).map((d) => (
            <Link
              key={d.id}
              to="/admin/issues/$id"
              params={{ id: d.id }}
              className="flex items-baseline justify-between gap-4 py-4 hover:opacity-70"
            >
              <span className="text-sm">
                <span className="font-semibold">#{d.issue_number}</span> {d.title}
                <span className="ml-2 text-muted-foreground">{d.theme}</span>
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {d.status}
              </span>
            </Link>
          ))}
          {draftsQ.data?.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">No drafts yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Top signals</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {(signalsQ.data ?? []).map((s) => (
            <a
              key={s.id}
              href={s.source_url}
              target="_blank"
              rel="noreferrer"
              className="block py-4 hover:opacity-70"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {s.source} · score {Number(s.score).toFixed(0)}
                {s.ingredient ? ` · ${s.ingredient}` : ""}
                {s.brand ? ` · ${s.brand}` : ""}
              </p>
              <p className="mt-1 text-sm">{s.title}</p>
            </a>
          ))}
          {signalsQ.data?.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">
              Nothing harvested yet — run a harvest.
            </p>
          )}
        </div>
      </section>
    </Shell>
  );
}

function Err({ e }: { e: unknown }) {
  return (
    <p className="rounded-sm border border-destructive/40 bg-destructive/5 p-4 text-sm">
      {String((e as Error)?.message ?? e)}
    </p>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Internal
        </p>
        <h1 className="mt-3 font-display text-4xl">The Seoul Signal desk</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Harvest Korean market chatter, draft the next Skin Grocery List, fact-check it, then
          approve. Nothing publishes without your approval.
        </p>
      </header>
      {children}
    </div>
  );
}
