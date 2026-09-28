## The problem

Notes, conversations, and documents pile up faster than anyone reorganizes them. The knowledge is in there somewhere — the retrieval is the part that never gets built.

## What I built

Kibi is an agentic knowledge base: paste or upload content, an AI extracts structured entries — insight, decision, action item, concept, reference, note — and a retrieval agent answers questions against them with citations back to the source.

- **Retrieval is a real pipeline, not a keyword search.** pgvector with an HNSW index; every stored vector records which embedding model produced it, so the model can be swapped later without breaking old data.
- **Prompt injection is resisted structurally.** Retrieved content is data, and only ever enters the user turn — never the system prompt. The model can't be redirected by something it retrieved.
- **Row-level security on every table**, so retrieval can't leak across accounts even if application code has a bug.
- **A real bug, root-caused properly.** Magic-link sign-in was silently failing for some users. The cause turned out to be a mail client's link-prescanner opening (and burning) the single-use token before the person ever clicked it — found by reading the actual auth logs, not by guessing.

## Where it stands

Phase 1, built for a single user, live at usekibi.com.
