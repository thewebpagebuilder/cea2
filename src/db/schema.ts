import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * CEA data model.
 *
 * Volunteer-facing rules encoded here:
 *  - anything submitted by the public (trail reports, directory listings)
 *    arrives with status = "pending" and is invisible until an admin approves it.
 *  - every row carries the timestamps the moderation queue needs.
 */

export const trails = pgTable("trails", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  area: varchar("area", { length: 80 }).notNull(), // Upper Park / Lower Park / Rim
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  lengthMiles: varchar("length_miles", { length: 24 }).notNull(),
  difficulty: varchar("difficulty", { length: 24 }).notNull(), // Easy / Moderate / Strenuous
  surface: varchar("surface", { length: 80 }).notNull(),
  elevationFt: integer("elevation_ft").notNull().default(0),
  accessPoint: varchar("access_point", { length: 140 }).notNull(),
  /** Current rider-reported status: open | caution | closed */
  condition: varchar("condition", { length: 20 }).notNull().default("open"),
  conditionNote: text("condition_note"),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  /** Facilities available at the staging area. */
  facilities: jsonb("facilities").$type<string[]>().notNull().default([]),
  hasParking: boolean("has_parking").notNull().default(true),
  trailerParking: boolean("trailer_parking").notNull().default(false),
  hasWater: boolean("has_water").notNull().default(false),
  shade: boolean("shade").notNull().default(false),
  /** Coordinates in the map's own 1000x700 viewBox space. */
  mapCoords: jsonb("map_coords").$type<[number, number][]>().notNull(),
  photoAlt: text("photo_alt").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const trailReports = pgTable("trail_reports", {
  id: serial("id").primaryKey(),
  trailSlug: varchar("trail_slug", { length: 80 }).notNull(),
  trailName: varchar("trail_name", { length: 120 }).notNull(),
  reporterName: varchar("reporter_name", { length: 120 }).notNull(),
  reporterEmail: varchar("reporter_email", { length: 160 }).notNull(),
  condition: varchar("condition", { length: 20 }).notNull(), // open | caution | closed
  note: text("note").notNull(),
  riddenOn: varchar("ridden_on", { length: 20 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | approved | rejected
  moderationNote: text("moderation_note"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 90 }).notNull().unique(),
  name: varchar("name", { length: 140 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  region: varchar("region", { length: 60 }).notNull(),
  description: text("description").notNull(),
  services: jsonb("services").$type<string[]>().notNull().default([]),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 160 }),
  website: varchar("website", { length: 200 }),
  city: varchar("city", { length: 80 }).notNull(),
  memberLevel: varchar("member_level", { length: 40 })
    .notNull()
    .default("Member"),
  memberSince: varchar("member_since", { length: 20 }),
  status: varchar("status", { length: 20 }).notNull().default("approved"), // pending | approved | rejected
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 90 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  /** Human-readable date blocks, e.g. "Tuesday, June 10, 2026". */
  dateLabel: varchar("date_label", { length: 80 }).notNull(),
  dayNum: varchar("day_num", { length: 3 }).notNull(),
  monthShort: varchar("month_short", { length: 4 }).notNull(),
  year: varchar("year", { length: 5 }).notNull(),
  timeLabel: varchar("time_label", { length: 80 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  summary: text("summary").notNull(),
  cost: varchar("cost", { length: 60 }),
  imageAlt: text("image_alt").notNull(),
  sortDate: varchar("sort_date", { length: 10 }).notNull(), // YYYY-MM-DD
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 90 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  dateLabel: varchar("date_label", { length: 40 }).notNull(),
  sortDate: varchar("sort_date", { length: 10 }).notNull(),
  readingMinutes: integer("reading_minutes").notNull().default(3),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  fileType: varchar("file_type", { length: 12 }).notNull(), // PDF | DOCX | XLSX
  fileSize: varchar("file_size", { length: 20 }).notNull(),
  href: varchar("href", { length: 240 }).notNull(),
  updatedAt: varchar("updated_at", { length: 40 }).notNull(),
  audience: varchar("audience", { length: 60 }).notNull(),
});

export const membershipTiers = pgTable("membership_tiers", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  price: integer("price").notNull(),
  cadence: varchar("cadence", { length: 20 }).notNull().default("/ year"),
  blurb: text("blurb").notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  orderIndex: integer("order_index").notNull().default(0),
});
