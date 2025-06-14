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
  MapPin,
  AlertTriangle,
  Satellite,
  Radio,
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
  ComposedChart,
  Bar,
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
  WorldMapOutline,
  GlobalDataCenters,
  GlobalNetworkConnections,
  GlobalThreatVisualization,
  WorldMapEnvironment,
} from "@/components/3d/WorldMapComponents";

/**
 * 全球安全态势主场景
 * Global Security Situation Main Scene
 */
function GlobalSecurityScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 3000,
    enabled: true,
  });

  useFrame((state) => {
    if (sceneRef.current) {
      // 根据全球威胁等级调整场景效果
      const globalThreatLevel = realTimeData?.realTimeThreats || 3;
      if (globalThreatLevel > 10) {
        // 高威胁时场景略微震动
        sceneRef.current.position.y =
          Math.sin(state.clock.getElapsedTime() * 8) * 0.1;
      } else {
        sceneRef.current.position.y = 0;
      }
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 世界地图环境 */}
      <WorldMapEnvironment />

      {/* 世界地图轮廓 */}
      <WorldMapOutline />

      {/* 全球数据中心 */}
      <GlobalDataCenters />

      {/* 全球网络连接 */}
      <GlobalNetworkConnections />

      {/* 全球威胁可视化 */}
      <GlobalThreatVisualization />

      {/* 太空星空背景 */}
      <Stars
        radius={300}
        depth={50}
        count={2000}
        factor={2}
        saturation={0}
        fade
        speed={0.05}
      />
    </group>
  );
}

/**
 * 全球安全态势信息覆盖层
 * Global Security Situation Information Overlay
 */
function GlobalInfoOverlay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const globalStats = useMemo(() => {
    const threats = realTimeData?.realTimeThreats || 3;
    const attacks = realTimeData?.blockedAttacks || 1247;
    const connections = realTimeData?.activeConnections || 8247;
    const bandwidth = realTimeData?.bandwidthUsage || 45;

    return [
      {
        title: "全球威胁",
        value: threats,
        icon: Shield,
        color: getThreatColor(threats),
        change: "+12",
        trend: "up" as const,
        region: "Global Threats",
      },
      {
        title: "拦截攻击",
        value: `${Math.floor(attacks / 1000)}K`,
        icon: Target,
        color: DISPLAY_COLORS.status.active,
        change: "+2.1K",
        trend: "up" as const,
        region: "Blocked Attacks",
      },
      {
        title: "活跃连接",
        value: `${Math.floor(connections / 1000)}K`,
        icon: Network,
        color: DISPLAY_COLORS.network.access,
        change: "+156",
        trend: "up" as const,
        region: "Active Connections",
      },
      {
        title: "全球带宽",
        value: `${bandwidth}%`,
        icon: Satellite,
        color: getPerformanceColor(bandwidth),
        change: "-3%",
        trend: "down" as const,
        region: "Global Bandwidth",
      },
    ];
  }, [realTimeData]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 全球安全态势顶部面板 */}
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
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: DISPLAY_COLORS.ui.text.primary }}
                >
                  CyberGuard 全球安全态势大屏
                </h2>
                <p style={{ color: DISPLAY_COLORS.ui.text.secondary }}>
                  Global Cybersecurity Situation Awareness Platform
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
                  全球监控正常
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
            {globalStats.map((stat, index) => (
              <GlobalStatusCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* 左侧全球性能监控 */}
      <GlobalPerformancePanel realTimeData={realTimeData} />

      {/* 右侧区域威胁分析 */}
      <RegionalThreatPanel realTimeData={realTimeData} />
    </div>
  );
}

/**
 * 全球状态卡片
 */
function GlobalStatusCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  trend,
  region,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  trend: "up" | "down";
  region: string;
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
        <div className="text-3xl font-bold mb-1" style={{ color }}>
          {value}
        </div>
        <div
          className="text-sm mb-1"
          style={{ color: DISPLAY_COLORS.ui.text.secondary }}
        >
          {title}
        </div>
        <div
          className="text-xs"
          style={{ color: DISPLAY_COLORS.ui.text.muted }}
        >
          {region}
        </div>
      </div>
    </div>
  );
}

