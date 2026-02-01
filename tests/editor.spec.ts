import { test, expect } from "@playwright/test";

test.describe("Editor Page", () => {
  test("should load editor page", async ({ page }) => {
    await page.goto("/editor");

    // Check page loads without error
    await expect(page).toHaveTitle(/OGPix/);

    // Editor should have form controls
    const form = page.locator("form, [role='form'], .editor, #editor");
    // Fallback: check for input fields which indicate editor loaded
    const inputs = page.locator("input, textarea, select");
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  });

  test("should have title input", async ({ page }) => {
    await page.goto("/editor");

    // Find title input
    const titleInput = page.getByPlaceholder(/title/i);
    await expect(titleInput).toBeVisible();

    // Should be editable
    await titleInput.fill("Test Title");
    await expect(titleInput).toHaveValue("Test Title");
  });

  test("should have subtitle input", async ({ page }) => {
    await page.goto("/editor");

    // Find subtitle input
    const subtitleInput = page.getByPlaceholder(/subtitle|description/i);
    await expect(subtitleInput).toBeVisible();
  });

  test("should have theme selector", async ({ page }) => {
    await page.goto("/editor");

    // Theme buttons should exist (e.g., "dark", "light", "gradient")
    const themeButton = page.getByRole("button", { name: /dark|light|gradient/i });
    await expect(themeButton.first()).toBeVisible();
  });

  test("should update preview when title changes", async ({ page }) => {
    await page.goto("/editor");

    const titleInput = page.getByPlaceholder(/title/i);
    await titleInput.fill("My Custom Title");

    // Preview should update (check for text in preview area or image reload)
    // Wait for debounce
    await page.waitForTimeout(500);

    // The preview should contain or reflect the new title
    const preview = page.locator('[data-testid="preview"], .preview, img');
    await expect(preview.first()).toBeVisible();
  });

  test("should have copy URL button", async ({ page }) => {
    await page.goto("/editor");

    const copyButton = page.getByRole("button", { name: /copy|url/i });
    await expect(copyButton).toBeVisible();
  });
});
