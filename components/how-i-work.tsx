import { principles } from "@/content/how-i-work";

export default function HowIWork() {
  return (
    <section id="how-i-work" className="border-t border-(--hairline) px-5 py-16 md:px-16 md:py-24">
      <h2 className="m-0 mb-8 font-display text-2xl font-semibold md:mb-10 md:text-3xl">How I work</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        {principles.map((p) => (
          <div key={p.title} className="flex flex-col gap-2 md:gap-2.5">
            <h3 className="m-0 font-display text-base font-semibold text-(--signature) md:text-lg">{p.title}</h3>
            <p className="m-0 text-[13px] leading-relaxed text-(--text-secondary) md:text-sm">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
