# Public-safety checklist

Things to confirm or do before any of this content goes live. Nothing here blocks the Claude Design prototype — it's all content-level, not design-level.

## Facts to confirm (conflicts found across your own source docs)

- [x] **Degree:** BA, Drawing & Graphic Design, Binghamton University.
- [x] **WordPress platform commit count:** checked directly against `TWRorg/twrwebsite`'s real commit history — 615 commits under your email, out of 1,243 total. The 614+/600+ split in your own docs was the same number rounded two ways, not two different scopes.
- [ ] **Order Change Tool v2.3 ship date**, if it ever needs a specific year in copy (one source implies Jan 2025, another implies Jan 2026 — only matters if you cite the AUD launch date specifically; the current copy stays at year-level or vaguer).

## Content that needs your input directly (not scraped)

- [x] **Daniella Rabbani site** — designed in Figma with Claude Design, built in Wix, design and build both yours.
- [x] **Words of Wisdom** — real title, author, and description in from you directly. Only the publication year is still open (`content/projects.ts`).
- [x] **Intuition UI** — decided to show it, framed honestly as in progress rather than a finished system.
- [x] **Location** — deliberately left out of the chatbot's knowledge base; not stated anywhere on the site.
- [x] **Contact email** — ignite@kirkclarke.com, in `content/kb/faq.md`. Still needs to land in the actual site contact section once that's built.

## Before using any Koto visuals

- [ ] Re-shoot Koto's screenshots. The ones currently in `docs/images/` show a Next.js dev badge, old "early access" marketing copy, and a personal inbox in one dashboard shot. Regenerate with `pnpm --filter web test:e2e:screenshots` in the Koto repo, using demo data.

## Unrelated to this project, but still open (tracked separately in session memory)

- [ ] Check the likely-live secret committed to `TWRorg/checkout-to-qbo` (`refs/curl-post-with-webhook-secret.sh`, `refs/curl-combined-invoice.yaml`) against your live Vercel env vars, and rotate if it matches.
- [ ] Make `kclarkedesign/claude-code` (a public fork of leaked Claude Code source) private or delete it.
