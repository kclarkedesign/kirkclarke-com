import { scenes } from "@/content/scenes";
import Scene from "./scene";

// A composed scene inside case-study markdown: ![alt](scene:koto-builder "Caption").
// The scene's own description is used for accessibility, the markdown alt is ignored.
export default function SceneFigure({ id, caption }: { id: string; caption?: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  return (
    <figure className="my-10 md:my-12">
      <div className="media" data-treatment="scene" data-variant="figure" style={{ "--media-ar": scene.ratio } as React.CSSProperties}>
        <Scene scene={scene} mode="scroll" />
      </div>
      {caption && <figcaption className="mt-3 max-w-175 text-[13px] leading-relaxed text-(--text-label)">{caption}</figcaption>}
    </figure>
  );
}
