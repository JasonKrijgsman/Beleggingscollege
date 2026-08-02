import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Twee aliassen doen hier het werk:
//
// - "@" spiegelt de paths-instelling uit tsconfig.json.
// - "server-only" wijst naar een lege stub. Het echte pakket gooit bij import
//   buiten React Server Components — precies wat we in productie willen (zie
//   docs/openstaand.md hoofdstuk 3), maar in Vitest draait alles in Node en
//   moeten modules als @/content en @/lib/mollie gewoon te laden zijn.
export default defineConfig({
  // tsconfig zet jsx op "preserve" (Next compileert zelf); voor tests moet
  // de JSX in geïmporteerde componenten wél gewoon gecompileerd worden.
  // Vitest 4 bundelt Vite 8 (Rolldown/OXC), dus dit gaat via `oxc`, niet via
  // het oudere `esbuild`-veld.
  oxc: {
    jsx: { runtime: "automatic" },
  },
  resolve: {
    alias: {
      "server-only": fileURLToPath(
        new URL("./test/stubs/server-only.ts", import.meta.url)
      ),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    // De databasetests draaien elk op een eigen PGlite-instantie (in-memory
    // Postgres); er is dus geen gedeelde toestand tussen bestanden.
  },
});
