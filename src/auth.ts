import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // Database-sessies (niet JWT): daarmee kunnen we een sessie direct
  // intrekken. Bij betaalde toegang wil je dat kunnen — een JWT blijft
  // geldig tot hij verloopt, ook na een terugbetaling of misbruik.
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  callbacks: {
    // De gebruikers-id doorgeven aan de sessie, zodat server components
    // meteen weten wie er kijkt zonder extra query.
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
