import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Download,
  AlertTriangle,
  RefreshCw,
  Target,
  Shield,
  Brain,
  Activity,
  Network,
  Bug,
  FileSearch,
  Clock,
  TrendingUp,
  CheckCircle,
  Globe,
  Server,
  Zap,
  Eye,
  Database,
} from "lucide-react";
import { useIPInvestigation } from "@/hooks/useIPInvestigation";
import { useAdvancedInvestigation } from "@/hooks/useAdvancedInvestigation";
import { TopologyAnalysis } from "@/components/TopologyAnalysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EvidenceCollection: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialIP = searchParams.get("ip") || "";

  const [searchIP, setSearchIP] = useState(initialIP);
  const [selectedIP, setSelectedIP] = useState(initialIP);
  const [investigationMode, setInvestigationMode] = useState<
    "basic" | "advanced"
  >("basic");

  const {
    investigation: basicInvestigation,
    loading: basicLoading,
    error: basicError,
    investigateIP: basicInvestigateIP,
    generateReport: basicGenerateReport,
  } = useIPInvestigation(
    investigationMode === "basic" ? selectedIP : undefined,
  );

  const {
    investigation: advancedInvestigation,
    loading: advancedLoading,
    error: advancedError,
    investigateIP: advancedInvestigateIP,
    exportInvestigation,
  } = useAdvancedInvestigation(
    investigationMode === "advanced" ? selectedIP : undefined,
  );

  const investigation =
    investigationMode === "advanced"
      ? advancedInvestigation
      : basicInvestigation;
  const loading =
    investigationMode === "advanced" ? advancedLoading : basicLoading;
  const error = investigationMode === "advanced" ? advancedError : basicError;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIP.trim()) {
      setSelectedIP(searchIP.trim());
      setSearchParams({ ip: searchIP.trim(), mode: investigationMode });
    }
  };

  const handleExport = (format: string) => {
    if (investigationMode === "advanced" && advancedInvestigation) {
      exportInvestigation(format);
    } else if (basicInvestigation) {
      const report = basicGenerateReport();
      if (report) {
        const content = JSON.stringify(report, null, 2);
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `investigation_${selectedIP}_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-400 bg-red-400/20 border-red-400/40";
    if (score >= 60)
      return "text-orange-400 bg-orange-400/20 border-orange-400/40";
    if (score >= 40)
      return "text-amber-400 bg-amber-400/20 border-amber-400/40";
    return "text-green-400 bg-green-400/20 border-green-400/40";
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case "malicious":
        return "text-red-400 bg-red-400/20 border-red-400/40";
      case "suspicious":
        return "text-amber-400 bg-amber-400/20 border-amber-400/40";
      case "unknown":
        return "text-gray-400 bg-gray-400/20 border-gray-400/40";
      case "clean":
        return "text-green-400 bg-green-400/20 border-green-400/40";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/40";
    }
  };

  // 图表数据准备
  const pieColors = [
    "#00f5ff",
    "#39ff14",
    "#bf00ff",
    "#ff1493",
    "#ff6600",
    "#ffff00",
  ];

  const attackTypeData =
    investigation && investigationMode === "basic"
      ? Object.entries((investigation as any).attackTypes || {}).map(
          ([type, count]) => ({
            name: type.replace("_", " "),
            value: count,
            count,
          }),
        )
      : [];

  const protocolData =
    investigation && investigationMode === "advanced"
      ? Object.entries(
          (investigation as any).networkAnalysis?.protocols || {},
        ).map(([protocol, count]) => ({
          name: protocol,
          value: count,
          count,
        }))
      : [];

  return (
    <div className="min-h-screen bg-matrix-bg text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 neon-text flex items-center justify-center gap-3">
            <FileSearch className="w-8 h-8 text-quantum-500" />
            证据收集与威胁调查
          </h1>
          <p className="text-muted-foreground">高效IP威胁分析平台</p>
        </div>

        {/* 搜索区域 */}
        <div className="cyber-card p-6">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                IP 地址
              </label>
              <Input
                type="text"
                placeholder="输入要调查的IP地址"
                value={searchIP}
                onChange={(e) => setSearchIP(e.target.value)}
                className="bg-matrix-surface border-matrix-border text-white h-12"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                模式
              </label>
              <select
                value={investigationMode}
                onChange={(e) =>
                  setInvestigationMode(e.target.value as "basic" | "advanced")
                }
                className="w-full h-12 px-3 bg-matrix-surface border border-matrix-border rounded-md text-white"
              >
                <option value="basic">基础</option>
                <option value="advanced">高级</option>
              </select>
            </div>
            <Button
              type="submit"
              className="neon-button-purple h-12 px-8"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Search className="w-5 h-5 mr-2" />
              )}
              {loading ? "调查中..." : "开始调查"}
            </Button>
          </form>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="cyber-card text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-quantum-500/30 border-t-quantum-500 rounded-full animate-spin"></div>
                <Brain className="w-8 h-8 text-quantum-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-quantum-300">
                  正在分析 {selectedIP}
                </h3>
                <p className="text-muted-foreground">
                  {investigationMode === "advanced"
                    ? "执行深度威胁分析..."
                    : "收集基础威胁信息..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="cyber-card border-red-500/30 bg-red-500/10 p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">调查失败</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 调查结果 - 紧凑布局 */}
        {investigation && !loading && (
          <div className="space-y-4">
            {/* 基础信息卡片 - 水平布局 */}
            <div className="cyber-card p-4">
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-quantum-400 mb-1">
                    {investigationMode === "advanced"
                      ? (investigation as any).basicInfo?.riskScore || 0
                      : (investigation as any).riskScore || 0}
                    /100
                  </div>
                  <div className="text-sm text-muted-foreground">风险评分</div>
                </div>

                <div>
                  <div className="text-2xl font-bold text-tech-accent mb-1">
                    {investigationMode === "advanced"
                      ? (investigation as any).networkAnalysis?.connections
                          ?.length || 0
                      : (investigation as any).totalAttacks || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {investigationMode === "advanced" ? "网络连接" : "攻击次数"}
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-bold text-neural-500 mb-1">
                    {investigationMode === "advanced"
                      ? (investigation as any).threatIntelligence?.blacklists
                          ?.length || 0
                      : Object.keys((investigation as any).attackTypes || {})
                          .length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {investigationMode === "advanced" ? "威胁情报" : "攻击类型"}
                  </div>
                </div>

                <div>
                  <Badge
                    className={cn(
                      "px-3 py-1",
                      investigationMode === "advanced"
                        ? getReputationColor(
                            (investigation as any).basicInfo?.reputation ||
                              "unknown",
                          )
                        : getReputationColor(
                            (investigation as any).reputation || "unknown",
                          ),
                    )}
                  >
                    {investigationMode === "advanced"
                      ? (investigation as any).basicInfo?.reputation ===
                        "malicious"
                        ? "恶意"
                        : (investigation as any).basicInfo?.reputation ===
                            "suspicious"
                          ? "可疑"
                          : (investigation as any).basicInfo?.reputation ===
                              "clean"
                            ? "干净"
                            : "未知"
                      : (investigation as any).reputation === "malicious"
                        ? "恶意"
                        : (investigation as any).reputation === "suspicious"
                          ? "可疑"
                          : (investigation as any).reputation === "clean"
                            ? "干净"
                            : "未知"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 详细分析面板 */}
            {investigationMode === "advanced" ? (
              <Tabs defaultValue="topology" className="space-y-4">
                <TabsList className="bg-matrix-surface border border-matrix-border">
                  <TabsTrigger
                    value="topology"
                    className="flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    网络拓扑
                  </TabsTrigger>
                  <TabsTrigger
                    value="network"
                    className="flex items-center gap-2"
                  >
                    <Network className="w-4 h-4" />
                    网络分析
                  </TabsTrigger>
                  <TabsTrigger
                    value="threats"
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    威胁情报
                  </TabsTrigger>
                  <TabsTrigger
                    value="malware"
                    className="flex items-center gap-2"
                  >
                    <Bug className="w-4 h-4" />
                    恶意软件
                  </TabsTrigger>
                  <TabsTrigger
                    value="forensics"
                    className="flex items-center gap-2"
                  >
                    <FileSearch className="w-4 h-4" />
                    取证分析
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="topology" className="space-y-4">
                  <TopologyAnalysis
                    investigation={investigation}
                    centerIP={selectedIP}
                  />
                </TabsContent>

                <TabsContent value="network" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5 text-tech-accent" />
                        开放端口 (
                        {(investigation as any).networkAnalysis?.openPorts
                          ?.length || 0}
                        )
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {(
                          (investigation as any).networkAnalysis?.openPorts ||
                          []
                        )
                          .slice(0, 8)
                          .map((port: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-matrix-surface/50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn(
                                    "px-2 py-1 text-xs",
                                    port.status === "open"
                                      ? "bg-green-500/20 text-green-400 border-green-500/40"
                                      : port.status === "closed"
                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                        : "bg-amber-500/20 text-amber-400 border-amber-500/40",
                                  )}
                                >
                                  {port.port}/{port.protocol}
                                </Badge>
                                <span className="text-white text-sm">
                                  {port.service}
                                </span>
                              </div>
                              <span className="text-muted-foreground text-xs">
                                {new Date(port.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        协议分布
                      </h3>
                      {protocolData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={protocolData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
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
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Activity className="w-12 h-12 mx-auto mb-2" />
                          <p>暂无协议数据</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="threats" className="space-y-4">
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Database className="w-5 h-5 text-red-400" />
                      威胁检测结果
                    </h3>
                    {(
                      (investigation as any).threatIntelligence?.blacklists ||
                      []
                    ).length > 0 ? (
                      <div className="space-y-3">
                        {(
                          investigation as any
                        ).threatIntelligence.blacklists.map(
                          (blacklist: string, index: number) => (
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
                        <p>未发现威胁</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="malware" className="space-y-4">
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Bug className="w-5 h-5 text-red-400" />
                      恶意软件检测
                    </h3>
                    {((investigation as any).malwareAnalysis?.signatures || [])
                      .length > 0 ? (
                      <div className="space-y-4">
                        {(investigation as any).malwareAnalysis.signatures.map(
                          (signature: any, index: number) => (
                            <div
                              key={index}
                              className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
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
                              <div className="text-xs text-muted-foreground">
                                MD5:{" "}
                                <code className="text-neon-blue">
                                  {signature.md5}
                                </code>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="w-12 h-12 mx-auto mb-2 text-green-400" />
                        <p>未发现恶意软件</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="forensics" className="space-y-4">
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileSearch className="w-5 h-5 text-tech-accent" />
                      取证工件 (
                      {
                        ((investigation as any).forensics?.artifacts || [])
                          .length
                      }
                      )
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {((investigation as any).forensics?.artifacts || [])
                        .slice(0, 10)
                        .map((artifact: any, index: number) => (
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
                                      artifact.risk === "critical"
                                        ? 90
                                        : artifact.risk === "high"
                                          ? 70
                                          : artifact.risk === "medium"
                                            ? 50
                                            : 20,
                                    ),
                                  )}
                                >
                                  {artifact.type}
                                </Badge>
                                <span className="font-medium text-white">
                                  {artifact.artifact}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {artifact.description}
                              </p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {new Date(artifact.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              /* 基础模式 - 包含拓扑图的简化展示 */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 左侧：网络拓扑 */}
                <div className="lg:col-span-2">
                  <TopologyAnalysis
                    investigation={investigation}
                    centerIP={selectedIP}
                  />
                </div>

                {/* 右侧：基础信息 */}
                <div className="space-y-4">
                  <div className="cyber-card p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      基础信息
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IP地址:</span>
                        <span className="text-white font-mono">
                          {(investigation as any).ip}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">地理位置:</span>
                        <span className="text-white">
                          {(investigation as any).country}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">组织:</span>
                        <span className="text-white">
                          {(investigation as any).organization}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">首次发现:</span>
                        <span className="text-white">
                          {new Date(
                            (investigation as any).firstSeen,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">最后活动:</span>
                        <span className="text-white">
                          {new Date(
                            (investigation as any).lastActivity,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="cyber-card p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      攻击类型
                    </h3>
                    {attackTypeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={attackTypeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {attackTypeData.map((entry, index) => (
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
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Activity className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">暂无攻击数据</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 导出按钮 - 移到右上角 */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                onClick={() => handleExport("JSON")}
                className="neon-button-green shadow-lg"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>
        )}

        {/* 无调查状态 */}
        {!selectedIP && !loading && (
          <div className="cyber-card text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-quantum-500 to-neural-500 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  开始威胁调查
                </h3>
                <p className="text-muted-foreground">输入IP地址开始安全分析</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceCollection;
