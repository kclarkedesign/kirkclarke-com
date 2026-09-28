export default function Contact() {
  return (
    <section className="flex flex-col items-center gap-6 border-t border-(--hairline) px-5 py-16 text-center md:px-16 md:py-24">
      <h2 className="m-0 font-display text-xl font-semibold md:text-2xl">
        Got a hard problem? I&rsquo;d like to hear about it.
      </h2>
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
        <a
          href="mailto:ignite@kirkclarke.com"
          className="rounded-full bg-(--action) px-5 py-3 text-sm font-semibold text-(--action-text) transition hover:brightness-110"
        >
          ignite@kirkclarke.com
        </a>
        <a
          href="https://www.linkedin.com/in/kclarke/"
          target="_blank"
          rel="noopener"
          className="text-sm text-(--text-secondary) hover:text-(--text)"
        >
          LinkedIn
        </a>
        {/* Résumé link: the prototype had this as a placeholder (href="#")
            — omitted here rather than shipped as a dead link. Add it back
            once a résumé PDF lands in public/. */}
      </div>
    </section>
  );
}
