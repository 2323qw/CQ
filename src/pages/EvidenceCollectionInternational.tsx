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
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Investigation Failed
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investigation Results */}
        {investigation && !loading && (
          <div className="space-y-6">
            {/* Metrics Overview */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Risk Score
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {metrics.riskScore}/100
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={metrics.riskScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {investigationMode === "advanced"
                            ? "Connections"
                            : "Attacks"}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {metrics.totalConnections}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                        <Network className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Threats Detected
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {metrics.threatsDetected}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                        <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Security Score
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {metrics.securityScore}/100
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={metrics.securityScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Basic Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Investigation Summary</span>
                  </CardTitle>
                  <CardDescription>
                    Target: {selectedIP} | Mode: {investigationMode}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    {...getReputationStatus(
                      investigationMode === "advanced"
                        ? (investigation as any).basicInfo?.reputation ||
                            "unknown"
                        : (investigation as any).reputation || "unknown",
                    )}
                  >
                    {
                      getReputationStatus(
                        investigationMode === "advanced"
                          ? (investigation as any).basicInfo?.reputation ||
                              "unknown"
                          : (investigation as any).reputation || "unknown",
                      ).label
                    }
                  </Badge>
                  <Button
                    onClick={() => handleExport("JSON")}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      IP Address
                    </label>
                    <p className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {(investigation as any).ip || selectedIP}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Location
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {(investigation as any).country || "Unknown"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Organization
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {(investigation as any).organization || "Not available"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Last Activity
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {(investigation as any).lastActivity
                        ? new Date(
                            (investigation as any).lastActivity,
                          ).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs
              defaultValue={
                investigationMode === "advanced" ? "topology" : "overview"
              }
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger
                  value="overview"
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="topology"
                  className="flex items-center space-x-2"
                >
                  <Network className="w-4 h-4" />
                  <span>Network</span>
                </TabsTrigger>
                <TabsTrigger
                  value="threats"
                  className="flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Threats</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="forensics"
                  className="flex items-center space-x-2"
                >
                  <Bug className="w-4 h-4" />
                  <span>Forensics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span>Attack Distribution</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                  fill={chartColors[index % chartColors.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-500">
                          No attack data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span>Security Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(investigation as any).timeline
                          ?.slice(0, 5)
                          .map((event: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {event.type
                                    ?.replace(/_/g, " ")
                                    .toUpperCase() || "Security Event"}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {event.details || "Security event detected"}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                  {new Date(
                                    event.timestamp || Date.now(),
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )) || (
                          <div className="text-center py-8 text-slate-500">
                            No timeline data available
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="topology">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="w-5 h-5 text-blue-600" />
                      <span>Network Topology Analysis</span>
                    </CardTitle>
                    <CardDescription>
                      Interactive visualization of network connections and
                      relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopologyAnalysisEnhanced
                      investigation={investigation}
                      centerIP={selectedIP}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="threats">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      <span>Threat Intelligence</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {investigationMode === "advanced" &&
                    (investigation as any).threatIntelligence?.blacklists ? (
                      <div className="space-y-4">
                        {(
                          investigation as any
                        ).threatIntelligence.blacklists.map(
                          (blacklist: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <div>
                                  <p className="font-medium text-red-900 dark:text-red-100">
                                    {blacklist}
                                  </p>
                                  <p className="text-sm text-red-700 dark:text-red-300">
                                    Threat database match
                                  </p>
                                </div>
                              </div>
                              <Badge variant="destructive">Blacklisted</Badge>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          No Active Threats Detected
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          This IP address is not currently listed in known
                          threat databases
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Protocol Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {protocolData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={protocolData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-500">
                          No protocol data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        <span>Network Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Active Connections
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {(
                              investigation as any
                            ).networkAnalysis?.connections?.filter(
                              (c: any) => c.status === "active",
                            ).length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Open Ports
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {(investigation as any).networkAnalysis?.openPorts
                              ?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Security Events
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {(investigation as any).timeline?.length || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="forensics">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bug className="w-5 h-5 text-orange-600" />
                      <span>Digital Forensics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {investigationMode === "advanced" &&
                    (investigation as any).forensics?.artifacts ? (
                      <div className="space-y-4">
                        {(investigation as any).forensics.artifacts
                          .slice(0, 10)
                          .map((artifact: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Badge
                                    variant={
                                      artifact.risk === "critical"
                                        ? "destructive"
                                        : artifact.risk === "high"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {artifact.type}
                                  </Badge>
                                  <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {artifact.artifact}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {artifact.description}
                                </p>
                              </div>
                              <div className="text-right text-sm text-slate-500 dark:text-slate-500">
                                {new Date(artifact.timestamp).toLocaleString()}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Bug className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          No Forensic Artifacts Found
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          No suspicious artifacts detected in the current
                          investigation
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!selectedIP && !loading && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Ready to Investigate
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Enter an IP address above to begin comprehensive threat
                    analysis and network investigation
                  </p>
                </div>
                <div className="flex justify-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Threat Intelligence</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Network Mapping</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EvidenceCollectionInternational;
