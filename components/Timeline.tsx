"use client";

import { useState } from "react";
import type { Company, Launch } from "@/types";
import { CATEGORY_META } from "@/types";
import { parseLocalDate, formatLocalDate } from "@/lib/date";

function groupByMonth(launches: Launch[]) {
  const map = new Map<string, Launch[]>();
  for (const l of launches) {
    const key = l.date.slice(0, 7);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => ({
      key,
      label: formatLocalDate(`${key}-01`, { month: "long", year: "numeric" }),
      items: items.sort((a, b) => b.date.localeCompare(a.date)),
    }));
}

export function Timeline({
  launches,
  companies,
  totalCount,
}: {
  launches: Launch[];
  companies: Company[];
  totalCount: number;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const companyMap = new Map(companies.map((c) => [c.id, c]));
  const groups = groupByMonth(launches);

  if (launches.length === 0) {
    return (
      <div className="bg-bg-panel border border-bg-line rounded-md p-8 text-center">
        <p className="text-ink-muted text-sm">
          No launches match the current filters.
        </p>
        <p className="text-2xs text-ink-dim mt-2">
          {totalCount} launches total · clear filters to see all
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="font-display text-sm uppercase tracking-[0.15em] text-ink">
              {group.label}
            </h3>
            <span className="text-2xs text-ink-dim tabular-nums">
              {group.items.length} {group.items.length === 1 ? "launch" : "launches"}
            </span>
            <span className="flex-1 border-t border-bg-line/70" />
          </div>
          <ul className="divide-y divide-bg-line/60 border-y border-bg-line/60">
            {group.items.map((launch) => {
              const company = companyMap.get(launch.company);
              const meta = CATEGORY_META[launch.category];
              const id = `${launch.date}-${launch.company}-${launch.label}`;
              const isOpen = expanded === id;
              const d = parseLocalDate(launch.date);
              const day = String(d.getDate()).padStart(2, "0");
              const mo = d.toLocaleDateString("en-US", { month: "short" });

              return (
                <li key={id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : id)}
                    className="w-full text-left py-3 px-1 hover:bg-bg-panel/60 transition group flex items-start gap-3 sm:gap-4"
                  >
                    {/* date */}
                    <div className="font-mono tabular-nums text-2xs text-ink-dim uppercase pt-1 w-12 sm:w-14 flex-shrink-0">
                      <div className="text-ink text-sm font-medium">{day}</div>
                      <div>{mo}</div>
                    </div>

                    {/* color dot */}
                    <div className="pt-2 flex-shrink-0">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: company?.color || "#5C5C6E" }}
                      />
                    </div>

                    {/* label + tags */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-ink text-sm sm:text-base font-medium">
                          {launch.label}
                        </span>
                        <span
                          className="text-2xs uppercase tracking-wider px-1.5 py-0.5 rounded border"
                          style={{
                            color: company?.color,
                            borderColor: `${company?.color}40`,
                            background: `${company?.color}10`,
                          }}
                        >
                          {company?.name}
                        </span>
                        <span
                          className="text-2xs text-ink-muted inline-flex items-center gap-1"
                          title={meta.label}
                        >
                          <span>{meta.icon}</span>
                          <span className="uppercase tracking-wider">
                            {meta.label}
                          </span>
                        </span>
                      </div>

                      {isOpen && (
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed pr-4">
                          {launch.description}
                        </p>
                      )}
                    </div>

                    {/* chevron */}
                    <div className="pt-2 text-ink-dim group-hover:text-ink-muted text-xs">
                      {isOpen ? "−" : "+"}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
