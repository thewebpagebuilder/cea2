import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PhotoFrame from "@/components/PhotoFrame";
import { getPost, getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const all = await getPosts();
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${post.category} · ${post.dateLabel}`}
        title={post.title}
        lede={post.excerpt}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: post.title, href: `/news/${post.slug}` },
        ]}
      />

      <article className="container-cea py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="max-w-2xl">
            <PhotoFrame
              brief="Authentic, high-quality photo from this story: CEA members, Bidwell Park trails, or the arena at a CEA event. No stock photography."
              aspect="aspect-[16/9]"
              className="mb-8"
            />
            {post.body.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)} className="mb-5 text-lg text-charcoal-700">
                {para}
              </p>
            ))}
            <p className="mt-8 border-t border-saddle-200 pt-5 text-sm text-charcoal-500">
              {post.author} · {post.dateLabel} · {post.readingMinutes} min read
            </p>
            <Link href="/news" className="btn btn-secondary mt-6">
              ← All news
            </Link>
          </div>

          <aside>
            <div className="card p-6">
              <h2 className="font-serif text-xl text-forest-800">More from CEA</h2>
              <ul className="mt-4 space-y-4">
                {more.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/news/${item.slug}`} className="group block">
                      <p className="text-xs tracking-wide text-saddle-700 uppercase">
                        {item.category}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-forest-800 group-hover:underline">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
