"use client";

import { DataProvider } from "@/context/DataContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}
