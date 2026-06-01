import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

// 375px viewport (see playwright.config.ts "mobile" project).
test.describe("mobile responsiveness (production)", () => {
  test("home currency prices render as cards with no horizontal overflow", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Mobile card layout shows these per-currency labels (table is sm+ only).
    await expect(page.getByText("سعر الشراء").first()).toBeVisible();
    await expect(page.getByText("سعر البيع").first()).toBeVisible();

    // No horizontal scroll at 375px.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
