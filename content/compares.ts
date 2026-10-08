// Before / after pairs for case-study markdown: ![alt](compare:daniella-desktop "Caption").
// Both images of a pair share one shape (`ratio`, width ÷ height), so the divider lines
// up and the frame reserves its space before anything loads.

export interface CompareData {
  /** One description of the pair; the images themselves are decorative to a screen reader. */
  alt: string;
  before: string;
  after: string;
  ratio: number;
  /** Narrow pairs (phone screenshots) shouldn't stretch to the column. */
  maxWidth?: string;
}

const D = "/images/work/daniella-rabbani";

export const compares: Record<string, CompareData> = {
  "daniella-desktop": {
    alt: "Daniella Rabbani's homepage on a desktop, before and after the redesign. Before: a white header, then a dark section with a long paragraph of credits beside a portrait and one tickets link. After: a dark plum page with the portrait, her name, a short line about the album and two buttons, then a second strip for the concert.",
    before: `${D}/desktop-before.webp`,
    after: `${D}/desktop-after.webp`,
    ratio: 1.9,
  },
  "daniella-mobile": {
    alt: "The same two homepages on a phone. Before: a header with a menu icon and her wordmark above a large portrait. After: a plum page with a short headline and two buttons above the portrait.",
    before: `${D}/mobile-before.webp`,
    after: `${D}/mobile-after.webp`,
    ratio: 640 / 1400,
    maxWidth: "20rem",
  },
};
