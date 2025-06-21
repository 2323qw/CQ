import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Brain,
  Search,
  TrendingUp,
  AlertTriangle,
  Shield,
  Database,
  Activity,
  Play,
  Pause,
  Stop,
  Settings,
  Download,
  Upload,
  Eye,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Network,
  Globe,
  Server,
  Users,
  FileText,
  Tag,
  Calendar,
  MapPin,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Unlock,
  Code,
  Terminal,
  Layers,
  GitBranch,
  Share2,
  Bell,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
} from "lucide-react";

// Types for threat hunting
interface HuntingRule {
  id: string;
  name: string;
  description: string;
  query: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "paused" | "draft";
  category: string;
  dataSource: string[];
  lastRun: string;
  detections: number;
  accuracy: number;
  author: string;
  tags: string[];
  aiGenerated: boolean;
  confidence: number;
}

interface HuntingResult {
  id: string;
  ruleId: string;
  ruleName: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  description: string;
  details: {
    sourceIp: string;
    targetIp: string;
    protocol: string;
    port: number;
    process: string;
    user: string;
    command: string;
    fileHash: string;
  };
  indicators: string[];
  mitreTactics: string[];
  mitreActiques: string[];
  status: "new" | "investigating" | "confirmed" | "false_positive" | "resolved";
  assignedTo?: string;
  evidence: Evidence[];
  riskScore: number;
}

interface Evidence {
  id: string;
  type: "log" | "network" | "file" | "registry" | "memory" | "artifact";
  source: string;
  timestamp: string;
  content: string;
  hash: string;
  relevance: number;
}

interface HuntingCampaign {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "completed" | "suspended";
  startDate: string;
  endDate?: string;
  hypothesis: string;
  objectives: string[];
  rules: string[];
  results: number;
  findings: number;
  progress: number;
  team: string[];
  priority: "low" | "medium" | "high" | "critical";
}

interface AIModel {
  id: string;
  name: string;
  type:
    | "anomaly_detection"
    | "behavioral_analysis"
    | "pattern_recognition"
    | "nlp"
    | "time_series";
  status: "training" | "active" | "updating" | "error";
  accuracy: number;
  lastTrained: string;
  dataPoints: number;
  version: string;
  description: string;
}

