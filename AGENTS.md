<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep brand values in project memory and implement palette changes through semantic CSS tokens, not component colour literals, so the owner can revise colours without changing content.
- Guide ingredient spotlights use the exact SKU's reviewed INCI with a small factual ingredient dictionary and optional illustrative assets; hide unsupported/pending highlights to prevent name-based inference and regional superiority claims.
- Guide visual action breakdowns retain original product directions separately; use category and recorded texture for consistent application sequences, preserving pad, eye, cleanser and mask techniques so illustrations cannot rewrite source guidance.
- The owner's neutral homepage colour trial, scoped through its route marker, has been overridden by the "The Grocer Stripe" identity (owner choice, 2026-11-06): navy, cream and soft silver on every page, with no seasonal switching introduced.
- The awning uses the `--awning` tokens, now navy (#141f2c) with a cream light stripe on every page (owner choice, 2026-11-06; replaces the warm pearl request of 2026-10-12).
- Brand landing pages (/brands/$brand) read from the single brand list in src/lib/brand-pages.ts, which also drives the sitemap; intros reuse only factual range descriptions and sourcing wording, never invented brand claims.
- Packaging page preview and download use the same prebuilt print artwork; publish both assets together to prevent page/PDF design drift.
