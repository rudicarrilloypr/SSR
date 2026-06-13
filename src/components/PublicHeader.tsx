import { Link, NavLink } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BrandMark } from "./BrandMark";

export function PublicHeader() {
  const { user } = useAuth();

  return (
    <header className="public-header">
      <BrandMark />
      <nav aria-label="Navegación principal">
        <NavLink to="/vault">Vault</NavLink>
        <NavLink to="/instrumentales">Instrumentales</NavLink>
        <NavLink to="/academia">Academia</NavLink>
        <NavLink to="/prompt-lab">Prompt Lab</NavLink>
      </nav>
      <Link className="button button--primary header-access" to={user ? "/app" : "/login"}>
        <span>{user ? "Entrar a la matriz" : "Solicitar acceso"}</span>
        <KeyRound size={17} aria-hidden="true" />
      </Link>
    </header>
  );
}
