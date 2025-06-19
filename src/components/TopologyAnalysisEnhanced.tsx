import React, { useState, useMemo } from "react";
import {
  Network,
  Target,
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  Eye,
  Layers,
  Zap,
  Share2,
  BarChart3,
  Globe,
  Server,
  Router,
  Database,
  Monitor,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkTopologyInternational } from "./NetworkTopologyInternational";
import { generateTopologyDemoData } from "@/utils/topologyDemoData";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface TopologyAnalysisEnhancedProps {
  investigation: any;
  centerIP: string;
  className?: string;
}

// 生成网络性能数据
const generatePerformanceData = () => {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      latency: Math.floor(Math.random() * 50) + 10,
      throughput: Math.floor(Math.random() * 100) + 50,
      errors: Math.floor(Math.random() * 10),
      packets: Math.floor(Math.random() * 1000) + 500,
    });
  }
  return data;
};

// 生成设备类型分布数据
const generateDeviceDistribution = () => [
  { name: "服务器", value: 8, icon: Server, color: "#00f5ff" },
  { name: "路由器", value: 4, icon: Router, color: "#39ff14" },
  { name: "数据库", value: 3, icon: Database, color: "#ffaa00" },
  { name: "终端设备", value: 12, icon: Monitor, color: "#bf00ff" },
  { name: "网络设备", value: 6, icon: Network, color: "#ff6600" },
];

// 生成协议分析数据
const generateProtocolAnalysis = () => [
  { protocol: "HTTPS", connections: 45, bandwidth: 2.3, security: "high" },
  { protocol: "HTTP", connections: 32, bandwidth: 1.8, security: "medium" },
  { protocol: "SSH", connections: 18, bandwidth: 0.5, security: "high" },
  { protocol: "FTP", connections: 8, bandwidth: 0.8, security: "low" },
  { protocol: "DNS", connections: 15, bandwidth: 0.2, security: "medium" },
  { protocol: "SMTP", connections: 6, bandwidth: 0.3, security: "medium" },
];

// 生成威胁传播路径数据
const generateThreatPaths = (centerIP: string) => [
  {
    id: 1,
    source: "185.220.101.42",
    target: centerIP,
    hops: ["203.45.67.89", "192.168.1.1", centerIP],
    protocol: "TCP",
    risk: "critical",
    bandwidth: 156,
    blocked: false,
  },
  {
    id: 2,
    source: "159.89.214.31",
    target: centerIP,
    hops: ["172.16.0.1", "192.168.1.254", centerIP],
    protocol: "UDP",
    risk: "high",
    bandwidth: 89,
    blocked: true,
  },
  {
    id: 3,
    source: "94.142.241.194",
    target: centerIP,
    hops: ["10.0.0.1", "192.168.2.1", centerIP],
    protocol: "ICMP",
    risk: "medium",
    bandwidth: 34,
    blocked: false,
  },
];

export const TopologyAnalysisEnhanced: React.FC<
  TopologyAnalysisEnhancedProps
