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

// Shared pieces of the card prototypes below.
const LIVE = "/images/work/koto/live";
const MINT = { from: "#c9f7de", to: "#4bc57d", glow: "#ffffff" };
const CLOSE: SceneLayer = { id: "close", src: `${K}/crops/takeaway-close.webp`, ratio: 1.261, x: -38, y: -6, w: 140, z: 0, depth: 0, radius: 0, dof: { x: 63, y: 41, blur: 1.6 } };
const MACRO: SceneLayer = { id: "macro", src: `${K}/crops/takeaway-corner.webp`, ratio: 1.533, x: -16, y: -10, w: 108, z: 0, depth: 0, radius: 6, dof: { x: 52, y: 74, blur: 1.8 } };

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

  // Grid cards: a tighter stage whose key pieces sit in the middle, so the cover-fit crop to a
  // card's shape (wide on small cards, near-square on the feature card) never cuts them off.
  "koto-card": {
    // Square, so the near-square feature card is filled edge to edge. On the small wide
    // cards the stage is cropped top and bottom to the Views screen in the middle band.
    ratio: 1,
    alt: "Layered views of Koto's redesigned dashboard: the Views list with one view's row and its Copy link button zoomed in, and the Takeaways tab behind it.",
    layers: [
      {
        id: "tk",
        src: `${K}/takeaways.webp`,
        ratio: 1.6,
        x: 14,
        y: -6,
        w: 84,
        z: 0,
        depth: -0.7,
        dim: true,
        marks: [
          { x: 63.1, y: 27, w: 32, h: 12.6, for: "regen" },
          { x: 10.4, y: 44.3, w: 57.5, h: 11.5, for: "hist" },
        ],
      },
      {
        id: "views",
        src: `${K}/cover.webp`,
        ratio: 1.6,
        x: 2,
        y: 18,
        w: 96,
        z: 1,
        depth: 0,
        marks: [
          { x: 10.4, y: 14, w: 39.3, h: 12.6, for: "row" },
          { x: 75.8, y: 14, w: 19.3, h: 12.6, for: "copy" },
        ],
      },
      { id: "regen", src: `${K}/crops/regenerate.webp`, ratio: 4.046, x: 44, y: 2, w: 52, z: 2, depth: 0.9, zoom: true },
      { id: "copy", src: `${K}/crops/copy-link.webp`, ratio: 2.437, x: 66, y: 38, w: 30, z: 3, depth: 1.5, zoom: true },
      { id: "row", src: `${K}/crops/view-row.webp`, ratio: 4.966, x: 3, y: 64, w: 64, z: 3, depth: 1.1, zoom: true },
      { id: "hist", src: `${K}/crops/history-row.webp`, ratio: 8, x: 22, y: 84, w: 74, z: 2, depth: 0.8, zoom: true },
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

  // ------------------------------------------------------------------
  // Card prototypes (stage 1:1). The subject stays in the middle band so a 16:10 crop of the
  // stage keeps it. Close-ups use depth of field: only the point named in `dof` stays sharp.
  // ------------------------------------------------------------------
  "koto-card-context": {
    ratio: 1,
    alt: "Koto's redesigned Takeaways tab, the whole screen on a pale mint ground: a published summary banner, the Brief and Detailed switch, a Regenerate button and a short history of summaries.",
    ground: MINT,
    layers: [{ id: "screen", src: `${K}/takeaways.webp`, ratio: 1.6, x: 3, y: 21, w: 94, z: 0, depth: 0, radius: 1.8 }],
  },

  "koto-card-close": {
    ratio: 1,
    alt: "A close-up of Koto's redesigned Takeaways tab: the Brief and Detailed switch and the Regenerate button in focus, with the Copy link and Preview buttons and the history rows softly out of focus around them.",
    layers: [CLOSE],
  },

  "koto-card-macro": {
    ratio: 1,
    alt: "A macro of the corner of the Takeaways tab's summary card in Koto's redesign: the Brief and Detailed switch and the Regenerate button in focus, the rest softly blurred, and a strip of mint ground beyond the screen's edge.",
    ground: MINT,
    layers: [MACRO],
  },

  "koto-card-loop": {
    ratio: 1,
    loop: 4,
    alt: "Three close-ups of Koto's redesign in turn: the AI takeaway with its Brief and Detailed switch and Regenerate button, the view builder's four-step progress above a field checklist, and the navigation rail expanded to show its labels.",
    layers: [
      { ...CLOSE, id: "takeaway", slot: 0 },
      { id: "builder", src: `${K}/crops/builder-top.webp`, ratio: 1.556, x: -45, y: 3, w: 150, z: 1, depth: 0, radius: 0, slot: 1, dof: { x: 76, y: 36, blur: 1.6 } },
      { id: "nav", src: `${K}/crops/rail-open.webp`, ratio: 1.333, x: 0, y: 1, w: 130, z: 2, depth: 0, radius: 0, slot: 2, dof: { x: 20, y: 40, blur: 1.4 } },
    ],
  },

  "koto-card-pushin": {
    ratio: 1,
    loop: 4,
    ground: MINT,
    alt: "The AI takeaway in Koto's redesign at three distances in turn: the whole screen, a close-up of the Brief and Detailed switch and Regenerate button, and a macro of the summary card's corner.",
    layers: [
      { id: "context", src: `${K}/takeaways.webp`, ratio: 1.6, x: 3, y: 21, w: 94, z: 0, depth: 0, radius: 1.8, slot: 0 },
      { ...CLOSE, id: "close", z: 1, slot: 1 },
      { ...MACRO, id: "macro", z: 2, slot: 2 },
    ],
  },

  // ------------------------------------------------------------------
  // More macros and motion (Kirk, 2026-10-08). The "live" images are the shipped product's shared
  // Takeaways view (sample data); everything else is the redesign concept.
  // ------------------------------------------------------------------
  "koto-macro-views": {
    ratio: 1,
    alt: "A macro of the top right of Koto's redesigned Views screen: the All views and By source switch, the New view button and a view's Copy link button in focus, on a mint ground.",
    ground: MINT,
    layers: [{ id: "views", src: `${K}/crops/views-corner.webp`, ratio: 1.889, x: 0, y: 16, w: 96, z: 0, depth: 0, radius: 5, dof: { x: 52, y: 66, blur: 1.6 } }],
  },

  "koto-macro-stepper": {
    ratio: 1,
    alt: "A macro of the view builder's four-step progress in Koto's redesign: Source and Object done, Fields in focus, Review ahead, on a mint ground.",
    ground: MINT,
    layers: [{ id: "stepper", src: `${K}/crops/builder-top.webp`, ratio: 1.556, x: -50, y: 15, w: 150, z: 0, depth: 0, radius: 5, dof: { x: 76, y: 36, blur: 1.6 } }],
  },

  "koto-macro-live-bars": {
    ratio: 1,
    alt: "A macro of a chart from the live product's shared Takeaways view: a bar chart of contact counts by title level, with sample data, in mint green on a dark card.",
    ground: MINT,
    layers: [{ id: "bars", src: `${LIVE}/live-bars.webp`, ratio: 1.435, x: -18, y: 8, w: 112, z: 0, depth: 0, radius: 4, dof: { x: 35, y: 55, blur: 1.4 } }],
  },

  "koto-macro-live-donut": {
    ratio: 1,
    alt: "A macro of a chart from the live product's shared Takeaways view: a donut chart of contacts by department, with sample data, in shades of mint green on a dark card.",
    ground: MINT,
    layers: [{ id: "donut", src: `${LIVE}/live-donut.webp`, ratio: 1.418, x: -6, y: 11, w: 112, z: 0, depth: 0, radius: 4, dof: { x: 50, y: 48, blur: 1.4 } }],
  },

  "koto-macro-live-tabs": {
    ratio: 1,
    alt: "A macro of the live product's shared view: the Data and Takeaways switch with Takeaways selected in green, above an AI-written Executive Summary with a highlighted figure, on a mint ground.",
    ground: MINT,
    layers: [{ id: "tabs", src: `${LIVE}/live-tabs.webp`, ratio: 2.373, x: 5, y: 31, w: 150, z: 0, depth: 0, radius: 4, dof: { x: 30, y: 27, blur: 1.4 } }],
  },

  // Close-up and macro with the camera moving: a slow push in, and focus pulled from one control to another.
  "koto-card-close-move": {
    ratio: 1,
    alt: "A close-up of Koto's redesigned Takeaways tab with the focus slowly moving from the Brief and Detailed switch and Regenerate button down to the Open and Unpublish buttons in the history, as the view creeps in.",
    layers: [{ ...CLOSE, id: "close", move: { push: 0.1, rack: { x: 80, y: 66 }, seconds: 7 } }],
  },

  "koto-card-macro-move": {
    ratio: 1,
    alt: "A macro of the corner of the Takeaways tab's summary card in Koto's redesign, with the focus slowly moving from the Regenerate button to the Brief and Detailed switch, on a mint ground.",
    ground: MINT,
    layers: [{ ...MACRO, id: "macro", move: { push: 0.08, rack: { x: 26, y: 76 }, seconds: 7 } }],
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
