import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import { EventCard } from "@/components/cards";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "CEA monthly meetings, clinics, trail work days, scholarship deadlines, and community rides at the CEA Arena in Upper Bidwell Park.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const lead = events[0];

  return (
    <>
      <PageHero
        eyebrow="What's happening"
        title="Meetings, clinics, and rides"
        lede="The monthly meeting is the second Tuesday of the month at the CEA Arena in Upper Bidwell. It is potluck, it is open to everyone, and it is where decisions actually get made."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
        ]}
      >
        <Link href="/membership" className="btn btn-saddle">
          Become a Member
        </Link>
      </PageHero>

      {lead ? (
        <section className="container-cea py-16">
          <Reveal>
            <div className="grid gap-8 border border-saddle-200 bg-white p-6 md:grid-cols-[1fr_1.2fr] md:p-8 lg:grid-cols-[1fr_1.4fr]">
              <PhotoFrame
                brief={lead.imageAlt}
                aspect="aspect-[4/3]"
                className="h-full min-h-[14rem]"
              />
              <div>
                <p className="eyebrow">Next up · {lead.category}</p>
                <h2 className="mt-2 font-serif text-3xl text-forest-800 md:text-4xl">
                  {lead.title}
                </h2>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-forest-800">When</dt>
                    <dd className="text-charcoal-700">
                      {lead.dateLabel} · {lead.timeLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-forest-800">Where</dt>
                    <dd className="text-charcoal-700">{lead.location}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-forest-800">Cost</dt>
                    <dd className="text-charcoal-700">{lead.cost ?? "Free"}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-charcoal-700">{lead.summary}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn btn-primary">
                    Questions about this event
                  </Link>
                  <Link href="/get-involved" className="btn btn-secondary">
                    Volunteer to help
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}

      <section className="border-t border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea">
          <div className="mb-8 border-t-2 border-forest-800 pt-5">
            <p className="eyebrow">Full calendar</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              The 2026 season
            </h2>
            <p className="mt-3 max-w-2xl text-charcoal-600">
              Weather and park closures can move a date. If you are driving in
              from out of town, confirm on the newsletter or the trail line first.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.slug} delay={(i % 3) * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cea py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Host a ride</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Members can propose a ride. CEA provides the ride host checklist,
              waivers, and a lead and drag rider briefing.
            </p>
            <Link href="/resources" className="btn btn-secondary mt-4">
              Ride host checklist
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Bring the arena up</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              The CEA Arena is available to members for approved events. Ask the
              board before you put a date on the calendar.
            </p>
            <Link href="/contact" className="btn btn-secondary mt-4">
              Ask about the arena
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Get reminded</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              The newsletter carries agendas and ride announcements before they
              appear anywhere else. Not getting it? Call 530-519-3803.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
