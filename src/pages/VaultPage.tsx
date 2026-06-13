import { useMemo, useState } from "react";
import { FilterX, Search, ShieldCheck } from "lucide-react";
import { AudioPreview } from "../components/AudioPreview";
import { CatalogShell } from "../components/CatalogShell";
import { CoverArt } from "../components/CoverArt";
import { DownloadButton } from "../components/DownloadButton";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { useDownloads } from "../context/DownloadContext";

export function VaultPage() {
  const { user } = useAuth();
  const { samplePacks, samples } = useContent();
  const { quota } = useDownloads();
  const [tab, setTab] = useState<"packs" | "samples">("packs");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const records = useMemo(() => {
    const source = tab === "packs" ? samplePacks : samples;
    return source.filter((item) => {
      const matchesSearch = [item.title, item.genre, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesSearch && (!genre || item.genre === genre);
    });
  }, [genre, search, tab]);

  const genres = [...new Set([...samplePacks, ...samples].map((item) => item.genre))];

  return (
    <CatalogShell>
      <div className="catalog-page">
        <header className="catalog-heading">
          <div>
            <h1>Vault SSR</h1>
            <p>El archivo no duerme.</p>
          </div>
          <div className="catalog-quota">
            <ShieldCheck />
            <strong>{quota.samplesRemaining === null ? "∞" : quota.samplesRemaining}</strong>
            <span>descargas restantes</span>
          </div>
        </header>
        {!user ? (
          <div className="visitor-notice">
            Estás escuchando una transmisión limitada. Identifícate para solicitar descargas.
          </div>
        ) : null}
        <div className="catalog-filters">
          <label className="search-field">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Descifrar por título o tag"
            />
          </label>
          <label>
            <span className="sr-only">Género</span>
            <select value={genre} onChange={(event) => setGenre(event.target.value)}>
              <option value="">Género</option>
              {genres.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">BPM</span>
            <select disabled><option>BPM</option></select>
          </label>
          <label>
            <span className="sr-only">Tono</span>
            <select disabled><option>Tono</option></select>
          </label>
          <button type="button" onClick={() => { setSearch(""); setGenre(""); }}>
            <FilterX size={16} /> Limpiar
          </button>
        </div>
        <div className="catalog-result-line">
          <span>{records.length} registros encontrados</span>
        </div>
        <div className="catalog-tabs" role="tablist">
          <button className={tab === "packs" ? "is-active" : ""} onClick={() => setTab("packs")}>
            Packs
          </button>
          <button className={tab === "samples" ? "is-active" : ""} onClick={() => setTab("samples")}>
            Samples
          </button>
        </div>
        <div className="catalog-list">
          {records.map((record, index) => (
            <article className="catalog-row" key={record.id}>
              <CoverArt seed={index} label={record.title} />
              <div className="catalog-meta">
                <h2>{record.title}</h2>
                <p>{record.genre} · {record.bpm ?? "Libre"} BPM · {record.musicalKey ?? "—"}</p>
                <div className="tag-list">
                  {record.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <AudioPreview label={record.title} />
              <div className="catalog-actions">
                <span>{tab === "packs" ? `${"sampleCount" in record ? record.sampleCount : 0} samples` : "sample individual"}</span>
                <DownloadButton
                  contentType={tab === "packs" ? "sample_pack" : "sample"}
                  contentId={record.id}
                  title={record.title}
                  compact
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </CatalogShell>
  );
}
