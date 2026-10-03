import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { projects } from "@/content/projects";
import { getWorkMarkdown } from "@/lib/content";
import Nav from "@/components/nav";
import Contact from "@/components/contact";

export function generateStaticParams() {
  return projects.filter((p) => p.hasCaseStudy).map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.hasCaseStudy);
  if (!project) notFound();

  const body = getWorkMarkdown(slug);

  // "Next" stays within the same context group (plan's hard separation
  // rule, §Context) — TWR work never links to independent work or back.
  const group = projects.filter((p) => p.context === project.context && p.hasCaseStudy);
  const index = group.findIndex((p) => p.slug === slug);
  const next = group.length > 1 ? group[(index + 1) % group.length] : undefined;

  return (
    <>
      <Nav />

      <main>
      <article className="px-5 py-14 md:px-16 md:py-20">
        <header className="mb-10 max-w-225 md:mb-12">
          <h1 className="m-0 mb-4 font-display text-3xl font-bold leading-tight md:mb-5 md:text-5xl">
            {project.tagline}
          </h1>
          <p className="m-0 text-base text-(--text-secondary) md:text-lg">{project.title}</p>
        </header>

        <div className="mb-10 flex flex-col gap-6 border-b border-(--hairline) pb-10 sm:flex-row sm:gap-12 md:mb-16 md:pb-12">
          <Meta label="Role" value={project.role ?? "—"} />
          <Meta label="Timeline" value={project.year} />
          {project.stack && <Meta label="Stack" value={project.stack.join(", ")} />}
        </div>

        <div className="case-study-body max-w-225">
          <Markdown>{body}</Markdown>
        </div>

        {next && (
          <Link
            href={`/work/${next.slug}`}
            className="mt-8 inline-block text-sm font-medium text-(--text-secondary) hover:text-(--text)"
          >
            Next: {next.title} →
          </Link>
        )}
      </article>

      <Contact />
      </main>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-wide text-(--text-label)">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
