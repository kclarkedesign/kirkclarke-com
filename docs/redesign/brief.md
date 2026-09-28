# kirkclarke.com — design brief

For the Claude Design prototype. Everything below is the durable source — the plan file this came from is implementation detail; this is the brief itself.

## Who this is for, and what it needs to do

Kirk Clarke — designer, engineer, creative technologist. Twenty years building websites and platforms; currently Senior Director of Technology at an education nonprofit, and an independent product builder on the side.

**This is a personal space, not a pitch.** No "available for hire" banner, no switch that names an audience, nothing that announces a job search. It reads as: here's who I am and what I've built. It still has to work two ways at once, silently:

- Strong enough that attaching the link to a job application holds up under a hiring manager's scrutiny.
- Open enough that a consulting inquiry can start from it — without the page ever making that ask.

The reader can't tell which of those two people they are to the site. That's the point.

## Identity

He doesn't lead with "best at X." He's resourceful — finds the real problem and removes it, across design, engineering, and leadership, without needing to pick one lane. Range is the pitch, but it has to show up as receipts (real outcomes), never as a claim.

**Headline candidates** (pick one, or riff):
1. "I find the real problem. Then I remove it."
2. "Designer. Engineer. Leader. Mostly, the one who makes the problem go away."
3. "Problems in. Shipped work out."

**Voice rules:** direct, problem-then-punchline, no throat-clearing. Specific over abstract. Never: genuinely, honestly, straightforward, robust, seamless, leverages, synergies, "I'm thrilled to announce."

## Information architecture

| Route | Contents |
|---|---|
| `/` | Hero (moving gradient, name, headline, "Ask about my work"). Proof strip — one consistent set of the strongest outcomes across all work. Work grid with tag filters, URL-backed. "How I work": **four** principles now (added "Range over specialization"), each linked to real proof. About as a 3-beat story — where it started / learning by doing / where he is now — plus a compact "day to day" scope table for the current role, and the detailed timeline. Contact: an open, unlabeled invitation. |
| `/work/[slug]` | Headline outcome. Role, timeline, stack. Problem → what I did → outcome → an optional closing "what this taught me" reflection. Visuals. |
| Chat | Global, opened from nav or hero. "Ask about my work" — never framed as a hiring-manager tool specifically. |
| Legacy | `/courses/**`, `/getting-started.html`, `/hosted/impact-report-2020/`, `/ng-video-game-db/` all keep working at their existing URLs. The HTML course is mentioned in passing in the About copy, never featured in the main work grid — the 2021-vintage visual quality would read as a step down right where someone clicks in. |

**The work grid uses one filter, not an audience switch.** Tags mix broad categories (Design, Engineering, Leadership, AI) with specific ones (Salesforce, Next.js, Figma) — exactly the mechanic the 2021 site already used for PHP/React/WordPress tags. Multi-select, OR logic, and the URL is the only source of truth (`?tag=leadership&tag=integrations`), so a specific link can be sent for a specific purpose without the mechanism itself ever being labeled.

**Contact is an invitation, not a status.** Something like "Got a hard problem? I'd like to hear about it." Reads the same to a hiring manager, a consulting lead, or someone just curious.

## Personality — one line of texture, not a theme

The About section carries a single specific "off duty" line: dine-in movies at the Alamo Drafthouse (Resident Evil most recently), first- and third-person shooters (Destiny 2, Marvel Rivals, Arc Raiders). That's the only place it shows up as text. Visually, it shows up once more, subtly: cards get a thin corner-bracket accent on hover (a restrained nod to target-lock HUD design, not a gaming theme).

**No visitor-facing "switch the feel" control.** Considered and rejected — it would read as indecision, not range, and it's real engineering cost for a decision that's the site's to make once. Instead: one confident default direction, plus a small *hidden* easter egg (tucked in the footer or behind a keyboard shortcut, gamer-coded framing like "New Game+") that swaps in an alternate feel for whoever finds it. Exact placement decided during build, not in the prototype.

## The hard separation rule

