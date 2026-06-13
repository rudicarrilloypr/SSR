import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  courses as demoCourses,
  instrumentals as demoInstrumentals,
  samplePacks as demoSamplePacks,
  samples as demoSamples,
} from "../lib/demo-data";
import { supabase } from "../lib/supabase";
import type {
  Course,
  Instrumental,
  PublicationStatus,
  Sample,
  SamplePack,
} from "../lib/types";

export interface ManagedRecord {
  id: string;
  title: string;
  type: "Sample pack" | "Instrumental";
  bpm: number | null;
  musicalKey: string | null;
  genre: string;
  tags: string[];
  status: PublicationStatus;
  updatedAt: string;
}

interface ContentContextValue {
  samplePacks: SamplePack[];
  samples: Sample[];
  instrumentals: Instrumental[];
  courses: Course[];
  loading: boolean;
  upsertManagedRecord: (record: ManagedRecord) => Promise<void>;
  archiveManagedRecord: (record: ManagedRecord) => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [samplePacks, setSamplePacks] = useState(demoSamplePacks);
  const [samples, setSamples] = useState(demoSamples);
  const [instrumentals, setInstrumentals] = useState(demoInstrumentals);
  const [courses, setCourses] = useState(demoCourses);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    let active = true;

    async function loadContent() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const [packsResult, samplesResult, instrumentalsResult, coursesResult] =
        await Promise.all([
          supabase
            .from("sample_packs")
            .select("*")
            .order("published_at", { ascending: false }),
          supabase
            .from("samples")
            .select("*")
            .order("published_at", { ascending: false }),
          supabase
            .from("instrumentals")
            .select("*")
            .order("published_at", { ascending: false }),
          supabase
            .from("courses")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (!active) {
        return;
      }

      if (samplesResult.data) {
        setSamples(
          samplesResult.data.map((row) => ({
            id: row.id,
            samplePackId: row.sample_pack_id ?? undefined,
            title: row.title,
            slug: row.slug,
            genre: row.genre,
            bpm: row.bpm,
            musicalKey: row.musical_key,
            sampleType: row.sample_type,
            tags: row.tags ?? [],
            durationSeconds: row.duration_seconds,
            previewUrl: row.preview_path ?? undefined,
            filePath: row.file_path,
            status: row.status,
          })),
        );
      }

      if (packsResult.data) {
        const sampleCounts = new Map<string, number>();
        for (const sample of samplesResult.data ?? []) {
          if (sample.sample_pack_id) {
            sampleCounts.set(
              sample.sample_pack_id,
              (sampleCounts.get(sample.sample_pack_id) ?? 0) + 1,
            );
          }
        }
        setSamplePacks(
          packsResult.data.map((row) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            description: row.description,
            genre: row.genre,
            bpm: row.bpm,
            musicalKey: row.musical_key,
            packType: row.pack_type,
            tags: row.tags ?? [],
            coverUrl: row.cover_path ?? undefined,
            previewUrl: row.preview_path ?? undefined,
            filePath: row.file_path,
            status: row.status,
            sampleCount: sampleCounts.get(row.id) ?? 0,
          })),
        );
      }

