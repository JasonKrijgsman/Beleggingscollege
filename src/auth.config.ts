import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Deze config is bewust "edge-veilig": geen database, geen adapter, geen
// native modules. De middleware draait op de Edge-runtime en kan die niet
// laden. De volledige instance (mét database) staat in src/auth.ts.
export default {
  providers: [Google],
  pages: {
    signIn: "/inloggen",
    error: "/inloggen",
  },
  trustHost: true,
} satisfies NextAuthConfig;
