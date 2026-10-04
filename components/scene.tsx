import Image from "next/image";
import type { SceneData } from "@/content/scenes";

// How a scene moves:
//   intro  — zoom-ins pop in once on load (hero, already on screen at the top)
//   scroll — zoom-ins pop in as the scene scrolls into view
//   static — nothing animates; layers just drift a little on card hover
// In every mode the layers also drift at different depths as you scroll (CSS scroll
// timelines; browsers without them, and reduced-motion, show the finished composition).
export type SceneMode = "intro" | "scroll" | "static";

// The stage is cover-fit to its box (see .scene-stage), so a scene fills a card's image
// area the way object-fit: cover would, at any aspect ratio.
export default function Scene({ scene, mode }: { scene: SceneData; mode: SceneMode }) {
  const index = new Map(scene.layers.map((l, i) => [l.id, i]));

  return (
    <div className="scene" data-mode={mode} role="img" aria-label={scene.alt} style={{ "--scene-ratio": scene.ratio } as React.CSSProperties}>
      <div className="scene-stage">
        {scene.layers.map((layer, i) => (
          <div
            key={layer.id}
            className="layer"
            style={
              {
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.w}%`,
                zIndex: layer.z ?? i,
                "--depth": layer.depth ?? 0,
                "--i": i,
              } as React.CSSProperties
            }
          >
            <div className="layer-in" data-zoom={layer.zoom ? "" : undefined} data-base={layer.zoom ? undefined : ""}>
              <div className="layer-img" data-dim={layer.dim ? "" : undefined} style={{ aspectRatio: layer.ratio }}>
                <Image
                  src={layer.src}
                  alt=""
                  fill
                  sizes={layer.zoom ? "(min-width: 1024px) 560px, 80vw" : "(min-width: 1024px) 720px, 90vw"}
                  priority={mode === "intro" && !layer.zoom}
                />
                {layer.marks?.map((m) => (
                  <span
                    key={m.for}
                    className="mark"
                    style={
                      {
                        left: `${m.x}%`,
                        top: `${m.y}%`,
                        width: `${m.w}%`,
                        height: `${m.h}%`,
                        "--i": index.get(m.for) ?? 0,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
