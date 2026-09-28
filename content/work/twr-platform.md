## The problem

An education nonprofit needed a web platform that a small team could actually run — course pages, resources, press, role-based access — without a developer in the loop for every content change.

## What I built

A custom WordPress theme and block system built from scratch, plus a design system now growing out of it.

Primary front-end developer, and owned the platform end to end — 615 commits of my own on the theme repo, alongside a handful of collaborators over its life.

- **16+ custom Gutenberg blocks**, each with its own field configuration, so editors compose real pages instead of fighting a generic page builder.
- **A design system, proposed from an accessibility audit.** Auditing the site's most-reused components turned up the same problem everywhere: each one rebuilt from scratch, with accessibility and modern standards re-solved page by page instead of once. Wrote the proof of concept myself, from Creative's own Figma file — then handed leadership of the real build to a direct report. The prototype and the early conversations with Creative and Marketing are theirs now, not just the easy parts.
- **A sign-in flow redesigned from a spec, not a hunch.** A confusing error state and a dead support link were driving avoidable support contacts — a real customer-experience cost, not just an eyesore. Wrote a six-change spec with annotated before/after mockups; it shipped as written.
- **A video-playback failure, root-caused properly.** Learners were getting stuck mid-course. Traced it to an HLS/CORS misconfiguration, specified the fix, and verified it end-to-end on a real account before calling it done.
- **Accessibility as a default, not a pass at the end.** ARIA roles, correct focus order, and an alt-text workflow across every custom block, checked against a real audit baseline rather than assumed.

## Where it stands

From 2022 into 2026, this was the platform the organization ran its public site and course delivery on, and I was its primary developer. My focus now is the integrations, systems, and workflows around it, and championing the design system, now led by a direct report I coached into it.
