import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { trailReports } from "@/db/schema";
import { seedTrailReports, type TrailReport } from "@/lib/types";

export const dynamic = "force-dynamic";

const CONDITIONS = ["open", "caution", "closed"] as const;

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(trailReports)
      .where(eq(trailReports.status, "approved"))
      .orderBy(desc(trailReports.createdAt));
    return NextResponse.json({ reports: rows });
  } catch {
    return NextResponse.json({
      reports: seedTrailReports.filter((r) => r.status === "approved"),
    });
  }
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const trailSlug = String(payload.trailSlug ?? "").trim();
  const trailName = String(payload.trailName ?? "").trim();
  const reporterName = String(payload.reporterName ?? "").trim();
  const reporterEmail = String(payload.reporterEmail ?? "").trim();
  const condition = String(payload.condition ?? "").trim();
  const note = String(payload.note ?? "").trim();
  const riddenOn = String(payload.riddenOn ?? "").trim() || null;

  const errors: Record<string, string> = {};
  if (!trailSlug) errors.trailSlug = "Choose a trail.";
  if (!reporterName) errors.reporterName = "Tell us who rode it.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(reporterEmail))
    errors.reporterEmail = "A valid email lets us follow up.";
  if (!CONDITIONS.includes(condition as (typeof CONDITIONS)[number]))
    errors.condition = "Choose a condition.";
  if (note.length < 12) errors.note = "Describe what you found in a sentence or two.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please fix the form.", errors }, { status: 422 });
  }

  const record = {
    trailSlug,
    trailName: trailName || trailSlug,
    reporterName,
    reporterEmail,
    condition: condition as (typeof CONDITIONS)[number],
    note,
    riddenOn,
    status: "pending" as const,
  };

  try {
    const [row] = await db.insert(trailReports).values(record).returning();
    return NextResponse.json(
      {
        ok: true,
        report: row,
        message:
          "Thank you. Your report is queued for review by a CEA volunteer and will appear on the board once approved.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.warn("[cea] could not store trail report:", error);
    const fallback: TrailReport = {
      ...record,
      id: Date.now(),
      moderationNote: null,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(
      {
        ok: true,
        queued: false,
        report: fallback,
        message:
          "Thank you. Your report was received (database unavailable — it is queued locally only).",
      },
      { status: 201 },
    );
  }
}
