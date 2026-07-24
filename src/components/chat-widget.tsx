import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { askSkinQuestion, type ChatAnswer } from "@/lib/chat.functions";

type Turn =
  | { role: "user"; text: string }
  | { role: "assistant"; answer: ChatAnswer }
  | { role: "error"; text: string };

const SUGGESTIONS = [
  "What helps with redness?",
  "I have dehydrated skin — where do I start?",
  "Something for large pores?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = useServerFn(askSkinQuestion);
  const mutation = useMutation({
    mutationFn: (question: string) => ask({ data: { question } }),
    onSuccess: (answer) => setTurns((t) => [...t, { role: "assistant", answer }]),
    onError: (err: Error) =>
      setTurns((t) => [...t, { role: "error", text: err.message || "Something went wrong." }]),
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turns, mutation.isPending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = (q: string) => {
    const question = q.trim();
    if (!question || mutation.isPending) return;
    setTurns((t) => [...t, { role: "user", text: question }]);
    setInput("");
    mutation.mutate(question);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open skincare chat"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(600px,85vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <header className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
            <div>
              <p className="font-display text-base text-foreground">Ask Skin Grocer</p>
              <p className="text-[11px] text-muted-foreground">Like asking our in-store team</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-accent/20"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {turns.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask a plain-English skincare question and we'll match it to real ingredients and products from our shelves.
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-foreground transition hover:bg-accent/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {turns.map((turn, i) => {
              if (turn.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                      {turn.text}
                    </div>
                  </div>
                );
              }
              if (turn.role === "error") {
                return (
                  <div key={i} className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {turn.text}
                  </div>
                );
              }
              const a = turn.answer;
              return (
                <div key={i} className="space-y-3">
                  <p className="text-sm leading-relaxed text-foreground">{a.answer}</p>

                  {a.ingredients.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Ingredients to look for
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {a.ingredients.map((ing) => (
                          <Link
                            key={ing.id}
                            to="/learn/$slug"
                            params={{ slug: ing.slug }}
                            onClick={() => setOpen(false)}
                            className="rounded-full border border-[#AD8A4E]/50 bg-[#AD8A4E]/10 px-2.5 py-1 text-xs text-foreground transition hover:bg-[#AD8A4E]/20"
                          >
                            {ing.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {a.products.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Try from our shelves
                      </p>
                      <div className="space-y-1.5">
                        {a.products.map((p) => (
                          <Link
                            key={p.productId}
                            to="/shop"
                            onClick={() => setOpen(false)}
                            className="block rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs transition hover:bg-secondary/60"
                          >
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.brand}</div>
                            <div className="font-medium text-foreground">{p.name}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {mutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-background px-3 py-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your skin…"
              maxLength={500}
              className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim() || mutation.isPending}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
