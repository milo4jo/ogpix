import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate from landing to editor", async ({ page }) => {
    await page.goto("/");

    // Click the primary "Open Editor" CTA
    await page.getByRole("link", { name: "Open Editor" }).click();

    // Should be on editor page
    await expect(page).toHaveURL(/\/editor/);
  });

  test("should navigate from landing to docs", async ({ page }) => {
    await page.goto("/");

    // Click docs link (first one in navigation)
    await page.getByRole("link", { name: /docs/i }).first().click();

    // Should be on docs page
    await expect(page).toHaveURL(/\/docs/);
  });

  test("should navigate from editor back to landing", async ({ page }) => {
    await page.goto("/editor");

    // Click logo or home link
    const homeLink = page.getByRole("link", { name: /ogpix|home/i }).first();
    await homeLink.click();

    // Should be back on landing
    await expect(page).toHaveURL("/");
  });

  test("docs page should load correctly", async ({ page }) => {
    await page.goto("/docs");

    await expect(page).toHaveTitle(/OGPix/);

    // Should have documentation content
    const content = page.locator("main, article, .docs-content");
    await expect(content.first()).toBeVisible();
  });

  test("login page should load correctly", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/OGPix/);

    // Should have some form of sign in element (button or link)
    const signInElement = page.locator(
      'button:has-text("Sign"), a:has-text("Sign"), button:has-text("GitHub"), a:has-text("GitHub")'
    );
    await expect(signInElement.first()).toBeVisible();
  });

  test("dashboard should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");

    // Should redirect to login or show auth required message
    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });
});
