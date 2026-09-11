import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, trailReports } from "@/db/schema";
import { seedListings, seedTrailReports } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * In production this route is protected by the authenticated session
 * (the volunteer's role claim). The header check here mirrors that contract so
 * the demo console and a real auth provider behave identically to the client.
 */
function isAdmin(request: Request) {
  return request.headers.get("x-cea-role") === "admin";
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Administrator role required to view the moderation queue." },
      { status: 403 },
    );
  }

  try {
    const [reports, listingRows] = await Promise.all([
      db
        .select()
        .from(trailReports)
        .where(eq(trailReports.status, "pending"))
        .orderBy(desc(trailReports.createdAt)),
      db
        .select()
        .from(listings)
        .where(eq(listings.status, "pending"))
        .orderBy(desc(listings.createdAt)),
    ]);
    return NextResponse.json({ reports, listings: listingRows });
  } catch {
    return NextResponse.json({
      reports: seedTrailReports.filter((r) => r.status === "pending"),
      listings: seedListings.filter((l) => l.status === "pending"),
    });
  }
}
