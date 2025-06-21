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
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  Activity,
  Clock,
  Users,
  Server,
  Database,
  Network,
  Globe,
  Zap,
  Eye,
  Settings,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Layers,
  FileText,
  Search,
  Filter,
} from "lucide-react";

interface RiskAsset {
  id: string;
  name: string;
  type: "server" | "database" | "network" | "application" | "endpoint";
  category: string;
  criticality: "low" | "medium" | "high" | "critical";
  location: string;
  owner: string;
  vulnerabilities: number;
  threats: number;
  riskScore: number;
  lastAssessment: string;
  complianceStatus: "compliant" | "non_compliant" | "partial";
}

interface RiskFactor {
  id: string;
  name: string;
  category: string;
  probability: number;
  impact: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  description: string;
  affectedAssets: string[];
  mitigations: string[];
  residualRisk: number;
  owner: string;
  dueDate: string;
  status: "identified" | "analyzing" | "mitigating" | "monitored" | "closed";
}

interface RiskScenario {
  id: string;
  name: string;
  description: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  category: string;
  threatSources: string[];
  vulnerabilities: string[];
  businessImpact: string[];
  controls: string[];
  residualRisk: number;
  treatmentPlan: string;
}

interface ComplianceRequirement {
  id: string;
  framework: string;
  requirement: string;
  description: string;
  status: "met" | "partial" | "not_met" | "not_applicable";
  riskLevel: "low" | "medium" | "high" | "critical";
  evidence: string[];
  gaps: string[];
  remediation: string[];
  dueDate: string;
  responsible: string;
}

