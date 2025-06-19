import React from "react";
import {
  X,
  Shield,
  Globe,
  Server,
  Router,
  Monitor,
  Database,
  Cloud,
  Wifi,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NodeDetailModalProps {
  node: any;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !node) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "target":
        return <Shield className="w-6 h-6 text-quantum-500" />;
      case "router":
        return <Router className="w-6 h-6 text-tech-accent" />;
      case "server":
        return <Server className="w-6 h-6 text-neural-500" />;
      case "internet":
        return <Globe className="w-6 h-6 text-blue-400" />;
      case "device":
        return <Monitor className="w-6 h-6 text-green-400" />;
      case "database":
        return <Database className="w-6 h-6 text-amber-400" />;
      case "cloud":
        return <Cloud className="w-6 h-6 text-red-400" />;
      default:
        return <Wifi className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-400 bg-red-400/20 border-red-400/40";
      case "high":
        return "text-orange-400 bg-orange-400/20 border-orange-400/40";
      case "medium":
        return "text-amber-400 bg-amber-400/20 border-amber-400/40";
      case "low":
        return "text-green-400 bg-green-400/20 border-green-400/40";
      default:
        return "text-blue-400 bg-blue-400/20 border-blue-400/40";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "inactive":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "blocked":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  // 模拟详细数据
  const getNodeDetails = (nodeData: any) => {
    const baseDetails = {
      label: nodeData.label,
      ip: nodeData.ip,
      type: nodeData.type,
      risk: nodeData.risk,
      ports: nodeData.ports || [],
    };

    // 根据节点类型添加特定信息
    switch (nodeData.type) {
      case "target":
        return {
          ...baseDetails,
          status: "monitored",
          threats: 3,
          connections: 8,
          lastScan: "2024-01-15 14:32:15",
          vulnerabilities: ["CVE-2023-1234", "CVE-2023-5678"],
          location: "内网核心区域",
        };
      case "server":
        return {
          ...baseDetails,
          status: "active",
          service: "Web Server",
          uptime: "99.9%",
          load: "45%",
          lastActivity: "刚刚",
          os: "Linux Ubuntu 20.04",
        };
      case "router":
        return {
          ...baseDetails,
          status: "active",
          throughput: "1.2 Gbps",
          connectedDevices: 15,
          firmwareVersion: "v2.1.4",
          lastUpdate: "2024-01-10",
        };
      case "cloud":
        return {
          ...baseDetails,
          status: "threat",
          threatType: "Botnet C&C",
          confidence: "85%",
          firstSeen: "2024-01-12",
          country: "Unknown",
        };
      default:
        return {
          ...baseDetails,
          status: "unknown",
          lastSeen: "2024-01-15 10:30:00",
        };
    }
  };

  const details = getNodeDetails(node.data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg mx-4">
        <div className="cyber-card border-2 border-quantum-500/30 p-6">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {getNodeIcon(details.type)}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {details.label}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {details.ip}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 状态和风险 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              {getStatusIcon(details.status)}
              <span className="text-sm text-white">
                状态:{" "}
                {details.status === "active"
                  ? "活跃"
                  : details.status === "monitored"
                    ? "监控中"
                    : details.status === "threat"
                      ? "威胁"
                      : "未知"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("px-2 py-1", getRiskColor(details.risk))}>
                {details.risk === "critical"
                  ? "严重"
                  : details.risk === "high"
                    ? "高危"
                    : details.risk === "medium"
                      ? "中危"
                      : details.risk === "low"
                        ? "低危"
                        : "正常"}
              </Badge>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                基础信息
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">类型:</span>
                  <span className="text-white">{details.type}</span>
                </div>
                {details.service && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">服务:</span>
                    <span className="text-white">{details.service}</span>
                  </div>
                )}
                {details.os && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">系统:</span>
                    <span className="text-white">{details.os}</span>
                  </div>
                )}
                {details.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">位置:</span>
                    <span className="text-white">{details.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 端口信息 */}
            {details.ports.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  开放端口
                </h4>
                <div className="flex flex-wrap gap-1">
                  {details.ports.map((port: any, index: number) => (
                    <Badge
                      key={index}
                      className="bg-tech-accent/20 text-tech-accent border-tech-accent/40 text-xs"
                    >
                      {port}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 性能指标 */}
            {(details.uptime || details.load || details.throughput) && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  性能指标
                </h4>
                <div className="space-y-2 text-sm">
                  {details.uptime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">运行时间:</span>
                      <span className="text-green-400">{details.uptime}</span>
                    </div>
                  )}
                  {details.load && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">负载:</span>
                      <span className="text-amber-400">{details.load}</span>
                    </div>
                  )}
                  {details.throughput && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">吞吐量:</span>
                      <span className="text-blue-400">
                        {details.throughput}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 威胁信息 */}
            {details.threatType && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  威胁信息
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">威胁类型:</span>
                    <span className="text-red-400">{details.threatType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">置信度:</span>
                    <span className="text-red-400">{details.confidence}</span>
                  </div>
                  {details.firstSeen && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">首次发现:</span>
                      <span className="text-white">{details.firstSeen}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 漏洞信息 */}
            {details.vulnerabilities && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  已知漏洞
                </h4>
                <div className="space-y-1">
                  {details.vulnerabilities.map(
                    (vuln: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-red-500/20 text-red-400 border-red-500/40 text-xs mr-1"
                      >
                        {vuln}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-6">
            <Button size="sm" className="neon-button flex-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              详细分析
            </Button>
            <Button size="sm" className="neon-button-green">
              <Activity className="w-4 h-4 mr-1" />
              监控
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
