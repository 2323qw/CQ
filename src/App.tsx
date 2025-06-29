import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import EvidenceCollection from "@/pages/EvidenceCollection";
import ThreatHunting from "@/pages/ThreatHunting";
import CommandCenter from "@/pages/CommandCenter";
import FeatureShowcase from "@/pages/FeatureShowcase";
import NetworkTopology from "@/pages/NetworkTopology";
import TrafficAnalysis from "@/pages/TrafficAnalysis";
import BehaviorAnalysis from "@/pages/BehaviorAnalysis";
import ComplianceCheck from "@/pages/ComplianceCheck";
import AIAnalysis from "@/pages/AIAnalysis";
import AutoResponse from "@/pages/AutoResponse";
import PredictiveModeling from "@/pages/PredictiveModeling";
import KnowledgeGraph from "@/pages/KnowledgeGraph";
import RiskAssessment from "@/pages/RiskAssessment";
import HelpCenter from "@/pages/HelpCenter";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AuthDebug from "@/components/AuthDebug";

// 受保护的布局组件
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const handleMobileToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  // 监听导航栏紧凑模式状态变化
  React.useEffect(() => {
    const handleCompactModeChange = (event: CustomEvent) => {
      setIsCompactMode(event.detail.isCompact);
    };

    window.addEventListener(
      "navigationCompactModeChange",
      handleCompactModeChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "navigationCompactModeChange",
        handleCompactModeChange as EventListener,
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-matrix-bg text-white font-mono">
      <EnhancedNavigation
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileClose}
      />
      <MobileNavigationTrigger onToggle={handleMobileToggle} />
      {/* 动态调整margin以适应导航栏宽度变化 */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          "ml-0", // 移动端无margin
          isCompactMode ? "md:ml-16" : "md:ml-72", // 桌面端根据紧凑模式调整
        )}
      >
        {children}
      </div>
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
            <ProtectedLayout>
              <EvidenceCollection />
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
        path="/threat-hunting"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ThreatHunting />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/command-center"
        element={
          <ProtectedRoute>
            <CommandCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/features"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <FeatureShowcase />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/topology"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <NetworkTopology />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/traffic-analysis"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <TrafficAnalysis />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/behavior-analysis"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <BehaviorAnalysis />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/compliance"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ComplianceCheck />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-analysis"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AIAnalysis />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auto-response"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AutoResponse />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/predictive"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <PredictiveModeling />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-graph"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <KnowledgeGraph />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/risk-assessment"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <RiskAssessment />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HelpCenter />
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
        <NavigationProvider>
          <KeyboardShortcuts />
          <AppLayout />
          <ToastContainer />
        </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
