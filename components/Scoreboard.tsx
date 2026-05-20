"use client";

import type { Company, Launch } from "@/types";

export function Scoreboard({
  companies,
  launches,
  activeCompany,
  onSelect,
}: {
  companies: Company[];
  launches: Launch[];
  activeCompany: string | null;
  onSelect: (id: string) => void;
}) {
  const max = Math.max(
    ...companies.map((c) => launches.filter((l) => l.company === c.id).length),
    1,
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {companies.map((c) => {
        const count = launches.filter((l) => l.company === c.id).length;
        const latest = [...launches]
          .filter((l) => l.company === c.id)
          .sort((a, b) => b.date.localeCompare(a.date))[0];
        const isActive = activeCompany === c.id;
        const isDimmed = activeCompany !== null && !isActive;
        const ratio = count / max;

        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group relative text-left bg-bg-panel border border-bg-line rounded-md p-4 transition ${
              isActive ? "border-ink" : "hover:border-ink-dim"
            } ${isDimmed ? "opacity-40" : ""}`}
            style={
              isActive
                ? { borderColor: c.color, boxShadow: `inset 0 0 0 1px ${c.color}` }
                : undefined
            }
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: c.color }}
                />
                <span className="text-2xs uppercase tracking-wider text-ink-muted">
                  {c.name}
                </span>
              </div>
              <span className="text-2xs text-ink-dim uppercase">
                {c.product}
              </span>
            </div>

            <div className="font-display text-4xl sm:text-5xl text-ink tabular-nums leading-none">
              {String(count).padStart(2, "0")}
            </div>
            <div className="text-2xs uppercase tracking-wider text-ink-dim mt-1.5">
              launches YTD
            </div>

            {/* progress bar */}
            <div className="mt-4 h-px bg-bg-line relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${ratio * 100}%`,
                  background: c.color,
                }}
              />
            </div>

            {latest && (
              <div className="mt-3 text-2xs text-ink-muted truncate">
                <span className="text-ink-dim">Latest: </span>
                {latest.label}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
