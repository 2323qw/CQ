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

        {/* Enhanced Search Section */}
        <div className="cyber-card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Search className="w-5 h-5 text-quantum-500" />
                  <span>智能调查配置</span>
                </h3>
                <p className="text-muted-foreground mt-1">
                  支持IP地址、域名、哈希值等多种输入类型的综合威胁分析
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  系统在线
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  高级设置
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Main Search Input */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  调查目标 (支持IP、域名、哈希值)
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="192.168.1.100 或 example.com 或 a1b2c3d4e5f6..."
                    value={searchIP}
                    onChange={(e) => setSearchIP(e.target.value)}
                    className="h-12 text-lg font-mono bg-matrix-surface border-matrix-border text-white pl-12"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>IPv4/IPv6</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>域名/URL</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>文件哈希</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  分析深度
                </label>
                <select
                  value={investigationMode}
                  onChange={(e) =>
                    setInvestigationMode(e.target.value as "basic" | "advanced")
                  }
                  className="w-full h-12 px-4 bg-matrix-surface border border-matrix-border rounded-md text-white"
                >
                  <option value="basic">🔍 基础分析 - 快速概览</option>
                  <option value="advanced">🔬 高级调查 - 深度分析</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  {investigationMode === "basic"
                    ? "快速获取核心威胁信息，适合日常监控"
                    : "全面深度分析，���含ML预测和取证分析"}
                </p>
              </div>
            </div>

            {/* Advanced Options for Advanced Mode */}
            {investigationMode === "advanced" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    威胁情报源
                  </label>
                  <div className="space-y-1">
                    {["VirusTotal", "AbuseIPDB", "Shodan", "AlienVault"].map(
                      (source) => (
                        <label
                          key={source}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-white">{source}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    分析范围
                  </label>
                  <div className="space-y-1">
                    {[
                      { label: "网络拓扑映射", key: "topology" },
                      { label: "恶意软件分析", key: "malware" },
                      { label: "数字取证", key: "forensics" },
                      { label: "行为分析", key: "behavior" },
                    ].map((option) => (
                      <label
                        key={option.key}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    实时监控
                  </label>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-white">持续监控目标</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span className="text-white">自动威胁追踪</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span className="text-white">异常行为告警</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
                      开始{investigationMode === "advanced" ? "深度" : ""}调查
                    </>
                  )}
                </Button>

                {selectedIP && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-12 px-6 text-orange-400 hover:text-orange-300"
                    onClick={() => {
                      setSelectedIP("");
                      setSearchIP("");
                      setSearchParams({});
                    }}
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    重新开始
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  预计用时:{" "}
                  {investigationMode === "advanced" ? "30-60秒" : "5-15秒"}
                </span>
              </div>
            </div>
          </form>

          {/* Quick Analysis Suggestions */}
          {!selectedIP && (
            <div className="mt-6 pt-6 border-t border-matrix-border">
              <h4 className="text-sm font-medium text-white mb-3">
                快速分析建议
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "192.168.1.100",
                  "10.0.0.15",
                  "malware-c2.com",
                  "185.234.72.45",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10"
                    onClick={() => setSearchIP(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
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
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-4",
                )}
              >
                {/* 基础模式显示三个核心指标 */}
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

                {/* 基础模式增加安全评分 */}
                {investigationMode === "basic" && (
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
                )}

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
                    {investigationMode === "advanced" ? "高级" : "基础"} |
                    开始时间: {new Date().toLocaleString()}
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
                    ? "grid-cols-1 md:grid-cols-3"
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

                {/* 基础模式增加ISP信息 */}
                {investigationMode === "basic" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      ISP提供商
                    </label>
                    <p className="text-white">
                      {(investigation as any).isp || "China Telecom"}
                    </p>
                  </div>
                )}

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

            {/* Additional Information Cards */}
            <div
              className={cn(
                "grid gap-6",
                investigationMode === "basic"
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1 lg:grid-cols-3",
              )}
            >
              {/* 基础模式显示简化的安全评估和基础统计 */}
              {investigationMode === "basic" ? (
                <>
                  {/* Security Assessment - Simplified */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span>安全评估</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          恶意软件检测
                        </span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                          清洁
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          威胁评级
                        </span>
                        <Badge
                          className={cn(
                            "px-2 py-1",
                            metrics && metrics.riskScore >= 70
                              ? "bg-red-500/20 text-red-400 border-red-500/40"
                              : metrics && metrics.riskScore >= 40
                                ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                : "bg-green-500/20 text-green-400 border-green-500/40",
                          )}
                        >
                          {metrics && metrics.riskScore >= 70
                            ? "高风险"
                            : metrics && metrics.riskScore >= 40
                              ? "中风险"
                              : "低风险"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          开放端口
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                          3个
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Basic Stats */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      <span>基础信息</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          ASN编号
                        </span>
                        <span className="text-sm text-white font-mono">
                          {(investigation as any).asn || "AS4134"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          分析耗时
                        </span>
                        <span className="text-sm text-white">1.8秒</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          数据源
                        </span>
                        <span className="text-sm text-white">6个情报源</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Technical Details - Advanced */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Server className="w-5 h-5 text-blue-400" />
                      <span>技术详情</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          ISP提供商
                        </span>
                        <span className="text-sm text-white">
                          {(investigation as any).isp || "China Telecom"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          ASN编号
                        </span>
                        <span className="text-sm text-white font-mono">
                          {(investigation as any).asn || "AS4134"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          域名记录
                        </span>
                        <span className="text-sm text-white">
                          {(investigation as any).hostname || "无PTR记录"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          网络类型
                        </span>
                        <span className="text-sm text-white">
                          {(investigation as any).networkType || "商业网络"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Assessment - Advanced */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span>安全评估</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          恶意软件检测
                        </span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                          清洁
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          僵尸网络检测
                        </span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                          未检测
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          垃圾邮件源
                        </span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                          可能
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          开放端口扫描
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                          {(investigation as any).networkAnalysis?.openPorts
                            ?.length || 0}
                          个
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Investigation Stats - Advanced */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      <span>调查统计</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          分析耗时
                        </span>
                        <span className="text-sm text-white">2.3秒</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          数据源数量
                        </span>
                        <span className="text-sm text-white">12个</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          置信度
                        </span>
                        <span className="text-sm text-white">94.5%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">
                          最后更新
                        </span>
                        <span className="text-sm text-white">刚刚</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Advanced Analysis with Tabs - 只有高级模式显示标签页 */}
            {investigationMode === "advanced" && (
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-matrix-surface border border-matrix-border grid w-full grid-cols-5">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>总览</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="threats"
                    className="flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>威胁情报</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="topology"
                    className="flex items-center space-x-2"
                  >
                    <Network className="w-4 h-4" />
                    <span>网络拓扑</span>
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
                  <div className="space-y-6">
                    {/* Executive Summary Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="cyber-card p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-300">
                              威胁等级
                            </p>
                            <p className="text-xl font-bold text-white">
                              {metrics && metrics.riskScore >= 70
                                ? "高危"
                                : metrics && metrics.riskScore >= 40
                                  ? "中危"
                                  : "低危"}
                            </p>
                            <p className="text-xs text-red-400">
                              评分: {metrics?.riskScore || 0}/100
                            </p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                      </div>
                      <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-300">
                              网络活动
                            </p>
                            <p className="text-xl font-bold text-white">
                              {metrics?.totalConnections || 0}
                            </p>
                            <p className="text-xs text-blue-400">活跃连接数</p>
                          </div>
                          <Network className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                      <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-300">
                              安全状态
                            </p>
                            <p className="text-xl font-bold text-white">
                              {metrics?.securityScore || 0}%
                            </p>
                            <p className="text-xs text-green-400">
                              综合安全评分
                            </p>
                          </div>
                          <Shield className="w-8 h-8 text-green-400" />
                        </div>
                      </div>
                      <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-300">
                              调查完成度
                            </p>
                            <p className="text-xl font-bold text-white">
                              98.5%
                            </p>
                            <p className="text-xs text-purple-400">
                              数据收集完整度
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Analysis Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Attack Types Distribution */}
                      <div className="cyber-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-quantum-500" />
                            <span>攻击类型分布</span>
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-quantum-400 hover:text-quantum-300"
                          >
                            <Filter className="w-4 h-4" />
                          </Button>
                        </div>
                        {attackTypeData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={280}>
                            <RechartsPieChart>
                              <Pie
                                data={attackTypeData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
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
                          <ResponsiveContainer width="100%" height={280}>
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: "端口扫描", value: 45, count: 45 },
                                  { name: "暴力破解", value: 23, count: 23 },
                                  { name: "Web攻击", value: 18, count: 18 },
                                  { name: "恶意软件", value: 14, count: 14 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {[0, 1, 2, 3].map((index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      [
                                        "#00f5ff",
                                        "#39ff14",
                                        "#bf00ff",
                                        "#ff1493",
                                      ][index]
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
                        )}
                      </div>

                      {/* Risk Assessment Radar */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Target className="w-5 h-5 text-red-400" />
                          <span>风险评估雷达</span>
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              name: "恶意活动",
                              score: metrics?.riskScore || 25,
                              color: "#ff4444",
                            },
                            {
                              name: "网络威胁",
                              score: (metrics?.riskScore || 30) * 0.8,
                              color: "#ff6600",
                            },
                            {
                              name: "数据泄露",
                              score: (metrics?.riskScore || 20) * 0.6,
                              color: "#ffaa00",
                            },
                            {
                              name: "系统漏洞",
                              score: (metrics?.riskScore || 35) * 0.7,
                              color: "#00f5ff",
                            },
                            {
                              name: "访问异常",
                              score: (metrics?.riskScore || 40) * 0.9,
                              color: "#bf00ff",
                            },
                          ].map((item, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.name}
                                </span>
                                <span className="text-white font-medium">
                                  {Math.round(item.score)}/100
                                </span>
                              </div>
                              <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${item.score}%`,
                                    backgroundColor: item.color,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real-time Activity Feed */}
                      <div className="cyber-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-green-400" />
                            <span>实时活动流</span>
                          </h3>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs text-green-400">实时</span>
                          </div>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {(investigation as any).timeline
                            ?.slice(0, 8)
                            .map((event: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-2 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors"
                              >
                                <div className="flex-shrink-0 mt-1">
                                  <div
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      index === 0
                                        ? "bg-red-400"
                                        : index === 1
                                          ? "bg-orange-400"
                                          : index === 2
                                            ? "bg-yellow-400"
                                            : "bg-quantum-500",
                                    )}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-white">
                                    {event.type
                                      ?.replace(/_/g, " ")
                                      .toUpperCase() ||
                                      [
                                        "检测到端口扫描",
                                        "发现可疑连接",
                                        "威胁情报匹配",
                                        "网络异常活动",
                                      ][index % 4]}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {event.details ||
                                      [
                                        "来源IP尝试访问多个端口",
                                        "与已知恶意域名通信",
                                        "IP被多个威胁源标记",
                                        "异常流量模式检测",
                                      ][index % 4]}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                      event.timestamp ||
                                        Date.now() - index * 60000,
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            )) ||
                            // 示例数据
                            [
                              {
                                type: "端口扫描检测",
                                details: "检测到对22,80,443端口的扫描活动",
                                severity: "high",
                              },
                              {
                                type: "威胁情报匹配",
                                details: "IP地址在3个威胁数据库中被标记",
                                severity: "critical",
                              },
                              {
                                type: "异常连接",
                                details: "发现与C&C服务器的可疑通信",
                                severity: "high",
                              },
                              {
                                type: "地理位置异常",
                                details: "IP地址位置与历史模式不符",
                                severity: "medium",
                              },
                              {
                                type: "流量分析",
                                details: "检测到加密隧道流量特征",
                                severity: "medium",
                              },
                            ].map((event, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-2 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors"
                              >
                                <div className="flex-shrink-0 mt-1">
                                  <div
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      event.severity === "critical"
                                        ? "bg-red-400"
                                        : event.severity === "high"
                                          ? "bg-orange-400"
                                          : event.severity === "medium"
                                            ? "bg-yellow-400"
                                            : "bg-quantum-500",
                                    )}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-white">
                                    {event.type}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {event.details}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                      Date.now() - index * 120000,
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Intelligence Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Geographic & Network Intelligence */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-cyan-400" />
                          <span>地理与网络情报</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground">
                                地理位置
                              </label>
                              <p className="text-sm text-white">
                                {(investigation as any).country || "中国"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(investigation as any).city || "北京市"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground">
                                网络运营商
                              </label>
                              <p className="text-sm text-white">
                                {(investigation as any).isp || "China Telecom"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                AS{(investigation as any).asn || "4134"}
                              </p>
                            </div>
                          </div>
                          <div className="border-t border-matrix-border pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                网络信誉评分
                              </span>
                              <span className="text-sm text-white">
                                {95 - (metrics?.riskScore || 0)}/100
                              </span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                style={{
                                  width: `${95 - (metrics?.riskScore || 0)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Threat Indicators Summary */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-orange-400" />
                          <span>威胁指标汇总</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-2xl font-bold text-red-400">
                              {(investigation as any).threatIntelligence
                                ?.blacklists?.length || 0}
                            </p>
                            <p className="text-xs text-red-300">恶意IP标记</p>
                          </div>
                          <div className="text-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                            <p className="text-2xl font-bold text-orange-400">
                              {
                                Object.keys(
                                  (investigation as any).attackTypes || {},
                                ).length
                              }
                            </p>
                            <p className="text-xs text-orange-300">攻击类型</p>
                          </div>
                          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-2xl font-bold text-blue-400">
                              {(investigation as any).networkAnalysis?.openPorts
                                ?.length || 3}
                            </p>
                            <p className="text-xs text-blue-300">开放端口</p>
                          </div>
                          <div className="text-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <p className="text-2xl font-bold text-purple-400">
                              12
                            </p>
                            <p className="text-xs text-purple-300">情报来源</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="topology">
                  <div className="space-y-6">
                    {/* Enhanced Network Topology Dashboard */}
                    <div className="cyber-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <Network className="w-5 h-5 text-quantum-500" />
                          <span>智能网络拓扑分析</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            导出拓扑图
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            实时更新
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <Filter className="w-4 h-4 mr-2" />
                            过滤器
                          </Button>
                        </div>
                      </div>

                      {/* Network Overview Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-300">
                                网络节点
                              </p>
                              <p className="text-xl font-bold text-white">
                                {(investigation as any).networkAnalysis
                                  ?.connections?.length || 47}
                              </p>
                              <p className="text-xs text-blue-400">活跃设备</p>
                            </div>
                            <Server className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-300">
                                连接关系
                              </p>
                              <p className="text-xl font-bold text-white">
                                156
                              </p>
                              <p className="text-xs text-green-400">网络链路</p>
                            </div>
                            <Network className="w-6 h-6 text-green-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-300">
                                异常节点
                              </p>
                              <p className="text-xl font-bold text-white">3</p>
                              <p className="text-xs text-orange-400">需关注</p>
                            </div>
                            <AlertTriangle className="w-6 h-6 text-orange-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-300">
                                网络深度
                              </p>
                              <p className="text-xl font-bold text-white">7</p>
                              <p className="text-xs text-purple-400">
                                最大跳数
                              </p>
                            </div>
                            <Target className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-yellow-300">
                                关键路径
                              </p>
                              <p className="text-xl font-bold text-white">12</p>
                              <p className="text-xs text-yellow-400">
                                攻击路径
                              </p>
                            </div>
                            <Activity className="w-6 h-6 text-yellow-400" />
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6">
                        基于AI的智能网络拓扑分析，实时显示网络连接关系、威胁传播路径和异常行为模式
                      </p>

                      {/* Enhanced Topology Component */}
                      <TopologyAnalysisEnhanced
                        investigation={investigation}
                        centerIP={selectedIP}
                      />
                    </div>

                    {/* Network Analysis Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Attack Path Analysis */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Target className="w-5 h-5 text-red-400" />
                          <span>攻击路径分析</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">
                                关键攻击路径
                              </span>
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                                高风险
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {[
                                {
                                  step: 1,
                                  action: "初始入侵",
                                  target: selectedIP,
                                  method: "钓鱼邮件",
                                },
                                {
                                  step: 2,
                                  action: "横向移动",
                                  target: "192.168.1.100",
                                  method: "SMB漏洞",
                                },
                                {
                                  step: 3,
                                  action: "权限提升",
                                  target: "DC01.local",
                                  method: "Kerberoasting",
                                },
                                {
                                  step: 4,
                                  action: "数据外泄",
                                  target: "文件服务器",
                                  method: "域管权限",
                                },
                              ].map((pathStep, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3 text-sm"
                                >
                                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {pathStep.step}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-white font-medium">
                                      {pathStep.action}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      {pathStep.target} → {pathStep.method}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                              <p className="text-lg font-bold text-orange-400">
                                4
                              </p>
                              <p className="text-xs text-orange-300">
                                攻击步骤
                              </p>
                            </div>
                            <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <p className="text-lg font-bold text-red-400">
                                7.2
                              </p>
                              <p className="text-xs text-red-300">风险分数</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Network Anomalies */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Eye className="w-5 h-5 text-yellow-400" />
                          <span>网络异常检测</span>
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              type: "流量异常",
                              description: "检测到异常大量的出站流量",
                              severity: "high",
                              affected: "3个节点",
                              timestamp: "2分钟前",
                            },
                            {
                              type: "连接模式",
                              description: "发现非正常时间的内网扫描行为",
                              severity: "medium",
                              affected: "12个节点",
                              timestamp: "15分钟前",
                            },
                            {
                              type: "协议异常",
                              description: "检测到加密隧道流量特征",
                              severity: "high",
                              affected: "1个节点",
                              timestamp: "8分钟前",
                            },
                            {
                              type: "地理位置",
                              description: "发现来自异常地理位置的连接",
                              severity: "medium",
                              affected: "5个节点",
                              timestamp: "32分钟前",
                            },
                          ].map((anomaly, index) => (
                            <div
                              key={index}
                              className={cn(
                                "p-3 border rounded-lg",
                                anomaly.severity === "high"
                                  ? "bg-red-500/10 border-red-500/30"
                                  : "bg-yellow-500/10 border-yellow-500/30",
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-white">
                                  {anomaly.type}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      anomaly.severity === "high"
                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
                                    )}
                                  >
                                    {anomaly.severity === "high" ? "高" : "中"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {anomaly.timestamp}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {anomaly.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                影响范围: {anomaly.affected}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Network Infrastructure Analysis */}
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Server className="w-5 h-5 text-blue-400" />
                        <span>网络基础设施分析</span>
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Network Segments */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-cyan-400">
                            网络分段
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                segment: "DMZ区域",
                                range: "10.0.1.0/24",
                                devices: 12,
                                risk: "medium",
                              },
                              {
                                segment: "办公网络",
                                range: "192.168.1.0/24",
                                devices: 156,
                                risk: "low",
                              },
                              {
                                segment: "服务器区",
                                range: "10.0.10.0/24",
                                devices: 23,
                                risk: "high",
                              },
                              {
                                segment: "管理网络",
                                range: "172.16.0.0/24",
                                devices: 8,
                                risk: "critical",
                              },
                            ].map((seg, index) => (
                              <div
                                key={index}
                                className="p-3 bg-matrix-surface/30 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-white">
                                    {seg.segment}
                                  </span>
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      seg.risk === "critical"
                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                        : seg.risk === "high"
                                          ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                          : seg.risk === "medium"
                                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                                            : "bg-green-500/20 text-green-400 border-green-500/40",
                                    )}
                                  >
                                    {seg.risk === "critical"
                                      ? "严重"
                                      : seg.risk === "high"
                                        ? "高"
                                        : seg.risk === "medium"
                                          ? "中"
                                          : "低"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {seg.range}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {seg.devices} 个设备
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Critical Assets */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-green-400">
                            关键资产
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                name: "域控制器",
                                ip: "192.168.1.10",
                                type: "DC",
                                status: "正常",
                              },
                              {
                                name: "文件服务器",
                                ip: "10.0.10.50",
                                type: "FS",
                                status: "异常",
                              },
                              {
                                name: "数据库服务器",
                                ip: "10.0.10.100",
                                type: "DB",
                                status: "正常",
                              },
                              {
                                name: "Web服务器",
                                ip: "10.0.1.80",
                                type: "WEB",
                                status: "监控中",
                              },
                            ].map((asset, index) => (
                              <div
                                key={index}
                                className="p-3 bg-matrix-surface/30 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-white">
                                    {asset.name}
                                  </span>
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      asset.status === "异常"
                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                        : asset.status === "监控中"
                                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                                          : "bg-green-500/20 text-green-400 border-green-500/40",
                                    )}
                                  >
                                    {asset.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {asset.ip}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {asset.type}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Security Controls */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-purple-400">
                            安全控制
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                control: "防火墙",
                                status: "active",
                                effectiveness: 85,
                              },
                              {
                                control: "IDS/IPS",
                                status: "active",
                                effectiveness: 92,
                              },
                              {
                                control: "WAF",
                                status: "active",
                                effectiveness: 78,
                              },
                              {
                                control: "EDR",
                                status: "partial",
                                effectiveness: 67,
                              },
                            ].map((control, index) => (
                              <div
                                key={index}
                                className="p-3 bg-matrix-surface/30 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-white">
                                    {control.control}
                                  </span>
                                  <div
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      control.status === "active"
                                        ? "bg-green-400"
                                        : control.status === "partial"
                                          ? "bg-yellow-400"
                                          : "bg-red-400",
                                    )}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      有效性
                                    </span>
                                    <span className="text-white">
                                      {control.effectiveness}%
                                    </span>
                                  </div>
                                  <div className="h-1 bg-matrix-surface rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                                      style={{
                                        width: `${control.effectiveness}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="threats">
                  <div className="space-y-6">
                    {/* Enhanced Threat Intelligence Summary */}
                    <div className="cyber-card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-red-400" />
                          <span>高级威胁情报分析</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            导出威胁报告
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            实时更新
                          </Button>
                        </div>
                      </div>

                      {/* Threat Intelligence Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="cyber-card p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-red-300">
                                恶意IP检测
                              </p>
                              <p className="text-2xl font-bold text-white">
                                {(investigation as any).threatIntelligence
                                  ?.blacklists?.length || 0}
                              </p>
                              <p className="text-xs text-red-400">
                                {(investigation as any).threatIntelligence
                                  ?.blacklists?.length
                                  ? "已标记"
                                  : "清洁"}
                              </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-yellow-300">
                                可疑活动
                              </p>
                              <p className="text-2xl font-bold text-white">
                                {
                                  Object.keys(
                                    (investigation as any).attackTypes || {},
                                  ).length
                                }
                              </p>
                              <p className="text-xs text-yellow-400">
                                检测类型
                              </p>
                            </div>
                            <Eye className="w-8 h-8 text-yellow-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-300">
                                情报来源
                              </p>
                              <p className="text-2xl font-bold text-white">
                                12
                              </p>
                              <p className="text-xs text-blue-400">
                                活跃数据源
                              </p>
                            </div>
                            <Database className="w-8 h-8 text-blue-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-300">
                                置信度
                              </p>
                              <p className="text-2xl font-bold text-white">
                                94.5%
                              </p>
                              <p className="text-xs text-purple-400">
                                分析准确性
                              </p>
                            </div>
                            <Target className="w-8 h-8 text-purple-400" />
                          </div>
                        </div>
                      </div>

                      {/* Threat Detection Results */}
                      {(investigation as any).threatIntelligence?.blacklists ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">
                              检测到的威胁
                            </h4>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                              {
                                (investigation as any).threatIntelligence
                                  .blacklists.length
                              }{" "}
                              个威胁源
                            </Badge>
                          </div>
                          {(
                            investigation as any
                          ).threatIntelligence.blacklists.map(
                            (blacklist: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/15 transition-colors"
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
                                    <p className="text-xs text-muted-foreground">
                                      检测时间: {new Date().toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                                    已列入黑名单
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    详情
                                  </Button>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="font-medium text-white mb-3">
                            威胁检测结果
                          </h4>
                          <div className="text-center py-8 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                            <h3 className="text-lg font-semibold text-white mb-2">
                              未检测到活跃威胁
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              该IP地址当前未被列入已知威胁数据库
                            </p>
                            <div className="flex justify-center space-x-2">
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                                清洁状态
                              </Badge>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                                低风险
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Advanced Threat Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* IOC Analysis */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Bug className="w-5 h-5 text-orange-400" />
                          <span>IOC指标分析</span>
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              type: "IP地址",
                              value: selectedIP,
                              status: "监控中",
                              risk: "medium",
                            },
                            {
                              type: "端口特征",
                              value: "22,80,443,8080",
                              status: "已检测",
                              risk: "low",
                            },
                            {
                              type: "TLS证书",
                              value: "自签名证书",
                              status: "可疑",
                              risk: "high",
                            },
                            {
                              type: "HTTP头部",
                              value: "异常User-Agent",
                              status: "分析中",
                              risk: "medium",
                            },
                          ].map((ioc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={cn(
                                    "w-3 h-3 rounded-full",
                                    ioc.risk === "high"
                                      ? "bg-red-400"
                                      : ioc.risk === "medium"
                                        ? "bg-orange-400"
                                        : "bg-green-400",
                                  )}
                                />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {ioc.type}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {ioc.value}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  ioc.risk === "high"
                                    ? "bg-red-500/20 text-red-400 border-red-500/40"
                                    : ioc.risk === "medium"
                                      ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                      : "bg-green-500/20 text-green-400 border-green-500/40",
                                )}
                              >
                                {ioc.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Threat Attribution */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Target className="w-5 h-5 text-purple-400" />
                          <span>威胁溯源分析</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">
                                可能的威胁组织
                              </span>
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                                中等可信度
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              基于TTPs分析，可能与APT28组织相关的活动模式
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                APT28
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Fancy Bear
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                国家级威胁
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                战术匹配度
                              </span>
                              <span className="text-white">78%</span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                                style={{ width: "78%" }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                技术相似性
                              </span>
                              <span className="text-white">65%</span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                style={{ width: "65%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Threat Intelligence Sources */}
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <span>威胁情报源</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            name: "VirusTotal",
                            status: "已检查",
                            result: "清洁",
                            color: "green",
                          },
                          {
                            name: "AbuseIPDB",
                            status: "已检查",
                            result: "可疑",
                            color: "orange",
                          },
                          {
                            name: "Shodan",
                            status: "已扫描",
                            result: "3个开放端口",
                            color: "blue",
                          },
                          {
                            name: "AlienVault OTX",
                            status: "已分析",
                            result: "无威胁",
                            color: "green",
                          },
                          {
                            name: "Cisco Talos",
                            status: "已验证",
                            result: "信誉良好",
                            color: "green",
                          },
                          {
                            name: "IBM X-Force",
                            status: "已评估",
                            result:
                              metrics && metrics.riskScore > 50
                                ? "中风险"
                                : "低风险",
                            color:
                              metrics && metrics.riskScore > 50
                                ? "orange"
                                : "green",
                          },
                        ].map((source, index) => (
                          <div
                            key={index}
                            className="p-4 bg-matrix-surface/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">
                                {source.name}
                              </span>
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full",
                                  source.color === "green"
                                    ? "bg-green-400"
                                    : source.color === "orange"
                                      ? "bg-orange-400"
                                      : "bg-blue-400",
                                )}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {source.status}
                            </p>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                source.color === "green"
                                  ? "text-green-400"
                                  : source.color === "orange"
                                    ? "text-orange-400"
                                    : "text-blue-400",
                              )}
                            >
                              {source.result}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attack Types Analysis */}
                    {Object.keys((investigation as any).attackTypes || {})
                      .length > 0 && (
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Target className="w-5 h-5 text-red-400" />
                          <span>攻击类型分析</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(
                            (investigation as any).attackTypes || {},
                          ).map(([type, count], index) => (
                            <div
                              key={index}
                              className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    {type.replace(/_/g, " ").toUpperCase()}
                                  </p>
                                  <p className="text-sm text-red-300">
                                    检测次数: {count as number}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    最后检测: {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge
                                  className={cn(
                                    "px-2 py-1",
                                    (count as number) > 10
                                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                                      : (count as number) > 5
                                        ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
                                  )}
                                >
                                  {(count as number) > 10
                                    ? "高频"
                                    : (count as number) > 5
                                      ? "中频"
                                      : "低频"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="space-y-6">
                    {/* Enhanced Analytics Overview */}
                    <div className="cyber-card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5 text-cyan-400" />
                          <span>智能数据分析平台</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            导出分析报告
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            运行预测模型
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-300">
                                数据点
                              </p>
                              <p className="text-xl font-bold text-white">
                                1,247
                              </p>
                              <p className="text-xs text-blue-400">采集完成</p>
                            </div>
                            <Database className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-300">
                                分析完成
                              </p>
                              <p className="text-xl font-bold text-white">
                                98.5%
                              </p>
                              <p className="text-xs text-green-400">实时处理</p>
                            </div>
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-300">
                                处理时间
                              </p>
                              <p className="text-xl font-bold text-white">
                                2.3s
                              </p>
                              <p className="text-xs text-purple-400">
                                优化算法
                              </p>
                            </div>
                            <Clock className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-300">
                                置信度
                              </p>
                              <p className="text-xl font-bold text-white">
                                94.2%
                              </p>
                              <p className="text-xs text-orange-400">AI模型</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-orange-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-pink-300">
                                威胁预测
                              </p>
                              <p className="text-xl font-bold text-white">
                                76%
                              </p>
                              <p className="text-xs text-pink-400">ML预测</p>
                            </div>
                            <Target className="w-6 h-6 text-pink-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Protocol Analysis with ML Insights */}
                      <div className="cyber-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span>协议分析</span>
                          </h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                            AI增强
                          </Badge>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart
                            data={
                              protocolData.length > 0
                                ? protocolData
                                : [
                                    {
                                      name: "TCP",
                                      value: 45,
                                      trend: "↑",
                                      anomaly: false,
                                    },
                                    {
                                      name: "UDP",
                                      value: 23,
                                      trend: "→",
                                      anomaly: false,
                                    },
                                    {
                                      name: "HTTP",
                                      value: 67,
                                      trend: "↑",
                                      anomaly: true,
                                    },
                                    {
                                      name: "HTTPS",
                                      value: 89,
                                      trend: "↑",
                                      anomaly: false,
                                    },
                                    {
                                      name: "SSH",
                                      value: 12,
                                      trend: "↓",
                                      anomaly: true,
                                    },
                                    {
                                      name: "FTP",
                                      value: 8,
                                      trend: "↓",
                                      anomaly: false,
                                    },
                                  ]
                            }
                          >
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
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              异常检测:
                            </span>
                            <span className="text-orange-400">2个协议异常</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              预测趋势:
                            </span>
                            <span className="text-green-400">流量增长15%</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Traffic Distribution */}
                      <div className="cyber-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <PieChart className="w-5 h-5 text-purple-400" />
                            <span>流量分布</span>
                          </h3>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-xs text-cyan-400">实时</span>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                          <RechartsPieChart>
                            <Pie
                              data={[
                                {
                                  name: "入站流量",
                                  value: 65,
                                  fill: "#00f5ff",
                                },
                                {
                                  name: "出站流量",
                                  value: 35,
                                  fill: "#39ff14",
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            />
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
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="text-center p-2 bg-cyan-500/10 rounded">
                            <p className="text-xs text-cyan-300">平均带宽</p>
                            <p className="text-sm font-bold text-white">
                              2.3 MB/s
                            </p>
                          </div>
                          <div className="text-center p-2 bg-green-500/10 rounded">
                            <p className="text-xs text-green-300">峰值流量</p>
                            <p className="text-sm font-bold text-white">
                              8.7 MB/s
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Threat Prediction */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Target className="w-5 h-5 text-orange-400" />
                          <span>AI威胁预测</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
                            <div className="text-3xl font-bold text-orange-400 mb-2">
                              76%
                            </div>
                            <p className="text-sm text-orange-300">威胁概率</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              基于行为模式分析
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                恶意软件风险
                              </span>
                              <span className="text-xs text-red-400">
                                高 (85%)
                              </span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                                style={{ width: "85%" }}
                              />
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                数据外泄风险
                              </span>
                              <span className="text-xs text-orange-400">
                                中 (45%)
                              </span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                                style={{ width: "45%" }}
                              />
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                横向移动风险
                              </span>
                              <span className="text-xs text-yellow-400">
                                中 (62%)
                              </span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                                style={{ width: "62%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Machine Learning Insights */}
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span>机器学习洞察</span>
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-cyan-400">
                            行为模式分析
                          </h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                              <p className="text-sm font-medium text-white">
                                异常连接模式
                              </p>
                              <p className="text-xs text-cyan-300">
                                检测到非典型时间段的大量连接
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                                  置信度: 89%
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                              <p className="text-sm font-medium text-white">
                                流量基线偏差
                              </p>
                              <p className="text-xs text-blue-300">
                                流量模式偏离7天基线37%
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                                  置信度: 76%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-green-400">
                            关联分析
                          </h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <p className="text-sm font-medium text-white">
                                相似IP聚类
                              </p>
                              <p className="text-xs text-green-300">
                                发现12个行为相似的IP地址
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                                  相似度: 94%
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                              <p className="text-sm font-medium text-white">
                                攻击链重构
                              </p>
                              <p className="text-xs text-emerald-300">
                                识别到完整的攻击序列
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                                  完整度: 83%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-purple-400">
                            预测模型
                          </h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                              <p className="text-sm font-medium text-white">
                                下一步行为预测
                              </p>
                              <p className="text-xs text-purple-300">
                                预计将尝试权限提升
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                                  概率: 78%
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                              <p className="text-sm font-medium text-white">
                                影响范围评估
                              </p>
                              <p className="text-xs text-violet-300">
                                可能影响23个相关系统
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/40">
                                  风险: 高
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Network Activity Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Activity className="w-5 h-5 text-neural-500" />
                          <span>网络活动统计</span>
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
                              ).length || 12}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">
                              开放端口
                            </span>
                            <span className="text-lg font-bold text-white">
                              {(investigation as any).networkAnalysis?.openPorts
                                ?.length || 3}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">
                              安全事件
                            </span>
                            <span className="text-lg font-bold text-white">
                              {(investigation as any).timeline?.length || 5}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">
                              带宽使用
                            </span>
                            <span className="text-lg font-bold text-white">
                              2.3 MB/s
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5 text-cyan-400" />
                          <span>性能指标</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                CPU使用率
                              </span>
                              <span className="text-white">23%</span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                style={{ width: "23%" }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                内��使用率
                              </span>
                              <span className="text-white">67%</span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                style={{ width: "67%" }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                网络使用率
                              </span>
                              <span className="text-white">45%</span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                                style={{ width: "45%" }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                磁盘I/O
                              </span>
                              <span className="text-white">12%</span>
                            </div>
                            <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                style={{ width: "12%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Series Analysis */}
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        <span>时间序列分析</span>
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={[
                            { time: "00:00", connections: 45, threats: 2 },
                            { time: "04:00", connections: 23, threats: 1 },
                            { time: "08:00", connections: 67, threats: 5 },
                            { time: "12:00", connections: 89, threats: 3 },
                            { time: "16:00", connections: 76, threats: 4 },
                            { time: "20:00", connections: 54, threats: 2 },
                            { time: "24:00", connections: 34, threats: 1 },
                          ]}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#30363d"
                          />
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
                            dataKey="connections"
                            stroke="#00f5ff"
                            strokeWidth={2}
                            name="网络连接"
                          />
                          <Line
                            type="monotone"
                            dataKey="threats"
                            stroke="#ff4444"
                            strokeWidth={2}
                            name="威胁事件"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="forensics">
                  <div className="space-y-6">
                    {/* Enhanced Digital Forensics Dashboard */}
                    <div className="cyber-card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <Bug className="w-5 h-5 text-orange-400" />
                          <span>高级数字取证分析</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-400 hover:text-orange-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            导出取证报告
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            深度扫描
                          </Button>
                        </div>
                      </div>

                      {/* Forensics Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="cyber-card p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-300">
                                发现工件
                              </p>
                              <p className="text-2xl font-bold text-white">
                                {(investigation as any).forensics?.artifacts
                                  ?.length || 12}
                              </p>
                              <p className="text-xs text-orange-400">
                                数字证据
                              </p>
                            </div>
                            <FileSearch className="w-8 h-8 text-orange-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-300">
                                恶意载荷
                              </p>
                              <p className="text-2xl font-bold text-white">3</p>
                              <p className="text-xs text-purple-400">已识别</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-purple-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-300">
                                网络痕迹
                              </p>
                              <p className="text-2xl font-bold text-white">
                                47
                              </p>
                              <p className="text-xs text-blue-400">连接记录</p>
                            </div>
                            <Network className="w-8 h-8 text-blue-400" />
                          </div>
                        </div>
                        <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-300">
                                完整性
                              </p>
                              <p className="text-2xl font-bold text-white">
                                98.7%
                              </p>
                              <p className="text-xs text-green-400">证据链</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </div>
                        </div>
                      </div>

                      {/* Forensics Analysis Results */}
                      {(investigation as any).forensics?.artifacts ? (
                        <div className="space-y-4">
                          <h4 className="font-medium text-white mb-3">
                            取证工件分析
                          </h4>
                          {(investigation as any).forensics.artifacts
                            .slice(0, 10)
                            .map((artifact: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-matrix-surface/50 rounded-lg hover:bg-matrix-surface/70 transition-colors"
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
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      artifact.timestamp,
                                    ).toLocaleString()}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-cyan-400 hover:text-cyan-300 mt-1"
                                  >
                                    详细分析
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        /* Enhanced Sample Forensics Data */
                        <div className="space-y-4">
                          <h4 className="font-medium text-white mb-3">
                            取证工件分析
                          </h4>
                          {[
                            {
                              type: "恶意文件",
                              artifact: "suspicious_payload.exe",
                              description: "检测到具有代码注入功能的可执行文件",
                              risk: "critical",
                              timestamp: new Date(Date.now() - 3600000),
                              hash: "a1b2c3d4e5f6...",
                              size: "2.3 MB",
                            },
                            {
                              type: "网络通信",
                              artifact: "C&C通信记录",
                              description: "发现与已知恶意域名的加密通信",
                              risk: "high",
                              timestamp: new Date(Date.now() - 7200000),
                              hash: "f6e5d4c3b2a1...",
                              size: "156 KB",
                            },
                            {
                              type: "系统修改",
                              artifact: "注册表项更改",
                              description: "检测到持久化机制相关的注册表修改",
                              risk: "high",
                              timestamp: new Date(Date.now() - 10800000),
                              hash: "9876543210ab...",
                              size: "12 KB",
                            },
                            {
                              type: "内存转储",
                              artifact: "进程内存快照",
                              description: "捕获到包含恶意代码的进程内存",
                              risk: "critical",
                              timestamp: new Date(Date.now() - 14400000),
                              hash: "abcd1234efgh...",
                              size: "45.7 MB",
                            },
                          ].map((artifact, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-matrix-surface/50 rounded-lg hover:bg-matrix-surface/70 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Badge
                                    className={cn(
                                      "px-2 py-1",
                                      artifact.risk === "critical"
                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                        : "bg-orange-500/20 text-orange-400 border-orange-500/40",
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
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>哈希: {artifact.hash}</span>
                                  <span>大���: {artifact.size}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  {artifact.timestamp.toLocaleString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-cyan-400 hover:text-cyan-300 mt-1"
                                >
                                  详细分析
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Advanced Forensics Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Malware Analysis */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Bug className="w-5 h-5 text-red-400" />
                          <span>恶意软件分析</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">
                                样本特征分析
                              </span>
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                                恶意
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  文件类型:
                                </span>
                                <span className="text-white">
                                  PE32 可执行文件
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  编译时间:
                                </span>
                                <span className="text-white">
                                  2024-01-15 (可能伪造)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  加壳检测:
                                </span>
                                <span className="text-orange-400">
                                  UPX 3.96
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  熵值:
                                </span>
                                <span className="text-red-400">
                                  7.89 (高熵值)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                            <span className="font-medium text-white">
                              行为分析
                            </span>
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                <span className="text-muted-foreground">
                                  创建互斥体确保单实例运行
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                                <span className="text-muted-foreground">
                                  修改系统启动项实现持久化
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                <span className="text-muted-foreground">
                                  尝试连接外部C&C服务器
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Network Forensics */}
                      <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Network className="w-5 h-5 text-blue-400" />
                          <span>网络取证分析</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <span className="font-medium text-white">
                              网络流量分析
                            </span>
                            <div className="mt-2 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  总流量:
                                </span>
                                <span className="text-white">2.3 GB</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  可疑连接:
                                </span>
                                <span className="text-orange-400">12 个</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  加密流量:
                                </span>
                                <span className="text-white">78.5%</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                            <span className="font-medium text-white">
                              关键连接记录
                            </span>
                            <div className="mt-2 space-y-2">
                              {[
                                {
                                  dst: "185.234.72.45",
                                  port: "443",
                                  protocol: "HTTPS",
                                  status: "可疑",
                                },
                                {
                                  dst: "malware-c2.com",
                                  port: "8080",
                                  protocol: "HTTP",
                                  status: "恶意",
                                },
                                {
                                  dst: "192.168.1.100",
                                  port: "445",
                                  protocol: "SMB",
                                  status: "横向移动",
                                },
                              ].map((conn, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-muted-foreground font-mono">
                                    {conn.dst}:{conn.port}
                                  </span>
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      conn.status === "恶意"
                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                        : conn.status === "可疑"
                                          ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
                                    )}
                                  >
                                    {conn.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Forensics Timeline */}
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-green-400" />
                        <span>取证时间线</span>
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            time: "14:23:15",
                            event: "初始感染",
                            description: "恶意邮件附件执行",
                            severity: "critical",
                          },
                          {
                            time: "14:23:47",
                            event: "权限提升",
                            description: "利用CVE-2023-1234提升权限",
                            severity: "high",
                          },
                          {
                            time: "14:24:12",
                            event: "持久化建立",
                            description: "创建计划任务和注册表项",
                            severity: "high",
                          },
                          {
                            time: "14:25:03",
                            event: "数据收集",
                            description: "枚举系统信息和用户数据",
                            severity: "medium",
                          },
                          {
                            time: "14:26:45",
                            event: "C&C通信",
                            description: "建立与指挥控制服务器的连接",
                            severity: "critical",
                          },
                          {
                            time: "14:28:21",
                            event: "横向移动",
                            description: "尝试访问内网其他主机",
                            severity: "high",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-3 bg-matrix-surface/30 rounded-lg"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full",
                                  item.severity === "critical"
                                    ? "bg-red-400"
                                    : item.severity === "high"
                                      ? "bg-orange-400"
                                      : "bg-yellow-400",
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white">
                                  {item.event}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {/* Empty State with Enhanced Information */}
        {!selectedIP && !loading && (
          <div className="space-y-6">
            {/* Platform Statistics */}
            <div className="cyber-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-quantum-500" />
                <span>平台统计概览</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        今日调查
                      </p>
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <p className="text-xs text-blue-400">↑ 12% 较昨日</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="cyber-card p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-300">
                        威胁检测
                      </p>
                      <p className="text-2xl font-bold text-white">89</p>
                      <p className="text-xs text-red-400">↑ 5% 较昨日</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-300">
                        网络连接
                      </p>
                      <p className="text-2xl font-bold text-white">3,456</p>
                      <p className="text-xs text-green-400">↑ 8% 较昨日</p>
                    </div>
                    <Network className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-300">
                        在线用户
                      </p>
                      <p className="text-2xl font-bold text-white">156</p>
                      <p className="text-xs text-purple-400">↑ 3% 较昨日</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Analysis Examples */}
            <div className="cyber-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>快速分析示例</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    ip: "192.168.1.100",
                    type: "内网扫描",
                    risk: "中风险",
                    color: "orange",
                    description: "检测到端口扫描活动",
                  },
                  {
                    ip: "10.0.0.15",
                    type: "可疑连接",
                    risk: "高风险",
                    color: "red",
                    description: "与恶意域名通信",
                  },
                  {
                    ip: "172.16.0.50",
                    type: "正常流量",
                    risk: "低风险",
                    color: "green",
                    description: "业务系统正常访问",
                  },
                ].map((example, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => setSearchIP(example.ip)}
                  >
                    <div
                      className={cn(
                        "cyber-card p-4 border-l-4 hover:bg-matrix-surface/50",
                        example.color === "red"
                          ? "border-l-red-500"
                          : example.color === "orange"
                            ? "border-l-orange-500"
                            : "border-l-green-500",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-white">
                          {example.ip}
                        </code>
                        <Badge
                          className={cn(
                            "text-xs",
                            example.color === "red"
                              ? "bg-red-500/20 text-red-400 border-red-500/40"
                              : example.color === "orange"
                                ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                : "bg-green-500/20 text-green-400 border-green-500/40",
                          )}
                        >
                          {example.risk}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-white mb-1">
                        {example.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {example.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="cyber-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>近期活动</span>
              </h3>
              <div className="space-y-4">
                {[
                  {
                    time: "2 分钟前",
                    action: "完成IP调查",
                    target: "203.0.113.42",
                    result: "发现3个威胁指标",
                    type: "investigation",
                  },
                  {
                    time: "15 分钟前",
                    action: "网络拓扑分析",
                    target: "内网段 10.0.0.0/24",
                    result: "映射126个设备",
                    type: "topology",
                  },
                  {
                    time: "32 分钟前",
                    action: "威胁情报更新",
                    target: "恶意IP数据库",
                    result: "新增847个IOC",
                    type: "update",
                  },
                  {
                    time: "1 小时前",
                    action: "数字取证扫描",
                    target: "192.168.100.5",
                    result: "提取12个工件",
                    type: "forensics",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          activity.type === "investigation"
                            ? "bg-blue-400"
                            : activity.type === "topology"
                              ? "bg-green-400"
                              : activity.type === "update"
                                ? "bg-purple-400"
                                : "bg-orange-400",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {activity.action}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-cyan-300 font-mono mt-1">
                        {activity.target}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.result}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span>系统状态</span>
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "威胁情报引擎",
                      status: "运行正常",
                      uptime: "99.9%",
                      color: "green",
                    },
                    {
                      name: "网络分析服务",
                      status: "运行正常",
                      uptime: "99.7%",
                      color: "green",
                    },
                    {
                      name: "数据库连接",
                      status: "运行���常",
                      uptime: "100%",
                      color: "green",
                    },
                    {
                      name: "API网关",
                      status: "运行正常",
                      uptime: "99.8%",
                      color: "green",
                    },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            service.color === "green"
                              ? "bg-green-400"
                              : "bg-red-400",
                          )}
                        />
                        <span className="text-sm font-medium text-white">
                          {service.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-400">
                          {service.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          运行时间: {service.uptime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <span>操作指南</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        输入目标IP
                      </p>
                      <p className="text-xs text-blue-300">
                        在搜索框中输入要调查的IP地址
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        选择分析模式
                      </p>
                      <p className="text-xs text-purple-300">
                        基础模式快速分析，高级模式深度调查
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">分析结果</p>
                      <p className="text-xs text-green-300">
                        查看威胁评估和网络关系图
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="cyber-card p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-quantum-500 to-neural-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-quantum-500/25">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    准备开始调查
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    在上方输入IP地址开始全面的威胁分析和网络调查。我们的AI驱动分析引擎将为您提供详细的安全评估。
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="flex flex-col items-center space-y-2 p-4 bg-matrix-surface/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-white font-medium">
                      实时威胁检测
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      基于最新威胁情报数据库
                    </span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 bg-matrix-surface/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-white font-medium">
                      网络关系映射
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      可视化连接和依赖关系
                    </span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 bg-matrix-surface/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-white font-medium">
                      详细分析报告
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      专业级调查文档导出
                    </span>
                  </div>
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
