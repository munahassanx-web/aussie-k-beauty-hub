import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered editorial reveal. Purely presentational — renders children
 * immediately (SSR-safe) and only animates opacity/transform once in view.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // Already in view on mount (direct deep-link / restored scroll)
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) setShown(true);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);
    // Safety net: never leave content hidden
    const t = window.setTimeout(() => setShown(true), 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);


  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-revealed={shown ? "true" : "false"}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
