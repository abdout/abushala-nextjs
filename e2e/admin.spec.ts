import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";
import { snapshotUSD, restoreUSD, disconnectDb } from "./db";

test.describe("admin auth & pricing (production)", () => {
  // Safety net: snapshot the currency the pricing test mutates and restore it
  // exactly afterwards, regardless of any UI flakiness on the live site.
  let usdSnapshot: { buyPrice: number; sellPrice: number; change: number } | null = null;

  test.beforeAll(async () => {
    try {
      const usd = await snapshotUSD();
      if (usd) usdSnapshot = { buyPrice: usd.buyPrice, sellPrice: usd.sellPrice, change: usd.change };
    } catch (e) {
      console.warn("[safety-net] snapshot failed:", (e as Error).message);
    }
  });

  test.afterAll(async () => {
    try {
      if (usdSnapshot) {
        await restoreUSD(usdSnapshot.buyPrice, usdSnapshot.sellPrice, usdSnapshot.change);
      }
      await disconnectDb();
    } catch (e) {
      console.warn("[safety-net] restore failed:", (e as Error).message);
    }
  });

  test("home page is public — exchange rates visible without login", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText("أسعار العملات").first()).toBeVisible();
  });

  test("password reset page is reachable", async ({ page }) => {
    // Public auth route — do NOT submit (would change a real password).
    await page.goto("/reset", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("نسيت كلمة المرور؟")).toBeVisible();
  });

  test("admin logs in and lands on /admin", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole("heading", { name: "لوحة التحكم" })).toBeVisible();
  });

  test("logout button works and returns to the public home page", async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole("button", { name: /تسجيل خروج/ }).click();
    await page.waitForURL((url) => new URL(url).pathname === "/", {
      timeout: 45_000,
      waitUntil: "commit",
    });
    await expect(page).not.toHaveURL(/\/(login|admin)/);
    // Logged-out navbar shows the login button.
    await expect(page.getByRole("link", { name: /تسجيل الدخول/ }).first()).toBeVisible();
  });

  test("admin edits a currency price; it persists and reflects publicly", async ({ page }) => {
    await loginAsAdmin(page);

    // First row's sell price (2nd numeric input). Editing sellPrice keeps the
    // computed `change` at 0 — no misleading indicator on the live site.
    const sellInput = page.locator("table tbody tr").first().locator("input[type='number']").nth(1);
    await sellInput.waitFor({ timeout: 30_000 });

    const original = await sellInput.inputValue();
    const newVal = (parseFloat(original) + 0.01).toFixed(2);

    await sellInput.fill(newVal);
    await page.getByRole("button", { name: /حفظ الكل/ }).click();
    await expect(page.getByText("تم حفظ أسعار العملات بنجاح")).toBeVisible();

    // Persists on /admin reload (re-fetched from the DB).
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(
      page.locator("table tbody tr").first().locator("input[type='number']").nth(1)
    ).toHaveValue(newVal);

    // Reflects on the public page. Scope to the visible desktop <table> — the
    // mobile cards carry the same text but are hidden at this viewport.
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("table").getByText(`${newVal} د.ل`).first()).toBeVisible();

    // Restore via the UI as well (afterAll guarantees the DB is clean regardless).
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    const restore = page.locator("table tbody tr").first().locator("input[type='number']").nth(1);
    await restore.waitFor({ timeout: 30_000 });
    await restore.fill(original);
    await page.getByRole("button", { name: /حفظ الكل/ }).click();
    await expect(page.getByText("تم حفظ أسعار العملات بنجاح")).toBeVisible();
  });
});
