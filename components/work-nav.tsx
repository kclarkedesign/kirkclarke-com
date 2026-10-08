import Link from "next/link";
import type { Project } from "@/content/projects";
import ProjectCard from "./project-card";

// Where to go from the end of a case study. `group` is the case studies in the same
// context, and everything here is built from it, so TWR and independent work never
// link to each other (the hard separation rule, plan §Context). "All work" goes to the
// shared grid, which shows both and is not a cross-link.
export default function WorkNav({ project, group }: { project: Project; group: Project[] }) {
  const index = group.findIndex((p) => p.slug === project.slug);
  const prev = group.length > 1 ? group[(index - 1 + group.length) % group.length] : undefined;
  const next = group.length > 1 ? group[(index + 1) % group.length] : undefined;
  const more = group.filter((p) => p.slug !== project.slug);

  return (
    <nav aria-label="More case studies" className="mt-14 border-t border-(--hairline) pt-8 md:mt-20">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
        <Link href="/#work" className="text-sm font-medium text-(--text-secondary) hover:text-(--text)">
          ← All work
        </Link>
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {prev && <Step label="Previous" project={prev} />}
          {next && <Step label="Next" project={next} />}
        </div>
      </div>

      {more.length > 0 && (
        <>
          <h2 className="mb-5 mt-12 font-display text-xl font-semibold md:text-2xl">More work</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {more.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </>
      )}
    </nav>
  );
}

function Step({ label, project }: { label: string; project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="flex max-w-60 flex-col gap-1 text-(--text) hover:opacity-80">
      <span className="text-xs text-(--text-label)">{label}</span>
      <span className="font-display text-base font-semibold md:text-lg">{project.title}</span>
    </Link>
  );
}
