"use client";

import { useMemo } from "react";
import type { Company, Launch } from "@/types";
import { parseLocalDate } from "@/lib/date";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthlyChart({
  companies,
  launches,
  activeCompany,
}: {
  companies: Company[];
  launches: Launch[];
  activeCompany: string | null;
}) {
  const { rows, max } = useMemo(() => {
    const rows = MONTHS.map((label, i) => {
      const monthLaunches = launches.filter(
        (l) => parseLocalDate(l.date).getMonth() === i,
      );
      const byCompany = companies.map((c) => ({
        company: c,
        count: monthLaunches.filter((l) => l.company === c.id).length,
      }));
      return { label, monthIndex: i, byCompany, total: monthLaunches.length };
    });
    const max = Math.max(...rows.map((r) => r.total), 1);
    return { rows, max };
  }, [launches, companies]);

  // Show only Jan–current month (assume tracking 2026)
  const currentMonth = Math.max(
    ...launches.map((l) => parseLocalDate(l.date).getMonth()),
    0,
  );
  const visibleRows = rows.slice(0, Math.max(currentMonth + 1, 3));

  return (
    <div className="bg-bg-panel border border-bg-line rounded-md p-4 sm:p-6">
      {/* Y-axis ticks + chart */}
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-2xs text-ink-dim tabular-nums w-6 sm:w-8 pb-6 pt-1">
          {[max, Math.ceil(max / 2), 0].map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
        <div className="flex-1 relative">
          {/* horizontal grid */}
          <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-t border-bg-line" />
            ))}
          </div>

          {/* bars */}
          <div className="relative grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 h-48 sm:h-56 pb-6">
            {visibleRows.map((row) => (
              <div
                key={row.label}
                className="relative flex items-end justify-center gap-0.5 sm:gap-1"
              >
                {row.byCompany.map(({ company, count }) => {
                  const heightPct = (count / max) * 100;
                  const dimmed = activeCompany !== null && activeCompany !== company.id;
                  return (
                    <div
                      key={company.id}
                      className="flex-1 relative group"
                      style={{ minHeight: "2px" }}
                    >
                      <div
                        className="w-full rounded-sm transition-all"
                        style={{
                          height: `${heightPct}%`,
                          background: company.color,
                          opacity: dimmed ? 0.18 : count > 0 ? 0.92 : 0,
                          minHeight: count > 0 ? "3px" : 0,
                        }}
                      />
                      {count > 0 && (
                        <div
                          className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xs text-ink-muted opacity-0 group-hover:opacity-100 transition tabular-nums whitespace-nowrap"
                          style={{ color: company.color }}
                        >
                          {count}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="absolute -bottom-5 left-0 right-0 text-center text-2xs uppercase tracking-wider text-ink-dim">
                  {row.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-bg-line flex flex-wrap gap-x-5 gap-y-2">
        {companies.map((c) => {
          const dimmed = activeCompany !== null && activeCompany !== c.id;
          return (
            <div
              key={c.id}
              className={`flex items-center gap-2 text-2xs uppercase tracking-wider ${
                dimmed ? "opacity-30" : ""
              }`}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm"
                style={{ background: c.color }}
              />
              <span className="text-ink-muted">{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
