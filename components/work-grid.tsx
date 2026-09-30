"use client";

import { flushSync } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/content/projects";

// The same curated pill set the approved prototype showed — a hand-picked
// subset of the tags that actually appear across content/projects.ts, not
// every distinct tag (some are one-off and would clutter the bar). A
// project tagged e.g. "salesforce" without a pill is still reachable via
// a direct ?tag=salesforce link — a feature of the quiet-link mechanic,
// not a gap.
const FILTER_TAGS = [
  { id: "design", label: "Design" },
  { id: "engineering", label: "Engineering" },
  { id: "leadership", label: "Leadership" },
  { id: "ai", label: "AI" },
  { id: "ux", label: "UX" },
  { id: "security", label: "Security" },
  { id: "wordpress", label: "WordPress" },
  { id: "mcp", label: "MCP" },
];

function tagsFromUrl(): string[] {
  if (typeof window === "undefined") return [];
  return new URLSearchParams(window.location.search).getAll("tag");
}

function pushTagsToUrl(tags: string[]) {
  const params = new URLSearchParams();
  for (const t of tags) params.append("tag", t);
  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.pushState(null, "", url);
}

export default function WorkGrid({
  projects,
  initialTags,
}: {
  projects: Project[];
  initialTags: string[];
}) {
  const [activeTags, setActiveTags] = useState<string[]>(initialTags);

  useEffect(() => {
    // The 2021 bug: this handler used to call handleSearchParams + pushState
    // on every back/forward navigation, which broke Forward. It only ever
    // reads the URL here — pushTagsToUrl runs exclusively from toggleTag.
    const onPopState = () => setActiveTags(tagsFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function toggleTag(id: string) {
    const next = activeTags.includes(id)
      ? activeTags.filter((t) => t !== id)
      : [...activeTags, id];

    const apply = () => {
      flushSync(() => setActiveTags(next));
      pushTagsToUrl(next);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  // Exact match — the 2021 bug used string.includes() on a concatenated
  // className, so "react" matched "react-native" too.
  const visibleProjects = projects.filter(
    (p) => activeTags.length === 0 || p.tags.some((t) => activeTags.includes(t)),
  );

  return (
    <section id="work" className="px-5 py-16 md:px-16 md:py-24">
      <h2 className="m-0 mb-6 font-display text-2xl font-semibold md:mb-8 md:text-3xl">Selected work</h2>

      <div className="mb-3 flex flex-wrap gap-2 md:mb-4">
        {FILTER_TAGS.map((tag) => {
          const active = activeTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              aria-pressed={active}
              className={
                "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors md:px-4 md:py-2 md:text-[13px] " +
                (active
                  ? "border-(--action) bg-(--action) text-(--action-text) hover:brightness-110"
                  : "border-(--hairline) bg-transparent text-(--text-secondary) hover:border-(--action) hover:text-(--text)")
              }
            >
              {tag.label}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mb-6 font-mono text-[11px] text-(--text-label) md:mb-8 md:text-xs">
        Showing {visibleProjects.length} of {projects.length}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
        {visibleProjects.map((project) => {
          const inner = (
            <>
              <h3 className="m-0 font-display text-[15px] font-semibold md:text-[17px]">{project.title}</h3>
              <p className="m-0 flex-grow text-[13px] leading-relaxed text-(--text-secondary) md:text-sm">
                {project.tagline}
              </p>
              <span className="font-mono text-[10px] text-(--text-label) md:text-[11px]">{project.year}</span>
            </>
          );
          const cardClasses =
            "work-card flex flex-col gap-2.5 rounded-xl border border-(--hairline) bg-(--raised) p-[18px] text-(--text) md:gap-3 md:p-6";
          const style = { viewTransitionName: `project-${project.slug}` } as React.CSSProperties;

          return project.hasCaseStudy ? (
            <Link key={project.slug} href={`/work/${project.slug}`} style={style} className={cardClasses}>
              {inner}
            </Link>
          ) : project.href ? (
            <a
              key={project.slug}
              href={project.href}
              target="_blank"
              rel="noopener"
              style={style}
              className={cardClasses}
            >
              {inner}
            </a>
          ) : (
            <div key={project.slug} style={style} className={cardClasses}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
