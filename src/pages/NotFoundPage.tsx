import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="not-found">
      <span>404 // Señal perdida</span>
      <h1>Esta frecuencia no existe.</h1>
      <Link className="button button--outline" to="/">Volver al portal</Link>
    </main>
  );
}
