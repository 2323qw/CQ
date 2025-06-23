import React, { useState } from "react";
import {
  Activity,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  Lock,
  Unlock,
  Zap,
  Globe,
  Server,
  Database,
  Brain,
  Eye,
  Clock,
  Target,
} from "lucide-react";
import { DISPLAY_COLORS } from "@/lib/situationDisplayColors";

interface EnhancedLeftPanelProps {
  realTimeData: any;
  isVisible: boolean;
}

export function EnhancedLeftPanel({
  realTimeData,
  isVisible,
}: EnhancedLeftPanelProps) {
  const [activeTab, setActiveTab] = useState("monitor");

  const tabs = [
    { id: "monitor", label: "实时监控", icon: Activity },
    { id: "threats", label: "威胁态势", icon: Shield },
    { id: "performance", label: "性能分析", icon: TrendingUp },
    { id: "alerts", label: "告警信息", icon: AlertTriangle },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 top-20 bottom-0 w-80 bg-gray-900/95 border-r border-gray-700 backdrop-blur-sm z-30 overflow-hidden">
      {/* 标签栏 */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-3 text-xs transition-all ${
              activeTab === tab.id
                ? "bg-neon-blue/20 text-neon-blue border-b-2 border-neon-blue"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="h-full overflow-y-auto p-4">
        {activeTab === "monitor" && (
          <RealTimeMonitorTab realTimeData={realTimeData} />
        )}
        {activeTab === "threats" && (
          <ThreatSituationTab realTimeData={realTimeData} />
        )}
        {activeTab === "performance" && (
          <PerformanceAnalysisTab realTimeData={realTimeData} />
        )}
        {activeTab === "alerts" && <AlertsTab realTimeData={realTimeData} />}
      </div>
    </div>
  );
}

/**
 * 实时监控标签页
 */
function RealTimeMonitorTab({ realTimeData }: { realTimeData: any }) {
  const systemMetrics = [
    {
      label: "CPU使用率",
      value: realTimeData?.cpuUsage || 68,
      icon: Cpu,
      color: DISPLAY_COLORS.neon.blue,
      unit: "%",
    },
    {
      label: "内存使用率",
      value: realTimeData?.memoryUsage || 72,
      icon: HardDrive,
      color: DISPLAY_COLORS.neon.green,
      unit: "%",
    },
    {
      label: "网络流量",
      value: realTimeData?.networkTraffic || 1247,
      icon: Wifi,
      color: DISPLAY_COLORS.neon.cyan,
      unit: "MB/s",
    },
    {
      label: "在线用户",
      value: realTimeData?.onlineUsers || 15423,
      icon: Users,
      color: DISPLAY_COLORS.neon.purple,
      unit: "",
    },
  ];

  const networkNodes = [
    { name: "核心路由器", status: "online", load: 68, ip: "192.168.1.1" },
    { name: "防火墙集群", status: "online", load: 45, ip: "192.168.1.10" },
    { name: "负载均衡器", status: "warning", load: 89, ip: "192.168.1.20" },
    { name: "数据库集群", status: "online", load: 56, ip: "192.168.1.100" },
    { name: "Web服务器", status: "online", load: 72, ip: "192.168.1.200" },
    { name: "缓存服务器", status: "offline", load: 0, ip: "192.168.1.300" },
  ];

  return (
    <div className="space-y-6">
      {/* 系统指标 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-blue mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          系统指标
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {systemMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon
                  className="w-4 h-4"
                  style={{ color: metric.color }}
                />
                <span className="text-xs text-gray-400">{metric.unit}</span>
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: metric.color }}
              >
                {typeof metric.value === "number" && metric.unit === "%"
                  ? metric.value
                  : metric.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">{metric.label}</div>

              {metric.unit === "%" && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${metric.value}%`,
                      backgroundColor: metric.color,
                      boxShadow: `0 0 8px ${metric.color}60`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 网络节点状态 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-green mb-3 flex items-center">
          <Server className="w-4 h-4 mr-2" />
          网络节点状态
        </h3>
        <div className="space-y-2">
          {networkNodes.map((node, index) => {
            const statusColor =
              node.status === "online"
                ? DISPLAY_COLORS.neon.green
                : node.status === "warning"
                  ? DISPLAY_COLORS.neon.orange
                  : DISPLAY_COLORS.security.critical;

            return (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: statusColor,
                        boxShadow: `0 0 6px ${statusColor}`,
                      }}
                    />
                    <span className="text-sm font-medium text-white">
                      {node.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{node.ip}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: statusColor }}>
                    {node.status === "online"
                      ? "在线"
                      : node.status === "warning"
                        ? "警告"
                        : "离线"}
                  </span>
                  <span className="text-gray-400">负载: {node.load}%</span>
                </div>

                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${node.load}%`,
                      backgroundColor:
                        node.load > 80
                          ? DISPLAY_COLORS.neon.orange
                          : statusColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 实时数据流 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-cyan mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          实时数据流
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">入站流量:</span>
              <span className="text-neon-blue">
                {(realTimeData?.inboundTraffic || 1247).toLocaleString()} MB/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">出站流量:</span>
              <span className="text-neon-green">
                {(realTimeData?.outboundTraffic || 892).toLocaleString()} MB/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">数据包/秒:</span>
              <span className="text-neon-cyan">
                {(realTimeData?.packetsPerSecond || 45672).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">连接数:</span>
              <span className="text-neon-purple">
                {(realTimeData?.activeConnections || 15423).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 威胁态势标签页
 */
function ThreatSituationTab({ realTimeData }: { realTimeData: any }) {
  const threats = [
    {
      id: 1,
      type: "DDoS攻击",
      level: "高危",
      source: "203.0.113.0/24",
      target: "Web服务器集群",
      status: "进行中",
      time: "2分钟前",
      severity: 9,
    },
    {
      id: 2,
      type: "恶意软件检测",
      level: "中危",
      source: "内部网络",
      target: "工作站-027",
      status: "已隔离",
      time: "5分钟前",
      severity: 6,
    },
    {
      id: 3,
      type: "异常登录",
      level: "低危",
      source: "未知位置",
      target: "管理员账户",
      status: "已阻止",
      time: "12分钟前",
      severity: 3,
    },
  ];

  const securityMetrics = [
    { label: "威胁等级", value: "中等", color: DISPLAY_COLORS.neon.orange },
    { label: "拦截攻击", value: "1,247", color: DISPLAY_COLORS.neon.green },
    { label: "活跃威胁", value: "3", color: DISPLAY_COLORS.security.critical },
    { label: "防护状态", value: "正常", color: DISPLAY_COLORS.neon.blue },
  ];

  return (
    <div className="space-y-6">
      {/* 威胁概览 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-red mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          威胁概览
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {securityMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
              <div
                className="text-lg font-bold"
                style={{ color: metric.color }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 实时威胁 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-orange mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          实时威胁
        </h3>
        <div className="space-y-3">
          {threats.map((threat) => {
            const severityColor =
              threat.severity >= 8
                ? DISPLAY_COLORS.security.critical
                : threat.severity >= 5
                  ? DISPLAY_COLORS.security.high
                  : DISPLAY_COLORS.security.medium;

            return (
              <div
                key={threat.id}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    {threat.type}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${severityColor}20`,
                      color: severityColor,
                      border: `1px solid ${severityColor}40`,
                    }}
                  >
                    {threat.level}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-400">
                  <div>
                    来源: <span className="text-white">{threat.source}</span>
                  </div>
                  <div>
                    目标: <span className="text-white">{threat.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      状态:{" "}
                      <span style={{ color: severityColor }}>
                        {threat.status}
                      </span>
                    </span>
                    <span>{threat.time}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center">
                  <div className="flex-1 bg-gray-700 rounded-full h-1 mr-2">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${(threat.severity / 10) * 100}%`,
                        backgroundColor: severityColor,
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: severityColor }}>
                    {threat.severity}/10
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 防护状态 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-green mb-3 flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          防护状态
        </h3>
        <div className="space-y-2">
          {[
            { name: "防火墙", status: "运行中", health: 98 },
            { name: "入侵检测", status: "运行中", health: 95 },
            { name: "恶意软件扫描", status: "运行中", health: 92 },
            { name: "数据加密", status: "运行中", health: 100 },
          ].map((system, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-neon-green" />
                <span className="text-sm text-white">{system.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neon-green">{system.status}</span>
                <span className="text-xs text-gray-400">{system.health}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 性能分析标签页
 */
function PerformanceAnalysisTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-neon-blue opacity-60" />
        <p className="text-gray-400">性能分析数据</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-neon-blue">98.7%</div>
            <div className="text-xs text-gray-400">系统可用性</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-neon-green">23ms</div>
            <div className="text-xs text-gray-400">平均响应时间</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 告警信息标签页
 */
function AlertsTab({ realTimeData }: { realTimeData: any }) {
  const alerts = [
    {
      time: "14:32:15",
      level: "ERROR",
      message: "服务器 DB-01 连接超时",
      source: "数据库",
    },
    {
      time: "14:30:42",
      level: "WARN",
      message: "CPU使用率超过阈值 85%",
      source: "系统监控",
    },
    {
      time: "14:28:33",
      level: "INFO",
      message: "防火墙规则更新完成",
      source: "安全中心",
    },
    {
      time: "14:25:18",
      level: "ERROR",
      message: "异常网络流量检测",
      source: "网络监控",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neon-orange mb-3 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2" />
        系统告警
      </h3>

      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const levelColor =
            alert.level === "ERROR"
              ? DISPLAY_COLORS.security.critical
              : alert.level === "WARN"
                ? DISPLAY_COLORS.neon.orange
                : DISPLAY_COLORS.neon.blue;

          return (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs px-2 py-1 rounded font-mono"
                  style={{
                    backgroundColor: `${levelColor}20`,
                    color: levelColor,
                  }}
                >
                  {alert.level}
                </span>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
              <div className="text-sm text-white mb-1">{alert.message}</div>
              <div className="text-xs text-gray-400">来源: {alert.source}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EnhancedLeftPanel;
