import { defineConfig } from "@playwright/test";

// E2E suite runs against the live production site by default.
// Override with E2E_BASE_URL to point elsewhere (e.g. a local server).
const baseURL = process.env.E2E_BASE_URL || "https://abushala.ly";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 2,
  reporter: [["list"]],
  use: {
    baseURL,
    locale: "ar",
    navigationTimeout: 45_000,
    actionTimeout: 20_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testMatch: /admin\.spec\.ts/,
      use: { browserName: "chromium", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      testMatch: /mobile\.spec\.ts/,
      use: { browserName: "chromium", viewport: { width: 375, height: 812 } },
    },
  ],
});
