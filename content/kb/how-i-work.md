**Fix the root, not the ticket.**
A bug report names a symptom, not a cause. Before patching the thing someone noticed, I look for every other place the same mistake could be hiding — a shared conflict-checker instead of three copies of the same logic, one rule for what "superseded" means instead of a patch for each new case. One fix in the right place beats five fixes in the wrong ones. See: [[host-scheduler]], [[checkout-to-qbo]].

**Read the source before trusting the explanation.**
When something's broken and someone already has a theory about why, I check it against the actual code and data before accepting it — because the theory is sometimes wrong, and the fix built on top of a wrong theory never actually lands. Protocol-level testing, not assumptions, found the OAuth gap that shaped an entire platform's security design. See: [[ai-systems-mcp]].

**Ship the guardrail with the automation, not after it.**
AI drafts, checks, and proposes — a person approves. That's not a style preference; it's the design. Every automated system I've built keeps a human in the loop on anything with real consequences, and new automation ships switched off until it's proven against real data. See: [[host-scheduler]], [[ai-systems-mcp]].

**Range over specialization.**
Doing one thing for too long is its own kind of failure mode, for me. That restlessness is why I end up owning the connective tissue between design, engineering, and the team that runs both — not the deepest specialist in the room, but the one holding the seams together.
