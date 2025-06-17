import { ThreatMetrics } from "@/components/dashboard/ThreatMetrics";
import { NetworkChart } from "@/components/dashboard/NetworkChart";
import { NetworkAnalysis } from "@/components/dashboard/NetworkAnalysis";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { ApiStatus } from "@/components/ApiStatus";

export default function Index() {
  return (
    <div className="min-h-screen matrix-bg">
      {/* 主要内容区域 */}
      <div className="ml-64 p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white glow-text mb-2">
            网络安全监控仪表板
          </h1>
          <p className="text-muted-foreground">
            实时监控网络威胁，保护您的数字资产安全
          </p>
        </div>

        {/* API状态检查 */}
        <div className="mb-6">
          <ApiStatus />
        </div>

        <div className="space-y-8">
          {/* 威胁统计指标 */}
          <section>
            <ThreatMetrics />
          </section>

          {/* 网络流量和威胁图表 */}
          <section>
            <NetworkChart />
          </section>

          {/* 高级网络分析 */}
          <section>
            <NetworkAnalysis />
          </section>

          {/* 实时告警列表 */}
          <section>
            <AlertsList />
          </section>
        </div>
      </div>

      {/* 背景动画效果 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 矩阵雨效果 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-neon-green/30 to-transparent animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: "100px",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* 扫描线 */}
        <div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan-line"
          style={{ animationDuration: "8s" }}
        />
      </div>
    </div>
  );
}
