import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 600_000,
  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "off",
  },
});
