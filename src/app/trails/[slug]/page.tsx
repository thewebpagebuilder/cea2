import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import { ConditionBadge } from "@/components/cards";
import { getApprovedReports, getTrail, getTrails } from "@/lib/data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const trail = await getTrail(slug);
  if (!trail) return { title: "Trail not found" };
  return { title: trail.name, description: trail.summary };
}

export async function generateStaticParams() {
  const trails = await getTrails();
  return trails.map((t) => ({ slug: t.slug }));
}

export default async function TrailDetailPage({ params }: Params) {
  const { slug } = await params;
  const trail = await getTrail(slug);
  if (!trail) notFound();

  const [allTrails, reports] = await Promise.all([getTrails(), getApprovedReports()]);
  const trailReports = reports.filter((r) => r.trailSlug === trail.slug);
  const related = allTrails
    .filter((t) => t.area === trail.area && t.slug !== trail.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${trail.area} · ${trail.difficulty}`}
        title={trail.name}
        lede={trail.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Trails", href: "/trails" },
          { label: trail.name, href: `/trails/${trail.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <ConditionBadge condition={trail.condition} />
          <Link href="/trails/conditions#report" className="btn btn-saddle">
            Report a condition
          </Link>
        </div>
      </PageHero>

      <section className="container-cea grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <PhotoFrame
              brief={trail.photoAlt}
              aspect="aspect-[16/9]"
              className="mb-8"
            />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-serif text-2xl text-forest-800">What the ride is like</h2>
            {trail.description.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)} className="mt-4 text-charcoal-700">
                {para}
              </p>
            ))}
          </Reveal>

          <Reveal delay={90}>
            <h2 className="mt-10 font-serif text-2xl text-forest-800">
              Rider reports for this trail
            </h2>
            {trailReports.length ? (
              <ul className="mt-4 space-y-4">
                {trailReports.map((report) => (
                  <li key={report.id} className="card p-5">
                    <p className="text-xs tracking-wide text-charcoal-500 uppercase">
                      {report.reporterName} · ridden {report.riddenOn ?? "recently"}
                    </p>
                    <p className="mt-2 text-sm text-charcoal-700">{report.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-charcoal-600">
                No reports filed recently. If you ride it, be the first to tell
                everyone else what you found.
              </p>
            )}
            <Link href="/trails/conditions#report" className="btn btn-secondary mt-4">
              File a report
            </Link>
          </Reveal>
        </div>

        <aside className="space-y-6">
          <Reveal>
            <div className="card p-6">
              <h2 className="font-serif text-xl text-forest-800">Trail facts</h2>
              <dl className="mt-4 divide-y divide-saddle-100 text-sm">
                {[
                  ["Area", trail.area],
                  ["Distance", trail.lengthMiles],
                  ["Difficulty", trail.difficulty],
                  ["Surface", trail.surface],
                  ["Elevation gain", `${trail.elevationFt} ft`],
                  ["Access point", trail.accessPoint],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="font-semibold text-forest-800">{label}</dt>
                    <dd className="text-right text-charcoal-700">{value}</dd>
                  </div>
                ))}
              </dl>
              {trail.conditionNote ? (
                <p className="mt-4 border-l-4 border-brass-500 bg-[#fbf6e6] p-3 text-sm text-[#6f5420]">
                  <span className="font-semibold">Current note: </span>
                  {trail.conditionNote}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="card p-6">
              <h2 className="font-serif text-xl text-forest-800">At the staging area</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {trail.facilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2 text-charcoal-700">
                    <span aria-hidden="true" className="mt-1 text-forest-600">
                      ▸
                    </span>
                    {facility}
                  </li>
                ))}
                {!trail.trailerParking ? (
                  <li className="flex items-start gap-2 text-charcoal-700">
                    <span aria-hidden="true" className="mt-1 text-saddle-600">
                      ▸
                    </span>
                    No dedicated trailer parking — single trucks fit best
                  </li>
                ) : null}
              </ul>
            </div>
          </Reveal>

          {related.length ? (
            <Reveal delay={120}>
              <div className="card bg-forest-50 p-6">
                <h2 className="font-serif text-xl text-forest-800">
                  Nearby in {trail.area}
                </h2>
                <ul className="mt-4 space-y-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/trails/${item.slug}`}
                        className="group flex items-center justify-between gap-3 border-b border-saddle-200 pb-2 text-sm"
                      >
                        <span className="font-semibold text-forest-800 group-hover:underline">
                          {item.name}
                        </span>
                        <span className="text-xs text-charcoal-500">
                          {item.lengthMiles}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}
        </aside>
      </section>
    </>
  );
}
