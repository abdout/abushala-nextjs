import { expect, type Page } from "@playwright/test";

export const ADMIN_EMAIL = "admin@abushala.ly";
export const ADMIN_PASSWORD = "123456";

/**
 * Log in as the admin and wait for the redirect to /admin.
 * Uses "domcontentloaded" everywhere — the DB-backed pages can be slow on a
 * cold Neon start, and waiting for the full "load" event tends to hang.
 */
export async function loginAsAdmin(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /تسجيل الدخول/ }).click();
  await page.waitForURL(/\/admin/, { timeout: 45_000, waitUntil: "commit" });
  await expect(page).toHaveURL(/\/admin/);
}
