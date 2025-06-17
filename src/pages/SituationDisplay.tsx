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
  Box as BoxIcon,
  Grid3X3,
  Layout,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Columns,
  Rows,
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
  Pie,
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
import { useRealTimeAPI } from "@/hooks/useRealTimeAPI";
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

// 视图模式类型定义
type ViewMode = "3d" | "2d" | "split-horizontal" | "split-vertical" | "quad";

// 组件层级定义
const Z_INDEX = {
  background: 0,
  canvas: 10,
  overlay: 20,
  panels: 30,
  controls: 40,
  modals: 50,
  loading: 60,
} as const;

/**
 * 高级3D态势监控场���
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
  // 使用真实API数据，带模拟数据作为fallback
  const {
    data: realTimeData,
    isUsingMockData,
    error: apiError,
  } = useRealTimeAPI({
    interval: sceneConfig.updateInterval || 2000,
    enabled: !sceneConfig.isPaused,
    fallbackToMock: true,
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
      <EnhancedEnvironment />
      <EnhancedQuantumTower />
      <EnhancedNeuralCluster />
      <EnhancedDataFlowSystem />
      <EnhancedQuantumShields />
      <Stars
        radius={sceneConfig.starRadius || 800}
        depth={sceneConfig.starDepth || 150}
        count={sceneConfig.starCount}
        factor={sceneConfig.starFactor || 4}
        saturation={sceneConfig.starSaturation || 0.3}
        fade
        speed={sceneConfig.starSpeed || 0.01}
      />
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
      {config.dataParticles && <DataParticleStream />}
      {config.energyWaves && <EnergyWaveEffect />}
      {config.quantumRipples && <QuantumRippleEffect />}
    </group>
  );
}

function DataParticleStream() {
  return <group />;
}

function EnergyWaveEffect() {
  return <group />;
}

function QuantumRippleEffect() {
  return <group />;
}

/**
 * 2D网络拓扑视图
 */
