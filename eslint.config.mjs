import { FlatCompat } from "@eslint/eslintrc";

// ESLint 9 (flat config) met de officiële Next.js-regels, inclusief de
// toegankelijkheidsregels (jsx-a11y) en React-hooks-regels die
// next/core-web-vitals meebrengt. FlatCompat is nodig omdat
// eslint-config-next 15.x zelf nog in het oude formaat geschreven is.
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      // Werkmappen van agent-sessies; geen projectcode.
      ".claude/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
