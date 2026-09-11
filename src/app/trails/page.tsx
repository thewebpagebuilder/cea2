import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import TrailMap from "@/components/TrailMap";
import { ConditionBadge } from "@/components/cards";
import { getApprovedReports, getTrails } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interactive Trail Guide",
  description:
    "Every rideable route in Bidwell Park, mapped and maintained by CEA volunteers. Filter by condition, trailer parking, water, and difficulty.",
};

export default async function TrailsPage() {
  const [trails, reports] = await Promise.all([getTrails(), getApprovedReports()]);

  return (
    <>
      <PageHero
        eyebrow="Interactive trail guide"
        title="Bidwell Park, trail by trail"
        lede="Twelve rideable routes across Upper and Lower Park, drawn by the volunteers who ride them. Filter the map by condition, trailer parking, water, and difficulty — then read the detail page before you haul out."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Trails", href: "/trails" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/trails/conditions#report" className="btn btn-saddle">
            Report a condition
          </Link>
          <Link
            href="/trails/conditions"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Conditions board
          </Link>
        </div>
      </PageHero>

      <section className="container-cea py-16">
        <TrailMap trails={trails} reports={reports} />
      </section>

      <section className="border-t border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea">
          <div className="mb-8 border-t-2 border-forest-800 pt-5">
            <p className="eyebrow">Route detail</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Read the ground notes
            </h2>
            <p className="mt-3 max-w-2xl text-charcoal-600">
              Distances are as ridden, not as measured on a wheel. Conditions
              change with every storm — check the board before you go.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trails.map((trail, i) => (
              <Reveal key={trail.slug} delay={(i % 3) * 80}>
                <article className="card lift flex h-full flex-col overflow-hidden">
                  <PhotoFrame
                    brief={trail.photoAlt}
                    aspect="aspect-[16/9]"
                    className="border-0 border-b border-saddle-200"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow">{trail.area}</p>
                        <h3 className="mt-1 font-serif text-xl text-forest-800">
                          <Link href={`/trails/${trail.slug}`} className="hover:underline">
                            {trail.name}
                          </Link>
                        </h3>
                      </div>
                      <ConditionBadge condition={trail.condition} />
                    </div>
                    <p className="mt-3 flex-1 text-sm text-charcoal-600">
                      {trail.summary}
                    </p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-saddle-100 pt-4 text-xs text-charcoal-600">
                      <div>
                        <dt className="font-semibold">Distance</dt>
                        <dd>{trail.lengthMiles}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Difficulty</dt>
                        <dd>{trail.difficulty}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Climb</dt>
                        <dd>{trail.elevationFt} ft</dd>
                      </div>
                    </dl>
                    <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
                      {trail.facilities.slice(0, 3).map((facility) => (
                        <li
                          key={facility}
                          className="border border-saddle-200 bg-cream-50 px-2 py-1 text-charcoal-600"
                        >
                          {facility}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/trails/${trail.slug}`}
                      className="btn btn-secondary mt-5 w-full"
                    >
                      Trail detail
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cea py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Before you haul out</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Call the park trail line at{" "}
              <a href="tel:+15308967899" className="font-semibold underline">
                530-896-7899
              </a>{" "}
              for the official open/closed status, and the Arena Way gate line at{" "}
              <a href="tel:+15308967800" className="font-semibold underline">
                530-896-7800
              </a>{" "}
              if you need vehicle access (weekdays only).
            </p>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Trail etiquette</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Announce yourself early, pass left-hand to left-hand, and yield
              uphill traffic. Read the full passing protocol before your first
              group ride.
            </p>
            <Link href="/safety" className="btn btn-secondary mt-4">
              Safety & etiquette
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Help maintain them</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Every route on this map is brushed, drained, and signed by
              volunteers. Trail work days run spring and autumn.
            </p>
            <Link href="/get-involved" className="btn btn-secondary mt-4">
              Join a trail crew
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
