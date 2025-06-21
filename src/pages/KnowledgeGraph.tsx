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
import {
  Layers,
  Network,
  GitBranch,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Link,
  Share2,
  Target,
  Users,
  Server,
  Shield,
  AlertTriangle,
  Settings,
  Database,
  Globe,
  Brain,
  Zap,
  Activity,
  Lock,
  Unlock,
  FileText,
  Tag,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type:
    | "asset"
    | "threat"
    | "vulnerability"
    | "attacker"
    | "technique"
    | "indicator"
    | "mitigation";
  category: string;
  properties: Record<string, any>;
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number;
  lastUpdated: string;
  connections: number;
}

interface GraphRelation {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
  description: string;
  evidence: string[];
  confidence: number;
  createdDate: string;
}

interface ThreatIntelligence {
  id: string;
  name: string;
  type: "apt" | "malware" | "campaign" | "technique";
  description: string;
  aliases: string[];
  techniques: string[];
  indicators: string[];
  targets: string[];
  attribution: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  firstSeen: string;
  lastSeen: string;
}

interface AttackPath {
  id: string;
  name: string;
  description: string;
  steps: AttackStep[];
  totalRisk: number;
  likelihood: number;
  impact: number;
  mitigations: string[];
  affectedAssets: string[];
}

interface AttackStep {
  id: string;
  order: number;
  technique: string;
  description: string;
  prerequisites: string[];
  indicators: string[];
  difficulty: "low" | "medium" | "high";
  detectability: "low" | "medium" | "high";
}

