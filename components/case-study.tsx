import Markdown, { defaultUrlTransform } from "react-markdown";
import type { Project } from "@/content/projects";
import { sequences } from "@/content/scenes";
import CompareFigure from "./compare-figure";
import Figure from "./figure";
import ProjectMedia from "./project-media";
import SceneFigure from "./scene-figure";
import SceneSequence from "./scene-sequence";
import VisitLink from "./visit-link";
import WorkNav from "./work-nav";

// Wide-screen hero layouts. All three are the same markup, rearranged by CSS (.cs in
// globals.css); the dev-only lab previews each one at /lab/<slug>/hero/<variant>, and the
// real page uses the one it bakes in. Phones, and pages with no cover, stay stacked.
export type HeroVariant = "split" | "stage" | "rail";
export const HERO_VARIANTS: HeroVariant[] = ["split", "stage", "rail"];

export default function CaseStudy({
  project,
  body,
  variant,
  group,
}: {
  project: Project;
  body: string;
  variant: HeroVariant;
  /** Case studies in the same context: Previous / Next / More work come only from here. */
  group?: Project[];
}) {
  const hasCover = Boolean(project.media?.cover || project.media?.scene);

  return (
    <article className="cs @container px-5 py-14 md:px-16 md:py-20" data-hero={variant} data-cover={hasCover ? "" : undefined}>
      <header className="cs-title">
        <h1 className="m-0 mb-4 font-display text-3xl font-bold leading-tight md:mb-5 md:text-5xl">{project.tagline}</h1>
        <p className="cs-name">{project.title}</p>
      </header>

      {hasCover && (
        <div className="cs-cover">
          <ProjectMedia project={project} variant="cover" />
        </div>
      )}

      <div className="cs-facts">
        <Fact label="Role" value={project.role ?? "—"} />
        <Fact label="Timeline" value={project.year} />
        {project.stack && <Fact label="Stack" value={project.stack.join(", ")} />}
        <VisitLink project={project} className="cs-visit" />
      </div>

      <div className="case-study-body cs-body">
        <Markdown
          // Let our own scene: and compare: references through; everything else keeps the default sanitizing.
          urlTransform={(url) => (url.startsWith("scene:") || url.startsWith("compare:") ? url : defaultUrlTransform(url))}
          components={{
            // A lone image becomes a <figure>, which can't live inside a <p>.
            p: ({ node, children }) => {
              const only = node?.children.length === 1 ? node.children[0] : undefined;
              return only?.type === "element" && only.tagName === "img" ? <>{children}</> : <p>{children}</p>;
            },
            img: ({ src, alt, title }) =>
              typeof src !== "string" ? null : src.startsWith("compare:") ? (
                <CompareFigure id={src.slice("compare:".length)} caption={title} />
              ) : src.startsWith("scene:") ? (
                sequences[src.slice("scene:".length)] ? (
                  <SceneSequence id={src.slice("scene:".length)} />
                ) : (
                  <SceneFigure id={src.slice("scene:".length)} caption={title} />
                )
              ) : (
                <Figure src={src} alt={alt ?? ""} caption={title} />
              ),
          }}
        >
          {body}
        </Markdown>
      </div>

      <div className="cs-end">
        <div className="mt-8">
          <VisitLink project={project} />
        </div>
        {group && <WorkNav project={project} group={group} />}
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-(--text-label)">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
