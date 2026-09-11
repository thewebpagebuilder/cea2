import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, trailReports } from "@/db/schema";

export const dynamic = "force-dynamic";

const ACTIONS = ["approved", "rejected"] as const;

export async function PATCH(request: Request) {
  if (request.headers.get("x-cea-role") !== "admin") {
    return NextResponse.json(
      { error: "Administrator role required to moderate." },
      { status: 403 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const kind = String(payload.kind ?? "");
  const id = Number(payload.id);
  const action = String(payload.action ?? "") as (typeof ACTIONS)[number];
  const moderationNote = String(payload.moderationNote ?? "").trim() || null;

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "A valid id is required." }, { status: 422 });
  }
  if (!ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Action must be approve or reject." }, { status: 422 });
  }
  if (kind !== "report" && kind !== "listing") {
    return NextResponse.json({ error: "Unknown moderation type." }, { status: 422 });
  }

  try {
    if (kind === "report") {
      await db
        .update(trailReports)
        .set({ status: action, moderationNote })
        .where(eq(trailReports.id, id));
    } else {
      await db
        .update(listings)
        .set({
          status: action,
          memberLevel:
            action === "approved" ? "Business Member" : "Application declined",
        })
        .where(eq(listings.id, id));
    }
    return NextResponse.json({
      ok: true,
      message:
        action === "approved"
          ? "Approved and published."
          : "Rejected and removed from the queue.",
    });
  } catch (error) {
    console.warn("[cea] moderation failed:", error);
    return NextResponse.json(
      { error: "Could not save that decision. The database may be unavailable." },
      { status: 503 },
    );
  }
}
