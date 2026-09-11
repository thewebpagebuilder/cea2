import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { NewsCard } from "@/components/cards";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
  description:
    "Committee updates, trail reports, scholarship news, and reminders from the Chico Equestrian Association.",
};

export default async function NewsPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="From the association"
        title="News & trail notes"
        lede="Committee updates, storm damage reports, scholarship deadlines, and the occasional reminder that dues are due."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
        ]}
      />

      <section className="container-cea py-16">
        {lead ? (
          <Reveal>
            <article className="border-b border-saddle-200 pb-12">
              <p className="eyebrow">
                {lead.category} · {lead.dateLabel}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-forest-800 md:text-4xl">
                <Link href={`/news/${lead.slug}`} className="hover:underline">
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-charcoal-700">{lead.excerpt}</p>
              <p className="mt-4 text-sm text-charcoal-500">
                {lead.author} · {lead.readingMinutes} min read
              </p>
              <Link href={`/news/${lead.slug}`} className="btn btn-secondary mt-6">
                Read the update
              </Link>
            </article>
          </Reveal>
        ) : null}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 80}>
              <NewsCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-saddle-200 bg-cream-100 py-14">
        <div className="container-cea grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl text-forest-800">Want something published?</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Members are welcome to submit ride recaps, committee notes, or a
              photo from a work day. Send it and we will edit it into shape.
            </p>
            <Link href="/contact" className="btn btn-secondary mt-4">
              Send an item
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Newsletter archive</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Every newsletter from the 2025 season is compiled into one PDF on
              the resources page.
            </p>
            <Link href="/resources" className="btn btn-secondary mt-4">
              Open resources
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest-800">Corrections</h2>
            <p className="mt-3 text-sm text-charcoal-600">
              We get trail names wrong and dates wrong. Tell us and we will fix
              it the same day, with a note.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
