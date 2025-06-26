import { ThreatMetrics } from "@/components/dashboard/ThreatMetrics";
import { NetworkChart } from "@/components/dashboard/NetworkChart";
import { NetworkAnalysis } from "@/components/dashboard/NetworkAnalysis";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { ApiStatus } from "@/components/ApiStatus";
import { ApiConnectionStatus } from "@/components/ApiConnectionStatus";
import { ApiTestPanel } from "@/components/ApiTestPanel";

export default function Index() {
  return (
    <div className="min-h-screen matrix-bg">
      {/* 主要内容区域 */}
      <div className="p-8">
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
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <ApiStatus />
            <ApiConnectionStatus />
          </div>

          {/* 用户友好的状态说明 */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
              <div>
                <h3 className="text-blue-300 font-medium mb-1">系统状态说明</h3>
                <p className="text-blue-400 text-sm leading-relaxed">
                  系统正在尝试连接到API服务器{" "}
                  <code className="bg-blue-800/30 px-1 rounded text-xs">
                    http://rc56132tg24.vicp.fun
                  </code>
                  。
                  如果显示"连接中..."，这是正常的加载过程。如果连接失败，系统会自动切换到演示模式，
                  使用模拟数据展示所有功能，您仍然可以正常使用和体验系统的所有特性。
                </p>
              </div>
            </div>
          </div>
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

      {/* API测试面板 */}
      <ApiTestPanel />
    </div>
  );
}