/**
 * 全球性能监控面板
 */
function GlobalPerformancePanel({ realTimeData }: { realTimeData: any }) {
  const globalMetrics = useMemo(
    () => [
      {
        label: "全球延迟",
        value: realTimeData?.networkLatency || 23,
        color: DISPLAY_COLORS.network.access,
        unit: "ms",
        region: "Global Average",
      },
      {
        label: "数据中心负载",
        value: realTimeData?.cpuUsage || 68,
        color: getPerformanceColor(realTimeData?.cpuUsage || 68),
        unit: "%",
        region: "Data Centers",
      },
      {
        label: "海缆带宽",
        value: realTimeData?.bandwidthUsage || 45,
        color: DISPLAY_COLORS.network.distribution,
        unit: "%",
        region: "Submarine Cables",
      },
      {
        label: "卫星链路",
        value: realTimeData?.memoryUsage || 78,
        color: getPerformanceColor(realTimeData?.memoryUsage || 78),
        unit: "%",
        region: "Satellite Links",
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
          <Globe
            className="w-6 h-6 mr-3"
            style={{ color: DISPLAY_COLORS.corporate.accent }}
          />
          <h3
            className="text-lg font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            全球性���监控
          </h3>
        </div>

        <div className="space-y-5">
          {globalMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm mb-2">
                <div>
                  <span
                    className="font-medium block"
                    style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                  >
                    {metric.label}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: DISPLAY_COLORS.ui.text.muted }}
                  >
                    {metric.region}
                  </span>
                </div>
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
            全球网络状态
          </div>
          <div
            className="text-xs"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            所有区域连接正常
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 区域威胁分析面板
 */
function RegionalThreatPanel({ realTimeData }: { realTimeData: any }) {
  const threatLevel = realTimeData?.realTimeThreats || 3;

  const regionalThreats = useMemo(
    () => [
      { region: "亚太地区", level: 8, type: "APT攻击", count: 15 },
      { region: "北美地区", level: 6, type: "勒索软件", count: 12 },
      { region: "欧洲地区", level: 4, type: "DDoS攻击", count: 8 },
      { region: "其他地区", level: 3, type: "恶意软件", count: 5 },
    ],
    [],
  );

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
          <AlertTriangle
            className="w-6 h-6 mr-3"
            style={{ color: DISPLAY_COLORS.security.high }}
          />
          <h3
            className="text-lg font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            区域威胁分析
          </h3>
        </div>

        <div className="space-y-4">
          {regionalThreats.map((threat, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                borderColor: getThreatColor(threat.level),
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="font-medium"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  {threat.region}
                </span>
                <span
                  className="px-2 py-1 rounded text-xs font-bold"
                  style={{
                    color: getThreatColor(threat.level),
                    backgroundColor: DISPLAY_COLORS.ui.background.primary,
                  }}
                >
                  L{threat.level}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className="text-sm"
                  style={{ color: DISPLAY_COLORS.ui.text.muted }}
                >
                  {threat.type}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: getThreatColor(threat.level) }}
                >
                  {threat.count} 起
                </span>
              </div>
            </div>
          ))}
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
            威胁趋势分析
          </div>
          <div
            className="text-xs space-y-1"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            <div>• 亚太地区威胁活动增加</div>
            <div>• 勒索软件攻击频次上升</div>
            <div>• 建议加强防护措施</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 全球2D控制面板
 */
function Global2DPanel({
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

  const globalChartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${((new Date().getHours() - 23 + i) % 24).toString().padStart(2, "0")}:00`,
      threats: Math.floor(Math.random() * 15) + 2,
      attacks: Math.floor(Math.random() * 100) + 50,
      bandwidth: 30 + Math.random() * 40,
      connections: 100 + Math.random() * 200,
    }));
  }, []);

  const tabs = [
    { id: "overview", label: "全球概览", icon: Globe },
    { id: "regions", label: "区域分析", icon: MapPin },
    { id: "threats", label: "威胁情报", icon: Shield },
    { id: "connections", label: "网络连接", icon: Network },
    { id: "incidents", label: "安全事件", icon: AlertTriangle },
    { id: "reports", label: "情报报告", icon: FileText },
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
            全球控制台
          </h2>
          <p
            className="text-sm"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            Global Control Center
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
        className="flex border-b overflow-x-auto"
        style={{
          backgroundColor: DISPLAY_COLORS.ui.background.secondary,
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
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
          <GlobalOverviewTab
            realTimeData={realTimeData}
            chartData={globalChartData}
          />
        )}
        {activeTab === "regions" && <RegionalAnalysisTab />}
        {activeTab === "threats" && <ThreatIntelligenceTab />}
        {activeTab === "connections" && <NetworkConnectionsTab />}
        {activeTab === "incidents" && <SecurityIncidentsTab />}
        {activeTab === "reports" && <IntelligenceReportsTab />}
      </div>
    </div>
  );
}

/**
 * 全球概览标签页
 */
function GlobalOverviewTab({
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
            borderColor: DISPLAY_COLORS.security.high,
          }}
        >
          <div
            className="text-sm mb-1"
            style={{ color: DISPLAY_COLORS.security.high }}
          >
            全球威胁
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.realTimeThreats || 3}
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
            在线节点
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.onlineNodes || 47}
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
          全球威胁趋势
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
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
              <Area
                type="monotone"
                dataKey="attacks"
                stackId="1"
                stroke={DISPLAY_COLORS.security.high}
                fill={DISPLAY_COLORS.security.high}
                fillOpacity={0.3}
                name="攻击次数"
              />
              <RechartsLine
                type="monotone"
                dataKey="threats"
                stroke={DISPLAY_COLORS.security.critical}
                strokeWidth={3}
                name="威胁等级"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// 简化其他标签页组件
function RegionalAnalysisTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        区域安全分析
      </h3>
      <div className="space-y-3">
        {[
          { region: "亚太地区", threats: 18, status: "高风险" },
          { region: "北美地区", threats: 12, status: "中风险" },
          { region: "欧洲地区", threats: 8, status: "低风险" },
          { region: "其他地区", threats: 5, status: "正常" },
        ].map((region, index) => (
          <div
            key={index}
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.secondary,
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <span
                  className="font-medium"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  {region.region}
                </span>
                <div
                  className="text-sm"
                  style={{ color: DISPLAY_COLORS.ui.text.muted }}
                >
                  威胁数量: {region.threats}
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  color: getThreatColor(region.threats / 2),
                  backgroundColor: DISPLAY_COLORS.ui.background.primary,
                  border: `1px solid ${getThreatColor(region.threats / 2)}`,
                }}
              >
                {region.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreatIntelligenceTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        威胁情报
      </h3>
      <div className="space-y-2">
        {[
          { time: "14:23", threat: "APT组织活动检测", level: "critical" },
          { time: "14:15", threat: "勒索软件变种发现", level: "high" },
          { time: "14:08", threat: "钓鱼邮件攻击", level: "medium" },
          { time: "13:54", threat: "僵尸网络活动", level: "medium" },
        ].map((intel, index) => (
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
                {intel.threat}
              </span>
              <span
                className="text-xs"
                style={{ color: DISPLAY_COLORS.ui.text.muted }}
              >
                {intel.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkConnectionsTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        网络连接状态
      </h3>
      <div className="space-y-3">
        {[
          { connection: "北美-欧洲海缆", bandwidth: 95, status: "正常" },
          { connection: "亚太-北美海缆", bandwidth: 88, status: "正常" },
          { connection: "欧亚陆缆", bandwidth: 92, status: "正常" },
          { connection: "亚太内部连接", bandwidth: 76, status: "拥堵" },
        ].map((conn, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.secondary,
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-sm font-medium"
                style={{ color: DISPLAY_COLORS.ui.text.secondary }}
              >
                {conn.connection}
              </span>
              <span
                className="text-sm"
                style={{ color: getPerformanceColor(conn.bandwidth) }}
              >
                {conn.bandwidth}%
              </span>
            </div>
            <div
              className="w-full rounded-full h-2"
              style={{
                backgroundColor: DISPLAY_COLORS.ui.background.tertiary,
              }}
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${conn.bandwidth}%`,
                  backgroundColor: getPerformanceColor(conn.bandwidth),
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityIncidentsTab() {
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
          { time: "14:23", event: "大规模DDoS攻击", region: "亚太", level: 8 },
          { time: "14:15", event: "数据泄露事件", region: "北美", level: 7 },
          { time: "14:08", event: "恶意软件传播", region: "欧洲", level: 5 },
          { time: "13:54", event: "网络钓鱼活动", region: "全球", level: 6 },
        ].map((incident, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.secondary,
              borderColor: getThreatColor(incident.level),
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm font-medium"
                style={{ color: DISPLAY_COLORS.ui.text.secondary }}
              >
                {incident.event}
              </span>
              <span
                className="text-xs"
                style={{ color: DISPLAY_COLORS.ui.text.muted }}
              >
                {incident.time}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-xs"
                style={{ color: DISPLAY_COLORS.ui.text.muted }}
              >
                {incident.region}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: getThreatColor(incident.level) }}
              >
                L{incident.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntelligenceReportsTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        情报报告
      </h3>
      <div className="space-y-3">
        {[
          {
            title: "2024年第一季度全球威胁报告",
            date: "2024-01-15",
            type: "季度报告",
          },
          {
            title: "APT组织活动分析报告",
            date: "2024-01-14",
            type: "专题报告",
          },
          { title: "勒索软件趋势分析", date: "2024-01-13", type: "趋势报告" },
          { title: "网络安全态势周报", date: "2024-01-12", type: "周报" },
        ].map((report, index) => (
          <div
            key={index}
            className="rounded-lg p-4 border cursor-pointer hover:bg-opacity-80 transition-colors"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.secondary,
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            <div
              className="font-medium mb-1"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              {report.title}
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-xs"
                style={{ color: DISPLAY_COLORS.ui.text.muted }}
              >
                {report.date}
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  color: DISPLAY_COLORS.corporate.accent,
                  backgroundColor: DISPLAY_COLORS.ui.background.primary,
                }}
              >
                {report.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 全球态势顶部控制栏
 */
function GlobalTopControlBar({
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
                  CyberGuard 全球态势大屏
                </h1>
                <p
                  className="text-sm"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  Global Cybersecurity Situation Display Screen
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
              title="切换全球控制台"
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
 * 全球态势加载屏幕
 */
function GlobalLoadingScreen() {
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
          加载全球态势大屏
        </div>
        <div
          className="text-sm"
          style={{ color: DISPLAY_COLORS.ui.text.secondary }}
        >
          正在连接全球安全监控网络...
        </div>
      </div>
    </div>
  );
}

/**
 * 主组件 - 全球安全态势大屏
 * Main Component - Global Security Situation Display Screen
 */
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return <GlobalLoadingScreen />;
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      {/* 顶部控制栏 */}
      <GlobalTopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
      />

      {/* 3D全球场景容器 */}
      <div
        className={`absolute inset-0 pt-16 transition-all duration-300 ${
          is2DPanelVisible ? "pr-[520px]" : "pr-0"
        }`}
      >
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 40, 80],
              fov: 50,
              near: 0.1,
              far: 800,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <GlobalSecurityScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={30}
                maxDistance={200}
                dampingFactor={0.05}
                enableDamping
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 全球信息覆盖层 */}
      <GlobalInfoOverlay />

      {/* 2D全球控制面板 */}
      <Global2DPanel isVisible={is2DPanelVisible} onToggle={toggle2DPanel} />

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
          title="打开全球控制台"
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
            CyberGuard 全球网络安全态势大屏 v2.0
          </span>
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: DISPLAY_COLORS.status.active }}
            ></div>
            <span style={{ color: DISPLAY_COLORS.ui.text.secondary }}>
              全球监控正常
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
