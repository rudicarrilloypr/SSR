import { AudioPreview } from "../components/AudioPreview";
import { CatalogShell } from "../components/CatalogShell";
import { CoverArt } from "../components/CoverArt";
import { DownloadButton } from "../components/DownloadButton";
import { useContent } from "../context/ContentContext";
import { useDownloads } from "../context/DownloadContext";

export function InstrumentalsPage() {
  const { quota } = useDownloads();
  const { instrumentals } = useContent();

  return (
    <CatalogShell>
      <div className="catalog-page instrumentals-page">
        <header className="catalog-heading">
          <div>
            <h1>Instrumentales</h1>
            <p>Bases que hablan antes que tú.</p>
          </div>
          <div className="catalog-quota">
            <strong>{quota.instrumentalsRemaining === null ? "∞" : quota.instrumentalsRemaining}</strong>
            <span>descargas restantes</span>
          </div>
        </header>
        <div className="instrumental-list">
          {instrumentals.map((item, index) => (
            <article key={item.id}>
              <span className="track-number">{String(index + 1).padStart(2, "0")}</span>
              <CoverArt seed={index + 1} label={item.title} />
              <div className="catalog-meta">
                <h2>{item.title}</h2>
                <p>{item.genre} · {item.bpm} BPM · {item.musicalKey}</p>
                <span className="mood">{item.mood}</span>
              </div>
              <AudioPreview label={item.title} />
              <div className="license-meta">
                <span>{item.license}</span>
                <strong>{item.price ? `$${item.price} MXN` : "Incluido"}</strong>
              </div>
              <DownloadButton
                contentType="instrumental"
                contentId={item.id}
                title={item.title}
                compact
              />
            </article>
          ))}
        </div>
      </div>
    </CatalogShell>
  );
}
