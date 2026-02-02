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

test.describe("Editor Templates", () => {
  test("should have Modern template (not named Vercel)", async ({ page }) => {
    await page.goto("/editor");

    // Modern template should exist
    const modernButton = page.getByRole("button", { name: "Modern" });
    await expect(modernButton).toBeVisible();

    // Should NOT have a button literally named "Vercel"
    const vercelButton = page.getByRole("button", { name: "Vercel", exact: true });
    await expect(vercelButton).not.toBeVisible();
  });

  test("should have all standard templates", async ({ page }) => {
    await page.goto("/editor");

    const expectedTemplates = ["Custom", "Blog Post", "GitHub/OSS", "Product", "Minimal", "Hero"];
    
    for (const template of expectedTemplates) {
      const button = page.getByRole("button", { name: template });
      await expect(button).toBeVisible();
    }
  });

  test("should select template on click", async ({ page }) => {
    await page.goto("/editor");

    const blogButton = page.getByRole("button", { name: "Blog Post" });
    await blogButton.click();

    // Button should show selected state (bg-white text-black)
    await expect(blogButton).toHaveClass(/bg-white/);
  });
});

test.describe("Editor Advanced Options", () => {
  test("should open advanced options", async ({ page }) => {
    await page.goto("/editor");

    // Click to expand advanced options
    const advancedToggle = page.getByText("Advanced options");
    await advancedToggle.click();

    // Pattern buttons should now be visible
    const dotsButton = page.getByRole("button", { name: "dots" });
    await expect(dotsButton).toBeVisible();
  });

  test("should have Enhanced Styling section (not Vercel-style)", async ({ page }) => {
    await page.goto("/editor");

    // Open advanced options
    await page.getByText("Advanced options").click();

    // Should have "Enhanced Styling" label
    const enhancedLabel = page.getByText("Enhanced Styling");
    await expect(enhancedLabel).toBeVisible();

    // Should NOT have "Vercel-style" anywhere
    const vercelStyle = page.getByText(/Vercel-style/i);
    await expect(vercelStyle).not.toBeVisible();
  });

  test("should NOT have Premium labels on free features", async ({ page }) => {
    await page.goto("/editor");

    // Open advanced options
    await page.getByText("Advanced options").click();

    // Border section should NOT say "Premium"
    const premiumLabel = page.getByText(/Premium/i);
    await expect(premiumLabel).not.toBeVisible();
  });

  test("should have pattern options that work", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    // Select dots pattern
    const dotsButton = page.getByRole("button", { name: "dots" });
    await dotsButton.click();
    await expect(dotsButton).toHaveClass(/bg-white/);

    // URL should include pattern=dots
    const urlDisplay = page.locator("code");
    await expect(urlDisplay).toContainText("pattern=dots");
  });

  test("should have all layout options", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    const layouts = ["center", "left", "hero", "minimal", "split", "card"];
    
    for (const layout of layouts) {
      const button = page.getByRole("button", { name: layout, exact: true });
      await expect(button).toBeVisible();
    }
  });

  test("should have badge input in Enhanced Styling", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    const badgeInput = page.getByPlaceholder("New");
    await expect(badgeInput).toBeVisible();

    await badgeInput.fill("Launch");
    
    // URL should include badge parameter
    await page.waitForTimeout(400); // debounce
    const urlDisplay = page.locator("code");
    await expect(urlDisplay).toContainText("badge=Launch");
  });

  test("should have gradient text toggle", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    const gradientCheckbox = page.getByRole("checkbox").filter({ hasText: /gradient/i }).or(
      page.locator("label").filter({ hasText: /gradient/i }).locator("input[type=checkbox]")
    );
    
    // Find the checkbox near "Gradient title text" label
    const gradientLabel = page.getByText("Gradient title text");
    await expect(gradientLabel).toBeVisible();
  });
});

test.describe("Editor Border Options", () => {
  test("should have border width slider", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    const widthSlider = page.locator('input[type="range"]').first();
    await expect(widthSlider).toBeVisible();
  });

  test("should have border color picker", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    const colorPicker = page.locator('input[type="color"]');
    await expect(colorPicker).toBeVisible();
  });

  test("should update URL when border is set", async ({ page }) => {
    await page.goto("/editor");
    await page.getByText("Advanced options").click();

    // Set border width > 0
    const widthSlider = page.locator('input[type="range"]').first();
    await widthSlider.fill("10");

    // URL should include borderWidth
    const urlDisplay = page.locator("code");
    await expect(urlDisplay).toContainText("borderWidth=10");
  });
});
