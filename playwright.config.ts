import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Test Configuration for OGPix
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Run tests sequentially to avoid overwhelming the OG API
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry once locally for flaky API tests
  workers: 1, // Single worker to prevent race conditions with OG image generation
  reporter: process.env.CI ? "github" : "html",
  timeout: 30000, // 30s per test

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Only test Chromium for speed - add others for full coverage later */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Start Next.js dev server before tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
