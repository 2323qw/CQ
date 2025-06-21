import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataSourceProvider } from "@/contexts/DataSourceContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnhancedNavigation } from "@/components/EnhancedNavigation";
import { MobileNavigationTrigger } from "@/components/MobileNavigationTrigger";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
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
import SystemMonitor from "@/pages/SystemMonitor";
import EvidenceCollectionInternational from "@/pages/EvidenceCollectionInternational";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AuthDebug from "@/components/AuthDebug";

// 受保护的布局组件
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-matrix-bg text-white font-mono">
      <Navigation
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileClose}
      />
      <MobileNavigationTrigger onToggle={handleMobileToggle} />
      {/* 为固定导航栏预留空间：ml-64 = 256px，与导航栏宽度w-64匹配 */}
      <div className="ml-0 md:ml-64 min-h-screen">{children}</div>
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
            <SituationDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/system-monitor"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SystemMonitor />
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
        path="/evidence-collection"
        element={
          <ProtectedRoute>
            <EvidenceCollectionInternational />
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
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
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
    <BrowserRouter>
      <AuthProvider>
        <DataSourceProvider>
          <NavigationProvider>
            <KeyboardShortcuts />
            <AppLayout />
            <ToastContainer />
          </NavigationProvider>
        </DataSourceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
