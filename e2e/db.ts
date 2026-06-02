import "dotenv/config";
import { Pool } from "pg";

// Direct DB access used only as a safety net for the production-mutating
// pricing test: snapshot the edited row before, restore it exactly after.
// Uses raw pg (not the Prisma client, which the Playwright loader can't import).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function snapshotUSD() {
  const r = await pool.query(
    'SELECT "buyPrice", "sellPrice", "change" FROM "Currency" WHERE "code" = $1',
    ["USD"]
  );
  return r.rows[0] as { buyPrice: number; sellPrice: number; change: number } | undefined;
}

export async function restoreUSD(buyPrice: number, sellPrice: number, change: number) {
  await pool.query(
    'UPDATE "Currency" SET "buyPrice" = $1, "sellPrice" = $2, "change" = $3 WHERE "code" = $4',
    [buyPrice, sellPrice, change, "USD"]
  );
}

export async function disconnectDb() {
  await pool.end();
}
