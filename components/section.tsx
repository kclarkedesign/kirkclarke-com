// Page section with the heading in a 240px left column from lg up (Kirk's "split"
// pick on the Taste-Layout board); stacked below that, where a side column would
// squeeze the content.
export default function Section({
  id,
  title,
  bordered = true,
  children,
}: {
  id: string;
  title: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={(bordered ? "border-t border-(--hairline) " : "") + "px-5 py-16 md:px-16 md:py-24"}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <h2 className="m-0 font-display text-2xl font-semibold lg:text-[38px] lg:leading-[1.1]">{title}</h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
