import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "./AppShell";
import { PublicHeader } from "./PublicHeader";

export function CatalogShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <div className="public-catalog">
      <PublicHeader />
      <main>{children}</main>
    </div>
  );
}

