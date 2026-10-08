"use client";

import { useState } from "react";
import type { MediaMotion, MediaTreatment, Project } from "@/content/projects";
import { scenes, sequences, type SceneLayer, type SequenceStep } from "@/content/scenes";
import ProjectCard from "@/components/project-card";
import ProjectMedia from "@/components/project-media";
import SceneSequence from "@/components/scene-sequence";

const TREATMENTS: MediaTreatment[] = ["scene", "bleed", "frame", "type"];
const MOTIONS: MediaMotion[] = ["none", "zoom", "tilt"];
const POSITIONS = ["top left", "top center", "center", "bottom left"];
const SCENE_IDS = Object.keys(scenes);
const SEQUENCE_IDS = Object.keys(sequences);
const VIEWS = ["media (cards and cover)", "pinned sequence"];
// Scroll per step as the page ships it (--len in app/globals.css, in svh).
const DEFAULT_LEN = 75;

export default function Lab({ project, images }: { project: Project; images: string[] }) {
  const [treatment, setTreatment] = useState<MediaTreatment>(project.media?.treatment ?? "bleed");
  const [motion, setMotion] = useState<MediaMotion>(project.media?.motion ?? "zoom");
  const [img, setImg] = useState(images[0]);
  const [radius, setRadius] = useState(8);
  const [pad, setPad] = useState(16);
  const [tint, setTint] = useState(22);
  const [zoom, setZoom] = useState(1.04);
  const [shot, setShot] = useState(project.media?.shotRatio ?? 1.6);
  const [pos, setPos] = useState(POSITIONS[0]!);

  // Scene editor: layers are copied into state so sliders can move them.
  const initialScene = project.media?.scene && scenes[project.media.scene] ? project.media.scene : SCENE_IDS[0]!;
  const [sceneId, setSceneId] = useState(initialScene);
  const [layers, setLayers] = useState<SceneLayer[]>(scenes[initialScene]!.layers);
  const [ratio, setRatio] = useState(scenes[initialScene]!.ratio);
  const sceneData = { ...scenes[sceneId]!, ratio, layers };

  function pickScene(id: string) {
    setSceneId(id);
    setLayers(scenes[id]!.layers);
    setRatio(scenes[id]!.ratio);
  }
  function patch(id: string, change: Partial<SceneLayer>) {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...change } : l)));
  }

  // Sequence editor: steps are copied into state, like layers above. Edits to the scene picked
  // above show inside the sequence too (overrides), so a layout tweak can be judged in the flow.
  const [view, setView] = useState(VIEWS[0]!);
  const [seqId, setSeqId] = useState(SEQUENCE_IDS[0]!);
  const [steps, setSteps] = useState<SequenceStep[]>(sequences[SEQUENCE_IDS[0]!]!.steps);
  const [len, setLen] = useState(DEFAULT_LEN);
  const seqData = { ...sequences[seqId]!, steps };
  const isSequence = view === VIEWS[1];

  function pickSequence(id: string) {
    setSeqId(id);
    setSteps(sequences[id]!.steps);
  }
  function patchStep(i: number, change: Partial<SequenceStep>) {
    setSteps((ss) => ss.map((s, j) => (j === i ? { ...s, ...change } : s)));
  }
  function moveStep(i: number, by: number) {
    setSteps((ss) => {
      const to = i + by;
      if (to < 0 || to >= ss.length) return ss;
      const next = [...ss];
      [next[i], next[to]] = [next[to]!, next[i]!];
      return next;
    });
  }

  const vars = {
    "--media-radius": `${radius}px`,
    "--media-pad": `${pad}px`,
    "--media-tint": tint,
    "--media-zoom": zoom,
    "--media-pos": pos,
  } as React.CSSProperties;
  const common = { treatment, motion, imageSrc: img, shotRatio: shot, scene: sceneData };
  const isScene = treatment === "scene";

  // Whole layer objects, so the snippet can replace a scene in content/scenes.ts as-is.
  const sceneSnippet = layers.map((l) => `    ${JSON.stringify(l).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/\{/g, "{ ").replace(/\}/g, " }")},`).join("\n");
  const mediaSnippet = `// content/projects.ts\nmedia: {\n  treatment: "scene",\n  scene: "${sceneId}",\n  motion: "${motion}",\n},`;
  const stepLines = steps
    .map((s) => `    { scene: ${JSON.stringify(s.scene)}, title: ${JSON.stringify(s.title)}, caption: ${JSON.stringify(s.caption)} },`)
    .join("\n");
  const sequenceSnippet = `// content/scenes.ts → sequences[${JSON.stringify(seqId)}]\nratio: ${seqData.ratio},\nalt: ${JSON.stringify(seqData.alt)},\nsteps: [\n${stepLines}\n],\n\n// Scroll per step: set --len: ${len}svh on .seq in app/globals.css (now ${DEFAULT_LEN}svh)\n// Markdown: ![${seqData.alt.slice(0, 40)}…](scene:${seqId})`;
  const snippet = isSequence
    ? sequenceSnippet
    : isScene
    ? `${mediaSnippet}\n\n// content/scenes.ts → "${sceneId}"\nratio: ${ratio},\nlayers: [\n${sceneSnippet}\n],`
    : `// content/projects.ts\nmedia: {\n  treatment: "${treatment}",\n  motion: "${motion}",\n  shotRatio: ${shot},\n  // radius ${radius} · pad ${pad} · tint ${tint} · zoom ${zoom} · anchor ${pos}\n},`;

  return (
    <div style={vars} className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="flex max-h-[calc(100vh-7rem)] flex-col gap-4 overflow-y-auto pr-1 text-sm lg:sticky lg:top-24 lg:self-start">
        <Select label="View" value={view} options={VIEWS} onChange={setView} />

        {isSequence ? (
          <>
            <Select label="Sequence" value={seqId} options={SEQUENCE_IDS} onChange={pickSequence} />
            <Range label="Scroll per step (svh)" value={len} min={30} max={160} step={5} onChange={setLen} />
            {steps.map((s, i) => (
              <fieldset key={i} className="m-0 flex flex-col gap-2 rounded-lg border border-(--hairline) p-3">
                <legend className="px-1 font-mono text-xs text-(--text-label)">step {i + 1}</legend>
                <Select label="Scene" value={s.scene} options={SCENE_IDS} onChange={(v) => patchStep(i, { scene: v })} />
                {scenes[s.scene]?.ratio !== seqData.ratio && (
                  <p className="m-0 text-xs text-(--text-label)">
                    Stage ratio {scenes[s.scene]?.ratio} differs from {seqData.ratio} (the sequence): the frame will show a gap. Steps should share one ratio.
                  </p>
                )}
                <label className="flex flex-col gap-1">
                  <span className="text-(--text-label)">Title</span>
                  <input value={s.title} onChange={(e) => patchStep(i, { title: e.target.value })} className="rounded-lg border border-(--hairline) bg-(--raised) px-3 py-2 text-(--text)" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-(--text-label)">Caption</span>
                  <textarea value={s.caption} rows={4} onChange={(e) => patchStep(i, { caption: e.target.value })} className="rounded-lg border border-(--hairline) bg-(--raised) px-3 py-2 text-(--text)" />
                </label>
                <div className="flex gap-2">
                  <StepButton onClick={() => moveStep(i, -1)} disabled={i === 0}>Up</StepButton>
                  <StepButton onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1}>Down</StepButton>
                  <StepButton onClick={() => setSteps((ss) => ss.filter((_, j) => j !== i))} disabled={steps.length <= 2}>Remove</StepButton>
                </div>
              </fieldset>
            ))}
            <StepButton onClick={() => setSteps((ss) => [...ss, { scene: ss.at(-1)?.scene ?? SCENE_IDS[0]!, title: "New step", caption: "" }])}>Add step</StepButton>
          </>
        ) : (
          <>
          <Select label="Treatment" value={treatment} options={TREATMENTS} onChange={(v) => setTreatment(v as MediaTreatment)} />

          {isScene ? (
            <>
              <Select label="Scene" value={sceneId} options={SCENE_IDS} onChange={pickScene} />
              <Range label="Stage ratio (w÷h)" value={ratio} min={1} max={2.4} step={0.05} onChange={setRatio} />
              {layers.map((l) => (
                <fieldset key={l.id} className="m-0 flex flex-col gap-2 rounded-lg border border-(--hairline) p-3">
                  <legend className="px-1 font-mono text-xs text-(--text-label)">
                    {l.id}
                    {l.zoom ? " · zoom-in" : ""}
                  </legend>
                  <Range label="x" value={l.x} min={-30} max={110} step={0.5} onChange={(v) => patch(l.id, { x: v })} />
                  <Range label="y" value={l.y} min={-30} max={110} step={0.5} onChange={(v) => patch(l.id, { y: v })} />
                  <Range label="width" value={l.w} min={5} max={120} step={0.5} onChange={(v) => patch(l.id, { w: v })} />
                  <Range label="depth" value={l.depth ?? 0} min={-2} max={2} step={0.1} onChange={(v) => patch(l.id, { depth: v })} />
                </fieldset>
              ))}
            </>
          ) : (
            <>
              <Select label="Image" value={img ?? ""} options={images} onChange={setImg} />
              <Select label="Motion" value={motion} options={MOTIONS} onChange={(v) => setMotion(v as MediaMotion)} />
              <Select label="Crop anchor (bleed)" value={pos} options={POSITIONS} onChange={setPos} />
              <Range label="Shot crop (w÷h, from top)" value={shot} min={1.6} max={2.6} step={0.05} onChange={setShot} />
              <Range label="Frame radius" value={radius} min={0} max={28} step={1} onChange={setRadius} />
              <Range label="Frame padding" value={pad} min={0} max={40} step={1} onChange={setPad} />
              <Range label="Backdrop tint" value={tint} min={0} max={50} step={1} onChange={setTint} />
              <Range label="Hover zoom" value={zoom} min={1} max={1.15} step={0.01} onChange={setZoom} />
            </>
          )}
          </>
        )}
      </aside>

      {isSequence ? (
        // The snippet comes first: the pinned preview below it is several screens tall. The
        // @container wrapper is what .seq measures its breakout width against (the case-study
        // page does the same on its <article>).
        <div className="flex min-w-0 flex-col gap-8">
          <Snippet text={snippet} />
          <div className="@container">
            <SceneSequence id={seqId} data={seqData} len={len} overrides={{ [sceneId]: sceneData }} />
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[87.5rem]:grid-cols-4 md:gap-5">
            <ProjectCard project={project} feature {...common} />
            <ProjectCard project={project} {...common} />
            <ProjectCard project={project} {...common} />
          </div>
          <div className="max-w-225">
            <ProjectMedia project={project} variant="cover" {...common} />
          </div>
          <Snippet text={snippet} />
        </div>
      )}
    </div>
  );
}

// Lives under the preview, not in the scrolling sidebar, so it is never squeezed to a sliver.
function Snippet({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="max-w-225 rounded-lg border border-(--hairline) bg-(--raised)">
      <div className="flex items-center justify-between border-b border-(--hairline) px-3 py-2 text-sm text-(--text-label)">
        Snippet
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-(--hairline) px-2.5 py-1 text-(--text) hover:bg-(--ground)"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 max-h-[28rem] overflow-auto p-3 font-mono text-xs leading-relaxed">{text}</pre>
    </div>
  );
}

function StepButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-(--hairline) px-2.5 py-1 text-(--text) hover:bg-(--raised) disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-(--text-label)">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-(--hairline) bg-(--raised) px-3 py-2 text-(--text)"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.split("/").pop()}
          </option>
        ))}
      </select>
    </label>
  );
}

function Range({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between text-(--text-label)">
        {label} <span className="font-mono">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
