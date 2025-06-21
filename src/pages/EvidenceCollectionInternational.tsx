import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Download,
  AlertTriangle,
  RefreshCw,
  Shield,
  Activity,
  Network,
  Bug,
  FileSearch,
  TrendingUp,
  CheckCircle,
  Globe,
  Server,
  Eye,
  Database,
  Zap,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Filter,
  Play,
  Settings,
} from "lucide-react";
import { useIPInvestigation } from "@/hooks/useIPInvestigation";
import { useAdvancedInvestigation } from "@/hooks/useAdvancedInvestigation";
import { TopologyAnalysisEnhanced } from "@/components/TopologyAnalysisEnhanced";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const EvidenceCollectionInternational: React.FC = () => {
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

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "destructive" };
    if (score >= 60) return { level: "High", color: "orange" };
    if (score >= 40) return { level: "Medium", color: "yellow" };
    return { level: "Low", color: "green" };
  };

  const getReputationStatus = (reputation: string) => {
    switch (reputation) {
      case "malicious":
        return { label: "Malicious", variant: "destructive" as const };
      case "suspicious":
        return { label: "Suspicious", variant: "secondary" as const };
      case "unknown":
        return { label: "Unknown", variant: "outline" as const };
      case "clean":
        return { label: "Clean", variant: "default" as const };
      default:
        return { label: "Unknown", variant: "outline" as const };
    }
  };

  // Chart data preparation
  const attackTypeData =
    investigation && investigationMode === "basic"
      ? Object.entries((investigation as any).attackTypes || {}).map(
          ([type, count]) => ({
            name: type.replace(/_/g, " ").toUpperCase(),
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

  const chartColors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];

  // Calculate investigation metrics
  const getInvestigationMetrics = () => {
    if (!investigation) return null;

    const baseMetrics = {
      riskScore: investigation.riskScore || 0,
      totalConnections:
        investigationMode === "advanced"
          ? (investigation as any).networkAnalysis?.connections?.length || 0
          : (investigation as any).totalAttacks || 0,
      threatsDetected:
        investigationMode === "advanced"
          ? (investigation as any).threatIntelligence?.blacklists?.length || 0
          : Object.keys((investigation as any).attackTypes || {}).length,
      securityScore: Math.max(0, 100 - (investigation.riskScore || 0)),
    };

    return baseMetrics;
  };

  const metrics = getInvestigationMetrics();

  return (
    <div className="min-h-screen bg-matrix-bg text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-quantum-500 to-neural-500 rounded-xl shadow-lg">
              <FileSearch className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white neon-text">
                威胁情报分析平台
              </h1>
              <p className="text-lg text-muted-foreground">
                高级IP调查与网络分析系统
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="cyber-card p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-quantum-500" />
              <span>调查配置</span>
            </h3>
            <p className="text-muted-foreground mt-1">
              输入IP地址开始综合威胁分析
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                目标IP地址
              </label>
              <Input
                type="text"
                placeholder="192.168.1.100"
                value={searchIP}
                onChange={(e) => setSearchIP(e.target.value)}
                className="h-12 text-lg font-mono bg-matrix-surface border-matrix-border text-white"
              />
            </div>
            <div className="w-48 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                分析模式
              </label>
              <select
                value={investigationMode}
                onChange={(e) =>
                  setInvestigationMode(e.target.value as "basic" | "advanced")
                }
                className="w-full h-12 px-3 bg-matrix-surface border border-matrix-border rounded-md text-white"
              >
                <option value="basic">基础分析</option>
                <option value="advanced">高级调查</option>
              </select>
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 neon-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  开始调查
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="cyber-card p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-quantum-500/30 border-t-quantum-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-quantum-500" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  正在分析 {selectedIP}
                </h3>
                <p className="text-muted-foreground">
                  {investigationMode === "advanced"
                    ? "正在执行深度威胁分析和网络映射..."
                    : "正在收集基础威胁情报数据..."}
                </p>
                <div className="w-64 mx-auto">
                  <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-quantum-500 to-neural-500 rounded-full transition-all duration-300"
                      style={{ width: "33%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="cyber-card border-red-500/30 bg-red-500/10 p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-400">调查失败</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Investigation Results */}
        {investigation && !loading && (
          <div className="space-y-6">
            {/* Metrics Overview */}
            {metrics && (
              <div
                className={cn(
                  "grid gap-6",
                  investigationMode === "basic"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-4",
                )}
              >
                {/* 基础模式只显示风险评分和威胁检测 */}
                <div className="cyber-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        风险评分
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {metrics.riskScore}/100
                      </p>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${metrics.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="cyber-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        威胁检测
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {metrics.threatsDetected}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <Shield className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* 高级模式显示额外的指标 */}
                {investigationMode === "advanced" && (
                  <>
                    <div className="cyber-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            网络连接
                          </p>
                          <p className="text-3xl font-bold text-white">
                            {metrics.totalConnections}
                          </p>
                        </div>
                        <div className="p-3 bg-quantum-500/20 rounded-xl">
                          <Network className="w-6 h-6 text-quantum-400" />
                        </div>
                      </div>
                    </div>

                    <div className="cyber-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            安全评分
                          </p>
                          <p className="text-3xl font-bold text-white">
                            {metrics.securityScore}/100
                          </p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${metrics.securityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Basic Information */}
            <div className="cyber-card p-6">
              <div className="flex flex-row items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-quantum-500" />
                    <span>调查摘要</span>
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    目标: {selectedIP} | 模式:{" "}
                    {investigationMode === "advanced" ? "高级" : "基础"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={cn(
                      "px-3 py-1",
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).variant === "destructive"
                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                        : getReputationStatus(
                              investigationMode === "advanced"
                                ? (investigation as any).basicInfo
                                    ?.reputation || "unknown"
                                : (investigation as any).reputation ||
                                    "unknown",
                            ).variant === "secondary"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          : getReputationStatus(
                                investigationMode === "advanced"
                                  ? (investigation as any).basicInfo
                                      ?.reputation || "unknown"
                                  : (investigation as any).reputation ||
                                      "unknown",
                              ).variant === "default"
                            ? "bg-green-500/20 text-green-400 border-green-500/40"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/40",
                    )}
                  >
                    {getReputationStatus(
                      investigationMode === "advanced"
                        ? (investigation as any).basicInfo?.reputation ||
                            "unknown"
                        : (investigation as any).reputation || "unknown",
                    ).label === "Malicious"
                      ? "恶意"
                      : getReputationStatus(
                            investigationMode === "advanced"
                              ? (investigation as any).basicInfo?.reputation ||
                                  "unknown"
                              : (investigation as any).reputation || "unknown",
                          ).label === "Suspicious"
                        ? "可疑"
                        : getReputationStatus(
                              investigationMode === "advanced"
                                ? (investigation as any).basicInfo
                                    ?.reputation || "unknown"
                                : (investigation as any).reputation ||
                                    "unknown",
                            ).label === "Clean"
                          ? "清洁"
                          : "未知"}
                  </Badge>
                  <Button
                    onClick={() => handleExport("JSON")}
                    className="neon-button-green"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出报告
                  </Button>
                </div>
              </div>
              <div
                className={cn(
                  "grid gap-6",
                  investigationMode === "basic"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                )}
              >
                {/* 基础模式显示核心信息 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    IP地址
                  </label>
                  <p className="font-mono text-lg font-semibold text-white">
                    {(investigation as any).ip || selectedIP}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    地理位置
                  </label>
                  <p className="text-white">
                    {(investigation as any).country || "未知"}
                  </p>
                </div>

                {/* 高级模式显示详细信息 */}
                {investigationMode === "advanced" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        组织机构
                      </label>
                      <p className="text-white">
                        {(investigation as any).organization || "无数据"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        最后活动
                      </label>
                      <p className="text-white">
                        {(investigation as any).lastActivity
                          ? new Date(
                              (investigation as any).lastActivity,
                            ).toLocaleDateString()
                          : "最近"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Detailed Analysis */}
            <Tabs
              defaultValue={
                investigationMode === "advanced" ? "topology" : "overview"
              }
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-5 bg-matrix-surface border border-matrix-border">
                <TabsTrigger
                  value="overview"
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>总览</span>
                </TabsTrigger>
                <TabsTrigger
                  value="topology"
                  className="flex items-center space-x-2"
                >
                  <Network className="w-4 h-4" />
                  <span>网络拓扑</span>
                </TabsTrigger>
                <TabsTrigger
                  value="threats"
                  className="flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>威胁情报</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>数据分析</span>
                </TabsTrigger>
                <TabsTrigger
                  value="forensics"
                  className="flex items-center space-x-2"
                >
                  <Bug className="w-4 h-4" />
                  <span>数字取证</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-quantum-500" />
                      <span>攻击类型分布</span>
                    </h3>
                    {attackTypeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={attackTypeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {attackTypeData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  [
                                    "#00f5ff",
                                    "#39ff14",
                                    "#bf00ff",
                                    "#ff1493",
                                    "#ff6600",
                                    "#ffff00",
                                  ][index % 6]
                                }
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
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        暂无攻击数据
                      </div>
                    )}
                  </div>

                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      <span>安全时间线</span>
                    </h3>
                    <div className="space-y-4">
                      {(investigation as any).timeline
                        ?.slice(0, 5)
                        .map((event: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-matrix-surface/50 rounded-lg"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 bg-quantum-500 rounded-full" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">
                                {event.type?.replace(/_/g, " ").toUpperCase() ||
                                  "安全事件"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.details || "检测到安全事件"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  event.timestamp || Date.now(),
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )) || (
                        <div className="text-center py-8 text-muted-foreground">
                          暂无时间线数据
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="topology">
                <div className="cyber-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                    <Network className="w-5 h-5 text-quantum-500" />
                    <span>网络拓扑分析</span>
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    交互式网络连接关系可视化
                  </p>
                  <TopologyAnalysisEnhanced
                    investigation={investigation}
                    centerIP={selectedIP}
                  />
                </div>
              </TabsContent>

              <TabsContent value="threats">
                <div className="cyber-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span>威胁情报分析</span>
                  </h3>
                  {investigationMode === "advanced" &&
                  (investigation as any).threatIntelligence?.blacklists ? (
                    <div className="space-y-4">
                      {(investigation as any).threatIntelligence.blacklists.map(
                        (blacklist: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                              <div>
                                <p className="font-medium text-red-400">
                                  {blacklist}
                                </p>
                                <p className="text-sm text-red-300">
                                  威胁数据库匹配
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                              已列入黑名单
                            </Badge>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        未检测到活跃威胁
                      </h3>
                      <p className="text-muted-foreground">
                        该IP地址当前未被列入已知威胁数据库
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span>协议分析</span>
                    </h3>
                    {protocolData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={protocolData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#30363d"
                          />
                          <XAxis
                            dataKey="name"
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
                          <Bar dataKey="value" fill="#00f5ff" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        暂无协议数据
                      </div>
                    )}
                  </div>

                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-neural-500" />
                      <span>网络活动</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">
                          活跃连接
                        </span>
                        <span className="text-lg font-bold text-white">
                          {(
                            investigation as any
                          ).networkAnalysis?.connections?.filter(
                            (c: any) => c.status === "active",
                          ).length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">
                          开放端口
                        </span>
                        <span className="text-lg font-bold text-white">
                          {(investigation as any).networkAnalysis?.openPorts
                            ?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">
                          安全事件
                        </span>
                        <span className="text-lg font-bold text-white">
                          {(investigation as any).timeline?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="forensics">
                <div className="cyber-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                    <Bug className="w-5 h-5 text-orange-400" />
                    <span>数字取证</span>
                  </h3>
                  {investigationMode === "advanced" &&
                  (investigation as any).forensics?.artifacts ? (
                    <div className="space-y-4">
                      {(investigation as any).forensics.artifacts
                        .slice(0, 10)
                        .map((artifact: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-matrix-surface/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge
                                  className={cn(
                                    "px-2 py-1",
                                    artifact.risk === "critical"
                                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                                      : artifact.risk === "high"
                                        ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                        : "bg-gray-500/20 text-gray-400 border-gray-500/40",
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
                            <div className="text-right text-sm text-muted-foreground">
                              {new Date(artifact.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bug className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        未发现取证工件
                      </h3>
                      <p className="text-muted-foreground">
                        当前调查中未检测到可疑工件
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!selectedIP && !loading && (
          <div className="cyber-card p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-quantum-500 to-neural-500 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  准备开始调查
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  在上方输入IP地址开始全面的威胁分析和网络调查
                </p>
              </div>
              <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>实时分析</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>威胁情报</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>网络映射</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceCollectionInternational;
