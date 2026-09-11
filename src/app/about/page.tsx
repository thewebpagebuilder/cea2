import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The Chico Equestrian Association has kept horses in Bidwell Park since 1947 — arena, trails, education, and advocacy, run entirely by volunteers.",
};

const timeline = [
  {
    year: "1905",
    title: "Annie Bidwell's gift",
    body: "Annie Bidwell deeds the land that becomes Bidwell Park to the City of Chico, with a vision of public ground that belongs to everyone — horses included.",
  },
  {
    year: "1947",
    title: "CEA is founded",
    body: "Local riders organise to keep equestrian access written into how the park is used, and to give that access a body that can speak for it.",
  },
  {
    year: "1970s",
    title: "The arena goes up",
    body: "Volunteers build and maintain the arena in Upper Bidwell Park that still hosts meetings, clinics, and the annual pleasure ride.",
  },
  {
    year: "1990s",
    title: "Trails committee forms",
    body: "A standing committee starts systematic trail maintenance, working alongside the City on tread, drainage, and signage.",
  },
  {
    year: "2000s",
    title: "Education and scholarship",
    body: "Clinics, beginner trail-safety courses, and the Mike Mathis Scholarship for students enrolled in agriculture programs.",
  },
  {
    year: "Today",
    title: "Still volunteer-run",
    body: "Everything you see on this site — maps, condition reports, directory, event calendar — is maintained by members between rides.",
  },
];

const values = [
  {
    title: "Access first",
    body: "Our job is to keep horses welcome in a public park. Every decision gets measured against that.",
  },
  {
    title: "Shared ground, good manners",
    body: "We ride alongside runners, cyclists, and families. Courtesy on the trail is what earns us a seat at the table.",
  },
  {
    title: "Pass it on",
    body: "Clinics, 4-H, and the scholarship exist because this only continues if the next generation can ride here too.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About CEA"
        title="Keeping Annie Bidwell's dream alive"
        lede="Chico Equestrian continues to keep Annie Bidwell's dream alive of keeping horses in our park. We also provide education to members and the community — and we have done it with volunteers since 1947."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/membership" className="btn btn-saddle">
            Become a Member
          </Link>
          <Link
            href="/about/board"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Meet the board
          </Link>
        </div>
      </PageHero>

      <section className="container-cea grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="font-serif text-3xl text-forest-800">
            A volunteer association with a very specific job
          </h2>
          <p className="mt-5 text-charcoal-700">
            CEA exists because public land does not stay open to horses by
            accident. It stays open because somebody shows up: to a City Council
            meeting, to a work day with loppers, to a classroom of twelve-year-olds
            learning how to pass a mountain bike without anybody getting hurt.
          </p>
          <p className="mt-4 text-charcoal-700">
            We maintain the arena in Upper Bidwell Park, run the monthly meeting
            that has happened on the second Tuesday for decades, publish trail
            conditions from riders who were actually out there, and keep a
            directory of the farriers, vets, and barns that keep north valley
            horses going.
          </p>
          <p className="mt-4 text-charcoal-700">
            None of it is staffed. All of it is members.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="card p-5">
                <h3 className="font-serif text-lg text-forest-800">{value.title}</h3>
                <p className="mt-2 text-sm text-charcoal-600">{value.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <PhotoFrame
            brief="Authentic, high-quality photo: the CEA Arena in Upper Bidwell Park at golden hour, rail fence and oaks, maybe a horse tied to the rail"
            aspect="aspect-[4/3]"
          />
          <PhotoFrame
            brief="Authentic, high-quality photo: archive-style photo of early CEA members on horseback in Bidwell Park, black and white or faded colour"
            aspect="aspect-[4/3]"
          />
        </div>
      </section>

      <section className="border-y border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea">
          <div className="mb-10 border-t-2 border-forest-800 pt-5">
            <p className="eyebrow">Our history</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Seventy-nine years of showing up
            </h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={(i % 3) * 80}>
                <li className="card h-full p-6">
                  <p className="font-serif text-2xl text-saddle-700">{item.year}</p>
                  <h3 className="mt-1 font-serif text-xl text-forest-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-600">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-8 text-xs text-charcoal-500">
            History note for the editor: verify each date against the CEA
            archive before publishing. Corrections welcome at
            info@chicoequestrianassociation.org.
          </p>
        </div>
      </section>

      <section className="container-cea py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Read our bylaws</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Officer duties, election procedure, and how the association is
              governed.
            </p>
            <Link href="/resources" className="btn btn-secondary mt-4">
              Download bylaws
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Meet the board</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Officers, committee chairs, and how to put your name on the
              ballot in November.
            </p>
            <Link href="/about/board" className="btn btn-secondary mt-4">
              Board & volunteers
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Ride with us</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Work days, clinics, and the annual pleasure ride. New members are
              the point.
            </p>
            <Link href="/events" className="btn btn-secondary mt-4">
              See the calendar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
