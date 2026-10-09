import Image from "next/image";
import type { SceneData, SceneLayer } from "@/content/scenes";

// How a scene moves:
//   intro  — zoom-ins pop in once on load (hero, already on screen at the top)
//   scroll — zoom-ins pop in as the scene scrolls into view
//   static — nothing animates; layers just drift a little on card hover
// (A scene inside a pinned sequence uses "scroll" too; the sequence's CSS takes over when
// the page can pin — see components/scene-sequence.tsx.)
// In every mode the layers also drift at different depths as you scroll (CSS scroll
// timelines; browsers without them, and reduced-motion, show the finished composition).
export type SceneMode = "intro" | "scroll" | "static";

// Where a zoom-in starts when it grows out of its outline: the centre offset (as % of the
// layer's own size, what `translate` percentages mean) and the scale of the marked area
// relative to the zoom-in. Measured in stage widths so the stage's ratio drops out.
function growFrom(scene: SceneData, zoom: SceneLayer): Record<string, string> {
  for (const base of scene.layers) {
    const mark = base.marks?.find((m) => m.for === zoom.id);
    if (!mark) continue;
    const bw = base.w / 100;
    const bh = bw / base.ratio;
    const zw = zoom.w / 100;
    const zh = zw / zoom.ratio;
    const markCx = base.x / 100 + ((mark.x + mark.w / 2) / 100) * bw;
    const markCy = base.y / 100 / scene.ratio + ((mark.y + mark.h / 2) / 100) * bh;
    const zoomCx = zoom.x / 100 + zw / 2;
    const zoomCy = zoom.y / 100 / scene.ratio + zh / 2;
    return {
      "--fx": `${(((markCx - zoomCx) / zw) * 100).toFixed(1)}%`,
      "--fy": `${(((markCy - zoomCy) / zh) * 100).toFixed(1)}%`,
      "--fs": ((mark.w / 100) * bw / zw).toFixed(3),
    };
  }
  return {};
}

// The stage is cover-fit to its box (see .scene-stage), so a scene fills a card's image
// area the way object-fit: cover would, at any aspect ratio.
export default function Scene({ scene, mode }: { scene: SceneData; mode: SceneMode }) {
  const index = new Map(scene.layers.map((l, i) => [l.id, i]));

  return (
    <div
      className="scene"
      data-mode={mode}
      data-loop={scene.loop ? "" : undefined}
      data-ground={scene.ground ? "" : undefined}
      role="img"
      aria-label={scene.alt}
      style={
        {
          "--scene-ratio": scene.ratio,
          ...(scene.loop ? { "--loop": `${scene.loop}s` } : {}),
          ...(scene.ground ? { "--g-from": scene.ground.from, "--g-to": scene.ground.to, "--g-glow": scene.ground.glow ?? scene.ground.to } : {}),
        } as React.CSSProperties
      }
    >
      <div className="scene-stage">
        {scene.layers.map((layer, i) => (
          <div
            key={layer.id}
            className="layer"
            data-slot={layer.slot}
            style={
              {
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.w}%`,
                zIndex: layer.z ?? i,
                "--depth": layer.depth ?? 0,
                "--i": i,
                ...(layer.slot !== undefined ? { "--slot": layer.slot } : {}),
                ...(layer.zoom ? growFrom(scene, layer) : {}),
              } as React.CSSProperties
            }
          >
            <div className="layer-in" data-zoom={layer.zoom ? "" : undefined} data-base={layer.zoom ? undefined : ""}>
              <div
                className="layer-img"
                data-dim={layer.dim ? "" : undefined}
                data-push={layer.move?.push ? "" : undefined}
                data-rack={layer.dof && layer.move?.rack ? "" : undefined}
                style={
                  {
                    aspectRatio: layer.ratio,
                    ...(layer.radius !== undefined ? { "--r": `${layer.radius}cqw` } : {}),
                    ...(layer.dof ? { "--dof": `${layer.dof.blur}cqw`, "--dx": `${layer.dof.x}%`, "--dy": `${layer.dof.y}%` } : {}),
                    ...(layer.move
                      ? {
                          "--push": 1 + (layer.move.push ?? 0),
                          "--ox": `${layer.dof?.x ?? 50}%`,
                          "--oy": `${layer.dof?.y ?? 50}%`,
                          "--move-s": `${layer.move.seconds ?? 8}s`,
                        }
                      : {}),
                  } as React.CSSProperties
                }
              >
                <Image
                  src={layer.src}
                  alt=""
                  fill
                  sizes={layer.zoom ? "(min-width: 1024px) 560px, 80vw" : "(min-width: 1024px) 720px, 90vw"}
                  priority={mode === "intro" && !layer.zoom}
                />
                {layer.dof && (
                  // The same file again, blurred and masked: only the focus point stays sharp. One request, decorative.
                  <Image className="dof dof-a" src={layer.src} alt="" aria-hidden fill sizes="(min-width: 1024px) 720px, 90vw" />
                )}
                {layer.dof && layer.move?.rack && (
                  // A second blurred copy masked around the other focus point; the two crossfade to pull focus.
                  <Image
                    className="dof dof-b"
                    src={layer.src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 720px, 90vw"
                    style={{ "--dx": `${layer.move.rack.x}%`, "--dy": `${layer.move.rack.y}%` } as React.CSSProperties}
                  />
                )}
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