const ThreatHunting: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "rules" | "results" | "campaigns" | "ai_models" | "analytics"
  >("dashboard");
  const [huntingRules, setHuntingRules] = useState<HuntingRule[]>([]);
  const [huntingResults, setHuntingResults] = useState<HuntingResult[]>([]);
  const [campaigns, setCampaigns] = useState<HuntingCampaign[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [isHunting, setIsHunting] = useState(false);
  const [selectedRule, setSelectedRule] = useState<HuntingRule | null>(null);
  const [selectedResult, setSelectedResult] = useState<HuntingResult | null>(
    null,
  );

  // Initialize sample data
  useEffect(() => {
    setHuntingRules([
      {
        id: "rule-001",
        name: "异常PowerShell执行检测",
        description: "检测可疑的PowerShell命令执行模式，包括编码命令和远程下载",
        query: `source="windows_logs" | where ProcessName="powershell.exe" | where CommandLine contains ("-enc" OR "-e " OR "IEX" OR "DownloadString")`,
        severity: "high",
        status: "active",
        category: "恶意软件执行",
        dataSource: ["Windows事件日志", "EDR数据"],
        lastRun: "2024-01-20 14:30:00",
        detections: 12,
        accuracy: 94.5,
        author: "AI系统",
        tags: ["PowerShell", "命令注入", "下载器"],
        aiGenerated: true,
        confidence: 92,
      },
      {
        id: "rule-002",
        name: "横向移动行为检测",
        description: "识别网络内部的异常横向移动模式",
        query: `source="network_logs" | stats count by src_ip, dest_ip | where count > 10 AND dest_ip != src_ip`,
        severity: "medium",
        status: "active",
        category: "横向移动",
        dataSource: ["网络流量", "防火墙日志"],
        lastRun: "2024-01-20 14:15:00",
        detections: 5,
        accuracy: 87.2,
        author: "安全分析师",
        tags: ["横向移动", "网络行为", "内网渗透"],
        aiGenerated: false,
        confidence: 85,
      },
      {
        id: "rule-003",
        name: "文件加密勒索检测",
        description: "基于文件操作模式检测勒索软件活动",
        query: `source="file_activity" | where (extension=".encrypted" OR extension=".locked") | stats count by process | where count > 50`,
        severity: "critical",
        status: "active",
        category: "勒索软件",
        dataSource: ["文件系统监控", "进程监控"],
        lastRun: "2024-01-20 14:45:00",
        detections: 2,
        accuracy: 98.7,
        author: "AI系统",
        tags: ["勒索软件", "文件加密", "恶意软件"],
        aiGenerated: true,
        confidence: 96,
      },
      {
        id: "rule-004",
        name: "DNS隧道通信检测",
        description: "检测可疑的DNS查询模式，识别DNS隧道通信",
        query: `source="dns_logs" | where query_length > 100 OR subdomain_count > 5 | eval entropy=entropy(query_name) | where entropy > 4.5`,
        severity: "high",
        status: "active",
        category: "命令控制",
        dataSource: ["DNS日志", "网络监控"],
        lastRun: "2024-01-20 14:20:00",
        detections: 8,
        accuracy: 91.3,
        author: "威胁研究员",
        tags: ["DNS隧道", "C2通信", "数据渗透"],
        aiGenerated: false,
        confidence: 89,
      },
    ]);

    setHuntingResults([
      {
        id: "result-001",
        ruleId: "rule-001",
        ruleName: "异常PowerShell执行检测",
        timestamp: "2024-01-20 14:32:15",
        severity: "high",
        confidence: 94,
        description: "检测到可疑的编码PowerShell命令执行",
        details: {
          sourceIp: "192.168.1.105",
          targetIp: "203.0.113.42",
          protocol: "HTTPS",
          port: 443,
          process: "powershell.exe",
          user: "DOMAIN\\user123",
          command:
            "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...",
          fileHash: "a1b2c3d4e5f6789...",
        },
        indicators: ["编码PowerShell命令", "远程下载行为", "绕过执行策略"],
        mitreTactics: ["TA0002", "TA0005"],
        mitreActiques: ["T1059.001", "T1140"],
        status: "investigating",
        assignedTo: "security_analyst_1",
        evidence: [
          {
            id: "ev-001",
            type: "log",
            source: "Windows Security Log",
            timestamp: "2024-01-20 14:32:15",
            content: "Process Create: powershell.exe -enc ...",
            hash: "sha256:abc123...",
            relevance: 95,
          },
        ],
        riskScore: 85,
      },
      {
        id: "result-002",
        ruleId: "rule-003",
        ruleName: "文件加密勒索检测",
        timestamp: "2024-01-20 14:47:22",
        severity: "critical",
        confidence: 98,
        description: "检测到大量文件被加密，疑似勒索软件活动",
        details: {
          sourceIp: "192.168.1.87",
          targetIp: "192.168.1.87",
          protocol: "SMB",
          port: 445,
          process: "explorer.exe",
          user: "DOMAIN\\finance_user",
          command: "N/A",
          fileHash: "f7e8d9c1b2a3456...",
        },
        indicators: ["大量文件重命名", "加密文件扩展名", "勒索提示文件创建"],
        mitreTactics: ["TA0040"],
        mitreActiques: ["T1486"],
        status: "confirmed",
        assignedTo: "incident_response_team",
        evidence: [
          {
            id: "ev-002",
            type: "file",
            source: "File System Monitor",
            timestamp: "2024-01-20 14:47:22",
            content: "File renamed: document.pdf -> document.pdf.encrypted",
            hash: "sha256:def456...",
            relevance: 99,
          },
        ],
        riskScore: 95,
      },
    ]);

    setCampaigns([
      {
        id: "campaign-001",
        name: "APT28 猎捕行动",
        description: "针对APT28组织的专项威胁猎捕活动",
        status: "active",
        startDate: "2024-01-15",
        hypothesis: "APT28可能已渗透公司网络，正在进行数据收集",
        objectives: [
          "发现APT28相关的IOC",
          "识别可能的C2通信",
          "检测横向移动活动",
          "评估数据渗透风险",
        ],
        rules: ["rule-001", "rule-002", "rule-004"],
        results: 15,
        findings: 3,
        progress: 65,
        team: ["threat_hunter_1", "analyst_2", "researcher_3"],
        priority: "critical",
      },
      {
        id: "campaign-002",
        name: "内部威胁检测",
        description: "识别内部人员的恶意行为",
        status: "active",
        startDate: "2024-01-10",
        hypothesis: "可能存在内部人员滥用权限或恶意泄露数据",
        objectives: ["监控���权用户行为", "检测异常数据访问", "识别权限滥用"],
        rules: ["rule-002"],
        results: 8,
        findings: 1,
        progress: 40,
        team: ["insider_threat_analyst", "hr_security"],
        priority: "medium",
      },
    ]);

    setAIModels([
      {
        id: "model-001",
        name: "异常行为检测模型",
        type: "anomaly_detection",
        status: "active",
        accuracy: 94.2,
        lastTrained: "2024-01-18",
        dataPoints: 2500000,
        version: "v2.1.3",
        description: "基于用户和实体行为分析的异常检测模型",
      },
      {
        id: "model-002",
        name: "恶意软件分类器",
        type: "pattern_recognition",
        status: "active",
        accuracy: 97.8,
        lastTrained: "2024-01-19",
        dataPoints: 1800000,
        version: "v3.0.1",
        description: "基于静态和动态特征的恶意软件识别模型",
      },
      {
        id: "model-003",
        name: "网络流量分析器",
        type: "time_series",
        status: "training",
        accuracy: 89.5,
        lastTrained: "2024-01-17",
        dataPoints: 5000000,
        version: "v1.5.2",
        description: "时间序列分析模型，用于检测网���流量异常",
      },
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "paused":
      case "investigating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "draft":
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "error":
      case "false_positive":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const startHunting = () => {
    setIsHunting(true);
    // Simulate hunting process
    setTimeout(() => setIsHunting(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <Target className="w-8 h-8 text-red-400" />
              AI威胁猎捕
            </h1>
            <p className="text-muted-foreground mt-2">
              基于机器学习的主动威胁发现与分析平台
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={startHunting}
              disabled={isHunting}
              className={cn(
                "relative overflow-hidden",
                isHunting
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
              )}
            >
              {isHunting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  猎捕中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  开始猎捕
                </>
              )}
            </Button>
            <Button className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30">
              <Plus className="w-4 h-4 mr-2" />
              新建规则
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃规则</p>
                  <p className="text-2xl font-bold text-red-400">
                    {huntingRules.filter((r) => r.status === "active").length}
                  </p>
                  <p className="text-xs text-red-400 mt-1">正在运行</p>
                </div>
                <Target className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日检测</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {huntingResults.length}
                  </p>
                  <p className="text-xs text-orange-400 mt-1">威胁发现</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI准确率</p>
                  <p className="text-2xl font-bold text-green-400">94.2%</p>
                  <p className="text-xs text-green-400 mt-1">持续学习</p>
                </div>
                <Brain className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃行动</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {campaigns.filter((c) => c.status === "active").length}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">猎捕行动</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI模型</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {aiModels.filter((m) => m.status === "active").length}
                  </p>
                  <p className="text-xs text-purple-400 mt-1">在线运行</p>
                </div>
                <Cpu className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 bg-matrix-surface/50">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-neon-blue/20"
            >
              总览
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="data-[state=active]:bg-neon-blue/20"
            >
              猎捕规则
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-neon-blue/20"
            >
              威胁发现
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="data-[state=active]:bg-neon-blue/20"
            >
              猎捕行动
            </TabsTrigger>
            <TabsTrigger
              value="ai_models"
              className="data-[state=active]:bg-neon-blue/20"
            >
              AI模型
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-neon-blue/20"
            >
              分析报告
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Hunting Status */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    实时猎捕状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {huntingRules
                    .filter((r) => r.status === "active")
                    .map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {rule.name}
                            </span>
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>检测: {rule.detections}</span>
                            <span>准确率: {rule.accuracy}%</span>
                            <span>上次运行: {rule.lastRun}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-xs text-green-400">运行中</span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Recent Threats */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    最新威胁发现
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {huntingResults.slice(0, 3).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-start gap-3 p-3 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {result.ruleName}
                          </span>
                          <Badge className={getSeverityColor(result.severity)}>
                            {result.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>置信度: {result.confidence}%</span>
                          <span>风险分数: {result.riskScore}</span>
                          <span>{result.timestamp}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Hunting Campaigns Overview */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  活跃猎捕行动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns
                    .filter((c) => c.status === "active")
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{campaign.name}</h3>
                            <Badge
                              className={getSeverityColor(campaign.priority)}
                            >
                              {campaign.priority}
                            </Badge>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            进度: {campaign.progress}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {campaign.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span>发现: {campaign.findings}</span>
                            <span>结果: {campaign.results}</span>
                            <span>团队: {campaign.team.length}人</span>
                          </div>
                          <Progress
                            value={campaign.progress}
                            className="w-32"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hunting Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-neon-blue" />
                    威胁猎捕规则管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="筛选类别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类别</SelectItem>
                        <SelectItem value="malware">恶意软件</SelectItem>
                        <SelectItem value="network">网络行为</SelectItem>
                        <SelectItem value="lateral">横向移动</SelectItem>
                        <SelectItem value="c2">命令控制</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Brain className="w-4 h-4 mr-2" />
                      AI生成规则
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {huntingRules.map((rule) => (
                    <Card
                      key={rule.id}
                      className="cyber-card-enhanced border-matrix-border hover:border-neon-blue/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedRule(rule)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{rule.name}</h3>
                              <Badge
                                className={getSeverityColor(rule.severity)}
                              >
                                {rule.severity}
                              </Badge>
                              <Badge className={getStatusColor(rule.status)}>
                                {rule.status}
                              </Badge>
                              {rule.aiGenerated && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                                  AI生成
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {rule.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  检测数
                                </p>
                                <p className="font-bold text-orange-400">
                                  {rule.detections}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  准确率
                                </p>
                                <p className="font-bold text-green-400">
                                  {rule.accuracy}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  置信度
                                </p>
                                <p className="font-bold text-blue-400">
                                  {rule.confidence}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  上次运行
                                </p>
                                <p className="text-sm">{rule.lastRun}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {rule.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-matrix-bg/50 rounded p-3 border border-matrix-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            查询语句:
                          </p>
                          <code className="text-sm font-mono text-green-400">
                            {rule.query}
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Threat Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    威胁发现与调查
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="状态筛选" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="new">新发现</SelectItem>
                        <SelectItem value="investigating">调查中</SelectItem>
                        <SelectItem value="confirmed">已确认</SelectItem>
                        <SelectItem value="false_positive">误报</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Download className="w-4 h-4 mr-2" />
                      导出报告
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {huntingResults.map((result) => (
                    <Card
                      key={result.id}
                      className="cyber-card-enhanced border-matrix-border hover:border-red-400/30 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{result.ruleName}</h3>
                              <Badge
                                className={getSeverityColor(result.severity)}
                              >
                                {result.severity}
                              </Badge>
                              <Badge className={getStatusColor(result.status)}>
                                {result.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                风险分数: {result.riskScore}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {result.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  源IP
                                </p>
                                <p className="text-sm font-mono">
                                  {result.details.sourceIp}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  目标IP
                                </p>
                                <p className="text-sm font-mono">
                                  {result.details.targetIp}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  进程
                                </p>
                                <p className="text-sm font-mono">
                                  {result.details.process}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  用户
                                </p>
                                <p className="text-sm">{result.details.user}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-muted-foreground">
                              置信度:
                            </span>
                            <span className="font-bold text-green-400">
                              {result.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">
                              威胁指标:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {result.indicators.map((indicator, index) => (
                                <Badge
                                  key={index}
                                  className="bg-red-500/20 text-red-400 border-red-500/40 text-xs"
                                >
                                  {indicator}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-2">
                              MITRE ATT&CK:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {result.mitreTactics.map((tactic, index) => (
                                <Badge
                                  key={index}
                                  className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs"
                                >
                                  {tactic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-matrix-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{result.timestamp}</span>
                              {result.assignedTo && (
                                <>
                                  <Users className="w-3 h-3 ml-2" />
                                  <span>分配给: {result.assignedTo}</span>
                                </>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                详情
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500/20 text-green-400 border-green-500/30"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                确认
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-500/20 text-red-400 border-red-500/30"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                误报
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    威胁猎捕行动管理
                  </CardTitle>
                  <Button className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Plus className="w-4 h-4 mr-2" />
                    新建行动
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-lg">
                                {campaign.name}
                              </h3>
                              <Badge
                                className={getSeverityColor(campaign.priority)}
                              >
                                {campaign.priority}
                              </Badge>
                              <Badge
                                className={getStatusColor(campaign.status)}
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {campaign.description}
                            </p>
                            <div className="bg-matrix-surface/30 p-3 rounded-lg mb-3">
                              <p className="text-xs text-muted-foreground mb-1">
                                ��设:
                              </p>
                              <p className="text-sm">{campaign.hypothesis}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              {campaign.progress}%
                            </div>
                            <Progress
                              value={campaign.progress}
                              className="w-24"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              开始日期
                            </p>
                            <p className="text-sm">{campaign.startDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              团队成员
                            </p>
                            <p className="text-sm">{campaign.team.length}人</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              发现/结果
                            </p>
                            <p className="text-sm">
                              {campaign.findings}/{campaign.results}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">
                              行动目标:
                            </p>
                            <div className="space-y-1">
                              {campaign.objectives.map((objective, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                  <span>{objective}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-matrix-border">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>使用规则: {campaign.rules.length}个</span>
                              <span>团队: {campaign.team.join(", ")}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                查看
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500/20 text-green-400 border-green-500/30"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                编辑
                              </Button>
                              <Button
                                size="sm"
                                className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                              >
                                <BarChart3 className="w-4 h-4 mr-1" />
                                报告
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai_models" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI模型管��中心
                </CardTitle>
                <CardDescription>
                  管理和监控用于威胁猎捕的AI模型性能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiModels.map((model) => (
                    <Card
                      key={model.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {model.name}
                          </CardTitle>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              准确率
                            </p>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={model.accuracy}
                                className="flex-1"
                              />
                              <span className="text-sm font-bold text-green-400">
                                {model.accuracy}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              版本
                            </p>
                            <p className="font-mono text-sm">{model.version}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              训练数据
                            </p>
                            <p className="text-sm">
                              {(model.dataPoints / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              最后训练
                            </p>
                            <p className="text-sm">{model.lastTrained}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                            {model.type}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            {model.status === "active" ? "重启" : "启动"}
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            配置
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-amber-500/20 text-amber-400 border-amber-500/30"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            重训练
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    威胁检测趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-6 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
                      <p className="text-lg font-medium text-white">
                        威胁检测趋势图
                      </p>
                      <p className="text-sm text-muted-foreground">
                        显示过去30天的威胁检测数量和趋势
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    威胁类型分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-6 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 text-purple-400 mx-auto mb-3" />
                      <p className="text-lg font-medium text-white">
                        威胁分类统计
                      </p>
                      <p className="text-sm text-muted-foreground">
                        按威胁类型和严重等级的分布情况
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  猎捕效率分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-matrix-surface/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      94.2%
                    </div>
                    <p className="text-sm text-muted-foreground">平均准确率</p>
                  </div>
                  <div className="text-center p-4 bg-matrix-surface/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      15min
                    </div>
                    <p className="text-sm text-muted-foreground">
                      平均响应时间
                    </p>
                  </div>
                  <div className="text-center p-4 bg-matrix-surface/30 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                      127
                    </div>
                    <p className="text-sm text-muted-foreground">本月检测数</p>
                  </div>
                  <div className="text-center p-4 bg-matrix-surface/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      8.3%
                    </div>
                    <p className="text-sm text-muted-foreground">误报率</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThreatHunting;
