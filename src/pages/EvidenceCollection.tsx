import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIPInvestigation } from "@/hooks/useIPInvestigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Shield,
  Globe,
  Target,
  Network,
  Brain,
  Activity,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Settings,
  RefreshCw,
  Share2,
  Flag,
  GitBranch,
  ChevronRight,
  Zap,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Camera,
  Video,
  Image,
  Hash,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Copy,
  ExternalLink,
  Play,
  Archive,
  Plus,
  Filter,
  Star,
  Heart,
  ThumbsUp,
  Radar,
  Fingerprint,
} from "lucide-react";

const EvidenceCollection: React.FC = () => {
  // URL parameter handling
  const [searchParams] = useSearchParams();
  const targetIP = searchParams.get("ip");
  const targetUser = searchParams.get("user");

  // IP Investigation hook
  const {
    investigation,
    loading: ipLoading,
    error: ipError,
    investigateIP,
    generateReport,
  } = useIPInvestigation();

  // State management
  const [activeTab, setActiveTab] = useState<
    "overview" | "collection" | "analysis" | "system" | "reports"
  >("overview");
  const [searchQuery, setSearchQuery] = useState(targetUser || targetIP || "");

  // Auto-start investigation if URL parameter is present
  useEffect(() => {
    if (targetIP) {
      setSearchQuery(targetIP);
      investigateIP(targetIP);
    } else if (targetUser) {
      setSearchQuery(targetUser);
    }
  }, [targetIP, targetUser, investigateIP]);

  // Mock data - simplified and focused
  const mockStats = {
    activeInvestigations: 3,
    collectedAssets: 147,
    threatLevel: "高风险",
    confidence: 87,
  };

  const mockAttackChain = [
    { phase: "侦察", status: "completed", severity: "medium", time: "3天前" },
    { phase: "投递", status: "completed", severity: "high", time: "1天前" },
    { phase: "利用", status: "active", severity: "critical", time: "进行中" },
    { phase: "控制", status: "blocked", severity: "high", time: "已阻断" },
  ];

  const mockAttacks = [
    {
      id: "T1190",
      name: "Web应用利用",
      severity: "critical",
      time: "15:28",
      status: "detected",
    },
    {
      id: "T1055",
      name: "进程注入",
      severity: "high",
      time: "15:35",
      status: "blocked",
    },
    {
      id: "T1071",
      name: "C2通信",
      severity: "medium",
      time: "15:42",
      status: "monitoring",
    },
  ];

  const mockAssets = [
    {
      id: "1",
      type: "post",
      platform: "twitter",
      content: "Setting up secure communication channels...",
      author: targetUser || "suspect_user",
      risk: "high",
      verified: true,
    },
    {
      id: "2",
      type: "image",
      platform: "instagram",
      content: "Location data embedded in image metadata",
      author: "related_user",
      risk: "medium",
      verified: true,
    },
    {
      id: "3",
      type: "network",
      platform: "system",
      content: `Suspicious traffic from ${targetIP || "192.168.1.100"}`,
      author: "system",
      risk: "critical",
      verified: true,
    },
  ];

  // System processes data
  interface SystemProcess {
    pid: number;
    name: string;
    status: "running" | "sleeping" | "stopped" | "zombie";
    username: string;
    cpu_percent: number;
    memory_percent: number;
    memory_rss: number;
    memory_vms: number;
    io_read_bytes: number;
    io_write_bytes: number;
    num_threads: number;
    create_time: string;
    id: number;
    timestamp: string;
    risk_level?: "low" | "medium" | "high" | "critical";
  }

  const mockProcesses: SystemProcess[] = [
    {
      pid: 46532,
      name: "msedgewebview2.exe",
      status: "running",
      username: "DIEOUT\\DIEOUT",
      cpu_percent: 0.0,
      memory_percent: 0.06824922610466883,
      memory_rss: 22.2109375,
      memory_vms: 10.03515625,
      io_read_bytes: 3.589977264404297,
      io_write_bytes: 8.122886657714844,
      num_threads: 11,
      create_time: "2025-06-23T13:15:02.641886",
      id: 7147,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "low",
    },
    {
      pid: 1337,
      name: "suspicious_process.exe",
      status: "running",
      username: "SYSTEM",
      cpu_percent: 85.2,
      memory_percent: 12.5,
      memory_rss: 512.0,
      memory_vms: 1024.0,
      io_read_bytes: 450.2,
      io_write_bytes: 320.8,
      num_threads: 25,
      create_time: "2025-06-23T14:30:15.123456",
      id: 7148,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "critical",
    },
    {
      pid: 2048,
      name: "chrome.exe",
      status: "running",
      username: "DIEOUT\\DIEOUT",
      cpu_percent: 15.7,
      memory_percent: 8.3,
      memory_rss: 340.5,
      memory_vms: 680.2,
      io_read_bytes: 125.3,
      io_write_bytes: 89.1,
      num_threads: 18,
      create_time: "2025-06-23T09:45:20.987654",
      id: 7149,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "low",
    },
    {
      pid: 3333,
      name: "powershell.exe",
      status: "running",
      username: "DIEOUT\\DIEOUT",
      cpu_percent: 45.8,
      memory_percent: 3.2,
      memory_rss: 128.7,
      memory_vms: 256.4,
      io_read_bytes: 89.5,
      io_write_bytes: 156.9,
      num_threads: 8,
      create_time: "2025-06-23T14:20:10.456789",
      id: 7150,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "medium",
    },
    {
      pid: 4096,
      name: "svchost.exe",
      status: "running",
      username: "NT AUTHORITY\\SYSTEM",
      cpu_percent: 2.1,
      memory_percent: 1.8,
      memory_rss: 75.3,
      memory_vms: 150.6,
      io_read_bytes: 25.2,
      io_write_bytes: 18.7,
      num_threads: 12,
      create_time: "2025-06-23T08:00:00.000000",
      id: 7151,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "low",
    },
    {
      pid: 6666,
      name: "unknown_miner.exe",
      status: "running",
      username: "GUEST",
      cpu_percent: 98.5,
      memory_percent: 25.7,
      memory_rss: 1024.0,
      memory_vms: 2048.0,
      io_read_bytes: 1200.5,
      io_write_bytes: 800.3,
      num_threads: 32,
      create_time: "2025-06-23T14:25:45.789012",
      id: 7152,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "critical",
    },
  ];

  const [processFilter, setProcessFilter] = useState("");
  const [sortBy, setSortBy] = useState<keyof SystemProcess>("cpu_percent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "active":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "blocked":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "detected":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/40";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600/20 text-red-400 border-red-600/40";
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/40";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-600/20 text-red-400 border-red-600/40";
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/40";
    }
  };

  return (
    <div className="min-h-screen matrix-bg">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Streamlined Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white glow-text">
                智能证据收集中心
              </h1>
              <p className="text-sm text-muted-foreground">
                OSINT情报收集 • 威胁分析 • 数字取证
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-500/20 text-blue-400 border-blue-500/30"
              >
                <Search className="w-4 h-4 mr-2" />
                新建调查
              </Button>
            </div>
          </div>

          {/* Alert Banner - Only when triggered from alerts */}
          {(targetIP || targetUser) && (
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30 mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-400">
                    {targetIP ? "IP威胁调查" : "用户情报收集"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    目标: {targetIP || targetUser} • 来源: 威胁告警系统
                  </p>
                </div>
                {targetIP && investigation && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                    风险评分: {investigation.riskScore}/100
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compact Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid w-full grid-cols-5 bg-matrix-surface/50 mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-cyan-400/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              概览
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="data-[state=active]:bg-blue-400/20"
            >
              <Search className="w-4 h-4 mr-2" />
              收集
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-purple-400/20"
            >
              <Brain className="w-4 h-4 mr-2" />
              分析
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-orange-400/20"
            >
              <Activity className="w-4 h-4 mr-2" />
              系统
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-green-400/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              报告
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Main Dashboard */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">活跃调查</p>
                      <p className="text-xl font-bold text-cyan-400">
                        {mockStats.activeInvestigations}
                      </p>
                    </div>
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">收集资产</p>
                      <p className="text-xl font-bold text-green-400">
                        {mockStats.collectedAssets}
                      </p>
                    </div>
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">威胁等级</p>
                      <p className="text-xl font-bold text-red-400">
                        {mockStats.threatLevel}
                      </p>
                    </div>
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">可信度</p>
                      <p className="text-xl font-bold text-purple-400">
                        {mockStats.confidence}%
                      </p>
                    </div>
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attack Chain - Left Column */}
              <Card className="cyber-card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-red-400" />
                    攻击链分析
                    {targetIP && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                        {targetIP}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Attack Chain Phases */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {mockAttackChain.map((phase, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-3 rounded-lg border text-center",
                            phase.status === "completed" &&
                              "bg-red-500/20 border-red-500/40",
                            phase.status === "active" &&
                              "bg-orange-500/20 border-orange-500/40 animate-pulse",
                            phase.status === "blocked" &&
                              "bg-blue-500/20 border-blue-500/40",
                          )}
                        >
                          <p className="font-medium text-sm">{phase.phase}</p>
                          <Badge
                            className={getStatusColor(phase.status)}
                            size="sm"
                          >
                            {phase.status === "completed"
                              ? "完成"
                              : phase.status === "active"
                                ? "进行中"
                                : "已阻断"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {phase.time}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* MITRE ATT&CK Techniques */}
                    <div>
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-400" />
                        检测到的攻击技术
                      </h4>
                      <div className="space-y-2">
                        {mockAttacks.map((attack, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                className={getSeverityColor(attack.severity)}
                                size="sm"
                              >
                                {attack.id}
                              </Badge>
                              <span className="text-sm font-medium">
                                {attack.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {attack.time}
                              </span>
                              <Badge
                                className={getStatusColor(attack.status)}
                                size="sm"
                              >
                                {attack.status === "detected"
                                  ? "已检测"
                                  : attack.status === "blocked"
                                    ? "已阻断"
                                    : "监控中"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-3 border-t border-matrix-border">
                      <Button
                        size="sm"
                        className="bg-red-500/20 text-red-400 border-red-500/30"
                      >
                        <Flag className="w-3 h-3 mr-1" />
                        IOC报告
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        导出链条
                      </Button>
                      <Button
                        size="sm"
                        className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        AI分析
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intelligence Summary - Right Column */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    威胁情报
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Threat Level */}
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          综合威胁评级
                        </span>
                        <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                          严重
                        </Badge>
                      </div>
                      <Progress value={85} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        检测到APT组织活动特征
                      </p>
                    </div>

                    {/* Key Indicators */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>🌍 来源地区</span>
                        <span className="font-medium">东欧 (85%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>🎯 攻击类型</span>
                        <span className="font-medium">APT28</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>🔗 关联IOCs</span>
                        <span className="font-medium">12个指标</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>⚡ 活动状态</span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                          活跃中
                        </Badge>
                      </div>
                    </div>

                    {/* Response Status */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">防御状态</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span>✅ 网络隔离</span>
                          <span className="text-green-400">已执行</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>✅ WAF阻断</span>
                          <span className="text-green-400">47次</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>⚠️ 横向检查</span>
                          <span className="text-yellow-400">进行中</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Analysis */}
                    <Button
                      className="w-full bg-purple-500/20 text-purple-400 border-purple-500/30"
                      onClick={() => {
                        if (targetIP) {
                          investigateIP(targetIP);
                        }
                      }}
                      disabled={ipLoading}
                    >
                      {ipLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Radar className="w-4 h-4 mr-2" />
                      )}
                      {ipLoading ? "分析中..." : "深度分析"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Assets */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-400" />
                  最新证据资产
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {asset.type === "post" && (
                            <MessageSquare className="w-4 h-4" />
                          )}
                          {asset.type === "image" && (
                            <Image className="w-4 h-4" />
                          )}
                          {asset.type === "network" && (
                            <Network className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium">
                            {asset.platform}
                          </span>
                        </div>
                        <Badge className={getRiskColor(asset.risk)} size="sm">
                          {asset.risk === "critical"
                            ? "严重"
                            : asset.risk === "high"
                              ? "高危"
                              : "中危"}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2 line-clamp-2">
                        {asset.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          @{asset.author}
                        </span>
                        {asset.verified && (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  智能情报收集
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="输入IP地址、用户名、邮箱或关键词..."
                      className="flex-1 cyber-input"
                    />
                    <Button className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Search className="w-4 h-4 mr-2" />
                      搜索
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      社交媒体
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      网络资产
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      邮件追踪
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      图像搜索
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Monitoring Tab */}
          <TabsContent value="system" className="space-y-6">
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">运行进程</p>
                      <p className="text-xl font-bold text-green-400">
                        {
                          mockProcesses.filter((p) => p.status === "running")
                            .length
                        }
                      </p>
                    </div>
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        高风险进程
                      </p>
                      <p className="text-xl font-bold text-red-400">
                        {
                          mockProcesses.filter(
                            (p) => p.risk_level === "critical",
                          ).length
                        }
                      </p>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">CPU使用率</p>
                      <p className="text-xl font-bold text-orange-400">
                        {Math.round(
                          mockProcesses.reduce(
                            (acc, p) => acc + p.cpu_percent,
                            0,
                          ),
                        )}
                        %
                      </p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">内存使用</p>
                      <p className="text-xl font-bold text-purple-400">
                        {Math.round(
                          mockProcesses.reduce(
                            (acc, p) => acc + p.memory_percent,
                            0,
                          ),
                        )}
                        %
                      </p>
                    </div>
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Process Monitoring */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-400" />
                    系统进程监控
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                      实时
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="搜索进程..."
                      value={processFilter}
                      onChange={(e) => setProcessFilter(e.target.value)}
                      className="w-48 cyber-input"
                    />
                    <Button
                      size="sm"
                      className="bg-orange-500/20 text-orange-400 border-orange-500/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      刷新
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-matrix-border">
                        <th
                          className="text-left p-3 text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => {
                            setSortBy("pid");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          PID
                        </th>
                        <th
                          className="text-left p-3 text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => {
                            setSortBy("name");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          进程名
                        </th>
                        <th className="text-left p-3 text-muted-foreground">
                          状态
                        </th>
                        <th className="text-left p-3 text-muted-foreground">
                          用户
                        </th>
                        <th
                          className="text-left p-3 text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => {
                            setSortBy("cpu_percent");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          CPU%
                        </th>
                        <th
                          className="text-left p-3 text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => {
                            setSortBy("memory_percent");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          内存%
                        </th>
                        <th className="text-left p-3 text-muted-foreground">
                          RSS (MB)
                        </th>
                        <th className="text-left p-3 text-muted-foreground">
                          线程
                        </th>
                        <th className="text-left p-3 text-muted-foreground">
                          风险
                        </th>
                        <th className="text-left p-3 text-muted-foreground">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProcesses
                        .filter(
                          (process) =>
                            process.name
                              .toLowerCase()
                              .includes(processFilter.toLowerCase()) ||
                            process.pid.toString().includes(processFilter) ||
                            process.username
                              .toLowerCase()
                              .includes(processFilter.toLowerCase()),
                        )
                        .sort((a, b) => {
                          const aVal = a[sortBy];
                          const bVal = b[sortBy];
                          if (sortOrder === "asc") {
                            return aVal > bVal ? 1 : -1;
                          } else {
                            return aVal < bVal ? 1 : -1;
                          }
                        })
                        .map((process) => (
                          <tr
                            key={process.id}
                            className={cn(
                              "border-b border-matrix-border/50 hover:bg-matrix-surface/30",
                              process.risk_level === "critical" &&
                                "bg-red-500/5",
                              process.risk_level === "high" &&
                                "bg-orange-500/5",
                            )}
                          >
                            <td className="p-3 font-mono">{process.pid}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {process.name}
                                </span>
                                {process.risk_level === "critical" && (
                                  <AlertTriangle className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge
                                className={getStatusColor(process.status)}
                                size="sm"
                              >
                                {process.status === "running"
                                  ? "运行"
                                  : process.status === "sleeping"
                                    ? "休眠"
                                    : process.status === "stopped"
                                      ? "停止"
                                      : "僵尸"}
                              </Badge>
                            </td>
                            <td
                              className="p-3 text-xs font-mono truncate max-w-24"
                              title={process.username}
                            >
                              {process.username}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "font-mono",
                                    process.cpu_percent > 80
                                      ? "text-red-400"
                                      : process.cpu_percent > 50
                                        ? "text-orange-400"
                                        : process.cpu_percent > 20
                                          ? "text-yellow-400"
                                          : "text-green-400",
                                  )}
                                >
                                  {process.cpu_percent.toFixed(1)}%
                                </span>
                                {process.cpu_percent > 50 && (
                                  <Progress
                                    value={process.cpu_percent}
                                    className="w-8 h-1"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  "font-mono",
                                  process.memory_percent > 10
                                    ? "text-red-400"
                                    : process.memory_percent > 5
                                      ? "text-orange-400"
                                      : process.memory_percent > 2
                                        ? "text-yellow-400"
                                        : "text-green-400",
                                )}
                              >
                                {process.memory_percent.toFixed(2)}%
                              </span>
                            </td>
                            <td className="p-3 font-mono text-xs">
                              {process.memory_rss.toFixed(1)}
                            </td>
                            <td className="p-3 font-mono">
                              {process.num_threads}
                            </td>
                            <td className="p-3">
                              <Badge
                                className={getRiskColor(
                                  process.risk_level || "low",
                                )}
                                size="sm"
                              >
                                {process.risk_level === "critical"
                                  ? "严重"
                                  : process.risk_level === "high"
                                    ? "高危"
                                    : process.risk_level === "medium"
                                      ? "中危"
                                      : "正常"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  className="bg-blue-500/20 text-blue-400 border-blue-500/30 p-1"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                {process.risk_level &&
                                  ["high", "critical"].includes(
                                    process.risk_level,
                                  ) && (
                                    <Button
                                      size="sm"
                                      className="bg-red-500/20 text-red-400 border-red-500/30 p-1"
                                    >
                                      <AlertTriangle className="w-3 h-3" />
                                    </Button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Process Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    威胁进程检测
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProcesses
                      .filter(
                        (p) =>
                          p.risk_level &&
                          ["high", "critical"].includes(p.risk_level),
                      )
                      .map((process) => (
                        <div
                          key={process.id}
                          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="font-medium">
                                {process.name}
                              </span>
                              <Badge
                                className="bg-red-600/20 text-red-400 border-red-600/40"
                                size="sm"
                              >
                                PID: {process.pid}
                              </Badge>
                            </div>
                            <Badge
                              className={getRiskColor(
                                process.risk_level || "low",
                              )}
                              size="sm"
                            >
                              {process.risk_level === "critical"
                                ? "严重威胁"
                                : "可疑行为"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <span>CPU: {process.cpu_percent.toFixed(1)}%</span>
                            <span>
                              内存: {process.memory_percent.toFixed(2)}%
                            </span>
                            <span>
                              用户: {process.username.split("\\").pop()}
                            </span>
                            <span>线程: {process.num_threads}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-1"
                            >
                              <Flag className="w-3 h-3 mr-1" />
                              标记
                            </Button>
                            <Button
                              size="sm"
                              className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              隔离
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    资源使用分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>CPU使用率分布</span>
                        <span>
                          {Math.round(
                            mockProcesses.reduce(
                              (acc, p) => acc + p.cpu_percent,
                              0,
                            ),
                          )}
                          % 总计
                        </span>
                      </div>
                      <div className="space-y-1">
                        {mockProcesses
                          .filter((p) => p.cpu_percent > 10)
                          .sort((a, b) => b.cpu_percent - a.cpu_percent)
                          .slice(0, 5)
                          .map((process) => (
                            <div
                              key={process.id}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs w-32 truncate">
                                {process.name}
                              </span>
                              <Progress
                                value={process.cpu_percent}
                                className="flex-1 h-2"
                              />
                              <span className="text-xs w-12 text-right">
                                {process.cpu_percent.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>内存使用分布</span>
                        <span>
                          {mockProcesses
                            .reduce((acc, p) => acc + p.memory_percent, 0)
                            .toFixed(1)}
                          % 总计
                        </span>
                      </div>
                      <div className="space-y-1">
                        {mockProcesses
                          .filter((p) => p.memory_percent > 1)
                          .sort((a, b) => b.memory_percent - a.memory_percent)
                          .slice(0, 5)
                          .map((process) => (
                            <div
                              key={process.id}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs w-32 truncate">
                                {process.name}
                              </span>
                              <Progress
                                value={process.memory_percent * 4}
                                className="flex-1 h-2"
                              />
                              <span className="text-xs w-12 text-right">
                                {process.memory_percent.toFixed(2)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    行为分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">活动模式</h4>
                      <div className="grid grid-cols-8 gap-1 mb-2">
                        {Array.from({ length: 24 }, (_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-6 rounded text-xs flex items-center justify-center",
                              i >= 22 || i <= 6
                                ? "bg-red-500/30"
                                : "bg-green-500/30",
                            )}
                          >
                            {i}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        主要活跃时间: 深夜至凌晨 (异常作息模式)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-400" />
                    关联分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Network className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      发现 {mockStats.activeInvestigations} 个直接关联
                    </p>
                    <p className="text-sm text-muted-foreground">
                      检测到可疑协调行为
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  智能报告生成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      name: "威胁评估报告",
                      icon: <Shield className="w-5 h-5" />,
                      color: "red",
                    },
                    {
                      name: "行为分析报告",
                      icon: <Brain className="w-5 h-5" />,
                      color: "purple",
                    },
                    {
                      name: "关联网络报告",
                      icon: <Network className="w-5 h-5" />,
                      color: "blue",
                    },
                    {
                      name: "时间线报告",
                      icon: <Clock className="w-5 h-5" />,
                      color: "green",
                    },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer hover:scale-105 transition-all",
                        `bg-${report.color}-500/20 border-${report.color}-500/30`,
                      )}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {report.icon}
                        <span className="font-medium text-sm">
                          {report.name}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-white/10 text-white border-white/20"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        生成
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EvidenceCollection;
