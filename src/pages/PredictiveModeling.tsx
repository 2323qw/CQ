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
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Play,
  Pause,
  Database,
  Network,
  Users,
  Shield,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from "lucide-react";

interface PredictionModel {
  id: string;
  name: string;
  type:
    | "threat_forecast"
    | "vulnerability_prediction"
    | "incident_prediction"
    | "risk_assessment";
  description: string;
  accuracy: number;
  confidence: number;
  timeHorizon: string;
  status: "training" | "active" | "validating" | "inactive";
  lastUpdated: string;
  predictions: number;
  dataPoints: number;
}

interface RiskPrediction {
  id: string;
  category: string;
  prediction: string;
  probability: number;
  impact: "low" | "medium" | "high" | "critical";
  timeframe: string;
  confidence: number;
  riskScore: number;
  trend: "increasing" | "decreasing" | "stable";
  indicators: string[];
  mitigation: string[];
}

interface TrendData {
  date: string;
  threats: number;
  vulnerabilities: number;
  incidents: number;
  predicted_threats: number;
  predicted_vulnerabilities: number;
  predicted_incidents: number;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export default function PredictiveModeling() {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "models" | "predictions" | "trends"
  >("dashboard");
  const [modelFilter, setModelFilter] = useState("all");
  const [timeHorizonFilter, setTimeHorizonFilter] = useState("all");
  const [selectedModel, setSelectedModel] = useState<PredictionModel | null>(
    null,
  );
  const [isTraining, setIsTraining] = useState(false);

  // 模拟预测模型数据
  const [predictionModels] = useState<PredictionModel[]>([
    {
      id: "model-001",
      name: "威胁预测引擎",
      type: "threat_forecast",
      description: "基于历史攻击数据预测未来威胁趋势",
      accuracy: 89.7,
      confidence: 92.3,
      timeHorizon: "7天",
      status: "active",
      lastUpdated: "2024-01-20",
      predictions: 1247,
      dataPoints: 500000,
    },
    {
      id: "model-002",
      name: "漏洞风险评估",
      type: "vulnerability_prediction",
      description: "预测系统漏洞的利用可能性和影响范围",
      accuracy: 94.2,
      confidence: 88.9,
      timeHorizon: "30天",
      status: "active",
      lastUpdated: "2024-01-19",
      predictions: 856,
      dataPoints: 750000,
    },
    {
      id: "model-003",
      name: "安全事件预测",
      type: "incident_prediction",
      description: "基于环境因素预测安全事件发生概率",
      accuracy: 86.5,
      confidence: 91.2,
      timeHorizon: "14天",
      status: "training",
      lastUpdated: "2024-01-18",
      predictions: 634,
      dataPoints: 320000,
    },
    {
      id: "model-004",
      name: "综合风险评估",
      type: "risk_assessment",
      description: "多维度风险评估和预测模型",
      accuracy: 91.8,
      confidence: 87.6,
      timeHorizon: "90天",
      status: "validating",
      lastUpdated: "2024-01-17",
      predictions: 423,
      dataPoints: 980000,
    },
  ]);

  // 模拟风险预测数据
  const [riskPredictions] = useState<RiskPrediction[]>([
    {
      id: "pred-001",
      category: "网络安全",
      prediction: "DDoS攻击风险增加",
      probability: 78.3,
      impact: "high",
      timeframe: "未来7天",
      confidence: 89.2,
      riskScore: 85,
      trend: "increasing",
      indicators: ["僵尸网络活动增加", "攻击工具扫描频率上升", "可疑流量模式"],
      mitigation: [
        "加强DDoS防护",
        "监控流量异常",
        "准备应急响应",
        "联系ISP提供商",
      ],
    },
    {
      id: "pred-002",
      category: "端点安全",
      prediction: "恶意软件感染风险",
      probability: 65.7,
      impact: "medium",
      timeframe: "未来14天",
      confidence: 82.5,
      riskScore: 72,
      trend: "stable",
      indicators: ["钓鱼邮件增加", "可疑下载行为", "端点防护更新滞后"],
      mitigation: [
        "更新端点防护",
        "加强邮件过滤",
        "用户安全培训",
        "定期安全扫描",
      ],
    },
    {
      id: "pred-003",
      category: "数据安全",
      prediction: "数据泄露风险上升",
      probability: 42.8,
      impact: "critical",
      timeframe: "未来30天",
      confidence: 76.3,
      riskScore: 68,
      trend: "decreasing",
      indicators: ["内部访问异常", "权限管理不当", "数据库安全配置问题"],
      mitigation: [
        "审查访问权限",
        "加强数据加密",
        "监控数据访问",
        "完善备份策略",
      ],
    },
    {
      id: "pred-004",
      category: "应用安全",
      prediction: "Web应用攻击增加",
      probability: 71.2,
      impact: "medium",
      timeframe: "未来21天",
      confidence: 84.7,
      riskScore: 74,
      trend: "increasing",
      indicators: ["SQL注入尝试增加", "XSS攻击检测上升", "API异常调用增多"],
      mitigation: [
        "更新WAF规则",
        "代码安全审计",
        "API安全加固",
        "应用补丁管理",
      ],
    },
  ]);

  // 模拟趋势数据
  const [trendData] = useState<TrendData[]>([
    {
      date: "2024-01-14",
      threats: 45,
      vulnerabilities: 12,
      incidents: 3,
      predicted_threats: 48,
      predicted_vulnerabilities: 15,
      predicted_incidents: 4,
    },
    {
      date: "2024-01-15",
      threats: 52,
      vulnerabilities: 18,
      incidents: 5,
      predicted_threats: 55,
      predicted_vulnerabilities: 16,
      predicted_incidents: 3,
    },
    {
      date: "2024-01-16",
      threats: 38,
      vulnerabilities: 9,
      incidents: 2,
      predicted_threats: 42,
      predicted_vulnerabilities: 11,
      predicted_incidents: 2,
    },
    {
      date: "2024-01-17",
      threats: 67,
      vulnerabilities: 23,
      incidents: 7,
      predicted_threats: 62,
      predicted_vulnerabilities: 25,
      predicted_incidents: 6,
    },
    {
      date: "2024-01-18",
      threats: 41,
      vulnerabilities: 14,
      incidents: 4,
      predicted_threats: 44,
      predicted_vulnerabilities: 12,
      predicted_incidents: 5,
    },
    {
      date: "2024-01-19",
      threats: 56,
      vulnerabilities: 19,
      incidents: 6,
      predicted_threats: 58,
      predicted_vulnerabilities: 21,
      predicted_incidents: 4,
    },
    {
      date: "2024-01-20",
      threats: 49,
      vulnerabilities: 16,
      incidents: 3,
      predicted_threats: 51,
      predicted_vulnerabilities: 18,
      predicted_incidents: 5,
    },
  ]);

  const handleTrainModel = async () => {
    setIsTraining(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsTraining(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "training":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "validating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "decreasing":
        return <ArrowDownRight className="w-4 h-4 text-green-400" />;
      case "stable":
        return <ArrowRight className="w-4 h-4 text-yellow-400" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-400" />;
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "threat_forecast":
        return Shield;
      case "vulnerability_prediction":
        return AlertTriangle;
      case "incident_prediction":
        return Activity;
      case "risk_assessment":
        return Target;
      default:
        return Brain;
    }
  };

  const filteredModels = predictionModels.filter((model) => {
    const matchesType = modelFilter === "all" || model.type === modelFilter;
    const matchesHorizon =
      timeHorizonFilter === "all" ||
      model.timeHorizon.includes(timeHorizonFilter);
    return matchesType && matchesHorizon;
  });

  const calculateAccuracy = (model: PredictionModel): ModelMetrics => {
    return {
      accuracy: model.accuracy,
      precision: model.accuracy + Math.random() * 5 - 2.5,
      recall: model.accuracy + Math.random() * 5 - 2.5,
      f1Score: model.accuracy + Math.random() * 3 - 1.5,
      auc: (model.accuracy + Math.random() * 10 - 5) / 100 + 0.5,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-neon-blue" />
              AI预测建模
            </h1>
            <p className="text-muted-foreground mt-2">
              基于机器学习的安全风险预测和趋势分析平台
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              {isTraining ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isTraining ? "训练中..." : "训练模型"}
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出预测
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">预测模型</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {predictionModels.length}
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    {
                      predictionModels.filter((m) => m.status === "active")
                        .length
                    }{" "}
                    活跃
                  </p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">预测准确率</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.round(
                      predictionModels.reduce((sum, m) => sum + m.accuracy, 0) /
                        predictionModels.length,
                    )}
                    %
                  </p>
                  <p className="text-xs text-blue-400 mt-1">平均值</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">高风险预测</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {
                      riskPredictions.filter(
                        (p) => p.impact === "high" || p.impact === "critical",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-amber-400 mt-1">需关注</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">预测置信度</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round(
                      predictionModels.reduce(
                        (sum, m) => sum + m.confidence,
                        0,
                      ) / predictionModels.length,
                    )}
                    %
                  </p>
                  <p className="text-xs text-green-400 mt-1">平均值</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
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
              预测概览
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-neon-blue/20"
            >
              预测模型
            </TabsTrigger>
            <TabsTrigger
              value="predictions"
              className="data-[state=active]:bg-neon-blue/20"
            >
              风险预测
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-neon-blue/20"
            >
              趋势分析
            </TabsTrigger>
          </TabsList>

          {/* 预测概览 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 模型性能概览 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-neon-blue" />
                    模型性能概览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {predictionModels.slice(0, 4).map((model) => {
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
                          <span>置信度: {model.confidence}%</span>
                          <span>时间跨度: {model.timeHorizon}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* 预测统计 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-400" />
                    预测统计
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-green-400">准确预测</p>
                          <p className="text-sm text-muted-foreground">
                            预测正确的事件
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          1,847
                        </p>
                        <p className="text-xs text-green-400">87.2%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-yellow-400">待验证</p>
                          <p className="text-sm text-muted-foreground">
                            预测结果待确认
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-400">156</p>
                        <p className="text-xs text-yellow-400">7.3%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium text-red-400">误报预测</p>
                          <p className="text-sm text-muted-foreground">
                            预测错误的事件
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-400">117</p>
                        <p className="text-xs text-red-400">5.5%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 预测趋势图 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-amber-400" />
                  预测vs实际趋势对比
                </CardTitle>
                <CardDescription>
                  模型预测结果与实际发生事件的对比分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-white">
                      趋势对比图表
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      显示预测值与实际值的时间序列对比
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 预测模型 */}
          <TabsContent value="models" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-neon-blue" />
                    预测模型管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select value={modelFilter} onValueChange={setModelFilter}>
                      <SelectTrigger className="w-40 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="模型类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="threat_forecast">
                          威胁预测
                        </SelectItem>
                        <SelectItem value="vulnerability_prediction">
                          漏洞预测
                        </SelectItem>
                        <SelectItem value="incident_prediction">
                          事件预测
                        </SelectItem>
                        <SelectItem value="risk_assessment">
                          风险评估
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={timeHorizonFilter}
                      onValueChange={setTimeHorizonFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="时间跨度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有期间</SelectItem>
                        <SelectItem value="7">7天</SelectItem>
                        <SelectItem value="14">14天</SelectItem>
                        <SelectItem value="30">30天</SelectItem>
                        <SelectItem value="90">90天</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredModels.map((model) => {
                    const ModelIcon = getModelTypeIcon(model.type);
                    const metrics = calculateAccuracy(model);
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
                                置信度
                              </p>
                              <p className="text-lg font-bold text-green-400">
                                {model.confidence}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                时间跨度
                              </p>
                              <p className="text-sm">{model.timeHorizon}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                预测数量
                              </p>
                              <p className="text-sm">{model.predictions}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground mb-2">
                              模型指标
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between">
                                <span>精确率:</span>
                                <span className="text-blue-400">
                                  {metrics.precision.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>召回率:</span>
                                <span className="text-green-400">
                                  {metrics.recall.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>F1分数:</span>
                                <span className="text-yellow-400">
                                  {metrics.f1Score.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>AUC:</span>
                                <span className="text-purple-400">
                                  {metrics.auc.toFixed(3)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            最后更新: {model.lastUpdated} | 数据点:{" "}
                            {model.dataPoints.toLocaleString()}
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

          {/* 风险预测 */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  风险预测分析
                </CardTitle>
                <CardDescription>
                  基于AI模型的未来安全风险预测和建议
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-amber-400" />
                            <h3 className="font-medium text-white">
                              {prediction.prediction}
                            </h3>
                            <Badge
                              className={getImpactColor(prediction.impact)}
                            >
                              {prediction.impact}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(prediction.trend)}
                              <span className="text-xs text-muted-foreground">
                                {prediction.trend}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                风险指标
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {prediction.indicators.map(
                                  (indicator, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-red-500/20 text-red-400 border-red-500/40 text-xs"
                                    >
                                      {indicator}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                缓解建议
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
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>类别: {prediction.category}</span>
                            <span>
                              发生概率: {prediction.probability.toFixed(1)}%
                            </span>
                            <span>置信度: {prediction.confidence}%</span>
                            <span>时间窗口: {prediction.timeframe}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-400 mb-1">
                            {prediction.riskScore}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            风险评分
                          </div>
                          <Progress
                            value={prediction.riskScore}
                            className="h-2 w-16 mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 趋势分析 */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 预测准确性分析 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-neon-blue" />
                    预测准确性分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trendData.slice(-4).map((data, index) => (
                    <div
                      key={index}
                      className="p-3 bg-matrix-surface/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{data.date}</span>
                        <span className="text-xs text-muted-foreground">
                          对比分析
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-muted-foreground">威胁</p>
                          <p className="text-white">
                            {data.threats} /{" "}
                            <span className="text-blue-400">
                              {data.predicted_threats}
                            </span>
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">漏洞</p>
                          <p className="text-white">
                            {data.vulnerabilities} /{" "}
                            <span className="text-green-400">
                              {data.predicted_vulnerabilities}
                            </span>
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">事件</p>
                          <p className="text-white">
                            {data.incidents} /{" "}
                            <span className="text-yellow-400">
                              {data.predicted_incidents}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 模型性能趋势 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-green-400" />
                    模型性能趋势
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        period: "本周",
                        accuracy: 91.2,
                        trend: "up",
                        change: "+2.3%",
                      },
                      {
                        period: "本月",
                        accuracy: 89.7,
                        trend: "up",
                        change: "+1.8%",
                      },
                      {
                        period: "季度",
                        accuracy: 87.4,
                        trend: "down",
                        change: "-0.9%",
                      },
                      {
                        period: "年度",
                        accuracy: 88.9,
                        trend: "up",
                        change: "+3.2%",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{item.period}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-green-400">
                            {item.accuracy}%
                          </span>
                          <span
                            className={`text-sm ${
                              item.trend === "up"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 长期趋势预测 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  长期安全趋势预测
                </CardTitle>
                <CardDescription>
                  基于历史数据和当前趋势的长期安全态势预测
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-white">
                      长期趋势图表
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      显示未来3-12个月的安全风险预测趋势
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
