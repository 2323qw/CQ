import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Eye,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useRealTimeData,
  generateThreatMetrics,
} from "@/hooks/useRealTimeData";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: React.ElementType;
  threatLevel?: "critical" | "high" | "medium" | "low" | "info";
  description?: string;
  isUpdating?: boolean;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  threatLevel,
  description,
  isUpdating = false,
}: MetricCardProps) {
  const getThreatColor = (level?: string) => {
    switch (level) {
      case "critical":
        return "text-threat-critical border-threat-critical/30 bg-threat-critical/10";
      case "high":
        return "text-threat-high border-threat-high/30 bg-threat-high/10";
      case "medium":
        return "text-threat-medium border-threat-medium/30 bg-threat-medium/10";
      case "low":
        return "text-threat-low border-threat-low/30 bg-threat-low/10";
      case "info":
        return "text-threat-info border-threat-info/30 bg-threat-info/10";
      default:
        return "text-neon-blue border-neon-blue/30 bg-neon-blue/10";
    }
  };

  return (
    <div
      className={cn(
        "metric-card border-2 transition-all duration-300 hover:scale-105",
        getThreatColor(threatLevel),
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="w-5 h-5" />
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-bold glow-text">{value}</p>

            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}

            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-threat-critical" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-neon-green" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" ? "text-threat-critical" : "text-neon-green",
                  )}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
                <span className="text-xs text-muted-foreground">较昨日</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-12 h-12 rounded-lg bg-current/10 flex items-center justify-center relative">
          <Icon className="w-6 h-6" />
          {isUpdating && (
            <div className="absolute inset-0 border-2 border-current rounded-lg animate-pulse opacity-50" />
          )}
        </div>
      </div>

      {/* 数据流动效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30">
        <div className="h-full bg-current animate-data-flow" />
      </div>
    </div>
  );
}

export function ThreatMetrics() {
  const {
    data: realTimeData,
    isUpdating,
    updateData,
  } = useRealTimeData(generateThreatMetrics, {
    interval: 5000,
    enabled: true,
  });

  const metrics = [
    {
      title: "实时威胁检测",
      value: realTimeData.realTimeThreats.toString(),
      change: Math.floor(Math.random() * 30) - 10,
      trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
      icon: AlertTriangle,
      threatLevel:
        realTimeData.realTimeThreats > 45
          ? ("critical" as const)
          : ("high" as const),
      description: "过去1小时",
    },
    {
      title: "活跃连接监控",
      value: realTimeData.activeConnections.toLocaleString(),
      change: Math.floor(Math.random() * 10) - 5,
      trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
      icon: Eye,
      threatLevel: "info" as const,
      description: "当前连接数",
    },
    {
      title: "防火墙拦截",
      value: realTimeData.blockedAttacks.toString(),
      change: Math.floor(Math.random() * 20) - 5,
      trend: "up" as const,
      icon: Shield,
      threatLevel: "medium" as const,
      description: "今日拦截次数",
    },
    {
      title: "系统性能",
      value: `${realTimeData.systemHealth}%`,
      change: Math.floor(Math.random() * 3),
      trend: "up" as const,
      icon: Zap,
      threatLevel:
        realTimeData.systemHealth > 96 ? ("low" as const) : ("medium" as const),
      description: "运行稳定性",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">实时威胁监控</h2>
        <button
          onClick={updateData}
          disabled={isUpdating}
          className="neon-button flex items-center space-x-2 px-4 py-2"
        >
          <RefreshCw className={cn("w-4 h-4", isUpdating && "animate-spin")} />
          <span>{isUpdating ? "更新中..." : "手动刷新"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} isUpdating={isUpdating} />
        ))}
      </div>
    </div>
  );
}
