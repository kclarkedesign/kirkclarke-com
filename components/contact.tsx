"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { MAX_MESSAGE } from "@/lib/contact";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const initial: ContactState = { status: "idle", message: "" };

const fieldClasses =
  "w-full rounded-xl border border-(--hairline) bg-(--ground) px-4 py-3 text-sm text-(--text) placeholder:text-(--text-label) hover:border-(--action)";

export default function Contact() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scriptRequested = useRef(false);
  // Bumped after a successful send so the next open starts with a blank form.
  const [formKey, setFormKey] = useState(0);

  // Google's script is heavy and this section is on every page, so it only
  // loads once someone opens the form.
  function open() {
    dialogRef.current?.showModal();
    if (!SITE_KEY || scriptRequested.current) return;
    scriptRequested.current = true;
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    document.head.appendChild(s);
  }

  function onClose() {
    if (dialogRef.current?.querySelector("[data-sent]")) setFormKey((k) => k + 1);
  }

  return (
    <section
      id="contact"
      className="flex flex-col items-center gap-6 border-t border-(--hairline) px-5 py-16 text-center md:px-16 md:py-24"
    >
      <h2 className="m-0 font-display text-xl font-semibold md:text-2xl">
        Got a hard problem? I&rsquo;d like to hear about it.
      </h2>
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
        <button
          type="button"
          onClick={open}
          className="rounded-full bg-(--action) px-5 py-3 text-sm font-semibold text-(--action-text) transition hover:brightness-110"
        >
          Send me a message
        </button>
        <a
          href="https://www.linkedin.com/in/kclarke/"
          target="_blank"
          rel="noopener"
          className="text-sm text-(--text-secondary) hover:text-(--text)"
        >
          LinkedIn
        </a>
        {/* Résumé link: omitted rather than shipped dead; add back once a
            résumé PDF lands in public/. */}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="contact-title"
        onClose={onClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-full max-w-130 rounded-2xl border border-(--hairline) bg-(--raised) p-0 text-left text-(--text) backdrop:bg-black/60"
      >
        <div className="flex items-center justify-between border-b border-(--hairline) px-6 py-4">
          <h3 id="contact-title" className="m-0 font-display text-base font-semibold">
            Send me a message
          </h3>
          <button
            type="button"
            aria-label="Close"
            className="text-(--text-label) transition-colors hover:text-(--text)"
            onClick={() => dialogRef.current?.close()}
          >
            ✕
          </button>
        </div>
        <ContactForm key={formKey} onDone={() => dialogRef.current?.close()} />
      </dialog>
    </section>
  );
}

function ContactForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState(sendContact, initial);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submit = (token: string) => {
      formData.set("g-recaptcha-response", token);
      startTransition(() => formAction(formData));
    };
    if (!SITE_KEY || !window.grecaptcha) {
      submit("");
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha!.execute(SITE_KEY, { action: "submit" }).then(submit, () => submit(""));
    });
  }

  if (state.status === "ok") {
    return (
      <div data-sent className="flex flex-col items-start gap-4 px-6 py-8">
        <p role="status" className="m-0 text-base">
          {state.message}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-(--hairline) px-4 py-2 text-sm hover:border-(--action)"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 px-6 py-6">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Name
        <input name="name" type="text" required maxLength={100} autoComplete="name" className={fieldClasses} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={fieldClasses} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Message
        <textarea name="message" required maxLength={MAX_MESSAGE} rows={5} className={fieldClasses} />
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input name="choices" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-(--action) px-5 py-3 text-sm font-semibold text-(--action-text) transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>

      <p role="status" className="m-0 min-h-5 text-sm text-(--text-secondary)">
        {state.status === "error" ? state.message : ""}
      </p>

      {SITE_KEY && (
        <p className="m-0 text-xs text-(--text-label)">
          Protected by reCAPTCHA; the Google{" "}
          <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and{" "}
          <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
        </p>
      )}
    </form>
  );
}
