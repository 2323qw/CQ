import React, { useState } from "react";
import {
  Shield,
  Globe,
  Network,
  Bug,
  FileSearch,
  Download,
  Filter,
  Calendar,
  Map,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Hash,
  Database,
  Eye,
  Target,
  Activity,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Area,
  AreaChart,
} from "recharts";
import type { AdvancedInvestigation } from "@/hooks/useAdvancedInvestigation";

interface AdvancedInvestigationPanelProps {
  investigation: AdvancedInvestigation;
  onExport: (format: string) => void;
}

export const AdvancedInvestigationPanel: React.FC<
  AdvancedInvestigationPanelProps
> = ({ investigation, onExport }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const pieColors = [
    "#00f5ff",
    "#39ff14",
    "#bf00ff",
    "#ff1493",
    "#ff6600",
    "#ffff00",
  ];

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
        return "text-gray-400 bg-gray-400/20 border-gray-400/40";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Prepare chart data
  const protocolData = Object.entries(
    investigation.networkAnalysis.protocols,
  ).map(([protocol, count]) => ({
    name: protocol,
    value: count,
    count,
  }));

  const portData = investigation.networkAnalysis.openPorts.map((port) => ({
    port: port.port,
    status: port.status,
    service: port.service,
  }));

  const timelineData = investigation.forensics.timeline
    .slice(0, 20)
    .map((event, index) => ({
      time: new Date(event.timestamp).toLocaleDateString(),
      events: index + 1,
      severity: event.severity,
    }));

  const bandwidthData = [
    { name: "入站", value: investigation.networkAnalysis.bandwidth.inbound },
    { name: "出站", value: investigation.networkAnalysis.bandwidth.outbound },
    { name: "峰值", value: investigation.networkAnalysis.bandwidth.peak },
  ];

  return (
    <div className="space-y-8">
      {/* 操作栏 */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge
              className={cn(
                "px-3 py-1",
                investigation.basicInfo.riskScore > 70
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : investigation.basicInfo.riskScore > 40
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-green-500/20 text-green-400 border-green-500/40",
              )}
            >
              风险评分: {investigation.basicInfo.riskScore}/100
            </Badge>
            <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
              置信度: {investigation.basicInfo.confidenceLevel}%
            </Badge>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-1 bg-matrix-surface border border-matrix-border rounded text-white text-sm"
            >
              <option value="1d">最近1天</option>
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="all">全部时间</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {investigation.exportFormats.map((format) => (
              <Button
                key={format}
                onClick={() => onExport(format)}
                size="sm"
                className="neon-button-green px-3 py-1 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                {format}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* 主要标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-matrix-surface border border-matrix-border">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            概览
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            网络分析
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            威胁情报
          </TabsTrigger>
          <TabsTrigger value="malware" className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            恶意软件
          </TabsTrigger>
          <TabsTrigger value="forensics" className="flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            取证分析
          </TabsTrigger>
          <TabsTrigger value="mitigation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            缓解措施
          </TabsTrigger>
        </TabsList>

        {/* 概览标签页 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-tech-accent" />
                地理位置信息
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">国家/地区:</span>
                  <span className="text-white">
                    {investigation.geolocation.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">城市:</span>
                  <span className="text-white">
                    {investigation.geolocation.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISP:</span>
                  <span className="text-white">
                    {investigation.geolocation.isp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ASN:</span>
                  <span className="text-white">
                    {investigation.geolocation.asn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">时区:</span>
                  <span className="text-white">
                    {investigation.geolocation.timezone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">坐标:</span>
                  <span className="text-white font-mono">
                    {investigation.geolocation.lat.toFixed(4)},{" "}
                    {investigation.geolocation.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-quantum-500" />
                协议分布
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={protocolData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {protocolData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
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
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-neural-500" />
              带宽使用情况
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bandwidthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="value" fill="#00f5ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* 网络分析标签页 */}
        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-tech-accent" />
                开放端口扫描
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {investigation.networkAnalysis.openPorts.map((port, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          "px-2 py-1",
                          port.status === "open"
                            ? "bg-green-500/20 text-green-400 border-green-500/40"
                            : port.status === "closed"
                              ? "bg-red-500/20 text-red-400 border-red-500/40"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/40",
                        )}
                      >
                        {port.port}/{port.protocol}
                      </Badge>
                      <span className="text-white">{port.service}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {new Date(port.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-quantum-500" />
                网络连接
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {investigation.networkAnalysis.connections
                  .slice(0, 10)
                  .map((conn, index) => (
                    <div
                      key={index}
                      className="p-3 bg-matrix-surface/50 rounded"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-sm text-neon-blue">
                          {conn.sourceIP}:{conn.sourcePort} → {conn.destIP}:
                          {conn.destPort}
                        </span>
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs",
                            conn.status === "active"
                              ? "bg-green-500/20 text-green-400 border-green-500/40"
                              : conn.status === "closed"
                                ? "bg-gray-500/20 text-gray-400 border-gray-500/40"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/40",
                          )}
                        >
                          {conn.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{conn.protocol}</span>
                        <span>{(conn.bytes / 1024).toFixed(1)} KB</span>
                        <span>{conn.duration}s</span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 威胁情报标签页 */}
        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-400" />
                黑名单检测
              </h3>
              {investigation.threatIntelligence.blacklists.length > 0 ? (
                <div className="space-y-2">
                  {investigation.threatIntelligence.blacklists.map(
                    (blacklist, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-white">{blacklist}</span>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                          已列入
                        </Badge>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p>未发现黑名单记录</p>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-quantum-500" />
                相关威胁
              </h3>
              <div className="space-y-3">
                {investigation.threatIntelligence.relatedThreats.map(
                  (threat, index) => (
                    <div
                      key={index}
                      className="p-3 bg-matrix-surface/50 rounded"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-neon-blue">
                          {threat.ip}
                        </span>
                        <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
                          {threat.similarity}% 相似
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>风险: {threat.riskScore}/100</span>
                        <span>
                          {new Date(threat.lastSeen).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {threat.attackTypes.map((type, i) => (
                          <Badge
                            key={i}
                            className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>

          {investigation.threatIntelligence.campaigns.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                关联攻击活动
              </h3>
              <div className="flex flex-wrap gap-3">
                {investigation.threatIntelligence.campaigns.map(
                  (campaign, index) => (
                    <Badge
                      key={index}
                      className="bg-red-500/20 text-red-400 border-red-500/40 px-3 py-2"
                    >
                      {campaign}
                    </Badge>
                  ),
                )}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* 恶意软件标签页 */}
        <TabsContent value="malware" className="space-y-6">
          {investigation.malwareAnalysis.signatures.length > 0 ? (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-400" />
                恶意软件签名
              </h3>
              <div className="space-y-4">
                {investigation.malwareAnalysis.signatures.map(
                  (signature, index) => (
                    <div
                      key={index}
                      className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white">
                            {signature.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {signature.family} - {signature.type}
                          </p>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                          {signature.confidence}% 置信度
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">MD5:</span>
                          <code className="block font-mono text-neon-blue break-all">
                            {signature.md5}
                          </code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">SHA256:</span>
                          <code className="block font-mono text-neon-blue break-all">
                            {signature.sha256.substring(0, 32)}...
                          </code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            文件大小:
                          </span>
                          <span className="text-white">
                            {" "}
                            {(signature.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            首次发现:
                          </span>
                          <span className="text-white">
                            {" "}
                            {new Date(signature.firstSeen).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  未发现恶意软件
                </h3>
                <p className="text-muted-foreground">
                  该IP地址没有检测到恶意软件签名
                </p>
              </div>
            </Card>
          )}

          {investigation.malwareAnalysis.behaviors.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                恶意行为分析
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {investigation.malwareAnalysis.behaviors.map(
                  (behavior, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-white">{behavior}</span>
                    </div>
                  ),
                )}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* 取证分析标签页 */}
        <TabsContent value="forensics" className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-tech-accent" />
              取证工件
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {investigation.forensics.artifacts.map((artifact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge
                        className={cn(
                          "px-2 py-1 text-xs",
                          getRiskColor(artifact.risk),
                        )}
                      >
                        {artifact.type}
                      </Badge>
                      <span className="font-medium text-white">
                        {artifact.artifact}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {artifact.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>位置: {artifact.location}</span>
                      <span>哈希: {artifact.hash.substring(0, 16)}...</span>
                      {artifact.size && (
                        <span>
                          大小: {(artifact.size / 1024).toFixed(1)} KB
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {new Date(artifact.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-quantum-500" />
              事件时间线
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {investigation.forensics.timeline.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border-l-2 border-l-quantum-500/30 bg-matrix-surface/30"
                >
                  <Badge
                    className={cn(
                      "px-2 py-1 text-xs flex-shrink-0",
                      getRiskColor(event.severity),
                    )}
                  >
                    {event.source}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-white text-sm">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 缓解措施标签页 */}
        <TabsContent value="mitigation" className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              缓解状态
            </h3>
            <div className="mb-6">
              <Badge
                className={cn(
                  "px-4 py-2",
                  investigation.mitigation.status === "full"
                    ? "bg-green-500/20 text-green-400 border-green-500/40"
                    : investigation.mitigation.status === "partial"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                      : "bg-red-500/20 text-red-400 border-red-500/40",
                )}
              >
                {investigation.mitigation.status === "full"
                  ? "完全缓解"
                  : investigation.mitigation.status === "partial"
                    ? "部分缓解"
                    : "未缓解"}
              </Badge>
            </div>

            <h4 className="font-semibold text-white mb-3">已采取措施</h4>
            <div className="space-y-3 mb-6">
              {investigation.mitigation.actions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(action.status)}
                    <span className="text-white">{action.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(action.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-white mb-3">建议措施</h4>
            <div className="space-y-2">
              {investigation.mitigation.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-quantum-500/10 border border-quantum-500/30 rounded"
                  >
                    <TrendingUp className="w-4 h-4 text-quantum-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">{recommendation}</span>
                  </div>
                ),
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
