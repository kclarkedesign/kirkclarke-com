"use client";

import { forwardRef, startTransition, useActionState, useImperativeHandle, useRef, useState } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { MAX_MESSAGE } from "@/lib/contact";
import ProfileLinks from "./profiles";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      };
    };
  }
}

export interface ContactDialogHandle {
  open: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const initial: ContactState = { status: "idle", message: "" };

const fieldClasses =
  "w-full rounded-xl border border-(--hairline) bg-(--ground) px-4 py-3 text-sm text-(--text) placeholder:text-(--text-label) hover:border-(--action)";

const ContactDialog = forwardRef<ContactDialogHandle>(function ContactDialog(_props, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scriptRequested = useRef(false);
  // Bumped after a successful send so the next open starts with a blank form.
  const [formKey, setFormKey] = useState(0);

  // Google's script is heavy and this dialog is on every page, so it only
  // loads once someone opens the form.
  useImperativeHandle(ref, () => ({
    open: () => {
      dialogRef.current?.showModal();
      if (!SITE_KEY || scriptRequested.current) return;
      scriptRequested.current = true;
      const s = document.createElement("script");
      s.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`;
      s.async = true;
      document.head.appendChild(s);
    },
  }));

  function onClose() {
    if (dialogRef.current?.querySelector("[data-sent]")) setFormKey((k) => k + 1);
  }

  return (
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
        <h2 id="contact-title" className="m-0 font-display text-base font-semibold">
          Send me a message
        </h2>
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
      <div className="flex items-center justify-between gap-4 border-t border-(--hairline) px-6 py-4">
        <span className="text-sm text-(--text-secondary)">Or find me elsewhere</span>
        <ProfileLinks />
      </div>
    </dialog>
  );
});

export default ContactDialog;

function ContactForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState(sendContact, initial);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submit = (token: string) => {
      formData.set("g-recaptcha-response", token);
      startTransition(() => formAction(formData));
    };
    const rc = window.grecaptcha?.enterprise;
    if (!SITE_KEY || !rc) {
      submit("");
      return;
    }
    rc.ready(() => {
      rc.execute(SITE_KEY, { action: "submit" }).then(submit, () => submit(""));
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
