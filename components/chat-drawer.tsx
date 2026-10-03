"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import Mark from "./mark";
import { useSiteDialogs } from "./site-dialogs-context";

export interface ChatDrawerHandle {
  open: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What's Koto?",
  "Has he managed people?",
  "Is he available for consulting?",
];

// Module-level so react-markdown sees the same component type on every render;
// a link component created inside ChatDrawer is a new type per streamed chunk,
// which remounts every link in the reply.
function ReplyLink({ href = "", children }: ComponentProps<"a">) {
  const { openContact } = useSiteDialogs();
  if (href === "/#contact") {
    return (
      <a
        href={href}
        className="underline"
        onClick={(e) => {
          e.preventDefault();
          e.currentTarget.closest("dialog")?.close();
          openContact();
        }}
      >
        {children}
      </a>
    );
  }
  return href.startsWith("/") ? (
    <Link href={href} className="underline" onClick={(e) => e.currentTarget.closest("dialog")?.close()}>
      {children}
    </Link>
  ) : (
    <a href={href} className="underline" target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
const MARKDOWN_COMPONENTS = { a: ReplyLink };

const RESTING = "Chat is resting right now — use “Send me a message” in the [Contact section](/#contact) to reach Kirk.";

// Native <dialog> — showModal() gives us a focus trap and Escape-to-close
// for free, no extra library. Replies stream from /api/chat as a plain-text
// body (plan §6).
const ChatDrawer = forwardRef<ChatDrawerHandle>(function ChatDrawer(_props, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Braces matter: an effect must return nothing or a cleanup function, and
  // scrollIntoView's return value would crash React on commit.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }));

  function setReply(text: string) {
    setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", text }]);
  }

  async function ask(question: string) {
    if (busy) return;
    const history = [...messages, { role: "user" as const, text: question }];
    setMessages([...history, { role: "assistant", text: "" }]);
    setBusy(true);
    setAnnounce("");
    let text = "";
    try {
      // Last 11 keeps the server's alternating user-first, user-last shape (max 12).
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-11).map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setReply(text);
      }
    } catch {
      text ||= RESTING;
      setReply(text);
    } finally {
      setBusy(false);
      setAnnounce(text);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Ask about Kirk's work"
      className="m-auto w-full max-w-[480px] rounded-2xl border border-(--hairline) bg-(--raised) p-0 text-(--text) backdrop:bg-black/60"
    >
      <div className="flex h-[min(680px,80vh)] flex-col">
        <div className="flex items-center justify-between border-b border-(--hairline) bg-(--ground) px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Mark className="h-4.5 w-4.5" />
            <span className="font-display text-sm font-bold">Ask about my work</span>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="text-(--text-label) transition-colors hover:text-(--text)"
            onClick={() => dialogRef.current?.close()}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-(--ground) p-5">
          {messages.length === 0 && (
            <p className="text-sm leading-relaxed text-(--text-secondary)">
              Ask anything about the work below — an AI assistant grounded only in
              what&rsquo;s on this site. It isn&rsquo;t Kirk, and it can be wrong.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "max-w-[80%] self-end rounded-2xl rounded-br-sm bg-(--action) px-3.5 py-2.5 text-sm leading-relaxed text-(--action-text)"
                  : "max-w-[85%] self-start rounded-2xl rounded-bl-sm border border-(--hairline) bg-(--raised) px-4 py-3 text-sm leading-relaxed text-(--text)"
              }
            >
              {m.role === "user" ? m.text : m.text ? <Markdown components={MARKDOWN_COMPONENTS}>{m.text}</Markdown> : "…"}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <p className="sr-only" aria-live="polite">{announce}</p>

        <div className="flex flex-wrap gap-2 border-t border-(--hairline) bg-(--ground) px-5 py-3.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={busy}
              onClick={() => ask(q)}
              className="rounded-full border border-(--hairline) px-3 py-1.5 font-mono text-xs text-(--text-secondary) hover:border-(--action) hover:text-(--text)"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2.5 bg-(--ground) px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem("question") as HTMLInputElement;
            if (input.value.trim()) {
              ask(input.value.trim());
              input.value = "";
            }
          }}
        >
          <input
            name="question"
            type="text"
            maxLength={1000}
            placeholder="Ask a question…"
            aria-label="Ask a question"
            className="flex-1 rounded-full border border-(--hairline) bg-(--raised) px-4 py-3 text-sm text-(--text)"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={busy}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-(--action) text-(--action-text) transition hover:brightness-110"
          >
            ↑
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default ChatDrawer;
