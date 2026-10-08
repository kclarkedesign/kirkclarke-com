import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { getWorkMarkdown } from "@/lib/content";
import Nav from "@/components/nav";
import Contact from "@/components/contact";
import CaseStudy, { HERO_VARIANTS, type HeroVariant } from "@/components/case-study";

// Dev-only: a case study at full width with a chosen hero layout, so the layouts can be
// compared at real screen sizes. 404s everywhere except `pnpm dev`.
export default async function HeroPreview({ params }: { params: Promise<{ slug: string; variant: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();

  const { slug, variant } = await params;
  const project = projects.find((p) => p.slug === slug && p.hasCaseStudy);
  if (!project || !HERO_VARIANTS.includes(variant as HeroVariant)) notFound();

  const group = projects.filter((p) => p.context === project.context && p.hasCaseStudy);

  return (
    <>
      <Nav />
      <main>
        <CaseStudy project={project} body={getWorkMarkdown(slug)} variant={variant as HeroVariant} group={group} />
        <Contact />
      </main>
    </>
  );
}
