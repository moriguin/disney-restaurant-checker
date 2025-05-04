import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 60_000,
  use: {
    headless: false,
    screenshot: "only-on-failure",
    video: "off",
  },
});
