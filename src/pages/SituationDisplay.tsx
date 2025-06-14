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
} from "@/lib/situationDisplayColors";
import {
  CentralMonitoringTower,
  DataNodeCluster,
  DataFlowPipelines,
  ProtectionShields,
  EnvironmentalParticles,
  FuturisticEnvironment,
} from "@/components/3d/FuturisticCyberComponents";

/**
 * 未来感网络监控中心主场景
 * Futuristic Cyber Monitoring Center Main Scene
 */
function FuturisticCyberScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  useFrame((state) => {
    if (sceneRef.current) {
      // 根据系统负载调���整体场景
      const systemLoad = realTimeData?.cpuUsage || 45;
      if (systemLoad > 85) {
        // 高负载时场景微微震动
        sceneRef.current.position.x =
          Math.sin(state.clock.getElapsedTime() * 10) * 0.02;
        sceneRef.current.position.z =
          Math.cos(state.clock.getElapsedTime() * 8) * 0.02;
      } else {
        sceneRef.current.position.x = 0;
        sceneRef.current.position.z = 0;
      }

      // 威胁等级影响环境光效
      const threatLevel = realTimeData?.realTimeThreats || 3;
      if (threatLevel > 10) {
        sceneRef.current.rotation.y += 0.001;
      }
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 未来感环境基础设施 */}
      <FuturisticEnvironment />

      {/* 中央监控塔 */}
      <CentralMonitoringTower />

      {/* 数据节点群 */}
      <DataNodeCluster />

      {/* 数据流管道 */}
      <DataFlowPipelines />

      {/* 防护屏障 */}
      <ProtectionShields />

      {/* 环境粒子系统 */}
      <EnvironmentalParticles />

      {/* 深空星域背景 */}
      <Stars
        radius={500}
        depth={80}
        count={3000}
        factor={2}
        saturation={0}
        fade
        speed={0.02}
      />
    </group>
  );
}

/**
 * 未来感信息覆盖层
 * Futuristic Information Overlay
 */
