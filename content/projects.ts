// Project data for the work grid, tag filter, and case-study pages.
// Narrative bodies live in content/work/<slug>.md — this file is structure only.
//
// `context` groups cards for the separation rule: "independent" and "twr" never
// cross-link, never share a tag that implies overlap, and never appear on the
// same case-study page. See docs/redesign/brief.md for why.

export type ProjectContext = "independent" | "twr" | "archive";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  context: ProjectContext;
  year: string;
  tags: string[];
  outcomes: string[];
  thumbnail: string;
  /** External URL for archive cards that skip a case-study page. */
  href?: string;
  /** Live product URL, when there is one. */
  live?: string;
  role?: string;
  stack?: string[];
  /** Case-study body exists at content/work/<slug>.md. False for archive-only cards. */
  hasCaseStudy: boolean;
}

export const projects: Project[] = [
  // ---------------------------------------------------------------------
  // Independent (Overland Innovators, clients, personal)
  // ---------------------------------------------------------------------
  {
    slug: "koto",
    title: "Koto",
    tagline: "Share live Salesforce data with anyone — no license required.",
    context: "independent",
    year: "2026",
    tags: ["engineering", "design", "ai", "salesforce", "nextjs", "stripe", "mcp", "security"],
    outcomes: [
      "Record cap enforced inside the Salesforce query itself, not by truncating an oversized result",
      "Security sweep closed 4 anon-key exposures and 1 RLS leak — 0 findings since",
      "Stripe billing uses compare-and-swap to make concurrent webhooks safe",
      "Button contrast measured and fixed: 2.19:1 → 9.03:1",
    ],
    thumbnail: "/images/work/koto.png",
    live: "https://usekoto.com",
    role: "Solo founder — design, engineering, product",
    stack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Claude", "MCP"],
    hasCaseStudy: true,
  },
  {
    slug: "kibi",
    title: "Kibi",
    tagline: "An agentic knowledge base that answers questions with citations.",
    context: "independent",
    year: "2026",
    tags: ["engineering", "ai", "nextjs", "supabase"],
    outcomes: [
      "RAG built on pgvector with an HNSW index, every embedding tagged with its model version",
      "Prompt injection resisted structurally: retrieved content never enters the system prompt",
      "Root-caused a login failure to a mail client's link prescanner burning single-use tokens",
    ],
    thumbnail: "/images/work/kibi.png",
    live: "https://usekibi.com",
    role: "Solo founder — design, engineering, product",
    stack: ["Next.js", "TypeScript", "Supabase", "pgvector", "Claude"],
    hasCaseStudy: true,
  },
  {
    slug: "daniella-rabbani",
    title: "Daniella Rabbani",
    tagline: "Site for a performer, singer, and podcast host.",
    context: "independent",
    year: "2026",
    tags: ["design", "ai"],
    outcomes: [
      "Designed in Figma with Claude Design in the loop, built in Wix",
      "One site carrying a concert, an album release, and booking inquiries without feeling bolted together",
    ],
    thumbnail: "/images/work/daniella-rabbani.png",
    live: "https://www.daniellarabbani.com",
    role: "Design and build, start to finish",
    stack: ["Figma", "Claude Design", "Wix"],
    hasCaseStudy: true,
  },
  {
    slug: "words-of-wisdom",
    title: "Words of Wisdom",
    tagline: "Jamaican Sayings, Their Meanings, and the Lessons of a Lifetime — by K.L. Craigie, his mother.",
    context: "independent",
    year: "TODO — confirm publication year",
    tags: ["design"],
    outcomes: [
      "55 sayings, each carrying a patois original, a plain-English meaning, and a full weekly journaling page",
    ],
    thumbnail: "/images/work/words-of-wisdom.png",
    live: "https://www.amazon.com/dp/B0HBJ125P3",
    role: "Design and editing",
    hasCaseStudy: true,
  },
  {
    slug: "intuition-ui",
    title: "Intuition UI",
    tagline: "The design system behind Koto and Kibi — still being built out.",
    context: "independent",
    year: "2026",
    tags: ["design", "engineering"],
    outcomes: [
      "One accent hue, a gray ramp, hairline borders instead of shadows",
      "Distributed shadcn-style — consumers get source, not a compiled package",
      "In progress: tokens defined ahead of full component adoption",
    ],
    thumbnail: "/images/work/intuition-ui.png",
    role: "Design system author",
    hasCaseStudy: true,
  },

  // ---------------------------------------------------------------------
  // The Writing Revolution (architecture level only — see content firewall
  // rules in docs/redesign/brief.md before editing any TWR copy)
  // ---------------------------------------------------------------------
  {
    slug: "host-scheduler",
    title: "Host Scheduler",
    tagline: "Replaced a week of manual spreadsheet work with same-day scheduling.",
    context: "twr",
    year: "2026",
    tags: ["engineering", "ai", "leadership", "automation"],
    outcomes: [
      "AI drafts a schedule using constrained tool-use; a deterministic conflict engine re-checks every proposal",
      "Humans approve every AI-drafted assignment before it's published — nothing auto-applies",
      "Timezone module correctly handles daylight-saving shifts and sessions that cross midnight",
    ],
    thumbnail: "/images/work/host-scheduler.png",
    role: "Spec author, designer, and primary engineer",
    stack: ["TypeScript", "Next.js", "Supabase", "Salesforce", "Claude"],
    hasCaseStudy: true,
  },
  {
    slug: "checkout-to-qbo",
    title: "Checkout → QuickBooks Online",
    tagline: "The order-to-cash backbone connecting checkout, Salesforce, and QuickBooks.",
    context: "twr",
    year: "2025–present",
    tags: ["engineering", "integrations", "security"],
    outcomes: [
      "Idempotent webhooks: a processing/completed/failed state machine makes replays safe",
      "Compensating rollback unwinds a failed transaction across every system it touched",
      "Handles multi-currency orders with foreign-exchange tracking",
      "Closed a data-integrity gap in how revenue was being reported",
    ],
    thumbnail: "/images/work/checkout-to-qbo.png",
    role: "Architected and owns the integration; built with a collaborator",
    stack: ["Node.js", "Salesforce", "QuickBooks Online API", "Supabase"],
    hasCaseStudy: true,
  },
  {
    slug: "ai-systems-mcp",
    title: "AI Systems & MCP",
    tagline: "Brought AI into the org's daily work, with read-only defaults and human sign-off.",
    context: "twr",
    year: "2026",
    tags: ["ai", "leadership", "security", "mcp"],
    outcomes: [
      "Built a read-only MCP server so the org could answer its own data questions directly",
      "An empirical protocol test found that OAuth resource parameters (RFC 8707) were being ignored — the finding that shaped the whole platform's security design",
      "Ran a company-wide AI enablement program: tooling, training, and hands-on onboarding",
    ],
    thumbnail: "/images/work/ai-systems-mcp.png",
    role: "Architecture, security design, and review lead",
    stack: ["Python", "TypeScript", "MCP", "Claude", "Salesforce"],
    hasCaseStudy: true,
  },
  {
    slug: "twr-platform",
    title: "TWR Web Platform",
    tagline: "A custom WordPress platform built from scratch: theme, blocks, and the workflow that runs on it.",
    context: "twr",
    year: "2022–2026",
    tags: ["design", "engineering", "leadership", "wordpress", "accessibility", "ux"],
    outcomes: [
      "615 commits of my own on the theme repo",
      "Built the full custom theme and 16+ custom Gutenberg blocks",
      "Proposed a design system from an accessibility audit, prototyped it, then handed its leadership to a direct report",
      "Redesigned a sign-in flow from a spec, cutting a real source of support contacts",
      "Root-caused a video-playback failure to an HLS/CORS bug and fixed it",
      "Ran an accessibility pass across every custom block: ARIA, focus order, alt-text tooling",
    ],
    thumbnail: "/images/work/twr-platform.png",
    role: "Primary front-end developer and platform owner",
    stack: ["WordPress", "PHP", "ACF", "Sass", "JavaScript"],
    hasCaseStudy: true,
  },

  // ---------------------------------------------------------------------
  // Archive — grid cards only, linking out, reusing existing thumbnails
  // ---------------------------------------------------------------------
  {
    slug: "92y",
    title: "92nd Street Y",
    tagline: "AngularJS program finder and COVID-era platform work.",
    context: "archive",
    year: "2013–2021",
    tags: ["design", "engineering"],
    outcomes: [],
    thumbnail: "/images/thumb-product-finder.jpg",
    href: "https://www.92y.org/classes",
    hasCaseStudy: false,
  },
  {
    slug: "columbia-law",
    title: "Campaign for Columbia Law",
    tagline: "A Force in the World.",
    context: "archive",
    year: "2020",
    tags: ["design", "wordpress"],
    outcomes: [],
    thumbnail: "/images/thumb-campaign-for-columbia-law.jpg",
    href: "https://campaign.law.columbia.edu/",
    hasCaseStudy: false,
  },
  {
    slug: "joanie-leeds",
    title: "JoanieLeeds.com",
    tagline: "Musician site, WordPress.",
    context: "archive",
    year: "2020",
    tags: ["design", "wordpress"],
    outcomes: [],
    thumbnail: "/images/thumb-joanieleeds.jpg",
    href: "https://joanieleeds.com/",
    hasCaseStudy: false,
  },
  {
    slug: "customize-private-protected",
    title: "Customize Private & Protected",
    tagline: "A public WordPress.org plugin.",
    context: "archive",
    year: "2020",
    tags: ["engineering", "wordpress"],
    outcomes: [],
    thumbnail: "/images/thumb-cpp-wp-plugin.jpg",
    href: "https://wordpress.org/plugins/customize-private-protected/",
    hasCaseStudy: false,
  },
];
