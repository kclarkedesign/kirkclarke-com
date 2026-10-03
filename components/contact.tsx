"use client";

import ProfileLinks from "./profiles";
import { useSiteDialogs } from "./site-dialogs-context";

export default function Contact() {
  const { openContact } = useSiteDialogs();

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
          onClick={openContact}
          className="rounded-full bg-(--action) px-5 py-3 text-sm font-semibold text-(--action-text) transition hover:brightness-110"
        >
          Send me a message
        </button>
        <ProfileLinks />
        {/* Résumé link: omitted rather than shipped dead; add back once a
            résumé PDF lands in public/. */}
      </div>
    </section>
  );
}
