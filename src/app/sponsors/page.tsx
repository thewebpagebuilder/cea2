import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import { getApprovedListings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sponsors & Partners",
  description:
    "Businesses and organisations that underwrite CEA programming: the arena, clinics, the scholarship, and the annual pleasure ride.",
};

const levels = [
  {
    name: "Ride Sponsor",
    price: "$250",
    body: "Underwrites one community ride or clinic day. Name on the event sign-in board and in the event listing.",
  },
  {
    name: "Arena Sponsor",
    price: "$500",
    body: "Year-round signage at the CEA Arena plus everything in Ride Sponsor. This is what most local businesses choose.",
  },
  {
    name: "Scholarship Sponsor",
    price: "$1,000",
    body: "Funds part of the Mike Mathis Scholarship. Recognised at the award presentation and in every newsletter for the year.",
  },
];

export default async function SponsorsPage() {
  const listings = await getApprovedListings();
  const partners = listings
    .filter((l) => l.memberLevel === "Business Member" || l.memberLevel === "Community Partner")
    .slice(0, 9);

  return (
    <>
      <PageHero
        eyebrow="Sponsors"
        title="The businesses that underwrite this"
        lede="CEA has no paid staff and no government funding. The arena, the clinics, the scholarship, and the pleasure ride are paid for by dues and by local businesses who put their name behind them."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Sponsors", href: "/sponsors" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/membership#business" className="btn btn-saddle">
            Become a sponsor
          </Link>
          <Link
            href="/directory"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Browse the directory
          </Link>
        </div>
      </PageHero>

      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Sponsorship levels</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            What a sponsor gets
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal-600">
            Sponsorship is separate from business membership, and the two work
            well together. Ask us and we will put together something that fits
            your budget.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {levels.map((level, i) => (
            <Reveal key={level.name} delay={i * 80}>
              <div className="card h-full p-6">
                <h3 className="font-serif text-xl text-forest-800">{level.name}</h3>
                <p className="mt-1 font-serif text-3xl text-saddle-700">{level.price}</p>
                <p className="mt-3 text-sm text-charcoal-600">{level.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea">
          <div className="mb-8 border-t-2 border-forest-800 pt-5">
            <p className="eyebrow">Member businesses & partners</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Who supports CEA
            </h2>
            <p className="mt-3 max-w-2xl text-charcoal-600">
              These member businesses and community partners keep the
              association running. Give them your trade when you can.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <li key={partner.slug} className="card p-5">
                <p className="eyebrow">{partner.memberLevel}</p>
                <p className="mt-1 font-serif text-lg text-forest-800">
                  {partner.name}
                </p>
                <p className="text-xs text-charcoal-500">{partner.city}</p>
                <p className="mt-2 text-sm text-charcoal-600">
                  {partner.description.slice(0, 110)}…
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-cea grid gap-12 py-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-serif text-3xl text-forest-800">Become a sponsor</h2>
          <p className="mt-4 text-charcoal-700">
            Tell us what you can do and we will find the fit — an event, the
            arena, or the scholarship. CEA is a 501(c)(3) volunteer association;
            ask for documentation for your records.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Talk to us about sponsoring
            </Link>
            <Link href="/directory/submit" className="btn btn-secondary">
              Submit a listing
            </Link>
          </div>
        </div>
        <PhotoFrame
          brief="Authentic, high-quality photo: the CEA Arena sponsor board with member business names, shot at an event"
          aspect="aspect-[4/3]"
        />
      </section>
    </>
  );
}
