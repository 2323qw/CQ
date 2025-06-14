import { useState } from "react";
import {
  X,
  MapPin,
  Clock,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  source: string;
  location: string;
  timestamp: string;
  status: "active" | "investigating" | "resolved";
  severity: number;
}

interface AlertDetailModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (alertId: string, status: Alert["status"]) => void;
}

export function AlertDetailModal({
  alert,
  isOpen,
  onClose,
  onUpdateStatus,
}: AlertDetailModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !alert) return null;

  const handleStatusUpdate = async (newStatus: Alert["status"]) => {
    setIsProcessing(true);
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onUpdateStatus(alert.id, newStatus);
    setIsProcessing(false);

    if (window.showToast) {
      window.showToast({
        title: "状态更新成功",
        description: `告警 ${alert.title} 已标记为${getStatusText(newStatus)}`,
        type: "success",
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃";
      case "investigating":
        return "调查中";
      case "resolved":
        return "���解决";
      default:
        return "未知";
    }
  };

  const getThreatColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-threat-critical";
      case "high":
        return "text-threat-high";
      case "medium":
        return "text-threat-medium";
      case "low":
        return "text-threat-low";
      default:
        return "text-threat-info";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "critical":
        return "严重";
      case "high":
        return "高危";
      case "medium":
        return "中危";
      case "low":
        return "低危";
      default:
        return "信息";
    }
  };

  // 模拟详细信息
  const detailInfo = {
    attackVector: "网络攻击",
    targetAssets: ["Web服务器", "数据库服务器"],
    impactLevel: "高",
    confidence: "95%",
    recommendation: "立即阻止来源IP，加强防火墙规则，进行深度安全扫描",
    relatedAlerts: ["ALT-2024-001", "ALT-2024-003"],
    technicalDetails: `检测时间: ${alert.timestamp}
攻击类型: ${alert.title}
来源地址: ${alert.source}
目标端口: 80, 443, 22
攻击模式: 分布式攻击
数据包大小: 1024-2048 bytes
持续时间: 15分钟`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="cyber-card border-2 border-neon-blue/30">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-matrix-border">
            <div className="flex items-center space-x-3">
              <AlertTriangle
                className={cn("w-6 h-6", getThreatColor(alert.type))}
              />
              <div>
                <h2 className="text-xl font-bold text-white">{alert.title}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span
                    className={cn(
                      "text-sm px-2 py-1 rounded bg-current/20",
                      getThreatColor(alert.type),
                    )}
                  >
                    {getTypeText(alert.type)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    风险评分: {alert.severity}/10
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* 主要信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  告警详情
                </h3>
                <div className="bg-matrix-surface rounded-lg p-4 space-y-3">
                  <p className="text-muted-foreground">{alert.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-neon-blue" />
                      <span className="text-muted-foreground">来源:</span>
                      <span className="text-white font-mono">
                        {alert.source}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-neon-blue" />
                      <span className="text-muted-foreground">位置:</span>
                      <span className="text-white">{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-neon-blue" />
                      <span className="text-muted-foreground">时间:</span>
                      <span className="text-white">{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-neon-blue" />
                      <span className="text-muted-foreground">置信度:</span>
                      <span className="text-white">
                        {detailInfo.confidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 技术详情 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  技术详情
                </h3>
                <div className="bg-matrix-surface rounded-lg p-4">
                  <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                    {detailInfo.technicalDetails}
                  </pre>
                </div>
              </div>

              {/* 推荐措施 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  推荐措施
                </h3>
                <div className="bg-matrix-surface rounded-lg p-4">
                  <p className="text-muted-foreground">
                    {detailInfo.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* 侧边栏操作 */}
            <div className="space-y-6">
              {/* 状态操作 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  状态操作
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">当前状态:</span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded",
                        alert.status === "active" &&
                          "bg-threat-critical/20 text-threat-critical",
                        alert.status === "investigating" &&
                          "bg-threat-medium/20 text-threat-medium",
                        alert.status === "resolved" &&
                          "bg-threat-low/20 text-threat-low",
                      )}
                    >
                      {getStatusText(alert.status)}
                    </span>
                  </div>

                  {alert.status !== "investigating" && (
                    <button
                      onClick={() => handleStatusUpdate("investigating")}
                      disabled={isProcessing}
                      className="w-full neon-button flex items-center justify-center space-x-2 py-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>开始调查</span>
                    </button>
                  )}

                  {alert.status !== "resolved" && (
                    <button
                      onClick={() => handleStatusUpdate("resolved")}
                      disabled={isProcessing}
                      className="w-full bg-neon-green/10 border border-neon-green text-neon-green hover:bg-neon-green/20 px-4 py-2 rounded transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>标记为已解决</span>
                    </button>
                  )}

                  {alert.status === "investigating" && (
                    <button
                      onClick={() => handleStatusUpdate("active")}
                      disabled={isProcessing}
                      className="w-full bg-threat-medium/10 border border-threat-medium text-threat-medium hover:bg-threat-medium/20 px-4 py-2 rounded transition-colors flex items-center justify-center space-x-2"
                    >
                      <Pause className="w-4 h-4" />
                      <span>暂停调查</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 影响评估 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  影响评估
                </h3>
                <div className="bg-matrix-surface rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">攻击向量:</span>
                    <span className="text-white">
                      {detailInfo.attackVector}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">影响级别:</span>
                    <span className="text-threat-high">
                      {detailInfo.impactLevel}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">受影响资产:</span>
                    <div className="mt-1 space-y-1">
                      {detailInfo.targetAssets.map((asset, index) => (
                        <div
                          key={index}
                          className="text-white bg-matrix-accent px-2 py-1 rounded text-xs"
                        >
                          {asset}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 相关告警 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  相关告警
                </h3>
                <div className="space-y-2">
                  {detailInfo.relatedAlerts.map((alertId, index) => (
                    <div
                      key={index}
                      className="bg-matrix-surface rounded px-3 py-2 text-sm"
                    >
                      <span className="text-neon-blue font-mono">
                        {alertId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
