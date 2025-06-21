import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  Shield,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  RefreshCw,
  Target,
  ArrowRight,
  Workflow,
  Bot,
  Bell,
  Lock,
  Unlock,
  Network,
  Server,
  Mail,
  MessageSquare,
} from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: string;
    conditions: string[];
    threshold: number;
  };
  actions: AutomationAction[];
  status: "active" | "inactive" | "testing";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  createdBy: string;
  createdDate: string;
  lastTriggered: string;
  triggerCount: number;
  successRate: number;
}

interface AutomationAction {
  id: string;
  type:
    | "isolate"
    | "block"
    | "notify"
    | "scan"
    | "quarantine"
    | "patch"
    | "backup";
  target: string;
  parameters: Record<string, any>;
  timeout: number;
  retries: number;
}

interface ResponsePlaybook {
  id: string;
  name: string;
  description: string;
  incidentType: string;
  severity: "low" | "medium" | "high" | "critical";
  steps: PlaybookStep[];
  status: "active" | "draft" | "archived";
  estimatedTime: number;
  successRate: number;
  lastUsed: string;
}

interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  type: "manual" | "automated";
  action: string;
  assignee?: string;
  timeLimit: number;
  dependencies: string[];
}

interface ExecutionLog {
  id: string;
  timestamp: string;
  ruleId: string;
  ruleName: string;
  trigger: string;
  actions: string[];
  status: "success" | "failed" | "partial" | "in_progress";
  duration: number;
  affectedAssets: string[];
  outcome: string;
}

