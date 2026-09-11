/**
 * One-shot idempotent seed for the CEA database.
 *
 * Usage (after `npx drizzle-kit push`):
 *   node scripts/seed.mjs
 *
 * It reads src/db/seed-data.json, skips work when the tables are already
 * populated, and inserts with ON CONFLICT DO NOTHING so a volunteer can safely
 * re-run it after editing the JSON in a pull request.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(here, "..", "src", "db", "seed-data.json");

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const data = JSON.parse(await readFile(dataPath, "utf8"));
const pool = new pg.Pool({ connectionString });

async function rowCount(sql) {
  const { rows } = await pool.query(sql);
  return Number(rows[0]?.count ?? 0);
}

const JSONB_COLUMNS = new Set(["map_coords", "facilities", "services", "benefits"]);

/** camelCase seed keys -> snake_case Drizzle column names. */
const snake = (key) => key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

async function insertMany(table, rows, conflictTarget) {
  if (!rows.length) return 0;
  const columns = Object.keys(rows[0]).map(snake);
  let inserted = 0;
  for (const row of rows) {
    const values = Object.entries(row).map(([key, value]) =>
      JSONB_COLUMNS.has(snake(key)) && value !== null
        ? JSON.stringify(value)
        : (value ?? null),
    );
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    // Drizzle creates snake_case column names; quote them for safety.
    const sql = `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(", ")})
                 VALUES (${placeholders})
                 ON CONFLICT ${conflictTarget} DO NOTHING`;
    const res = await pool.query(sql, values);
    inserted += res.rowCount ?? 0;
  }
  return inserted;
}

try {
  const existingTrails = await rowCount("SELECT COUNT(*)::int AS count FROM trails");
  if (existingTrails > 0) {
    console.log(
      `Database already seeded (${existingTrails} trails). Skipping. Delete rows first to reseed.`,
    );
    process.exit(0);
  }

  const summary = {
    trails: await insertMany("trails", data.trails, "(slug)"),
    trailReports: await insertMany("trail_reports", data.trailReports, "(id)"),
    listings: await insertMany("listings", data.listings, "(slug)"),
    events: await insertMany("events", data.events, "(slug)"),
    posts: await insertMany("posts", data.posts, "(slug)"),
    resources: await insertMany("resources", data.resources, "(id)"),
    membershipTiers: await insertMany("membership_tiers", data.membershipTiers, "(slug)"),
  };

  console.log("CEA seed complete:", summary);
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