> = ({ investigation, centerIP, className }) => {
  const [activeView, setActiveView] = useState<
    "topology" | "analysis" | "paths" | "performance" | "devices"
  >("topology");
  const [topologyViewMode, setTopologyViewMode] = useState<
    "default" | "threats" | "performance" | "simplified"
  >("default");

  // 如果没有调查数据，使用演示数据
  const displayData = investigation || generateTopologyDemoData(centerIP);

  // 生成分析数据
  const performanceData = useMemo(() => generatePerformanceData(), []);
  const deviceDistribution = useMemo(() => generateDeviceDistribution(), []);
  const protocolAnalysis = useMemo(() => generateProtocolAnalysis(), []);
  const threatPaths = useMemo(() => generateThreatPaths(centerIP), [centerIP]);

  // 计算高级网络统计
  const getAdvancedNetworkStats = () => {
    const connections = displayData?.networkAnalysis?.connections || [];
    const openPorts = displayData?.networkAnalysis?.openPorts || [];
    const threats = displayData?.threatIntelligence?.relatedThreats || [];

    return {
      totalConnections: connections.length,
      activeConnections: connections.filter((c: any) => c.status === "active")
        .length,
      secureConnections: connections.filter((c: any) => c.protocol === "HTTPS")
        .length,
      openPorts: openPorts.length,
      criticalPorts: openPorts.filter((p: any) => p.port < 1024).length,
      suspiciousConnections: connections.filter(
        (c: any) => c.status === "timeout" || c.port < 1024,
      ).length,
      threatConnections: threats.length,
      blockedThreats: threatPaths.filter((path) => path.blocked).length,
      networkScore: Math.max(
        0,
        100 -
          threats.length * 15 -
          openPorts.filter((p: any) => p.status === "open").length * 5,
      ),
    };
  };

  const networkStats = getAdvancedNetworkStats();

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

  const getSecurityColor = (security: string) => {
    switch (security) {
      case "high":
        return "text-green-400";
      case "medium":
        return "text-amber-400";
      case "low":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 增强的网络统计面板 */}
      <div className="cyber-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-quantum-400">
              {networkStats.totalConnections}
            </div>
            <div className="text-xs text-muted-foreground">总连接</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">
              {networkStats.activeConnections}
            </div>
            <div className="text-xs text-muted-foreground">活跃</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              {networkStats.secureConnections}
            </div>
            <div className="text-xs text-muted-foreground">安全</div>
          </div>
          <div>
            <div className="text-xl font-bold text-tech-accent">
              {networkStats.openPorts}
            </div>
            <div className="text-xs text-muted-foreground">开放端口</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-400">
              {networkStats.threatConnections}
            </div>
            <div className="text-xs text-muted-foreground">威胁</div>
          </div>
          <div>
            <div className="text-xl font-bold text-orange-400">
              {networkStats.suspiciousConnections}
            </div>
            <div className="text-xs text-muted-foreground">可疑</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">
              {networkStats.blockedThreats}
            </div>
            <div className="text-xs text-muted-foreground">已阻断</div>
          </div>
          <div>
            <div
              className={cn(
                "text-xl font-bold",
                networkStats.networkScore > 80
                  ? "text-green-400"
                  : networkStats.networkScore > 60
                    ? "text-amber-400"
                    : "text-red-400",
              )}
            >
              {networkStats.networkScore}
            </div>
            <div className="text-xs text-muted-foreground">安全评分</div>
          </div>
        </div>
      </div>

      {/* 视图模式选择器 */}
      <div className="flex items-center justify-between">
        <Tabs
          value={activeView}
          onValueChange={(value: any) => setActiveView(value)}
        >
          <TabsList className="bg-matrix-surface border border-matrix-border">
            <TabsTrigger value="topology" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Topology
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="paths" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Threat Paths
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Devices
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 拓扑视图模式选择 */}
        {activeView === "topology" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={topologyViewMode === "default" ? "default" : "outline"}
              onClick={() => setTopologyViewMode("default")}
              className="text-xs"
            >
              默认
            </Button>
            <Button
              size="sm"
              variant={topologyViewMode === "threats" ? "default" : "outline"}
              onClick={() => setTopologyViewMode("threats")}
              className="text-xs"
            >
              威胁视图
            </Button>
            <Button
              size="sm"
              variant={
                topologyViewMode === "performance" ? "default" : "outline"
              }
              onClick={() => setTopologyViewMode("performance")}
              className="text-xs"
            >
              性能视图
            </Button>
          </div>
        )}
      </div>

      <Tabs
        value={activeView}
        onValueChange={(value: any) => setActiveView(value)}
      >
        {/* 智能网络拓扑 */}
        <TabsContent value="topology" className="space-y-4">
          <div className="cyber-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-quantum-500" />
                Network Topology Analysis
              </h3>
              <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
                Target: {centerIP}
              </Badge>
            </div>
            <NetworkTopologyInternational
              investigation={displayData}
              centerIP={centerIP}
              className="h-96"
            />
          </div>
        </TabsContent>

        {/* 深度网络分析 */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 协议分�� */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-neural-500" />
                协议安全分析
              </h3>
              <div className="space-y-3">
                {protocolAnalysis.map((protocol, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs",
                            getRiskColor(
                              protocol.security === "high"
                                ? "low"
                                : protocol.security === "medium"
                                  ? "medium"
                                  : "high",
                            ),
                          )}
                        >
                          {protocol.protocol}
                        </Badge>
                        <span className="font-medium text-white">
                          {protocol.connections} 连接
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            getSecurityColor(protocol.security),
                          )}
                        >
                          {protocol.security === "high"
                            ? "安全"
                            : protocol.security === "medium"
                              ? "一般"
                              : "风险"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        带宽: {protocol.bandwidth} GB/h
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-neon-blue">
                        {(
                          (protocol.connections /
                            protocolAnalysis.reduce(
                              (acc, p) => acc + p.connections,
                              0,
                            )) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 连接状态分布 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-tech-accent" />
                连接状态分布
              </h3>
              {displayData?.networkAnalysis?.connections ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "活跃连接",
                            value: networkStats.activeConnections,
                            color: "#39ff14",
                          },
                          {
                            name: "安全连接",
                            value: networkStats.secureConnections,
                            color: "#00f5ff",
                          },
                          {
                            name: "可疑连接",
                            value: networkStats.suspiciousConnections,
                            color: "#ff6600",
                          },
                          {
                            name: "威胁连接",
                            value: networkStats.threatConnections,
                            color: "#ff0040",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { color: "#39ff14" },
                          { color: "#00f5ff" },
                          { color: "#ff6600" },
                          { color: "#ff0040" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#f8fafc",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">暂无连接数据</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 性能监控 */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 网络延迟趋势 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                网络延迟趋势
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis
                      dataKey="time"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke="#39ff14"
                      strokeWidth={2}
                      dot={{ fill: "#39ff14", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: "#39ff14", strokeWidth: 2 }}
                      name="延迟(ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 吞吐量监控 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                网络吞吐量
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient
                        id="throughputGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00f5ff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00f5ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis
                      dataKey="time"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="throughput"
                      stroke="#00f5ff"
                      strokeWidth={2}
                      fill="url(#throughputGradient)"
                      name="吞吐量(MB/s)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 错误统计 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                网络错误统计
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis
                      dataKey="time"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Bar
                      dataKey="errors"
                      fill="#ff0040"
                      radius={[2, 2, 0, 0]}
                      name="错误数量"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 数据包统计 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                数据包统计
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient
                        id="packetsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#bf00ff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#bf00ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis
                      dataKey="time"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="packets"
                      stroke="#bf00ff"
                      strokeWidth={2}
                      fill="url(#packetsGradient)"
                      name="数据包/秒"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 威胁传播路径 */}
        <TabsContent value="paths" className="space-y-4">
          <div className="cyber-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-red-400" />
              威胁传播路径分析
            </h3>
            {threatPaths.length > 0 ? (
              <div className="space-y-4">
                {threatPaths.map((path) => (
                  <div
                    key={path.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      path.blocked
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30",
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={cn("px-2 py-1", getRiskColor(path.risk))}
                        >
                          威胁路径 {path.id}
                        </Badge>
                        <span className="font-mono text-sm text-white">
                          {path.source} → {path.target}
                        </span>
                        {path.blocked && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                            已阻断
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {path.protocol} • {path.bandwidth} KB/s
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">传播路径:</span>
                      <div className="flex items-center gap-1">
                        {path.hops.map((hop, index) => (
                          <React.Fragment key={index}>
                            <span
                              className={cn(
                                "font-mono px-2 py-1 rounded",
                                hop === path.target
                                  ? "bg-quantum-500/20 text-quantum-400"
                                  : hop === path.source
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-matrix-surface text-muted-foreground",
                              )}
                            >
                              {hop}
                            </span>
                            {index < path.hops.length - 1 && (
                              <span className="text-muted-foreground">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <p className="text-sm">未发现威胁传播路径</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 设备分析 */}
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 设备类型分布 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-tech-accent" />
                设备类型分布
              </h3>
              <div className="space-y-3">
                {deviceDistribution.map((device, index) => {
                  const IconComponent = device.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded"
                          style={{ backgroundColor: `${device.color}20` }}
                        >
                          <IconComponent
                            className="w-4 h-4"
                            style={{ color: device.color }}
                          />
                        </div>
                        <span className="text-white">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {device.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          设备
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 设备状态监控 */}
            <div className="cyber-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                设备状态监控
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-xl font-bold text-green-400">28</div>
                    <div className="text-muted-foreground">在线</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-amber-400">3</div>
                    <div className="text-muted-foreground">警告</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-400">2</div>
                    <div className="text-muted-foreground">离线</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">平均CPU使用率</span>
                    <span className="text-amber-400">64%</span>
                  </div>
                  <div className="w-full bg-matrix-surface rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">内存使用率</span>
                    <span className="text-blue-400">78%</span>
                  </div>
                  <div className="w-full bg-matrix-surface rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">网络利用率</span>
                    <span className="text-green-400">45%</span>
                  </div>
                  <div className="w-full bg-matrix-surface rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
