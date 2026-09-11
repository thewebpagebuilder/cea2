import Link from "next/link";

type Crumb = { label: string; href: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
};

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-forest-100/80">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-brass-500">
                /
              </span>
            ) : null}
            <Link
              href={crumb.href}
              aria-current={index === crumbs.length - 1 ? "page" : undefined}
              className="hover:text-cream-50 hover:underline"
            >
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="border-b border-forest-800 bg-forest-800 text-cream-100">
      <div className="container-cea py-14 md:py-20">
        {crumbs?.length ? <Breadcrumbs crumbs={crumbs} /> : null}
        <p className="text-xs font-bold tracking-[0.18em] text-brass-500 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-cream-50 md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-forest-100/90 md:text-lg">
          {lede}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
