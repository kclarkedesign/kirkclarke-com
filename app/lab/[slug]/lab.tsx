"use client";

import { useState } from "react";
import type { MediaMotion, MediaTreatment, Project } from "@/content/projects";
import ProjectCard from "@/components/project-card";
import ProjectMedia from "@/components/project-media";

const TREATMENTS: MediaTreatment[] = ["frame", "bleed", "type"];
const MOTIONS: MediaMotion[] = ["none", "zoom", "tilt"];
const POSITIONS = ["top left", "top center", "center", "bottom left"];

export default function Lab({ project, images }: { project: Project; images: string[] }) {
  const [treatment, setTreatment] = useState<MediaTreatment>(project.media?.treatment ?? "frame");
  const [motion, setMotion] = useState<MediaMotion>(project.media?.motion ?? "zoom");
  const [img, setImg] = useState(images[0]);
  const [radius, setRadius] = useState(8);
  const [pad, setPad] = useState(16);
  const [tint, setTint] = useState(22);
  const [zoom, setZoom] = useState(1.04);
  const [shot, setShot] = useState(project.media?.shotRatio ?? 1.6);
  const [pos, setPos] = useState(POSITIONS[0]!);

  const vars = {
    "--media-radius": `${radius}px`,
    "--media-pad": `${pad}px`,
    "--media-tint": tint,
    "--media-zoom": zoom,
    "--media-pos": pos,
  } as React.CSSProperties;
  const common = { treatment, motion, imageSrc: img, shotRatio: shot };

  return (
    <div style={vars} className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-4 text-sm lg:sticky lg:top-24 lg:self-start">
        <Select label="Image" value={img ?? ""} options={images} onChange={setImg} />
        <Select label="Treatment" value={treatment} options={TREATMENTS} onChange={(v) => setTreatment(v as MediaTreatment)} />
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
      </aside>

      <div className="flex min-w-0 flex-col gap-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
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
