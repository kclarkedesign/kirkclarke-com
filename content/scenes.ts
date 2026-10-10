// Layered "scenes" for project media: full screens plus zoom-in crops composed on a
// stage, with parallax and pop-in motion as you scroll (components/scene.tsx).
//
// Coordinates are percentages of the stage: x/y are left/top, w is width. Heights come
// from each layer's `ratio` (width ÷ height), so a layer never distorts. `marks` draw a
// mint outline on a full screen where a zoom-in layer was cropped from (x/y/w/h are
// percentages of that screen); `for` names the zoom layer that outline belongs to, so
// they appear together. `depth` is how far a layer drifts against the scroll — positive
// moves with the zoom-ins, negative lags behind like something further back.

export interface SceneMark {
  x: number;
  y: number;
  w: number;
  h: number;
  for: string;
}

export interface SceneLayer {
  id: string;
  src: string;
  ratio: number;
  x: number;
  y: number;
  w: number;
  z?: number;
  depth?: number;
  /** A zoom-in crop: lifted off the screen with a shadow, and it pops in on scroll. */
  zoom?: boolean;
  /** Pushed back: darkened so the layer in front reads first. */
  dim?: boolean;
  marks?: SceneMark[];
  /**
   * Depth of field: a blurred copy of the image, masked so only the point (x, y, as % of this
   * layer) stays sharp and everything toward the edges falls into soft focus. blur is in cqw.
   */
  dof?: { x: number; y: number; blur: number };
  /** Corner radius in cqw. The default suits a screen; a macro-scale layer wants a bigger one. */
  radius?: number;
  /** Which turn this layer takes when the scene loops (SceneData.loop). No slot = always there. */
  slot?: number;
  /**
   * Slow camera motion while the scene sits on screen: `push` is how far it creeps in (0.1 = 10%),
   * toward the depth-of-field focus; `rack` shifts which point stays sharp, from `dof` to this
   * point; `seconds` is each way. CSS only, paused on hover or focus, off under reduced motion.
   */
  move?: { push?: number; rack?: { x: number; y: number }; seconds?: number };
}

export interface SceneData {
  /** Stage width ÷ height. */
  ratio: number;
  /** One description for the whole composition; the layers themselves are decorative. */
  alt: string;
  layers: SceneLayer[];
  /** Seconds each slot is on screen. Layers with a `slot` take turns; slot 0 is the resting state. */
  loop?: number;
  /** A ground painted behind the layers (colors are hex), for scenes that want their own backdrop. */
  ground?: { from: string; to: string; glow?: string };
}

// A pinned sequence: the frame stays put while the page scrolls, and each step swaps in
// one scene (its zoom-ins grow out of their outlines). Steps share one stage ratio so
// the frame never changes shape. Without scroll timelines, with reduced motion, the
// steps simply stack as ordinary scene figures.
export interface SequenceStep {
  scene: string;
  title: string;
  caption: string;
}

export interface SequenceData {
  ratio: number;
  /** One description of the whole walkthrough, read before the steps. */
  alt: string;
  steps: SequenceStep[];
}

const K = "/images/work/koto";
const W = "/images/work/words-of-wisdom";
const D = "/images/work/daniella-rabbani/crops";

