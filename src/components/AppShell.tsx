import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FlaskConical,
  Gauge,
  Menu,
  Music2,
  Shield,
  SlidersHorizontal,
  Vault,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BrandMark } from "./BrandMark";

const navigation = [
  { to: "/app", label: "Inicio", icon: Gauge },
  { to: "/vault", label: "Vault SSR", icon: Vault },
  { to: "/instrumentales", label: "Instrumentales", icon: Music2 },
  { to: "/academia", label: "Academia", icon: BookOpen },
  { to: "/prompt-lab", label: "Prompt Lab", icon: FlaskConical },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>
      <aside className={`app-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <BrandMark compact />
        <div className="member-seal" aria-label="Identidad del miembro">
          <span>{user?.displayName.slice(0, 1).toUpperCase()}</span>
          <div>
            <small>Archivo autenticado</small>
            <strong>{user?.displayName}</strong>
            <em>{user?.plan?.name ?? "Sin membresía"}</em>
          </div>
        </div>
        <nav aria-label="Navegación del archivo">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} end={to === "/app"} to={to} onClick={() => setMobileOpen(false)}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
          {user?.role === "admin" ? (
            <NavLink to="/admin" onClick={() => setMobileOpen(false)}>
              <Shield size={18} aria-hidden="true" />
              Consola admin
            </NavLink>
          ) : null}
        </nav>
        <div className="sidebar-phrase">
          <SlidersHorizontal size={22} aria-hidden="true" />
          <p>El ritmo revela lo que las palabras ocultan.</p>
        </div>
        <button className="sidebar-logout" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}

