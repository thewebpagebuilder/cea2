import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ConditionsBoard from "@/components/ConditionsBoard";
import { getApprovedReports, getTrails } from "@/lib/data";
import { site } from "@/lib/nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trail Conditions Board",
  description:
    "Rider-submitted trail conditions for Bidwell Park, moderated by CEA volunteers. Report deadfall, washouts, closures, and open gates.",
};

export default async function ConditionsPage() {
  const [trails, reports] = await Promise.all([getTrails(), getApprovedReports()]);

  return (
    <>
      <PageHero
        eyebrow="Trail conditions"
        title="What riders found out there"
        lede="Conditions in Bidwell Park change with every storm. This board is maintained by the people who ride these trails, and it is only as current as the last rider who filed a report."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Trails", href: "/trails" },
          { label: "Conditions", href: "/trails/conditions" },
        ]}
      >
        <p className="text-sm text-forest-100/85">
          Official park status:{" "}
          <a
            href={site.trailLineHref}
            className="font-semibold text-cream-50 underline decoration-brass-500 decoration-2 underline-offset-4"
          >
            {site.trailLine}
          </a>{" "}
          · Arena Way gate:{" "}
          <a
            href={site.gateLineHref}
            className="font-semibold text-cream-50 underline decoration-brass-500 decoration-2 underline-offset-4"
          >
            {site.gateLine}
          </a>
        </p>
      </PageHero>

      <section className="container-cea py-16">
        <ConditionsBoard trails={trails} reports={reports} />
      </section>

      <section className="border-t border-saddle-200 bg-cream-100 py-14">
        <div className="container-cea grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl text-forest-800">How moderation works</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Reports arrive in a queue visible to CEA admins. A volunteer checks
              the trail name, removes anything identifying or unsafe, and
              approves or rejects within a day or two during the riding season.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Closure authority</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              CEA does not close trails — the City of Chico does. A
              &ldquo;closed&rdquo; report means riders found it unrideable, not
              that it is legally closed. Check{" "}
              <a
                href={site.citySite}
                className="underline"
                rel="noreferrer noopener"
                target="_blank"
              >
                chico.ca.us
              </a>{" "}
              for official postings.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Need a hazard removed?</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              File the report, then tell the Trails Committee. Bring a saw and a
              pair of gloves if you can — most deadfall in this park gets
              cleared by a member who simply stopped and handled it.
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