      if (instrumentalsResult.data) {
        setInstrumentals(
          instrumentalsResult.data.map((row) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            description: row.description,
            genre: row.genre,
            bpm: row.bpm,
            musicalKey: row.musical_key,
            mood: row.mood,
            tags: row.tags ?? [],
            previewUrl: row.preview_path ?? undefined,
            filePath: row.file_path,
            license: row.license,
            price: row.price,
            status: row.status,
          })),
        );
      }

      if (coursesResult.data) {
        setCourses(
          coursesResult.data.map((row) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            description: row.description,
            instructor: row.instructor,
            coverUrl: row.cover_path ?? undefined,
            status: row.status,
            modules: [],
          })),
        );
      }

      setLoading(false);
    }

    void loadContent();
    return () => {
      active = false;
    };
  }, []);

  const upsertManagedRecord = useCallback(async (record: ManagedRecord) => {
    if (record.type === "Sample pack") {
      if (supabase) {
        const { error } = await supabase.from("sample_packs").upsert({
          id: record.id,
          title: record.title,
          slug: `${slugify(record.title) || "registro"}-${record.id.slice(0, 6)}`,
          description: "Registro administrado desde la Consola del Archivista.",
          genre: record.genre,
          bpm: record.bpm,
          musical_key: record.musicalKey,
          pack_type: "Sample Pack",
          tags: record.tags,
          file_path: `pending/${record.id}.zip`,
          status: record.status,
          published_at: record.status === "published" ? new Date().toISOString() : null,
        });
        if (error) {
          throw error;
        }
      }

      setSamplePacks((current) => {
        const existing = current.find((item) => item.id === record.id);
        const next: SamplePack = {
          id: record.id,
          title: record.title,
          slug: slugify(record.title),
          description: existing?.description ?? "Registro administrado desde la consola.",
          genre: record.genre,
          bpm: record.bpm,
          musicalKey: record.musicalKey,
          packType: existing?.packType ?? "Sample Pack",
          tags: record.tags,
          filePath: existing?.filePath ?? `pending/${record.id}.zip`,
          status: record.status,
          sampleCount: existing?.sampleCount ?? 0,
        };
        return existing
          ? current.map((item) => (item.id === record.id ? next : item))
          : [next, ...current];
      });
      return;
    }

    if (supabase) {
      const { error } = await supabase.from("instrumentals").upsert({
        id: record.id,
        title: record.title,
        slug: `${slugify(record.title) || "registro"}-${record.id.slice(0, 6)}`,
        description: "Registro administrado desde la Consola del Archivista.",
        genre: record.genre,
        bpm: record.bpm ?? 90,
        musical_key: record.musicalKey ?? "C",
        mood: "Sin clasificar",
        tags: record.tags,
        file_path: `pending/${record.id}.wav`,
        license: "Licencia básica SSR",
        status: record.status,
        published_at: record.status === "published" ? new Date().toISOString() : null,
      });
      if (error) {
        throw error;
      }
    }

    setInstrumentals((current) => {
      const existing = current.find((item) => item.id === record.id);
      const next: Instrumental = {
        id: record.id,
        title: record.title,
        slug: slugify(record.title),
        description: existing?.description ?? "Registro administrado desde la consola.",
        genre: record.genre,
        bpm: record.bpm ?? 90,
        musicalKey: record.musicalKey ?? "C",
        mood: existing?.mood ?? "Sin clasificar",
        tags: record.tags,
        filePath: existing?.filePath ?? `pending/${record.id}.wav`,
        license: existing?.license ?? "Licencia básica SSR",
        price: existing?.price ?? null,
        status: record.status,
      };
      return existing
        ? current.map((item) => (item.id === record.id ? next : item))
        : [next, ...current];
    });
  }, []);

  const archiveManagedRecord = useCallback(async (record: ManagedRecord) => {
    const table =
      record.type === "Sample pack" ? "sample_packs" : "instrumentals";
    if (supabase) {
      const { error } = await supabase.from(table).delete().eq("id", record.id);
      if (error) {
        throw error;
      }
    }
    if (record.type === "Sample pack") {
      setSamplePacks((current) => current.filter((item) => item.id !== record.id));
    } else {
      setInstrumentals((current) => current.filter((item) => item.id !== record.id));
    }
  }, []);

  const value = useMemo(
    () => ({
      samplePacks,
      samples,
      instrumentals,
      courses,
      loading,
      upsertManagedRecord,
      archiveManagedRecord,
    }),
    [
      archiveManagedRecord,
      courses,
      instrumentals,
      loading,
      samplePacks,
      samples,
      upsertManagedRecord,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent debe usarse dentro de ContentProvider");
  }
  return context;
}