export default function RiskAssessment() {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "assets" | "factors" | "scenarios" | "compliance"
  >("dashboard");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [riskLevelFilter, setRiskLevelFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<RiskAsset | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  // 模拟风险资产数据
  const [riskAssets] = useState<RiskAsset[]>([
    {
      id: "asset-001",
      name: "核心数据库服务器",
      type: "database",
      category: "数据存储",
      criticality: "critical",
      location: "数据中心A",
      owner: "数据库管理员",
      vulnerabilities: 3,
      threats: 8,
      riskScore: 89,
      lastAssessment: "2024-01-18",
      complianceStatus: "partial",
    },
    {
      id: "asset-002",
      name: "Web应用集群",
      type: "application",
      category: "Web服务",
      criticality: "high",
      location: "云平台",
      owner: "应用开发团队",
      vulnerabilities: 5,
      threats: 12,
      riskScore: 76,
      lastAssessment: "2024-01-17",
      complianceStatus: "compliant",
    },
    {
      id: "asset-003",
      name: "内网核心交换机",
      type: "network",
      category: "网络设备",
      criticality: "high",
      location: "数据中心B",
      owner: "网络管理员",
      vulnerabilities: 2,
      threats: 6,
      riskScore: 72,
      lastAssessment: "2024-01-16",
      complianceStatus: "compliant",
    },
    {
      id: "asset-004",
      name: "员工终端设备",
      type: "endpoint",
      category: "办公设备",
      criticality: "medium",
      location: "办公区域",
      owner: "IT支持团队",
      vulnerabilities: 8,
      threats: 15,
      riskScore: 65,
      lastAssessment: "2024-01-15",
      complianceStatus: "non_compliant",
    },
    {
      id: "asset-005",
      name: "文件共享服务器",
      type: "server",
      category: "文件存储",
      criticality: "medium",
      location: "数据中心A",
      owner: "系统管理员",
      vulnerabilities: 4,
      threats: 7,
      riskScore: 58,
      lastAssessment: "2024-01-14",
      complianceStatus: "partial",
    },
  ]);

  // 模拟风险因子数据
  const [riskFactors] = useState<RiskFactor[]>([
    {
      id: "factor-001",
      name: "未修补的高危漏洞",
      category: "技术风险",
      probability: 85,
      impact: 90,
      riskLevel: "critical",
      description: "系统存在未修补的高危安全漏洞，可能被攻击者利用",
      affectedAssets: ["核心数据库服务器", "Web应用集群"],
      mitigations: ["紧急补丁管理", "漏洞扫描", "访问控制"],
      residualRisk: 45,
      owner: "安全团队",
      dueDate: "2024-02-15",
      status: "mitigating",
    },
    {
      id: "factor-002",
      name: "员工安全意识不足",
      category: "人员风险",
      probability: 70,
      impact: 75,
      riskLevel: "high",
      description: "员工缺乏安全意识，容易成为社工攻击的目标",
      affectedAssets: ["员工终端设备", "Web应用集群"],
      mitigations: ["安全培训", "钓鱼测试", "行为监控"],
      residualRisk: 35,
      owner: "人事部门",
      dueDate: "2024-03-01",
      status: "analyzing",
    },
    {
      id: "factor-003",
      name: "供应链安全风险",
      category: "外部风险",
      probability: 60,
      impact: 80,
      riskLevel: "high",
      description: "第三方供应商可能引入安全风险",
      affectedAssets: ["Web应用集群", "文件共享服务器"],
      mitigations: ["供应商评估", "合同条款", "监控审计"],
      residualRisk: 40,
      owner: "采购部门",
      dueDate: "2024-04-01",
      status: "identified",
    },
    {
      id: "factor-004",
      name: "数据泄露风险",
      category: "数据风险",
      probability: 45,
      impact: 95,
      riskLevel: "high",
      description: "敏感数据可能面临泄露风险",
      affectedAssets: ["核心数据库服务器", "文件共享服务器"],
      mitigations: ["数据加密", "访问控制", "DLP系统"],
      residualRisk: 25,
      owner: "数据保护官",
      dueDate: "2024-02-28",
      status: "monitored",
    },
  ]);

  // 模拟风险场景数据
  const [riskScenarios] = useState<RiskScenario[]>([
    {
      id: "scenario-001",
      name: "高级持续威胁攻击",
      description: "APT组织针对核心业务系统的长期潜伏攻击",
      likelihood: 75,
      impact: 95,
      riskScore: 88,
      category: "网络安全",
      threatSources: ["APT组织", "国家级黑客"],
      vulnerabilities: ["未修补漏洞", "弱口令", "社工攻击"],
      businessImpact: ["业务中断", "数据泄露", "声誉损失", "财务损失"],
      controls: ["入侵检测", "端点防护", "网络分段", "威胁情报"],
      residualRisk: 45,
      treatmentPlan: "加强监控和检测能力，定期进行渗透测试",
    },
    {
      id: "scenario-002",
      name: "勒索软件攻击",
      description: "勒索软件感染关键业务系统导致业务中断",
      likelihood: 80,
      impact: 85,
      riskScore: 85,
      category: "恶意软件",
      threatSources: ["网络犯罪集团", "勒索软件即服务"],
      vulnerabilities: ["邮件安全", "端点防护", "网络隔离"],
      businessImpact: ["系统加密", "业务停摆", "赎金损失", "恢复成本"],
      controls: ["邮件过滤", "终端防护", "备份系统", "应急响应"],
      residualRisk: 40,
      treatmentPlan: "完善备份策略，加强员工培训和邮件安全",
    },
    {
      id: "scenario-003",
      name: "内部威胁事件",
      description: "内部人员恶意或无意造成的安全事件",
      likelihood: 65,
      impact: 70,
      riskScore: 70,
      category: "内部威胁",
      threatSources: ["恶意内部人员", "无意泄露"],
      vulnerabilities: ["权限管理", "行为监控", "数据保护"],
      businessImpact: ["数据泄露", "系统破坏", "合规违规", "信任损失"],
      controls: ["权限管理", "行为分析", "数据防泄露", "审计日志"],
      residualRisk: 35,
      treatmentPlan: "加强权限管理和行为监控，定期进行内审",
    },
  ]);

  // 模拟合规要求数据
  const [complianceRequirements] = useState<ComplianceRequirement[]>([
    {
      id: "comp-001",
      framework: "ISO 27001",
      requirement: "A.12.1.2 变更管理",
      description: "建立正式的变更管理程序",
      status: "partial",
      riskLevel: "medium",
      evidence: ["变更管理流程文档", "变更记录"],
      gaps: ["缺少风险评估环节", "审批流程不完整"],
      remediation: ["完善风险评估", "建立审批机制"],
      dueDate: "2024-03-15",
      responsible: "IT运维团队",
    },
    {
      id: "comp-002",
      framework: "GDPR",
      requirement: "Art.32 处理安全性",
      description: "采取适当的技术和组织措施确保处理安全",
      status: "met",
      riskLevel: "low",
      evidence: ["加密策略", "访问控制", "安全培训记录"],
      gaps: [],
      remediation: [],
      dueDate: "2024-04-10",
      responsible: "数据保���官",
    },
    {
      id: "comp-003",
      framework: "SOX",
      requirement: "SOX.302 财务报告内控",
      description: "建立和维护财务报告内部控制",
      status: "not_met",
      riskLevel: "high",
      evidence: [],
      gaps: ["缺少内控制度", "审计跟踪不完整"],
      remediation: ["建立内控框架", "完善审计日志"],
      dueDate: "2024-02-28",
      responsible: "财务部门",
    },
  ]);

  const handleStartAssessment = async () => {
    setIsAssessing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAssessing(false);
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "met":
      case "closed":
      case "monitored":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "partial":
      case "analyzing":
      case "mitigating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "non_compliant":
      case "not_met":
      case "identified":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "not_applicable":
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "server":
        return Server;
      case "database":
        return Database;
      case "network":
        return Network;
      case "application":
        return Globe;
      case "endpoint":
        return Users;
      default:
        return Server;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const filteredAssets = riskAssets.filter((asset) => {
    const matchesSearch = asset.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      assetTypeFilter === "all" || asset.type === assetTypeFilter;
    const matchesRisk =
      riskLevelFilter === "all" || asset.criticality === riskLevelFilter;
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-neon-blue" />
              风险评估管理
            </h1>
            <p className="text-muted-foreground mt-2">
              全面的业务风险评估和管理平台
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleStartAssessment}
              disabled={isAssessing}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              {isAssessing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Target className="w-4 h-4 mr-2" />
              )}
              {isAssessing ? "评估中..." : "开始评估"}
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">高风险资产</p>
                  <p className="text-2xl font-bold text-red-400">
                    {
                      riskAssets.filter(
                        (a) =>
                          a.criticality === "critical" ||
                          a.criticality === "high",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-red-400 mt-1">需重点关注</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">风险因子</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {riskFactors.length}
                  </p>
                  <p className="text-xs text-amber-400 mt-1">
                    {
                      riskFactors.filter((f) => f.status === "mitigating")
                        .length
                    }{" "}
                    处理中
                  </p>
                </div>
                <Target className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均风险分</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.round(
                      riskAssets.reduce((sum, a) => sum + a.riskScore, 0) /
                        riskAssets.length,
                    )}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">全资产平均</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合规达成率</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round(
                      (complianceRequirements.filter((c) => c.status === "met")
                        .length /
                        complianceRequirements.length) *
                        100,
                    )}
                    %
                  </p>
                  <p className="text-xs text-green-400 mt-1">整体合规</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内���区域 */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 bg-matrix-surface/50">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-neon-blue/20"
            >
              风险概览
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className="data-[state=active]:bg-neon-blue/20"
            >
              资产风险
            </TabsTrigger>
            <TabsTrigger
              value="factors"
              className="data-[state=active]:bg-neon-blue/20"
            >
              风险因子
            </TabsTrigger>
            <TabsTrigger
              value="scenarios"
              className="data-[state=active]:bg-neon-blue/20"
            >
              风险场景
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="data-[state=active]:bg-neon-blue/20"
            >
              合规评估
            </TabsTrigger>
          </TabsList>

          {/* 风险概览 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 风险热图 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-neon-blue" />
                    风险热图矩阵
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Target className="w-12 h-12 text-neon-blue mx-auto mb-3" />
                      <p className="text-lg font-medium text-white">
                        风险矩阵图
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        可能性 vs 影响度分布
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 风险趋势 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    风险趋势分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        period: "本月",
                        change: -5.2,
                        riskScore: 67,
                        trend: "down",
                      },
                      {
                        period: "本季度",
                        change: -8.7,
                        riskScore: 65,
                        trend: "down",
                      },
                      {
                        period: "本年度",
                        change: +12.3,
                        riskScore: 72,
                        trend: "up",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.trend === "up" ? (
                            <ArrowUp className="w-4 h-4 text-red-400" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-green-400" />
                          )}
                          <span className="font-medium">{item.period}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-400">
                            {item.riskScore}
                          </span>
                          <span
                            className={`text-sm ${
                              item.trend === "up"
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {item.change > 0 ? "+" : ""}
                            {item.change}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 风险分布和top风险 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    风险分布统计
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["critical", "high", "medium", "low"].map((level) => {
                    const count = riskAssets.filter(
                      (a) => a.criticality === level,
                    ).length;
                    const percentage = (count / riskAssets.length) * 100;
                    return (
                      <div key={level} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize text-sm">{level}</span>
                          <span className="text-sm">{count} 资产</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{percentage.toFixed(1)}%</span>
                          <Badge className={getCriticalityColor(level)}>
                            {level}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    高风险项目
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskAssets
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .slice(0, 4)
                    .map((asset) => {
                      const AssetIcon = getAssetIcon(asset.type);
                      return (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <AssetIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">
                                {asset.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {asset.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${getRiskScoreColor(asset.riskScore)}`}
                            >
                              {asset.riskScore}
                            </p>
                            <Badge
                              className={getCriticalityColor(asset.criticality)}
                            >
                              {asset.criticality}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 资产风险 */}
          <TabsContent value="assets" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="w-5 h-5 text-neon-blue" />
                    资产风险评估
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索资产..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select
                      value={assetTypeFilter}
                      onValueChange={setAssetTypeFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="server">服务器</SelectItem>
                        <SelectItem value="database">数据库</SelectItem>
                        <SelectItem value="network">网络设备</SelectItem>
                        <SelectItem value="application">应用系统</SelectItem>
                        <SelectItem value="endpoint">终端设备</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={riskLevelFilter}
                      onValueChange={setRiskLevelFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="风险级别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有级别</SelectItem>
                        <SelectItem value="critical">严重</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAssets.map((asset) => {
                    const AssetIcon = getAssetIcon(asset.type);
                    return (
                      <Card
                        key={asset.id}
                        className="cyber-card-enhanced border-matrix-border"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <AssetIcon className="w-5 h-5 text-neon-blue" />
                              {asset.name}
                            </CardTitle>
                            <Badge
                              className={getCriticalityColor(asset.criticality)}
                            >
                              {asset.criticality}
                            </Badge>
                          </div>
                          <CardDescription>{asset.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                风险评分
                              </p>
                              <p
                                className={`text-2xl font-bold ${getRiskScoreColor(asset.riskScore)}`}
                              >
                                {asset.riskScore}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                合规状态
                              </p>
                              <Badge
                                className={getStatusColor(
                                  asset.complianceStatus,
                                )}
                              >
                                {asset.complianceStatus}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                漏洞数量
                              </p>
                              <p className="text-lg font-bold text-red-400">
                                {asset.vulnerabilities}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                威胁数量
                              </p>
                              <p className="text-lg font-bold text-amber-400">
                                {asset.threats}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                位置
                              </p>
                              <p className="text-sm">{asset.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                负责人
                              </p>
                              <p className="text-sm">{asset.owner}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>风险��度</span>
                              <span>{asset.riskScore}/100</span>
                            </div>
                            <Progress value={asset.riskScore} className="h-2" />
                          </div>

                          <div className="text-xs text-muted-foreground">
                            最后评估: {asset.lastAssessment}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                              onClick={() => setSelectedAsset(asset)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              详情
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              重评估
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 风险因子 */}
          <TabsContent value="factors" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  风险因子管理
                </CardTitle>
                <CardDescription>
                  识别、分析和管理组织面临的各类风险因子
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskFactors.map((factor) => (
                    <Card
                      key={factor.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <AlertTriangle className="w-5 h-5 text-amber-400" />
                              <h3 className="font-medium text-white">
                                {factor.name}
                              </h3>
                              <Badge
                                className={getCriticalityColor(
                                  factor.riskLevel,
                                )}
                              >
                                {factor.riskLevel}
                              </Badge>
                              <Badge className={getStatusColor(factor.status)}>
                                {factor.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {factor.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  发生概率
                                </p>
                                <p className="text-lg font-bold text-yellow-400">
                                  {factor.probability}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  影响程度
                                </p>
                                <p className="text-lg font-bold text-red-400">
                                  {factor.impact}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  剩余风险
                                </p>
                                <p className="text-lg font-bold text-green-400">
                                  {factor.residualRisk}%
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  受影响资产
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {factor.affectedAssets.map((asset, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs"
                                    >
                                      {asset}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  缓解措施
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {factor.mitigations.map(
                                    (mitigation, index) => (
                                      <Badge
                                        key={index}
                                        className="bg-green-500/20 text-green-400 border-green-500/40 text-xs"
                                      >
                                        {mitigation}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span>负责人: {factor.owner}</span>
                              <span>截止日期: {factor.dueDate}</span>
                              <span>类别: {factor.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 风险场景 */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  风险场景分析
                </CardTitle>
                <CardDescription>
                  基于威胁情报的风险场景建模和影响评估
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {riskScenarios.map((scenario) => (
                    <Card
                      key={scenario.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            {scenario.name}
                          </CardTitle>
                          <div className="text-right">
                            <p
                              className={`text-2xl font-bold ${getRiskScoreColor(scenario.riskScore)}`}
                            >
                              {scenario.riskScore}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              风险评分
                            </p>
                          </div>
                        </div>
                        <CardDescription>
                          {scenario.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-lg font-bold text-yellow-400">
                              {scenario.likelihood}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              发生概率
                            </p>
                          </div>
                          <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-lg font-bold text-red-400">
                              {scenario.impact}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              影响程度
                            </p>
                          </div>
                          <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-lg font-bold text-green-400">
                              {scenario.residualRisk}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              剩余风险
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              威胁来源
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scenario.threatSources.map((source, index) => (
                                <Badge
                                  key={index}
                                  className="bg-red-500/20 text-red-400 border-red-500/40 text-xs"
                                >
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              主要漏洞
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scenario.vulnerabilities.map((vuln, index) => (
                                <Badge
                                  key={index}
                                  className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-xs"
                                >
                                  {vuln}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              业务影响
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scenario.businessImpact.map((impact, index) => (
                                <Badge
                                  key={index}
                                  className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs"
                                >
                                  {impact}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              安全控制
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scenario.controls.map((control, index) => (
                                <Badge
                                  key={index}
                                  className="bg-green-500/20 text-green-400 border-green-500/40 text-xs"
                                >
                                  {control}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-matrix-surface/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            处理计划
                          </p>
                          <p className="text-sm">{scenario.treatmentPlan}</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            详细分析
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            场景演练
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            制定响应
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 合规评估 */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  合规性评估
                </CardTitle>
                <CardDescription>
                  多框架合规性要求的风险评估和差距分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceRequirements.map((req) => (
                    <Card
                      key={req.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-green-400" />
                              <h3 className="font-medium text-white">
                                {req.requirement}
                              </h3>
                              <Badge className={getStatusColor(req.status)}>
                                {req.status}
                              </Badge>
                              <Badge
                                className={getCriticalityColor(req.riskLevel)}
                              >
                                {req.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {req.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  支撑证据
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {req.evidence.map((evidence, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-green-500/20 text-green-400 border-green-500/40 text-xs"
                                    >
                                      {evidence}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  合规差距
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {req.gaps.map((gap, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-red-500/20 text-red-400 border-red-500/40 text-xs"
                                    >
                                      {gap}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {req.remediation.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground mb-1">
                                  整改措施
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {req.remediation.map((action, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs"
                                    >
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span>框架: {req.framework}</span>
                              <span>负责人: {req.responsible}</span>
                              <span>截止日期: {req.dueDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
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
