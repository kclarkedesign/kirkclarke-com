"use client";

import { useState } from "react";
import Link from "next/link";
import Mark from "./mark";
import ThemeToggle from "./theme-toggle";
import { useSiteDialogs } from "./site-dialogs-context";

// Absolute paths (not #work) so the nav works identically whether it's
// rendered on the home page or a case-study page.
const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#how-i-work", label: "How I work" },
  { href: "/#about", label: "About" },
];

const askButtonClasses = {
  desktop:
    "rounded-full bg-(--action) px-4.5 py-2.5 text-sm font-semibold text-(--action-text) transition hover:brightness-110",
  mobile:
    "rounded-full bg-(--action) px-3.5 py-1.5 text-[13px] font-semibold text-(--action-text) transition hover:brightness-110",
};

// One responsive nav, not the two separate desktop/mobile artboards the
// Claude Design prototype needed for side-by-side preview (plan §11a) —
// links show inline at md+, collapse into a hamburger below that.
//
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openChat, openContact } = useSiteDialogs();

  return (
    <nav className="sticky top-0 z-10 border-b border-(--hairline) bg-(--ground)/80 px-5 py-4 backdrop-blur-xl md:px-16 md:py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <Mark className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-display text-[15px] font-bold tracking-tight md:text-[17px]">
            Kirk Clarke
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-(--text-secondary) hover:text-(--text)">
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openContact}
            className="text-sm font-medium text-(--text-secondary) hover:text-(--text)"
          >
            Contact
          </button>
          <button type="button" onClick={openChat} className={askButtonClasses.desktop}>
            Ask about my work
          </button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={openChat} className={askButtonClasses.mobile}>
            Ask
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex rounded-lg border border-(--hairline) p-1.5 text-(--text) transition-colors hover:border-(--action)"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 pt-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-(--hairline) py-2.5 text-[15px] font-medium text-(--text) last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openContact();
            }}
            className="py-2.5 text-left text-[15px] font-medium text-(--text)"
          >
            Contact
          </button>
        </div>
      )}
    </nav>
  );
}