// Every layer is a render of the Koto dashboard redesign (a design direction, not the
// shipped UI); the zoom-ins are crops of those same renders, so they stay sharp.
export const scenes: Record<string, SceneData> = {
  "koto-hero": {
    ratio: 1.6,
    alt: "Layered views of Koto's redesigned dashboard: the Views list zoomed in on one view's row and its Copy link button, with the Takeaways tab behind it showing the Brief and Detailed switch and a Regenerate button.",
    layers: [
      {
        id: "tk",
        src: `${K}/takeaways.webp`,
        ratio: 1.6,
        x: 38,
        y: 0,
        w: 64,
        z: 0,
        depth: -0.7,
        dim: true,
        marks: [{ x: 63.1, y: 27, w: 32, h: 12.6, for: "regen" }],
      },
      {
        id: "views",
        src: `${K}/cover.webp`,
        ratio: 1.6,
        x: 1,
        y: 12,
        w: 74,
        z: 1,
        depth: 0,
        marks: [
          { x: 10.4, y: 14, w: 39.3, h: 12.6, for: "row" },
          { x: 75.8, y: 14, w: 19.3, h: 12.6, for: "copy" },
        ],
      },
      { id: "regen", src: `${K}/crops/regenerate.webp`, ratio: 4.046, x: 64, y: 6, w: 34, z: 2, depth: 0.9, zoom: true },
      { id: "row", src: `${K}/crops/view-row.webp`, ratio: 4.966, x: 18, y: 70, w: 58, z: 3, depth: 1.1, zoom: true },
      { id: "copy", src: `${K}/crops/copy-link.webp`, ratio: 2.437, x: 70, y: 44, w: 22, z: 3, depth: 1.5, zoom: true },
    ],
  },

  "koto-views": {
    ratio: 1.9,
    alt: "The Views screen in Koto's redesign, zoomed in on one view's row and its Copy link button.",
    layers: [
      {
        id: "base",
        src: `${K}/cover.webp`,
        ratio: 1.6,
        x: 0,
        y: 4,
        w: 78,
        z: 0,
        depth: 0,
        marks: [
          { x: 10.4, y: 14, w: 39.3, h: 12.6, for: "row" },
          { x: 75.8, y: 14, w: 19.3, h: 12.6, for: "copy" },
        ],
      },
      { id: "row", src: `${K}/crops/view-row.webp`, ratio: 4.966, x: 28, y: 62, w: 54, z: 2, depth: 1.1, zoom: true },
      { id: "copy", src: `${K}/crops/copy-link.webp`, ratio: 2.437, x: 74, y: 34, w: 24, z: 3, depth: 1.5, zoom: true },
    ],
  },

  "koto-builder": {
    ratio: 1.9,
    alt: "The view builder's Fields step in Koto's redesign, zoomed in on the checklist where eight of an account's seventy fields are ticked.",
    layers: [
      {
        id: "base",
        src: `${K}/builder.webp`,
        ratio: 1.6,
        x: 0,
        y: 0,
        w: 82,
        z: 0,
        depth: 0,
        marks: [{ x: 10.4, y: 30.1, w: 52, h: 41, for: "fields" }],
      },
      { id: "fields", src: `${K}/crops/fields-check.webp`, ratio: 2.028, x: 46, y: 40, w: 52, z: 2, depth: 1.2, zoom: true },
    ],
  },

  "koto-data": {
    ratio: 1.9,
    alt: "A view's Data tab in Koto's redesign, zoomed in on the records table with its column headers and first rows.",
    layers: [
      {
        id: "base",
        src: `${K}/data.webp`,
        ratio: 1.6,
        x: 0,
        y: 4,
        w: 78,
        z: 0,
        depth: 0,
        marks: [{ x: 10.4, y: 34, w: 55.6, h: 23.5, for: "table" }],
      },
      { id: "table", src: `${K}/crops/data-head.webp`, ratio: 3.778, x: 36, y: 56, w: 62, z: 2, depth: 1.2, zoom: true },
    ],
  },

  "koto-takeaways": {
    ratio: 1.9,
    alt: "A view's Takeaways tab in Koto's redesign, zoomed in on the published summary banner and the first entry in the takeaway history.",
    layers: [
      {
        id: "base",
        src: `${K}/takeaways.webp`,
        ratio: 1.6,
        x: 0,
        y: 0,
        w: 78,
        z: 0,
        depth: 0,
        marks: [
          { x: 10.4, y: 27, w: 50.2, h: 12.6, for: "pub" },
          { x: 10.4, y: 44.3, w: 57.5, h: 11.5, for: "hist" },
        ],
      },
      { id: "pub", src: `${K}/crops/published.webp`, ratio: 6.345, x: 30, y: 46, w: 68, z: 2, depth: 1.0, zoom: true },
      { id: "hist", src: `${K}/crops/history-row.webp`, ratio: 8, x: 22, y: 70, w: 74, z: 3, depth: 1.5, zoom: true },
    ],
  },

  // The grid card (Kirk's pick, 2026-10-08): a macro of the Takeaways summary card's corner on a
  // mint ground, creeping in slowly. The stage is square and the subject sits in the middle band,
  // so a 16:10 crop on small screens keeps it. It has no `dof`, so the picture is sharp and the
  // `rack` (a focus pull between two points) only runs if depth of field is added back.
  "koto-card-macro-move": {
    ratio: 1,
    alt: "A macro of the corner of the Takeaways tab's summary card in Koto's redesign: the Brief and Detailed switch and the Regenerate button, slowly pushing in, on a mint ground.",
    ground: { from: "#c9f7de", to: "#4bc57d", glow: "#ffffff" },
    layers: [
      { id: "macro", src: `${K}/crops/takeaway-corner.webp`, ratio: 1.533, x: -14, y: 23, w: 90, z: 0, depth: 0, radius: 6, move: { push: 0.07, rack: { x: 26, y: 70 }, seconds: 5 } },
    ],
  },

  // ------------------------------------------------------------------
  // Words of Wisdom. Every layer is real artwork from the book: the hardcover wrap, a spread of the
  // interior, and a 24x render of the doctor bird from the vector cover. Candidates for Kirk to pick in
  // the lab (2026-10-09); the losers get deleted after he does.
  // ------------------------------------------------------------------

  // Hero candidate: an open spread with the front cover standing in front of it, on the book's green.
  // (The flat wrap, wrap.webp, is the other candidate: pick `frame` for the cover treatment in the lab.)
  "wow-hero": {
    ratio: 1.9,
    alt: "An open spread of Words of Wisdom, with a saying on the left and a lined page to write on at the right, and the green and gold front cover with a cream doctor bird medallion standing in front of it.",
    ground: { from: "#0a2a1c", to: "#14513a", glow: "#e3b53e" },
    layers: [
      { id: "spread", src: `${W}/spread-week-1-flat.webp`, ratio: 1.3333, x: 12, y: 20, w: 48, z: 0, depth: -0.4 },
      { id: "front", src: `${W}/front.webp`, ratio: 0.6667, x: 54, y: 10, w: 26, z: 1, depth: 0.9 },
    ],
  },

  // Card candidate A: the front cover standing against a spread, on cream and gold (the book's palette
  // inverted, so the green cover reads first). The square stage keeps both in the middle band.
  "wow-card-cover": {
    ratio: 1,
    alt: "The green and gold front cover of Words of Wisdom standing in front of an open spread of the journal, on a cream and gold ground.",
    ground: { from: "#f6efdf", to: "#e3b53e", glow: "#ffffff" },
    layers: [
      { id: "spread", src: `${W}/spread-week-1-flat.webp`, ratio: 1.3333, x: 6, y: 31, w: 62, z: 0, depth: -0.4 },
      { id: "front", src: `${W}/front.webp`, ratio: 0.6667, x: 52, y: 20, w: 38, z: 1, depth: 0.8 },
    ],
  },

  // Card candidate B: a macro of the doctor bird against the gold ring, creeping in slowly (Koto's recipe).
  "wow-card-bird": {
    ratio: 1,
    alt: "A close-up of the doctor bird on the cover of Words of Wisdom: a dark green hummingbird with a long beak and swept wing against a cream disc, with the edge of the gold ring top right, slowly pushing in.",
    ground: { from: "#0a2a1c", to: "#1f6b45", glow: "#e3b53e" },
    layers: [
      { id: "bird", src: `${W}/bird-head.webp`, ratio: 1.5009, x: -14, y: 21, w: 90, z: 0, depth: 0, radius: 6, move: { push: 0.07, seconds: 5 } },
    ],
  },

  // ------------------------------------------------------------------
  // Daniella Rabbani grid-card candidates (Kirk, 2026-10-09: "a similar treatment as Koto"). Each is a
  // macro of real material, on a ground that contrasts with the plum site, slowly pushing in. Crops come
  // from the launch screenshot's hero, above any contact details, and from her Figma styles frame.
  // ------------------------------------------------------------------
  "daniella-card-text": {
    ratio: 1,
    alt: "A close-up of the top of Daniella Rabbani's homepage at launch: a citron line reading actor, singer, filmmaker, podcaster, her name in a large serif, the line Yiddish music for right now, a short paragraph about her album, and a citron Klezmerette button beside an IMDb button, on a dark plum panel over a cream and citron ground.",
    ground: { from: "#fffae3", to: "#d9f103", glow: "#ffffff" },
    layers: [
      { id: "text", src: `${D}/hero-text.webp`, ratio: 1.6, x: 4, y: 22, w: 92, z: 0, depth: 0, radius: 5, move: { push: 0.07, seconds: 5 } },
    ],
  },
  "daniella-card-buttons": {
    ratio: 1,
    alt: "A close-up of the album paragraph and the two buttons on Daniella Rabbani's homepage at launch: a citron Klezmerette button beside an outlined IMDb button, on a dark plum panel over an orchid ground.",
    ground: { from: "#f3e2ff", to: "#d27cf6", glow: "#ffffff" },
    layers: [
      { id: "buttons", src: `${D}/hero-buttons.webp`, ratio: 2.885, x: 3, y: 33, w: 94, z: 0, depth: 0, radius: 5, move: { push: 0.07, seconds: 5 } },
    ],
  },
  "daniella-card-swatches": {
    ratio: 1,
    alt: "A corner of the color styles Daniella Rabbani's site was designed from in Figma: five plums from near black to a dusty violet and five orchids from deep to pale, each labeled with its hex value, on a deep plum ground.",
    ground: { from: "#200024", to: "#3b1745", glow: "#d27cf6" },
    layers: [
      { id: "swatches", src: `${D}/swatches.webp`, ratio: 1.613, x: 4, y: 22, w: 92, z: 0, depth: 0, radius: 5, move: { push: 0.07, seconds: 5 } },
    ],
  },
};

export const sequences: Record<string, SequenceData> = {
  "koto-flow": {
    ratio: 1.9,
    alt: "A four-step walkthrough of Koto's redesigned dashboard, using sample data: sharing a view by link, building a view, reading its live data, and publishing a takeaway.",
    steps: [
      {
        scene: "koto-views",
        title: "Every view is a link",
        caption: "Design direction for the dashboard: a slim sidebar and a list of views, each with its own Copy link button. One row and its button are shown zoomed in.",
      },
      {
        scene: "koto-builder",
        title: "Build a view in four steps",
        caption: "Source, object, fields, review. Here, eight of an account's seventy fields are ticked; the checklist is shown zoomed in.",
      },
      {
        scene: "koto-data",
        title: "Live data, inside the plan's cap",
        caption: "A view's Data tab: live records with search, sort and CSV export. The table head and first rows are shown zoomed in.",
      },
      {
        scene: "koto-takeaways",
        title: "Publish a takeaway",
        caption: "The Takeaways tab keeps a history of AI-written summaries and lets the owner publish one above the shared data. The published banner and the newest entry are shown zoomed in.",
      },
    ],
  },
};
