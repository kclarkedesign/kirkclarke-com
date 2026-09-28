import fs from "node:fs";
import path from "node:path";

// content/work/<slug>.md holds narrative bodies only, no frontmatter
// (content/projects.ts is the structured metadata) — see that file's
// header comment.
export function getWorkMarkdown(slug: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "work", `${slug}.md`), "utf-8");
}

// The chatbot knowledge base (Milestone 5) reads every kb/*.md and
// work/*.md file the same way — kept here so both call sites share one
// implementation instead of two copies of fs plumbing.
export function getKbMarkdown(name: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "kb", `${name}.md`), "utf-8");
}

export function listWorkSlugs(): string[] {
  const dir = path.join(process.cwd(), "content", "work");
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function listKbNames(): string[] {
  const dir = path.join(process.cwd(), "content", "kb");
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
