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
}

export interface SceneData {
  /** Stage width ÷ height. */
  ratio: number;
  /** One description for the whole composition; the layers themselves are decorative. */
  alt: string;
  layers: SceneLayer[];
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
