import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Design System, IA & Handover Notes",
  description:
    "Information architecture, component specs, permission model, accessibility and performance decisions for the CEA website rebuild.",
};

const sitemap = [
  {
    group: "Home & orientation",
    pages: [
      { name: "Homepage", href: "/", note: "Hero, live trail status, events, directory, news" },
      { name: "Contact", href: "/contact", note: "Mail, phone, trail line, arena directions" },
    ],
  },
  {
    group: "Ride",
    pages: [
      { name: "Interactive Trail Guide", href: "/trails", note: "Filtered map + route cards" },
      { name: "Trail Detail (12 routes)", href: "/trails/horseshoe-lake-loop", note: "Ground notes, facts, rider reports" },
      { name: "Trail Conditions Board", href: "/trails/conditions", note: "Approved reports + submission modal" },
      { name: "Safety & Etiquette", href: "/safety", note: "Passing protocol, kit, emergencies" },
    ],
  },
  {
    group: "Community",
    pages: [
      { name: "Business & Member Directory", href: "/directory", note: "Search, filter, detail modal" },
      { name: "Submit a Listing", href: "/directory/submit", note: "Form → moderation queue" },
      { name: "Events", href: "/events", note: "Meetings, clinics, work days, rides" },
      { name: "News", href: "/news", note: "Committee updates and trail notes" },
      { name: "News Article", href: "/news/2026-membership-renewals-are-open", note: "Long-form article template" },
      { name: "Resources & Downloads", href: "/resources", note: "Forms, bylaws, checklists" },
    ],
  },
  {
    group: "Association",
    pages: [
      { name: "Membership / Join", href: "/membership", note: "Four tiers, benefits, FAQ" },
      { name: "Get Involved", href: "/get-involved", note: "Six volunteer roles, hours log" },
      { name: "Our Story", href: "/about", note: "History timeline and values" },
      { name: "Board & Volunteers", href: "/about/board", note: "Officers and committees" },
      { name: "Sponsors & Partners", href: "/sponsors", note: "Sponsorship levels, partners" },
      { name: "Volunteer Admin Console", href: "/admin", note: "Moderation queues, permissions" },
      { name: "Design System & IA", href: "/design", note: "This page — handover documentation" },
    ],
  },
];

const palette = [
  { name: "Forest 700", hex: "#26472f", token: "bg-forest-700", use: "Primary surfaces, header, buttons" },
  { name: "Forest 800", hex: "#1e3727", token: "bg-forest-800", use: "Hero band, footer, headings" },
  { name: "Saddle 700", hex: "#6f4428", token: "bg-saddle-700", use: "Secondary CTA, western accents" },
  { name: "Brass 500", hex: "#b08d2f", token: "text-brass-500", use: "Focus accents, status: ride with care" },
  { name: "Cream 50", hex: "#fdfbf6", token: "bg-cream-50", use: "Page background" },
  { name: "Charcoal 800", hex: "#232724", token: "text-charcoal-800", use: "Body copy — 12.9:1 on cream" },
];

const components = [
  {
    title: "Homepage",
    spec: [
      "Hero: serif headline capped at ~60 characters, dual CTAs (Become a Member / Explore Trails), and a live open/caution/closed count pulled from the trail table.",
      "Trail Guide preview embeds the same map component used on /trails, in compact mode, so the homepage is a working tool rather than a teaser.",
      "Events, Directory, and News sections are three-up grids that cap at three items and link to their index pages — no carousels, no infinite scroll.",
      "Every section reveals once on first scroll (opacity + 14px translate) and never re-animates.",
    ],
  },
  {
    title: "Interactive Trail Guide",
    spec: [
      "Custom SVG map of Bidwell Park (no third-party tile service): 1000×700 viewBox, park boundary, Big Chico Creek, Upper Park Road, seven staging areas.",
      "Routes are polylines coloured by condition — forest green (open), brass (ride with care), brick (closed) — with a transparent 18px hit target for touch.",
      "Filters: condition, trailer parking, water for horses, difficulty. Counts announce politely via aria-live.",
      "Zoom and pan via pointer drag and explicit + / − / Reset buttons; strokes use non-scaling-stroke so line weight is stable at any zoom.",
      "The trail list beside the map is the keyboard path: tab to a route, press Enter, and the map selects and zooms-labelled it. No raw map shortcut text is ever exposed to assistive tech.",
    ],
  },
  {
    title: "Business Directory",
    spec: [
      "Sticky filter bar: free-text search across name, category, city, description, and services; category, region, and service selects.",
      "Results render as equal-height cards with a lift on hover (3px translate + soft shadow, transform-only).",
      "Selecting a card opens an accessible modal with the full listing, contact links, and the CEA non-endorsement note.",
      "Empty state invites unlisted businesses to apply instead of dead-ending.",
    ],
  },
];

