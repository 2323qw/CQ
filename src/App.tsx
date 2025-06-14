import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import { ToastContainer } from "@/components/ui/toast";
import Index from "@/pages/Index";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import SystemLogs from "@/pages/SystemLogs";
import ThreatIntelligence from "@/pages/ThreatIntelligence";
import AssetManagement from "@/pages/AssetManagement";
import ApiKeys from "@/pages/ApiKeys";
import SituationDisplay from "@/pages/SituationDisplay";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// 受保护的布局组件
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-matrix-bg text-white font-mono">
      <Navigation />
      {children}
    </div>
  );
}

// 主应用布局组件
function AppLayout() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Index />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/situation"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SituationDisplay />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Alerts />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Reports />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <UserManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SystemLogs />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/threat-intelligence"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ThreatIntelligence />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AssetManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-keys"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ApiKeys />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <NotFound />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