export default function KnowledgeGraph() {
  const [selectedTab, setSelectedTab] = useState<
    "graph" | "entities" | "relations" | "intelligence" | "paths"
  >("graph");
  const [nodeTypeFilter, setNodeTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟图谱节点数据
  const [graphNodes] = useState<GraphNode[]>([
    {
      id: "node-001",
      label: "Web服务器集群",
      type: "asset",
      category: "基础设施",
      properties: {
        ip: "192.168.1.100-120",
        os: "Ubuntu 20.04",
        services: ["nginx", "mysql", "redis"],
        location: "数据中心A",
      },
      riskLevel: "medium",
      confidence: 95,
      lastUpdated: "2024-01-20",
      connections: 12,
    },
    {
      id: "node-002",
      label: "APT28",
      type: "attacker",
      category: "高级持续威胁",
      properties: {
        aliases: ["Fancy Bear", "Sofacy"],
        origin: "俄罗斯",
        active_since: "2007",
        targets: ["政府", "军事", "媒体"],
      },
      riskLevel: "critical",
      confidence: 90,
      lastUpdated: "2024-01-19",
      connections: 28,
    },
    {
      id: "node-003",
      label: "SQL注入",
      type: "vulnerability",
      category: "Web应用漏洞",
      properties: {
        cve: "CVE-2024-1234",
        cvss: 7.5,
        description: "数据库查询未正确过滤用户输入",
        affected_systems: ["Web应用", "API接口"],
      },
      riskLevel: "high",
      confidence: 88,
      lastUpdated: "2024-01-18",
      connections: 15,
    },
    {
      id: "node-004",
      label: "鱼叉式钓鱼",
      type: "technique",
      category: "社会工程",
      properties: {
        mitre_id: "T1566.001",
        description: "针对特定目标的定制化钓鱼攻击",
        success_rate: "35%",
        common_vectors: ["邮件", "社交媒体"],
      },
      riskLevel: "high",
      confidence: 92,
      lastUpdated: "2024-01-17",
      connections: 22,
    },
    {
      id: "node-005",
      label: "恶意域名",
      type: "indicator",
      category: "网络指标",
      properties: {
        domain: "malicious-example.com",
        ip: "203.0.113.42",
        first_seen: "2024-01-10",
        threat_type: "C&C服务器",
      },
      riskLevel: "critical",
      confidence: 97,
      lastUpdated: "2024-01-16",
      connections: 8,
    },
    {
      id: "node-006",
      label: "多因素认证",
      type: "mitigation",
      category: "访问控制",
      properties: {
        implementation: "TOTP + SMS",
        coverage: "85%",
        effectiveness: "高",
        cost: "中等",
      },
      riskLevel: "low",
      confidence: 94,
      lastUpdated: "2024-01-15",
      connections: 18,
    },
  ]);

  // 模拟关系数据
  const [graphRelations] = useState<GraphRelation[]>([
    {
      id: "rel-001",
      source: "node-002",
      target: "node-004",
      type: "使用技术",
      weight: 0.85,
      description: "APT28组织经常使用鱼叉式钓鱼进行初始访问",
      evidence: ["威胁报告", "样本分析", "事件调查"],
      confidence: 90,
      createdDate: "2024-01-15",
    },
    {
      id: "rel-002",
      source: "node-004",
      target: "node-001",
      type: "攻击目标",
      weight: 0.72,
      description: "鱼叉式钓鱼可能导致Web服务器被入侵",
      evidence: ["攻击模拟", "日志分析"],
      confidence: 75,
      createdDate: "2024-01-14",
    },
    {
      id: "rel-003",
      source: "node-003",
      target: "node-001",
      type: "影响资产",
      weight: 0.95,
      description: "SQL注入漏洞直接影响Web服务器安全",
      evidence: ["漏洞扫描", "渗透测试"],
      confidence: 95,
      createdDate: "2024-01-13",
    },
    {
      id: "rel-004",
      source: "node-006",
      target: "node-004",
      type: "防护措施",
      weight: 0.88,
      description: "多因素认证可有效防范钓鱼攻击",
      evidence: ["安全评估", "最佳实践"],
      confidence: 88,
      createdDate: "2024-01-12",
    },
  ]);

  // 模拟威胁情报数据
  const [threatIntelligence] = useState<ThreatIntelligence[]>([
    {
      id: "intel-001",
      name: "APT28",
      type: "apt",
      description: "俄罗斯政府支持的高级持续威胁组织",
      aliases: ["Fancy Bear", "Sofacy", "Pawn Storm"],
      techniques: ["T1566.001", "T1078", "T1055", "T1083"],
      indicators: [
        "malicious-example.com",
        "203.0.113.42",
        "evil.exe",
        "backdoor.dll",
      ],
      targets: ["政府机构", "军事组织", "媒体公司", "智库"],
      attribution: "俄罗斯GRU",
      confidence: 90,
      severity: "critical",
      firstSeen: "2007-01-01",
      lastSeen: "2024-01-19",
    },
    {
      id: "intel-002",
      name: "Emotet",
      type: "malware",
      description: "模块化银行木马和恶意软件投递平台",
      aliases: ["Geodo", "Mealybug"],
      techniques: ["T1566.001", "T1204.002", "T1055"],
      indicators: ["emotet.exe", "192.168.100.5", "bad-domain.net"],
      targets: ["金融机构", "企业网络", "个人用户"],
      attribution: "网络犯罪集团",
      confidence: 95,
      severity: "high",
      firstSeen: "2014-06-01",
      lastSeen: "2024-01-18",
    },
    {
      id: "intel-003",
      name: "Operation Ghost",
      type: "campaign",
      description: "针对能源行业的大规模网络间谍活动",
      aliases: ["Energy Hunter", "Power Grid Campaign"],
      techniques: ["T1190", "T1078", "T1021.001"],
      indicators: ["energy-attack.com", "10.0.0.100", "ghost.bat"],
      targets: ["能源公司", "电力网络", "石油天然气"],
      attribution: "未知APT组织",
      confidence: 75,
      severity: "high",
      firstSeen: "2023-11-01",
      lastSeen: "2024-01-15",
    },
  ]);

  // 模拟攻击路径数据
  const [attackPaths] = useState<AttackPath[]>([
    {
      id: "path-001",
      name: "Web应用入侵路径",
      description: "通过Web应用漏洞获取系统访问权限的攻击链",
      steps: [
        {
          id: "step-001",
          order: 1,
          technique: "侦察",
          description: "收集目标系统信息",
          prerequisites: [],
          indicators: ["端口扫描", "服务枚举"],
          difficulty: "low",
          detectability: "medium",
        },
        {
          id: "step-002",
          order: 2,
          technique: "SQL注入",
          description: "利用Web应用SQL注入漏洞",
          prerequisites: ["Web应用存在注入点"],
          indicators: ["异常SQL查询", "数据库错误"],
          difficulty: "medium",
          detectability: "high",
        },
        {
          id: "step-003",
          order: 3,
          technique: "权限提升",
          description: "获取系统管理员权限",
          prerequisites: ["初始访问权限"],
          indicators: ["系统命令执行", "权限变更"],
          difficulty: "high",
          detectability: "high",
        },
      ],
      totalRisk: 85,
      likelihood: 70,
      impact: 90,
      mitigations: ["输入验证", "最小权限原则", "实时监控", "定期安全评估"],
      affectedAssets: ["Web服务器", "数据库服务��", "用户数据"],
    },
    {
      id: "path-002",
      name: "钓鱼邮件攻击链",
      description: "通过钓鱼邮件进行的多阶段攻击",
      steps: [
        {
          id: "step-004",
          order: 1,
          technique: "鱼叉式钓鱼",
          description: "发送定制化钓鱼邮件",
          prerequisites: ["目标信息收集"],
          indicators: ["可疑邮件", "异常链接"],
          difficulty: "low",
          detectability: "medium",
        },
        {
          id: "step-005",
          order: 2,
          technique: "恶意软件投递",
          description: "通过邮件附件投递恶意软件",
          prerequisites: ["用户点击邮件"],
          indicators: ["文件下载", "进程启动"],
          difficulty: "medium",
          detectability: "high",
        },
        {
          id: "step-006",
          order: 3,
          technique: "横向移动",
          description: "在网络内部横向移动",
          prerequisites: ["初始立足点"],
          indicators: ["网络扫描", "凭据窃取"],
          difficulty: "high",
          detectability: "medium",
        },
      ],
      totalRisk: 78,
      likelihood: 80,
      impact: 75,
      mitigations: ["邮件过滤", "用户培训", "端点防护", "网络分段"],
      affectedAssets: ["邮件系统", "用户工作站", "内网服务器"],
    },
  ]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "asset":
        return Server;
      case "threat":
        return AlertTriangle;
      case "vulnerability":
        return Shield;
      case "attacker":
        return Users;
      case "technique":
        return Target;
      case "indicator":
        return Eye;
      case "mitigation":
        return Lock;
      default:
        return Database;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/40";
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredNodes = graphNodes.filter((node) => {
    const matchesSearch = node.label
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      nodeTypeFilter === "all" || node.type === nodeTypeFilter;
    const matchesCategory =
      categoryFilter === "all" || node.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <Layers className="w-8 h-8 text-neon-blue" />
              安全知识图谱
            </h1>
            <p className="text-muted-foreground mt-2">
              安全实体关联分析和威胁情报知识图谱
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? "分析中..." : "智能分析"}
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出图谱
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">图谱节点</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {graphNodes.length}
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">实体总数</p>
                </div>
                <Network className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">关联关系</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {graphRelations.length}
                  </p>
                  <p className="text-xs text-purple-400 mt-1">连接数量</p>
                </div>
                <GitBranch className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">威胁情报</p>
                  <p className="text-2xl font-bold text-red-400">
                    {threatIntelligence.length}
                  </p>
                  <p className="text-xs text-red-400 mt-1">情报条目</p>
                </div>
                <Shield className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">攻击路径</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {attackPaths.length}
                  </p>
                  <p className="text-xs text-amber-400 mt-1">风险路径</p>
                </div>
                <Target className="w-8 h-8 text-amber-400" />
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
          <TabsList className="grid w-full grid-cols-5 bg-matrix-surface/50">
            <TabsTrigger
              value="graph"
              className="data-[state=active]:bg-neon-blue/20"
            >
              知识图谱
            </TabsTrigger>
            <TabsTrigger
              value="entities"
              className="data-[state=active]:bg-neon-blue/20"
            >
              实体管理
            </TabsTrigger>
            <TabsTrigger
              value="relations"
              className="data-[state=active]:bg-neon-blue/20"
            >
              关系分析
            </TabsTrigger>
            <TabsTrigger
              value="intelligence"
              className="data-[state=active]:bg-neon-blue/20"
            >
              威胁情报
            </TabsTrigger>
            <TabsTrigger
              value="paths"
              className="data-[state=active]:bg-neon-blue/20"
            >
              攻击路径
            </TabsTrigger>
          </TabsList>

          {/* 知识图谱 */}
          <TabsContent value="graph" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 图谱控制面板 */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg">图谱控制</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        节点类型
                      </label>
                      <Select
                        value={nodeTypeFilter}
                        onValueChange={setNodeTypeFilter}
                      >
                        <SelectTrigger className="bg-matrix-surface/50 border-matrix-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有类型</SelectItem>
                          <SelectItem value="asset">资产</SelectItem>
                          <SelectItem value="threat">威胁</SelectItem>
                          <SelectItem value="vulnerability">漏洞</SelectItem>
                          <SelectItem value="attacker">攻��者</SelectItem>
                          <SelectItem value="technique">技术</SelectItem>
                          <SelectItem value="indicator">指标</SelectItem>
                          <SelectItem value="mitigation">缓解措施</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        风险级别
                      </label>
                      <div className="space-y-2">
                        {["critical", "high", "medium", "low"].map((level) => (
                          <div
                            key={level}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm capitalize">{level}</span>
                            <Badge className={getRiskColor(level)}>
                              {
                                graphNodes.filter((n) => n.riskLevel === level)
                                  .length
                              }
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        图谱操作
                      </label>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          自动布局
                        </Button>
                        <Button
                          size="sm"
                          className="w-full bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          聚焦视图
                        </Button>
                        <Button
                          size="sm"
                          className="w-full bg-purple-500/20 text-purple-400 border-purple-500/30"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          关系过滤
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 图例说明 */}
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg">图例说明</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { type: "asset", label: "资产", icon: Server },
                      { type: "threat", label: "威胁", icon: AlertTriangle },
                      { type: "vulnerability", label: "漏洞", icon: Shield },
                      { type: "attacker", label: "攻击者", icon: Users },
                      { type: "technique", label: "技术", icon: Target },
                      { type: "indicator", label: "指标", icon: Eye },
                      { type: "mitigation", label: "缓解", icon: Lock },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.type}
                          className="flex items-center gap-3"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* 主图谱显示区域 */}
              <div className="lg:col-span-3">
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Network className="w-5 h-5 text-neon-blue" />
                      安全知识图谱可视化
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-matrix-bg/50 rounded-lg border border-matrix-border p-6 flex items-center justify-center">
                      <div className="text-center">
                        <Network className="w-20 h-20 text-neon-blue mx-auto mb-4" />
                        <p className="text-xl font-medium text-white">
                          交互式知识图谱
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          显示安全实体之间��复杂关联关系
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          支持拖拽、缩放、搜索和关系探索
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 实体管理 */}
          <TabsContent value="entities" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-neon-blue" />
                    图谱实体管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索实体..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Button className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                      <Plus className="w-4 h-4 mr-2" />
                      添加实体
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNodes.map((node) => {
                    const NodeIcon = getNodeTypeIcon(node.type);
                    return (
                      <Card
                        key={node.id}
                        className="cyber-card-enhanced border-matrix-border"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <NodeIcon className="w-5 h-5 text-neon-blue" />
                                <h3 className="font-medium text-white">
                                  {node.label}
                                </h3>
                                <Badge className={getRiskColor(node.riskLevel)}>
                                  {node.riskLevel}
                                </Badge>
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                                  {node.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {node.category}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    置信度
                                  </p>
                                  <p className="text-sm font-bold text-green-400">
                                    {node.confidence}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    连接数
                                  </p>
                                  <p className="text-sm font-bold text-blue-400">
                                    {node.connections}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    最后更新
                                  </p>
                                  <p className="text-sm">{node.lastUpdated}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    实体ID
                                  </p>
                                  <p className="text-sm font-mono text-xs">
                                    {node.id}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  属性信息
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(node.properties)
                                    .slice(0, 4)
                                    .map(([key, value]) => (
                                      <Badge
                                        key={key}
                                        className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                                      >
                                        {key}: {String(value).substring(0, 20)}
                                        {String(value).length > 20 && "..."}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                                onClick={() => setSelectedNode(node)}
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
                                className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 关系分析 */}
          <TabsContent value="relations" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  实体关系分析
                </CardTitle>
                <CardDescription>
                  分析安全实体之间的关联关系和影响路径
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {graphRelations.map((relation) => (
                    <div
                      key={relation.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Link className="w-5 h-5 text-purple-400" />
                          <span className="font-medium">{relation.type}</span>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                            权重: {relation.weight.toFixed(2)}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                            置信度: {relation.confidence}%
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {relation.createdDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {relation.description}
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            源实体
                          </p>
                          <div className="p-2 bg-matrix-surface/50 rounded text-sm">
                            {
                              graphNodes.find((n) => n.id === relation.source)
                                ?.label
                            }
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-0.5 bg-purple-400 relative">
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rotate-45"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            目标实体
                          </p>
                          <div className="p-2 bg-matrix-surface/50 rounded text-sm">
                            {
                              graphNodes.find((n) => n.id === relation.target)
                                ?.label
                            }
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          支撑证据
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {relation.evidence.map((evidence, index) => (
                            <Badge
                              key={index}
                              className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs"
                            >
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 威胁情报 */}
          <TabsContent value="intelligence" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  威胁情报库
                </CardTitle>
                <CardDescription>
                  整合的威胁情报信息和攻击组织档案
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {threatIntelligence.map((intel) => (
                    <Card
                      key={intel.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-400" />
                            {intel.name}
                          </CardTitle>
                          <Badge className={getSeverityColor(intel.severity)}>
                            {intel.severity}
                          </Badge>
                        </div>
                        <CardDescription>{intel.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              类型
                            </p>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                              {intel.type}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              置信度
                            </p>
                            <p className="font-bold text-green-400">
                              {intel.confidence}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              首次发现
                            </p>
                            <p className="text-sm">{intel.firstSeen}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              最后活动
                            </p>
                            <p className="text-sm">{intel.lastSeen}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            别名
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {intel.aliases.map((alias, index) => (
                              <Badge
                                key={index}
                                className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs"
                              >
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            攻击技术
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {intel.techniques.slice(0, 4).map((tech, index) => (
                              <Badge
                                key={index}
                                className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {intel.techniques.length > 4 && (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/40 text-xs">
                                +{intel.techniques.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            威胁指标
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {intel.indicators.slice(0, 3).map((ioc, index) => (
                              <Badge
                                key={index}
                                className="bg-red-500/20 text-red-400 border-red-500/40 text-xs font-mono"
                              >
                                {ioc}
                              </Badge>
                            ))}
                            {intel.indicators.length > 3 && (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/40 text-xs">
                                +{intel.indicators.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          归属: {intel.attribution}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            详情
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            关联
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 攻击路径 */}
          <TabsContent value="paths" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  攻击路径分析
                </CardTitle>
                <CardDescription>
                  基于知识图谱的攻击链分析和风险路径识别
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {attackPaths.map((path) => (
                    <Card
                      key={path.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Target className="w-5 h-5 text-amber-400" />
                            {path.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                              风险: {path.totalRisk}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-lg font-bold text-yellow-400">
                              {path.likelihood}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              可能性
                            </p>
                          </div>
                          <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-lg font-bold text-red-400">
                              {path.impact}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              影响度
                            </p>
                          </div>
                          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-lg font-bold text-blue-400">
                              {path.steps.length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              攻击步骤
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-3">
                            攻击步骤
                          </p>
                          <div className="space-y-3">
                            {path.steps.map((step, index) => (
                              <div
                                key={step.id}
                                className="flex items-start gap-3 p-3 bg-matrix-surface/30 rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center text-xs font-bold">
                                  {step.order}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">
                                      {step.technique}
                                    </span>
                                    <Badge
                                      className={`text-xs ${
                                        step.difficulty === "low"
                                          ? "bg-red-500/20 text-red-400"
                                          : step.difficulty === "medium"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-green-500/20 text-green-400"
                                      }`}
                                    >
                                      {step.difficulty}
                                    </Badge>
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs">
                                      检测: {step.detectability}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              缓解措施
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {path.mitigations.map((mitigation, index) => (
                                <Badge
                                  key={index}
                                  className="bg-green-500/20 text-green-400 border-green-500/40 text-xs"
                                >
                                  {mitigation}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              受影响资产
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {path.affectedAssets.map((asset, index) => (
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

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            路径详情
                          </Button>
                          <Button
                            size="sm"
                            className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            模拟攻击
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            生成防护
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
