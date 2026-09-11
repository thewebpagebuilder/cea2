import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Board & Volunteers",
  description:
    "CEA officers, committee chairs, and the volunteer roles that keep the arena, trails, events, and scholarship running.",
};

const officers = [
  { role: "President", name: "Name to be confirmed", focus: "Board agenda, City liaison" },
  { role: "Vice President", name: "Name to be confirmed", focus: "Programs, clinics" },
  { role: "Treasurer", name: "Name to be confirmed", focus: "Dues, insurance, filings" },
  { role: "Secretary", name: "Name to be confirmed", focus: "Minutes, membership records" },
  { role: "Membership Chair", name: "Name to be confirmed", focus: "Renewals, newsletter list" },
  { role: "Trails Chair", name: "Name to be confirmed", focus: "Work days, City trails crew" },
  { role: "Arena Manager", name: "Name to be confirmed", focus: "Scheduling, dragging, water" },
  { role: "Scholarship Chair", name: "Name to be confirmed", focus: "Mike Mathis Scholarship" },
];

const committees = [
  {
    name: "Trails Committee",
    cadence: "Monthly, plus work days in spring and autumn",
    body: "Walks and rides every route in the park after each storm, logs hazards, and runs the volunteer work days that clear them.",
  },
  {
    name: "Arena & Facilities",
    cadence: "Seasonal, heaviest before event season",
    body: "Drags the arena, maintains pens, waterers, and the clubhouse, and schedules member use of the grounds.",
  },
  {
    name: "Events & Rides",
    cadence: "Per event",
    body: "Plans the pleasure ride, clinics, and the monthly meeting potluck. Ride hosts use the CEA ride host checklist.",
  },
  {
    name: "Scholarship Committee",
    cadence: "April to July",
    body: "Reviews Mike Mathis Scholarship applications and reports to the board before the award.",
  },
  {
    name: "Communications",
    cadence: "Weekly",
    body: "Newsletter, this website, trail condition moderation, and the directory. No experience required, just literacy.",
  },
];

export default function BoardPage() {
  return (
    <>
      <PageHero
        eyebrow="About CEA"
        title="Board & volunteers"
        lede="CEA has no staff. Every meeting, work day, clinic, and newsletter is somebody's Tuesday evening. Here is who does what, and how to join them."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Board & Volunteers", href: "/about/board" },
        ]}
      >
        <Link href="/get-involved" className="btn btn-saddle">
          Volunteer with CEA
        </Link>
      </PageHero>

      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Officers</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            Elected at the November AGM
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal-600">
            Officers serve one-year terms and are elected by members in good
            standing. Names are confirmed after each AGM — this page is updated
            within a week of the election.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {officers.map((officer, i) => (
            <Reveal key={officer.role} delay={(i % 4) * 70}>
              <li className="card h-full p-5">
                <PhotoFrame
                  brief={`Authentic, high-quality headshot: CEA ${officer.role}, outdoors at the arena, natural light, no stock imagery`}
                  aspect="aspect-square"
                  className="mb-4"
                  captionHidden
                />
                <p className="eyebrow">{officer.role}</p>
                <p className="mt-1 font-serif text-lg text-forest-800">{officer.name}</p>
                <p className="mt-2 text-sm text-charcoal-600">{officer.focus}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-y border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea">
          <div className="mb-8 border-t-2 border-forest-800 pt-5">
            <p className="eyebrow">Committees</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Where the work actually happens
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {committees.map((committee, i) => (
              <Reveal key={committee.name} delay={(i % 3) * 80}>
                <div className="card h-full p-6">
                  <h3 className="font-serif text-xl text-forest-800">
                    {committee.name}
                  </h3>
                  <p className="mt-1 text-xs tracking-wide text-saddle-700 uppercase">
                    {committee.cadence}
                  </p>
                  <p className="mt-3 text-sm text-charcoal-600">{committee.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cea py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="card p-8">
            <h2 className="font-serif text-2xl text-forest-800">Run for the board</h2>
            <p className="mt-4 text-charcoal-600">
              Nominations open in September and close at the November AGM. You
              must be a member in good standing and willing to answer email
              between meetings.
            </p>
            <ol className="mt-5 space-y-2 text-sm text-charcoal-700">
              <li>1. Confirm your membership is current.</li>
              <li>2. Tell a current officer you intend to run.</li>
              <li>3. Give a two-minute statement at the AGM.</li>
              <li>4. Get elected. Start going to meetings.</li>
            </ol>
            <Link href="/membership" className="btn btn-primary mt-6">
              Renew first
            </Link>
          </div>
          <div className="card border-l-4 border-l-saddle-600 p-8">
            <h2 className="font-serif text-2xl text-forest-800">Not ready for a title?</h2>
            <p className="mt-4 text-charcoal-600">
              Most of what CEA does runs on people who never hold office. Bring
              a chainsaw to a work day. Host a ride. Moderate trail reports from
              your kitchen table. Tell us how much time you have.
            </p>
            <Link href="/get-involved" className="btn btn-saddle mt-6">
              See volunteer roles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
