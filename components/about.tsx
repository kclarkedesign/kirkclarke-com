import { dayToDay } from "@/content/day-to-day";
import { testimonials } from "@/content/testimonials";

export default function About() {
  return (
    <section id="about" className="border-t border-(--hairline) px-5 py-16 md:px-16 md:py-24">
      <h2 className="m-0 mb-8 font-display text-2xl font-semibold md:mb-10 md:text-3xl">About</h2>

      <div className="mb-8 grid grid-cols-1 gap-6 md:mb-10 md:grid-cols-3 md:gap-10">
        <AboutBeat title="Where it started">
          2007. Freelance web and design work for whoever would hire him — brand
          systems, WordPress sites, whatever a small business needed. Some of that
          teaching turned into an actual{" "}
          <a href="/courses/beginner/html/getting-started.html" className="text-(--signature)">
            beginner HTML course
          </a>{" "}
          he still keeps running.
        </AboutBeat>
        <AboutBeat title="Learning by doing">
          Eight years at 92nd Street Y, watching the job get bigger than
          &ldquo;designer&rdquo; — a CMS migration, a Salesforce Marketing Cloud
          rollout, and in 2020, rebuilding how an entire organization delivered
          its programming online in a matter of weeks.
        </AboutBeat>
        <AboutBeat title="Where he is now">
          Senior Director of Technology at The Writing Revolution, owning the
          integration layer across Salesforce, QuickBooks, and half a dozen
          systems that disagree about the same data. His boss and colleagues have
          called him a natural teacher, more than once. Outside of that: Koto,
          Kibi, and a book designed and edited for his mother.
        </AboutBeat>
      </div>

      <p className="mb-10 text-xs leading-relaxed text-(--text-label) md:mb-12 md:text-[13px]">
        Off duty: dine-in movies at the Alamo Drafthouse (Resident Evil most
        recently), first- and third-person shooters — Destiny 2, Marvel Rivals,
        Arc Raiders.
      </p>

      <div className="mb-10 flex max-w-[780px] flex-col md:mb-12">
        {dayToDay.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-1 border-b border-(--hairline) py-3 md:grid-cols-[220px_1fr] md:gap-6 md:py-3.5"
          >
            <span className="text-[13px] font-semibold text-(--text) md:text-sm">{row.label}</span>
            <span className="text-[13px] leading-relaxed text-(--text-secondary) md:text-sm">{row.desc}</span>
          </div>
        ))}
      </div>

      <div className="flex max-w-[780px] flex-col gap-3 md:gap-4">
        <h3 className="m-0 font-mono text-[11px] uppercase tracking-wide text-(--text-label) md:text-xs">
          Colleague feedback
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          {testimonials.map((quote) => (
            <div
              key={quote}
              className="flex flex-col gap-2.5 rounded-xl border border-(--hairline) bg-(--raised) p-[18px] md:gap-3 md:p-6"
            >
              <p className="m-0 text-[13px] leading-relaxed text-(--text) md:text-[15px]">&ldquo;{quote}&rdquo;</p>
              <span className="font-mono text-[10px] text-(--text-label) md:text-[11px]">— Anonymous</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBeat({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 md:gap-2.5">
      <h3 className="m-0 font-mono text-[11px] uppercase tracking-wide text-(--text-label) md:text-xs">{title}</h3>
      <p className="m-0 text-[13px] leading-relaxed text-(--text-secondary) md:text-sm">{children}</p>
    </div>
  );
}
