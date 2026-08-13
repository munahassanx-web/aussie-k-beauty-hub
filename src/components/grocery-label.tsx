// Grocery-style label chips used across The Skin Grocery List newsletter.

const tones = {
  green: "bg-grocer-green/12 text-grocer-green border-grocer-green/35",
  tomato: "bg-grocer-tomato/10 text-grocer-tomato border-grocer-tomato/35",
  butter: "bg-grocer-butter/35 text-grocer-brown border-grocer-brown/25",
  brown: "bg-grocer-brown/10 text-grocer-brown border-grocer-brown/30",
  ink: "bg-foreground/5 text-foreground border-foreground/25",
} as const;

export type LabelTone = keyof typeof tones;

export function GroceryLabel({
  children,
  tone = "green",
  className = "",
}: {
  children: React.ReactNode;
  tone?: LabelTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  index,
  label,
  tone = "green",
  title,
}: {
  index: string;
  label: string;
  tone?: LabelTone;
  title: string;
}) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-sm tracking-[0.3em] text-grocer-brown/60">{index}</span>
        <GroceryLabel tone={tone}>{label}</GroceryLabel>
      </div>
      <h2 className="mt-4 max-w-3xl font-display text-[32px] leading-[1.05] tracking-[-0.02em] text-foreground md:text-[46px]">
        {title}
      </h2>
    </header>
  );
}
