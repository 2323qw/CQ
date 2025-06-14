import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="ml-64 min-h-screen matrix-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* 404 动画效果 */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-neon-blue glow-text opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-24 h-24 text-threat-critical animate-pulse" />
          </div>
        </div>

        {/* 错误信息 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white glow-text">
            系统访问异常
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            您访问的页面不存在或已被移除
            <br />
            请检查URL或返回主控制台
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="neon-button flex items-center space-x-2 px-6 py-3"
          >
            <Home className="w-5 h-5" />
            <span>返回主控制台</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-matrix-border text-muted-foreground rounded hover:bg-matrix-accent transition-colors"
          >
            返回上一页
          </button>
        </div>

        {/* 装饰性代码效果 */}
        <div className="mt-12 cyber-card p-4 max-w-md mx-auto">
          <div className="font-mono text-sm text-muted-foreground space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-threat-critical">ERROR:</span>
              <span>PAGE_NOT_FOUND</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-threat-medium">CODE:</span>
              <span>404</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-neon-blue">STATUS:</span>
              <span>SYSTEM_SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 背景动画 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-threat-critical/30 to-transparent animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: "100px",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
