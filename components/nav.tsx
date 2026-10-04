"use client";

import Link from "next/link";
import Mark from "./mark";
import NavDrawer from "./nav-drawer";
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
  const { openChat, openContact } = useSiteDialogs();

  return (
    <nav className="sticky top-0 z-10 border-b border-(--hairline) bg-(--ground)/80 px-5 py-3 backdrop-blur-xl md:px-16 md:py-5">
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
          <NavDrawer links={LINKS} />
        </div>
      </div>
    </nav>
  );
}
