import React from "react";
import {
  Brain,
  Target,
  Command,
  Network,
  Bug,
  ScanLine,
  Radar,
  GitBranch,
  Calendar,
  Archive,
  Download,
  ShieldCheck,
  Fingerprint,
  TrendingUp,
  Zap,
  Shield,
  Eye,
  ArrowRight,
  Star,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  status: "live" | "beta" | "coming" | "pro";
  category: string;
  features: string[];
  color: string;
  path?: string;
}

const features: FeatureCard[] = [
  {
    title: "AI威胁猎捕",
    description: "基于机器学习的主动威胁发现，识别隐藏的APT攻击",
    icon: Target,
    status: "beta",
    category: "AI安全",
    features: ["行为基线分析", "异常模式识别", "威胁预测", "自动化猎捕"],
    color: "from-red-500 to-orange-500",
    path: "/threat-hunting",
  },
  {
    title: "安全指挥中心",
    description: "集中化安全运营与指挥调度，统一事件响应流程",
    icon: Command,
    status: "pro",
    category: "运营管理",
    features: ["统一指挥", "应急响应", "团队协作", "流程自动化"],
    color: "from-purple-500 to-violet-500",
    path: "/command-center",
  },
  {
    title: "智能网络拓扑",
    description: "AI驱动的网络拓扑自动发现与可视化",
    icon: Network,
    status: "live",
    category: "网络安全",
    features: ["自动发现", "关系映射", "异常检测", "攻击路径"],
    color: "from-blue-500 to-cyan-500",
    path: "/network-topology",
  },
  {
    title: "恶意软件分析",
    description: "沙箱环境下的恶意软件深度分析与行���监控",
    icon: Bug,
    status: "live",
    category: "威胁分析",
    features: ["沙箱分析", "行为监控", "特征提取", "家族分类"],
    color: "from-green-500 to-emerald-500",
    path: "/malware-analysis",
  },
  {
    title: "预测防护",
    description: "基于AI的威胁预测与主动防护机制",
    icon: Radar,
    status: "pro",
    category: "AI安全",
    features: ["威胁预测", "主动防护", "风险评估", "防护建议"],
    color: "from-yellow-500 to-orange-500",
    path: "/predictive-defense",
  },
  {
    title: "自动响应",
    description: "智能事件响应自动化，减少人工干预",
    icon: GitBranch,
    status: "beta",
    category: "自动化",
    features: ["自动响应", "决策引擎", "工作流", "影响评估"],
    color: "from-pink-500 to-rose-500",
    path: "/auto-response",
  },
  {
    title: "漏洞扫描",
    description: "全面的漏洞发现与风险评估平台",
    icon: ScanLine,
    status: "live",
    category: "漏洞管理",
    features: ["资产发现", "漏洞扫描", "风险评级", "修复建议"],
    color: "from-indigo-500 to-purple-500",
    path: "/vulnerability-scan",
  },
  {
    title: "合规检查",
    description: "自动化合规性审计与报告生成",
    icon: ShieldCheck,
    status: "pro",
    category: "合规管理",
    features: ["合规审计", "标准框架", "报告生成", "持续监控"],
    color: "from-teal-500 to-cyan-500",
    path: "/compliance-check",
  },
  {
    title: "网络取证",
    description: "深度网络流量分析与数字取证能力",
    icon: Fingerprint,
    status: "pro",
    category: "数字取证",
    features: ["流量分析", "数据重构", "证据链", "取证报告"],
    color: "from-amber-500 to-yellow-500",
    path: "/network-forensics",
  },
  {
    title: "事件管理",
    description: "安全事件全生命周期管理平台",
    icon: Calendar,
    status: "live",
    category: "事件管理",
    features: ["事件跟踪", "工作流", "SLA管理", "知识库"],
    color: "from-emerald-500 to-green-500",
    path: "/incident-management",
  },
  {
    title: "风险评估",
    description: "企业安全风险量化评估与管理",
    icon: TrendingUp,
    status: "pro",
    category: "风险管理",
    features: ["风险建模", "量化分析", "趋势预测", "决策支持"],
    color: "from-violet-500 to-purple-500",
    path: "/risk-assessment",
  },
  {
    title: "备份恢复",
    description: "系统数据备份与灾难恢复管理",
    icon: Archive,
    status: "live",
    category: "数据管理",
    features: ["自动备份", "增量备份", "快速恢复", "完整性检查"],
    color: "from-slate-500 to-gray-500",
    path: "/backup",
  },
];

const FeatureShowcase: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
            <CheckCircle className="w-3 h-3 mr-1" />
            已上线
          </Badge>
        );
      case "beta":
        return (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
            <Clock className="w-3 h-3 mr-1" />
            内测中
          </Badge>
        );
      case "pro":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
            <Star className="w-3 h-3 mr-1" />
            专业版
          </Badge>
        );
      case "coming":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
            <Eye className="w-3 h-3 mr-1" />
            即将推出
          </Badge>
        );
      default:
        return null;
    }
  };

  const categories = [...new Set(features.map((f) => f.category))];

  return (
    <div className="min-h-screen bg-matrix-bg text-white p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-quantum-500 to-neural-500 rounded-xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white neon-text">
                功能展示中心
              </h1>
              <p className="text-lg text-muted-foreground">
                探索CyberGuard Pro的强大功能和创新特性
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="cyber-card p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">已上线功能</p>
                <p className="text-3xl font-bold text-white">
                  {features.filter((f) => f.status === "live").length}
                </p>
                <p className="text-xs text-green-400">稳定运行</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-300">内测功能</p>
                <p className="text-3xl font-bold text-white">
                  {features.filter((f) => f.status === "beta").length}
                </p>
                <p className="text-xs text-orange-400">测试中</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">专业功能</p>
                <p className="text-3xl font-bold text-white">
                  {features.filter((f) => f.status === "pro").length}
                </p>
                <p className="text-xs text-purple-400">高级版本</p>
              </div>
              <Star className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">功能分类</p>
                <p className="text-3xl font-bold text-white">
                  {categories.length}
                </p>
                <p className="text-xs text-blue-400">完整覆盖</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Feature Categories */}
        {categories.map((category) => (
          <div key={category} className="space-y-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white">{category}</h2>
              <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
                {features.filter((f) => f.category === category).length} 个功能
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features
                .filter((feature) => feature.category === category)
                .map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="cyber-card hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {getStatusBadge(feature.status)}
                        </div>
                        <CardTitle className="text-white group-hover:text-quantum-400 transition-colors">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white">
                            核心功能:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {feature.features.map((feat, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {feat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="w-full neon-button-subtle group-hover:neon-button transition-all duration-300"
                          disabled={!feature.path}
                        >
                          {feature.status === "live" ? "立即体验" : "了解更多"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Call to Action */}
        <div className="cyber-card p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-quantum-500 to-neural-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-quantum-500/25">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                体验下一代网络安全
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                CyberGuard Pro
                集成了最先进的AI技术和安全工具，为企业提供全方位的网络安全防护。
                立即升级，体验智能化安全运营的强大能力。
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="neon-button px-8 py-3 text-lg">
                  开始免费试用
                </Button>
                <Button
                  variant="outline"
                  className="border-quantum-500 text-quantum-400 hover:bg-quantum-500/10 px-8 py-3 text-lg"
                >
                  联系销售
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
