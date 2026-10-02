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

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const PROFILES = [
  {
    label: "GitHub",
    href: "https://github.com/kclarkedesign",
    icon: (
      <svg {...iconProps}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kclarke/",
    icon: (
      <svg {...iconProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://createwithkirk.medium.com/",
    icon: (
      <svg {...iconProps}>
        <circle cx="6.5" cy="12" r="4.5" />
        <ellipse cx="15.5" cy="12" rx="2.5" ry="4.5" />
        <ellipse cx="21" cy="12" rx="1" ry="4" />
      </svg>
    ),
  },
];

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
        <nav aria-label="Profiles" className="flex items-center gap-3.5">
          {PROFILES.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener"
              aria-label={label}
              title={label}
              className="flex rounded-lg border border-(--hairline) p-2 text-(--text) transition-colors hover:border-(--action)"
            >
              {icon}
            </a>
          ))}
        </nav>
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
