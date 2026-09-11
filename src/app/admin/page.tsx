import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AdminConsole from "@/components/AdminConsole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Volunteer Admin Console",
  description:
    "Moderate trail condition reports and directory applications, and review CEA user permissions.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Volunteer admin"
        title="Moderate the site in ten minutes"
        lede="Two queues, two buttons each. Approve a rider's trail report or a business listing and it goes live immediately — no code, no FTP, no developer."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Volunteer admin", href: "/admin" },
        ]}
      />

      <section className="container-cea py-14">
        <AdminConsole />
      </section>

      <section className="border-t border-saddle-200 bg-cream-100 py-14">
        <div className="container-cea grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl text-forest-800">Editing content</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Events, news, resources, and membership tiers are records in the
              same database — edited through the CMS, not through files.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Handover</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              CEA owns the code, the database, and every asset. Nothing here
              locks you to a proprietary page builder.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Getting help</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              The architecture and IA are documented on the design system page,
              written for whoever inherits this site next.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
