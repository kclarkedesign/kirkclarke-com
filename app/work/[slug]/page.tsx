import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { getWorkMarkdown } from "@/lib/content";
import Nav from "@/components/nav";
import Contact from "@/components/contact";
import CaseStudy, { type HeroVariant } from "@/components/case-study";

// The wide-screen hero layout. Kirk's pick (2026-10-08); the lab previews the others.
const HERO: HeroVariant = "split";

export function generateStaticParams() {
  return projects.filter((p) => p.hasCaseStudy).map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.hasCaseStudy);
  if (!project) notFound();

  // Previous / Next / More work stay within the same context group (plan's hard
  // separation rule, §Context) — TWR work never links to independent work or back.
  const group = projects.filter((p) => p.context === project.context && p.hasCaseStudy);

  return (
    <>
      <Nav />

      <main>
        <CaseStudy project={project} body={getWorkMarkdown(slug)} variant={HERO} group={group} />
        <Contact />
      </main>
    </>
  );
}
