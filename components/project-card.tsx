import Link from "next/link";
import type { MediaMotion, MediaPalette, MediaTreatment, Project } from "@/content/projects";
import type { SceneData } from "@/content/scenes";
import ProjectMedia from "./project-media";

// One work-grid card. The first visible card is the "feature" (feature-first
// grid): two columns wide and two rows tall at md+, larger title.
export default function ProjectCard({
  project,
  feature = false,
  treatment,
  motion,
  imageSrc,
  shotRatio,
  scene,
  palette,
}: {
  project: Project;
  feature?: boolean;
  /** Overrides, used by the lab only. */
  treatment?: MediaTreatment;
  motion?: MediaMotion;
  imageSrc?: string;
  shotRatio?: number;
  scene?: SceneData;
  palette?: MediaPalette;
}) {
  const inner = (
    <>
      <ProjectMedia
        project={project}
        variant={feature ? "feature" : "card"}
        treatment={treatment}
        motion={motion}
        imageSrc={imageSrc}
        shotRatio={shotRatio}
        scene={scene}
        palette={palette}
      />
      <div className={"flex flex-col gap-2.5 p-5 md:gap-3" + (feature ? "" : " flex-1")}>
        <h3
          className={
            "m-0 font-display font-semibold " +
            (feature ? "text-[17px] md:text-[22px] xl:text-[26px]" : "text-[15px] md:text-[17px]")
          }
        >
          {project.title}
        </h3>
        <p className="m-0 text-[13px] leading-relaxed text-(--text-secondary) md:text-sm">{project.tagline}</p>
        <span className="font-mono text-[10px] text-(--text-label) md:text-[11px]">{project.year}</span>
      </div>
    </>
  );
  const classes =
    "work-card flex flex-col overflow-hidden rounded-xl border border-(--hairline) bg-(--raised) text-(--text)" +
    (feature ? " sm:col-span-2 xl:row-span-2" : "");
  const style = { viewTransitionName: `project-${project.slug}` } as React.CSSProperties;

  if (project.hasCaseStudy) {
    return (
      <Link href={`/work/${project.slug}`} style={style} className={classes}>
        {inner}
      </Link>
    );
  }
  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noopener" style={style} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <div style={style} className={classes}>
      {inner}
    </div>
  );
}
