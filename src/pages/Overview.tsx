import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  FileText,
  Shield,
  Server,
  Users,
  Key,
  Settings,
  TrendingUp,
  Zap,
  Globe,
  Monitor,
} from "lucide-react";

const features = [
  {
    title: "仪表板",
    description: "实时威胁监控和系统状态概览",
    path: "/",
    icon: Activity,
    color: "neon-blue",
    stats: "实时更新",
  },
  {
    title: "威胁告警管理",
    description: "高级告警处理和状态管理系统",
    path: "/alerts",
    icon: AlertTriangle,
    color: "threat-critical",
    stats: "智能过滤",
  },
  {
    title: "安全报告",
    description: "数据可视化和报告生成中心",
    path: "/reports",
    icon: FileText,
    color: "neon-green",
    stats: "多格式导出",
  },
  {
    title: "威胁情报中心",
    description: "全球威胁情报分析和监控",
    path: "/threat-intelligence",
    icon: Shield,
    color: "neon-purple",
    stats: "156个国家",
  },
  {
    title: "资产管理",
    description: "IT资产清单和安全状态监控",
    path: "/assets",
    icon: Server,
    color: "threat-medium",
    stats: "实时监控",
  },
  {
    title: "用户管理",
    description: "用户账户和权限管理系统",
    path: "/users",
    icon: Users,
    color: "neon-green",
    stats: "角色控制",
  },
  {
    title: "系统日志",
    description: "系统日志查看和分析工具",
    path: "/logs",
    icon: Monitor,
    color: "threat-info",
    stats: "智能检索",
  },
  {
    title: "API密钥管理",
    description: "第三方集成和API访问控制",
    path: "/api-keys",
    icon: Key,
    color: "neon-yellow",
    stats: "安全认证",
  },
  {
    title: "系统设置",
    description: "系统配置和个性化设置",
    path: "/settings",
    icon: Settings,
    color: "muted",
    stats: "灵活配置",
  },
];

const highlights = [
  {
    title: "实时数据更新",
    description: "所有数据组件支持5-15秒自动刷新，确保信息实时性",
    icon: TrendingUp,
  },
  {
    title: "交互式图表",
    description: "支持多种图表类型切换，悬停查看详情，时间范围选择",
    icon: Activity,
  },
  {
    title: "高级过滤器",
    description: "多维度数据过滤，支持复合条件查询和时间范围筛选",
    icon: Settings,
  },
  {
    title: "通知系统",
    description: "完整的Toast通知系统，支持成功、警告、错误和信息提示",
    icon: Zap,
  },
  {
    title: "响应式设计",
    description: "完美适配桌面、平板和移动设备，保证最佳用户体验",
    icon: Globe,
  },
  {
    title: "科幻主题",
    description: "深色矩阵风格配霓虹色彩，动画效果营造未来科技感",
    icon: Monitor,
  },
];

export default function Overview() {
  return (
    <div className="ml-64 p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white glow-text mb-4">
          CyberGuard 网络安全监控系统
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          全功能网络安全监控平台 - 专业版
        </p>
        <p className="text-muted-foreground">
          集成威胁检测、资产管理、用户控制、系统监控于一体的企业级安全解决方案
        </p>
      </div>

      {/* 功能特色 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-neon-blue" />
          <span>核心特色</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="cyber-card p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center border border-neon-blue/30">
                    <Icon className="w-6 h-6 text-neon-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 功能模块 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Activity className="w-6 h-6 text-neon-green" />
          <span>功能模块</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.path}
                className="cyber-card p-6 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-${feature.color}/20 rounded-lg flex items-center justify-center border border-${feature.color}/30`}
                  >
                    <Icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded bg-${feature.color}/20 text-${feature.color}`}
                  >
                    {feature.stats}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 技术规格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-neon-blue" />
            <span>技术架构</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">前端框架:</span>
              <span className="text-white">React 18 + TypeScript</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UI组件库:</span>
              <span className="text-white">Radix UI + Tailwind CSS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">路由管理:</span>
              <span className="text-white">React Router 6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">图表组件:</span>
              <span className="text-white">Recharts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">构建工具:</span>
              <span className="text-white">Vite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">代码规范:</span>
              <span className="text-white">ESLint + Prettier</span>
            </div>
          </div>
        </div>

        <div className="cyber-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-neon-green" />
            <span>系统指标</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">总代码行数:</span>
              <span className="text-white">5,000+ 行</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">组件数量:</span>
              <span className="text-white">50+ 个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">页面数量:</span>
              <span className="text-white">10 个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">自定义Hook:</span>
              <span className="text-white">5 个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">响应式支持:</span>
              <span className="text-white">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">类型安全:</span>
              <span className="text-white">完整覆盖</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="mt-12 text-center">
        <div className="cyber-card p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            🛡️ 专业级网络安全监控解决方案
          </h3>
          <p className="text-muted-foreground mb-6">
            基于现代Web技术栈构建的企业级安全监控平台，提供完整的威胁检测、
            资产管理、用户控制和系统监控功能。采用科幻主题设计，
            支持实时数据更新和交互式操作，是现代化安全运营中心的理想选择。
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <span>🔒 企业级安全</span>
            <span>⚡ 实时监控</span>
            <span>📊 数据可视化</span>
            <span>🌐 响应式设计</span>
            <span>🚀 高性能架构</span>
          </div>
        </div>
      </div>
    </div>
  );
}
