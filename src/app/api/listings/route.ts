import { NextResponse } from "next/server";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { seedListings, type Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(listings);
    return NextResponse.json({ listings: rows });
  } catch {
    return NextResponse.json({ listings: seedListings });
  }
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const category = String(payload.category ?? "").trim();
  const city = String(payload.city ?? "").trim();
  const description = String(payload.description ?? "").trim();
  const contactName = String(payload.contactName ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim() || null;
  const website = String(payload.website ?? "").trim() || null;
  const region = String(payload.region ?? "").trim() || "Butte County";
  const services = Array.isArray(payload.services)
    ? payload.services.map((s) => String(s).trim()).filter(Boolean).slice(0, 8)
    : [];

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Enter the business name.";
  if (!category) errors.category = "Choose a category.";
  if (!city) errors.city = "Which town are you in?";
  if (description.length < 30)
    errors.description = "Give riders a couple of sentences (30 characters minimum).";
  if (!contactName) errors.contactName = "Who should we contact?";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    errors.email = "A valid email is required.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please fix the form.", errors }, { status: 422 });
  }

  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || `listing-${Date.now()}`;

  const record = {
    slug,
    name,
    category,
    region,
    description,
    services,
    phone,
    email,
    website,
    city,
    memberLevel: "Pending business member",
    memberSince: null,
    status: "pending" as const,
    featured: false,
  };

  try {
    const [row] = await db.insert(listings).values(record).returning();
    return NextResponse.json(
      {
        ok: true,
        listing: row,
        message:
          "Application received. A CEA volunteer reviews new listings weekly; you will get an email when yours goes live.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.warn("[cea] could not store listing:", error);
    const fallback: Listing = {
      ...record,
      id: Date.now(),
      memberSince: null,
      status: "pending",
      featured: false,
    };
    return NextResponse.json(
      {
        ok: true,
        queued: false,
        listing: fallback,
        message:
          "Application received (database unavailable — please also email info@chicoequestrianassociation.org).",
      },
      { status: 201 },
    );
  }
}
