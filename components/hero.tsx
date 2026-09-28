"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["designer", "engineer", "leader", "problem eliminator"];
const COUNT_UP_MS = 1400;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero({ onOpenChat }: { onOpenChat: () => void }) {
  const [typedText, setTypedText] = useState(WORDS[0] ?? "");
  const [progress, setProgress] = useState(1); // eased 0->1; starts at 1 (final values) for reduced motion / no-JS-flash
  const [glow, setGlow] = useState({ x: 0, y: 0, active: false });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // static word, final numbers already showing

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = WORDS[wordIndex] ?? WORDS[0]!;
      if (!deleting) {
        charIndex++;
        if (charIndex > word.length) {
          deleting = true;
          setTypedText(word);
          timer = setTimeout(tick, 1500);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % WORDS.length;
          charIndex = 0;
        }
      }
      setTypedText(word.slice(0, charIndex));
      timer = setTimeout(tick, deleting ? 35 : 65);
    };
    timer = setTimeout(tick, 400);

    // The count-up needs to visibly start from 0 — that transition *is*
    // the animation, not an avoidable extra render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    let raf: number;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / COUNT_UP_MS);
      setProgress(1 - Math.pow(1 - p, 3)); // eased cubic ease-out
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  const commits = Math.round(615 * progress);
  const findings = Math.round(5 - 5 * progress);
  const contrast = (2.19 + (9.03 - 2.19) * progress).toFixed(2);

  return (
    <>
      <section
        ref={heroRef}
        id="hero-section"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
        }}
        onPointerLeave={() => setGlow((g) => ({ ...g, active: false }))}
        className="relative flex flex-col items-center overflow-hidden px-5 py-14 text-center md:px-16 md:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-[-24%] h-[340px] w-[340px] rounded-full opacity-[0.36] blur-[42px] motion-safe:animate-[hero-drift-1_16s_ease-in-out_infinite] md:-top-[100px] md:left-[8%] md:h-[640px] md:w-[640px] md:opacity-[0.34] md:blur-[65px] md:[animation-duration:20s]"
          style={{ background: "radial-gradient(circle, var(--action) 0%, var(--deep-1) 45%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-[6%] hidden h-[520px] w-[520px] rounded-full opacity-[0.28] blur-[75px] motion-safe:md:animate-[hero-drift-2_26s_ease-in-out_infinite] md:block"
          style={{ background: "radial-gradient(circle, var(--signature) 0%, var(--deep-2) 50%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute hidden h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--action) transition-opacity duration-300 mix-blend-screen md:block"
          style={{
            left: glow.x,
            top: glow.y,
            opacity: glow.active ? 1 : 0,
            background: "radial-gradient(circle, rgba(75,197,125,0.22), transparent 70%)",
            boxShadow: "0 0 50px 8px rgba(75,197,125,0.25)",
          }}
        />

        <h1 className="relative m-0 mb-4 max-w-[900px] font-display text-[34px] font-bold leading-[1.12] tracking-tight md:mb-6 md:text-[64px] md:leading-[1.08]">
          I find the real problem. Then I remove it.
        </h1>
        <p className="relative m-0 mb-7 min-h-[68px] max-w-[560px] text-[15px] leading-[1.5] text-(--text-secondary) md:mb-10 md:min-h-[58px] md:text-[19px]">
          Twenty years as a{" "}
          <span className="border-r-2 border-(--signature) pr-px font-semibold text-(--signature) motion-safe:animate-[blink-cursor_0.9s_step-end_infinite]">
            {typedText}
          </span>{" "}
          — used wherever the problem actually is.
        </p>
        <div className="relative flex items-center gap-5 md:gap-7">
          <button
            type="button"
            onClick={onOpenChat}
            className="rounded-full bg-(--action) px-6 py-3 text-sm font-semibold text-(--action-text) transition hover:brightness-110 md:px-7 md:text-[15px]"
          >
            Ask about my work
          </button>
          <a href="#work" className="text-sm font-medium text-(--text-secondary) md:text-[15px]">
            See the work ↓
          </a>
        </div>
      </section>

      <section
        aria-label="Proof"
        className="grid grid-cols-2 gap-6 border-y border-(--hairline) px-5 py-8 md:grid-cols-4 md:gap-8 md:px-16 md:py-12"
      >
        <Stat value={String(commits)} label="commits as primary developer of a nonprofit's platform" />
        <Stat value={String(findings)} label="security findings, after his own sweep closed 5" />
        <Stat value={`${contrast}:1`} label="contrast ratio, measured up from a failing 2.19:1" />
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-lg font-bold leading-tight md:text-xl">
            A human approves every AI schedule
          </span>
          <span className="text-[13px] leading-tight text-(--text-secondary) md:text-sm">
            not a policy — how the system is built
          </span>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-2xl font-bold tabular-nums text-(--signature) md:text-[32px]">
        {value}
      </span>
      <span className="text-[13px] leading-tight text-(--text-secondary) md:text-sm">{label}</span>
    </div>
  );
}
