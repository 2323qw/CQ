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
  MousePointer2,
  Move3D,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Home,
  Bookmark,
  Camera,
  Video,
  Mic,
  MicOff,
  Fullscreen,
  ScreenShare,
  Cast,
  Gamepad2,
  Command,
  Code,
  Terminal,
  Bug,
  Wrench,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Stars as StarsIcon,
  CloudSnow,
  Wind,
  Waves,
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
  ScatterChart,
  Scatter,
  TreemapChart,
  Treemap,
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
  getStatusColor,
} from "@/lib/situationDisplayColors";
import {
  EnhancedQuantumTower,
  EnhancedNeuralCluster,
  EnhancedDataFlowSystem,
  EnhancedQuantumShields,
  EnhancedEnvironment,
} from "@/components/3d/EnhancedFuturisticComponents";

/**
 * 高级3D态势监控场景
 * Advanced 3D Situation Monitoring Scene
 */
function AdvancedCyberScene({
  sceneConfig,
  selectedNode,
  onNodeSelect,
}: {
  sceneConfig: any;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}) {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: sceneConfig.updateInterval || 2000,
    enabled: !sceneConfig.isPaused,
  });

  useFrame((state) => {
    if (sceneRef.current && !sceneConfig.isPaused) {
      const time = state.clock.getElapsedTime();

      // 根据系统负载调整整体场景
      const systemLoad = realTimeData?.cpuUsage || 45;
      const threatLevel = realTimeData?.realTimeThreats || 3;

      // 动态环境响应
      if (sceneConfig.dynamicEnvironment) {
        // 高负载时场景微震动
        if (systemLoad > 85) {
          sceneRef.current.position.x = Math.sin(time * 10) * 0.02;
          sceneRef.current.position.z = Math.cos(time * 8) * 0.02;
        } else {
          sceneRef.current.position.x = 0;
          sceneRef.current.position.z = 0;
        }

        // 威胁等级影响环境
        if (threatLevel > 7) {
          sceneRef.current.rotation.y += 0.001;
        }

        // 场景呼吸效果
        if (sceneConfig.breathingEffect) {
          sceneRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.01);
        }
      }
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

      {/* 深空星域背景 - 可配置 */}
      <Stars
        radius={sceneConfig.starRadius || 800}
        depth={sceneConfig.starDepth || 150}
        count={sceneConfig.starCount}
        factor={sceneConfig.starFactor || 4}
        saturation={sceneConfig.starSaturation || 0.3}
        fade
        speed={sceneConfig.starSpeed || 0.01}
      />

      {/* 环境粒子效果 */}
      {sceneConfig.particleEffects && (
        <EnvironmentalEffects config={sceneConfig} />
      )}
    </group>
  );
}

/**
 * 环境粒子效果组件
 */
