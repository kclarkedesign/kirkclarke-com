import { projects } from "@/content/projects";
import Home from "@/components/home";

// searchParams is async in Next 16 — a real breaking change from the old
// sync prop (plan §11a). Reading it here (Server Component) is what
// makes a ?tag=... link render with the right filter already active,
// with no JS and no flash.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialTags = Array.isArray(params.tag) ? params.tag : params.tag ? [params.tag] : [];

  return <Home projects={projects} initialTags={initialTags} />;
}
