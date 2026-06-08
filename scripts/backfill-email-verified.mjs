/**
 * One-off migration: grandfather existing accounts as email-verified.
 *
 * Email verification is now enforced at login (REQUIRE_EMAIL_VERIFICATION).
 * Accounts created before this feature have emailVerified = NULL and would be
 * locked out. This marks all such existing users as verified so only NEW
 * sign-ups go through the verification flow. Idempotent — safe to re-run.
 *
 *   node scripts/backfill-email-verified.mjs
 */
import { config } from "dotenv";
config();
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const before = await pool.query(
  'SELECT count(*)::int AS c FROM "User" WHERE "emailVerified" IS NULL'
);
console.log(`Users to backfill (emailVerified IS NULL): ${before.rows[0].c}`);

const res = await pool.query(
  'UPDATE "User" SET "emailVerified" = now() WHERE "emailVerified" IS NULL'
);
console.log(`Backfilled ${res.rowCount} user(s).`);

await pool.end();