export default function AutoResponse() {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "rules" | "playbooks" | "logs"
  >("dashboard");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // 模拟自动化规则数据
  const [automationRules] = useState<AutomationRule[]>([
    {
      id: "rule-001",
      name: "恶意IP自动阻断",
      description: "检测到恶意IP连接时自动进行网络阻断",
      trigger: {
        type: "threat_detection",
        conditions: ["malicious_ip", "multiple_failed_logins"],
        threshold: 5,
      },
      actions: [
        {
          id: "action-001",
          type: "block",
          target: "firewall",
          parameters: { duration: 3600, scope: "global" },
          timeout: 30,
          retries: 3,
        },
        {
          id: "action-002",
          type: "notify",
          target: "security_team",
          parameters: { channel: "email", urgency: "high" },
          timeout: 10,
          retries: 1,
        },
      ],
      status: "active",
      priority: "high",
      category: "网络安全",
      createdBy: "张三",
      createdDate: "2024-01-15",
      lastTriggered: "2024-01-20 14:30:25",
      triggerCount: 47,
      successRate: 95.7,
    },
    {
      id: "rule-002",
      name: "恶意软件自动隔离",
      description: "检测到恶意软件时自动隔离受感染主机",
      trigger: {
        type: "malware_detection",
        conditions: ["virus_signature", "behavioral_analysis"],
        threshold: 1,
      },
      actions: [
        {
          id: "action-003",
          type: "isolate",
          target: "endpoint",
          parameters: { networkIsolation: true, processTermination: true },
          timeout: 60,
          retries: 2,
        },
        {
          id: "action-004",
          type: "scan",
          target: "affected_system",
          parameters: { fullScan: true, updateSignatures: true },
          timeout: 1800,
          retries: 1,
        },
      ],
      status: "active",
      priority: "critical",
      category: "端点安全",
      createdBy: "李四",
      createdDate: "2024-01-12",
      lastTriggered: "2024-01-20 13:45:12",
      triggerCount: 23,
      successRate: 91.3,
    },
    {
      id: "rule-003",
      name: "异常数据访问响应",
      description: "检测到异常数据访问模式时自动响应",
      trigger: {
        type: "data_access_anomaly",
        conditions: ["unusual_volume", "off_hours_access"],
        threshold: 3,
      },
      actions: [
        {
          id: "action-005",
          type: "notify",
          target: "data_protection_officer",
          parameters: { channel: "sms", urgency: "medium" },
          timeout: 15,
          retries: 2,
        },
        {
          id: "action-006",
          type: "backup",
          target: "sensitive_data",
          parameters: { priority: "high", encryption: true },
          timeout: 3600,
          retries: 1,
        },
      ],
      status: "testing",
      priority: "medium",
      category: "数据保护",
      createdBy: "王五",
      createdDate: "2024-01-18",
      lastTriggered: "2024-01-20 12:15:30",
      triggerCount: 8,
      successRate: 87.5,
    },
  ]);

  // 模拟响应剧本数据
  const [responsePlaybooks] = useState<ResponsePlaybook[]>([
    {
      id: "playbook-001",
      name: "DDoS攻击响应剧本",
      description: "应对分布式拒绝服务攻击的标准处理流程",
      incidentType: "DDoS Attack",
      severity: "high",
      steps: [
        {
          id: "step-001",
          order: 1,
          title: "攻击确认",
          description: "确认DDoS攻击的类型和规模",
          type: "manual",
          action: "analyze_traffic",
          assignee: "网络安全分析师",
          timeLimit: 300,
          dependencies: [],
        },
        {
          id: "step-002",
          order: 2,
          title: "启动缓解措施",
          description: "激活DDoS防护和流量清洗",
          type: "automated",
          action: "enable_ddos_protection",
          timeLimit: 60,
          dependencies: ["step-001"],
        },
      ],
      status: "active",
      estimatedTime: 1800,
      successRate: 92.5,
      lastUsed: "2024-01-19",
    },
    {
      id: "playbook-002",
      name: "数据泄露响应剧本",
      description: "数据泄露事件的应急响应处理流程",
      incidentType: "Data Breach",
      severity: "critical",
      steps: [
        {
          id: "step-003",
          order: 1,
          title: "事件评估",
          description: "评估数据泄露的范围和影响",
          type: "manual",
          action: "assess_breach",
          assignee: "数据保护官",
          timeLimit: 600,
          dependencies: [],
        },
        {
          id: "step-004",
          order: 2,
          title: "隔离受影响系统",
          description: "立即隔离可能受影响的系统",
          type: "automated",
          action: "isolate_systems",
          timeLimit: 120,
          dependencies: ["step-003"],
        },
      ],
      status: "active",
      estimatedTime: 7200,
      successRate: 88.9,
      lastUsed: "2024-01-17",
    },
  ]);

  // 模拟执行日志数据
  const [executionLogs] = useState<ExecutionLog[]>([
    {
      id: "log-001",
      timestamp: "2024-01-20 14:30:25",
      ruleId: "rule-001",
      ruleName: "恶意IP自动阻断",
      trigger: "检测到来自 203.0.113.42 的恶意连接",
      actions: ["阻断IP地址", "发送告警通知"],
      status: "success",
      duration: 45,
      affectedAssets: ["防火墙", "入侵检测系统"],
      outcome: "恶意IP已成功阻断，威胁已消除",
    },
    {
      id: "log-002",
      timestamp: "2024-01-20 13:45:12",
      ruleId: "rule-002",
      ruleName: "恶意软件自动隔离",
      trigger: "在主机 192.168.1.100 检测到恶意软件",
      actions: ["隔离主机", "启动深度扫描"],
      status: "success",
      duration: 1920,
      affectedAssets: ["工作站-001", "网络隔离系统"],
      outcome: "主机已隔离，恶意软件已清除",
    },
    {
      id: "log-003",
      timestamp: "2024-01-20 12:15:30",
      ruleId: "rule-003",
      ruleName: "异常数据访问响应",
      trigger: "检测到用户异常数据访问行为",
      actions: ["发送告警", "数据备份"],
      status: "partial",
      duration: 3650,
      affectedAssets: ["数据库服务器", "备份系统"],
      outcome: "告警已发送，备份部分完成",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "testing":
      case "partial":
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "inactive":
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "draft":
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "isolate":
        return Lock;
      case "block":
        return Shield;
      case "notify":
        return Bell;
      case "scan":
        return Search;
      case "quarantine":
        return Lock;
      case "patch":
        return Settings;
      case "backup":
        return Download;
      default:
        return Activity;
    }
  };

  const filteredRules = automationRules.filter((rule) => {
    const matchesSearch = rule.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || rule.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || rule.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <Zap className="w-8 h-8 text-neon-blue" />
              智能自动响应
            </h1>
            <p className="text-muted-foreground mt-2">
              基于AI的自动化安全编排和响应系统
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreatingRule(true)}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建规则
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出配置
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃规则</p>
                  <p className="text-2xl font-bold text-green-400">
                    {
                      automationRules.filter((r) => r.status === "active")
                        .length
                    }
                  </p>
                  <p className="text-xs text-green-400 mt-1">运行中</p>
                </div>
                <Bot className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日执行</p>
                  <p className="text-2xl font-bold text-blue-400">156</p>
                  <p className="text-xs text-blue-400 mt-1">自动操作</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">成功率</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {Math.round(
                      automationRules.reduce(
                        (sum, r) => sum + r.successRate,
                        0,
                      ) / automationRules.length,
                    )}
                    %
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">平均值</p>
                </div>
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">响应时间</p>
                  <p className="text-2xl font-bold text-purple-400">2.3s</p>
                  <p className="text-xs text-purple-400 mt-1">平均值</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-matrix-surface/50">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-neon-blue/20"
            >
              响应概览
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="data-[state=active]:bg-neon-blue/20"
            >
              自动化规则
            </TabsTrigger>
            <TabsTrigger
              value="playbooks"
              className="data-[state=active]:bg-neon-blue/20"
            >
              响应剧本
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-neon-blue/20"
            >
              执行日志
            </TabsTrigger>
          </TabsList>

          {/* 响应概览 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 实时响应状态 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-blue" />
                    实时响应状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-green-400">成功响应</p>
                          <p className="text-sm text-muted-foreground">
                            自动处理完成
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">142</p>
                        <p className="text-xs text-green-400">91.0%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-yellow-400">处理中</p>
                          <p className="text-sm text-muted-foreground">
                            正在执行响应
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-400">8</p>
                        <p className="text-xs text-yellow-400">5.1%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium text-red-400">失败响应</p>
                          <p className="text-sm text-muted-foreground">
                            需要人工介入
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-400">6</p>
                        <p className="text-xs text-red-400">3.9%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 热门响应规则 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-green-400" />
                    热门响应规则
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {automationRules
                    .sort((a, b) => b.triggerCount - a.triggerCount)
                    .slice(0, 4)
                    .map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Bot className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{rule.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {rule.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-neon-blue">
                            {rule.triggerCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            次触发
                          </p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* 响应时间趋势 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  响应时间趋势
                </CardTitle>
                <CardDescription>
                  自动化响应的平均处理时间和效率分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-white">
                      响应时间图表
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      显示自动化响应的时间分布和趋势变化
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 自动化规�� */}
          <TabsContent value="rules" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-neon-blue" />
                    自动化规则管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索规则..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">停用</SelectItem>
                        <SelectItem value="testing">测试</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="类别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类别</SelectItem>
                        <SelectItem value="网络安全">网络安全</SelectItem>
                        <SelectItem value="端点安全">端点安全</SelectItem>
                        <SelectItem value="数据保护">数据保护</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRules.map((rule) => (
                    <Card
                      key={rule.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Bot className="w-5 h-5 text-neon-blue" />
                              <h3 className="font-medium text-white">
                                {rule.name}
                              </h3>
                              <Badge className={getStatusColor(rule.status)}>
                                {rule.status}
                              </Badge>
                              <Badge
                                className={getPriorityColor(rule.priority)}
                              >
                                {rule.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {rule.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  触发条件
                                </p>
                                <p className="text-sm">{rule.trigger.type}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  触发次数
                                </p>
                                <p className="text-sm font-bold text-neon-blue">
                                  {rule.triggerCount}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  成功率
                                </p>
                                <p className="text-sm font-bold text-green-400">
                                  {rule.successRate}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  最后触发
                                </p>
                                <p className="text-sm">{rule.lastTriggered}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs text-muted-foreground">
                                响应动作:
                              </span>
                              {rule.actions.map((action) => {
                                const ActionIcon = getActionIcon(action.type);
                                return (
                                  <div
                                    key={action.id}
                                    className="flex items-center gap-1 px-2 py-1 bg-matrix-surface/50 rounded text-xs"
                                  >
                                    <ActionIcon className="w-3 h-3" />
                                    <span>{action.type}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                              <span>类别: {rule.category}</span>
                              <span>创建者: {rule.createdBy}</span>
                              <span>创建时间: {rule.createdDate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Switch
                              checked={rule.status === "active"}
                              onCheckedChange={(checked) => {
                                // 处理启用/禁用逻辑
                                console.log(
                                  `${checked ? "启用" : "禁用"} 规则:`,
                                  rule.name,
                                );
                              }}
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                                onClick={() => setSelectedRule(rule)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500/20 text-green-400 border-green-500/30"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-500/20 text-red-400 border-red-500/30"
                              >
                                <Trash2 className="w-4 h-4" />
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

          {/* 响应剧本 */}
          <TabsContent value="playbooks" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-neon-blue" />
                  响应剧本管理
                </CardTitle>
                <CardDescription>
                  预定义的安全事件响应流程和操作指南
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {responsePlaybooks.map((playbook) => (
                    <Card
                      key={playbook.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Workflow className="w-5 h-5 text-neon-blue" />
                            {playbook.name}
                          </CardTitle>
                          <Badge className={getStatusColor(playbook.status)}>
                            {playbook.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {playbook.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              事件类型
                            </p>
                            <p className="font-medium">
                              {playbook.incidentType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              严重程度
                            </p>
                            <Badge
                              className={getPriorityColor(playbook.severity)}
                            >
                              {playbook.severity}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              步骤数量
                            </p>
                            <p className="font-medium">
                              {playbook.steps.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              预计时间
                            </p>
                            <p className="font-medium">
                              {Math.round(playbook.estimatedTime / 60)} 分钟
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>成功率</span>
                            <span>{playbook.successRate}%</span>
                          </div>
                          <div className="w-full bg-matrix-surface rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                              style={{ width: `${playbook.successRate}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          最后使用: {playbook.lastUsed}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            查看步骤
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            执行剧本
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 执行日志 */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-neon-blue" />
                  自动化执行日志
                </CardTitle>
                <CardDescription>
                  自动化规则的执行历史和结果记录
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-neon-blue" />
                            <span className="font-medium">{log.ruleName}</span>
                            <Badge className={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            触发原因: {log.trigger}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                执行动作
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {log.actions.map((action, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs"
                                  >
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                受影响资产
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {log.affectedAssets.map((asset, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs"
                                  >
                                    {asset}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{log.outcome}</p>
                          <div className="flex items-center gap-6 mt-2 text-xs text-muted-foreground">
                            <span>执行时间: {log.duration}秒</span>
                            <span>时间戳: {log.timestamp}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
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
}