function FuturisticInfoOverlay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cyberStats = useMemo(() => {
    const threats = realTimeData?.realTimeThreats || 3;
    const connections = realTimeData?.activeConnections || 8247;
    const bandwidth = realTimeData?.bandwidthUsage || 45;
    const nodes = realTimeData?.onlineNodes || 47;

    return [
      {
        title: "威胁监控",
        value: threats,
        icon: Brain,
        color: getThreatColor(threats),
        change: "+3",
        trend: "up" as const,
        metric: "Neural Threats",
      },
      {
        title: "数据流量",
        value: `${Math.floor(connections / 1000)}K`,
        icon: Hexagon,
        color: DISPLAY_COLORS.network.access,
        change: "+2.5K",
        trend: "up" as const,
        metric: "Data Streams",
      },
      {
        title: "节点状态",
        value: `${nodes}/50`,
        icon: Octagon,
        color: DISPLAY_COLORS.status.active,
        change: "+2",
        trend: "up" as const,
        metric: "Active Nodes",
      },
      {
        title: "系统效率",
        value: `${100 - bandwidth}%`,
        icon: Triangle,
        color: getPerformanceColor(100 - bandwidth),
        change: "+5%",
        trend: "up" as const,
        metric: "Efficiency",
      },
    ];
  }, [realTimeData]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 未来感顶部控制面板 */}
      <div className="absolute top-20 left-4 right-4 pointer-events-auto">
        <div
          className="rounded-xl shadow-2xl p-5 border backdrop-blur-md"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            borderColor: DISPLAY_COLORS.corporate.accent,
            borderRadius: DISPLAY_THEME.borderRadius.xlarge,
            borderWidth: "2px",
            boxShadow: `0 0 30px ${DISPLAY_COLORS.corporate.accent}40`,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
                  boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}60`,
                }}
              >
                <Brain className="w-6 h-6 text-white" />
                <div
                  className="absolute inset-0 rounded-lg animate-pulse"
                  style={{
                    background: `linear-gradient(45deg, transparent, ${DISPLAY_COLORS.corporate.accent}30, transparent)`,
                  }}
                />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: DISPLAY_COLORS.ui.text.primary,
                    textShadow: `0 0 10px ${DISPLAY_COLORS.corporate.accent}60`,
                  }}
                >
                  CyberGuard 神经网络监控中心
                </h2>
                <p
                  className="text-sm"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  Neural Network Cyber Monitoring Center
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    backgroundColor: DISPLAY_COLORS.status.active,
                    boxShadow: `0 0 10px ${DISPLAY_COLORS.status.active}`,
                  }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  神经网络运行正常
                </span>
              </div>
              <div
                className="text-sm px-4 py-2 rounded-lg border backdrop-blur-sm"
                style={{
                  color: DISPLAY_COLORS.ui.text.secondary,
                  backgroundColor: "rgba(30, 41, 59, 0.7)",
                  borderColor: DISPLAY_COLORS.ui.border.primary,
                  fontFamily: "monospace",
                }}
              >
                {currentTime.toLocaleString("zh-CN")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {cyberStats.map((stat, index) => (
              <FuturisticStatusCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* 左侧神经网络监控 */}
      <NeuralNetworkPanel realTimeData={realTimeData} />

      {/* 右侧量子威胁分析 */}
      <QuantumThreatPanel realTimeData={realTimeData} />
    </div>
  );
}

/**
 * 未来感状态卡片
 */
function FuturisticStatusCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  trend,
  metric,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  trend: "up" | "down";
  metric: string;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor =
    trend === "up"
      ? DISPLAY_COLORS.status.active
      : DISPLAY_COLORS.corporate.accent;

  return (
    <div
      className="rounded-lg p-4 border backdrop-blur-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
      style={{
        backgroundColor: "rgba(30, 41, 59, 0.6)",
        borderColor: color,
        borderWidth: "1px",
        boxShadow: `0 0 15px ${color}30`,
        minHeight: "120px",
      }}
    >
      {/* 背景动画效果 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(45deg, transparent, ${color}20, transparent)`,
          animation: "pulse 3s infinite",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: `${color}20`,
              boxShadow: `0 0 10px ${color}40`,
            }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div
            className="flex items-center text-xs font-mono"
            style={{ color: trendColor }}
          >
            <TrendIcon className="w-3 h-3 mr-1" />
            <span>{change}</span>
          </div>
        </div>

        <div className="text-right">
          <div
            className="text-3xl font-bold mb-1 font-mono"
            style={{
              color,
              textShadow: `0 0 10px ${color}60`,
            }}
          >
            {value}
          </div>
          <div
            className="text-sm mb-1 font-medium"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            {title}
          </div>
          <div
            className="text-xs font-mono opacity-80"
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
 * 神经网络监控面板
 */
function NeuralNetworkPanel({ realTimeData }: { realTimeData: any }) {
  const neuralMetrics = useMemo(
    () => [
      {
        label: "神经传输",
        value: realTimeData?.networkLatency || 23,
        color: DISPLAY_COLORS.network.access,
        unit: "ms",
        max: 100,
      },
      {
        label: "处理负载",
        value: realTimeData?.cpuUsage || 68,
        color: getPerformanceColor(realTimeData?.cpuUsage || 68),
        unit: "%",
        max: 100,
      },
      {
        label: "量子带宽",
        value: realTimeData?.bandwidthUsage || 45,
        color: DISPLAY_COLORS.network.distribution,
        unit: "%",
        max: 100,
      },
      {
        label: "脑波同步",
        value: realTimeData?.memoryUsage || 78,
        color: getPerformanceColor(realTimeData?.memoryUsage || 78),
        unit: "%",
        max: 100,
      },
    ],
    [realTimeData],
  );

  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div
        className="rounded-xl shadow-xl p-5 border backdrop-blur-md"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          borderColor: DISPLAY_COLORS.corporate.accent,
          borderRadius: DISPLAY_THEME.borderRadius.xlarge,
          width: "340px",
          maxHeight: "420px",
          boxShadow: `0 0 25px ${DISPLAY_COLORS.corporate.accent}40`,
        }}
      >
        <div className="flex items-center mb-5">
          <Brain
            className="w-6 h-6 mr-3"
            style={{
              color: DISPLAY_COLORS.corporate.accent,
              filter: `drop-shadow(0 0 5px ${DISPLAY_COLORS.corporate.accent})`,
            }}
          />
          <h3
            className="text-lg font-bold"
            style={{
              color: DISPLAY_COLORS.ui.text.primary,
              textShadow: `0 0 5px ${DISPLAY_COLORS.corporate.accent}40`,
            }}
          >
            神经网络监控
          </h3>
        </div>

        <div className="space-y-4">
          {neuralMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex-1">
                  <span
                    className="font-medium block"
                    style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                  >
                    {metric.label}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: DISPLAY_COLORS.ui.text.muted }}
                  >
                    Neural {metric.label}
                  </span>
                </div>
                <span
                  className="font-bold text-xl font-mono"
                  style={{
                    color: metric.color,
                    textShadow: `0 0 5px ${metric.color}60`,
                  }}
                >
                  {metric.value}
                  {metric.unit}
                </span>
              </div>

              {/* 未来感进度条 */}
              <div
                className="w-full rounded-full h-3 relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.7)",
                  border: `1px solid ${metric.color}30`,
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${Math.min(metric.value, metric.max)}%`,
                    background: `linear-gradient(90deg, ${metric.color}60, ${metric.color})`,
                    boxShadow: `0 0 10px ${metric.color}60`,
                  }}
                >
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${metric.color}40, transparent)`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-5 p-4 rounded-lg border backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: DISPLAY_COLORS.status.active,
            boxShadow: `0 0 15px ${DISPLAY_COLORS.status.active}30`,
          }}
        >
          <div
            className="text-sm font-medium mb-1"
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
  );
}

