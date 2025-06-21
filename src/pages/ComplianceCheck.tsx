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
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Settings,
  Eye,
  Zap,
  Lock,
  Users,
  Database,
  Server,
  Globe,
  Award,
  BookOpen,
  Target,
  Layers,
  BarChart3,
} from "lucide-react";

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  standard: string;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  score: number;
  status: "compliant" | "non_compliant" | "partial" | "pending";
  lastAudit: string;
  nextAudit: string;
}

interface ComplianceControl {
  id: string;
  framework: string;
  controlId: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pass" | "fail" | "partial" | "not_tested";
  evidence: string[];
  remediation: string;
  responsible: string;
  dueDate: string;
  lastTest: string;
}

interface AuditFinding {
  id: string;
  framework: string;
  controlId: string;
  finding: string;
  severity: "low" | "medium" | "high" | "critical";
  impact: string;
  recommendation: string;
  assignee: string;
  status: "open" | "in_progress" | "resolved" | "accepted_risk";
  createdDate: string;
  dueDate: string;
}

export default function ComplianceCheck() {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "frameworks" | "controls" | "findings"
  >("overview");
  const [frameworkFilter, setFrameworkFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFramework, setSelectedFramework] =
    useState<ComplianceFramework | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // 模拟合规框架数据
  const [complianceFrameworks] = useState<ComplianceFramework[]>([
    {
      id: "iso27001",
      name: "ISO 27001",
      description: "信息安全管理体系国际标准",
      standard: "ISO/IEC 27001:2013",
      totalControls: 114,
      passedControls: 89,
      failedControls: 25,
      score: 78.1,
      status: "partial",
      lastAudit: "2024-01-15",
      nextAudit: "2024-07-15",
    },
    {
      id: "gdpr",
      name: "GDPR",
      description: "欧盟通用数据保护条例",
      standard: "EU 2016/679",
      totalControls: 47,
      passedControls: 42,
      failedControls: 5,
      score: 89.4,
      status: "compliant",
      lastAudit: "2024-01-10",
      nextAudit: "2024-04-10",
    },
    {
      id: "sox",
      name: "SOX",
      description: "萨班斯-奥克斯利法案",
      standard: "SOX 2002",
      totalControls: 28,
      passedControls: 20,
      failedControls: 8,
      score: 71.4,
      status: "non_compliant",
      lastAudit: "2024-01-08",
      nextAudit: "2024-04-08",
    },
    {
      id: "pci_dss",
      name: "PCI DSS",
      description: "支付卡行业数据安全标准",
      standard: "PCI DSS v4.0",
      totalControls: 375,
      passedControls: 298,
      failedControls: 77,
      score: 79.5,
      status: "partial",
      lastAudit: "2024-01-12",
      nextAudit: "2024-03-12",
    },
    {
      id: "cybersecurity_law",
      name: "网络安全法",
      description: "中华人民共和国网络安全法",
      standard: "中华人民共和国主席令第53号",
      totalControls: 56,
      passedControls: 48,
      failedControls: 8,
      score: 85.7,
      status: "compliant",
      lastAudit: "2024-01-18",
      nextAudit: "2024-06-18",
    },
  ]);

  // 模拟合规控制项数据
  const [complianceControls] = useState<ComplianceControl[]>([
    {
      id: "ctrl-001",
      framework: "ISO 27001",
      controlId: "A.8.1.1",
      title: "资产清单",
      description: "组织应识别并维护与信息和信息处理设施相关的资产清单",
      category: "资产管理",
      priority: "high",
      status: "pass",
      evidence: ["资产清单文档", "资产管理系统截图"],
      remediation: "无需整改",
      responsible: "信息安全部",
      dueDate: "2024-03-15",
      lastTest: "2024-01-15",
    },
    {
      id: "ctrl-002",
      framework: "ISO 27001",
      controlId: "A.9.1.1",
      title: "访问控制策略",
      description: "应建立、记录并审查访问控制策略",
      category: "访问控制",
      priority: "critical",
      status: "fail",
      evidence: [],
      remediation: "需要建立完整的访问控制策略文档",
      responsible: "技术部",
      dueDate: "2024-02-28",
      lastTest: "2024-01-15",
    },
    {
      id: "ctrl-003",
      framework: "GDPR",
      controlId: "Art.32",
      title: "处理安全性",
      description: "考虑到现有技术水平和实施成本，应采取适当的技术和组织措施",
      category: "数据保护",
      priority: "high",
      status: "pass",
      evidence: ["加密策略文档", "安全措施清单"],
      remediation: "无需整改",
      responsible: "数据保护官",
      dueDate: "2024-04-10",
      lastTest: "2024-01-10",
    },
    {
      id: "ctrl-004",
      framework: "SOX",
      controlId: "SOX.302",
      title: "内部控制报告",
      description: "管理层必须建立和维护财务报告内部控制",
      category: "财务报告",
      priority: "critical",
      status: "fail",
      evidence: [],
      remediation: "需要建立完整的内部控制制度",
      responsible: "财务部",
      dueDate: "2024-03-01",
      lastTest: "2024-01-08",
    },
    {
      id: "ctrl-005",
      framework: "PCI DSS",
      controlId: "Req.3.4",
      title: "加密传输",
      description: "在开放的公共网络上传输持卡人数据时必须加密",
      category: "数据保护",
      priority: "critical",
      status: "partial",
      evidence: ["TLS配置文档"],
      remediation: "需要加强端到端加密",
      responsible: "网络安全部",
      dueDate: "2024-02-12",
      lastTest: "2024-01-12",
    },
  ]);

  // 模拟审计发现数据
  const [auditFindings] = useState<AuditFinding[]>([
    {
      id: "finding-001",
      framework: "ISO 27001",
      controlId: "A.9.1.1",
      finding: "缺少正式的访问控制策略文档",
      severity: "high",
      impact: "可能导致未授权访问和数据泄露",
      recommendation: "制定并实施正式的访问控制策略",
      assignee: "张三",
      status: "in_progress",
      createdDate: "2024-01-15",
      dueDate: "2024-02-28",
    },
    {
      id: "finding-002",
      framework: "SOX",
      controlId: "SOX.302",
      finding: "内部控制制度不完善",
      severity: "critical",
      impact: "影响财务报告的准确性和合规性",
      recommendation: "建立完整的内部控制框架",
      assignee: "李四",
      status: "open",
      createdDate: "2024-01-08",
      dueDate: "2024-03-01",
    },
    {
      id: "finding-003",
      framework: "PCI DSS",
      controlId: "Req.3.4",
      finding: "部分数据传输未加密",
      severity: "high",
      impact: "敏感数据可能在传输过程中被截获",
      recommendation: "实施端到端加密机制",
      assignee: "王五",
      status: "in_progress",
      createdDate: "2024-01-12",
      dueDate: "2024-02-12",
    },
  ]);

  const handleScan = async () => {
    setIsScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsScanning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "pass":
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "partial":
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "non_compliant":
      case "fail":
      case "open":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "pending":
      case "not_tested":
      case "accepted_risk":
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

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const filteredControls = complianceControls.filter((control) => {
    const matchesSearch =
      control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.controlId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework =
      frameworkFilter === "all" || control.framework === frameworkFilter;
    const matchesStatus =
      statusFilter === "all" || control.status === statusFilter;
    return matchesSearch && matchesFramework && matchesStatus;
  });

  const filteredFindings = auditFindings.filter((finding) => {
    const matchesSearch =
      finding.finding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.controlId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework =
      frameworkFilter === "all" || finding.framework === frameworkFilter;
    return matchesSearch && matchesFramework;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-neon-blue" />
              合规性检查
            </h1>
            <p className="text-muted-foreground mt-2">
              多框架合规性评估，确保组织符合法规要求和行业标准
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`}
              />
              {isScanning ? "扫描中..." : "启动扫描"}
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合规框架</p>
                  <p className="text-2xl font-bold text-green-400">
                    {complianceFrameworks.length}
                  </p>
                  <p className="text-xs text-green-400 mt-1">已实施</p>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">控制项总数</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {complianceFrameworks.reduce(
                      (sum, f) => sum + f.totalControls,
                      0,
                    )}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">已测试</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合规率</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {Math.round(
                      complianceFrameworks.reduce(
                        (sum, f) => sum + f.score,
                        0,
                      ) / complianceFrameworks.length,
                    )}
                    %
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">平均值</p>
                </div>
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">待整改项</p>
                  <p className="text-2xl font-bold text-red-400">
                    {
                      auditFindings.filter(
                        (f) =>
                          f.status === "open" || f.status === "in_progress",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-red-400 mt-1">高优先级</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
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
              value="overview"
              className="data-[state=active]:bg-neon-blue/20"
            >
              概览
            </TabsTrigger>
            <TabsTrigger
              value="frameworks"
              className="data-[state=active]:bg-neon-blue/20"
            >
              框架管理
            </TabsTrigger>
            <TabsTrigger
              value="controls"
              className="data-[state=active]:bg-neon-blue/20"
            >
              控制项
            </TabsTrigger>
            <TabsTrigger
              value="findings"
              className="data-[state=active]:bg-neon-blue/20"
            >
              审计发现
            </TabsTrigger>
          </TabsList>

          {/* 概览 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 合规状态总览 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-neon-blue" />
                    合规状态总览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complianceFrameworks.map((framework) => (
                    <div
                      key={framework.id}
                      className="p-3 bg-matrix-surface/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{framework.name}</span>
                          <Badge className={getStatusColor(framework.status)}>
                            {framework.status}
                          </Badge>
                        </div>
                        <span
                          className={`font-bold text-lg ${getScoreColor(framework.score)}`}
                        >
                          {framework.score.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={framework.score} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          通过: {framework.passedControls}/
                          {framework.totalControls}
                        </span>
                        <span>下次审计: {framework.nextAudit}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 近期审计活动 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    近期审计活动
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {complianceFrameworks
                      .sort(
                        (a, b) =>
                          new Date(b.lastAudit).getTime() -
                          new Date(a.lastAudit).getTime(),
                      )
                      .slice(0, 5)
                      .map((framework) => (
                        <div
                          key={framework.id}
                          className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">
                                {framework.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                最后审计: {framework.lastAudit}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(framework.status)}>
                            {framework.status}
                          </Badge>
                        </div>
                      ))}
                  </div>

                  <Button className="w-full bg-green-500/20 text-green-400 border-green-500/30">
                    <Calendar className="w-4 h-4 mr-2" />
                    查看审计计划
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 风险热图 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  合规风险热图
                </CardTitle>
                <CardDescription>
                  各合规框架的风险分布和优先级排序
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <XCircle className="w-6 h-6 text-red-400" />
                      <h3 className="font-medium text-red-400">高风险区域</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>SOX 内部控制</span>
                        <span className="text-red-400">严重</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ISO 27001 访问控制</span>
                        <span className="text-red-400">高</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PCI DSS 数据加密</span>
                        <span className="text-orange-400">中</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      <h3 className="font-medium text-yellow-400">
                        中风险区域
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>GDPR 数据处理</span>
                        <span className="text-yellow-400">中</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>网络安全法</span>
                        <span className="text-yellow-400">中</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PCI DSS 网络安全</span>
                        <span className="text-yellow-400">中</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="font-medium text-green-400">低风险区域</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>GDPR 权利保护</span>
                        <span className="text-green-400">低</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ISO 27001 资产管理</span>
                        <span className="text-green-400">低</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>网络安全法备案</span>
                        <span className="text-green-400">低</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 框架管理 */}
          <TabsContent value="frameworks" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-neon-blue" />
                  合规框架管理
                </CardTitle>
                <CardDescription>管理组织适用的合规框架和标准</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {complianceFrameworks.map((framework) => (
                    <Card
                      key={framework.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Award className="w-5 h-5 text-neon-blue" />
                            {framework.name}
                          </CardTitle>
                          <Badge className={getStatusColor(framework.status)}>
                            {framework.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {framework.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              标准版本
                            </p>
                            <p className="font-medium text-sm">
                              {framework.standard}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              合规评分
                            </p>
                            <p
                              className={`font-bold text-lg ${getScoreColor(framework.score)}`}
                            >
                              {framework.score.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              控制项
                            </p>
                            <p className="font-medium">
                              {framework.totalControls} 项
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              通过率
                            </p>
                            <p className="font-medium">
                              {Math.round(
                                (framework.passedControls /
                                  framework.totalControls) *
                                  100,
                              )}
                              %
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>通过</span>
                            <span className="text-green-400">
                              {framework.passedControls}
                            </span>
                          </div>
                          <Progress
                            value={
                              (framework.passedControls /
                                framework.totalControls) *
                              100
                            }
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm">
                            <span>失败</span>
                            <span className="text-red-400">
                              {framework.failedControls}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            <p>最后审计: {framework.lastAudit}</p>
                          </div>
                          <div>
                            <p>下次审计: {framework.nextAudit}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            onClick={() => setSelectedFramework(framework)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            重新评估
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 控制项 */}
          <TabsContent value="controls" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-neon-blue" />
                    合规控制项管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索控制项..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select
                      value={frameworkFilter}
                      onValueChange={setFrameworkFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="框架" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有框架</SelectItem>
                        <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                        <SelectItem value="GDPR">GDPR</SelectItem>
                        <SelectItem value="SOX">SOX</SelectItem>
                        <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="pass">通过</SelectItem>
                        <SelectItem value="fail">失败</SelectItem>
                        <SelectItem value="partial">部分通过</SelectItem>
                        <SelectItem value="not_tested">未测试</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-matrix-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          控制项ID
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          标题
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          框架
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          类别
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          优先级
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          状态
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          负责人
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          截止日期
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredControls.map((control) => (
                        <tr
                          key={control.id}
                          className="border-b border-matrix-border/50 hover:bg-matrix-accent/20"
                        >
                          <td className="py-3 px-4 font-mono text-sm">
                            {control.controlId}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-sm">
                                {control.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {control.description.substring(0, 50)}...
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                              {control.framework}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {control.category}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={getPriorityColor(control.priority)}
                            >
                              {control.priority}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(control.status)}>
                              {control.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {control.responsible}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {control.dueDate}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
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
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 审计发现 */}
          <TabsContent value="findings" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    审计发现管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select value="all">
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="严重程度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有级别</SelectItem>
                        <SelectItem value="critical">严重</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value="all">
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="open">开放</SelectItem>
                        <SelectItem value="in_progress">处理中</SelectItem>
                        <SelectItem value="resolved">已解决</SelectItem>
                        <SelectItem value="accepted_risk">风险接受</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFindings.map((finding) => (
                    <div
                      key={finding.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border hover:border-neon-blue/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle
                              className={`w-5 h-5 ${getPriorityColor(finding.severity).includes("red") ? "text-red-400" : getPriorityColor(finding.severity).includes("orange") ? "text-orange-400" : getPriorityColor(finding.severity).includes("yellow") ? "text-yellow-400" : "text-blue-400"}`}
                            />
                            <h3 className="font-medium text-white">
                              {finding.finding}
                            </h3>
                            <Badge
                              className={getPriorityColor(finding.severity)}
                            >
                              {finding.severity}
                            </Badge>
                            <Badge className={getStatusColor(finding.status)}>
                              {finding.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                影响
                              </p>
                              <p className="text-sm">{finding.impact}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                建议
                              </p>
                              <p className="text-sm">
                                {finding.recommendation}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span>框架: {finding.framework}</span>
                            <span>控制项: {finding.controlId}</span>
                            <span>负责人: {finding.assignee}</span>
                            <span>截止日期: {finding.dueDate}</span>
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
                            <Zap className="w-4 h-4" />
                          </Button>
                        </div>
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
