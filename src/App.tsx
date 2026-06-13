import { Route, Routes } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "./components/RouteGuards";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { DownloadProvider } from "./context/DownloadContext";
import { AcademyPage } from "./pages/AcademyPage";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InstrumentalsPage } from "./pages/InstrumentalsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PortalPage } from "./pages/PortalPage";
import { PromptLabPage } from "./pages/PromptLabPage";
import { VaultPage } from "./pages/VaultPage";

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <DownloadProvider>
          <Routes>
            <Route path="/" element={<PortalPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/instrumentales" element={<InstrumentalsPage />} />
            <Route path="/academia" element={<AcademyPage />} />
            <Route path="/prompt-lab" element={<PromptLabPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<DashboardPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DownloadProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
