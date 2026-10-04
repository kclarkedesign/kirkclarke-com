"use client";

import { useState } from "react";
import type { MediaMotion, MediaTreatment, Project } from "@/content/projects";
import { scenes, type SceneLayer } from "@/content/scenes";
import ProjectCard from "@/components/project-card";
import ProjectMedia from "@/components/project-media";

const TREATMENTS: MediaTreatment[] = ["scene", "bleed", "frame", "type"];
const MOTIONS: MediaMotion[] = ["none", "zoom", "tilt"];
const POSITIONS = ["top left", "top center", "center", "bottom left"];
const SCENE_IDS = Object.keys(scenes);

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

  const vars = {
    "--media-radius": `${radius}px`,
    "--media-pad": `${pad}px`,
    "--media-tint": tint,
    "--media-zoom": zoom,
    "--media-pos": pos,
  } as React.CSSProperties;
  const common = { treatment, motion, imageSrc: img, shotRatio: shot, scene: sceneData };
  const isScene = treatment === "scene";

  const sceneSnippet = layers.map((l) => `{ id: "${l.id}", x: ${l.x}, y: ${l.y}, w: ${l.w}, depth: ${l.depth ?? 0} }`).join(",\n");

  return (
    <div style={vars} className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="flex max-h-[calc(100vh-7rem)] flex-col gap-4 overflow-y-auto pr-1 text-sm lg:sticky lg:top-24 lg:self-start">
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
            <pre className="m-0 overflow-auto rounded-lg border border-(--hairline) bg-(--raised) p-3 font-mono text-[11px] leading-relaxed">
              {`ratio: ${ratio},\n${sceneSnippet}`}
            </pre>
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
            <pre className="m-0 overflow-auto rounded-lg border border-(--hairline) bg-(--raised) p-3 font-mono text-[11px] leading-relaxed">
              {`media: {\n  treatment: "${treatment}",\n  motion: "${motion}",\n  shotRatio: ${shot},\n  // radius ${radius} · pad ${pad} · tint ${tint} · zoom ${zoom} · anchor ${pos}\n},`}
            </pre>
          </>
        )}
      </aside>

      <div className="flex min-w-0 flex-col gap-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[87.5rem]:grid-cols-4 md:gap-5">
          <ProjectCard project={project} feature {...common} />
          <ProjectCard project={project} {...common} />
          <ProjectCard project={project} {...common} />
        </div>
        <div className="max-w-225">
          <ProjectMedia project={project} variant="cover" {...common} />
        </div>
      </div>
    </div>
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
