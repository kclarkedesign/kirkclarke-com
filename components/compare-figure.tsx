"use client";

import Image from "next/image";
import { useState } from "react";
import { compares } from "@/content/compares";

// A before / after slider in case-study markdown: ![alt](compare:daniella-desktop "Caption").
// The divider is a native range input stretched over the frame, so keyboard, touch and screen
// readers work without extra code; vertical touch still scrolls the page (touch-action).
export default function CompareFigure({ id, caption }: { id: string; caption?: string }) {
  const data = compares[id];
  const [pos, setPos] = useState(50);
  if (!data) return null;

  return (
    <figure className="my-10 md:my-12" style={data.maxWidth ? { maxWidth: data.maxWidth } : undefined}>
      <div
        className="compare"
        role="group"
        aria-label={data.alt}
        style={{ "--ar": data.ratio, "--pos": `${pos}%` } as React.CSSProperties}
      >
        <div className="compare-layer">
          <Image src={data.after} alt="" fill sizes="(min-width: 1024px) 900px, 92vw" className="object-cover object-top" />
        </div>
        <div className="compare-layer compare-before">
          <Image src={data.before} alt="" fill sizes="(min-width: 1024px) 900px, 92vw" className="object-cover object-top" />
        </div>
        <span className="compare-label compare-label-before" data-hide={pos < 14 ? "" : undefined}>
          Before
        </span>
        <span className="compare-label compare-label-after" data-hide={pos > 86 ? "" : undefined}>
          After
        </span>
        <span className="compare-handle" aria-hidden="true" />
        <input
          className="compare-input"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after"
          aria-valuetext={`${pos}% before, ${100 - pos}% after`}
        />
      </div>
      {caption && <figcaption className="mt-3 max-w-175 text-[13px] leading-relaxed text-(--text-label)">{caption}</figcaption>}
    </figure>
  );
}
