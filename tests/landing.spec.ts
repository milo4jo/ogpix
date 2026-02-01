import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load and display hero section", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/OGPix/);

    // Check hero heading exists
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");

    // Check key navigation elements (use first() since there may be multiple in nav + footer)
    await expect(page.getByRole("link", { name: /docs/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /github/i }).first()).toBeVisible();
  });

  test("should have CTA to open editor", async ({ page }) => {
    await page.goto("/");

    // Look for the primary "Open Editor" CTA button
    const editorLink = page.getByRole("link", { name: "Open Editor" });
    await expect(editorLink).toBeVisible();
  });

  test("should display preview component", async ({ page }) => {
    await page.goto("/");

    // Preview area should exist (either loading spinner or image)
    // The OG preview is async - check for the container or a visible state
    const previewArea = page.locator('img[alt="OG Preview"], .animate-pulse, [class*="aspect-"]');
    await expect(previewArea.first()).toBeVisible({ timeout: 10000 });
  });
});
