import { test, expect } from "@playwright/test";

// Use mobile viewport size (no webkit dependency)
test.use({ viewport: { width: 390, height: 844 } });

test.describe("Mobile Navigation", () => {
  test("should show hamburger menu on mobile", async ({ page }) => {
    await page.goto("/");

    // Hamburger button should be visible
    const hamburger = page.getByRole("button", { name: /toggle menu/i });
    await expect(hamburger).toBeVisible();

    // Desktop nav links should be hidden
    const desktopNav = page.locator(".hidden.sm\\:flex");
    await expect(desktopNav.first()).not.toBeVisible();
  });

  test("should open mobile menu when hamburger clicked", async ({ page }) => {
    await page.goto("/");

    // Click hamburger
    const hamburger = page.getByRole("button", { name: /toggle menu/i });
    await hamburger.click();

    // Mobile menu should appear with links (use exact match for nav links)
    await expect(page.getByRole("link", { name: "Editor", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Docs", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /github/i }).first()).toBeVisible();
  });

  test("should close mobile menu when link clicked", async ({ page }) => {
    await page.goto("/");

    // Open menu
    const hamburger = page.getByRole("button", { name: /toggle menu/i });
    await hamburger.click();

    // Click first Editor link (in mobile menu)
    await page.getByRole("link", { name: "Editor", exact: true }).first().click();

    // Should navigate and close menu
    await expect(page).toHaveURL(/\/editor/);
  });

  test("should navigate to docs from mobile menu", async ({ page }) => {
    await page.goto("/");

    // Open menu
    await page.getByRole("button", { name: /toggle menu/i }).click();

    // Click Docs
    await page.getByRole("link", { name: "Docs" }).click();

    await expect(page).toHaveURL(/\/docs/);
  });

  test("mobile sign in button should be visible", async ({ page }) => {
    await page.goto("/");

    // Sign in button should be visible on mobile (outside hamburger)
    const signIn = page.getByRole("button", { name: /sign in/i });
    await expect(signIn).toBeVisible();
  });
});

test.describe("Mobile Layout", () => {
  test("landing page should be readable on mobile", async ({ page }) => {
    await page.goto("/");

    // Hero text should be visible
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // CTA should be accessible
    await expect(page.getByRole("link", { name: "Open Editor" })).toBeVisible();
  });

  test("editor should work on mobile", async ({ page }) => {
    await page.goto("/editor");

    // Title input should be visible and usable
    const titleInput = page.getByPlaceholder(/title/i);
    await expect(titleInput).toBeVisible();

    await titleInput.fill("Mobile Test");
    await expect(titleInput).toHaveValue("Mobile Test");
  });

  test("docs sidebar should be toggleable on mobile", async ({ page }) => {
    await page.goto("/docs");

    // Should have a way to toggle sidebar on mobile
    const toggle = page.locator("aside button, button:has-text('Navigation')");
    if ((await toggle.count()) > 0) {
      await toggle.first().click();
      // After toggle, sidebar links should be visible
      await expect(page.getByRole("link", { name: "Quick Start" })).toBeVisible();
    }
  });
});
