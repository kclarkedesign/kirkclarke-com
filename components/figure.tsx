import Image from "next/image";

// A captioned figure in case-study markdown: ![alt](/images/work/<slug>/x.webp "Caption").
// All figures are 16:10 (the Koto renders, the diagrams), so the frame reserves
// its space up front and the page never shifts as images load.
export default function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-10 md:my-12">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-(--hairline) bg-(--raised)">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 900px, 92vw" className="object-cover" />
      </div>
      {caption && <figcaption className="mt-3 max-w-175 text-[13px] leading-relaxed text-(--text-label)">{caption}</figcaption>}
    </figure>
  );
}
