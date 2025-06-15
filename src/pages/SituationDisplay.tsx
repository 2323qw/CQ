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
  Brain,
  Hexagon,
  Triangle,
  Square,
  Circle,
  Octagon,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Settings,
  Monitor,
  Volume2,
  VolumeX,
  Info,
  Clock,
  Gauge,
  Fingerprint,
  Lock,
  Unlock,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Power,
  Signal,
  Battery,
  Thermometer,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  getDataFlowColor,
  getTechLevelColor,
} from "@/lib/situationDisplayColors";
import {
  EnhancedQuantumTower,
  EnhancedNeuralCluster,
  EnhancedDataFlowSystem,
  EnhancedQuantumShields,
  EnhancedEnvironment,
} from "@/components/3d/EnhancedFuturisticComponents";

/**
 * 增强版3D态势监控场景
 * Enhanced 3D Situation Monitoring Scene
 */
function EnhancedCyberScene({ sceneConfig }: { sceneConfig: any }) {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  useFrame((state) => {
    if (sceneRef.current) {
      const time = state.clock.getElapsedTime();

      // 根据系统负载调整整体场景
      const systemLoad = realTimeData?.cpuUsage || 45;
      const threatLevel = realTimeData?.realTimeThreats || 3;

      // 高负载时场景微微震动
      if (systemLoad > 85) {
        sceneRef.current.position.x = Math.sin(time * 10) * 0.02;
        sceneRef.current.position.z = Math.cos(time * 8) * 0.02;
      } else {
        sceneRef.current.position.x = 0;
        sceneRef.current.position.z = 0;
      }

      // 威胁等级影响环境光效
      if (threatLevel > 7) {
        sceneRef.current.rotation.y += 0.001;
      }

      // 场景呼吸效果
      sceneRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.01);
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 增强版未来感环境基础设施 */}
      <EnhancedEnvironment />

      {/* 增强版量子中央监控塔 */}
      <EnhancedQuantumTower />

      {/* 增强版神经网络节点群 */}
      <EnhancedNeuralCluster />

      {/* 增强版数据流管道系统 */}
      <EnhancedDataFlowSystem />

      {/* 增强版量子防护屏障 */}
      <EnhancedQuantumShields />

      {/* 深空星域背景 - 增强版 */}
      <Stars
        radius={800}
        depth={150}
        count={sceneConfig.starCount}
        factor={4}
        saturation={0.3}
        fade
        speed={0.01}
      />
    </group>
  );
}

/**
 * 优化版信息覆盖层
 * Optimized Information Overlay
 */
