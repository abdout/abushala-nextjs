import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Edge-compatible auth config (no database imports)
export default {
  trustHost: true,
  providers: [
    // Only register Google when its credentials are configured.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      async authorize() {
        // This will be overridden by the full auth.ts config
        // The edge middleware only needs to check session, not authorize
        return null;
      }
    })
  ],
} satisfies NextAuthConfig;
