import {
  useState,
  useRef,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  Activity,
  Shield,
  Target,
  Users,
  Cpu,
  Globe,
  ArrowLeft,
  Layers,
  ChevronLeft,
  X,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Network,
  FileText,
  Map,
  Loader,
  Server,
  Wifi,
  Database,
  Eye,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Group } from "three";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";
import {
  DISPLAY_COLORS,
  DISPLAY_THEME,
  SCENE_CONFIG,
  getThreatColor,
  getPerformanceColor,
} from "@/lib/situationDisplayColors";
import {
  UnifiedEnterpriseBuildings,
  UnifiedDataCenterClusters,
  UnifiedNetworkTopology,
  UnifiedSecurityRadar,
  UnifiedEnvironmentInfrastructure,
} from "@/components/3d/UnifiedSituationComponents";

/**
 * 统一配色的主3D场景
 * Unified Color Main 3D Scene
 */
function UnifiedMainScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  useFrame((state) => {
    if (sceneRef.current) {
      // 根据威胁等级微调场景
      const threatLevel = realTimeData?.realTimeThreats || 3;
      const rotationSpeed = threatLevel > 10 ? 0.002 : 0.001;
      sceneRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 环境基础设施 */}
      <UnifiedEnvironmentInfrastructure />

      {/* 企业建筑群 */}
      <UnifiedEnterpriseBuildings />

      {/* 数据中心集群 */}
      <UnifiedDataCenterClusters />

      {/* 网络拓扑 */}
      <UnifiedNetworkTopology />

      {/* 安全监控雷达 */}
      <UnifiedSecurityRadar />

      {/* 星空背景 */}
      <Stars
        radius={SCENE_CONFIG.environment.starRadius}
        depth={40}
        count={SCENE_CONFIG.environment.starCount}
        factor={1.5}
        saturation={0}
        fade
        speed={0.1}
      />
    </group>
  );
}

/**
 * 统一配色的信息覆盖层
 * Unified Color Information Overlay
 */
