import { TICKER_ITEMS } from "@/lib/data/mock";

export function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-[rgba(0,229,204,0.04)] border-b border-[rgba(0,229,204,0.1)] py-2 overflow-hidden ticker-wrap">
      <div className="animate-ticker flex gap-12 whitespace-nowrap" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
