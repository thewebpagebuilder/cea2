import Link from "next/link";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import TrailMap from "@/components/TrailMap";
import { EventCard, ListingCard, NewsCard } from "@/components/cards";
import { getApprovedListings, getApprovedReports, getEvents, getPosts, getTrails } from "@/lib/data";
import { site } from "@/lib/nav";

export const dynamic = "force-dynamic";

function SectionHeading({
  eyebrow,
  title,
  lede,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-t-2 border-forest-800 pt-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl text-forest-800 md:text-4xl">{title}</h2>
        <p className="mt-3 text-charcoal-600">{lede}</p>
      </div>
      <Link href={href} className="btn btn-secondary shrink-0">
        {linkLabel}
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [trails, reports, events, listings, posts] = await Promise.all([
    getTrails(),
    getApprovedReports(),
    getEvents(),
    getApprovedListings(),
    getPosts(),
  ]);

  const open = trails.filter((t) => t.condition === "open").length;
  const caution = trails.filter((t) => t.condition === "caution").length;
  const closed = trails.filter((t) => t.condition === "closed").length;
  const featured = listings.filter((l) => l.featured).slice(0, 3);
  const upcoming = events.slice(0, 3);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="border-b border-forest-800 bg-forest-800 text-cream-100">
        <div className="container-cea grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brass-500 uppercase">
              Chico, California · Est. 1947
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.08] text-cream-50 md:text-6xl">
              Keeping horses in <em className="not-italic text-brass-500">Bidwell Park</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-forest-100/90">
              Chico Equestrian continues to keep Annie Bidwell&apos;s dream alive
              of keeping horses in our park. We maintain the trails, run the
              arena, and provide education to members and the community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/membership" className="btn btn-saddle">
                Become a Member
              </Link>
              <Link
                href="/trails"
                className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
              >
                Explore Trails
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-forest-700 pt-6">
              <div>
                <dt className="text-xs tracking-[0.12em] text-forest-100/70 uppercase">
                  Rideable routes
                </dt>
                <dd className="font-serif text-3xl text-cream-50">{trails.length}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.12em] text-forest-100/70 uppercase">
                  Open now
                </dt>
                <dd className="font-serif text-3xl text-brass-500">{open}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.12em] text-forest-100/70 uppercase">
                  Member businesses
                </dt>
                <dd className="font-serif text-3xl text-cream-50">{listings.length}</dd>
              </div>
            </dl>
          </div>

          <PhotoFrame
            aspect="aspect-[4/3]"
            className="border-forest-700"
            brief="Authentic, high-quality photo: CEA members riding out from the CEA Arena at first light, Upper Bidwell Park oaks behind them, dust in the low sun. No stock photography."
          />
        </div>

        {/* Status strip */}
        <div className="border-t border-forest-700 bg-forest-900">
          <div className="container-cea flex flex-col gap-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-forest-400" />
                {open} open
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-brass-500" />
                {caution} ride with care
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-[#8b3a2f]" />
                {closed} closed
              </span>
            </p>
            <p className="text-forest-100/80">
              Are the park trails open?{" "}
              <a
                href={site.trailLineHref}
                className="font-semibold text-cream-50 underline decoration-brass-500 decoration-2 underline-offset-4"
              >
                Call {site.trailLine}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Trail guide ---------------- */}
      <section className="container-cea py-20" id="trails">
        <Reveal>
          <SectionHeading
            eyebrow="Interactive trail guide"
            title="Know the ground before you haul out"
            lede="Every rideable route in Bidwell Park, drawn and maintained by CEA volunteers. Filter by condition, trailer parking, water, and difficulty — then read what riders found out there this week."
            href="/trails"
            linkLabel="Open the full guide"
          />
        </Reveal>
        <Reveal delay={80}>
          <TrailMap trails={trails} reports={reports} compact />
        </Reveal>
      </section>

      {/* ---------------- Events ---------------- */}
      <section className="border-y border-saddle-200 bg-cream-100 py-20">
        <div className="container-cea">
          <Reveal>
            <SectionHeading
              eyebrow="What's happening"
              title="Meetings, clinics, and rides"
              lede="The monthly meeting is the second Tuesday at the CEA Arena in Upper Bidwell. Everyone is welcome — bring a dish, bring a question."
              href="/events"
              linkLabel="All events"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {upcoming.map((event, i) => (
              <Reveal key={event.slug} delay={i * 90}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Directory ---------------- */}
      <section className="container-cea py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Member directory"
            title="The people who keep north valley horses going"
            lede="Farriers, vets, feed stores, barns, haulers, and instructors — CEA business members who support the park and the riders who use it."
            href="/directory"
            linkLabel="Search the directory"
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((listing, i) => (
            <Reveal key={listing.slug} delay={i * 90}>
              <ListingCard listing={listing} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- News ---------------- */}
      <section className="border-y border-saddle-200 bg-cream-100 py-20">
        <div className="container-cea">
          <Reveal>
            <SectionHeading
              eyebrow="From the association"
              title="News, trail notes, and reminders"
              lede="Committee updates, storm damage reports, scholarship deadlines, and the occasional reminder that dues are due."
              href="/news"
              linkLabel="Read all news"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post, i) => (
              <Reveal key={post.slug} delay={i * 90}>
                <NewsCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Membership + volunteer ---------------- */}
      <section className="container-cea py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full border-l-4 border-l-forest-700 p-8">
              <p className="eyebrow">Membership</p>
              <h2 className="mt-2 font-serif text-3xl text-forest-800">
                Dues are what keep the gate open
              </h2>
              <p className="mt-4 text-charcoal-600">
                Individual, Family, Business, and Lifetime memberships fund the
                arena, the trail tools, the scholarship, and the advocacy that
                keeps horses in the park. Renewals for 2026 are open now.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/membership" className="btn btn-primary">
                  Join or renew
                </Link>
                <Link href="/membership#benefits" className="btn btn-secondary">
                  Compare tiers
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="card h-full border-l-4 border-l-saddle-600 p-8">
              <p className="eyebrow">Get involved</p>
              <h2 className="mt-2 font-serif text-3xl text-forest-800">
                Loppers, coffee, and a good morning&apos;s work
              </h2>
              <p className="mt-4 text-charcoal-600">
                Trail crews, ride hosts, event setup, the scholarship committee,
                and the board. Tell us how much time you have and we will find
                the job that fits it.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/get-involved" className="btn btn-primary">
                  Volunteer with CEA
                </Link>
                <Link href="/events" className="btn btn-secondary">
                  Upcoming work days
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Newsletter / contact ---------------- */}
      <section className="border-t border-forest-800 bg-forest-800 py-16 text-cream-100">
        <div className="container-cea grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-cream-50">
              Not getting the newsletter?
            </h2>
            <p className="mt-3 max-w-xl text-forest-100/90">
              Contact Deni Whiting at{" "}
              <a
                href={site.phoneHref}
                className="font-semibold text-cream-50 underline decoration-brass-500 decoration-2 underline-offset-4"
              >
                {site.phone}
              </a>{" "}
              and we will correct your address. The newsletter carries trail
              closures, meeting agendas, and ride announcements before they
              appear anywhere else.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/contact" className="btn btn-saddle">
              Contact CEA
            </Link>
            <Link
              href="/resources"
              className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
            >
              Download resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