function UnifiedInfoOverlay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusCards = useMemo(() => {
    const threats = realTimeData?.realTimeThreats || 3;
    const attacks = realTimeData?.blockedAttacks || 1247;
    const users = realTimeData?.onlineUsers || 8247;
    const cpu = realTimeData?.cpuUsage || 45;

    return [
      {
        title: "威胁检测",
        value: threats,
        icon: Shield,
        color: getThreatColor(threats),
        change: "+2",
        trend: "up" as const,
      },
      {
        title: "拦截攻击",
        value: `${Math.floor(attacks / 1000)}K`,
        icon: Target,
        color: DISPLAY_COLORS.status.active,
        change: "+156",
        trend: "up" as const,
      },
      {
        title: "��线用户",
        value: `${Math.floor(users / 1000)}K`,
        icon: Users,
        color: DISPLAY_COLORS.facility.office,
        change: "+23",
        trend: "up" as const,
      },
      {
        title: "系统负载",
        value: `${cpu}%`,
        icon: Cpu,
        color: getPerformanceColor(cpu),
        change: "-5%",
        trend: "down" as const,
      },
    ];
  }, [realTimeData]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 顶部状态栏 */}
      <div className="absolute top-20 left-6 right-6 pointer-events-auto">
        <div
          className="rounded-xl shadow-2xl p-6 border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: DISPLAY_COLORS.ui.border.accent,
            borderRadius: DISPLAY_THEME.borderRadius.xlarge,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: DISPLAY_COLORS.ui.gradient.primary,
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: DISPLAY_COLORS.ui.text.primary }}
                >
                  CyberGuard 企业安全态势大屏
                </h2>
                <p style={{ color: DISPLAY_COLORS.ui.text.secondary }}>
                  Enterprise Security Situation Display Screen
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: DISPLAY_COLORS.status.active }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  系统运行正常
                </span>
              </div>
              <div
                className="text-sm px-3 py-1 rounded-lg border"
                style={{
                  color: DISPLAY_COLORS.ui.text.secondary,
                  backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                  borderColor: DISPLAY_COLORS.ui.border.primary,
                }}
              >
                {currentTime.toLocaleString("zh-CN")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {statusCards.map((card, index) => (
              <StatusCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>

      {/* 左侧性能监控 */}
      <PerformancePanel realTimeData={realTimeData} />

      {/* 右侧安全监控 */}
      <SecurityPanel realTimeData={realTimeData} />
    </div>
  );
}

/**
 * 统一配色的状态卡片
 */
function StatusCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  trend: "up" | "down";
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor =
    trend === "up"
      ? DISPLAY_COLORS.status.active
      : DISPLAY_COLORS.corporate.accent;

  return (
    <div
      className="rounded-lg p-6 border hover:shadow-lg transition-all duration-300"
      style={{
        backgroundColor: DISPLAY_COLORS.ui.background.secondary,
        borderColor: DISPLAY_COLORS.ui.border.primary,
        borderRadius: DISPLAY_THEME.borderRadius.large,
        transition: DISPLAY_THEME.transitions.smooth,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" style={{ color }} />
        <div
          className="flex items-center text-sm"
          style={{ color: trendColor }}
        >
          <TrendIcon className="w-4 h-4 mr-1" />
          <span>{change}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-3xl font-bold" style={{ color }}>
          {value}
        </div>
        <div
          className="text-sm mt-1"
          style={{ color: DISPLAY_COLORS.ui.text.secondary }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

/**
 * 性能监控面板
 */
function PerformancePanel({ realTimeData }: { realTimeData: any }) {
  const performanceMetrics = useMemo(
    () => [
      {
        label: "CPU 使用率",
        value: realTimeData?.cpuUsage || 45,
        color: getPerformanceColor(realTimeData?.cpuUsage || 45),
        unit: "%",
      },
      {
        label: "内存使用率",
        value: realTimeData?.memoryUsage || 68,
        color: getPerformanceColor(realTimeData?.memoryUsage || 68),
        unit: "%",
      },
      {
        label: "网络延迟",
        value: realTimeData?.networkLatency || 23,
        color: DISPLAY_COLORS.network.access,
        unit: "ms",
      },
      {
        label: "磁盘使用率",
        value: realTimeData?.diskUsage || 42,
        color: getPerformanceColor(realTimeData?.diskUsage || 42),
        unit: "%",
      },
    ],
    [realTimeData],
  );

  return (
    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div
        className="rounded-xl shadow-xl p-6 w-80 border"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.overlay,
          borderColor: DISPLAY_COLORS.ui.border.primary,
          borderRadius: DISPLAY_THEME.borderRadius.xlarge,
        }}
      >
        <div className="flex items-center mb-6">
          <Activity
            className="w-6 h-6 mr-3"
            style={{ color: DISPLAY_COLORS.corporate.accent }}
          />
          <h3
            className="text-lg font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            系统性能监控
          </h3>
        </div>

        <div className="space-y-5">
          {performanceMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm mb-2">
                <span
                  className="font-medium"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  {metric.label}
                </span>
                <span className="font-bold" style={{ color: metric.color }}>
                  {metric.value}
                  {metric.unit}
                </span>
              </div>
              <div
                className="w-full rounded-full h-3"
                style={{
                  backgroundColor: DISPLAY_COLORS.ui.background.tertiary,
                }}
              >
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(metric.value, 100)}%`,
                    backgroundColor: metric.color,
                    transition: DISPLAY_THEME.transitions.slow,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 p-3 rounded-lg border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.secondary,
            borderColor: DISPLAY_COLORS.ui.border.success,
          }}
        >
          <div
            className="text-sm font-medium mb-1"
            style={{ color: DISPLAY_COLORS.status.active }}
          >
            系统状态
          </div>
          <div
            className="text-xs"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            所有服务正常运行
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 安全监控面板
 */
function SecurityPanel({ realTimeData }: { realTimeData: any }) {
  const threatLevel = realTimeData?.realTimeThreats || 3;

  const securityStatus = useMemo(() => {
    if (threatLevel > 15)
      return {
        level: "高危",
        color: DISPLAY_COLORS.security.critical,
        bg: DISPLAY_COLORS.ui.background.secondary,
      };
    if (threatLevel > 8)
      return {
        level: "中等",
        color: DISPLAY_COLORS.security.medium,
        bg: DISPLAY_COLORS.ui.background.secondary,
      };
    return {
      level: "正常",
      color: DISPLAY_COLORS.security.safe,
      bg: DISPLAY_COLORS.ui.background.secondary,
    };
  }, [threatLevel]);

  return (
    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div
        className="rounded-xl shadow-xl p-6 w-80 border"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.overlay,
          borderColor: DISPLAY_COLORS.ui.border.primary,
          borderRadius: DISPLAY_THEME.borderRadius.xlarge,
        }}
      >
        <div className="flex items-center mb-6">
          <Shield
            className="w-6 h-6 mr-3"
            style={{ color: DISPLAY_COLORS.security.high }}
          />
          <h3
            className="text-lg font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            安全状态监控
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span
              className="text-sm font-medium"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              威胁等级
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{
                color: securityStatus.color,
                backgroundColor: securityStatus.bg,
                borderColor: securityStatus.color,
              }}
            >
              {securityStatus.level}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className="text-sm font-medium"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              防护状态
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{
                color: DISPLAY_COLORS.status.active,
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                borderColor: DISPLAY_COLORS.status.active,
              }}
            >
              已启用
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className="text-sm font-medium"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              实时威胁
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-bold border"
              style={{
                color: getThreatColor(threatLevel),
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                borderColor: getThreatColor(threatLevel),
              }}
            >
              {threatLevel}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className="text-sm font-medium"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              防火墙状态
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{
                color: DISPLAY_COLORS.corporate.accent,
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                borderColor: DISPLAY_COLORS.corporate.accent,
              }}
            >
              正常运行
            </span>
          </div>
        </div>

        <div
          className="mt-6 p-3 rounded-lg border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.secondary,
            borderColor: DISPLAY_COLORS.ui.border.primary,
          }}
        >
          <div
            className="text-sm font-medium mb-2"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            最近活动
          </div>
          <div
            className="text-xs space-y-1"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            <div>• 拦截恶意IP: 192.168.1.xxx</div>
            <div>• 检测到端口扫描行为</div>
            <div>• 更新安全规则库</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 统一配色的2D控制面板
 */
function Unified2DPanel({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [activeTab, setActiveTab] = useState("overview");

  const chartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${((new Date().getHours() - 23 + i) % 24).toString().padStart(2, "0")}:00`,
      cpu: 30 + Math.random() * 40,
      memory: 40 + Math.random() * 35,
      network: 20 + Math.random() * 60,
      threats: Math.floor(Math.random() * 15) + 2,
    }));
  }, []);

  const tabs = [
    { id: "overview", label: "概览", icon: BarChart3 },
    { id: "metrics", label: "指标", icon: Activity },
    { id: "network", label: "网络", icon: Network },
    { id: "security", label: "安全", icon: Shield },
    { id: "logs", label: "日志", icon: FileText },
    { id: "map", label: "拓扑", icon: Map },
  ];

  return (
    <div
      className={`fixed right-0 top-16 bottom-0 border-l transform transition-transform duration-300 z-40 shadow-2xl ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        width: "520px",
        backgroundColor: DISPLAY_COLORS.ui.background.primary,
        borderColor: DISPLAY_COLORS.ui.border.primary,
      }}
    >
      {/* 头部 */}
      <div
        className="flex items-center justify-between p-6 border-b"
        style={{
          background: DISPLAY_COLORS.ui.gradient.primary,
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            企业控制面板
          </h2>
          <p
            className="text-sm"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            Enterprise Control Panel
          </p>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg transition-colors hover:bg-black/20"
        >
          <X
            className="w-5 h-5"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          />
        </button>
      </div>

      {/* 标签页 */}
      <div
        className="flex border-b"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.secondary,
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "border-b-2" : ""
            }`}
            style={{
              color:
                activeTab === tab.id
                  ? DISPLAY_COLORS.corporate.accent
                  : DISPLAY_COLORS.ui.text.secondary,
              borderColor:
                activeTab === tab.id
                  ? DISPLAY_COLORS.corporate.accent
                  : "transparent",
              backgroundColor:
                activeTab === tab.id
                  ? DISPLAY_COLORS.ui.background.primary
                  : "transparent",
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div
        className="p-6 overflow-y-auto"
        style={{
          height: "calc(100vh - 180px)",
          backgroundColor: DISPLAY_COLORS.ui.background.primary,
        }}
      >
        {activeTab === "overview" && (
          <OverviewTab realTimeData={realTimeData} chartData={chartData} />
        )}
        {activeTab === "metrics" && <MetricsTab realTimeData={realTimeData} />}
        {activeTab === "network" && <NetworkTab realTimeData={realTimeData} />}
        {activeTab === "security" && (
          <SecurityTab realTimeData={realTimeData} />
        )}
        {activeTab === "logs" && <LogsTab />}
        {activeTab === "map" && <MapTab />}
      </div>
    </div>
  );
}

/**
 * 概览标签页
 */
function OverviewTab({
  realTimeData,
  chartData,
}: {
  realTimeData: any;
  chartData: any;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.secondary,
            borderColor: DISPLAY_COLORS.corporate.primary,
          }}
        >
          <div
            className="text-sm mb-1"
            style={{ color: DISPLAY_COLORS.corporate.primary }}
          >
            CPU 使用率
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.cpuUsage || 45}%
          </div>
        </div>
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.secondary,
            borderColor: DISPLAY_COLORS.status.active,
          }}
        >
          <div
            className="text-sm mb-1"
            style={{ color: DISPLAY_COLORS.status.active }}
          >
            内存使用率
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.memoryUsage || 68}%
          </div>
        </div>
      </div>

      <div
        className="rounded-lg p-4 border"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.secondary,
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: DISPLAY_COLORS.ui.text.primary }}
        >
          24小时趋势
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={DISPLAY_COLORS.ui.border.primary}
              />
              <XAxis
                dataKey="time"
                stroke={DISPLAY_COLORS.ui.text.muted}
                fontSize={12}
              />
              <YAxis stroke={DISPLAY_COLORS.ui.text.muted} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: DISPLAY_COLORS.ui.background.overlay,
                  border: `1px solid ${DISPLAY_COLORS.ui.border.primary}`,
                  borderRadius: DISPLAY_THEME.borderRadius.medium,
                  color: DISPLAY_COLORS.ui.text.primary,
                }}
              />
              <RechartsLine
                type="monotone"
                dataKey="cpu"
                stroke={DISPLAY_COLORS.corporate.primary}
                strokeWidth={2}
                name="CPU"
              />
              <RechartsLine
                type="monotone"
                dataKey="memory"
                stroke={DISPLAY_COLORS.status.active}
                strokeWidth={2}
                name="内存"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/**
 * 其他标签页组件（简化版本，保持统一配色）
 */
function MetricsTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        系统指标
      </h3>
      <div className="space-y-3">
        {[
          {
            label: "活跃连���",
            value: realTimeData?.activeConnections || 1245,
          },
          {
            label: "网络流量",
            value: `${realTimeData?.bandwidthUsage || 65}%`,
          },
          { label: "威胁检测", value: realTimeData?.realTimeThreats || 3 },
          { label: "拦截攻击", value: realTimeData?.blockedAttacks || 1247 },
        ].map((metric, index) => (
          <div
            key={index}
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.secondary,
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            <div className="flex justify-between items-center">
              <span
                className="text-sm font-medium"
                style={{ color: DISPLAY_COLORS.ui.text.secondary }}
              >
                {metric.label}
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: DISPLAY_COLORS.corporate.accent }}
              >
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        网络状态
      </h3>
      <div className="space-y-3">
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.secondary,
            borderColor: DISPLAY_COLORS.status.active,
          }}
        >
          <div
            className="text-sm mb-1"
            style={{ color: DISPLAY_COLORS.status.active }}
          >
            在线节点
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.onlineNodes || 47} / {realTimeData?.totalNodes || 50}
          </div>
        </div>
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.secondary,
            borderColor: DISPLAY_COLORS.corporate.accent,
          }}
        >
          <div
            className="text-sm mb-1"
            style={{ color: DISPLAY_COLORS.corporate.accent }}
          >
            网络延迟
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.networkLatency || 23}ms
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        安全事件
      </h3>
      <div className="space-y-2">
        {[
          { time: "14:23", event: "检测到端口扫描", severity: "medium" },
          { time: "14:15", event: "拦截恶意IP", severity: "high" },
          { time: "14:08", event: "防火墙规则更新", severity: "low" },
          { time: "13:54", event: "异常登录尝试", severity: "medium" },
        ].map((log, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.secondary,
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            <div className="flex justify-between items-center">
              <span
                className="text-sm"
                style={{ color: DISPLAY_COLORS.ui.text.secondary }}
              >
                {log.event}
              </span>
              <span
                className="text-xs"
                style={{ color: DISPLAY_COLORS.ui.text.muted }}
              >
                {log.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogsTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        系统日志
      </h3>
      <div
        className="rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.primary,
          color: DISPLAY_COLORS.status.active,
          border: `1px solid ${DISPLAY_COLORS.ui.border.primary}`,
        }}
      >
        <div>[2024-01-15 14:23:45] INFO: 系统启动成功</div>
        <div>[2024-01-15 14:23:46] INFO: 加载安全规则...</div>
        <div>[2024-01-15 14:23:47] INFO: 网络监控启动</div>
        <div style={{ color: DISPLAY_COLORS.security.medium }}>
          [2024-01-15 14:23:48] WARN: 检测到异常流量
        </div>
        <div>[2024-01-15 14:23:49] INFO: 防火墙拦截成功</div>
        <div>[2024-01-15 14:23:50] INFO: 威胁已处理</div>
      </div>
    </div>
  );
}

function MapTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        网络拓扑
      </h3>
      <div
        className="rounded-lg p-4 h-64 flex items-center justify-center border"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.secondary,
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        <div className="text-center">
          <Network
            className="w-12 h-12 mx-auto mb-2"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          />
          <div style={{ color: DISPLAY_COLORS.ui.text.secondary }}>
            网络拓扑图
          </div>
          <div
            className="text-sm"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            显示网络架构和连接状态
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 统一配色的顶部控制栏
 */
function UnifiedTopControlBar({
  onToggle2DPanel,
  is2DPanelVisible,
}: {
  onToggle2DPanel: () => void;
  is2DPanelVisible: boolean;
}) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 z-50 border-b shadow-lg"
      style={{
        backgroundColor: DISPLAY_COLORS.ui.background.overlay,
        borderColor: DISPLAY_COLORS.ui.border.primary,
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
              style={{
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                color: DISPLAY_COLORS.ui.text.secondary,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </button>

            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: DISPLAY_COLORS.ui.gradient.primary }}
              >
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: DISPLAY_COLORS.ui.text.primary }}
                >
                  CyberGuard ��业态势大屏
                </h1>
                <p
                  className="text-sm"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  Enterprise Security Situation Display Screen
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className="px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                borderColor: DISPLAY_COLORS.ui.border.primary,
                color: DISPLAY_COLORS.ui.text.secondary,
              }}
            >
              <div className="text-sm font-medium">
                {currentTime.toLocaleString("zh-CN")}
              </div>
            </div>

            <button
              onClick={onToggle2DPanel}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: is2DPanelVisible
                  ? DISPLAY_COLORS.corporate.primary
                  : DISPLAY_COLORS.ui.background.secondary,
                color: is2DPanelVisible
                  ? "white"
                  : DISPLAY_COLORS.ui.text.secondary,
              }}
              title="切换控制面板"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 统一配色的加载屏幕
 */
