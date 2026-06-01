import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("admin auth & pricing (production)", () => {
  test("password reset page is reachable", async ({ page }) => {
    // Public auth route — do NOT submit (would change a real password).
    await page.goto("/reset", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("نسيت كلمة المرور؟")).toBeVisible();
  });

  test("admin logs in and lands on /admin", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole("heading", { name: "لوحة التحكم" })).toBeVisible();
  });

  test("logout button works and returns to /login", async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole("button", { name: /تسجيل خروج/ }).click();
    await page.waitForURL(/\/login/, { timeout: 45_000, waitUntil: "commit" });
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin edits a currency price; it persists, reflects publicly, and is restored", async ({
    page,
  }) => {
    await loginAsAdmin(page);

    // First row's sell price (2nd numeric input in the row). Editing sellPrice
    // keeps the computed `change` at 0 — no misleading indicator on the live site.
    const firstRow = page.locator("table tbody tr").first();
    const sellInput = firstRow.locator("input[type='number']").nth(1);
    await sellInput.waitFor({ timeout: 30_000 });

    const original = await sellInput.inputValue();
    const newVal = (parseFloat(original) + 0.01).toFixed(2);
    let mutated = false;

    try {
      await sellInput.fill(newVal);
      await page.getByRole("button", { name: /حفظ الكل/ }).click();
      mutated = true;
      // Toast is best-effort (auto-dismisses); persistence reload is the real proof.
      await expect
        .soft(page.getByText("تم حفظ أسعار العملات بنجاح"))
        .toBeVisible();

      // Persistence: reload /admin and confirm the new value stuck in the DB.
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(
        page.locator("table tbody tr").first().locator("input[type='number']").nth(1)
      ).toHaveValue(newVal);

      // Reflects on the public page.
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(page.getByText(`${newVal} د.ل`).first()).toBeVisible();
    } finally {
      // Always restore so production data is left unchanged.
      if (mutated) {
        await page.goto("/admin", { waitUntil: "domcontentloaded" });
        const restore = page
          .locator("table tbody tr")
          .first()
          .locator("input[type='number']")
          .nth(1);
        await restore.waitFor({ timeout: 30_000 });
        await restore.fill(original);
        await page.getByRole("button", { name: /حفظ الكل/ }).click();
        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(
          page.locator("table tbody tr").first().locator("input[type='number']").nth(1)
        ).toHaveValue(original);
      }
    }
  });
});
