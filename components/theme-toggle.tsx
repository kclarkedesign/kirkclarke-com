"use client";

import { useEffect, useState } from "react";

// Reflects whatever the blocking init script (app/layout.tsx) already
// applied — this never causes the flash Koto's toggle has, because it
// only ever *reads* document.documentElement on mount, never decides
// the initial theme itself.
export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    // Must run post-mount, not during a lazy useState initializer: the
    // server render (and the client's first hydration pass) don't know
    // what the blocking script decided, and reading `document` there
    // would either crash on the server or mismatch on hydration. This
    // one extra render is the cost of that safety.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      // private browsing / blocked storage — the toggle still works
      // for this page view, it just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="flex rounded-lg border border-(--hairline) p-1.5 text-(--text) transition-colors hover:border-(--action)"
    >
      {light ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

// Hand-drawn, matching the hamburger/close icons in nav.tsx (same
// stroke weight, same 20x20 viewBox) rather than emoji — emoji render
// inconsistently across platforms (Windows' moon in particular is a
// colorful glyph that clashes with an otherwise monochrome-plus-mint
// icon language) and can't take currentColor.
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 1.5V3.5M10 16.5V18.5M18.5 10H16.5M3.5 10H1.5M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17 10.79A7.5 7.5 0 1 1 9.21 3a6 6 0 0 0 7.79 7.79Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
