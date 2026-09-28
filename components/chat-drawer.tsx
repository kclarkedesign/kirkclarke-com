"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Mark from "./mark";

export interface ChatDrawerHandle {
  open: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What's Koto?",
  "Has he managed people?",
  "Is he available for consulting?",
];

// Native <dialog> — showModal() gives us a focus trap and Escape-to-close
// for free, no extra library. The message list / fetch+stream wiring
// (plan §6) lands in Milestone 5; this is the shell: open/close, the
// suggested-question chips, and the input row.
const ChatDrawer = forwardRef<ChatDrawerHandle>(function ChatDrawer(_props, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }));

  function ask(question: string) {
    // Placeholder until Milestone 5 wires this to /api/chat.
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: "Chat is coming soon — email ignite@kirkclarke.com in the meantime." },
    ]);
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
            className="text-(--text-label) hover:text-(--text)"
            onClick={() => dialogRef.current?.close()}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-(--ground) p-5" aria-live="polite">
          {messages.length === 0 && (
            <p className="text-sm leading-relaxed text-(--text-secondary)">
              Ask anything about the work below — grounded only in what&rsquo;s on
              this site.
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
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-(--hairline) bg-(--ground) px-5 py-3.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
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
            placeholder="Ask a question…"
            aria-label="Ask a question"
            className="flex-1 rounded-full border border-(--hairline) bg-(--raised) px-4 py-3 text-sm text-(--text)"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-(--action) text-(--action-text)"
          >
            ↑
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default ChatDrawer;
