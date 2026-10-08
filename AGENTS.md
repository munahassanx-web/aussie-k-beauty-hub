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
- Scope the owner's neutral homepage colour trial through its route marker, including shared chrome only while that route is mounted, so other pages retain their existing palette and no seasonal switching is introduced.
