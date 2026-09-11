import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";
import { getTiers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join or renew with the Chico Equestrian Association. Individual, Family, Business, and Lifetime memberships keep horses in Bidwell Park.",
};

const steps = [
  {
    title: "Pick a tier",
    body: "Individual, Family, Business, or Lifetime. Family is the best value if anyone under eighteen rides in your house.",
  },
  {
    title: "Pay dues",
    body: "Renew online, mail a check with the downloadable form, or hand it to the treasurer at the next monthly meeting.",
  },
  {
    title: "Get on the list",
    body: "You will start receiving the newsletter and trail-condition alerts. Check your spam folder the first time.",
  },
  {
    title: "Use it",
    body: "Member rates on clinics and rides, voting rights at the AGM, and the ability to file trail condition reports.",
  },
];

const faqs = [
  {
    q: "When are dues due?",
    a: "Annually, at the start of the calendar year. Renewals for 2026 are open now. If you joined after October, your dues carry through the following year.",
  },
  {
    q: "Do I have to own a horse?",
    a: "No. Plenty of members ride lesson horses, lease, or simply want the park kept open for those who do.",
  },
  {
    q: "What does the money actually pay for?",
    a: "Arena maintenance and dragging, trail tools and materials, insurance for events, the Mike Mathis Scholarship, and the advocacy work that keeps equestrian access in the park's plans.",
  },
  {
    q: "Can my business join instead?",
    a: "Yes — Business membership is $150 a year and includes a directory listing, sponsor board placement, and a newsletter spotlight.",
  },
];

export default async function MembershipPage() {
  const tiers = await getTiers();

  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Dues are what keep the gate open"
        lede="CEA is volunteer-run and member-funded. Your dues pay for the arena, the trail tools, the scholarship, and the voice we bring to the City when equestrian access comes up."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Membership", href: "/membership" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#tiers" className="btn btn-saddle">
            Join or renew
          </a>
          <a
            href="#benefits"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Compare tiers
          </a>
        </div>
      </PageHero>

      <section id="tiers" className="container-cea py-16 scroll-mt-24">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">2026 dues</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800 md:text-4xl">
            Choose your membership
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal-600">
            Renewals can be submitted at the next monthly meeting or mailed with
            the downloadable form. Business owners: see the business section
            below.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier, i) => (
            <Reveal key={tier.slug} delay={i * 80}>
              <div
                className={`card lift flex h-full flex-col p-6 ${
                  tier.featured ? "border-2 border-forest-700 bg-forest-50" : ""
                }`}
              >
                {tier.featured ? (
                  <p className="mb-3 inline-block self-start bg-forest-700 px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.14em] text-cream-50 uppercase">
                    Most popular
                  </p>
                ) : null}
                <h3 className="font-serif text-2xl text-forest-800">{tier.name}</h3>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className="font-serif text-4xl text-forest-800">${tier.price}</span>
                  <span className="text-sm text-charcoal-500">{tier.cadence}</span>
                </p>
                <p className="mt-3 text-sm text-charcoal-600">{tier.blurb}</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2 text-charcoal-700">
                      <span aria-hidden="true" className="text-forest-600">
                        ✓
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/directory/submit"
                  className={`btn mt-6 w-full ${tier.slug === "business" ? "btn-saddle" : "btn-primary"}`}
                >
                  {tier.slug === "business" ? "Apply as a business" : `Join as ${tier.name}`}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="benefits" className="border-y border-saddle-200 bg-cream-100 py-16 scroll-mt-24">
        <div className="container-cea grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">What membership buys</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Four steps, one season
            </h2>
            <ol className="mt-8 space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest-700 bg-white font-serif text-base text-forest-800"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-xl text-forest-800">{step.title}</p>
                    <p className="mt-1 text-sm text-charcoal-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/resources" className="btn btn-primary">
                Download the membership form
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Ask a question first
              </Link>
            </div>
          </div>

          <PhotoFrame
            brief="Authentic, high-quality photo: a CEA member handing a renewal check to the treasurer at the monthly meeting, arena rail and hoof dust behind them"
            aspect="aspect-[4/5]"
          />
        </div>
      </section>

      <section id="business" className="container-cea py-16 scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Business membership</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              $150 a year, and riders can find you
            </h2>
            <p className="mt-4 text-charcoal-600">
              Business members get a listing in the searchable directory with
              your services, phone, and website; your name on the sponsor board
              at the arena; and one newsletter spotlight a year. It is the least
              expensive way to reach horse owners in the north valley.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/directory/submit" className="btn btn-saddle">
                Apply for a listing
              </Link>
              <Link href="/directory" className="btn btn-secondary">
                See who is listed
              </Link>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Questions</h3>
            <dl className="mt-4 space-y-4 text-sm">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <dt className="font-semibold text-forest-800">{faq.q}</dt>
                  <dd className="mt-1 text-charcoal-600">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
