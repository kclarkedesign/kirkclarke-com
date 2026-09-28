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
      className="rounded-lg border border-(--hairline) p-1.5 text-sm leading-none transition-colors hover:border-(--action)"
    >
      {light ? "🌙" : "☀️"}
    </button>
  );
}
