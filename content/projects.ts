// Project data for the work grid, tag filter, and case-study pages.
// Narrative bodies live in content/work/<slug>.md — this file is structure only.
//
// `context` groups cards for the separation rule: "independent" and "twr" never
// cross-link, never share a tag that implies overlap, and never appear on the
// same case-study page. See docs/redesign/brief.md for why.

export type ProjectContext = "independent" | "twr" | "archive";

/**
 * scene = layered screens + zoom-in crops (content/scenes.ts) · bleed = one shot filling the
 * image area, cropped · frame = one shot inset in a tinted panel · type = placeholder ground
 */
export type MediaTreatment = "scene" | "bleed" | "frame" | "type";
export type MediaMotion = "none" | "zoom" | "tilt";

export interface ProjectImage {
  /** Path under /public. All figures are 16:10 so no dimensions are stored. */
  src: string;
  alt: string;
}

/** Hex colors behind a project's image: a from→to wash and a soft glow. Defaults are the deep greens. */
export interface MediaPalette {
  from: string;
  to: string;
  glow?: string;
}

export interface ProjectMedia {
  treatment: MediaTreatment;
  /** Grid cards only: a different treatment from the case-study cover (defaults to `treatment`). */
  cardTreatment?: MediaTreatment;
  /** Grid cards only: a different hover or pointer motion from the cover (defaults to `motion`). */
  cardMotion?: MediaMotion;
  palette?: MediaPalette;
  motion?: MediaMotion;
  /** Frame treatment only: crop the shot to this width ÷ height, from the top (default 1.6 = uncropped). */
  shotRatio?: number;
  /** Key in content/scenes.ts, used by the "scene" treatment (case-study cover). */
  scene?: string;
  /** Composition for grid cards, if different from `scene` — cards are a different shape. */
  cardScene?: string;
  /** Grid-card image; falls back to `cover`. */
  card?: ProjectImage;
  /** Top of the case-study page. */
  cover?: ProjectImage;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  context: ProjectContext;
  year: string;
  tags: string[];
  outcomes: string[];
  /** No `media` = typographic cover on the card, nothing on the case study. */
  media?: ProjectMedia;
  /** External URL for archive cards that skip a case-study page. */
  href?: string;
  /** Live product URL, when there is one. Only set it when it really answers. */
  live?: string;
  /** Button text for `live` ("Visit Koto"); defaults to "Visit <title>". */
  liveLabel?: string;
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
    tags: ["engineering", "design", "ux", "ai", "salesforce", "nextjs", "stripe", "mcp", "security"],
    outcomes: [
      "Record cap enforced inside the Salesforce query itself, not by truncating an oversized result",
      "Security sweep closed 4 anon-key exposures and 1 RLS leak — 0 findings since",
      "Stripe billing uses compare-and-swap to make concurrent webhooks safe",
      "Button contrast measured and fixed: 2.19:1 → 9.03:1",
      "Dashboard redesign direction: a unified sidebar, a four-step view builder, and per-view Data / Settings / Takeaways tabs",
    ],
    // Stylized renders of the Koto dashboard redesign (a design direction, not the
    // shipped UI) — captions in content/work/koto.md say so. The cover is one framed shot with
    // pointer tilt (Kirk's lab picks, 2026-10-07: radius 8, pad 16, tint 22). The grid card is a
    // scene instead, because a framed shot leaves a near-square card half empty: a macro of the
    // Takeaways card's corner on mint, pushing in slowly, with a hover zoom (Kirk, 2026-10-08).
    media: {
      treatment: "frame",
      cardTreatment: "scene",
      cardMotion: "zoom",
      scene: "koto-hero",
      cardScene: "koto-card-macro-move",
      motion: "tilt",
      palette: { from: "#1e5a38", to: "#0f3521", glow: "#4bc57d" },
      shotRatio: 1.9,
      cover: {
        src: "/images/work/koto/cover.webp",
        alt: "Koto's redesigned Views screen: a slim sidebar and three shareable views, each with a Copy link button.",
      },
    },
    live: "https://usekoto.com",
    liveLabel: "Visit Koto",
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
    // `live` (https://usekibi.com) stays unset until the domain is connected and answering.
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
    tags: ["design", "ux", "ai"],
    outcomes: [
      "Designed in Figma with Claude Design in the loop, built in Wix",
      "One site carrying a concert, an album release, and booking inquiries without feeling bolted together",
      "At launch, a single dense bio section became four strips, each with one primary action",
    ],
    // Plum from her own Figma styles; glow and the rest are starting values for the lab.
    media: {
      treatment: "frame",
      // Grid card: a macro scene like Koto's. Candidates daniella-card-text / -buttons / -swatches; Kirk
      // picks and tunes in /lab/daniella-rabbani.
      cardTreatment: "scene",
      cardMotion: "zoom",
      cardScene: "daniella-card-text",
      motion: "tilt",
      shotRatio: 1.9,
      palette: { from: "#200024", to: "#3b1745", glow: "#d27cf6" },
      cover: {
        src: "/images/work/daniella-rabbani/desktop-after.webp",
        alt: "The top of Daniella Rabbani's redesigned homepage: a dark plum page with her portrait, her name, a short line about her new album and two buttons.",
      },
    },
    live: "https://www.daniellarabbani.com",
    liveLabel: "Visit the site",
    role: "Design and build, start to finish",
    stack: ["Figma", "Claude Design", "Wix"],
    hasCaseStudy: true,
  },
  {
    slug: "words-of-wisdom",
    title: "Words of Wisdom",
    tagline: "A 52-week journal of Jamaican sayings and what they mean, by K.L. Craigie, my mother.",
    context: "independent",
    year: "2026",
    tags: ["design"],
    outcomes: [
      "55 sayings — 52 for the weeks of a year, plus 3 bonus — each with its plain-English meaning and a page to write on",
      "The doctor bird on the cover: sketched by hand, redrawn in Figma, and delivered as a vector",
      "Published in hardcover, paperback, and Kindle",
    ],
    // The book's own artwork (hardcover wrap, interior spreads, the vector doctor bird). Scene and frame
    // candidates for Kirk to pick in /lab/words-of-wisdom; see content/scenes.ts.
    media: {
      treatment: "scene",
      cardTreatment: "scene",
      cardMotion: "zoom",
      scene: "wow-hero",
      cardScene: "wow-card-cover",
      motion: "tilt",
      palette: { from: "#0e3c28", to: "#0a2a1c", glow: "#e3b53e" },
      shotRatio: 1.34,
      cover: {
        src: "/images/work/words-of-wisdom/wrap.webp",
        alt: "The hardcover jacket of Words of Wisdom laid flat: the back cover with a quotation and description, the spine, and the green and gold front cover with a cream doctor bird medallion.",
      },
    },
    live: "https://www.amazon.com/dp/B0HBJ125P3",
    liveLabel: "View on Amazon",
    role: "Editing, design, and the doctor bird illustration",
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
    tags: ["design", "ux", "engineering"],
    outcomes: [],
    media: {
      treatment: "frame",
      motion: "tilt",
      shotRatio: 1.9,
      card: { src: "/images/thumb-product-finder.jpg", alt: "The 92nd Street Y class finder: a keyword filter and type checkboxes beside a list of classes." },
    },
    href: "https://www.92y.org/classes",
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
    media: {
      treatment: "frame",
      motion: "tilt",
      shotRatio: 1.9,
      card: { src: "/images/thumb-joanieleeds.jpg", alt: "The About page on JoanieLeeds.com: a bio beside a portrait of the musician holding a Grammy." },
    },
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
    media: {
      treatment: "frame",
      motion: "tilt",
      shotRatio: 1.9,
      card: { src: "/images/thumb-cpp-wp-plugin.jpg", alt: "The plugin's icon: a white gear inside a green circle." },
    },
    href: "https://wordpress.org/plugins/customize-private-protected/",
    hasCaseStudy: false,
  },
];
