import { BookOpen, LockKeyhole, Play } from "lucide-react";
import { CatalogShell } from "../components/CatalogShell";
import { CoverArt } from "../components/CoverArt";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";

export function AcademyPage() {
  const { user } = useAuth();
  const { courses } = useContent();
  const hasAccess = user?.role === "admin" || Boolean(user?.plan?.includesCourses);

  return (
    <CatalogShell>
      <div className="placeholder-page">
        <header>
          <BookOpen />
          <h1>Academia SSR</h1>
          <p>El conocimiento también tiene frecuencias privadas.</p>
        </header>
        <div className="phase-banner">Fase 2 · Archivo pedagógico en preparación</div>
        <div className="course-grid">
          {courses.map((course, index) => (
            <article key={course.id}>
              <CoverArt seed={index + 3} label={course.title} />
              <div>
                <small>Curso del Consejo SSR</small>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <button type="button" disabled={!hasAccess || course.status === "draft"}>
                  {hasAccess ? <Play /> : <LockKeyhole />}
                  {course.status === "draft" ? "Próximamente" : hasAccess ? "Abrir curso" : "Acceso Archivist"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </CatalogShell>
  );
}
