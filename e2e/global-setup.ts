import { chromium } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

// Warm the Vercel functions + Neon DB before the suite runs. Free-tier Neon
// auto-suspends, and the first cold request can take many seconds — warming up
// here keeps the real tests from timing out on the first navigation.
export default async function globalSetup() {
  const baseURL = process.env.E2E_BASE_URL || "https://abushala.ly";
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });
  try {
    await loginAsAdmin(page);
    // Touch the DB-backed public page too.
    await page.goto("/", { waitUntil: "domcontentloaded" });
  } catch (e) {
    console.warn("[global-setup] warmup did not complete:", (e as Error).message);
  } finally {
    await browser.close();
  }
}
