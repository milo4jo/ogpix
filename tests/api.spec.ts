import { test, expect } from "@playwright/test";

test.describe("OG Image API", () => {
  test("should generate image with default params", async ({ request }) => {
    const response = await request.get("/api/og");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should generate image with custom title", async ({ request }) => {
    const response = await request.get("/api/og?title=Hello%20World");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should generate image with title and subtitle", async ({ request }) => {
    const response = await request.get("/api/og?title=Test%20Title&subtitle=Test%20Subtitle");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should accept theme parameter", async ({ request }) => {
    const response = await request.get("/api/og?title=Themed&theme=sunset");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should accept template parameter", async ({ request }) => {
    const response = await request.get("/api/og?title=Blog%20Post&template=blog");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should handle border parameters", async ({ request }) => {
    const response = await request.get(
      "/api/og?title=Bordered&borderWidth=4&borderColor=ff0000&borderRadius=16"
    );

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should return appropriate cache headers", async ({ request }) => {
    const response = await request.get("/api/og?title=Cache%20Test");

    expect(response.ok()).toBeTruthy();
    // Should have some cache control
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toBeDefined();
  });

  test("should handle very long titles gracefully", async ({ request }) => {
    const longTitle = "A".repeat(500);
    const response = await request.get(`/api/og?title=${encodeURIComponent(longTitle)}`);

    // Should not crash - either success or graceful error
    expect(response.status()).toBeLessThan(500);
  });

  test("should handle special characters in title", async ({ request }) => {
    const specialTitle = 'Hello <World> & "Friends"';
    const response = await request.get(`/api/og?title=${encodeURIComponent(specialTitle)}`);

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("should handle emoji in title", async ({ request }) => {
    const emojiTitle = "Hello 🌍 World 🚀";
    const response = await request.get(`/api/og?title=${encodeURIComponent(emojiTitle)}`);

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
