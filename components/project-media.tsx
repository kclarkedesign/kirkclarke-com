"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import type { MediaMotion, MediaPalette, MediaTreatment, Project } from "@/content/projects";
import { scenes, type SceneData } from "@/content/scenes";
import Mark from "./mark";
import Scene from "./scene";

export type MediaVariant = "card" | "feature" | "cover";

const SIZES: Record<MediaVariant, string> = {
  card: "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw",
  feature: "(min-width: 1024px) 45vw, 92vw",
  cover: "(min-width: 1024px) 900px, 92vw",
};

// The look is driven by CSS variables (see .media in globals.css) so the dev-only
// lab (app/lab) can tune it live; chosen values get baked into projects.ts.
export default function ProjectMedia({
  project,
  variant,
  treatment,
  motion,
  imageSrc,
  shotRatio,
  scene,
  palette,
}: {
  project: Project;
  variant: MediaVariant;
  /** Overrides, used by the lab only. */
  treatment?: MediaTreatment;
  motion?: MediaMotion;
  imageSrc?: string;
  shotRatio?: number;
  scene?: SceneData;
  palette?: MediaPalette;
}) {
  const media = project.media;
  const image = variant === "cover" ? media?.cover : (media?.card ?? media?.cover);
  const src = imageSrc ?? image?.src;
  const sceneKey = variant === "cover" ? media?.scene : (media?.cardScene ?? media?.scene);
  const sceneData = scene ?? (sceneKey ? scenes[sceneKey] : undefined);
  // Cards may differ from the cover (media.cardTreatment); a lab override wins over both.
  const wanted = treatment ?? (variant === "cover" ? media?.treatment : (media?.cardTreatment ?? media?.treatment)) ?? "type";
  // Fall back gracefully when the chosen treatment has nothing to show.
  const kind: MediaTreatment = wanted === "scene" && sceneData ? "scene" : src && wanted !== "type" ? (wanted === "scene" ? "bleed" : wanted) : "type";
  const mode = motion ?? media?.motion ?? "none";
  const shot = shotRatio ?? media?.shotRatio;
  const colors = palette ?? media?.palette;
  const style = {
    ...(shot ? { "--media-shot-ar": shot } : {}),
    ...(colors ? { "--media-from": colors.from, "--media-to": colors.to, ...(colors.glow ? { "--media-glow": colors.glow } : {}) } : {}),
  } as React.CSSProperties;

  // Pointer tilt: two CSS variables, no re-render (the transform lives in CSS).
  const tilt = mode === "tilt" && kind !== "scene";
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--tx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    e.currentTarget.style.setProperty("--ty", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--tx", "0");
    e.currentTarget.style.setProperty("--ty", "0");
  };

  return (
    <div
      className="media"
      data-treatment={kind}
      data-motion={mode}
      data-variant={variant}
      style={Object.keys(style).length ? style : undefined}
      onPointerMove={tilt ? onMove : undefined}
      onPointerLeave={tilt ? onLeave : undefined}
    >
      {kind === "scene" && sceneData ? (
        // The case-study cover plays its intro; grid cards stay still apart from a hover drift.
        <Scene scene={sceneData} mode={variant === "cover" ? "intro" : "static"} />
      ) : kind === "type" ? (
        // No image yet: a quiet placeholder ground; the card body carries the title.
        <div className="media-type" aria-hidden="true">
          <Mark className="media-mark" />
        </div>
      ) : (
        <div className="media-inner">
          <Image
            src={src!}
            alt={image?.alt ?? ""}
            fill
            sizes={SIZES[variant]}
            // Cover is above the fold on a case study; everything else lazy-loads.
            priority={variant === "cover"}
            className="media-img"
          />
        </div>
      )}
    </div>
  );
}
