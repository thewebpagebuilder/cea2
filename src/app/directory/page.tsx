import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DirectoryExplorer from "@/components/DirectoryExplorer";
import { getApprovedListings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equestrian Business & Member Directory",
  description:
    "Searchable directory of CEA member businesses serving north valley horse owners: farriers, veterinarians, feed and tack, boarding, instruction, hauling, and more.",
};

export default async function DirectoryPage() {
  const listings = await getApprovedListings();

  const categoryCount = new Map<string, number>();
  listings.forEach((l) => categoryCount.set(l.category, (categoryCount.get(l.category) ?? 0) + 1));
  const topCategories = [...categoryCount.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow="Member directory"
        title="Businesses that serve north valley horse owners"
        lede="Every listing here is a CEA member or community partner — farriers who know our footing, vets who make field calls to the staging areas, and barns that ride out from their own back gate."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Directory", href: "/directory" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/directory/submit" className="btn btn-saddle">
            Submit a listing
          </Link>
          <Link
            href="/membership#business"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Business membership
          </Link>
        </div>
      </PageHero>

      <section className="container-cea py-12">
        <DirectoryExplorer listings={listings} />
      </section>

      <section className="border-t border-saddle-200 bg-cream-100 py-14">
        <div className="container-cea grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-2xl text-forest-800">Browse by trade</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Jump straight to a category, or use the filters above to narrow by
              region and specific service.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {topCategories.map(([name, count]) => (
              <li key={name}>
                <span className="inline-flex items-center gap-2 border border-saddle-200 bg-white px-3 py-2 text-sm">
                  <span className="font-semibold text-forest-800">{name}</span>
                  <span className="text-xs text-charcoal-500">{count}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-cea py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Is your business listed?</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Business membership is $150 a year and includes your directory
              listing, a spot on the arena sponsor board, and a newsletter
              spotlight.
            </p>
            <Link href="/directory/submit" className="btn btn-primary mt-4">
              Apply for a listing
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">How listings are vetted</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              A volunteer confirms the business is real, current, and insured
              where insurance applies. Listings are reviewed annually at renewal.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">Corrections</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Wrong phone number? Closed shop? Tell us and we will fix it in a
              day. Members can update their own listing at any time.
            </p>
            <Link href="/contact" className="btn btn-secondary mt-4">
              Contact CEA
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
