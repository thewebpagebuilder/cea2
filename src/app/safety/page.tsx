import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Safety & Trail Etiquette",
  description:
    "CEA passing protocol, water crossings, trailering and tying basics, and what to carry on a Bidwell Park ride.",
};

const protocol = [
  {
    title: "Announce yourself early",
    body: "Use your voice, not a whistle. A cyclist or runner who knows you are there will slow down and give you room. Silence and speed are what spook horses.",
  },
  {
    title: "Pass left-hand to left-hand",
    body: "Oncoming riders keep right and pass left shoulder to left shoulder. Step to the uphill side and let descending traffic have the tread.",
  },
  {
    title: "Walk the blind corners",
    body: "Yield does not mean right-of-way over gravity. If you cannot see through it, stop and listen before you commit.",
  },
  {
    title: "Water crossings: let them drink",
    body: "Give a horse its head at the creek, then walk out. Do not hurry a horse across cobble and do not stop in the middle of it.",
  },
  {
    title: "Close every gate",
    body: "Cattle graze the south side under permit. A gate that was closed when you found it is closed when you leave it.",
  },
  {
    title: "Leave the tread better",
    body: "Kick a rolling rock off the trail. Drag a small branch. It takes ten seconds and it is the whole reason these routes stay rideable.",
  },
];

const kit = [
  "Hoof pick and a boot you can actually fit",
  "Water for you — more than you think",
  "Phone with the park line saved: 530-896-7899",
  "A halter and lead you can use one-handed",
  "Something reflective if you might be out at dusk",
  "Your CEA membership card and emergency contact",
];

const emergencies = [
  {
    title: "Injured rider, remote area",
    body: "Call 911 first. Air ambulance coverage is worth thinking about before you need it — Enloe Life Flight and AirMedCare National Membership both apply in this area.",
  },
  {
    title: "Injured horse",
    body: "Get yourself safe, then the horse. Call your vet; several member practices make field calls to the staging areas.",
  },
  {
    title: "Loose horse",
    body: "Do not chase. Call the barn or trailer it came from. Post on the conditions board so riders behind you know.",
  },
  {
    title: "Aggressive off-leash dog",
    body: "Put the horse behind you, keep moving if you can, and report it. The leash ordinance applies in the park.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety"
        title="Trail etiquette & passing protocol"
        lede="Bidwell Park is shared ground. The protocol below is what CEA teaches in its beginner clinics, and it is why riders keep getting invited to the table when park access is discussed."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Safety & Etiquette", href: "/safety" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/trails" className="btn btn-saddle">
            Explore the trails
          </Link>
          <Link
            href="/resources"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Etiquette card (PDF)
          </Link>
        </div>
      </PageHero>

      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">The protocol</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            Six rules that prevent almost everything
          </h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {protocol.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 80}>
              <li className="card h-full p-6">
                <span
                  aria-hidden="true"
                  className="font-serif text-3xl text-saddle-300"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-xl text-forest-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-charcoal-600">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-forest-800">What to carry</h2>
            <p className="mt-3 text-charcoal-600">
              A trail ride in Bidwell Park is never more than a couple of miles
              from a road, but a lame horse at the far end of the rim is still a
              long walk out.
            </p>
            <ul className="mt-6 space-y-3">
              {kit.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-charcoal-700">
                  <span aria-hidden="true" className="text-forest-600">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <PhotoFrame
            brief="Authentic, high-quality photo: a rider's trail kit laid out on a saddle blanket — hoof pick, water bottle, halter and lead, phone"
            aspect="aspect-[4/3]"
          />
        </div>
      </section>

      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">If something goes wrong</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            Emergency guidance
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {emergencies.map((item) => (
            <div key={item.title} className="card border-l-4 border-l-[#8b3a2f] p-6">
              <h3 className="font-serif text-xl text-forest-800">{item.title}</h3>
              <p className="mt-2 text-sm text-charcoal-600">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-charcoal-600">
          CEA discusses air ambulance coverage at the June meeting every year.
          If you have never priced it, do — it is the cheapest insurance in the
          sport.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/trails/conditions" className="btn btn-primary">
            Report a hazard
          </Link>
          <Link href="/directory" className="btn btn-secondary">
            Find a vet
          </Link>
        </div>
      </section>
    </>
  );
}