/**
 * 量子威胁分析面板
 */
function QuantumThreatPanel({ realTimeData }: { realTimeData: any }) {
  const quantumThreats = useMemo(
    () => [
      {
        type: "量子干扰",
        level: 9,
        frequency: "14.2THz",
        source: "深空未知",
      },
      {
        type: "神经病毒",
        level: 7,
        frequency: "8.7GHz",
        source: "AI实体",
      },
      {
        type: "时空异常",
        level: 5,
        frequency: "2.1MHz",
        source: "维度裂缝",
      },
      {
        type: "意识入侵",
        level: 6,
        frequency: "40Hz",
        source: "超级AI",
      },
    ],
    [],
  );

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div
        className="rounded-xl shadow-xl p-5 border backdrop-blur-md"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          borderColor: DISPLAY_COLORS.security.high,
          borderRadius: DISPLAY_THEME.borderRadius.xlarge,
          width: "340px",
          maxHeight: "420px",
          boxShadow: `0 0 25px ${DISPLAY_COLORS.security.high}40`,
        }}
      >
        <div className="flex items-center mb-5">
          <Zap
            className="w-6 h-6 mr-3"
            style={{
              color: DISPLAY_COLORS.security.high,
              filter: `drop-shadow(0 0 5px ${DISPLAY_COLORS.security.high})`,
            }}
          />
          <h3
            className="text-lg font-bold"
            style={{
              color: DISPLAY_COLORS.ui.text.primary,
              textShadow: `0 0 5px ${DISPLAY_COLORS.security.high}40`,
            }}
          >
            量子威胁分析
          </h3>
        </div>

        <div className="space-y-3">
          {quantumThreats.map((threat, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                borderColor: getThreatColor(threat.level),
                boxShadow: `0 0 10px ${getThreatColor(threat.level)}30`,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="font-medium text-sm"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  {threat.type}
                </span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold font-mono"
                  style={{
                    color: getThreatColor(threat.level),
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: `1px solid ${getThreatColor(threat.level)}`,
                    boxShadow: `0 0 5px ${getThreatColor(threat.level)}40`,
                  }}
                >
                  L{threat.level}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span
                  className="font-mono"
                  style={{ color: DISPLAY_COLORS.ui.text.muted }}
                >
                  {threat.frequency}
                </span>
                <span
                  className="font-medium"
                  style={{ color: getThreatColor(threat.level) }}
                >
                  {threat.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-5 p-4 rounded-lg border backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: DISPLAY_COLORS.ui.border.primary,
          }}
        >
          <div
            className="text-sm font-medium mb-2"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            量子防护状态
          </div>
          <div
            className="text-xs space-y-1 font-mono"
            style={{ color: DISPLAY_COLORS.ui.text.muted }}
          >
            <div>• 量子加密屏障：已激活</div>
            <div>• 神经防火墙：正常运行</div>
            <div>• 时空稳定器：监控中</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 未来感2D控制面板
 */
function Futuristic2DPanel({
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

  const [activeTab, setActiveTab] = useState("neural");

  const tabs = [
    { id: "neural", label: "神经", icon: Brain },
    { id: "quantum", label: "量子", icon: Zap },
    { id: "matrix", label: "矩阵", icon: Hexagon },
    { id: "flow", label: "数据流", icon: Triangle },
    { id: "threats", label: "威胁", icon: AlertTriangle },
    { id: "logs", label: "日志", icon: FileText },
  ];

  return (
    <div
      className={`fixed right-0 top-16 bottom-0 border-l transform transition-transform duration-300 z-40 shadow-2xl backdrop-blur-md ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        width: "500px",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: DISPLAY_COLORS.corporate.accent,
        borderWidth: "2px",
        boxShadow: `0 0 30px ${DISPLAY_COLORS.corporate.accent}40`,
      }}
    >
      {/* 未来感头部 */}
      <div
        className="flex items-center justify-between p-4 border-b backdrop-blur-sm"
        style={{
          background: `linear-gradient(90deg, ${DISPLAY_COLORS.corporate.primary}20, ${DISPLAY_COLORS.corporate.accent}20)`,
          borderColor: DISPLAY_COLORS.corporate.accent,
        }}
      >
        <div>
          <h2
            className="text-xl font-bold font-mono"
            style={{
              color: DISPLAY_COLORS.ui.text.primary,
              textShadow: `0 0 10px ${DISPLAY_COLORS.corporate.accent}60`,
            }}
          >
            量子控制台
          </h2>
          <p
            className="text-sm font-mono"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            Quantum Control Interface
          </p>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg transition-colors hover:bg-black/30"
          style={{
            border: `1px solid ${DISPLAY_COLORS.corporate.accent}`,
            color: DISPLAY_COLORS.ui.text.primary,
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 未来感标签页 */}
      <div
        className="flex border-b overflow-x-auto"
        style={{
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium font-mono transition-all duration-300 ${
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
                activeTab === tab.id ? "rgba(15, 23, 42, 0.8)" : "transparent",
              boxShadow:
                activeTab === tab.id
                  ? `0 0 10px ${DISPLAY_COLORS.corporate.accent}30`
                  : "none",
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div
        className="p-4 overflow-y-auto"
        style={{
          height: "calc(100vh - 160px)",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        }}
      >
        {activeTab === "neural" && <NeuralTab realTimeData={realTimeData} />}
        {activeTab === "quantum" && <QuantumTab />}
        {activeTab === "matrix" && <MatrixTab />}
        {activeTab === "flow" && <DataFlowTab />}
        {activeTab === "threats" && <ThreatsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
}

// 标签页组件
function NeuralTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        神经网络状态
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-3 border backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: DISPLAY_COLORS.corporate.accent,
          }}
        >
          <div
            className="text-sm mb-1 font-mono"
            style={{ color: DISPLAY_COLORS.corporate.accent }}
          >
            神经元
          </div>
          <div
            className="text-xl font-bold font-mono"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            {realTimeData?.onlineNodes || 47}
          </div>
        </div>
        <div
          className="rounded-lg p-3 border backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: DISPLAY_COLORS.status.active,
          }}
        >
          <div
            className="text-sm mb-1 font-mono"
            style={{ color: DISPLAY_COLORS.status.active }}
          >
            同步率
          </div>
          <div
            className="text-xl font-bold font-mono"
            style={{ color: DISPLAY_COLORS.ui.text.primary }}
          >
            98.7%
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantumTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        量子状态
      </h3>
      <div className="space-y-2">
        {[
          { param: "量子纠缠度", value: "99.2%", status: "stable" },
          { param: "相位一致性", value: "97.8%", status: "stable" },
          { param: "波函数坍缩", value: "0.3%", status: "normal" },
          { param: "信息熵", value: "2.45bit", status: "optimal" },
        ].map((item, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border backdrop-blur-sm font-mono"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              borderColor: DISPLAY_COLORS.ui.border.primary,
            }}
          >
            <div className="flex justify-between items-center">
              <span
                className="text-sm"
                style={{ color: DISPLAY_COLORS.ui.text.secondary }}
              >
                {item.param}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: DISPLAY_COLORS.corporate.accent }}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        数据矩阵
      </h3>
      <div
        className="bg-black rounded-lg p-4 font-mono text-sm overflow-hidden"
        style={{
          border: `1px solid ${DISPLAY_COLORS.status.active}`,
          boxShadow: `0 0 10px ${DISPLAY_COLORS.status.active}30`,
        }}
      >
        <div className="space-y-1">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="text-xs opacity-80"
              style={{
                color: DISPLAY_COLORS.status.active,
                animationDelay: `${i * 0.1}s`,
                animation: "fadeIn 1s ease-in-out infinite alternate",
              }}
            >
              {Array.from({ length: 50 }, () =>
                Math.random() > 0.5 ? "1" : "0",
              ).join("")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataFlowTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        数据流监控
      </h3>
      <div className="space-y-2">
        {[
          { stream: "核心数据流A", rate: "2.4GB/s", latency: "0.3ms" },
          { stream: "核心数据流B", rate: "1.8GB/s", latency: "0.5ms" },
          { stream: "边缘数据流", rate: "0.9GB/s", latency: "1.2ms" },
          { stream: "量子通道", rate: "5.7TB/s", latency: "0.1ms" },
        ].map((stream, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              borderColor: DISPLAY_COLORS.network.access,
            }}
          >
            <div
              className="font-medium text-sm mb-1"
              style={{ color: DISPLAY_COLORS.ui.text.secondary }}
            >
              {stream.stream}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span style={{ color: DISPLAY_COLORS.network.access }}>
                {stream.rate}
              </span>
              <span style={{ color: DISPLAY_COLORS.ui.text.muted }}>
                {stream.latency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreatsTab() {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
        威胁分析
      </h3>
      <div className="space-y-2">
        {[
          { threat: "AI自主意识觉醒", level: 9, type: "神经" },
          { threat: "量子病毒传播", level: 7, type: "量子" },
          { threat: "维度数据泄露", level: 5, type: "时空" },
          { threat: "意识网络入侵", level: 8, type: "心灵" },
        ].map((threat, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              borderColor: getThreatColor(threat.level),
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm font-medium"
                style={{ color: DISPLAY_COLORS.ui.text.secondary }}
              >
                {threat.threat}
              </span>
              <span
                className="text-xs font-bold font-mono px-2 py-1 rounded"
                style={{
                  color: getThreatColor(threat.level),
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                L{threat.level}
              </span>
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: DISPLAY_COLORS.ui.text.muted }}
            >
              类型: {threat.type}
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
        className="text-lg font-bold font-mono"
        style={{ color: DISPLAY_COLORS.ui.text.primary }}
      >
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

/**
 * 未来感顶部控制栏
 */
function FuturisticTopControlBar({
  onToggle2DPanel,
  is2DPanelVisible,
}: {
  onToggle2DPanel: () => void;
  is2DPanelVisible: boolean;
}) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 z-50 border-b shadow-lg backdrop-blur-md"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: DISPLAY_COLORS.corporate.accent,
        height: "64px",
        boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}40`,
      }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.7)",
                color: DISPLAY_COLORS.ui.text.secondary,
                border: `1px solid ${DISPLAY_COLORS.ui.border.primary}`,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-mono">返回</span>
            </button>

            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
                  boxShadow: `0 0 15px ${DISPLAY_COLORS.corporate.accent}60`,
                }}
              >
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1
                  className="text-lg font-bold font-mono"
                  style={{
                    color: DISPLAY_COLORS.ui.text.primary,
                    textShadow: `0 0 5px ${DISPLAY_COLORS.corporate.accent}40`,
                  }}
                >
                  CyberGuard 神经监控中心
                </h1>
                <p
                  className="text-xs font-mono"
                  style={{ color: DISPLAY_COLORS.ui.text.secondary }}
                >
                  Neural Cyber Monitoring Center
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className="px-3 py-1.5 rounded-lg border text-sm font-mono backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.7)",
                borderColor: DISPLAY_COLORS.ui.border.primary,
                color: DISPLAY_COLORS.ui.text.secondary,
              }}
            >
              {currentTime.toLocaleString("zh-CN")}
            </div>

            <button
              onClick={onToggle2DPanel}
              className="p-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: is2DPanelVisible
                  ? DISPLAY_COLORS.corporate.primary
                  : "rgba(30, 41, 59, 0.7)",
                color: is2DPanelVisible
                  ? "white"
                  : DISPLAY_COLORS.ui.text.secondary,
                border: `1px solid ${DISPLAY_COLORS.corporate.accent}`,
                boxShadow: is2DPanelVisible
                  ? `0 0 15px ${DISPLAY_COLORS.corporate.accent}60`
                  : "none",
              }}
              title="切换量子控制台"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 未来感加载屏幕
 */
