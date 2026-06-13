import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialDownloads } from "../lib/demo-data";
import { calculateDownloadQuota, canDownload } from "../lib/quotas";
import { supabase } from "../lib/supabase";
import type {
  DownloadContentType,
  DownloadQuota,
  DownloadRecord,
} from "../lib/types";
import { useAuth } from "./AuthContext";

interface DownloadRequest {
  contentType: DownloadContentType;
  contentId: string;
  title: string;
}

interface DownloadResult {
  ok: boolean;
  message: string;
}

interface DownloadContextValue {
  downloads: DownloadRecord[];
  quota: DownloadQuota;
  requestDownload: (request: DownloadRequest) => Promise<DownloadResult>;
}

const DownloadContext = createContext<DownloadContextValue | null>(null);

export function DownloadProvider({ children }: { children: ReactNode }) {
  const { user, isDemoMode } = useAuth();
  const [downloads, setDownloads] =
    useState<DownloadRecord[]>(initialDownloads);

  const userDownloads = useMemo(
    () => downloads.filter((download) => download.userId === user?.id),
    [downloads, user?.id],
  );
  const quota = useMemo(
    () => calculateDownloadQuota(user?.plan, userDownloads),
    [user?.plan, userDownloads],
  );

  const requestDownload = useCallback(
    async ({
      contentType,
      contentId,
      title,
    }: DownloadRequest): Promise<DownloadResult> => {
      if (!user) {
        return {
          ok: false,
          message: "Debes identificarte antes de abrir este registro.",
        };
      }

      const hasActiveAccess =
        user.role === "admin" ||
        (user.role === "subscriber" &&
          ["active", "trialing"].includes(user.subscription?.status ?? ""));

      if (!hasActiveAccess) {
        return {
          ok: false,
          message: "Esta frecuencia requiere una membresía activa.",
        };
      }

      if (user.role !== "admin" && !canDownload(contentType, quota)) {
        return {
          ok: false,
          message: "Tu cuota mensual para este archivo se ha agotado.",
        };
      }

      if (!isDemoMode && supabase) {
        const { data } = await supabase.auth.getSession();
        const response = await fetch("/api/download", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.session?.access_token ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType,
            contentId,
          }),
        });
        const payload = (await response.json()) as {
          message?: string;
          signedUrl?: string;
        };

        if (!response.ok || !payload.signedUrl) {
          return {
            ok: false,
            message:
              payload.message ?? "El archivo no respondió a la invocación.",
          };
        }

        window.location.assign(payload.signedUrl);
      }

      setDownloads((current) => [
        {
          id: crypto.randomUUID(),
          userId: user.id,
          contentType,
          contentId,
          title,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);

      return {
        ok: true,
        message: isDemoMode
          ? "Descarga registrada en modo demostración."
          : "Acceso concedido. La descarga ha comenzado.",
      };
    },
    [isDemoMode, quota, user],
  );

  const value = useMemo(
    () => ({ downloads: userDownloads, quota, requestDownload }),
    [quota, requestDownload, userDownloads],
  );

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownloads() {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error("useDownloads debe usarse dentro de DownloadProvider");
  }
  return context;
}
