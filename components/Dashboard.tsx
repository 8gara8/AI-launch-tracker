"use client";

import { useMemo, useState } from "react";
import type { Category, Company, Launch, LaunchData } from "@/types";
import { CATEGORY_META } from "@/types";
import { formatLocalDate } from "@/lib/date";
import { Scoreboard } from "./Scoreboard";
import { MonthlyChart } from "./MonthlyChart";
import { Timeline } from "./Timeline";

const CATEGORIES: Category[] = ["model", "product", "api", "strategic"];

function buildSummary(
  launches: Launch[],
  companies: Company[],
  weekNumber: number,
) {
  const counts = companies.map((c) => ({
    company: c,
    count: launches.filter((l) => l.company === c.id).length,
  }));
  const sorted = [...counts].sort((a, b) => b.count - a.count);
  const leader = sorted[0];
  const second = sorted[1];
  const total = launches.length;
  const lead = leader.count - second.count;
  return {
    counts: sorted,
    leader,
    second,
    total,
    lead,
    weekNumber,
  };
}

export function Dashboard({ data }: { data: LaunchData }) {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(),
  );

  const filtered = useMemo(() => {
    return data.launches.filter((l) => {
      if (activeCompany && l.company !== activeCompany) return false;
      if (activeCategories.size > 0 && !activeCategories.has(l.category))
        return false;
      return true;
    });
  }, [data.launches, activeCompany, activeCategories]);

  const summary = useMemo(
    () => buildSummary(data.launches, data.companies, data.meta.week_number),
    [data],
  );

  const toggleCategory = (c: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveCompany(null);
    setActiveCategories(new Set());
  };

  const hasFilters = activeCompany !== null || activeCategories.size > 0;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <header className="border-b border-bg-line pb-8 mb-10">
          <div className="flex items-center gap-3 text-2xs uppercase tracking-[0.2em] text-ink-muted mb-4">
            <span className="inline-block w-2 h-2 bg-accent-anthropic animate-pulse rounded-full" />
            <span>Live · Week {data.meta.week_number} · 2026</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink mb-3">
            AI Ship Speed
            <span className="text-ink-dim"> / 2026</span>
          </h1>
          <p className="text-ink-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            Competitive intelligence on AI product launches from Anthropic,
            OpenAI, Google, and xAI. Last updated{" "}
            <span className="text-ink">{formatLocalDate(data.meta.last_updated)}</span>
            . Tracking {data.launches.length} launches since{" "}
            {formatLocalDate(data.meta.tracked_since)}.
          </p>
        </header>

        {/* Scoreboard */}
        <section className="mb-12">
          <SectionLabel index="01" title="Scoreboard" />
          <Scoreboard
            companies={data.companies}
            launches={data.launches}
            activeCompany={activeCompany}
            onSelect={(id) =>
              setActiveCompany((cur) => (cur === id ? null : id))
            }
          />
        </section>

        {/* Monthly chart */}
        <section className="mb-12">
          <SectionLabel index="02" title="Monthly cadence" />
          <MonthlyChart
            companies={data.companies}
            launches={data.launches}
            activeCompany={activeCompany}
          />
        </section>

        {/* Filters */}
        <section className="mb-8">
          <SectionLabel index="03" title="Filter by category" />
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => {
              const meta = CATEGORY_META[c];
              const active = activeCategories.has(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={`group inline-flex items-center gap-2 px-3 py-2 text-xs rounded border transition ${
                    active
                      ? "bg-ink text-bg border-ink"
                      : "bg-bg-panel text-ink-muted border-bg-line hover:border-ink-dim hover:text-ink"
                  }`}
                >
                  <span className="text-sm leading-none">{meta.icon}</span>
                  <span className="uppercase tracking-wider">{meta.label}</span>
                </button>
              );
            })}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 text-2xs uppercase tracking-wider text-ink-dim hover:text-ink underline underline-offset-4 decoration-dotted"
              >
                Clear filters · {filtered.length}/{data.launches.length}
              </button>
            )}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <SectionLabel index="04" title="Timeline" />
          <Timeline
            launches={filtered}
            companies={data.companies}
            totalCount={data.launches.length}
          />
        </section>

        {/* Key Takeaway */}
        <section className="mb-12">
          <SectionLabel index="05" title="Key takeaway" />
          <div className="border-l-2 border-accent-anthropic pl-5 py-1">
            <p className="text-ink text-base sm:text-lg leading-relaxed">
              Through week {summary.weekNumber}, {summary.leader.company.name}{" "}
              <span className="text-ink-muted">
                ({summary.leader.company.product})
              </span>{" "}
              leads with{" "}
              <span
                className="font-semibold"
                style={{ color: summary.leader.company.color }}
              >
                {summary.leader.count} launches
              </span>
              , a {summary.lead === 0 ? "tie" : `${summary.lead}-launch lead`} over{" "}
              {summary.second.company.name}. The four frontier labs have shipped{" "}
              <span className="text-ink font-semibold">
                {summary.total} measurable releases
              </span>{" "}
              year-to-date — a {(summary.total / summary.weekNumber).toFixed(1)}{" "}
              launches-per-week pace across the industry.
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {summary.counts.map((row) => (
                <div
                  key={row.company.id}
                  className="text-2xs uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: row.company.color }}
                    />
                    <span className="text-ink-muted">{row.company.name}</span>
                  </div>
                  <div className="font-display text-2xl text-ink mt-1">
                    {row.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Watch list */}
        <section className="mb-12">
          <SectionLabel index="06" title="What to watch" />
          <ul className="space-y-2.5">
            {data.watch.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-ink-muted leading-relaxed border-l border-bg-line pl-4 py-1 hover:border-accent-anthropic transition-colors"
              >
                <span className="text-ink-dim text-2xs pt-1.5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="border-t border-bg-line pt-6 mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-2xs uppercase tracking-wider text-ink-dim">
            <span>
              Updated weekly by Claude Cowork. Data since{" "}
              {formatLocalDate(data.meta.tracked_since)}.
            </span>
            <span>
              v{data.meta.week_number}.{data.meta.last_updated.slice(0, 4)}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-2xs text-ink-dim tabular-nums">{index}</span>
      <h2 className="font-display text-xs uppercase tracking-[0.18em] text-ink-muted">
        {title}
      </h2>
      <span className="flex-1 border-t border-bg-line" />
    </div>
  );
}