function FuturisticLoadingScreen() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      <div className="text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto relative"
          style={{
            background: `linear-gradient(45deg, ${DISPLAY_COLORS.corporate.primary}, ${DISPLAY_COLORS.corporate.accent})`,
            boxShadow: `0 0 30px ${DISPLAY_COLORS.corporate.accent}60`,
          }}
        >
          <Brain className="w-10 h-10 text-white animate-pulse" />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: `2px solid transparent`,
              borderTop: `2px solid ${DISPLAY_COLORS.corporate.accent}`,
            }}
          />
        </div>
        <div
          className="text-2xl font-bold mb-3 font-mono"
          style={{
            color: DISPLAY_COLORS.ui.text.primary,
            textShadow: `0 0 10px ${DISPLAY_COLORS.corporate.accent}60`,
          }}
        >
          正在启动神经网络监控中心
        </div>
        <div
          className="text-sm font-mono animate-pulse"
          style={{ color: DISPLAY_COLORS.ui.text.secondary }}
        >
          Neural Network Initialization...
        </div>
      </div>
    </div>
  );
}

/**
 * 主组件 - 未来感网络监控中心
 * Main Component - Futuristic Cyber Monitoring Center
 */
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return <FuturisticLoadingScreen />;
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: DISPLAY_COLORS.ui.background.primary }}
    >
      {/* 未来感顶部控制栏 */}
      <FuturisticTopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
      />

      {/* 3D未来场景容器 */}
      <div
        className={`absolute inset-0 transition-all duration-500`}
        style={{
          top: "64px",
          right: is2DPanelVisible ? "500px" : "0",
        }}
      >
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 25, 50],
              fov: 60,
              near: 0.1,
              far: 1000,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <FuturisticCyberScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={20}
                maxDistance={150}
                dampingFactor={0.05}
                enableDamping
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                autoRotate
                autoRotateSpeed={0.2}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 未来感信息覆盖层 */}
      <FuturisticInfoOverlay />

      {/* 2D未来控制面板 */}
      <Futuristic2DPanel
        isVisible={is2DPanelVisible}
        onToggle={toggle2DPanel}
      />

      {/* 面板切换按钮 */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-l-lg shadow-xl border transition-all duration-500 hover:shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            borderColor: DISPLAY_COLORS.corporate.accent,
            color: DISPLAY_COLORS.ui.text.primary,
            boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}40`,
          }}
          title="打开量子控制台"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* 底部状态栏 */}
      <div
        className={`absolute bottom-0 left-0 border-t p-2 transition-all duration-500 backdrop-blur-md`}
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
          right: is2DPanelVisible ? "500px" : "0",
          height: "40px",
          boxShadow: `0 0 15px ${DISPLAY_COLORS.corporate.accent}20`,
        }}
      >
        <div className="flex justify-between items-center text-sm font-mono">
          <span
            className="font-medium"
            style={{ color: DISPLAY_COLORS.ui.text.secondary }}
          >
            CyberGuard 神经网络监控中心 v3.0
          </span>
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: DISPLAY_COLORS.status.active,
                boxShadow: `0 0 5px ${DISPLAY_COLORS.status.active}`,
              }}
            ></div>
            <span style={{ color: DISPLAY_COLORS.ui.text.secondary }}>
              神经网络运行正常
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
