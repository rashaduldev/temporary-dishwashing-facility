import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4173",
    headless: true,
    launchOptions: process.env.CHROME_PATH
      ? {
          executablePath: process.env.CHROME_PATH,
          args: JSON.parse(process.env.CHROME_ARGS || "[]"),
        }
      : {},
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run preview",
        port: 4173,
        reuseExistingServer: !process.env.CI,
      },
  reporter: "list",
});
