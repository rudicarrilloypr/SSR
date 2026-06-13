import { ArrowRight, Eye, KeyRound, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { AudioPreview } from "../components/AudioPreview";
import { PublicHeader } from "../components/PublicHeader";

const signals = [
  {
    title: "Vault SSR",
    subtitle: "Archivo clandestino",
    copy: "Sesiones, rarezas y registros prohibidos del underground latino.",
    to: "/vault",
    action: "Entrar al Vault",
  },
  {
    title: "Instrumentales",
    subtitle: "Bases que hablan",
    copy: "Beats originales para crear, estudiar y elevar tu sonido.",
    to: "/instrumentales",
    action: "Explorar instrumentales",
  },
  {
    title: "Netlabel",
    subtitle: "Sonidos sin fronteras",
    copy: "Lanzamientos selectos. Artistas invisibles. Música sin permiso.",
    to: "/#netlabel",
    action: "Visitar Netlabel",
  },
];

export function PortalPage() {
  return (
    <div className="portal">
      <PublicHeader />
      <section className="portal-hero">
        <div className="hero-copy">
          <span className="ritual-line" aria-hidden="true" />
          <h1>
            No todos escuchan la <em>frecuencia.</em>
          </h1>
          <p>El ritmo no se busca. Se descifra.</p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/register">
              Solicitar acceso <KeyRound size={17} />
            </Link>
            <Link className="button button--outline" to="/vault">
              Explorar el archivo <ArrowRight size={17} />
            </Link>
          </div>
          <small>&gt;&gt; Acceso restringido // nivel de autorización requerido</small>
        </div>
        <div className="portal-door" aria-label="Portal central de Sociedad Secreta del Ritmo">
          <div className="door-rings">
            <img src="/assets/logos/ssr-icon.PNG" alt="Símbolo SSR" />
          </div>
          <span className="frequency-line" />
        </div>
        <aside className="signal-monitor">
          <div>
            <Radio size={18} />
            <strong>Frecuencia SSR</strong>
            <i />
          </div>
          <AudioPreview label="Frecuencia SSR" compact />
          <dl>
            <dt>Estado</dt><dd>Interceptando</dd>
            <dt>Señal</dt><dd>Estable</dd>
            <dt>Origen</dt><dd>Desconocido</dd>
          </dl>
          <p>&gt;&gt; Mantén silencio<br />&gt;&gt; Escucha con intención</p>
        </aside>
      </section>
      <section className="signals-section" id="netlabel">
        <div className="section-heading">
          <Radio size={18} />
          <h2>Señales interceptadas</h2>
        </div>
        <div className="signal-grid">
          {signals.map((signal, index) => (
            <article className="signal-card" key={signal.title}>
              <div className={`signal-art signal-art--${index + 1}`}>
                {index === 2 ? <Eye /> : <span>SSR</span>}
              </div>
              <div>
                <h3>{signal.title}</h3>
                <strong>{signal.subtitle}</strong>
                <p>{signal.copy}</p>
              </div>
              <AudioPreview label={signal.title} compact />
              <Link to={signal.to}>{signal.action}<ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="membership-invitation">
        <div className="invitation-seal"><KeyRound /></div>
        <div>
          <h2>La membresía no se compra. Se concede.</h2>
          <p>Si sientes la frecuencia, deja tu señal. El Consejo decidirá.</p>
        </div>
        <Link className="button button--primary" to="/register">
          Solicitar acceso <KeyRound size={17} />
        </Link>
      </section>
      <footer className="portal-footer">
        <span>Sociedad Secreta del Ritmo</span>
        <small>Silencio · Disciplina · Ritmo</small>
      </footer>
    </div>
  );
}
