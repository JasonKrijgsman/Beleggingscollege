import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

/**
 * Rooktest tegen een échte productieserver (`next start`), geen dev-server:
 * zo test je ook wat de build doet (statische gratis lessen, dynamische
 * betaalde lessen).
 *
 * Draait bewust ZONDER database en zonder echte geheimen, net als de CI:
 * - de placeholder-DATABASE_URL volstaat (lesvragen vangen hun eigen
 *   verbindingsfout af en de toegangscheck voor anonieme bezoekers raakt
 *   de database niet);
 * - AUTH_SECRET is een wegwerpwaarde zodat auth() niet struikelt — er wordt
 *   in de rooktest nooit ingelogd.
 *
 * Eerste keer: `npx playwright install chromium`. In een omgeving met een
 * voorgeïnstalleerde browser kan PW_CHROMIUM_PATH naar de binary wijzen,
 * dan is die download niet nodig.
 */

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices["Desktop Chrome"],
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    // Ligt er al een build, hergebruik die dan; anders eerst bouwen.
    command: existsSync(".next/BUILD_ID")
      ? "npm run start"
      : "npm run build && npm run start",
    port: PORT,
    timeout: 600_000,
    reuseExistingServer: true,
    env: {
      PORT: String(PORT),
      AUTH_SECRET: "rooktest-wegwerpwaarde-geen-echt-geheim",
    },
  },
});
