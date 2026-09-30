import { projects } from "@/content/projects";
import { getKbMarkdown, getWorkMarkdown, listKbNames } from "@/lib/content";

// Chatbot knowledge base: hand-authored public files only (content/projects.ts,
// content/work/*.md, content/kb/*.md). Never point this at anything outside
// content/ — see the content firewall in the plan (§6).
const stripComments = (md: string) => md.replace(/<!--[\s\S]*?-->/g, "").trim();

let cached: string | undefined;

export function getKb(): string {
  cached ??= [
    "# Projects index",
    ...projects.map((p) => {
      const where = p.hasCaseStudy ? `page: /work/${p.slug}` : (p.href ?? "no page");
      const live = p.live ? `, live: ${p.live}` : "";
      return `- ${p.title} (${p.context}, ${p.year}) — ${p.tagline} Tags: ${p.tags.join(", ")}. ${where}${live}`;
    }),
    "# Case studies",
    ...projects
      .filter((p) => p.hasCaseStudy)
      .map((p) => `## ${p.title} (/work/${p.slug})\n${stripComments(getWorkMarkdown(p.slug))}`),
    "# Site knowledge",
    ...listKbNames().map((n) => `## ${n}\n${stripComments(getKbMarkdown(n))}`),
  ].join("\n\n");
  return cached;
}
