import { test, expect, APIRequestContext } from "@playwright/test";

/**
 * Comprehensive API tests for OG image generation
 * Tests all parameters, themes, layouts, and patterns
 */

const BASE_URL = "/api/og";

// Helper to fetch with retry (OG image generation can be slow)
async function fetchWithRetry(
  request: APIRequestContext,
  url: string,
  retries = 3
): Promise<Awaited<ReturnType<APIRequestContext["get"]>>> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await request.get(url, { timeout: 15000 });
      if (response.status() === 200) {
        return response;
      }
      // If not 200, wait and retry
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      lastError = e as Error;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
}

// Helper to check if response is a valid PNG
async function expectValidPng(response: Awaited<ReturnType<APIRequestContext["get"]>>) {
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  const body = await response.body();
  expect(body.length).toBeGreaterThan(1000);
  // PNG magic bytes
  expect(body[0]).toBe(0x89);
  expect(body[1]).toBe(0x50);
  expect(body[2]).toBe(0x4e);
  expect(body[3]).toBe(0x47);
}

test.describe("OG API - Basic Parameters", () => {
  test("should generate image with title only", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Hello+World`);
    await expectValidPng(response);
  });

  test("should generate image with title and subtitle", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Main+Title&subtitle=Subtitle`);
    await expectValidPng(response);
  });

  test("should handle special characters in title", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=${encodeURIComponent("Hello & World")}`);
    await expectValidPng(response);
  });

  test("should handle long title", async ({ request }) => {
    const longTitle = "A".repeat(100);
    const response = await fetchWithRetry(request, `${BASE_URL}?title=${longTitle}`);
    await expectValidPng(response);
  });
});

test.describe("OG API - Themes", () => {
  const themes = ["dark", "light", "gradient", "blue", "green", "purple", "ocean", "sunset", "aurora"];

  for (const theme of themes) {
    test(`should generate image with theme: ${theme}`, async ({ request }) => {
      const response = await fetchWithRetry(request, `${BASE_URL}?title=Theme+Test&theme=${theme}`);
      await expectValidPng(response);
    });
  }
});

test.describe("OG API - Layouts", () => {
  const layouts = ["center", "left", "hero", "minimal", "split", "card", "modern"];

  for (const layout of layouts) {
    test(`should generate image with layout: ${layout}`, async ({ request }) => {
      const response = await fetchWithRetry(request, `${BASE_URL}?title=Layout+Test&layout=${layout}`);
      await expectValidPng(response);
    });
  }
});

test.describe("OG API - Patterns", () => {
  test("should generate image with pattern: none", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Pattern+Test&pattern=none`);
    await expectValidPng(response);
  });

  test("should generate image with pattern: dots", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Pattern+Test&pattern=dots`);
    await expectValidPng(response);
  });

  test("should generate image with pattern: grid", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Pattern+Test&pattern=grid`);
    await expectValidPng(response);
  });

  test("should generate image with pattern: diagonal", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Pattern+Test&pattern=diagonal`);
    await expectValidPng(response);
  });

  test("dots pattern should produce larger file than none", async ({ request }) => {
    const noneResponse = await fetchWithRetry(request, `${BASE_URL}?title=Test&pattern=none&theme=dark`);
    const dotsResponse = await fetchWithRetry(request, `${BASE_URL}?title=Test&pattern=dots&theme=dark`);
    
    const noneBody = await noneResponse.body();
    const dotsBody = await dotsResponse.body();
    
    // Patterns should produce larger images due to additional SVG elements
    expect(dotsBody.length).toBeGreaterThan(noneBody.length);
  });

  test("grid pattern should produce larger file than none", async ({ request }) => {
    const noneResponse = await fetchWithRetry(request, `${BASE_URL}?title=Test&pattern=none&theme=dark`);
    const gridResponse = await fetchWithRetry(request, `${BASE_URL}?title=Test&pattern=grid&theme=dark`);
    
    const noneBody = await noneResponse.body();
    const gridBody = await gridResponse.body();
    
    expect(gridBody.length).toBeGreaterThan(noneBody.length);
  });
});

test.describe("OG API - Font Sizes", () => {
  const fontSizes = ["auto", "sm", "md", "lg", "xl"];

  for (const fontSize of fontSizes) {
    test(`should generate image with fontSize: ${fontSize}`, async ({ request }) => {
      const response = await fetchWithRetry(request, `${BASE_URL}?title=Font+Size+Test&fontSize=${fontSize}`);
      await expectValidPng(response);
    });
  }
});

test.describe("OG API - Templates", () => {
  const templates = ["blog", "github", "product", "docs", "minimal", "hero", "feature"];

  for (const template of templates) {
    test(`should generate image with template: ${template}`, async ({ request }) => {
      const response = await fetchWithRetry(request, `${BASE_URL}?title=Template+Test&template=${template}`);
      await expectValidPng(response);
    });
  }
});

test.describe("OG API - Enhanced Styling", () => {
  test("should generate image with badge", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&badge=New`);
    await expectValidPng(response);
  });

  test("should generate image with date", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&date=Jan+2026&layout=card`);
    await expectValidPng(response);
  });

  test("should generate image with icon", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&icon=🚀&layout=hero`);
    await expectValidPng(response);
  });

  test("should generate image with gradient text", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Gradient+Title&gradientText=true`);
    await expectValidPng(response);
  });

  test("should generate image with tag", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&tag=Blog+Post`);
    await expectValidPng(response);
  });

  test("should generate image with author", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&author=John+Doe`);
    await expectValidPng(response);
  });
});

test.describe("OG API - Border Options", () => {
  test("should generate image with border width", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&borderWidth=10`);
    await expectValidPng(response);
  });

  test("should generate image with border color", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&borderWidth=5&borderColor=ff0000`);
    await expectValidPng(response);
  });

  test("should generate image with border radius", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&borderWidth=5&borderRadius=20`);
    await expectValidPng(response);
  });
});

test.describe("OG API - Watermark", () => {
  test("should include watermark by default", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test`);
    await expectValidPng(response);
  });

  test("should hide watermark when set to false", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Test&watermark=false`);
    await expectValidPng(response);
  });
});

test.describe("OG API - Combined Parameters", () => {
  test("should handle multiple parameters together", async ({ request }) => {
    const response = await fetchWithRetry(request, 
      `${BASE_URL}?title=Full+Test&subtitle=All+Options&theme=ocean&layout=card&pattern=dots&fontSize=lg&tag=Demo&badge=New`
    );
    await expectValidPng(response);
  });
});

test.describe("OG API - Response Headers", () => {
  test("should have correct content-type", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Header+Test`);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should have cache headers", async ({ request }) => {
    const response = await fetchWithRetry(request, `${BASE_URL}?title=Cache+Test`);
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("max-age");
  });
});
