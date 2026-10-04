import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import Nav from "@/components/nav";
import Lab from "./lab";

// Dev-only preview for choosing a project's image treatment and motion on the
// real components. 404s everywhere except `pnpm dev`; chosen values are copied
// into the project's `media` in content/projects.ts.
export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();

  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const dir = path.join(process.cwd(), "public", "images", "work", slug);
  const images = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => /\.(webp|png|jpe?g)$/.test(f))
        .map((f) => `/images/work/${slug}/${f}`)
    : [];

  return (
    <>
      <Nav />
      <main className="px-5 py-10 md:px-16">
        <h1 className="m-0 mb-1 font-display text-2xl font-bold">Lab: {project.title}</h1>
        <p className="m-0 mb-8 text-sm text-(--text-secondary)">
          Dev only. Tune it, then copy the snippet into <code>content/projects.ts</code>.
        </p>
        <Lab project={project} images={images} />
      </main>
    </>
  );
}
