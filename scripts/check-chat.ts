import assert from "node:assert/strict";
import { parseMessages } from "../lib/chat";
import { getKb } from "../lib/kb";

const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

assert.deepEqual(parseMessages({ messages: [u(" hi ")] }), [u("hi")]);
assert.ok(parseMessages({ messages: [u("q"), a("r"), u("q2")] }));
for (const bad of [
  null, {}, { messages: [] }, { messages: [a("x")] }, { messages: [u("q"), a("r")] },
  { messages: [u("q"), u("q")] }, { messages: [u("")] }, { messages: [u("x".repeat(1001))] },
  { messages: [{ role: "system", content: "x" }] }, { messages: [{ role: "user", content: 5 }] },
  { messages: Array.from({ length: 13 }, (_, i) => (i % 2 ? a("x") : u("x"))) },
]) assert.equal(parseMessages(bad), null, JSON.stringify(bad).slice(0, 60));

const kb = getKb();
assert.ok(kb.includes("Koto") && kb.includes("/work/koto") && !kb.includes("<!--"));
console.log(`ok — KB ${kb.length} chars (~${Math.round(kb.length / 4)} tokens)`);
