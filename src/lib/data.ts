import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  events,
  listings,
  membershipTiers,
  posts,
  resources,
  trailReports,
  trails,
} from "@/db/schema";
import {
  seedEvents,
  seedListings,
  seedPosts,
  seedResources,
  seedTiers,
  seedTrailReports,
  seedTrails,
  type CeaEvent,
  type Listing,
  type MembershipTier,
  type Post,
  type Resource,
  type Trail,
  type TrailReport,
} from "@/lib/types";

/**
 * Every read is wrapped so that a database hiccup degrades to the committed
 * seed content in `src/db/seed-data.json` instead of an error page. That keeps
 * the public site readable during volunteer-run deployments and lets the app
 * build in environments where Postgres is not yet reachable.
 */
async function safeQuery<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.warn("[cea] database read failed, using packaged content:", error);
    return fallback;
  }
}

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapTrail(row: typeof trails.$inferSelect): Trail {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    area: row.area,
    summary: row.summary,
    description: row.description,
    lengthMiles: row.lengthMiles,
    difficulty: row.difficulty,
    surface: row.surface,
    elevationFt: row.elevationFt,
    accessPoint: row.accessPoint,
    condition: row.condition as Trail["condition"],
    conditionNote: row.conditionNote,
    lastCheckedAt: toIso(row.lastCheckedAt),
    facilities: row.facilities ?? [],
    hasParking: row.hasParking,
    trailerParking: row.trailerParking,
    hasWater: row.hasWater,
    shade: row.shade,
    mapCoords: row.mapCoords ?? [],
    photoAlt: row.photoAlt,
    orderIndex: row.orderIndex,
  };
}

export async function getTrails(): Promise<Trail[]> {
  return safeQuery(seedTrails, async () => {
    const rows = await db.select().from(trails).orderBy(trails.orderIndex);
    return rows.length ? rows.map(mapTrail) : seedTrails;
  });
}

export async function getTrail(slug: string): Promise<Trail | null> {
  const all = await getTrails();
  return all.find((t) => t.slug === slug) ?? null;
}

export async function getTrailReports(
  status?: "pending" | "approved" | "rejected",
): Promise<TrailReport[]> {
  return safeQuery(seedTrailReports, async () => {
    const rows = status
      ? await db
          .select()
          .from(trailReports)
          .where(eq(trailReports.status, status))
          .orderBy(desc(trailReports.createdAt))
      : await db.select().from(trailReports).orderBy(desc(trailReports.createdAt));

    const mapped: TrailReport[] = rows.map((row) => ({
      id: row.id,
      trailSlug: row.trailSlug,
      trailName: row.trailName,
      reporterName: row.reporterName,
      reporterEmail: row.reporterEmail,
      condition: row.condition as TrailReport["condition"],
      note: row.note,
      riddenOn: row.riddenOn,
      status: row.status as TrailReport["status"],
      moderationNote: row.moderationNote,
      createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
    }));

    if (!mapped.length && !status) return seedTrailReports;
    return mapped;
  });
}

export async function getApprovedReports(): Promise<TrailReport[]> {
  const rows = await getTrailReports("approved");
  return rows.length
    ? rows
    : seedTrailReports.filter((r) => r.status === "approved");
}

export async function getListings(): Promise<Listing[]> {
  return safeQuery(seedListings, async () => {
    const rows = await db.select().from(listings).orderBy(listings.name);
    return rows.length ? (rows as Listing[]) : seedListings;
  });
}

export async function getApprovedListings(): Promise<Listing[]> {
  const rows = await getListings();
  return rows.filter((l) => l.status === "approved");
}

export async function getEvents(): Promise<CeaEvent[]> {
  return safeQuery(seedEvents, async () => {
    const rows = await db.select().from(events).orderBy(events.sortDate);
    return rows.length ? (rows as CeaEvent[]) : seedEvents;
  });
}

export async function getPosts(): Promise<Post[]> {
  return safeQuery(seedPosts, async () => {
    const rows = await db.select().from(posts).orderBy(desc(posts.sortDate));
    return rows.length ? (rows as Post[]) : seedPosts;
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  const all = await getPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getResources(): Promise<Resource[]> {
  return safeQuery(seedResources, async () => {
    const rows = await db.select().from(resources).orderBy(resources.category);
    return rows.length ? (rows as Resource[]) : seedResources;
  });
}

export async function getTiers(): Promise<MembershipTier[]> {
  return safeQuery(seedTiers, async () => {
    const rows = await db
      .select()
      .from(membershipTiers)
      .orderBy(membershipTiers.orderIndex);
    return rows.length ? (rows as MembershipTier[]) : seedTiers;
  });
}
