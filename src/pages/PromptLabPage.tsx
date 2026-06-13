import { FlaskConical, LockKeyhole, Waves } from "lucide-react";
import { CatalogShell } from "../components/CatalogShell";

export function PromptLabPage() {
  return (
    <CatalogShell>
      <div className="placeholder-page prompt-lab">
        <header>
          <FlaskConical />
          <h1>Prompt Lab SSR</h1>
          <p>La próxima frecuencia aún no tiene nombre.</p>
        </header>
        <section className="lab-console">
          <Waves />
          <div>
            <span>Canal experimental // Fase 3</span>
            <h2>Diseña instrucciones para máquinas que todavía no escuchan.</h2>
            <p>
              Aquí vivirán el generador de prompts musicales, las recetas privadas y
              las futuras conexiones con modelos de audio.
            </p>
          </div>
          <button type="button" disabled><LockKeyhole /> Frecuencia privada</button>
        </section>
      </div>
    </CatalogShell>
  );
}
