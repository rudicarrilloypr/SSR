import { ArrowRight, Download, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { AudioPreview } from "../components/AudioPreview";
import { CoverArt } from "../components/CoverArt";
import { QuotaMeter } from "../components/QuotaMeter";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { useDownloads } from "../context/DownloadContext";

export function DashboardPage() {
  const { user } = useAuth();
  const { instrumentals } = useContent();
  const { downloads, quota } = useDownloads();
  const recommendations = [instrumentals[0], instrumentals[1], instrumentals[2]];

  return (
    <AppShell>
      <header className="app-page-header">
        <h1>Matriz sonora</h1>
        <div className="member-identity">
          <span>Miembro</span>
          <strong>@{user?.displayName}</strong>
          <i />
          <span>Membresía</span>
          <strong>{user?.plan?.name ?? "Registro básico"}</strong>
        </div>
      </header>
      <section className="dashboard-access">
        <div className="access-message">
          <div className="key-portal"><KeyRound /></div>
          <div>
            <h2>Acceso concedido al archivo secreto.</h2>
            <Link className="button button--outline" to="/vault">
              Abrir Vault <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <QuotaMeter label="Samples restantes" used={quota.samplesUsed} limit={quota.sampleLimit} />
        <QuotaMeter
          label="Instrumentales restantes"
          used={quota.instrumentalsUsed}
          limit={quota.instrumentalLimit}
        />
      </section>
      <section className="dashboard-section">
        <div className="section-heading">
          <i />
          <h2>Descargas recientes</h2>
          <Link to="/vault">Ver todo <ArrowRight size={15} /></Link>
        </div>
        <div className="download-history">
          <div className="history-head">
            <span>Título</span><span>Tipo</span><span>Fecha</span><span>Acción</span>
          </div>
          {downloads.slice(0, 4).map((download, index) => (
            <div className="history-row" key={download.id}>
              <div>
                <CoverArt seed={index} label={download.title} />
                <strong>{download.title}</strong>
              </div>
              <span>{download.contentType.replace("_", " ")}</span>
              <time>{new Date(download.createdAt).toLocaleDateString("es-MX")}</time>
              <Download size={17} aria-label="Descarga registrada" />
            </div>
          ))}
        </div>
      </section>
      <section className="dashboard-section">
        <div className="section-heading">
          <i />
          <h2>Frecuencias recomendadas</h2>
        </div>
        <div className="recommendation-grid">
          {recommendations.map((item, index) => (
            <article key={item.id}>
              <CoverArt seed={index + 2} label={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>BPM {item.bpm} · {item.musicalKey}</p>
                <AudioPreview label={item.title} compact />
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
