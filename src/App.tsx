import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-matrix-bg text-white font-mono">
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/settings"
            element={
              <div className="ml-64 p-8">
                <h1 className="text-3xl font-bold text-white glow-text mb-4">
                  系统设置
                </h1>
                <div className="cyber-card p-6">
                  <p className="text-muted-foreground">设置页面正在开发中...</p>
                </div>
              </div>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
