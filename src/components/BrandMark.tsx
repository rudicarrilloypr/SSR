import { Link } from "react-router-dom";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} to="/">
      <img src="/assets/logos/ssr-icon.PNG" alt="" />
      <span>
        <strong>Sociedad Secreta</strong>
        <strong>del Ritmo</strong>
        {!compact ? <small>Archivo sonoro prohibido</small> : null}
      </span>
    </Link>
  );
}