function EnvironmentalEffects({ config }: { config: any }) {
  const effectsRef = useRef<Group>(null);

  useFrame((state) => {
    if (effectsRef.current) {
      const time = state.clock.getElapsedTime();
      effectsRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={effectsRef}>
      {/* 数据粒子流 */}
      {config.dataParticles && <DataParticleStream />}

      {/* 能量波动 */}
      {config.energyWaves && <EnergyWaveEffect />}

      {/* 量子涟漪 */}
      {config.quantumRipples && <QuantumRippleEffect />}
    </group>
  );
}

function DataParticleStream() {
  // 数据粒子流实现
  return <group />;
}

function EnergyWaveEffect() {
  // 能量波动实现
  return <group />;
}

function QuantumRippleEffect() {
  // 量子涟漪实现
  return <group />;
}

/**
 * 高级信息覆盖层
 * Advanced Information Overlay
 */
function AdvancedInfoOverlay({
  sceneConfig,
  onConfigChange,
  selectedNode,
  onNodeSelect,
}: {
  sceneConfig: any;
  onConfigChange: (config: any) => void;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}) {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: !sceneConfig.isPaused,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [alertLevel, setAlertLevel] = useState("normal");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 智能威胁警报系统
  useEffect(() => {
    const threats = realTimeData?.realTimeThreats || 0;
    if (threats > 8) {
      setAlertLevel("critical");
    } else if (threats > 5) {
      setAlertLevel("high");
    } else if (threats > 3) {
      setAlertLevel("medium");
    } else {
      setAlertLevel("normal");
    }
  }, [realTimeData?.realTimeThreats]);

  const enhancedStats = useMemo(() => {
    const threats = realTimeData?.realTimeThreats || 3;
    const connections = realTimeData?.activeConnections || 8247;
    const bandwidth = realTimeData?.bandwidthUsage || 45;
    const nodes = realTimeData?.onlineNodes || 47;
    const cpuUsage = realTimeData?.cpuUsage || 68;
    const memoryUsage = realTimeData?.memoryUsage || 78;
    const networkLatency = realTimeData?.networkLatency || 23;

    return [
      {
        id: "threats",
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
        details: {
          active: Math.floor(threats * 0.6),
          contained: Math.floor(threats * 0.3),
          resolved: Math.floor(threats * 0.1),
        },
      },
      {
        id: "dataflow",
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
        details: {
          incoming: Math.floor(connections * 0.6),
          outgoing: Math.floor(connections * 0.4),
          peak: Math.floor(connections * 1.2),
        },
      },
      {
        id: "nodes",
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
        details: {
          cores: Math.floor(nodes * 0.2),
          processing: Math.floor(nodes * 0.5),
          standby: Math.floor(nodes * 0.3),
        },
      },
      {
        id: "efficiency",
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
        details: {
          cpu: cpuUsage,
          memory: memoryUsage,
          network: networkLatency,
        },
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
      score: Math.max(0, healthScore),
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
      {/* 高级顶部控制面板 */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div
          className={`quantum-card p-6 ${alertLevel !== "normal" ? "border-threat-critical" : ""}`}
          style={{
            backgroundColor: "rgba(10, 14, 26, 0.95)",
            borderColor:
              alertLevel === "critical"
                ? DISPLAY_COLORS.status.critical
                : DISPLAY_COLORS.corporate.accent,
          }}
        >
          {/* 威胁警报横幅 */}
          {alertLevel !== "normal" && (
            <div
              className="mb-4 p-3 rounded-lg border-l-4 flex items-center space-x-3"
              style={{
                backgroundColor: `${DISPLAY_COLORS.status.critical}10`,
                borderLeftColor: DISPLAY_COLORS.status.critical,
              }}
            >
              <AlertTriangle
                className="w-5 h-5"
                style={{ color: DISPLAY_COLORS.status.critical }}
              />
              <div>
                <div
                  className="font-bold"
                  style={{ color: DISPLAY_COLORS.status.critical }}
                >
                  {alertLevel === "critical"
                    ? "紧急威胁警报"
                    : alertLevel === "high"
                      ? "高危威胁检测"
                      : "威胁监控提醒"}
                </div>
                <div className="text-sm text-muted-foreground">
                  检测到多个高危量子威胁，建议立即采取防护措施
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div
                className="text-2xl font-bold font-orbitron neon-text"
                style={{ color: DISPLAY_COLORS.corporate.accent }}
              >
                CyberGuard 神经网络监控中心
              </div>
              <div className="flex items-center space-x-4 text-sm font-rajdhani">
                <div
                  className="text-muted-foreground"
                  style={{ color: DISPLAY_COLORS.ui.text.muted }}
                >
                  {currentTime.toLocaleString("zh-CN")}
                </div>
                <div
                  className="flex items-center space-x-2 font-mono"
                  style={{ color: systemHealth.color }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: systemHealth.color }}
                  />
                  <span>系统健康度: {systemHealth.score}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDetailedStats(!showDetailedStats)}
                className={`neural-button px-4 py-2 ${
                  showDetailedStats ? "bg-neon-blue/20" : ""
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                详细统计
              </button>
              <button
                onClick={() => setShowMiniMap(!showMiniMap)}
                className={`neural-button px-4 py-2 ${
                  showMiniMap ? "bg-neon-green/20" : ""
                }`}
              >
                <Map className="w-4 h-4 mr-2" />
                拓扑图
              </button>
            </div>
          </div>

          {/* 关键状态指标 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {enhancedStats.map((stat) => (
              <AdvancedStatusCard
                key={stat.id}
                {...stat}
                isSelected={selectedNode === stat.id}
                onClick={() =>
                  onNodeSelect(selectedNode === stat.id ? null : stat.id)
                }
              />
            ))}
          </div>

          {/* 详细统计展开面板 */}
          {showDetailedStats && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="quantum-card p-4">
                <h4 className="text-lg font-bold mb-4 neon-text-blue">
                  实时系统指标
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailedMetricCard
                    title="CPU 使用率"
                    value={realTimeData?.cpuUsage || 68}
                    unit="%"
                    icon={Cpu}
                    color={getPerformanceColor(realTimeData?.cpuUsage || 68)}
                  />
                  <DetailedMetricCard
                    title="内存使用率"
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

                {/* 实时图表 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
                  <RealTimeChart
                    title="系统性能趋势"
                    data={generateTrendData()}
                    color={DISPLAY_COLORS.network.access}
                  />
                  <RealTimeChart
                    title="威胁检测统计"
                    data={generateThreatData()}
                    color={DISPLAY_COLORS.security.high}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 迷你地图 */}
        {showMiniMap && (
          <div
            className="absolute top-full mt-4 right-0 quantum-card p-4"
            style={{ width: "300px", height: "200px" }}
          >
            <h4 className="text-sm font-bold mb-3 neon-text-blue">
              系统拓扑图
            </h4>
            <MiniMapComponent />
          </div>
        )}
      </div>

      {/* 左侧高级神经网络监控面板 */}
      <AdvancedNeuralPanel
        realTimeData={realTimeData}
        selectedNode={selectedNode}
        onNodeSelect={onNodeSelect}
      />

      {/* 右侧高级量子威胁分析面板 */}
      <AdvancedThreatPanel
        realTimeData={realTimeData}
        alertLevel={alertLevel}
      />

      {/* 选中节点的详细信息弹窗 */}
      {selectedNode && (
        <NodeDetailModal
          nodeId={selectedNode}
          nodeData={enhancedStats.find((s) => s.id === selectedNode)}
          onClose={() => onNodeSelect(null)}
        />
      )}
    </div>
  );
}

/**
 * 高级状态卡片
 */
function AdvancedStatusCard({
  id,
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
  details,
  isSelected,
  onClick,
}: {
  id: string;
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
  details: any;
  isSelected: boolean;
  onClick: () => void;
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
      onClick={onClick}
      className={`quantum-card p-5 relative overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer ${
        isSelected ? "border-neon-blue bg-neon-blue/10" : ""
      }`}
      style={{
        borderColor: isSelected ? DISPLAY_COLORS.neon.blue : color,
        minHeight: "180px",
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

      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Eye className="w-4 h-4 text-neon-blue animate-pulse" />
        </div>
      )}

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

          <div className="flex flex-col items-end space-y-2">
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

          {/* 高级进度条 */}
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

          {/* 详细信息预览 */}
          {isSelected && details && (
            <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
              {Object.entries(details).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-muted-foreground capitalize">{key}</div>
                  <div className="font-mono font-bold" style={{ color }}>
                    {val as string}
                  </div>
                </div>
              ))}
            </div>
          )}

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
    <div className="neural-card p-3">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" style={{ color }} />
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="text-right">
        <div
          className="text-lg font-bold font-mono"
          style={{ color, textShadow: `0 0 10px ${color}60` }}
        >
          {value}
          <span className="text-xs ml-1">{unit}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 实时图表组件
 */
function RealTimeChart({
  title,
  data,
  color,
}: {
  title: string;
  data: any[];
  color: string;
}) {
  return (
    <div className="neural-card p-4">
      <h5 className="text-sm font-bold mb-3" style={{ color }}>
        {title}
      </h5>
      <div style={{ width: "100%", height: "120px" }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={DISPLAY_COLORS.ui.border.primary}
            />
            <XAxis hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                border: `1px solid ${color}`,
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`${color}20`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * 迷你地图组件
 */
function MiniMapComponent() {
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* 网络拓扑结构 */}
          <circle cx="50" cy="30" r="3" fill="#00ffff" />
          <circle cx="30" cy="50" r="2" fill="#00ff00" />
          <circle cx="70" cy="50" r="2" fill="#00ff00" />
          <circle cx="50" cy="70" r="2" fill="#ff6600" />
          {/* 连接线 */}
          <line
            x1="50"
            y1="30"
            x2="30"
            y2="50"
            stroke="#00ffff"
            strokeWidth="0.5"
          />
          <line
            x1="50"
            y1="30"
            x2="70"
            y2="50"
            stroke="#00ffff"
            strokeWidth="0.5"
          />
          <line
            x1="50"
            y1="30"
            x2="50"
            y2="70"
            stroke="#00ffff"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        网络节点: 47/50
      </div>
    </div>
  );
}

/**
 * 高级神经网络监控面板
 */
function AdvancedNeuralPanel({
  realTimeData,
  selectedNode,
  onNodeSelect,
}: {
  realTimeData: any;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}) {
  const [activeTab, setActiveTab] = useState("metrics");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const neuralMetrics = useMemo(
    () => [
      {
        id: "latency",
        label: "神经传输延迟",
        subLabel: "Neural Transmission Latency",
        value: realTimeData?.networkLatency || 23,
        color: DISPLAY_COLORS.network.access,
        unit: "ms",
        max: 100,
        status: "normal",
        trend: -5,
        history: generateMetricHistory(),
      },
      {
        id: "cpu-load",
        label: "处理器负载",
        subLabel: "CPU Processing Load",
        value: realTimeData?.cpuUsage || 68,
        color: getPerformanceColor(realTimeData?.cpuUsage || 68),
        unit: "%",
        max: 100,
        status: realTimeData?.cpuUsage > 85 ? "critical" : "normal",
        trend: +3,
        history: generateMetricHistory(),
      },
      {
        id: "bandwidth",
        label: "量子带宽使用",
        subLabel: "Quantum Bandwidth Usage",
        value: realTimeData?.bandwidthUsage || 45,
        color: DISPLAY_COLORS.network.distribution,
        unit: "%",
        max: 100,
        status: "normal",
        trend: +8,
        history: generateMetricHistory(),
      },
      {
        id: "sync-rate",
        label: "神经同步率",
        subLabel: "Neural Synchronization Rate",
        value: realTimeData?.memoryUsage || 78,
        color: getPerformanceColor(realTimeData?.memoryUsage || 78),
        unit: "%",
        max: 100,
        status: realTimeData?.memoryUsage > 85 ? "warning" : "normal",
        trend: -2,
        history: generateMetricHistory(),
      },
    ],
    [realTimeData],
  );

  const tabs = [
    { id: "metrics", label: "指标", icon: Gauge },
    { id: "network", label: "网络", icon: Network },
    { id: "security", label: "安全", icon: Shield },
    { id: "analysis", label: "分析", icon: BarChart3 },
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto z-30">
      <div
        className="quantum-card p-6"
        style={{
          width: "min(25vw, 400px)", // 响应式宽度：最大25%视口宽度，最大400px
          minWidth: "320px", // 确保最小可用宽度
          maxHeight: "70vh", // 响应式高度：最大70%视口高度
          minHeight: "500px", // 确保最小可用高度
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`neural-button p-2 ${showAdvanced ? "bg-neon-blue/20" : ""}`}
              title="高级视图"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-xs text-neon-green font-mono">在线</span>
            </div>
          </div>
        </div>

        {/* 标签页导航 - 优化响应式设计 */}
        <div className="flex border-b mb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center space-x-1.5 py-2.5 px-3 text-xs sm:text-sm font-medium font-rajdhani border-b-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? "border-neon-blue text-neon-blue"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
              style={{ minWidth: "fit-content" }}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 内容区域 - 优化滚动和响应式设计 */}
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: "calc(70vh - 200px)" }}
        >
          {activeTab === "metrics" && (
            <div className="space-y-3 sm:space-y-4">
              {neuralMetrics.map((metric) => (
                <div
                  key={metric.id}
                  onClick={() =>
                    onNodeSelect(selectedNode === metric.id ? null : metric.id)
                  }
                  className={`neural-card p-3 sm:p-4 transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
                    selectedNode === metric.id
                      ? "border-neon-blue bg-neon-blue/10"
                      : ""
                  }`}
                  style={{
                    borderColor:
                      selectedNode === metric.id
                        ? DISPLAY_COLORS.neon.blue
                        : `${metric.color}40`,
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className="text-sm font-bold"
                          style={{ color: DISPLAY_COLORS.ui.text.primary }}
                        >
                          {metric.label}
                        </span>
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{
                            backgroundColor: metric.color,
                            boxShadow: `0 0 6px ${metric.color}60`,
                          }}
                        />
                      </div>
                      <div
                        className="text-xs opacity-80 font-rajdhani"
                        style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                      >
                        {metric.subLabel}
                      </div>
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
                      <div
                        className={`text-xs font-mono ${
                          metric.trend > 0 ? "text-neon-green" : "text-neon-red"
                        }`}
                      >
                        {metric.trend > 0 ? "+" : ""}
                        {metric.trend}%
                      </div>
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

                  {/* 高级视图：迷你图表 */}
                  {showAdvanced && selectedNode === metric.id && (
                    <div className="mt-3 neural-card p-3">
                      <div style={{ width: "100%", height: "60px" }}>
                        <ResponsiveContainer>
                          <AreaChart data={metric.history}>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={metric.color}
                              fill={`${metric.color}20`}
                              strokeWidth={1}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

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
          {activeTab === "analysis" && <AnalysisTabContent />}

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
    </div>
  );
}

// 生成指标历史数据
function generateMetricHistory() {
  return Array.from({ length: 10 }, (_, i) => ({
    time: i,
    value: 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
  }));
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

function AnalysisTabContent() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-neon-purple opacity-60" />
        <p className="text-muted-foreground">智能分析引擎</p>
      </div>
    </div>
  );
}

/**
 * 高级量子威胁分析面板
 */
function AdvancedThreatPanel({
  realTimeData,
  alertLevel,
}: {
  realTimeData: any;
  alertLevel: string;
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("level");
  const [showDetails, setShowDetails] = useState(false);

  const quantumThreats = useMemo(
    () => [
      {
        id: "QT-001",
        type: "量子干扰攻击",
        typeEn: "Quantum Interference Attack",
        level: 9,
        frequency: "14.2THz",
        source: "深空未知信号",
        sourceEn: "Deep Space Unknown Signal",
        timestamp: "14:23:45",
        status: "active",
        impact: "高",
        location: "量子核心",
        duration: "00:15:32",
        severity: "critical",
      },
      {
        id: "NT-002",
        type: "神经病毒入侵",
        typeEn: "Neural Virus Intrusion",
        level: 7,
        frequency: "8.7GHz",
        source: "内部网络",
        sourceEn: "Internal Network",
        timestamp: "14:20:12",
        status: "contained",
        impact: "中",
        location: "神经网络节点",
        duration: "00:08:45",
        severity: "high",
      },
      {
        id: "DT-003",
        type: "数据流劫持",
        typeEn: "Data Stream Hijacking",
        level: 5,
        frequency: "12.1GHz",
        source: "外部网关",
        sourceEn: "External Gateway",
        timestamp: "14:18:33",
        status: "blocked",
        impact: "低",
        location: "数据传输层",
        duration: "00:03:21",
        severity: "medium",
      },
      {
        id: "ST-004",
        type: "系统资源耗尽",
        typeEn: "System Resource Exhaustion",
        level: 6,
        frequency: "5.4GHz",
        source: "本地进程",
        sourceEn: "Local Process",
        timestamp: "14:25:12",
        status: "investigating",
        impact: "高",
        location: "量子传感器",
        duration: "00:02:34",
        severity: "critical",
      },
    ],
    [activeFilter, sortBy],
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
    {
      id: "blocked",
      label: "已阻止",
      count: quantumThreats.filter((t) => t.status === "blocked").length,
    },
  ];

  const sortOptions = [
    { id: "level", label: "威胁等级" },
    { id: "timestamp", label: "时间" },
    { id: "impact", label: "影响程度" },
  ];

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto z-30">
      <div
        className={`quantum-card p-6 ${alertLevel === "critical" ? "border-threat-critical" : ""}`}
        style={{
          width: "min(30vw, 420px)", // 响应式宽度
          minWidth: "350px",
          maxHeight: "70vh",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap
              className="w-7 h-7 neon-text"
              style={{
                color: getThreatColor(8),
                filter: `drop-shadow(0 0 8px ${getThreatColor(8)})`,
              }}
            />
            <div>
              <h3 className="text-lg font-bold font-orbitron neon-text-red">
                量子威胁分析
              </h3>
              <p className="text-xs text-muted-foreground font-rajdhani">
                Quantum Threat Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`neural-button p-2 ${showDetails ? "bg-neon-red/20" : ""}`}
              title="详细视图"
            >
              <Info className="w-4 h-4" />
            </button>
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: getThreatColor(
                  realTimeData?.realTimeThreats || 5,
                ),
                boxShadow: `0 0 8px ${getThreatColor(realTimeData?.realTimeThreats || 5)}60`,
              }}
            />
          </div>
        </div>

        {/* 过滤和排序控制 */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="neural-select text-xs px-2 py-1 flex-1"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            {filterOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="neural-select text-xs px-2 py-1 flex-1"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 威胁列表 */}
        <div
          className="space-y-3 overflow-y-auto"
          style={{ maxHeight: "calc(70vh - 200px)" }}
        >
          {quantumThreats.map((threat) => (
            <div
              key={threat.id}
              className="neural-card p-4 transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: `${getThreatColor(threat.level)}40`,
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
                      className="text-xs px-2 py-1 rounded-full font-mono"
                      style={{
                        backgroundColor: `${getThreatColor(threat.level)}20`,
                        color: getThreatColor(threat.level),
                        border: `1px solid ${getThreatColor(threat.level)}40`,
                      }}
                    >
                      LV.{threat.level}
                    </span>
                  </div>
                  <div
                    className="text-xs opacity-80 font-rajdhani"
                    style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                  >
                    {threat.typeEn}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {threat.timestamp}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full font-mono mt-1 ${
                      threat.status === "active"
                        ? "text-neon-red bg-neon-red/20"
                        : threat.status === "contained"
                          ? "text-neon-orange bg-neon-orange/20"
                          : threat.status === "blocked"
                            ? "text-neon-green bg-neon-green/20"
                            : "text-neon-blue bg-neon-blue/20"
                    }`}
                  >
                    {threat.status === "active"
                      ? "活跃"
                      : threat.status === "contained"
                        ? "已控制"
                        : threat.status === "blocked"
                          ? "已阻止"
                          : threat.status === "investigating"
                            ? "调查中"
                            : "监控中"}
                  </div>
                </div>
              </div>

              {/* 威胁详细信息 */}
              {showDetails && (
                <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-gray-600">
                  <div>
                    <span className="text-muted-foreground">源头:</span>
                    <div style={{ color: DISPLAY_COLORS.ui.text.primary }}>
                      {threat.source}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">位置:</span>
                    <div style={{ color: DISPLAY_COLORS.ui.text.primary }}>
                      {threat.location}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">影响:</span>
                    <div
                      style={{
                        color:
                          threat.impact === "高"
                            ? DISPLAY_COLORS.status.critical
                            : threat.impact === "中"
                              ? DISPLAY_COLORS.status.warning
                              : DISPLAY_COLORS.status.normal,
                      }}
                    >
                      {threat.impact}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">持续:</span>
                    <div style={{ color: DISPLAY_COLORS.ui.text.primary }}>
                      {threat.duration}
                    </div>
                  </div>
                </div>
              )}
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
            量子防护屏障状态
          </div>
          <div className="flex items-center justify-between">
            <div
              className="text-xs font-mono"
              style={{ color: DISPLAY_COLORS.status.active }}
            >
              屏障强度: 96%
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: DISPLAY_COLORS.neon.green }}
            >
              所有威胁已被检测并处理
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 节点详细信息模态框
 */
function NodeDetailModal({
  nodeId,
  nodeData,
  onClose,
}: {
  nodeId: string;
  nodeData: any;
  onClose: () => void;
}) {
  if (!nodeData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-auto">
      <div
        className="quantum-card p-8 max-w-2xl w-full mx-4"
        style={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <nodeData.icon
              className="w-8 h-8"
              style={{ color: nodeData.color }}
            />
            <div>
              <h2
                className="text-2xl font-bold font-orbitron"
                style={{ color: nodeData.color }}
              >
                {nodeData.title}
              </h2>
              <p className="text-muted-foreground">{nodeData.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="neural-button p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neural-card p-4">
            <h3 className="text-lg font-bold mb-4">实时状态</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>当前值:</span>
                <span className="font-mono" style={{ color: nodeData.color }}>
                  {nodeData.value} {nodeData.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>状态:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    nodeData.status === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : nodeData.status === "warning"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {nodeData.status === "critical"
                    ? "危险"
                    : nodeData.status === "warning"
                      ? "警告"
                      : "正常"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>变化趋势:</span>
                <span
                  className={
                    nodeData.trend === "up" ? "text-green-400" : "text-red-400"
                  }
                >
                  {nodeData.change}
                </span>
              </div>
            </div>
          </div>

          <div className="neural-card p-4">
            <h3 className="text-lg font-bold mb-4">详细信息</h3>
            <div className="space-y-3">
              {Object.entries(nodeData.details || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className="font-mono">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">性能图表</h3>
          <div style={{ width: "100%", height: "200px" }}>
            <ResponsiveContainer>
              <AreaChart data={generateTrendData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: `1px solid ${nodeData.color}`,
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={nodeData.color}
                  fill={`${nodeData.color}20`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 高级2D控制面板
 */
function Advanced2DPanel({
  isVisible,
  onToggle,
  sceneConfig,
  onConfigChange,
}: {
  isVisible: boolean;
  onToggle: () => void;
  sceneConfig: any;
  onConfigChange: (config: any) => void;
}) {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: !sceneConfig.isPaused,
  });

  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "总览", icon: Activity },
    { id: "controls", label: "控制", icon: Sliders },
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
        width: "min(35vw, 600px)", // 响应式宽度：最大35%视口宽度，最大600px
        minWidth: "480px", // 确保最小可用宽度
        borderColor: DISPLAY_COLORS.corporate.accent,
        backgroundColor: "rgba(10, 14, 26, 0.95)",
      }}
    >
      {/* 头部 */}
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
            Advanced Quantum Control Interface
          </p>
        </div>
        <button onClick={onToggle} className="quantum-button p-3">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 标签页 - 优化响应式设计 */}
      <div
        className="flex border-b overflow-x-auto scrollbar-hide"
        style={{
          backgroundColor: "rgba(30, 41, 55, 0.7)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium font-rajdhani transition-all duration-300 ${
              activeTab === tab.id
                ? "quantum-button"
                : "text-muted-foreground hover:text-white"
            }`}
            style={{ minWidth: "fit-content" }}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 - 优化响应式设计 */}
      <div
        className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden"
        style={{
          height: "calc(100vh - 140px)",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        }}
      >
        {activeTab === "overview" && (
          <AdvancedOverviewTab realTimeData={realTimeData} />
        )}
        {activeTab === "controls" && (
          <AdvancedControlsTab
            sceneConfig={sceneConfig}
            onConfigChange={onConfigChange}
          />
        )}
        {activeTab === "network" && <NetworkTabContent />}
        {activeTab === "security" && <SecurityTabContent />}
        {activeTab === "analysis" && <AnalysisTabContent />}
        {activeTab === "logs" && <AdvancedLogsTab />}
        {activeTab === "settings" && <AdvancedSettingsTab />}
      </div>
    </div>
  );
}

function AdvancedOverviewTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-blue">
        系统总览
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="quantum-card p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Cpu className="w-6 h-6 text-neon-blue" />
            <span className="font-medium">处理器状态</span>
          </div>
          <div className="text-2xl font-bold font-mono neon-text-blue">
            {realTimeData?.cpuUsage || 68}%
          </div>
          <div className="quantum-progress mt-2">
            <div
              className="quantum-progress-fill"
              style={{ width: `${realTimeData?.cpuUsage || 68}%` }}
            />
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
          <div className="neural-progress mt-2">
            <div
              className="neural-progress-fill"
              style={{ width: `${realTimeData?.memoryUsage || 78}%` }}
            />
          </div>
        </div>

        <div className="quantum-card p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Network className="w-6 h-6 text-neon-purple" />
            <span className="font-medium">网络负载</span>
          </div>
          <div className="text-2xl font-bold font-mono neon-text-purple">
            {realTimeData?.networkLatency || 23}ms
          </div>
          <div
            className="quantum-progress mt-2"
            style={{ borderColor: DISPLAY_COLORS.neon.purple }}
          >
            <div
              className="quantum-progress-fill"
              style={{
                width: `${Math.min(realTimeData?.networkLatency || 23, 100)}%`,
                background: DISPLAY_COLORS.neon.purple,
              }}
            />
          </div>
        </div>
      </div>

      <div className="quantum-card p-6">
        <h4 className="text-lg font-bold mb-4 neon-text-blue">实时性能监控</h4>
        <div style={{ width: "100%", height: "200px" }}>
          <ResponsiveContainer>
            <ComposedChart data={generateTrendData()}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={DISPLAY_COLORS.ui.border.primary}
              />
              <XAxis stroke={DISPLAY_COLORS.ui.text.muted} />
              <YAxis stroke={DISPLAY_COLORS.ui.text.muted} />
              <Tooltip
                contentStyle={{
                  backgroundColor: DISPLAY_COLORS.ui.background.secondary,
                  border: `1px solid ${DISPLAY_COLORS.corporate.accent}`,
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="cpu"
                stackId="1"
                stroke={DISPLAY_COLORS.neon.blue}
                fill={DISPLAY_COLORS.neon.blue}
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="memory"
                stackId="1"
                stroke={DISPLAY_COLORS.neon.green}
                fill={DISPLAY_COLORS.neon.green}
                fillOpacity={0.3}
              />
              <RechartsLine
                type="monotone"
                dataKey="network"
                stroke={DISPLAY_COLORS.neon.purple}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AdvancedControlsTab({
  sceneConfig,
  onConfigChange,
}: {
  sceneConfig: any;
  onConfigChange: (config: any) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-purple">
        场景控制
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="quantum-card p-4">
          <h4 className="text-lg font-bold mb-4">基础控制</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>自动旋转</span>
              <button
                onClick={() =>
                  onConfigChange({ autoRotate: !sceneConfig.autoRotate })
                }
                className={`neural-button px-3 py-1 ${
                  sceneConfig.autoRotate ? "bg-neon-green/20" : ""
                }`}
              >
                {sceneConfig.autoRotate ? "开启" : "关闭"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>特效启用</span>
              <button
                onClick={() =>
                  onConfigChange({
                    effectsEnabled: !sceneConfig.effectsEnabled,
                  })
                }
                className={`neural-button px-3 py-1 ${
                  sceneConfig.effectsEnabled ? "bg-neon-blue/20" : ""
                }`}
              >
                {sceneConfig.effectsEnabled ? "开启" : "关闭"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>暂停状态</span>
              <button
                onClick={() =>
                  onConfigChange({ isPaused: !sceneConfig.isPaused })
                }
                className={`neural-button px-3 py-1 ${
                  sceneConfig.isPaused ? "bg-neon-red/20" : "bg-neon-green/20"
                }`}
              >
                {sceneConfig.isPaused ? "已暂停" : "运行中"}
              </button>
            </div>
          </div>
        </div>

        <div className="quantum-card p-4">
          <h4 className="text-lg font-bold mb-4">质量设置</h4>
          <div className="space-y-4">
            <div>
              <span className="block mb-2">渲染质量</span>
              <select
                value={sceneConfig.quality}
                onChange={(e) => onConfigChange({ quality: e.target.value })}
                className="w-full neural-select"
              >
                <option value="low">低质量</option>
                <option value="medium">中等质量</option>
                <option value="high">高质量</option>
                <option value="ultra">超高质量</option>
              </select>
            </div>
            <div>
              <span className="block mb-2">
                星星数量: {sceneConfig.starCount}
              </span>
              <input
                type="range"
                min="1000"
                max="8000"
                value={sceneConfig.starCount}
                onChange={(e) =>
                  onConfigChange({ starCount: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvancedLogsTab() {
  const logs = [
    {
      time: "14:25:32",
      level: "INFO",
      message: "神经网络连接已建立",
      source: "Neural Core",
    },
    {
      time: "14:24:15",
      level: "WARN",
      message: "检测到异常流量模式",
      source: "Traffic Monitor",
    },
    {
      time: "14:23:48",
      level: "ERROR",
      message: "量子信号干扰检测",
      source: "Quantum Detector",
    },
    {
      time: "14:22:33",
      level: "INFO",
      message: "防护屏障强度更新至96%",
      source: "Shield Controller",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-orbitron neon-text-green">
        系统日志
      </h3>

      <div className="space-y-2">
        {logs.map((log, index) => (
          <div key={index} className="neural-card p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-muted-foreground">
                {log.time}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-mono ${
                  log.level === "ERROR"
                    ? "bg-red-500/20 text-red-400"
                    : log.level === "WARN"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {log.level}
              </span>
            </div>
            <div className="mt-1 text-sm">{log.message}</div>
            <div className="text-xs text-muted-foreground mt-1">
              来源: {log.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdvancedSettingsTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron neon-text-orange">
        高级设置
      </h3>

      <div className="quantum-card p-4">
        <h4 className="text-lg font-bold mb-4">性能优化</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>硬件加速</span>
            <span className="text-neon-green">已启用</span>
          </div>
          <div className="flex items-center justify-between">
            <span>内存管理</span>
            <span className="text-neon-green">自动</span>
          </div>
          <div className="flex items-center justify-between">
            <span>LOD系统</span>
            <span className="text-neon-blue">智能</span>
          </div>
        </div>
      </div>

      <div className="quantum-card p-4">
        <h4 className="text-lg font-bold mb-4">显示设置</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>抗锯齿</span>
            <span className="text-neon-green">MSAA 4x</span>
          </div>
          <div className="flex items-center justify-between">
            <span>阴影质量</span>
            <span className="text-neon-blue">高</span>
          </div>
          <div className="flex items-center justify-between">
            <span>粒子效果</span>
            <span className="text-neon-purple">增强</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成趋势数据
function generateTrendData() {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    cpu: 60 + Math.sin(i * 0.3) * 15 + Math.random() * 10,
    memory: 70 + Math.cos(i * 0.4) * 10 + Math.random() * 8,
    network: 20 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    value: 50 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
  }));
}

// 生成威胁数据
function generateThreatData() {
  return Array.from({ length: 10 }, (_, i) => ({
    time: i,
    threats: Math.floor(Math.random() * 8) + 2,
    blocked: Math.floor(Math.random() * 5) + 1,
    value: Math.floor(Math.random() * 10) + 3,
  }));
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

  return (
    <div
      className="absolute top-0 left-0 right-0 h-20 border-b backdrop-blur-sm z-40"
      style={{
        backgroundColor: "rgba(10, 14, 26, 0.9)",
        borderColor: DISPLAY_COLORS.ui.border.primary,
      }}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/overview")}
            className="neural-button px-4 py-2"
            title="返回总览"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>

          <div className="text-xl font-bold font-orbitron neon-text">
            态势监控中心
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onConfigChange({ isPaused: !sceneConfig.isPaused })}
            className={`neural-button px-4 py-2 ${
              sceneConfig.isPaused ? "bg-neon-orange/20" : "bg-neon-green/20"
            }`}
          >
            {sceneConfig.isPaused ? (
              <Play className="w-4 h-4 mr-2" />
            ) : (
              <Pause className="w-4 h-4 mr-2" />
            )}
            {sceneConfig.isPaused ? "播放" : "暂停"}
          </button>

          <button
            onClick={onToggle2DPanel}
            className={`neural-button px-4 py-2 ${
              is2DPanelVisible ? "bg-neon-blue/20" : ""
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            控制台
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [sceneConfig, setSceneConfig] = useState({
    starCount: 4000,
    autoRotate: true,
    rotateSpeed: 0.15,
    quality: "high",
    effectsEnabled: true,
    isPaused: false,
    dynamicEnvironment: true,
    particleEffects: true,
    breathingEffect: true,
    showGrid: false,
    updateInterval: 2000,
    starRadius: 800,
    starDepth: 150,
    starFactor: 4,
    starSaturation: 0.3,
    starSpeed: 0.01,
    dataParticles: true,
    energyWaves: true,
    quantumRipples: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearInterval(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  const handleConfigChange = useCallback((newConfig: any) => {
    setSceneConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId);
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

      {/* 3D未来场景容器 - 优化比例和响应式设计 */}
      <div
        className={`absolute inset-0 transition-all duration-500 canvas-container`}
        style={{
          top: "80px",
          left: "420px", // 为左侧面板预留空间
          right: is2DPanelVisible ? "min(35vw, 600px)" : "0", // ��应式右侧面板宽度
        }}
      >
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 45, 80],
              fov: 75,
              near: 0.1,
              far: 2000,
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
              <AdvancedCyberScene
                sceneConfig={sceneConfig}
                selectedNode={selectedNode}
                onNodeSelect={handleNodeSelect}
              />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={35}
                maxDistance={300}
                dampingFactor={0.08}
                enableDamping
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate={sceneConfig.autoRotate && !sceneConfig.isPaused}
                autoRotateSpeed={sceneConfig.rotateSpeed}
                rotateSpeed={0.8}
                panSpeed={1.2}
                zoomSpeed={1.5}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 高级信息覆盖层 */}
      <AdvancedInfoOverlay
        sceneConfig={sceneConfig}
        onConfigChange={handleConfigChange}
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
      />

      {/* 高级2D控制面板 */}
      <Advanced2DPanel
        isVisible={is2DPanelVisible}
        onToggle={toggle2DPanel}
        sceneConfig={sceneConfig}
        onConfigChange={handleConfigChange}
      />

      {/* 面板切换按钮 */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 quantum-button p-4 rounded-l-xl quantum-ripple"
          title="打开量子控制台"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* 增强版底部状态栏 - 优化响应式布局 */}
      <div
        className={`absolute bottom-0 border-t backdrop-blur-md transition-all duration-500`}
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
          left: "420px", // 为左侧面板预留空间
          right: is2DPanelVisible ? "min(35vw, 600px)" : "0", // 与主容器保持一致
          height: "60px",
          boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}20`,
        }}
      >
        <div className="flex justify-between items-center h-full px-6 text-sm font-rajdhani">
          <div className="flex items-center space-x-6">
            <span className="font-medium text-white">
              CyberGuard 神经网络监控中心 v5.0
            </span>
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-neon-green" />
              <span
                className={`${sceneConfig.isPaused ? "text-neon-orange" : "text-neon-green"}`}
              >
                {sceneConfig.isPaused ? "系统已暂停" : "系统运行正常"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-xs">
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
            <div className="text-muted-foreground">|</div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-3 h-3 text-neon-cyan" />
              <span style={{ color: DISPLAY_COLORS.neon.cyan }}>
                FPS: 60 | 节点: {selectedNode ? "已选中" : "未选中"}
              </span>
            </div>
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
    "初始化量子引擎",
    "建立神经连接",
    "加载威胁数据库",
    "启动防护屏障",
    "同步时空坐标",
    "完成启动序列",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12;
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
      <div className="text-center max-w-lg mx-auto">
        <div className="relative mb-8">
          <div
            className="w-28 h-28 rounded-xl flex items-center justify-center mx-auto relative quantum-effect"
            style={{
              background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
              boxShadow: `0 0 50px ${DISPLAY_COLORS.corporate.accent}60`,
            }}
          >
            <Brain className="w-14 h-14 text-white animate-pulse" />
            <div
              className="absolute inset-0 rounded-xl animate-spin"
              style={{
                border: `3px solid transparent`,
                borderTop: `3px solid ${DISPLAY_COLORS.corporate.accent}`,
                borderRight: `3px solid ${DISPLAY_COLORS.neon.green}`,
              }}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="text-4xl font-bold mb-4 font-orbitron neon-text-blue">
            正在启动神经网络监控中心
          </div>
          <div className="text-base font-rajdhani text-muted-foreground animate-pulse">
            Advanced Neural Network Initialization...
          </div>
        </div>

        {/* 增强进度条 */}
        <div className="mb-6">
          <div
            className="quantum-progress h-4"
            style={{ borderColor: `${DISPLAY_COLORS.corporate.accent}40` }}
          >
            <div
              className="quantum-progress-fill h-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent}, ${DISPLAY_COLORS.neon.green})`,
                boxShadow: `0 0 25px ${DISPLAY_COLORS.corporate.accent}60`,
              }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm font-mono">
            <span className="text-muted-foreground">{currentStep}</span>
            <span className="text-neon-blue">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 系统状态指示器 */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
            <span className="text-neon-purple font-mono">量子引擎</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-neon-green font-mono">神经网络</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
            <span className="text-neon-blue font-mono">防护系统</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-orange animate-pulse"></div>
            <span className="text-neon-orange font-mono">时空引擎</span>
          </div>
        </div>
      </div>
    </div>
  );
}
