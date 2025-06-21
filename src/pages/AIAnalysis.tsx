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
  Brain,
  Lightbulb,
  TrendingUp,
  Activity,
  AlertTriangle,
  Search,
  RefreshCw,
  Download,
  Play,
  Pause,
  Settings,
  Eye,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Cpu,
  Database,
  Network,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  LineChart,
} from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  type:
    | "anomaly_detection"
    | "threat_classification"
    | "behavior_analysis"
    | "risk_prediction";
  description: string;
  accuracy: number;
  status: "training" | "active" | "inactive" | "updating";
  lastTrained: string;
  samplesProcessed: number;
  threatsDetected: number;
  falsePositives: number;
}

interface ThreatPrediction {
  id: string;
  threatType: string;
  probability: number;
  severity: "low" | "medium" | "high" | "critical";
  timeframe: string;
  confidence: number;
  indicators: string[];
  mitigation: string[];
  description: string;
}

interface AnalysisResult {
  id: string;
  timestamp: string;
  source: string;
  category: string;
  riskScore: number;
  status: "safe" | "suspicious" | "malicious" | "unknown";
  aiModel: string;
  confidence: number;
  findings: string[];
  recommendations: string[];
}

export default function AIAnalysis() {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "models" | "predictions" | "results"
  >("dashboard");
  const [modelFilter, setModelFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟AI模型数据
  const [aiModels] = useState<AIModel[]>([
    {
      id: "model-001",
      name: "深度威胁检测",
      type: "threat_classification",
      description: "基于深度学习的多层威胁分类模型",
      accuracy: 94.2,
      status: "active",
      lastTrained: "2024-01-18",
      samplesProcessed: 2500000,
      threatsDetected: 1247,
      falsePositives: 23,
    },
    {
      id: "model-002",
      name: "异常行为分析",
      type: "behavior_analysis",
      description: "用户和系统行为异常检测模型",
      accuracy: 89.7,
      status: "active",
      lastTrained: "2024-01-16",
      samplesProcessed: 1800000,
      threatsDetected: 856,
      falsePositives: 45,
    },
    {
      id: "model-003",
      name: "网络异常检测",
      type: "anomaly_detection",
      description: "网络流量和连接模式异常检测",
      accuracy: 91.3,
      status: "updating",
      lastTrained: "2024-01-20",
      samplesProcessed: 3200000,
      threatsDetected: 2134,
      falsePositives: 67,
    },
    {
      id: "model-004",
      name: "风险预测引擎",
      type: "risk_prediction",
      description: "基于历史数据的安全风险预测模型",
      accuracy: 87.5,
      status: "training",
      lastTrained: "2024-01-19",
      samplesProcessed: 950000,
      threatsDetected: 423,
      falsePositives: 18,
    },
  ]);

  // 模拟威胁预测数据
  const [threatPredictions] = useState<ThreatPrediction[]>([
    {
      id: "pred-001",
      threatType: "DDoS攻击",
      probability: 85.3,
      severity: "high",
      timeframe: "未来24小时",
      confidence: 92.1,
      indicators: ["异常流量增长", "多源头请求", "带宽使用异常"],
      mitigation: ["启用DDoS防护", "增加带宽容量", "配置流量过滤"],
      description: "检测到多个异常流量源，预测可能发生大规模DDoS攻击",
    },
    {
      id: "pred-002",
      threatType: "内部威胁",
      probability: 72.6,
      severity: "critical",
      timeframe: "未来72小时",
      confidence: 88.4,
      indicators: ["异常数据访问", "非工作时间活动", "权限滥用"],
      mitigation: ["加强访问监控", "限制敏感数据访问", "启用行为分析"],
      description: "检测到内部用户异常行为模式，存在数据泄露风险",
    },
    {
      id: "pred-003",
      threatType: "恶意软件传播",
      probability: 68.9,
      severity: "medium",
      timeframe: "未来48小时",
      confidence: 79.3,
      indicators: ["可疑文件下载", "网络横向移动", "异常进程活动"],
      mitigation: ["更新反病毒规则", "隔离可疑主机", "加强端点监控"],
      description: "发现恶意软件特征，预测可能在网络中传播",
    },
  ]);

  // 模拟分析结果数据
  const [analysisResults] = useState<AnalysisResult[]>([
    {
      id: "result-001",
      timestamp: "2024-01-20 14:30:25",
      source: "192.168.1.100",
      category: "网络流量",
      riskScore: 92,
      status: "malicious",
      aiModel: "深度威胁检测",
      confidence: 94.2,
      findings: ["检测到命令控制通信", "异常DNS查询", "加密流量异常"],
      recommendations: ["立即隔离主机", "分析恶意软件样本", "检查横向移动"],
    },
    {
      id: "result-002",
      timestamp: "2024-01-20 14:25:15",
      source: "用户: 张三",
      category: "用户行为",
      riskScore: 78,
      status: "suspicious",
      aiModel: "异常行为分析",
      confidence: 85.7,
      findings: ["非正常工作时间登录", "大量文件下载", "访问敏感系统"],
      recommendations: ["核实用户身份", "审查访问权限", "监控后续活动"],
    },
    {
      id: "result-003",
      timestamp: "2024-01-20 14:20:10",
      source: "邮件系统",
      category: "邮件安全",
      riskScore: 45,
      status: "safe",
      aiModel: "威胁分类模型",
      confidence: 91.3,
      findings: ["正常邮件通信", "无恶意附件", "发件人验证通过"],
      recommendations: ["继续监控", "定期更新规则"],
    },
  ]);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "safe":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "training":
      case "updating":
      case "suspicious":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "inactive":
      case "malicious":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "unknown":
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
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

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "anomaly_detection":
        return Target;
      case "threat_classification":
        return Shield;
      case "behavior_analysis":
        return Users;
      case "risk_prediction":
        return TrendingUp;
      default:
        return Brain;
    }
  };

  const filteredModels = aiModels.filter((model) => {
    const matchesSearch = model.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = modelFilter === "all" || model.type === modelFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <Brain className="w-8 h-8 text-neon-blue" />
              AI智能分析
            </h1>
            <p className="text-muted-foreground mt-2">
              人工智能驱动的威胁检测与安全分析平台
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? "分析中..." : "开始分析"}
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI模型</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {aiModels.length}
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    {aiModels.filter((m) => m.status === "active").length} 活跃
                  </p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均准确率</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round(
                      aiModels.reduce((sum, m) => sum + m.accuracy, 0) /
                        aiModels.length,
                    )}
                    %
                  </p>
                  <p className="text-xs text-green-400 mt-1">↑ 2.3%</p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日检测</p>
                  <p className="text-2xl font-bold text-blue-400">2,847</p>
                  <p className="text-xs text-blue-400 mt-1">威胁事件</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">误报率</p>
                  <p className="text-2xl font-bold text-red-400">1.8%</p>
                  <p className="text-xs text-green-400 mt-1">↓ 0.5%</p>
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
              value="dashboard"
              className="data-[state=active]:bg-neon-blue/20"
            >
              分析概览
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-neon-blue/20"
            >
              AI模型
            </TabsTrigger>
            <TabsTrigger
              value="predictions"
              className="data-[state=active]:bg-neon-blue/20"
            >
              威胁预测
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-neon-blue/20"
            >
              分析结果
            </TabsTrigger>
          </TabsList>

          {/* 分析概览 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 实时威胁检测 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-blue" />
                    实时威胁检测
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-green-400">安全流量</p>
                          <p className="text-sm text-muted-foreground">
                            已验证安全
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          12,456
                        </p>
                        <p className="text-xs text-green-400">94.2%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-yellow-400">
                            可疑活动
                          </p>
                          <p className="text-sm text-muted-foreground">
                            需要进一步分析
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-400">387</p>
                        <p className="text-xs text-yellow-400">2.9%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium text-red-400">恶意威胁</p>
                          <p className="text-sm text-muted-foreground">
                            确认威胁
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-400">23</p>
                        <p className="text-xs text-red-400">0.2%</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>检测进度</span>
                      <span>实时处理</span>
                    </div>
                    <div className="w-full bg-matrix-surface rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full animate-pulse"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI模型性能 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    AI模型性能
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiModels.slice(0, 4).map((model) => {
                    const ModelIcon = getModelTypeIcon(model.type);
                    return (
                      <div
                        key={model.id}
                        className="p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <ModelIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {model.name}
                            </span>
                            <Badge className={getStatusColor(model.status)}>
                              {model.status}
                            </Badge>
                          </div>
                          <span className="text-sm font-bold text-purple-400">
                            {model.accuracy}%
                          </span>
                        </div>
                        <Progress value={model.accuracy} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>检测: {model.threatsDetected}</span>
                          <span>误报: {model.falsePositives}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* 威胁趋势分析 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-amber-400" />
                  威胁趋势分析
                </CardTitle>
                <CardDescription>
                  基于AI分析的威胁检测趋势和预测
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-white">
                      威胁趋势图表
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      显示威胁检测数量、类型分布和时间趋势
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI模型 */}
          <TabsContent value="models" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-neon-blue" />
                    AI模型管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索模型..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select value={modelFilter} onValueChange={setModelFilter}>
                      <SelectTrigger className="w-40 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="模型类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="anomaly_detection">
                          异常检测
                        </SelectItem>
                        <SelectItem value="threat_classification">
                          威胁分类
                        </SelectItem>
                        <SelectItem value="behavior_analysis">
                          行为分析
                        </SelectItem>
                        <SelectItem value="risk_prediction">
                          风险预测
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredModels.map((model) => {
                    const ModelIcon = getModelTypeIcon(model.type);
                    return (
                      <Card
                        key={model.id}
                        className="cyber-card-enhanced border-matrix-border"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <ModelIcon className="w-5 h-5 text-neon-blue" />
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
                              <p className="text-lg font-bold text-purple-400">
                                {model.accuracy}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                最后训练
                              </p>
                              <p className="text-sm">{model.lastTrained}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                处理样本
                              </p>
                              <p className="text-sm">
                                {model.samplesProcessed.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                检测威胁
                              </p>
                              <p className="text-sm text-red-400">
                                {model.threatsDetected}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>性能指标</span>
                              <span>{model.accuracy}%</span>
                            </div>
                            <Progress value={model.accuracy} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                误报率:{" "}
                                {(
                                  (model.falsePositives /
                                    model.threatsDetected) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                              onClick={() => setSelectedModel(model)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              详情
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              配置
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

          {/* 威胁预测 */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  AI威胁预测
                </CardTitle>
                <CardDescription>
                  基于机器学习的未来威胁预测和风险评估
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle
                              className={`w-5 h-5 ${
                                prediction.severity === "critical"
                                  ? "text-red-400"
                                  : prediction.severity === "high"
                                    ? "text-orange-400"
                                    : prediction.severity === "medium"
                                      ? "text-yellow-400"
                                      : "text-blue-400"
                              }`}
                            />
                            <h3 className="font-medium text-white">
                              {prediction.threatType}
                            </h3>
                            <Badge
                              className={getSeverityColor(prediction.severity)}
                            >
                              {prediction.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {prediction.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                威胁指标
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {prediction.indicators.map(
                                  (indicator, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs"
                                    >
                                      {indicator}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                缓解措施
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {prediction.mitigation.map((action, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-green-500/20 text-green-400 border-green-500/40 text-xs"
                                  >
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                            <span>
                              发生概率: {prediction.probability.toFixed(1)}%
                            </span>
                            <span>置信度: {prediction.confidence}%</span>
                            <span>时间窗口: {prediction.timeframe}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-400 mb-1">
                            {prediction.probability.toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            预测概率
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 分析结果 */}
          <TabsContent value="results" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-neon-blue" />
                  AI分析结果
                </CardTitle>
                <CardDescription>实时AI分析结果和威胁检测详情</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                result.status === "safe"
                                  ? "bg-green-400"
                                  : result.status === "suspicious"
                                    ? "bg-yellow-400"
                                    : result.status === "malicious"
                                      ? "bg-red-400"
                                      : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="font-medium">{result.source}</span>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {result.category}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                发现项
                              </p>
                              <ul className="text-sm space-y-1">
                                {result.findings.map((finding, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    {finding}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                建议操作
                              </p>
                              <ul className="text-sm space-y-1">
                                {result.recommendations.map((rec, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2 text-green-400"
                                  >
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span>模型: {result.aiModel}</span>
                            <span>置信度: {result.confidence}%</span>
                            <span>时间: {result.timestamp}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold mb-1 ${
                              result.riskScore >= 80
                                ? "text-red-400"
                                : result.riskScore >= 60
                                  ? "text-orange-400"
                                  : result.riskScore >= 40
                                    ? "text-yellow-400"
                                    : "text-green-400"
                            }`}
                          >
                            {result.riskScore}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            风险评分
                          </div>
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
