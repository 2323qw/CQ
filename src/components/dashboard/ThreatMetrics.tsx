import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Eye,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: React.ElementType;
  threatLevel?: "critical" | "high" | "medium" | "low" | "info";
  description?: string;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  threatLevel,
  description,
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

        <div className="w-12 h-12 rounded-lg bg-current/10 flex items-center justify-center">
          <Icon className="w-6 h-6" />
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
  const metrics = [
    {
      title: "实时威胁检测",
      value: "47",
      change: 12,
      trend: "up" as const,
      icon: AlertTriangle,
      threatLevel: "critical" as const,
      description: "过去1小时",
    },
    {
      title: "活跃连接监控",
      value: "1,247",
      change: -3,
      trend: "down" as const,
      icon: Eye,
      threatLevel: "info" as const,
      description: "当前连接数",
    },
    {
      title: "防火墙拦截",
      value: "892",
      change: 8,
      trend: "up" as const,
      icon: Shield,
      threatLevel: "medium" as const,
      description: "今日拦截次数",
    },
    {
      title: "系统性能",
      value: "97.8%",
      change: 1.2,
      trend: "up" as const,
      icon: Zap,
      threatLevel: "low" as const,
      description: "运行稳定性",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