function OptimizedInfoOverlay({
  sceneConfig,
  onConfigChange,
}: {
  sceneConfig: any;
  onConfigChange: (config: any) => void;
}) {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const advancedStats = useMemo(() => {
    const threats = realTimeData?.realTimeThreats || 3;
    const connections = realTimeData?.activeConnections || 8247;
    const bandwidth = realTimeData?.bandwidthUsage || 45;
    const nodes = realTimeData?.onlineNodes || 47;
    const cpuUsage = realTimeData?.cpuUsage || 68;
    const memoryUsage = realTimeData?.memoryUsage || 78;
    const networkLatency = realTimeData?.networkLatency || 23;

    return [
      {
        title: "量子威胁监控",
        subtitle: "Quantum Threat Detection",
        value: threats,
        unit: "个威胁",
        icon: Brain,
        color: getThreatColor(threats),
        change: "+3",
        trend: "up" as const,
        metric: "Neural Threats",
        percentage: Math.min((threats / 10) * 100, 100),
        status: threats > 7 ? "critical" : threats > 4 ? "warning" : "normal",
      },
      {
        title: "数据流量分析",
        subtitle: "Data Flow Analysis",
        value: `${Math.floor(connections / 1000)}K`,
        unit: "数据包/秒",
        icon: Hexagon,
        color: getDataFlowColor(bandwidth),
        change: "+2.5K",
        trend: "up" as const,
        metric: "Data Streams",
        percentage: Math.min((bandwidth / 100) * 100, 100),
        status: bandwidth > 85 ? "warning" : "normal",
      },
      {
        title: "神经网络节点",
        subtitle: "Neural Network Nodes",
        value: `${nodes}/50`,
        unit: "活跃节点",
        icon: Octagon,
        color: DISPLAY_COLORS.status.active,
        change: "+2",
        trend: "up" as const,
        metric: "Active Nodes",
        percentage: (nodes / 50) * 100,
        status: nodes > 45 ? "normal" : nodes > 35 ? "warning" : "critical",
      },
      {
        title: "系统运行效率",
        subtitle: "System Efficiency",
        value: `${100 - Math.max(cpuUsage, memoryUsage)}%`,
        unit: "运行效率",
        icon: Triangle,
        color: getPerformanceColor(100 - Math.max(cpuUsage, memoryUsage)),
        change: "+5%",
        trend: "up" as const,
        metric: "Efficiency",
        percentage: 100 - Math.max(cpuUsage, memoryUsage),
        status: cpuUsage > 85 || memoryUsage > 85 ? "critical" : "normal",
      },
    ];
  }, [realTimeData]);

  const systemHealth = useMemo(() => {
    const cpu = realTimeData?.cpuUsage || 68;
    const memory = realTimeData?.memoryUsage || 78;
    const network = realTimeData?.networkLatency || 23;
    const threats = realTimeData?.realTimeThreats || 3;

    const healthScore = Math.round(
      (100 - cpu) * 0.3 +
        (100 - memory) * 0.3 +
        (100 - network) * 0.2 +
        (10 - threats) * 10 * 0.2,
    );

    return {
      score: healthScore,
      status:
        healthScore > 80
          ? "excellent"
          : healthScore > 60
            ? "good"
            : healthScore > 40
              ? "warning"
              : "critical",
      color:
        healthScore > 80
          ? DISPLAY_COLORS.status.active
          : healthScore > 60
            ? DISPLAY_COLORS.network.access
            : healthScore > 40
              ? DISPLAY_COLORS.status.warning
              : DISPLAY_COLORS.status.critical,
    };
  }, [realTimeData]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 优化版顶部控制面板 */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="quantum-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center relative quantum-effect"
                  style={{
                    background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
                    boxShadow: `0 0 30px ${DISPLAY_COLORS.corporate.accent}60`,
                  }}
                >
                  <Brain className="w-8 h-8 text-white" />
                  <div
                    className="absolute inset-0 rounded-xl animate-pulse"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${DISPLAY_COLORS.corporate.accent}40, transparent)`,
                    }}
                  />
                </div>
                {/* 系统健康状态指示器 */}
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: systemHealth.color,
                    color: "white",
                    boxShadow: `0 0 10px ${systemHealth.color}60`,
                  }}
                >
                  {systemHealth.score}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold neon-text-blue mb-2 font-orbitron">
                  CyberGuard Quantum 态势监控中心
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-neon-green font-rajdhani">
                    Quantum Neural Network Monitoring Center
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                    <span className="text-neon-green font-mono">
                      神经网络运行正常
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-neon-blue" />
                    <span className="text-neon-blue font-mono">
                      系统健康度: {systemHealth.score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 quantum-card p-3 bg-matrix-deep/80">
                <Clock className="w-5 h-5 text-neon-cyan" />
                <div className="text-right">
                  <div className="text-sm font-mono text-neon-cyan">
                    {currentTime.toLocaleTimeString("zh-CN")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetailedStats(!showDetailedStats)}
                className="neural-button p-3"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 主要状态卡片 */}
          <div className="grid grid-cols-4 gap-6">
            {advancedStats.map((stat, index) => (
              <EnhancedStatusCard key={index} {...stat} />
            ))}
          </div>

          {/* 详细统计信息 */}
          {showDetailedStats && (
            <div className="mt-6 grid grid-cols-6 gap-4">
              <DetailedMetricCard
                title="CPU使用率"
                value={realTimeData?.cpuUsage || 68}
                unit="%"
                icon={Cpu}
                color={getPerformanceColor(realTimeData?.cpuUsage || 68)}
              />
              <DetailedMetricCard
                title="内存使用"
                value={realTimeData?.memoryUsage || 78}
                unit="%"
                icon={Database}
                color={getPerformanceColor(realTimeData?.memoryUsage || 78)}
              />
              <DetailedMetricCard
                title="网络延迟"
                value={realTimeData?.networkLatency || 23}
                unit="ms"
                icon={Wifi}
                color={DISPLAY_COLORS.network.access}
              />
              <DetailedMetricCard
                title="温度监控"
                value={42}
                unit="°C"
                icon={Thermometer}
                color={DISPLAY_COLORS.status.normal}
              />
              <DetailedMetricCard
                title="功耗监控"
                value={85}
                unit="W"
                icon={Battery}
                color={DISPLAY_COLORS.network.distribution}
              />
              <DetailedMetricCard
                title="信号强度"
                value={96}
                unit="%"
                icon={Signal}
                color={DISPLAY_COLORS.status.active}
              />
            </div>
          )}
        </div>
      </div>

      {/* 左侧增强神经网络监控面板 */}
      <EnhancedNeuralPanel realTimeData={realTimeData} />

      {/* 右侧增强量子威胁分析面板 */}
      <EnhancedThreatPanel realTimeData={realTimeData} />
    </div>
  );
}

/**
 * 增强版状态卡片
 */
function EnhancedStatusCard({
  title,
  subtitle,
  value,
  unit,
  icon: Icon,
  color,
  change,
  trend,
  metric,
  percentage,
  status,
}: {
  title: string;
  subtitle: string;
  value: string | number;
  unit: string;
  icon: any;
  color: string;
  change: string;
  trend: "up" | "down";
  metric: string;
  percentage: number;
  status: "normal" | "warning" | "critical" | "excellent";
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor =
    trend === "up"
      ? DISPLAY_COLORS.status.active
      : DISPLAY_COLORS.status.warning;

  const statusColor = {
    excellent: DISPLAY_COLORS.status.active,
    normal: DISPLAY_COLORS.network.access,
    warning: DISPLAY_COLORS.status.warning,
    critical: DISPLAY_COLORS.status.critical,
  }[status];

  return (
    <div
      className="quantum-card p-5 relative overflow-hidden transition-all duration-500 hover:scale-105"
      style={{
        borderColor: color,
        minHeight: "160px",
      }}
    >
      {/* 状态指示光带 */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}80, ${color})`,
          boxShadow: `0 0 10px ${color}60`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-xl relative group"
            style={{
              backgroundColor: `${color}15`,
              border: `2px solid ${color}40`,
              boxShadow: `0 0 20px ${color}30`,
            }}
          >
            <Icon
              className="w-8 h-8 neon-text transition-transform group-hover:scale-110"
              style={{ color }}
            />
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(45deg, transparent, ${color}20, transparent)`,
                animation: "pulse 2s infinite",
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="flex items-center text-xs font-mono px-2 py-1 rounded-full"
              style={{
                color: trendColor,
                backgroundColor: `${trendColor}20`,
                border: `1px solid ${trendColor}40`,
              }}
            >
              <TrendIcon className="w-3 h-3 mr-1" />
              <span>{change}</span>
            </div>
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${statusColor}60`,
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end">
          <div className="text-right mb-3">
            <div
              className="text-4xl font-bold mb-1 font-orbitron neon-text"
              style={{
                color,
                textShadow: `0 0 20px ${color}80, 0 0 40px ${color}60`,
              }}
            >
              {value}
            </div>
            <div className="text-xs text-muted-foreground font-mono mb-1">
              {unit}
            </div>
          </div>

          <div className="mb-3">
            <div
              className="text-base font-bold mb-1"
              style={{ color: DISPLAY_COLORS.ui.text.primary }}
            >
              {title}
            </div>
            <div
              className="text-xs font-rajdhani opacity-80"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              {subtitle}
            </div>
          </div>

          {/* 进度条 */}
          <div
            className="quantum-progress mb-2"
            style={{ borderColor: `${color}40` }}
          >
            <div
              className="quantum-progress-fill"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                background: `linear-gradient(90deg, ${color}, ${color}80)`,
                boxShadow: `0 0 15px ${color}60`,
              }}
            />
          </div>

          <div
            className="text-xs font-mono text-center opacity-60"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            {metric}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 详细指标卡片
 */
function DetailedMetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  unit: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      className="neural-card p-4 text-center transition-all duration-300 hover:scale-105"
      style={{ borderColor: `${color}30` }}
    >
      <Icon className="w-6 h-6 mx-auto mb-2 neon-text" style={{ color }} />
      <div
        className="text-lg font-bold font-mono neon-text mb-1"
        style={{ color }}
      >
        {value}
        {unit}
      </div>
      <div className="text-xs text-muted-foreground font-rajdhani">{title}</div>
    </div>
  );
}

/**
 * 增强版神经网络监控面板
 */
function EnhancedNeuralPanel({ realTimeData }: { realTimeData: any }) {
  const [activeTab, setActiveTab] = useState("metrics");

  const neuralMetrics = useMemo(
    () => [
      {
        label: "神经传输延迟",
        subLabel: "Neural Transmission",
        value: realTimeData?.networkLatency || 23,
        color: DISPLAY_COLORS.network.access,
        unit: "ms",
        max: 100,
        status: "normal",
      },
      {
        label: "处理器负载",
        subLabel: "CPU Processing Load",
        value: realTimeData?.cpuUsage || 68,
        color: getPerformanceColor(realTimeData?.cpuUsage || 68),
        unit: "%",
        max: 100,
        status: realTimeData?.cpuUsage > 85 ? "critical" : "normal",
      },
      {
        label: "量子带宽使用",
        subLabel: "Quantum Bandwidth",
        value: realTimeData?.bandwidthUsage || 45,
        color: DISPLAY_COLORS.network.distribution,
        unit: "%",
        max: 100,
        status: "normal",
      },
      {
        label: "神经同步率",
        subLabel: "Neural Sync Rate",
        value: realTimeData?.memoryUsage || 78,
        color: getPerformanceColor(realTimeData?.memoryUsage || 78),
        unit: "%",
        max: 100,
        status: realTimeData?.memoryUsage > 85 ? "warning" : "normal",
      },
    ],
    [realTimeData],
  );

  const tabs = [
    { id: "metrics", label: "指标", icon: Gauge },
    { id: "network", label: "网络", icon: Network },
    { id: "security", label: "安全", icon: Shield },
  ];

  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div
        className="quantum-card p-6"
        style={{
          width: "380px",
          maxHeight: "500px",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain
              className="w-7 h-7 neon-text"
              style={{
                color: DISPLAY_COLORS.corporate.accent,
                filter: `drop-shadow(0 0 8px ${DISPLAY_COLORS.corporate.accent})`,
              }}
            />
            <div>
              <h3 className="text-lg font-bold font-orbitron neon-text-blue">
                神经网络监控
              </h3>
              <p className="text-xs text-muted-foreground font-rajdhani">
                Neural Network Monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs text-neon-green font-mono">在线</span>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "quantum-button"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        {activeTab === "metrics" && (
          <div className="space-y-5">
            {neuralMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center text-sm mb-3">
                  <div className="flex-1">
                    <span
                      className="font-medium block"
                      style={{ color: DISPLAY_COLORS.ui.text.primary }}
                    >
                      {metric.label}
                    </span>
                    <span
                      className="text-xs font-rajdhani opacity-80"
                      style={{ color: DISPLAY_COLORS.ui.text.muted }}
                    >
                      {metric.subLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-bold text-xl font-orbitron neon-text"
                      style={{
                        color: metric.color,
                        textShadow: `0 0 8px ${metric.color}60`,
                      }}
                    >
                      {metric.value}
                    </span>
                    <span
                      className="text-xs ml-1"
                      style={{ color: metric.color }}
                    >
                      {metric.unit}
                    </span>
                  </div>
                </div>

                {/* 增强进度条 */}
                <div
                  className="neural-progress"
                  style={{ borderColor: `${metric.color}40` }}
                >
                  <div
                    className="neural-progress-fill"
                    style={{
                      width: `${Math.min(metric.value, metric.max)}%`,
                      background: `linear-gradient(90deg, ${metric.color}, ${metric.color}80)`,
                      boxShadow: `0 0 15px ${metric.color}60`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mt-2 text-xs">
                  <span style={{ color: DISPLAY_COLORS.ui.text.muted }}>
                    0 {metric.unit}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full font-mono ${
                      metric.status === "critical"
                        ? "text-neon-red bg-neon-red/20"
                        : metric.status === "warning"
                          ? "text-neon-orange bg-neon-orange/20"
                          : "text-neon-green bg-neon-green/20"
                    }`}
                  >
                    {metric.status === "critical"
                      ? "危险"
                      : metric.status === "warning"
                        ? "警告"
                        : "正常"}
                  </span>
                  <span style={{ color: DISPLAY_COLORS.ui.text.muted }}>
                    {metric.max} {metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "network" && <NetworkTabContent />}
        {activeTab === "security" && <SecurityTabContent />}

        {/* 底部状态 */}
        <div
          className="mt-6 p-4 rounded-lg border neural-effect"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: DISPLAY_COLORS.status.active,
            boxShadow: `0 0 15px ${DISPLAY_COLORS.status.active}20`,
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="text-sm font-medium"
              style={{ color: DISPLAY_COLORS.status.active }}
            >
              神经网络状态
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: DISPLAY_COLORS.ui.text.muted }}
            >
              所有神经元节点正常运行
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkTabContent() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Network className="w-12 h-12 mx-auto mb-4 text-neon-blue opacity-60" />
        <p className="text-muted-foreground">网络拓扑分析</p>
      </div>
    </div>
  );
}

function SecurityTabContent() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Shield className="w-12 h-12 mx-auto mb-4 text-neon-green opacity-60" />
        <p className="text-muted-foreground">安全状态监控</p>
      </div>
    </div>
  );
}

/**
 * 增强版量子威胁分析面板
 */
function EnhancedThreatPanel({ realTimeData }: { realTimeData: any }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const quantumThreats = useMemo(
    () => [
      {
        id: "QT-001",
        type: "量子干扰攻击",
        typeEn: "Quantum Interference",
        level: 9,
        frequency: "14.2THz",
        source: "深空未知信号",
        sourceEn: "Deep Space Unknown",
        timestamp: "14:23:45",
        status: "active",
        impact: "高",
      },
      {
        id: "NT-002",
        type: "神经病毒入侵",
        typeEn: "Neural Virus Intrusion",
        level: 7,
        frequency: "8.7GHz",
        source: "AI实体网络",
        sourceEn: "AI Entity Network",
        timestamp: "14:22:12",
        status: "contained",
        impact: "中",
      },
      {
        id: "SA-003",
        type: "时空异常探测",
        typeEn: "Spacetime Anomaly",
        level: 5,
        frequency: "2.1MHz",
        source: "维度裂缝监测",
        sourceEn: "Dimensional Rift",
        timestamp: "14:20:38",
        status: "monitoring",
        impact: "低",
      },
      {
        id: "CI-004",
        type: "意识入侵尝试",
        typeEn: "Consciousness Intrusion",
        level: 6,
        frequency: "40Hz",
        source: "超级AI实体",
        sourceEn: "Super AI Entity",
        timestamp: "14:19:55",
        status: "blocked",
        impact: "中",
      },
    ],
    [activeFilter],
  );

  const filterOptions = [
    { id: "all", label: "全部", count: quantumThreats.length },
    {
      id: "critical",
      label: "严重",
      count: quantumThreats.filter((t) => t.level >= 8).length,
    },
    {
      id: "active",
      label: "活跃",
      count: quantumThreats.filter((t) => t.status === "active").length,
    },
  ];

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div
        className="quantum-card p-6"
        style={{
          width: "380px",
          maxHeight: "500px",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap
              className="w-7 h-7 neon-text"
              style={{
                color: DISPLAY_COLORS.security.high,
                filter: `drop-shadow(0 0 8px ${DISPLAY_COLORS.security.high})`,
              }}
            />
            <div>
              <h3 className="text-lg font-bold font-orbitron neon-text-purple">
                量子威胁分析
              </h3>
              <p className="text-xs text-muted-foreground font-rajdhani">
                Quantum Threat Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-neon-orange" />
            <span className="text-neon-orange font-mono text-sm">
              {quantumThreats.filter((t) => t.level >= 7).length}
            </span>
          </div>
        </div>

        {/* 威胁过滤器 */}
        <div className="flex space-x-1 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveFilter(option.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeFilter === option.id
                  ? "quantum-button"
                  : "text-muted-foreground hover:text-white bg-matrix-accent/30"
              }`}
            >
              <span>{option.label}</span>
              <span
                className="px-1.5 py-0.5 rounded-full bg-matrix-surface text-xs"
                style={{
                  color:
                    activeFilter === option.id
                      ? DISPLAY_COLORS.corporate.accent
                      : DISPLAY_COLORS.ui.text.muted,
                }}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* 威胁列表 */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {quantumThreats.map((threat, index) => (
            <div
              key={index}
              className="neural-card p-4 hover:scale-102 transition-transform cursor-pointer"
              style={{
                borderColor: getThreatColor(threat.level),
                backgroundColor: `${getThreatColor(threat.level)}05`,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className="text-sm font-bold"
                      style={{ color: DISPLAY_COLORS.ui.text.primary }}
                    >
                      {threat.type}
                    </span>
                    <span
                      className="text-xs font-mono px-2 py-1 rounded-full border"
                      style={{
                        color: getThreatColor(threat.level),
                        backgroundColor: `${getThreatColor(threat.level)}20`,
                        borderColor: getThreatColor(threat.level),
                      }}
                    >
                      L{threat.level}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-rajdhani mb-2">
                    {threat.typeEn}
                  </p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    threat.status === "active"
                      ? "bg-neon-red"
                      : threat.status === "contained"
                        ? "bg-neon-orange"
                        : threat.status === "blocked"
                          ? "bg-neon-green"
                          : "bg-neon-blue"
                  }`}
                  style={{
                    boxShadow:
                      threat.status === "active"
                        ? `0 0 8px ${DISPLAY_COLORS.neon.red}`
                        : threat.status === "contained"
                          ? `0 0 8px ${DISPLAY_COLORS.neon.orange}`
                          : threat.status === "blocked"
                            ? `0 0 8px ${DISPLAY_COLORS.neon.green}`
                            : `0 0 8px ${DISPLAY_COLORS.neon.blue}`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">频率</span>
                  <span
                    className="font-mono"
                    style={{ color: DISPLAY_COLORS.network.access }}
                  >
                    {threat.frequency}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">时间</span>
                  <span
                    className="font-mono"
                    style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                  >
                    {threat.timestamp}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">来源</span>
                  <span
                    className="font-medium"
                    style={{ color: getThreatColor(threat.level) }}
                  >
                    {threat.source}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">影响</span>
                  <span
                    className={`font-bold ${
                      threat.impact === "高"
                        ? "text-neon-red"
                        : threat.impact === "中"
                          ? "text-neon-orange"
                          : "text-neon-green"
                    }`}
                  >
                    {threat.impact}
                  </span>
                </div>
              </div>

              {/* 威胁ID */}
              <div className="mt-3 pt-3 border-t border-matrix-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-muted-foreground">
                    ID: {threat.id}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded ${
                      threat.status === "active"
                        ? "bg-neon-red/20 text-neon-red"
                        : threat.status === "contained"
                          ? "bg-neon-orange/20 text-neon-orange"
                          : threat.status === "blocked"
                            ? "bg-neon-green/20 text-neon-green"
                            : "bg-neon-blue/20 text-neon-blue"
                    }`}
                  >
                    {threat.status === "active"
                      ? "活跃"
                      : threat.status === "contained"
                        ? "控制"
                        : threat.status === "blocked"
                          ? "阻止"
                          : "监控"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部量子防护状态 */}
        <div
          className="mt-6 p-4 rounded-lg border quantum-effect"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: DISPLAY_COLORS.ui.border.primary,
          }}
        >
          <div
            className="text-sm font-medium mb-2"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            量子防护系统状态
          </div>
          <div
            className="text-xs space-y-1 font-mono"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            <div className="flex justify-between">
              <span>• 量子加密屏障</span>
              <span className="text-neon-green">已激活</span>
            </div>
            <div className="flex justify-between">
              <span>• 神经防火墙</span>
              <span className="text-neon-green">正常运行</span>
            </div>
            <div className="flex justify-between">
              <span>• 时空稳定器</span>
              <span className="text-neon-blue">监控中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 优化版2D控制面板
 */
function Optimized2DPanel({
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

  const tabs = [
    { id: "overview", label: "总览", icon: Activity },
    { id: "network", label: "网络", icon: Network },
    { id: "security", label: "安全", icon: Shield },
    { id: "analysis", label: "分析", icon: BarChart3 },
    { id: "logs", label: "日志", icon: FileText },
    { id: "settings", label: "设置", icon: Settings },
  ];

  return (
    <div
      className={`fixed right-0 top-0 bottom-0 border-l transform transition-transform duration-500 z-40 quantum-card ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        width: "600px",
        borderColor: DISPLAY_COLORS.corporate.accent,
        backgroundColor: "rgba(10, 14, 26, 0.95)",
      }}
    >
      {/* 优化版头部 */}
      <div
        className="flex items-center justify-between p-6 border-b neural-effect"
        style={{
          borderColor: DISPLAY_COLORS.corporate.accent,
        }}
      >
        <div>
          <h2 className="text-2xl font-bold font-orbitron neon-text-blue">
            量子控制台
          </h2>
          <p className="text-sm font-rajdhani text-muted-foreground">
            Quantum Control Interface
          </p>
        </div>
        <button onClick={onToggle} className="quantum-button p-3">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 优化版标签页 */}
      <div
        className="flex border-b overflow-x-auto"
        style={{
          backgroundColor: "rgba(30, 41, 55, 0.7)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center justify-center space-x-3 py-4 px-6 text-sm font-medium font-rajdhani transition-all duration-300 ${
              activeTab === tab.id
                ? "quantum-button"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div
        className="p-6 overflow-y-auto"
        style={{
          height: "calc(100vh - 140px)",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        }}
      >
        {activeTab === "overview" && (
          <OverviewTabContent realTimeData={realTimeData} />
        )}
        {activeTab === "network" && <NetworkTabContent />}
        {activeTab === "security" && <SecurityTabContent />}
        {activeTab === "analysis" && <AnalysisTabContent />}
        {activeTab === "logs" && <LogsTabContent />}
        {activeTab === "settings" && <SettingsTabContent />}
      </div>
    </div>
  );
}

function OverviewTabContent({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-blue">
        系统总览
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="quantum-card p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Cpu className="w-6 h-6 text-neon-blue" />
            <span className="font-medium">处理器状态</span>
          </div>
          <div className="text-2xl font-bold font-mono neon-text-blue">
            {realTimeData?.cpuUsage || 68}%
          </div>
        </div>

        <div className="quantum-card p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Database className="w-6 h-6 text-neon-green" />
            <span className="font-medium">内存使用</span>
          </div>
          <div className="text-2xl font-bold font-mono neon-text-green">
            {realTimeData?.memoryUsage || 78}%
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisTabContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-purple">
        数据分析
      </h3>
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-neon-purple opacity-60" />
        <p className="text-muted-foreground">数据分析模块</p>
      </div>
    </div>
  );
}

function LogsTabContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-green">
        系统日志
      </h3>
      <div
        className="rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: DISPLAY_COLORS.status.active,
          border: `1px solid ${DISPLAY_COLORS.ui.border.primary}`,
        }}
      >
        <div className="space-y-1">
          <div>[2024-01-15 14:23:45] INFO: 神经网络初始化完成</div>
          <div>[2024-01-15 14:23:46] INFO: 量子加密通道建立</div>
          <div>[2024-01-15 14:23:47] INFO: 数据流监控启动</div>
          <div style={{ color: DISPLAY_COLORS.security.medium }}>
            [2024-01-15 14:23:48] WARN: 检测到异常量子波动
          </div>
          <div>[2024-01-15 14:23:49] INFO: 威胁已自动隔离</div>
          <div>[2024-01-15 14:23:50] INFO: 系统状态正常</div>
        </div>
      </div>
    </div>
  );
}

function SettingsTabContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-orange">
        系统设置
      </h3>
      <div className="text-center py-12">
        <Settings className="w-16 h-16 mx-auto mb-4 text-neon-orange opacity-60" />
        <p className="text-muted-foreground">系统配置面板</p>
      </div>
    </div>
  );
}

/**
 * 优化版顶部控制栏
 */
function OptimizedTopControlBar({
  onToggle2DPanel,
  is2DPanelVisible,
  sceneConfig,
  onConfigChange,
}: {
  onToggle2DPanel: () => void;
  is2DPanelVisible: boolean;
  sceneConfig: any;
  onConfigChange: (config: any) => void;
}) {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 z-50 border-b backdrop-blur-md quantum-card"
      style={{
        height: "72px",
        borderColor: DISPLAY_COLORS.corporate.accent,
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="neural-button px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-rajdhani">返回</span>
            </button>

            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center quantum-effect"
                style={{
                  background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
                  boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}60`,
                }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-orbitron neon-text-blue">
                  CyberGuard 神经监控中心
                </h1>
                <p className="text-xs font-rajdhani text-muted-foreground">
                  Neural Cyber Monitoring Center
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 控制按钮组 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="quantum-button p-2"
                title={isPaused ? "恢复" : "暂停"}
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="quantum-button p-2"
                title={isMuted ? "取消静音" : "静音"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleFullscreen}
                className="quantum-button p-2"
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="quantum-button p-2"
                title="刷新"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onToggle2DPanel}
              className={`quantum-button p-3 ${is2DPanelVisible ? "bg-neon-blue/20" : ""}`}
              title="切换量子控制台"
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
 * 优化版加载屏幕
 */
function OptimizedLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("初始化系统");

  const loadingSteps = [
    "初始化系统",
    "启动量子引擎",
    "建立神经连接",
    "加载威胁数据库",
    "启动防护屏障",
    "完成启动序列",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepIndex < loadingSteps.length) {
          setCurrentStep(loadingSteps[stepIndex]);
        }
        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div
            className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto relative quantum-effect"
            style={{
              background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
              boxShadow: `0 0 40px ${DISPLAY_COLORS.corporate.accent}60`,
            }}
          >
            <Brain className="w-12 h-12 text-white animate-pulse" />
            <div
              className="absolute inset-0 rounded-xl animate-spin"
              style={{
                border: `3px solid transparent`,
                borderTop: `3px solid ${DISPLAY_COLORS.corporate.accent}`,
              }}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold mb-3 font-orbitron neon-text-blue">
            正在启动神经网络监控中心
          </div>
          <div className="text-sm font-rajdhani text-muted-foreground animate-pulse">
            Neural Network Initialization...
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-4">
          <div
            className="quantum-progress h-3"
            style={{ borderColor: `${DISPLAY_COLORS.corporate.accent}40` }}
          >
            <div
              className="quantum-progress-fill h-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
                boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}60`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono">
            <span className="text-muted-foreground">{currentStep}</span>
            <span className="text-neon-blue">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 状态指示器 */}
        <div className="flex justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-neon-green font-mono">量子引擎</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
            <span className="text-neon-blue font-mono">神经网络</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
            <span className="text-neon-purple font-mono">防护系统</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 主组件 - 优化版未来感网络监控中心
 * Main Component - Optimized Futuristic Cyber Monitoring Center
 */
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);
  const [sceneConfig, setSceneConfig] = useState({
    starCount: 4000,
    autoRotate: true,
    rotateSpeed: 0.15,
    quality: "high",
    effectsEnabled: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  const handleConfigChange = useCallback((newConfig: any) => {
    setSceneConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  if (isLoading) {
    return <OptimizedLoadingScreen />;
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden matrix-background"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      {/* 优化版顶部控制栏 */}
      <OptimizedTopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
        sceneConfig={sceneConfig}
        onConfigChange={handleConfigChange}
      />

      {/* 3D未来场景容器 */}
      <div
        className={`absolute inset-0 transition-all duration-500`}
        style={{
          top: "72px",
          right: is2DPanelVisible ? "600px" : "0",
        }}
      >
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 40, 70],
              fov: 70,
              near: 0.1,
              far: 1500,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: true,
              logarithmicDepthBuffer: true,
            }}
            shadows
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <EnhancedCyberScene sceneConfig={sceneConfig} />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={30}
                maxDistance={250}
                dampingFactor={0.08}
                enableDamping
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate={sceneConfig.autoRotate}
                autoRotateSpeed={sceneConfig.rotateSpeed}
                rotateSpeed={0.8}
                panSpeed={1.2}
                zoomSpeed={1.5}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 优化版信息覆盖层 */}
      <OptimizedInfoOverlay
        sceneConfig={sceneConfig}
        onConfigChange={handleConfigChange}
      />

      {/* 优化版2D控制面板 */}
      <Optimized2DPanel isVisible={is2DPanelVisible} onToggle={toggle2DPanel} />

      {/* 面板切换按钮 */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 quantum-button p-4 rounded-l-xl"
          title="打开量子控制台"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* 底部状态栏 */}
      <div
        className={`absolute bottom-0 left-0 border-t backdrop-blur-md transition-all duration-500`}
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
          right: is2DPanelVisible ? "600px" : "0",
          height: "48px",
          boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}20`,
        }}
      >
        <div className="flex justify-between items-center h-full px-6 text-sm font-rajdhani">
          <div className="flex items-center space-x-6">
            <span className="font-medium text-white">
              CyberGuard 神经网络监控中心 v4.0
            </span>
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-neon-green" />
              <span className="text-neon-green">系统运行正常</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: DISPLAY_COLORS.status.active,
                  boxShadow: `0 0 8px ${DISPLAY_COLORS.status.active}`,
                }}
              ></div>
              <span style={{ color: DISPLAY_COLORS.status.active }}>
                量子引擎在线
              </span>
            </div>
            <div className="text-muted-foreground">|</div>
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3 text-neon-blue" />
              <span style={{ color: DISPLAY_COLORS.network.access }}>
                神经网络活跃
              </span>
            </div>
            <div className="text-muted-foreground">|</div>
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-neon-purple" />
              <span style={{ color: DISPLAY_COLORS.security.safe }}>
                防护系统激活
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
