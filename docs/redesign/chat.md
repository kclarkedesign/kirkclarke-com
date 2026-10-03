# Chat ("Ask about my work")

How the site chatbot works and how to change what it knows. Design intent lives in `brief.md` (§ AI chat); this file is the operating manual.

## How it works

| Piece | File |
|---|---|
| Knowledge base builder | `lib/kb.ts` — concatenates `content/projects.ts`, `content/work/*.md` case studies and every `content/kb/*.md` |
| System prompt, validation, request builder | `lib/chat.ts` (`buildChatRequest` is shared by the route and the eval) |
| Streaming endpoint | `app/api/chat/route.ts` (Node runtime, plain-text chunked body) |
| UI | `components/chat-drawer.tsx` (native `<dialog>`, `react-markdown`, internal links via `<Link>`) |
| Eval | `scripts/eval-chat.ts` (`pnpm eval:chat`) and `scripts/check-chat.ts` (validation + KB build) |

No RAG, no database: the whole KB (about 6.4K tokens) goes into the system prompt on every request and is prompt-cached. The bot answers only from it.

- **Model:** `CHAT_MODEL` env var, default `claude-haiku-4-5`. It was chosen by the eval as the cheapest model that passes every boundary question in every run. `effort: low` is sent to every model except Haiku (which rejects it); the refusal fallback is Opus-only.
- **Limits:** at most 12 messages, 1,000 characters each, strictly alternating, starting and ending with the user; anything else is a 400. Any SDK error or refusal becomes a calm "Chat is resting" message that points to the contact form.
- **Env:** `ANTHROPIC_API_KEY` (a dedicated key with a monthly spend cap in the Anthropic Console; a Secret on Vercel, never committed) and optional `CHAT_MODEL`.
- **Contact:** the bot never prints an email address. Availability, compensation, consulting, notice and similar questions point to "Send me a message" in the Contact section (`/#contact`) and never confirm or deny an active job search.

## Adding or changing what the bot knows

1. **Prose facts** (history, skills, FAQ answers): add or edit a Markdown file in `content/kb/`. Every file in that folder is included automatically, so there are no code changes. Don't put docs or notes there: everything in `content/kb/` is fed to the model.
2. **Work with a card or case study:** add it to `content/projects.ts` and write `content/work/<slug>.md`. The bot sees both.
3. **Write the exact facts you want said.** The bot only knows what is written, and small models sometimes fill gaps (for example, inventing "built on his own time" until a prompt rule and an eval check were added). Concrete clients, years and outcomes leave no gaps to fill.
4. **Keep independent work and employer work separate.** Never add text that links them, or that describes hours, equipment or arrangements. The bot repeats what the KB says.
5. **Hand-authored only.** Never point the KB builder at notes, résumé or job-search folders outside `content/`.
6. **Re-run the eval** (below). For anything that needs a firm answer or a boundary, add a question to `QUESTIONS` in `scripts/eval-chat.ts` with `must` / `mustNot` patterns.

## Running the eval

```bash
pnpm eval:chat claude-haiku-4-5          # one model
pnpm eval:chat                           # Haiku, Sonnet, Opus (about $1–2)
SHOW=1 pnpm eval:chat claude-haiku-4-5   # also print every reply from run 1, to read the tone
```

It reads `ANTHROPIC_API_KEY` from `.env.local` (and never prints it), asks each question three times and reports pass counts and estimated spend. A Haiku run costs about $0.06. The pass rule is **100% of boundary questions in every run**. The checks are regexes, so a failure can be a too-narrow pattern rather than a bad reply: read the printed sample before changing the prompt, and read the replies with `SHOW=1` now and then, because passing the patterns doesn't prove the tone is right.

If Node fails with "unable to verify the first certificate" (antivirus that re-signs TLS), run with `--use-system-ca`: `npx tsx --use-system-ca scripts/eval-chat.ts`. Don't disable certificate checking in code.

## Before shipping a change

`pnpm check-types`, `pnpm lint`, `pnpm build`, `npx tsx scripts/check-chat.ts`, and the eval.
