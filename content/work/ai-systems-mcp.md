## The problem

Every data question about the business was routed through a third party to answer, because the org had no way to query its own systems directly — and once AI tools arrived, the risk flipped: too much autonomy, too fast, with no one checking the model's work.

## What I built

A set of read-only MCP servers that let the org query its own data directly, plus the security architecture behind a larger internal MCP platform, plus the company-wide program that got people actually using any of it well.

- **Read-only by construction, not by convention.** The Salesforce MCP server I built solo exposes exactly five read tools; the write flag is off in the code, not just in a permissions setting someone could flip.
- **A real protocol-level finding.** Testing the OAuth flow directly, I found that resource parameters (RFC 8707) were being silently ignored — every token's audience came back identical regardless of what was requested. That single finding is why the platform runs one MCP server per upstream system, each checking its own client identity, instead of one combined server trusting a shared token.
- **Architecture and security review, honestly credited.** I designed the platform's security model, ran the OAuth testing, and reviewed every server that shipped on it; a teammate wrote most of the code for the servers beyond the two I built solo.
- **AI enablement, org-wide.** Beyond the tooling: a real program — a stack, training, and hands-on onboarding paired with people's actual work, not a slide deck.

## Where it stands

Live and in daily use. The guardrail that matters most: nothing with financial or data impact runs unattended — a human signs off, every time.
