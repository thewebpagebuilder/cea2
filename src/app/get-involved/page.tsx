import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Volunteer & Get Involved",
  description:
    "Trail crews, ride hosts, event setup, committees, and the board. Tell CEA how much time you have and we will find the job that fits it.",
};

const roles = [
  {
    title: "Trail crew",
    time: "A Saturday morning, 3–4 times a year",
    body: "Brush back tread, clear deadfall, rebuild water bars, and sign hazards. Bring gloves, boots, and loppers if you have them. Coffee and lunch are provided.",
    cta: "Join a work day",
    href: "/events",
  },
  {
    title: "Ride host",
    time: "One event, a few hours",
    body: "Lead a group or drag it. CEA supplies the ride host checklist, waivers, and a briefing. Experienced trail horses only, and a cool head in the group.",
    cta: "Read the checklist",
    href: "/resources",
  },
  {
    title: "Event setup & teardown",
    time: "Two to four hours, event days",
    body: "Panels, pens, tables, the BBQ, the sign-in table. Unskilled, essential, and the fastest way to meet everybody.",
    cta: "See upcoming events",
    href: "/events",
  },
  {
    title: "Website & directory editor",
    time: "One to two hours a week, remote",
    body: "Approve trail condition reports, review business listings, publish news, and keep event listings current. All of it is point-and-click.",
    cta: "See the admin console",
    href: "/admin",
  },
  {
    title: "Committee member",
    time: "A meeting a month",
    body: "Trails, arena, events, scholarship, or communications. This is where the association's actual decisions get shaped.",
    cta: "Meet the committees",
    href: "/about/board",
  },
  {
    title: "Officer",
    time: "A year, and more email than you expect",
    body: "President, Vice President, Treasurer, Secretary. Elected at the November AGM by members in good standing.",
    cta: "How the election works",
    href: "/about/board",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Loppers, coffee, and a good morning's work"
        lede="Everything CEA does is done by people who ride here. Tell us how much time you have — an hour a week or a Saturday a season — and we will find the job that fits it."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Get Involved", href: "/get-involved" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/membership" className="btn btn-saddle">
            Become a Member
          </Link>
          <Link href="/contact" className="btn border-cream-100 text-cream-50 hover:bg-forest-700">
            Talk to a volunteer
          </Link>
        </div>
      </PageHero>

      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Open roles</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            Pick the commitment that fits
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal-600">
            There is no minimum. Most members start by showing up once and end
            up running something two years later.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role, i) => (
            <Reveal key={role.title} delay={(i % 3) * 80}>
              <article className="card lift flex h-full flex-col p-6">
                <h3 className="font-serif text-xl text-forest-800">{role.title}</h3>
                <p className="mt-1 text-xs tracking-wide text-saddle-700 uppercase">
                  {role.time}
                </p>
                <p className="mt-3 flex-1 text-sm text-charcoal-600">{role.body}</p>
                <Link href={role.href} className="btn btn-secondary mt-5 self-start">
                  {role.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-serif text-3xl text-forest-800">
              Log your hours
            </h2>
            <p className="mt-4 text-charcoal-700">
              Trail work, event setup, committee meetings, and admin time all
              count. Logged hours roll up into the annual volunteer recognition
              award, and they are the number we quote when the City asks how much
              this community contributes in kind.
            </p>
            <ol className="mt-6 space-y-3 text-sm text-charcoal-700">
              <li>1. Download the volunteer hours log from Resources.</li>
              <li>2. Record dates, hours, and what you did.</li>
              <li>3. Email it to the secretary quarterly, or bring it to a meeting.</li>
            </ol>
            <Link href="/resources" className="btn btn-primary mt-6">
              Download the hours log
            </Link>
          </div>
          <PhotoFrame
            brief="Authentic, high-quality photo: CEA volunteers hauling brush off a trail in Upper Bidwell Park, gloves and long sleeves, wheelbarrow"
            aspect="aspect-[4/3]"
          />
        </div>
      </section>
    </>
  );
}
