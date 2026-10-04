import { scenes, sequences } from "@/content/scenes";
import Scene from "./scene";

// A pinned walkthrough inside case-study markdown: ![alt](scene:koto-flow). Each step is an
// ordinary scene figure with a caption; where the page can pin (see .seq in globals.css) the
// steps share one sticky frame and swap as you scroll, otherwise they simply stack.
// Every step's description stays in the DOM either way, so nothing is animation-only.
export default function SceneSequence({ id }: { id: string }) {
  const seq = sequences[id];
  if (!seq) return null;
  const last = seq.steps.length - 1;

  return (
    <div className="seq" role="group" aria-label={seq.alt} style={{ "--n": seq.steps.length, "--media-ar": seq.ratio } as React.CSSProperties}>
      <div className="seq-pin">
        <div className="seq-frame" aria-hidden />
        {seq.steps.map((step, i) => {
          const scene = scenes[step.scene];
          if (!scene) return null;
          return (
            <figure key={step.scene} className="seq-step" data-pos={i === 0 ? "first" : i === last ? "last" : "mid"} style={{ "--si": i } as React.CSSProperties}>
              <div className="media" data-treatment="scene" data-variant="figure" style={{ "--media-ar": scene.ratio } as React.CSSProperties}>
                <Scene scene={scene} mode="scroll" />
              </div>
              <figcaption>
                <strong>{step.title}</strong>
                {step.caption}
              </figcaption>
            </figure>
          );
        })}
        <div className="seq-rail" aria-hidden>
          {seq.steps.map((step, i) => (
            <span key={step.scene} style={{ "--si": i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  );
}
