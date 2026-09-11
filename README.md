# Chico Equestrian Association — Community Platform

A rebuild of the CEA website as a modern, volunteer-maintainable community
resource: an interactive Bidwell Park trail guide, rider-reported trail
conditions with moderation, a searchable equestrian business directory, and an
event/news/resources hub.

## Stack

- **Next.js 16 (App Router) + React 19** — server components for content, client
  components only where interaction is required.
- **Tailwind CSS v4** — design tokens live in `src/app/globals.css` under
  `@theme`, so the palette is edited in one place.
- **PostgreSQL + Drizzle ORM** — schema in `src/db/schema.ts`, client in
  `src/db/index.ts`.
- **No third-party map tiles, no webfonts, no stock imagery.**

## Getting started

```bash
npm install
cp .env.example .env            # DATABASE_URL
npx drizzle-kit push            # create/update tables
node scripts/seed.mjs           # idempotent seed from src/db/seed-data.json
npm run dev
```

## Content model

| Table | Purpose |
| --- | --- |
| `trails` | Route geometry (map coordinates), condition, facilities, access points |
| `trail_reports` | Rider submissions with `pending` / `approved` / `rejected` status |
| `listings` | Business directory entries with an approval workflow |
| `events`, `posts` | Calendar and news, date-sorted |
| `resources` | Downloadable documents with audience tags |
| `membership_tiers` | Dues, benefits, featured flag |

Every public submission arrives as `pending` and is invisible until a CEA admin
approves it. The moderation console lives at `/admin`.

## Routes

`/` · `/trails` · `/trails/[slug]` · `/trails/conditions` · `/safety` ·
`/directory` · `/directory/submit` · `/events` · `/news` · `/news/[slug]` ·
`/resources` · `/membership` · `/get-involved` · `/about` · `/about/board` ·
`/sponsors` · `/contact` · `/admin` · `/design`

`/design` is the in-app handover document: sitemap, architecture
recommendation, component specs, permission matrix, accessibility and
performance notes.

## API

| Route | Method | Notes |
| --- | --- | --- |
| `/api/health` | GET | Database ping |
| `/api/trail-conditions` | GET / POST | Approved reports; new reports saved as `pending` |
| `/api/listings` | GET / POST | Directory; new applications saved as `pending` |
| `/api/admin/queue` | GET | Pending reports and listings — requires admin role |
| `/api/admin/moderate` | PATCH | Approve or reject — requires admin role |

The admin routes check the caller's role header. In production that header is
replaced by the authenticated session claim (Auth.js, Supabase, or the CMS
identity); the client code does not change.

## Design system

- **Colour** — forest greens, saddle browns, cream, charcoal, with brass as the
  single accent. See the palette table on `/design`.
- **Type** — serif stack for headings (tradition, stability), system sans for
  body and UI at 16px / 1.65.
- **Motion** — one-time fade-and-rise on scroll (`.reveal`), a 3px hover lift
  (`.lift`), and a 200ms dialog transition. All transform/opacity only, all
  disabled under `prefers-reduced-motion`.
- **Accessibility** — skip link, visible focus rings, labelled landmarks,
  semantic tables, focus-trapped dialogs with focus restoration, keyboard
  navigable map via the synced trail list, `aria-live` filter counts.
- **Performance** — reserved aspect-ratio photo frames (zero CLS), no tile
  requests, no font downloads, lazy reveal observer unobserves after firing.

## Photography

No stock photography is used. Every image slot is a labelled brief (`PhotoFrame`
component) naming the authentic local photograph still to be captured: riders on
Bidwell Park trails, the CEA Arena, and community events. Frames reserve exact
space, so dropping in WebP/AVIF images later causes no layout shift.

## Handover

CEA owns the code, the database, and all content. Records are exportable as JSON
(`src/db/seed-data.json` is both the seed and a readable snapshot), and the
frontend never depends on a proprietary page builder.
