import Link from "next/link";
import type { CeaEvent, Listing, Post, Resource } from "@/lib/types";

export function ConditionBadge({ condition }: { condition: string }) {
  const map: Record<string, { label: string; className: string; dot: string }> = {
    open: {
      label: "Open",
      className: "border-forest-300 bg-forest-50 text-forest-800",
      dot: "bg-forest-600",
    },
    caution: {
      label: "Ride with care",
      className: "border-brass-500 bg-[#fbf6e6] text-[#6f5420]",
      dot: "bg-brass-500",
    },
    closed: {
      label: "Closed",
      className: "border-[#b8604f] bg-[#fbeeea] text-[#7d2f22]",
      dot: "bg-[#8b3a2f]",
    },
  };
  const item = map[condition] ?? map.open;
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 text-xs font-semibold tracking-wide ${item.className}`}
    >
      <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

export function EventCard({ event }: { event: CeaEvent }) {
  return (
    <article className="card lift flex h-full flex-col overflow-hidden">
      <div className="flex">
        <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-forest-700 py-4 text-cream-50">
          <span className="font-serif text-2xl leading-none">{event.dayNum}</span>
          <span className="mt-1 text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
            {event.monthShort}
          </span>
          <span className="mt-1 text-[0.625rem] text-forest-100/80">{event.year}</span>
        </div>
        <div className="flex-1 p-5">
          <p className="eyebrow">{event.category}</p>
          <h3 className="mt-1.5 font-serif text-xl leading-snug text-forest-800">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-charcoal-600">{event.timeLabel}</p>
          <p className="text-sm text-charcoal-600">{event.location}</p>
        </div>
      </div>
      <p className="border-t border-saddle-100 px-5 py-4 text-sm text-charcoal-700">
        {event.summary}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-saddle-100 px-5 py-3 text-sm">
        <span className="font-semibold text-saddle-700">{event.cost ?? "Free"}</span>
        <Link
          href="/events"
          className="font-semibold text-forest-700 underline decoration-brass-500 decoration-2 underline-offset-4 hover:text-forest-900"
        >
          Details
        </Link>
      </div>
    </article>
  );
}

export function NewsCard({ post }: { post: Post }) {
  return (
    <article className="card lift flex h-full flex-col p-6">
      <p className="eyebrow">
        {post.category} · {post.dateLabel}
      </p>
      <h3 className="mt-2 font-serif text-xl leading-snug text-forest-800">
        <Link href={`/news/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm text-charcoal-600">{post.excerpt}</p>
      <p className="mt-5 text-xs tracking-wide text-charcoal-500 uppercase">
        {post.author} · {post.readingMinutes} min read
      </p>
    </article>
  );
}

export function ListingCard({
  listing,
  onSelect,
}: {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
}) {
  const initials = listing.name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const body = (
    <>
      <div className="flex items-start gap-4 p-5">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-forest-700 bg-forest-50 font-serif text-base font-semibold text-forest-800"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="eyebrow">{listing.category}</p>
          <h3 className="mt-1 font-serif text-lg leading-tight text-forest-800">
            {listing.name}
          </h3>
          <p className="mt-1 text-xs text-charcoal-500">
            {listing.city} · {listing.memberLevel}
            {listing.memberSince ? ` since ${listing.memberSince}` : ""}
          </p>
        </div>
      </div>
      <p className="border-t border-saddle-100 px-5 py-4 text-sm text-charcoal-700">
        {listing.description}
      </p>
      <ul className="flex flex-wrap gap-1.5 px-5 pb-5 text-xs" aria-label="Services">
        {listing.services.slice(0, 4).map((service) => (
          <li
            key={service}
            className="border border-saddle-200 bg-cream-100 px-2 py-1 text-charcoal-600"
          >
            {service}
          </li>
        ))}
      </ul>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(listing)}
        className="card lift flex h-full w-full flex-col text-left"
        aria-haspopup="dialog"
      >
        {body}
        <span className="mt-auto border-t border-saddle-100 px-5 py-3 text-sm font-semibold text-forest-700">
          View listing →
        </span>
      </button>
    );
  }

  return <div className="card lift flex h-full flex-col">{body}</div>;
}

export function ResourceRow({ resource }: { resource: Resource }) {
  return (
    <li className="card lift flex items-start gap-4 p-5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center border border-saddle-300 bg-cream-100 text-[0.625rem] font-bold tracking-wide text-saddle-700"
      >
        {resource.fileType}
      </span>
      <div className="flex-1">
        <p className="eyebrow">
          {resource.category} · {resource.fileSize}
        </p>
        <h3 className="mt-1 font-serif text-lg text-forest-800">{resource.title}</h3>
        <p className="mt-1 text-sm text-charcoal-600">{resource.description}</p>
        <p className="mt-2 text-xs text-charcoal-500">
          {resource.updatedAt} · {resource.audience}
        </p>
      </div>
      <a
        href={resource.href}
        className="btn btn-secondary shrink-0 self-center"
        aria-label={`Download ${resource.title} (${resource.fileType}, ${resource.fileSize})`}
      >
        Download
      </a>
    </li>
  );
}
