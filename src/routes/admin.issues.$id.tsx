import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDraft, runFactCheck, setDraftStatus } from "@/lib/signals.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/issues/$id")({
  head: () => ({
    meta: [
      { title: "Review issue draft — Skin Grocer admin" },
      { name: "description", content: "Review, fact-check and approve a Skin Grocery List issue draft before it publishes." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Review issue draft — Skin Grocer admin" },
      { property: "og:description", content: "Internal draft review for The Skin Grocery List." },
    ],
  }),
  component: DraftReview,
});

type Claim = { claim?: string; status?: string; note?: string; source?: string };

function DraftReview() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const fetchDraft = useServerFn(getDraft);
  const check = useServerFn(runFactCheck);
  const setStatus = useServerFn(setDraftStatus);

  const draftQ = useQuery({
    queryKey: ["draft", id],
    queryFn: () => fetchDraft({ data: { id } }),
    enabled: Boolean(user),
    retry: false,
  });

  const checkM = useMutation({
    mutationFn: () => check({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["draft", id] }),
  });
  const statusM = useMutation({
    mutationFn: (status: "approved" | "rejected") => setStatus({ data: { id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["draft", id] }),
  });

  if (loading || draftQ.isLoading) {
    return <Wrap><p className="text-sm text-muted-foreground">Loading…</p></Wrap>;
  }
  if (!user) {
    return (
      <Wrap>
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="underline">Sign in</Link> to review drafts.
        </p>
      </Wrap>
    );
  }
  if (draftQ.isError) {
    return <Wrap><p className="text-sm">{String((draftQ.error as Error).message)}</p></Wrap>;
  }

  const draft = draftQ.data!;
  const content = (draft.content ?? {}) as {
    issue?: Record<string, unknown>;
    sources?: Array<{ claim?: string; url?: string }>;
    gaps?: string[];
    coverPrompt?: string;
  };
  const issue = content.issue ?? {};
  const report = draft.factcheck as { verdict?: string; summary?: string; claims?: Claim[] } | null;

  return (
    <Wrap>
      <header className="border-b border-border pb-6">
        <Link to="/admin/signals" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:underline">
          ← Signal desk
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Issue {draft.issue_number} · {draft.status}
        </p>
        <h1 className="mt-3 font-display text-4xl">{draft.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{draft.theme}</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => checkM.mutate()}
          disabled={checkM.isPending}
          className="rounded-full border border-input px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] disabled:opacity-60"
        >
          {checkM.isPending ? "Checking facts…" : "Run fact check"}
        </button>
        <button
          onClick={() => statusM.mutate("approved")}
          disabled={statusM.isPending}
          className="rounded-full bg-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60"
        >
          Approve
        </button>
        <button
          onClick={() => statusM.mutate("rejected")}
          disabled={statusM.isPending}
          className="rounded-full border border-destructive/50 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-destructive disabled:opacity-60"
        >
          Reject
        </button>
      </div>
      {checkM.isError && (
        <p className="rounded-sm border border-destructive/40 bg-destructive/5 p-4 text-sm">
          {String((checkM.error as Error).message)}
        </p>
      )}

      {report && (
        <section>
          <h2 className="font-display text-2xl">
            Fact check — {report.verdict === "pass" ? "passes" : "needs revision"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{report.summary}</p>
          <ul className="mt-4 space-y-3">
            {(report.claims ?? []).map((c, i) => (
              <li
                key={i}
                className={`rounded-sm border p-4 text-sm ${
                  c.status === "supported"
                    ? "border-border"
                    : "border-destructive/50 bg-destructive/5"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {c.status}
                </p>
                <p className="mt-1">{c.claim}</p>
                {c.note && <p className="mt-1 text-muted-foreground">{c.note}</p>}
                {c.source && (
                  <a href={c.source} target="_blank" rel="noreferrer" className="mt-1 block text-xs underline">
                    {c.source}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {content.gaps && content.gaps.length > 0 && (
        <section>
          <h2 className="font-display text-2xl">Catalogue gaps</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {content.gaps.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl">Draft</h2>
        <pre className="mt-4 max-h-[600px] overflow-auto rounded-sm border border-border bg-muted/30 p-4 text-xs leading-relaxed">
          {JSON.stringify(issue, null, 2)}
        </pre>
      </section>

      {content.sources && (
        <section>
          <h2 className="font-display text-2xl">Sources</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {content.sources.map((s, i) => (
              <li key={i}>
                <span className="text-muted-foreground">{s.claim}</span>{" "}
                <a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.url}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">{children}</div>;
}
