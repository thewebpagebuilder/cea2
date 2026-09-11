import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import { site } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Chico Equestrian Association: mail, phone, the CEA Arena in Upper Bidwell Park, and the park trail and gate information lines.",
};

const channels = [
  {
    title: "General questions",
    body: "Membership, events, the arena, or anything else. We answer email within a few days during the riding season.",
    action: { label: site.email, href: `mailto:${site.email}` },
  },
  {
    title: "Newsletter list",
    body: "Not getting the newsletter? Contact Deni Whiting and we will correct your address.",
    action: { label: site.phone, href: site.phoneHref },
  },
  {
    title: "Are the park trails open?",
    body: "The City of Chico posts official trail status on this line.",
    action: { label: site.trailLine, href: site.trailLineHref },
  },
  {
    title: "Is the Arena Way gate locked?",
    body: "Vehicle access questions for Arena Way. Hours: Monday through Friday only.",
    action: { label: site.gateLine, href: site.gateLineHref },
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach a human"
        lede="CEA is volunteer-run, so email is the most reliable way to reach us. For urgent trail hazards or an injured rider, call the park line instead."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <section className="container-cea grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <ul className="grid gap-5">
            {channels.map((channel) => (
              <li key={channel.title} className="card p-6">
                <h2 className="font-serif text-xl text-forest-800">{channel.title}</h2>
                <p className="mt-2 text-sm text-charcoal-600">{channel.body}</p>
                <a
                  href={channel.action.href}
                  className="mt-4 inline-block font-serif text-2xl text-saddle-700 underline decoration-brass-500 decoration-2 underline-offset-4 hover:text-saddle-800"
                >
                  {channel.action.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 card bg-forest-50 p-6">
            <h2 className="font-serif text-xl text-forest-800">Mail</h2>
            <p className="mt-2 text-sm text-charcoal-700">
              {site.name}
              <br />
              PO Box (to be confirmed), Chico, CA 95928
            </p>
            <p className="mt-3 text-xs text-charcoal-500">
              Editor note: replace the placeholder PO Box with CEA&apos;s current
              mailing address before launch.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <PhotoFrame
            brief="Authentic, high-quality photo: the CEA Arena entrance sign and gate in Upper Bidwell Park, morning light"
            aspect="aspect-[4/3]"
          />
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Finding the arena</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              {site.address}. From Vallombrosa Avenue, follow Upper Park Road
              east; the arena is signed on the north side past Five Mile.
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-forest-800">Monthly meeting</dt>
                <dd className="text-charcoal-700">
                  Second Tuesday, 6:00 PM, CEA Arena — board meeting follows the
                  general meeting.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-forest-800">Vehicle access</dt>
                <dd className="text-charcoal-700">
                  Arena Way gate is unlocked weekdays only. Call{" "}
                  <a href={site.gateLineHref} className="underline">
                    {site.gateLine}
                  </a>{" "}
                  if you need it opened.
                </dd>
              </div>
            </dl>
            <a
              href={site.citySite}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-secondary mt-5"
            >
              City of Chico park info
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