function NetworkTopologyView({
  realTimeData,
  selectedNode,
  onNodeSelect,
}: {
  realTimeData: any;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}) {
  const nodes = useMemo(
    () => [
      {
        id: "core",
        x: 400,
        y: 300,
        type: "核心",
        status: "active",
        threats: 0,
      },
      {
        id: "node1",
        x: 200,
        y: 150,
        type: "节点A",
        status: "active",
        threats: 2,
      },
      {
        id: "node2",
        x: 600,
        y: 150,
        type: "节点B",
        status: "warning",
        threats: 1,
      },
      {
        id: "node3",
        x: 200,
        y: 450,
        type: "节点C",
        status: "active",
        threats: 0,
      },
      {
        id: "node4",
        x: 600,
        y: 450,
        type: "节点D",
        status: "error",
        threats: 3,
      },
      {
        id: "edge1",
        x: 100,
        y: 300,
        type: "边缘A",
        status: "active",
        threats: 0,
      },
      {
        id: "edge2",
        x: 700,
        y: 300,
        type: "边缘B",
        status: "active",
        threats: 1,
      },
    ],
    [],
  );

  const connections = useMemo(
    () => [
      { from: "core", to: "node1" },
      { from: "core", to: "node2" },
      { from: "core", to: "node3" },
      { from: "core", to: "node4" },
      { from: "node1", to: "edge1" },
      { from: "node2", to: "edge2" },
    ],
    [],
  );

  const getNodeColor = (status: string) => {
    switch (status) {
      case "active":
        return DISPLAY_COLORS.status.active;
      case "warning":
        return DISPLAY_COLORS.status.warning;
      case "error":
        return DISPLAY_COLORS.status.critical;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* 背景网格 */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />

        {/* 连接线 */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={DISPLAY_COLORS.neon.blue}
              strokeWidth="2"
              opacity="0.6"
              strokeDasharray={
                fromNode.status === "error" || toNode.status === "error"
                  ? "5,5"
                  : "none"
              }
            />
          );
        })}

        {/* 网络节点 */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.id === "core" ? 25 : 15}
              fill={getNodeColor(node.status)}
              stroke={
                selectedNode === node.id
                  ? DISPLAY_COLORS.neon.yellow
                  : "transparent"
              }
              strokeWidth="3"
              opacity="0.8"
              className="cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() =>
                onNodeSelect(selectedNode === node.id ? null : node.id)
              }
            />
            {/* 威胁指示器 */}
            {node.threats > 0 && (
              <circle
                cx={node.x + 12}
                cy={node.y - 12}
                r="8"
                fill={DISPLAY_COLORS.status.critical}
                className="animate-pulse"
              />
            )}
            {/* 节点标签 */}
            <text
              x={node.x}
              y={node.y + (node.id === "core" ? 40 : 30)}
              textAnchor="middle"
              fill={DISPLAY_COLORS.ui.text.primary}
              fontSize="12"
              fontFamily="monospace"
            >
              {node.type}
            </text>
            {/* 威胁数量 */}
            {node.threats > 0 && (
              <text
                x={node.x + 12}
                y={node.y - 8}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                {node.threats}
              </text>
            )}
          </g>
        ))}

        {/* 数据流动画 */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <circle
              key={`flow-${index}`}
              r="3"
              fill={DISPLAY_COLORS.neon.cyan}
              opacity="0.8"
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
              />
            </circle>
          );
        })}
      </svg>

      {/* 2D视图控制面板 */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <h3 className="text-white font-bold">网络拓扑图</h3>
          <p className="text-xs text-gray-400">实时网��状态监控</p>
        </div>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-green-400">正常</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-yellow-400">警��</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-red-400">错误</span>
            </div>
          </div>
        </div>
      </div>

      {/* 节点详情面板 */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
          {(() => {
            const node = nodes.find((n) => n.id === selectedNode);
            if (!node) return null;
            return (
              <div>
                <h4 className="text-white font-bold mb-2">{node.type}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">状态:</span>
                    <span style={{ color: getNodeColor(node.status) }}>
                      {node.status === "active"
                        ? "正常"
                        : node.status === "warning"
                          ? "警告"
                          : "错误"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">威胁数:</span>
                    <span className="text-red-400">{node.threats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">位置:</span>
                    <span className="text-white">
                      ({node.x}, {node.y})
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/**
 * 统计图表视图
 */
function StatsChartsView({ realTimeData }: { realTimeData: any }) {
  const chartData = useMemo(() => generateTrendData(), []);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* CPU使用率图表 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-4">CPU使用率趋势</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke={DISPLAY_COLORS.neon.blue}
                fill={`${DISPLAY_COLORS.neon.blue}20`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 内存使用率图表 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-4">内存使用率趋势</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke={DISPLAY_COLORS.neon.green}
                fill={`${DISPLAY_COLORS.neon.green}20`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 网络延迟图表 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-4">网络延迟监控</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <RechartsLine
                type="monotone"
                dataKey="network"
                stroke={DISPLAY_COLORS.neon.purple}
                strokeWidth={2}
                dot={{ fill: DISPLAY_COLORS.neon.purple, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 威胁分布图表 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-4">威胁等级分布</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "低危", value: 35, fill: DISPLAY_COLORS.neon.green },
                  { name: "中危", value: 25, fill: DISPLAY_COLORS.neon.yellow },
                  { name: "高危", value: 15, fill: DISPLAY_COLORS.neon.orange },
                  { name: "严重", value: 5, fill: DISPLAY_COLORS.neon.red },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/**
 * 视图模式选择器
 */
function ViewModeSelector({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const modes = [
    {
      id: "3d" as ViewMode,
      label: "3D视图",
      icon: BoxIcon,
      desc: "立体态势展示",
    },
    { id: "2d" as ViewMode, label: "2D视图", icon: Map, desc: "平面拓扑图" },
    {
      id: "split-horizontal" as ViewMode,
      label: "水平分屏",
      icon: SplitSquareHorizontal,
      desc: "上下分屏",
    },
    {
      id: "split-vertical" as ViewMode,
      label: "垂直分屏",
      icon: SplitSquareVertical,
      desc: "左右分屏",
    },
    {
      id: "quad" as ViewMode,
      label: "四分屏",
      icon: Grid3X3,
      desc: "四��限视图",
    },
  ];

  return (
    <div className="flex items-center space-x-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              viewMode === mode.id
                ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/40"
                : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
            title={mode.desc}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {mode.label}
            </span>

            {/* 工具提示 */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {mode.desc}
            </div>
          </button>
        );
      })}
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
  viewMode,
  onViewModeChange,
}: {
  onToggle2DPanel: () => void;
  is2DPanelVisible: boolean;
  sceneConfig: any;
  onConfigChange: (config: any) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="absolute top-0 left-0 right-0 h-20 border-b backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(10, 14, 26, 0.9)",
        borderColor: DISPLAY_COLORS.ui.border.primary,
        zIndex: Z_INDEX.controls,
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
            CyberGuard 态势监控中心
          </div>
        </div>

        {/* 视图模式选择器 */}
        <div className="flex items-center space-x-4">
          <ViewModeSelector
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
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

/**
 * 多视图容器组件
 */
function MultiViewContainer({
  viewMode,
  sceneConfig,
  selectedNode,
  onNodeSelect,
  realTimeData,
}: {
  viewMode: ViewMode;
  sceneConfig: any;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  realTimeData: any;
}) {
  const renderView = (
    viewType: "3d" | "2d" | "charts",
    containerStyle: any = {},
  ) => {
    const baseStyle = {
      position: "relative" as const,
      overflow: "hidden" as const,
      ...containerStyle,
    };

    if (viewType === "3d") {
      return (
        <div style={baseStyle}>
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
                  onNodeSelect={onNodeSelect}
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
      );
    }

    if (viewType === "2d") {
      return (
        <div style={baseStyle}>
          <NetworkTopologyView
            realTimeData={realTimeData}
            selectedNode={selectedNode}
            onNodeSelect={onNodeSelect}
          />
        </div>
      );
    }

    if (viewType === "charts") {
      return (
        <div style={baseStyle}>
          <StatsChartsView realTimeData={realTimeData} />
        </div>
      );
    }

    return null;
  };

  // 单视图模式
  if (viewMode === "3d" || viewMode === "2d") {
    return (
      <div
        className="absolute inset-0"
        style={{ top: "80px", zIndex: Z_INDEX.canvas }}
      >
        {renderView(viewMode, { width: "100%", height: "100%" })}
      </div>
    );
  }

  // 水平分屏
  if (viewMode === "split-horizontal") {
    return (
      <div
        className="absolute inset-0 flex flex-col"
        style={{ top: "80px", zIndex: Z_INDEX.canvas }}
      >
        <div className="flex-1 border-b border-gray-600">
          {renderView("3d", { width: "100%", height: "100%" })}
        </div>
        <div className="flex-1">
          {renderView("2d", { width: "100%", height: "100%" })}
        </div>
      </div>
    );
  }

  // 垂直分屏
  if (viewMode === "split-vertical") {
    return (
      <div
        className="absolute inset-0 flex"
        style={{ top: "80px", zIndex: Z_INDEX.canvas }}
      >
        <div className="flex-1 border-r border-gray-600">
          {renderView("3d", { width: "100%", height: "100%" })}
        </div>
        <div className="flex-1">
          {renderView("2d", { width: "100%", height: "100%" })}
        </div>
      </div>
    );
  }

  // 四分屏
  if (viewMode === "quad") {
    return (
      <div
        className="absolute inset-0 grid grid-cols-2 gap-1"
        style={{ top: "80px", padding: "4px", zIndex: Z_INDEX.canvas }}
      >
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {renderView("3d", { width: "100%", height: "100%" })}
        </div>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {renderView("2d", { width: "100%", height: "100%" })}
        </div>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {renderView("charts", { width: "100%", height: "100%" })}
        </div>
        <div className="bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Monitor className="w-12 h-12 mx-auto mb-4" />
            <p>系统状态监控</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU:</span>
                <span className="text-neon-blue">
                  {realTimeData?.cpuUsage || 68}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>内存:</span>
                <span className="text-neon-green">
                  {realTimeData?.memoryUsage || 78}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>网络:</span>
                <span className="text-neon-purple">
                  {realTimeData?.networkLatency || 23}ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * 侧边面板组件
 */
function SidePanel({
  side,
  isVisible,
  realTimeData,
  selectedNode,
  onNodeSelect,
}: {
  side: "left" | "right";
  isVisible: boolean;
  realTimeData: any;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}) {
  if (!isVisible) return null;

  const panelStyle = {
    position: "fixed" as const,
    top: "80px",
    bottom: "60px",
    width: "300px",
    [side]: "8px",
    zIndex: Z_INDEX.panels,
  };

  return (
    <div className="quantum-card p-4" style={panelStyle}>
      {side === "left" ? (
        <div>
          <h3 className="text-lg font-bold font-orbitron neon-text-blue mb-4">
            神经网络监控
          </h3>
          <div className="space-y-4">
            {/* 简化的神经网络指标 */}
            <div className="neural-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">传输延迟</span>
                <span className="text-neon-blue font-mono">
                  {realTimeData?.networkLatency || 23}ms
                </span>
              </div>
              <div className="neural-progress">
                <div
                  className="neural-progress-fill"
                  style={{
                    width: `${Math.min(realTimeData?.networkLatency || 23, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="neural-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">处理器负载</span>
                <span className="text-neon-green font-mono">
                  {realTimeData?.cpuUsage || 68}%
                </span>
              </div>
              <div className="neural-progress">
                <div
                  className="neural-progress-fill"
                  style={{ width: `${realTimeData?.cpuUsage || 68}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-bold font-orbitron neon-text-red mb-4">
            威胁分析
          </h3>
          <div className="space-y-3">
            {/* 简化的威胁列表 */}
            <div className="neural-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">量子干扰攻击</span>
                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                  LV.9
                </span>
              </div>
              <div className="text-xs text-gray-400">14:23:45 | 深空信号</div>
            </div>

            <div className="neural-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">神经病毒入侵</span>
                <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">
                  LV.7
                </span>
              </div>
              <div className="text-xs text-gray-400">14:20:12 | 内部网络</div>
            </div>
          </div>
        </div>
      )}
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
  const { data: realTimeData } = useRealTimeAPI({
    interval: 1000,
    enabled: !sceneConfig.isPaused,
    fallbackToMock: true,
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

  if (!isVisible) return null;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 border-l transform transition-transform duration-500 quantum-card"
      style={{
        width: "min(35vw, 600px)",
        minWidth: "480px",
        borderColor: DISPLAY_COLORS.corporate.accent,
        backgroundColor: "rgba(10, 14, 26, 0.95)",
        zIndex: Z_INDEX.panels,
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

      {/* 标签页 */}
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

      {/* 内容区域 */}
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
                <option value="medium">中等质���</option>
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
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundColor: DISPLAY_COLORS.ui.background.primary,
        zIndex: Z_INDEX.loading,
      }}
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

export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [showSidePanels, setShowSidePanels] = useState(true);

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

  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: !sceneConfig.isPaused,
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

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    // 根据视图模式自动调整侧边面板显示
    if (
      mode === "quad" ||
      mode === "split-horizontal" ||
      mode === "split-vertical"
    ) {
      setShowSidePanels(false);
      setIs2DPanelVisible(false);
    } else {
      setShowSidePanels(true);
    }
  }, []);

  if (isLoading) {
    return <OptimizedLoadingScreen />;
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden matrix-background"
      style={{
        backgroundColor: DISPLAY_COLORS.ui.background.primary,
        zIndex: Z_INDEX.background,
      }}
    >
      {/* 优化版顶部控制栏 */}
      <OptimizedTopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
        sceneConfig={sceneConfig}
        onConfigChange={handleConfigChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* 多视图容器 */}
      <MultiViewContainer
        viewMode={viewMode}
        sceneConfig={sceneConfig}
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
        realTimeData={realTimeData}
      />

      {/* 侧边面板（仅在非分屏模式下显示） */}
      {showSidePanels && (
        <>
          <SidePanel
            side="left"
            isVisible={viewMode === "3d" || viewMode === "2d"}
            realTimeData={realTimeData}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
          />
          <SidePanel
            side="right"
            isVisible={viewMode === "3d" || viewMode === "2d"}
            realTimeData={realTimeData}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
          />
        </>
      )}

      {/* 高级2D控制面板 */}
      <Advanced2DPanel
        isVisible={is2DPanelVisible}
        onToggle={toggle2DPanel}
        sceneConfig={sceneConfig}
        onConfigChange={handleConfigChange}
      />

      {/* 面板切换按钮（仅在未显示控制面板时显示） */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 quantum-button p-4 rounded-l-xl quantum-ripple"
          style={{ zIndex: Z_INDEX.controls }}
          title="打开量子控制台"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* 底部状态栏 */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t backdrop-blur-md transition-all duration-500"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderColor: DISPLAY_COLORS.ui.border.primary,
          height: "60px",
          boxShadow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}20`,
          zIndex: Z_INDEX.overlay,
        }}
      >
        <div className="flex justify-between items-center h-full px-6 text-sm font-rajdhani">
          <div className="flex items-center space-x-6">
            <span className="font-medium text-white">
              CyberGuard 神经网络监控中心 v5.0 | 视图:{" "}
              {viewMode === "3d"
                ? "3D立体"
                : viewMode === "2d"
                  ? "2D平面"
                  : viewMode === "split-horizontal"
                    ? "水平分屏"
                    : viewMode === "split-vertical"
                      ? "垂直分屏"
                      : "四分屏"}
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
                节点: {selectedNode ? "已选中" : "未选中"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
