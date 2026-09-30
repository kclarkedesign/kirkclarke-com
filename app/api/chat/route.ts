import Anthropic from "@anthropic-ai/sdk";
import { buildChatRequest, parseMessages } from "@/lib/chat";

export const runtime = "nodejs";

// Every failure (SDK error, refusal, missing key) becomes this — no internals leak.
const RESTING = "Chat is resting right now — email Kirk at ignite@kirkclarke.com.";

export async function POST(req: Request) {
  const messages = parseMessages(await req.json().catch(() => null));
  if (!messages) return Response.json({ error: "Invalid messages" }, { status: 400 });

  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        const stream = new Anthropic().beta.messages
          .stream(buildChatRequest(messages), { signal: req.signal })
          .on("text", (t) => {
            sent = true;
            controller.enqueue(enc.encode(t));
          });
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !sent) controller.enqueue(enc.encode(RESTING));
      } catch (err) {
        if (!req.signal.aborted) {
          console.error("chat error", err instanceof Anthropic.APIError ? err.status : err);
          controller.enqueue(enc.encode(sent ? `\n\n${RESTING}` : RESTING));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
