import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { ResourceRow } from "@/components/cards";
import { getResources } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources & Downloads",
  description:
    "CEA membership forms, the Mike Mathis Scholarship application, bylaws, trail etiquette cards, ride host checklists, and volunteer logs.",
};

export default async function ResourcesPage() {
  const resources = await getResources();

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const order = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Forms, documents, and downloads"
        lede="Everything volunteers and members need in one place — membership forms, scholarship packets, bylaws, safety cards, and the checklists behind every CEA event."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
        ]}
      />

      <section className="container-cea py-16">
        <nav aria-label="Resource categories" className="mb-10 flex flex-wrap gap-2">
          {order.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase()}`}
              className="border border-saddle-200 bg-white px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
            >
              {category} ({grouped[category].length})
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {order.map((category) => (
            <section
              key={category}
              id={category.toLowerCase()}
              aria-labelledby={`${category.toLowerCase()}-heading`}
              className="scroll-mt-28"
            >
              <Reveal>
                <div className="mb-5 border-t-2 border-forest-800 pt-5">
                  <h2
                    id={`${category.toLowerCase()}-heading`}
                    className="font-serif text-2xl text-forest-800"
                  >
                    {category}
                  </h2>
                </div>
              </Reveal>
              <ul className="space-y-4">
                {grouped[category].map((resource) => (
                  <li key={resource.title}>
                    <ResourceRow resource={resource} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="border-t border-saddle-200 bg-cream-100 py-14">
        <div className="container-cea grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl text-forest-800">Can&apos;t open a file?</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Every PDF here is text-based and screen-reader friendly. If one
              gives you trouble, call 530-519-3803 and we will send it another
              way.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Scholarship packets</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              The Mike Mathis Scholarship requires an agriculture program
              enrolment. Requirements and application are both above.
            </p>
            <Link href="/resources#scholarship" className="btn btn-secondary mt-4">
              Scholarship documents
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Outdated document?</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Tell us. Forms go stale quickly and nobody notices faster than the
              member trying to fill one in.
            </p>
            <Link href="/contact" className="btn btn-secondary mt-4">
              Report a problem
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