The Writing Revolution (employer) and the independent work (Koto, Kibi, Intuition UI, Overland Innovators) never cross-reference: no shared tags that imply overlap, no "related work" links between them, no case study that mentions both. The chatbot enforces this too — it never speculates about a connection between them, in either direction.

## TWR work: shown at architecture level only

Problem → approach → outcome, past tense for the platform build. No customer names, no dollar figures, no dates narrower than a year, no vendor names, no named colleagues (roles only, sparingly). Real screenshots of internal tools are never used — redrawn diagrams only, or no visual at all.

## Palette

Carried over from the 2021 site's colors, which are already formalized as Intuition UI's token system — same family, not a new palette.

| Role | Value | Contrast |
|---|---|---|
| Page ground | `#0a0a0a` | — |
| Raised surface | `#171717` | — |
| Hairline border | `#262626` | — |
| Signature accent (the original celadon) | `#98dfaf` | ~12.7:1 on `#0a0a0a` |
| Action / primary | `#4bc57d` | text on it: `#06170e` (8.43:1) |
| Deep accent | `#1e5a38`, `#0f3521` | — |
| Highlight | `#baf7d8` | — |
| Text, primary | `#fafafa` | — |
| Text, secondary | `#a1a1a1` | 7.31:1 |
| Text, label/eyebrow | `#8a8a8a` | 5.63:1 |

Never use `#737373` or `#525252` for text — both fail AA on these surfaces.

**Light mode: yes, dark stays the default.** A real light theme, following `prefers-color-scheme` automatically, with a small manual override (Koto's own ☀️/🌙 pattern) for anyone who wants to force one. Different call from the rejected "feel switcher" above — this one is normalized, expected UI that some visitors need (glare, photosensitivity), not a personality flex. Reuses Koto's own published light tokens: surface `#ffffff`/`#fafafa`/`#f5f5f5`, text `#171717`/`#525252`, mint accent text `#246e44` (the darker step, for AA contrast on white). Wired up during the build phase, not retrofitted into the Claude Design artboards.

## Motion

- **Hero: a moving mint gradient — direction settled on "Calm."** Two soft blurred circles (mint + signature) drifting independently, faster and brighter than the first pass turned out to need — the original calibration was too slow and faint to read as alive at a glance. CSS-first (animated custom properties); WebGL only if CSS can't hit 60fps. Shifts subtly on a filter change; responds to pointer position with a small glow that follows the cursor inside the hero. Pauses offscreen; a static frame under reduced motion. (Two other directions — a painterly diagonal wash, and thin graphic bands — were prototyped and set aside in favor of this one.)
- **Filter changes** reflow the grid through view transitions.
- **Scroll reveals** are subtle fades, not slides or bounces.
- **Hover** gets a mint edge glow. No scale, no translate, no shrink.
- **Reduced motion is respected everywhere**, not just the hero.

## Type

**Decided: Space Grotesk (display) / Inter (body) / JetBrains Mono (metadata — dates, tags, stack labels).** A second pairing (Fraunces, a serif with real character, leaning into the book/editorial side of the work) was prototyped and set aside in favor of this one. Self-hosted via `next/font`.

## Mark

The existing circle-K SVG mark (currently inline in the 2021 homepage) is real and stays — no new logo needed.

## Imagery

Real product screenshots (Koto, Kibi — reshoot these fresh, not from stale dev builds), the book's cover and interior spreads once available, redrawn architecture diagrams for TWR work. No stock photography, no illustration, no generic gradients-as-content.

## Accessibility floor

WCAG 2.2 AA. Visible focus rings in the accent color. Filter buttons are real toggle buttons (`aria-pressed`) with a live region announcing the result count. Full keyboard access to filters and chat.

## AI chat

"Ask about my work" — grounded only in this site's own content, answers short, links back into the case studies and filtered grid. On anything about availability, comp, or "is he looking" — warm, general, never confirming or denying, always pointing to email. Never speculates about a link between TWR and the independent work.

## What "done" looks like

A visitor who came from a job posting sees enough proof to move to the next round. A visitor who came from nowhere in particular, just curious, sees a person — and if they happen to have a hard problem of their own, the door is right there.
