import { principles } from "@/content/how-i-work";
import Section from "./section";

export default function HowIWork() {
  return (
    <Section id="how-i-work" title="How I work">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        {principles.map((p) => (
          <div key={p.title} className="flex flex-col gap-2 md:gap-2.5">
            <h3 className="m-0 font-display text-base font-semibold text-(--signature) md:text-lg">{p.title}</h3>
            <p className="m-0 text-[13px] leading-relaxed text-(--text-secondary) md:text-sm">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