function UnifiedLoadingScreen() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
          style={{ background: DISPLAY_COLORS.ui.gradient.primary }}
        >
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
        <div
          className="text-xl font-bold mb-2"
          style={{ color: DISPLAY_COLORS.ui.text.primary }}
        >
          加载企业态势大屏
        </div>
        <div
          className="text-sm"
          style={{ color: DISPLAY_COLORS.ui.text.secondary }}
        >
          正在初始化安全监控系统...
        </div>
      </div>
    </div>
  );
}

/**
 * 主组件 - 统一配色的态势显示大屏
 * Main Component - Unified Color Situation Display Screen
 */
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return <UnifiedLoadingScreen />;
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      {/* 顶部控制栏 */}
      <UnifiedTopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
      />

      {/* 3D场景容器 */}
      <div
        className={`absolute inset-0 pt-16 transition-all duration-300 ${
          is2DPanelVisible ? "pr-[520px]" : "pr-0"
        }`}
      >
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 30, 60],
              fov: 60,
              near: 0.1,
              far: 500,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <UnifiedMainScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={20}
                maxDistance={150}
                dampingFactor={0.05}
                enableDamping
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 信息覆盖层 */}
      <UnifiedInfoOverlay />

      {/* 2D控制面板 */}
      <Unified2DPanel isVisible={is2DPanelVisible} onToggle={toggle2DPanel} />

      {/* 面板切换按钮 */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-l-lg shadow-xl border transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: DISPLAY_COLORS.ui.border.accent,
            color: DISPLAY_COLORS.ui.text.primary,
          }}
          title="打开企业控制面板"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* 底部状态栏 */}
      <div
        className={`absolute bottom-0 left-0 border-t p-3 transition-all duration-300 ${
          is2DPanelVisible ? "right-[520px]" : "right-0"
        }`}
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.overlay,
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        <div className="flex justify-between items-center text-sm">
          <span
            className="font-medium"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            CyberGuard 企业级网络安全态势大屏 v2.0
          </span>
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: DISPLAY_COLORS.status.active }}
            ></div>
            <span style={{ color: DISPLAY_COLORS.ui.text.secondary }}>
              系统运行正常
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
