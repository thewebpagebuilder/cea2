import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ListingForm from "@/components/ListingForm";

export const metadata: Metadata = {
  title: "Submit a Directory Listing",
  description:
    "Apply for a listing in the CEA Equestrian Business & Member Directory. Reviewed by CEA volunteers.",
};

const steps = [
  {
    title: "You apply",
    body: "Two minutes of typing. Nothing goes live automatically.",
  },
  {
    title: "A volunteer reviews it",
    body: "We confirm the business is real and current, then approve or ask a follow-up question.",
  },
  {
    title: "You get invoiced",
    body: "Business membership is $150 a year, invoiced after approval — not before.",
  },
  {
    title: "You go live",
    body: "Your listing appears in the searchable directory and stays editable year-round.",
  },
];

export default function SubmitListingPage() {
  return (
    <>
      <PageHero
        eyebrow="Directory"
        title="Submit a business listing"
        lede="CEA business members reach riders who are actively looking for a farrier, a vet, a barn, or a hauler. Tell us what you do and we will take it from there."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Directory", href: "/directory" },
          { label: "Submit a listing", href: "/directory/submit" },
        ]}
      />

      <section className="container-cea grid gap-12 py-16 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="font-serif text-2xl text-forest-800">Application</h2>
          <p className="mt-2 text-sm text-charcoal-600">
            Fields marked * are required. Everything here is editable later —
            start rough if you need to.
          </p>
          <div className="mt-6">
            <ListingForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-forest-800">How it works</h2>
            <ol className="mt-4 space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-700 font-serif text-sm text-cream-50"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-forest-800">{step.title}</p>
                    <p className="mt-0.5 text-sm text-charcoal-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card bg-forest-50 p-6">
            <h2 className="font-serif text-xl text-forest-800">
              Already a business member?
            </h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Email your changes — new phone number, new services, new hours —
              and we will update your listing the same week.
            </p>
            <Link href="/contact" className="btn btn-secondary mt-4">
              Contact CEA
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
