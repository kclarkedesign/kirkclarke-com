"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROFILES } from "./profiles";
import { useSiteDialogs } from "./site-dialogs-context";

const DURATION = 360; // ms — keep in sync with .drawer in globals.css

// Mobile side navigation: a right-docked panel in a native <dialog> (focus trap,
// Escape, inert page behind). Values are the picks from the Taste-Nav-Drawer board.
//
// The dialog itself is a transparent full-viewport layer whose background is the
// scrim; the panel slides inside it. That lets the dialog's own close button sit at
// the same screen position as the page's menu button, so the three bars morph into
// an X in place instead of one button swapping for another.
export default function NavDrawer({ links }: { links: { href: string; label: string }[] }) {
  const { openChat, openContact } = useSiteDialogs();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false); // dialog is open (page trigger hides)
  const [shown, setShown] = useState(false); // drives every transition

  function show() {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog || !trigger) return;
    // Park the dialog's close button exactly over the page's menu button.
    const r = trigger.getBoundingClientRect();
    dialog.style.setProperty("--toggle-top", `${r.top}px`);
    dialog.style.setProperty("--toggle-right", `${window.innerWidth - r.right}px`);
    document.body.style.overflow = "hidden";
    dialog.showModal();
    setOpen(true);
    // Two frames so the closed styles paint first and the open ones transition.
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }

  const hide = useCallback((then?: () => void) => {
    setShown(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        dialogRef.current?.close();
        then?.();
      },
      reduced ? 0 : DURATION,
    );
  }, []);

  // Leaving the mobile layout while open would strand an inert page.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches && dialogRef.current?.open) hide();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hide]);

  const onWork = pathname.startsWith("/work");
  const itemClass = "drawer-item font-display text-[30px] font-medium leading-[1.1]";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={show}
        // Stays focusable (opacity, not visibility) so focus can return to it on close.
        className={"menu-toggle -mr-2.5 " + (open ? "opacity-0" : "")}
      >
        <Bars />
      </button>

      <dialog
        ref={dialogRef}
        className="drawer"
        data-shown={shown}
        aria-label="Menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) hide();
        }}
        onCancel={(e) => {
          e.preventDefault(); // animate out instead of vanishing
          hide();
        }}
        onClose={() => {
          document.body.style.overflow = "";
          setOpen(false);
          setShown(false);
        }}
      >
        <div className="drawer-panel">
          <nav aria-label="Main" className="flex flex-col items-start gap-4.5">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => hide()}
                style={{ "--i": i } as React.CSSProperties}
                className={itemClass + " " + (i === 0 && onWork ? "text-(--color-primary-300)" : "text-[#fafafa]")}
              >
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => hide(openContact)}
              style={{ "--i": links.length } as React.CSSProperties}
              className={itemClass + " text-left text-[#fafafa]"}
            >
              Contact
            </button>
          </nav>

          <ul className="m-0 mt-9 flex list-none flex-col items-start gap-4 p-0">
            {PROFILES.map((p, i) => (
              <li key={p.label} className="drawer-item" style={{ "--i": links.length + 1 + i } as React.CSSProperties}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 text-[17px] font-semibold text-(--color-primary-300) hover:text-(--color-primary-200)"
                >
                  {p.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => hide(openChat)}
            style={{ "--i": links.length + 1 + PROFILES.length } as React.CSSProperties}
            className="drawer-item mt-auto w-66.5 max-w-full rounded-full bg-(--action) px-6.5 py-3.5 text-[15px] font-semibold text-(--action-text) hover:brightness-110"
          >
            Ask about my work
          </button>
        </div>

        <button
          type="button"
          aria-label="Close menu"
          data-x={shown}
          onClick={() => hide()}
          className="drawer-toggle"
        >
          <Bars />
        </button>
      </dialog>
    </>
  );
}

function Bars() {
  return (
    <span className="bars" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}
