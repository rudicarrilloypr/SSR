import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { BrandMark } from "../components/BrandMark";
import { useAuth } from "../context/AuthContext";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { user, login, register, loading, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    email: mode === "login" && isDemoMode ? "miembro@ssr.local" : "",
    password: mode === "login" && isDemoMode ? "frecuencia-privada" : "",
  });

  if (user) {
    return <Navigate to="/app" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form);
      } else {
        await register(form);
      }
      const target =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? "/app";
      navigate(target, { replace: true });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "La señal fue rechazada.",
      );
    }
  }

  return (
    <main className="auth-page">
      <Link className="auth-back" to="/">
        <ArrowLeft size={16} /> Regresar al portal
      </Link>
      <section className="auth-panel">
        <BrandMark />
        <div className="auth-symbol"><KeyRound /></div>
        <h1>{mode === "login" ? "Identifica tu frecuencia" : "Solicita tu iniciación"}</h1>
        <p>
          {mode === "login"
            ? "Accede a la matriz sonora."
            : "No todos reciben una llave. Deja tu señal."}
        </p>
        {isDemoMode ? (
          <div className="demo-note">
            Modo demo: usa cualquier correo. Escribe “archivista” en el correo para entrar como admin.
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label>
              Alias
              <input
                required
                value={form.displayName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
              />
            </label>
          ) : null}
          <label>
            Correo
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>
          <label>
            Contraseña
            <input
              required
              minLength={8}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button button--primary button--wide" disabled={loading}>
            {loading
              ? "Descifrando..."
              : mode === "login"
                ? "Entrar al archivo"
                : "Enviar solicitud"}
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "¿Aún no tienes una llave?" : "¿Ya fuiste iniciado?"}{" "}
          <Link to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Solicitar acceso" : "Identificarme"}
          </Link>
        </p>
      </section>
    </main>
  );
}

