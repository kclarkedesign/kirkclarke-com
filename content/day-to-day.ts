// Structured label/desc pairs for the About section's "day to day" table.
// content/kb/day-to-day.md holds the same facts as prose, for the chatbot —
// kept as two small, deliberately duplicated forms rather than parsing one
// out of the other (plan §11b, Milestone 3).

export interface DayToDayRow {
  label: string;
  desc: string;
}

export const dayToDay: DayToDayRow[] = [
  {
    label: "Leading the integration layer",
    desc: "Salesforce, QuickBooks, and the systems that connect them, kept coherent.",
  },
  {
    label: "Managing and growing people",
    desc: "Real ownership handed over, not just tasks — a direct report is currently leading a design-system initiative he proposed and prototyped himself.",
  },
  {
    label: "Vendor governance",
    desc: "Holding outside partners accountable to what they actually shipped.",
  },
  {
    label: "AI enablement",
    desc: "Tooling, training, and hands-on onboarding, across the org.",
  },
  {
    label: "Still hands-on",
    desc: "Writing code and reviewing pull requests, not just directing.",
  },
];
