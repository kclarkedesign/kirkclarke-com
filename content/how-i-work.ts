// Visual-card copy for the "How I work" section — tighter than
// content/kb/how-i-work.md's prose (which carries [[wiki-links]] to
// case studies for the chatbot). Same 4 principles, deliberately
// shorter form for the card grid — see content/day-to-day.ts for the
// same pattern and why.

export interface Principle {
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    title: "Fix the root, not the ticket",
    body: "A bug report names a symptom, not a cause. I look for every other place the same mistake could hide before I patch the one someone noticed.",
  },
  {
    title: "Read the source, not the explanation",
    body: "When something's broken and someone already has a theory, I check it against the actual code and data before I accept it.",
  },
  {
    title: "Ship the guardrail with the automation",
    body: "AI drafts, checks, and proposes — a person approves. Every automated system I build keeps a human in the loop on anything with real consequences.",
  },
  {
    title: "Range over specialization",
    body: "Doing one thing for too long is its own kind of failure mode, for me. That's why I end up owning the connective tissue between design, engineering, and the team that runs both.",
  },
];
