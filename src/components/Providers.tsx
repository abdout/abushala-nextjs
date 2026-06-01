"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ReactNode } from "react";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  // Pass the server-resolved session so useSession() is authenticated
  // synchronously (App Router + Auth.js v5) — relying on the client fetch
  // alone leaves useSession() stuck as "unauthenticated" on some routes.
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