export default function DesignPage() {
  return (
    <>
      <PageHero
        eyebrow="Handover documentation"
        title="Design system, IA, and how this is built"
        lede="Everything a volunteer editor or the next developer needs: the sitemap, the palette and type scale, the component specs, the permission model, and the performance and accessibility decisions behind them."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Design system", href: "/design" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="btn btn-saddle">
            Try the admin console
          </Link>
          <Link
            href="/trails"
            className="btn border-cream-100 text-cream-50 hover:bg-forest-700"
          >
            Open the trail guide
          </Link>
        </div>
      </PageHero>

      {/* IA */}
      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Information architecture</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            Nineteen pages, four groups
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal-600">
            The sitemap replaces raw text links with four navigable groups:
            orientation, Ride, Community, and Association. Trail detail and news
            article pages are templates driven by database records, so adding a
            route or a post never means adding a page by hand.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sitemap.map((group, i) => (
            <Reveal key={group.group} delay={(i % 2) * 80}>
              <div className="card h-full p-6">
                <h3 className="font-serif text-xl text-forest-800">{group.group}</h3>
                <ul className="mt-4 space-y-3">
                  {group.pages.map((page) => (
                    <li key={page.href}>
                      <Link href={page.href} className="group block">
                        <span className="text-sm font-semibold text-forest-800 group-hover:underline">
                          {page.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-charcoal-500">
                          {page.note}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Architecture recommendation</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Next.js + Postgres, with a headless CMS layer
            </h2>
            <p className="mt-4 text-charcoal-700">
              We recommend the Next.js and Tailwind route over a WordPress block
              theme. The association&apos;s real requirements — a filtered map,
              a moderated submissions queue, and a searchable directory — are
              application features, not page features. A block theme would put
              CEA back on a plugin treadmill for exactly the parts that matter,
              and would hand the data to a third-party database CEA does not
              control.
            </p>
            <p className="mt-4 text-charcoal-700">
              Volunteers still get a friendly editor. Sanity or Strapi sits in
              front of the same records this site reads: a rider&apos;s dream
              schema for events, news, resources, trails, and listings, with
              role-based publishing. Nothing on the public site changes when the
              CMS is swapped, because the site reads from its own database.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-charcoal-700">
              <li>— Ownership: CEA holds the code, the database, and every asset.</li>
              <li>— Portability: content is rows in Postgres, exportable as JSON.</li>
              <li>— Cost: static-hosted frontend, one small Postgres instance.</li>
              <li>— Volunteer safety: publish, schedule, and revert without code.</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Record types</h3>
            <dl className="mt-4 divide-y divide-saddle-100 text-sm">
              {[
                ["trails", "Route geometry, condition, facilities, access"],
                ["trail_reports", "Public submissions with moderation status"],
                ["listings", "Directory entries with approval workflow"],
                ["events / posts", "Calendar and news, date-sorted"],
                ["resources", "Downloadable documents with audience tags"],
                ["membership_tiers", "Dues, benefits, and featured flag"],
              ].map(([term, desc]) => (
                <div key={term} className="flex justify-between gap-4 py-3">
                  <dt className="font-mono text-xs font-semibold text-forest-800">{term}</dt>
                  <dd className="text-right text-charcoal-600">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Visual language */}
      <section className="container-cea py-16">
        <div className="mb-8 border-t-2 border-forest-800 pt-5">
          <p className="eyebrow">Visual language</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-800">
            Earth tones, serif headings, no decoration tax
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Palette</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {palette.map((swatch) => (
                <li key={swatch.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 shrink-0 border border-charcoal-800/15"
                    style={{ background: swatch.hex }}
                  />
                  <span className="text-xs">
                    <span className="block font-semibold text-forest-800">
                      {swatch.name} · {swatch.hex}
                    </span>
                    <span className="block text-charcoal-500">{swatch.use}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Typography</h3>
            <p className="mt-3 text-sm text-charcoal-600">
              Headings use a bookish serif stack (Iowan Old Style → Palatino →
              Georgia) for tradition and stability. Body copy and all UI use the
              system sans stack at a 1rem base with 1.65 line height, which keeps
              contrast and legibility high for older members on small screens.
            </p>
            <div className="mt-5 space-y-3 border-t border-saddle-100 pt-4">
              <p className="font-serif text-3xl text-forest-800">Aa — Heading serif</p>
              <p className="text-base text-charcoal-700">
                Aa — Body sans, 16px / 1.65, charcoal on cream
              </p>
              <p className="text-xs font-bold tracking-[0.16em] text-saddle-700 uppercase">
                Aa — Eyebrow, 12px, tracked out
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Motion</h3>
            <p className="mt-3 text-sm text-charcoal-600">
              Three effects only: a one-time fade-and-rise on scroll, a 3px card
              lift with a soft shadow on hover, and a 200ms dialog transition.
              All are transform and opacity, so they never trigger layout.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Accessibility</h3>
            <p className="mt-3 text-sm text-charcoal-600">
              WCAG 2.1 AA target: skip link, visible focus rings, labelled
              landmarks, semantic tables with scope, dialogs with focus traps and
              focus restoration, and every animation gated behind
              prefers-reduced-motion.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-serif text-xl text-forest-800">Performance</h3>
            <p className="mt-3 text-sm text-charcoal-600">
              No map tile network, no webfont download, and no client-side image
              library. Placeholder frames reserve exact aspect ratios so real
              WebP/AVIF photography drops in with zero CLS.
            </p>
          </div>
        </div>
      </section>

      {/* Component specs */}
      <section className="border-t border-saddle-200 bg-cream-100 py-16">
        <div className="container-cea">
          <div className="mb-8 border-t-2 border-forest-800 pt-5">
            <p className="eyebrow">Component descriptions</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              Homepage, Trail Guide, Directory
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {components.map((component, i) => (
              <Reveal key={component.title} delay={i * 80}>
                <div className="card h-full p-6">
                  <h3 className="font-serif text-xl text-forest-800">
                    {component.title}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-charcoal-600">
                    {component.spec.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span aria-hidden="true" className="text-forest-600">
                          ▸
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photography + roles */}
      <section className="container-cea py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Photography brief</p>
            <h2 className="mt-2 font-serif text-3xl text-forest-800">
              No stock. Shoot the park you ride.
            </h2>
            <p className="mt-4 text-charcoal-700">
              Every image slot on this site is an explicit brief for an
              authentic, high-quality photograph of local equestrians, Bidwell
              Park trails, and CEA community events. The frames are labelled in
              place so a volunteer photographer can read the shot list straight
              off the page.
            </p>
            <p className="mt-4 text-charcoal-700">
              Shoot in the morning or the last hour of light, keep the horizon
              level, and favour a rider doing something real — crossing the
              creek, brushing a trail, tying at the rail. Export WebP with a
              JPEG fallback, 1600px on the long edge, and keep the alt text that
              ships with each frame.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-charcoal-700">
              <li>— Portraits: officers and volunteers, outdoors, available light.</li>
              <li>— Trails: one establishing frame per route, shot where the trail is recognisable.</li>
              <li>— Events: meetings, work days, the pleasure ride, the scholarship award.</li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-serif text-2xl text-forest-800">
              User & permission structure
            </h2>
            <p className="mt-3 text-sm text-charcoal-600">
              Four roles, enforced on the server. The full capability matrix is
              on the admin console, where you can switch roles and watch the
              interface change.
            </p>
            <ul className="mt-5 space-y-4">
              {[
                ["Visitor", "Reads everything public. Can contact CEA, but cannot submit reports or listings."],
                ["Registered Rider", "Current member. Submits trail condition reports into the moderation queue."],
                ["Business Owner", "Manages their own directory listing and applies for changes."],
                ["CEA Admin", "Approves or rejects submissions; publishes events, news, and resources."],
              ].map(([role, body]) => (
                <li key={role} className="border-l-4 border-l-forest-700 pl-4">
                  <p className="text-sm font-semibold text-forest-800">{role}</p>
                  <p className="mt-1 text-sm text-charcoal-600">{body}</p>
                </li>
              ))}
            </ul>
            <Link href="/admin" className="btn btn-primary mt-6">
              See the full matrix
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
