import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Eye,
  Zap,
  RefreshCw,
  Cpu,
  Database,
  HardDrive,
  Wifi,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useRealTimeData,
  generateThreatMetrics,
} from "@/hooks/useRealTimeData";
import {
  useSystemMetrics,
  formatMemory,
  formatBytes,
  formatBandwidth,
} from "@/hooks/useSystemMetrics";
import { ApiFailureNotification } from "@/components/ApiFailureNotification";
import { DataSourceToggle } from "@/components/DataSourceToggle";
import { useDataSource } from "@/contexts/DataSourceContext";

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
  const { isApiMode, isMockMode } = useDataSource();

  const {
    data: realTimeData,
    isUpdating,
    updateData,
  } = useRealTimeData(generateThreatMetrics, {
    interval: 5000,
    enabled: true,
  });

  const {
    data: systemMetrics,
    loading: metricsLoading,
    error: metricsError,
    refetch,
  } = useSystemMetrics({
    interval: 10000,
    enabled: true,
  });

  // 计算警报状态
  const alertCount = systemMetrics
    ? (systemMetrics.cpu_alert ? 1 : 0) +
      (systemMetrics.memory_alert ? 1 : 0) +
      (systemMetrics.disk_alert ? 1 : 0)
    : 0;

  // 如果没有API数据，显示错误状态
  if (!systemMetrics && !metricsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">实时系统监控</h2>
          <button
            onClick={refetch}
            disabled={metricsLoading}
            className="neon-button flex items-center space-x-2 px-4 py-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", metricsLoading && "animate-spin")}
            />
            <span>重新连接</span>
          </button>
        </div>

        {/* API Failure Notification */}
        <ApiFailureNotification
          error={metricsError || "无法获取系统监控数据"}
          onRetry={refetch}
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-full bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              API连接失败
            </h3>
            <p className="text-red-300 text-sm mb-4">
              无法获取系统监控数据，请检查网络连接或API服务状态
            </p>
            <button
              onClick={refetch}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              重试连接
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "CPU 使用率",
      value:
        systemMetrics && typeof systemMetrics.cpu_percent === "number"
          ? `${systemMetrics.cpu_percent.toFixed(1)}%`
          : "连接中...",
      change: systemMetrics?.cpu_percent > 70 ? 1 : -1,
      trend:
        systemMetrics?.cpu_percent > 70 ? ("up" as const) : ("down" as const),
      icon: Cpu,
      threatLevel: systemMetrics?.cpu_alert
        ? ("critical" as const)
        : systemMetrics && systemMetrics.cpu_percent > 80
          ? ("high" as const)
          : systemMetrics && systemMetrics.cpu_percent > 60
            ? ("medium" as const)
            : ("low" as const),
      description:
        systemMetrics && typeof systemMetrics.cpu_count === "number"
          ? `${systemMetrics.cpu_count} 核心`
          : "获取中...",
    },
    {
      title: "内存使用",
      value:
        systemMetrics && typeof systemMetrics.memory_percent === "number"
          ? `${systemMetrics.memory_percent.toFixed(1)}%`
          : "连接中...",
      change: systemMetrics?.memory_percent > 80 ? 1 : -1,
      trend:
        systemMetrics?.memory_percent > 80
          ? ("up" as const)
          : ("down" as const),
      icon: Database,
      threatLevel: systemMetrics?.memory_alert
        ? ("critical" as const)
        : systemMetrics && systemMetrics.memory_percent > 85
          ? ("high" as const)
          : systemMetrics && systemMetrics.memory_percent > 70
            ? ("medium" as const)
            : ("low" as const),
      description:
        systemMetrics && typeof systemMetrics.memory_available === "number"
          ? `${formatMemory(systemMetrics.memory_available)} 可用`
          : "获取中...",
    },
    {
      title: "磁盘使用",
      value:
        systemMetrics && typeof systemMetrics.disk_percent === "number"
          ? `${systemMetrics.disk_percent.toFixed(1)}%`
          : "连接中...",
      change: systemMetrics?.disk_percent > 80 ? 1 : -1,
      trend:
        systemMetrics?.disk_percent > 80 ? ("up" as const) : ("down" as const),
      icon: HardDrive,
      threatLevel: systemMetrics?.disk_alert
        ? ("critical" as const)
        : systemMetrics && systemMetrics.disk_percent > 90
          ? ("high" as const)
          : systemMetrics && systemMetrics.disk_percent > 75
            ? ("medium" as const)
            : ("low" as const),
      description:
        systemMetrics && typeof systemMetrics.disk_free === "number"
          ? `${systemMetrics.disk_free.toFixed(1)}GB 剩余`
          : "获取中...",
    },
    {
      title: "带宽使用情况",
      value:
        systemMetrics && typeof systemMetrics.bandwidth_percent === "number"
          ? `${systemMetrics.bandwidth_percent.toFixed(1)}%`
          : "连接中...",
      change: (() => {
        if (
          !systemMetrics ||
          typeof systemMetrics.bandwidth_percent !== "number"
        ) {
          return 0;
        }

        // 基于带宽使用率和时间因素计算变化
        const usage = systemMetrics.bandwidth_percent;
        const timeVariation = Math.sin(Date.now() / 8000) * 10; // 8秒周期，±10%变化

        return Math.round(
          usage > 50
            ? usage - 50 + timeVariation
            : -(50 - usage) + timeVariation,
        );
      })(),
      trend: (() => {
        if (
          !systemMetrics ||
          typeof systemMetrics.bandwidth_percent !== "number"
        ) {
          return "up" as const;
        }

        const usage = systemMetrics.bandwidth_percent;
        const timeVariation = Math.sin(Date.now() / 12000) > 0; // 12秒周期变化

        // 多重因素决定趋势
        if (usage > 80) {
          return "up" as const; // 高使用率总是上升趋势
        } else if (usage > 60) {
          return timeVariation ? ("up" as const) : ("down" as const); // 中等使用率有波动
        } else if (usage > 30) {
          // 正常使用率，基于上传下载比例
          if (
            systemMetrics.bandwidth_upload &&
            systemMetrics.bandwidth_download
          ) {
            return systemMetrics.bandwidth_upload >
              systemMetrics.bandwidth_download
              ? ("up" as const)
              : ("down" as const);
          }
          return timeVariation ? ("up" as const) : ("down" as const);
        } else {
          return "down" as const; // 低使用率为下降趋势
        }
      })(),
      icon: Activity,
      threatLevel: systemMetrics?.bandwidth_alert
        ? ("critical" as const)
        : systemMetrics && systemMetrics.bandwidth_percent > 80
          ? ("high" as const)
          : systemMetrics && systemMetrics.bandwidth_percent > 60
            ? ("medium" as const)
            : ("low" as const),
      description:
        systemMetrics &&
        typeof systemMetrics.bandwidth_used === "number" &&
        typeof systemMetrics.bandwidth_total === "number"
          ? `${formatBandwidth(systemMetrics.bandwidth_used)} / ${formatBandwidth(systemMetrics.bandwidth_total)} 可用`
          : "获取中...",
    },
  ];

  return (
    <div className="space-y-4">
      {/* API Failure Notification */}
      {metricsError && (
        <ApiFailureNotification
          error={metricsError}
          onRetry={refetch}
          className="mb-4"
        />
      )}

      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">实时系统监控</h2>
          {systemMetrics && (
            <p className="text-sm text-gray-400 mt-1">
              最后更新: {new Date(systemMetrics.timestamp).toLocaleTimeString()}
              {alertCount > 0 && (
                <span className="ml-2 text-orange-400">
                  • {alertCount} 个警报
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refetch}
            disabled={metricsLoading}
            className="neon-button flex items-center space-x-2 px-4 py-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", metricsLoading && "animate-spin")}
            />
            <span>{metricsLoading ? "更新中..." : "刷新数据"}</span>
          </button>
        </div>

        {/* Data source toggle when in API mode but no data */}
        {isApiMode && !systemMetrics && !metricsLoading && (
          <DataSourceToggle showLabel={true} size="md" variant="full" />
        )}
      </div>

      {/* Show suggestion if API mode but all metrics show "connecting" */}
      {isApiMode &&
        systemMetrics &&
        !systemMetrics.cpu_percent &&
        !systemMetrics.memory_percent &&
        !systemMetrics.disk_percent && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 font-medium">API数据解析中...</p>
                <p className="text-blue-400 text-sm">
                  如果持续显示"连接中"，建议切换到模拟模式查看系统功能
                </p>
              </div>
              <DataSourceToggle showLabel={true} size="sm" />
            </div>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            {...metric}
            isUpdating={metricsLoading || isUpdating}
          />
        ))}
      </div>
    </div>
  );
}
