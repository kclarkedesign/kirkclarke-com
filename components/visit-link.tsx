import type { Project } from "@/content/projects";

// Only renders when the project has a live URL — never a dead or placeholder link.
export default function VisitLink({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.live) return null;
  return (
    <a
      href={project.live}
      target="_blank"
      rel="noopener"
      className={
        "inline-flex items-center gap-1.5 self-start rounded-full bg-(--action) px-5 py-2.5 text-sm font-semibold text-(--action-text) transition hover:brightness-110 " +
        className
      }
    >
      {project.liveLabel ?? `Visit ${project.title}`}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
