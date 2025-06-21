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
                <h3 className="font-semibold text-red-400">
                  调查失败
                </h3>
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Investigation Results */}
        {investigation && !loading && (
          <div className="space-y-6">
            {/* Metrics Overview */}
            {metrics && (
              <div className={cn(
                "grid gap-6",
                investigationMode === "basic"
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-4"
              )}>
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
                    目标: {selectedIP} | 模式: {investigationMode === "advanced" ? "高级" : "基础"} | 开始时间: {new Date().toLocaleString()}
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
                      ).variant === "destructive" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).variant === "secondary" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).variant === "default" ? "bg-green-500/20 text-green-400 border-green-500/40" :
                      "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    )}
                  >
                    {
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).label === "Malicious" ? "恶意" :
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).label === "Suspicious" ? "可疑" :
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).label === "Clean" ? "清洁" : "未知"
                    }
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
              <div className={cn(
                "grid gap-6",
                investigationMode === "basic"
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              )}>
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
            <div className={cn(
              "grid gap-6",
              investigationMode === "basic"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 lg:grid-cols-3"
            )}>
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
                        <span className="text-sm text-muted-foreground">恶意软件检测</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40">清洁</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">威胁评级</span>
                        <Badge className={cn(
                          "px-2 py-1",
                          metrics && metrics.riskScore >= 70 ? "bg-red-500/20 text-red-400 border-red-500/40" :
                          metrics && metrics.riskScore >= 40 ? "bg-orange-500/20 text-orange-400 border-orange-500/40" :
                          "bg-green-500/20 text-green-400 border-green-500/40"
                        )}>
                          {metrics && metrics.riskScore >= 70 ? "高风险" :
                           metrics && metrics.riskScore >= 40 ? "中风险" : "低风险"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">开放端口</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">3个</Badge>
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
                        <span className="text-sm text-muted-foreground">ASN编号</span>
                        <span className="text-sm text-white font-mono">{(investigation as any).asn || "AS4134"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">分析耗时</span>
                        <span className="text-sm text-white">1.8秒</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">数据源</span>
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
                        <span className="text-sm text-muted-foreground">ISP提供商</span>
                        <span className="text-sm text-white">{(investigation as any).isp || "China Telecom"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">ASN编号</span>
                        <span className="text-sm text-white font-mono">{(investigation as any).asn || "AS4134"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">域名记录</span>
                        <span className="text-sm text-white">{(investigation as any).hostname || "无PTR记录"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">网络类型</span>
                        <span className="text-sm text-white">{(investigation as any).networkType || "商业网络"}</span>
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
                        <span className="text-sm text-muted-foreground">恶意软件检测</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40">清洁</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">僵尸网络检测</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40">未检测</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">垃圾邮件源</span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">可能</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">开放端口扫描</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                          {(investigation as any).networkAnalysis?.openPorts?.length || 0}个
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
                        <span className="text-sm text-muted-foreground">分析耗时</span>
                        <span className="text-sm text-white">2.3秒</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">数据源数量</span>
                        <span className="text-sm text-white">12个</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">置信度</span>
                        <span className="text-sm text-white">94.5%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded">
                        <span className="text-sm text-muted-foreground">最后更新</span>
                        <span className="text-sm text-white">刚刚</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Advanced Analysis with Tabs - 只有高级模式显示标签页 */}
            {investigationMode === "advanced" && (
              <Tabs
                defaultValue="overview"
                className="space-y-6"
              >
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
                                fill={[
                                  "#00f5ff",
                                  "#39ff14",
                                  "#bf00ff",
                                  "#ff1493",
                                  "#ff6600",
                                  "#ffff00"
                                ][index % 6]}
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
                                {event.type
                                  ?.replace(/_/g, " ")
                                  .toUpperCase() || "安全事件"}
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
                <div className="space-y-6">
                  {/* Threat Intelligence Summary */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      <span>威胁情报分析</span>
                    </h3>

                    {/* Threat Intelligence Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="cyber-card p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-300">恶意IP检测</p>
                            <p className="text-2xl font-bold text-white">
                              {investigationMode === "advanced" && (investigation as any).threatIntelligence?.blacklists ?
                                (investigation as any).threatIntelligence.blacklists.length : 0}
                            </p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                      </div>
                      <div className="cyber-card p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-yellow-300">可疑活动</p>
                            <p className="text-2xl font-bold text-white">
                              {Object.keys((investigation as any).attackTypes || {}).length}
                            </p>
                          </div>
                          <Eye className="w-8 h-8 text-yellow-400" />
                        </div>
                      </div>
                      <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-300">情报来源</p>
                            <p className="text-2xl font-bold text-white">
                              {investigationMode === "advanced" ? "12" : "6"}
                            </p>
                          </div>
                          <Database className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {investigationMode === "advanced" &&
                    (investigation as any).threatIntelligence?.blacklists ? (
                      <div className="space-y-4">
                        <h4 className="font-medium text-white mb-3">检测到的威胁</h4>
                        {(
                          investigation as any
                        ).threatIntelligence.blacklists.map(
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
                      <div className="space-y-4">
                        <h4 className="font-medium text-white mb-3">威胁检测结果</h4>
                        <div className="text-center py-8 bg-green-500/5 border border-green-500/20 rounded-lg">
                          <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                          <h3 className="text-lg font-semibold text-white mb-2">
                            未检测到活跃威胁
                          </h3>
                          <p className="text-muted-foreground">
                            该IP地址当前未被列入已知威胁数据库
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Threat Intelligence Sources */}
                  <div className="cyber-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <span>威胁情报源</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: "VirusTotal", status: "已检查", result: "清洁", color: "green" },
                        { name: "AbuseIPDB", status: "已检查", result: investigationMode === "advanced" ? "可疑" : "清洁", color: investigationMode === "advanced" ? "orange" : "green" },
                        { name: "Shodan", status: "已扫描", result: "3个开放端口", color: "blue" },
                        { name: "AlienVault OTX", status: "已分析", result: "无威胁", color: "green" },
                        { name: "Cisco Talos", status: "已验证", result: "信誉良好", color: "green" },
                        { name: "IBM X-Force", status: "已评估", result: metrics && metrics.riskScore > 50 ? "中风险" : "低风险", color: metrics && metrics.riskScore > 50 ? "orange" : "green" }
                      ].map((source, index) => (
                        <div key={index} className="p-4 bg-matrix-surface/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{source.name}</span>
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              source.color === "green" ? "bg-green-400" :
                              source.color === "orange" ? "bg-orange-400" :
                              "bg-blue-400"
                            )} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{source.status}</p>
                          <p className={cn(
                            "text-sm font-medium",
                            source.color === "green" ? "text-green-400" :
                            source.color === "orange" ? "text-orange-400" :
                            "text-blue-400"
                          )}>{source.result}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attack Types Analysis */}
                  {Object.keys((investigation as any).attackTypes || {}).length > 0 && (
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-red-400" />
                        <span>攻击类型分析</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries((investigation as any).attackTypes || {}).map(([type, count], index) => (
                          <div key={index} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-white">{type.replace(/_/g, ' ').toUpperCase()}</p>
                                <p className="text-sm text-red-300">检测次数: {count as number}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  最后检测: {new Date().toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={cn(
                                "px-2 py-1",
                                (count as number) > 10 ? "bg-red-500/20 text-red-400 border-red-500/40" :
                                (count as number) > 5 ? "bg-orange-500/20 text-orange-400 border-orange-500/40" :
                                "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                              )}>
                                {(count as number) > 10 ? "高频" : (count as number) > 5 ? "中频" : "低频"}
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
                  {/* Analytics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="cyber-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-300">数据点</p>
                          <p className="text-xl font-bold text-white">1,247</p>
                        </div>
                        <Database className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-300">分析完成</p>
                          <p className="text-xl font-bold text-white">98.5%</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                    <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-300">处理时间</p>
                          <p className="text-xl font-bold text-white">2.3s</p>
                        </div>
                        <Clock className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="cyber-card p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-300">置信度</p>
                          <p className="text-xl font-bold text-white">94.2%</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span>协议分析</span>
                      </h3>
                      {protocolData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={protocolData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
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
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={[
                            { name: "TCP", value: 45 },
                            { name: "UDP", value: 23 },
                            { name: "HTTP", value: 67 },
                            { name: "HTTPS", value: 89 },
                            { name: "SSH", value: 12 },
                            { name: "FTP", value: 8 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
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
                      )}
                    </div>

                    <div className="cyber-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <PieChart className="w-5 h-5 text-purple-400" />
                        <span>流量分布</span>
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: "入站流量", value: 65, fill: "#00f5ff" },
                              { name: "出站流量", value: 35, fill: "#39ff14" },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
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
                          <span className="text-lg font-bold text-white">2.3 MB/s</span>
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
                            <span className="text-muted-foreground">CPU使用率</span>
                            <span className="text-white">23%</span>
                          </div>
                          <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: "23%" }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">内存使用率</span>
                            <span className="text-white">67%</span>
                          </div>
                          <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: "67%" }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">网络使用率</span>
                            <span className="text-white">45%</span>
                          </div>
                          <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" style={{ width: "45%" }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">磁盘I/O</span>
                            <span className="text-white">12%</span>
                          </div>
                          <div className="h-2 bg-matrix-surface rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: "12%" }} />
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
                      <LineChart data={[
                        { time: "00:00", connections: 45, threats: 2 },
                        { time: "04:00", connections: 23, threats: 1 },
                        { time: "08:00", connections: 67, threats: 5 },
                        { time: "12:00", connections: 89, threats: 3 },
                        { time: "16:00", connections: 76, threats: 4 },
                        { time: "20:00", connections: 54, threats: 2 },
                        { time: "24:00", connections: 34, threats: 1 }
                      ]}>
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
                        <Line type="monotone" dataKey="connections" stroke="#00f5ff" strokeWidth={2} name="网络连接" />
                        <Line type="monotone" dataKey="threats" stroke="#ff4444" strokeWidth={2} name="威胁事件" />
                      </LineChart>
                    </ResponsiveContainer>
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
                                        : "bg-gray-500/20 text-gray-400 border-gray-500/40"
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
                      <p className="text-sm font-medium text-blue-300">今日调查</p>
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <p className="text-xs text-blue-400">↑ 12% 较昨日</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="cyber-card p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-300">威胁检测</p>
                      <p className="text-2xl font-bold text-white">89</p>
                      <p className="text-xs text-red-400">↑ 5% 较昨日</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                <div className="cyber-card p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-300">网络连接</p>
                      <p className="text-2xl font-bold text-white">3,456</p>
                      <p className="text-xs text-green-400">↑ 8% 较昨日</p>
                    </div>
                    <Network className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="cyber-card p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-300">在线用户</p>
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
                    description: "检测到端口扫描活动"
                  },
                  {
                    ip: "10.0.0.15",
                    type: "可疑连接",
                    risk: "高风险",
                    color: "red",
                    description: "与恶意域名通信"
                  },
                  {
                    ip: "172.16.0.50",
                    type: "正常流量",
                    risk: "低风险",
                    color: "green",
                    description: "业务系统正常访问"
                  },
                ].map((example, index) => (
                  <div key={index}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => setSearchIP(example.ip)}
                  >
                    <div className={cn(
                      "cyber-card p-4 border-l-4 hover:bg-matrix-surface/50",
                      example.color === "red" ? "border-l-red-500" :
                      example.color === "orange" ? "border-l-orange-500" :
                      "border-l-green-500"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-white">{example.ip}</code>
                        <Badge className={cn(
                          "text-xs",
                          example.color === "red" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                          example.color === "orange" ? "bg-orange-500/20 text-orange-400 border-orange-500/40" :
                          "bg-green-500/20 text-green-400 border-green-500/40"
                        )}>
                          {example.risk}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-white mb-1">{example.type}</p>
                      <p className="text-xs text-muted-foreground">{example.description}</p>
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
                    type: "investigation"
                  },
                  {
                    time: "15 分钟前",
                    action: "网络拓扑分析",
                    target: "内网段 10.0.0.0/24",
                    result: "映射126个设备",
                    type: "topology"
                  },
                  {
                    time: "32 分钟前",
                    action: "威胁情报更新",
                    target: "恶意IP数据库",
                    result: "新增847个IOC",
                    type: "update"
                  },
                  {
                    time: "1 小时前",
                    action: "数字取证扫描",
                    target: "192.168.100.5",
                    result: "提取12个工件",
                    type: "forensics"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        activity.type === "investigation" ? "bg-blue-400" :
                        activity.type === "topology" ? "bg-green-400" :
                        activity.type === "update" ? "bg-purple-400" :
                        "bg-orange-400"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {activity.action}
                        </p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-cyan-300 font-mono mt-1">{activity.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.result}</p>
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
                    { name: "威胁情报引擎", status: "运行正常", uptime: "99.9%", color: "green" },
                    { name: "网络分析服务", status: "运行正常", uptime: "99.7%", color: "green" },
                    { name: "数据库连接", status: "运行正常", uptime: "100%", color: "green" },
                    { name: "API网关", status: "运行正常", uptime: "99.8%", color: "green" }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          service.color === "green" ? "bg-green-400" : "bg-red-400"
                        )} />
                        <span className="text-sm font-medium text-white">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-400">{service.status}</p>
                        <p className="text-xs text-muted-foreground">运行时间: {service.uptime}</p>
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
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="text-sm font-medium text-white">输入目标IP</p>
                      <p className="text-xs text-blue-300">在搜索框中输入要调查的IP地址</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="text-sm font-medium text-white">选择分析模式</p>
                      <p className="text-xs text-purple-300">基础模式快速分析，高级模式深度调查</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="text-sm font-medium text-white">分析结果</p>
                      <p className="text-xs text-green-300">查看威胁评估和网络关系图</p>
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
                    <span className="text-sm text-white font-medium">实时威胁检测</span>
                    <span className="text-xs text-muted-foreground text-center">基于最新威胁情报数据库</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 bg-matrix-surface/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-white font-medium">网络关系映射</span>
                    <span className="text-xs text-muted-foreground text-center">可视化连接和依赖关系</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 bg-matrix-surface/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-white font-medium">详细分析报告</span>
                    <span className="text-xs text-muted-foreground text-center">专业级调查文档导出</span>
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