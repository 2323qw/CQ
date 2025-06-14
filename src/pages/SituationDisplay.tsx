import {
  useState,
  useRef,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Html, Line } from "@react-three/drei";
import {
  Monitor,
  Activity,
  Shield,
  AlertTriangle,
  Zap,
  Globe,
  Server,
  Eye,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Wifi,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  ArrowLeft,
  Maximize2,
  RotateCw,
  Play,
  Pause,
  Target,
  Database,
  Router,
  Smartphone,
  Laptop,
  MapPin,
  Clock,
  Lock,
  Unlock,
  Bug,
  FileX,
  Radio,
  Satellite,
  Building,
  Factory,
  Home,
  Car,
  Layers,
  Radar,
  Microscope,
  Gauge,
  Fingerprint,
  Scan,
  Search,
  CloudLightning,
  Loader,
  ChevronLeft,
  ChevronRight,
  FileText,
  PieChart,
  Map,
  List,
  X,
  Minimize2,
} from "lucide-react";
import {
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Group, Vector3 } from "three";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";
import { BUSINESS_COLORS, UI_THEME } from "@/lib/businessColors";
import {
  EnterpriseBuildings,
  EnterpriseDataCenters,
  EnterpriseNetworkTopology,
  SecurityRadar,
  EnvironmentInfrastructure,
} from "@/components/3d/Business3DComponents";

/**
 * 主3D场景组件
 * Main 3D Scene Component
 */
function MainEnterpriseScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  useFrame((state) => {
    if (sceneRef.current) {
      // 根据威胁等级调整场景亮度
      const threatLevel = realTimeData?.realTimeThreats || 3;
      const intensity = threatLevel > 10 ? 0.8 : 1.0;
      // 这里可以调整整体场景的响应
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 环境基础设施 */}
      <EnvironmentInfrastructure />

      {/* 企业建筑群 */}
      <EnterpriseBuildings />

      {/* 数据中心集群 */}
      <EnterpriseDataCenters />

      {/* 网络拓扑 */}
      <EnterpriseNetworkTopology />

      {/* 安全监控雷达 */}
      <SecurityRadar />

      {/* 星空背景 */}
      <Stars
        radius={150}
        depth={30}
        count={1200}
        factor={1.2}
        saturation={0}
        fade
        speed={0.1}
      />
    </group>
  );
}

/**
 * 前台信息覆盖层
 * Foreground Information Overlay
 */
function EnterpriseInfoOverlay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusCards = useMemo(
    () => [
      {
        title: "威胁检测",
        value: realTimeData?.realTimeThreats || 3,
        icon: Shield,
        color: BUSINESS_COLORS.danger,
        bgColor: "from-red-50 to-red-100",
        borderColor: "border-red-200",
        change: "+2",
        trend: "up",
      },
      {
        title: "拦截攻击",
        value: `${Math.floor((realTimeData?.blockedAttacks || 1247) / 1000)}K`,
        icon: Target,
        color: BUSINESS_COLORS.success,
        bgColor: "from-green-50 to-green-100",
        borderColor: "border-green-200",
        change: "+156",
        trend: "up",
      },
      {
        title: "在线用户",
        value: `${Math.floor((realTimeData?.onlineUsers || 8247) / 1000)}K`,
        icon: Users,
        color: BUSINESS_COLORS.purple,
        bgColor: "from-purple-50 to-purple-100",
        borderColor: "border-purple-200",
        change: "+23",
        trend: "up",
      },
      {
        title: "系统负载",
        value: `${realTimeData?.cpuUsage || 45}%`,
        icon: Cpu,
        color: BUSINESS_COLORS.warning,
        bgColor: "from-orange-50 to-orange-100",
        borderColor: "border-orange-200",
        change: "-5%",
        trend: "down",
      },
    ],
    [realTimeData],
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 企业级顶部状态栏 */}
      <div className="absolute top-20 left-6 right-6 pointer-events-auto">
        <div
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-6"
          style={{ borderRadius: UI_THEME.borderRadius.xl }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  CyberGuard 企业安全运营中心
                </h2>
                <p className="text-sm text-gray-600">
                  Enterprise Security Operations Center
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  系统运行正常
                </span>
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
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

      {/* 左侧性能监控面板 */}
      <PerformanceMonitorPanel realTimeData={realTimeData} />

      {/* 右侧安全状态面板 */}
      <SecurityStatusPanel realTimeData={realTimeData} />
    </div>
  );
}

/**
 * 状态卡片组件
 */
function StatusCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  change,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  change: string;
  trend: "up" | "down";
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-green-600" : "text-blue-600";

  return (
    <div
      className={`bg-gradient-to-br ${bgColor} rounded-lg p-6 border ${borderColor} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" style={{ color }} />
        <div className={`flex items-center text-sm ${trendColor}`}>
          <TrendIcon className="w-4 h-4 mr-1" />
          <span>{change}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-3xl font-bold" style={{ color }}>
          {value}
        </div>
        <div className="text-sm text-gray-600 mt-1">{title}</div>
      </div>
    </div>
  );
}

/**
 * 性能监控面板
 */
function PerformanceMonitorPanel({ realTimeData }: { realTimeData: any }) {
  const performanceMetrics = useMemo(
    () => [
      {
        label: "CPU 使用率",
        value: realTimeData?.cpuUsage || 45,
        color: BUSINESS_COLORS.primary,
        unit: "%",
      },
      {
        label: "内存使用率",
        value: realTimeData?.memoryUsage || 68,
        color: BUSINESS_COLORS.success,
        unit: "%",
      },
      {
        label: "网络延迟",
        value: realTimeData?.networkLatency || 23,
        color: BUSINESS_COLORS.info,
        unit: "ms",
      },
      {
        label: "磁盘使用率",
        value: realTimeData?.diskUsage || 42,
        color: BUSINESS_COLORS.warning,
        unit: "%",
      },
    ],
    [realTimeData],
  );

  return (
    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 w-80">
        <div className="flex items-center mb-6">
          <Activity className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">系统性能监控</h3>
        </div>

        <div className="space-y-5">
          {performanceMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium text-gray-700">
                  {metric.label}
                </span>
                <span className="font-bold" style={{ color: metric.color }}>
                  {metric.value}
                  {metric.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(metric.value, 100)}%`,
                    backgroundColor: metric.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-800 mb-1">
            系���状态
          </div>
          <div className="text-xs text-blue-600">所有服务正常运行</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 安全状态面板
 */
function SecurityStatusPanel({ realTimeData }: { realTimeData: any }) {
  const securityStatus = useMemo(() => {
    const threatLevel = realTimeData?.realTimeThreats || 3;
    if (threatLevel > 15)
      return {
        level: "高危",
        color: "red",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    if (threatLevel > 8)
      return {
        level: "中等",
        color: "yellow",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    return {
      level: "正常",
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }, [realTimeData]);

  return (
    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 w-80">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">安全状态监控</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">威胁等级</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${securityStatus.bgColor} ${securityStatus.borderColor} border`}
            >
              {securityStatus.level}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">防护状态</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
              已启用
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">实时威胁</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
              {realTimeData?.realTimeThreats || 3}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              防火墙状态
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
              正常运行
            </span>
          </div>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">最近活动</div>
          <div className="text-xs text-gray-600 space-y-1">
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
 * 2D信息面板组件
 */
function Enterprise2DPanel({
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
      className={`fixed right-0 top-16 bottom-0 bg-white border-l border-gray-200 transform transition-transform duration-300 z-40 shadow-2xl ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "520px" }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">企业控制面板</h2>
          <p className="text-sm text-gray-600">Enterprise Control Panel</p>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div
        className="p-6 overflow-y-auto"
        style={{ height: "calc(100vh - 180px)" }}
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
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 mb-1">CPU 使用率</div>
          <div className="text-2xl font-bold text-blue-800">
            {realTimeData?.cpuUsage || 45}%
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 mb-1">内存使用���</div>
          <div className="text-2xl font-bold text-green-800">
            {realTimeData?.memoryUsage || 68}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">24小时趋势</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <RechartsLine
                type="monotone"
                dataKey="cpu"
                stroke={BUSINESS_COLORS.primary}
                strokeWidth={2}
                name="CPU"
              />
              <RechartsLine
                type="monotone"
                dataKey="memory"
                stroke={BUSINESS_COLORS.success}
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
 * 指标标签页
 */
function MetricsTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">系统指标</h3>
      <div className="space-y-3">
        {[
          {
            label: "活跃连接",
            value: realTimeData?.activeConnections || 1245,
            unit: "",
          },
          {
            label: "网络流量",
            value: realTimeData?.bandwidthUsage || 65,
            unit: "%",
          },
          {
            label: "威胁检测",
            value: realTimeData?.realTimeThreats || 3,
            unit: "",
          },
          {
            label: "拦截攻击",
            value: realTimeData?.blockedAttacks || 1247,
            unit: "",
          },
        ].map((metric, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {metric.label}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {metric.value}
                {metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 网络标签页
 */
function NetworkTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">网络状态</h3>
      <div className="space-y-3">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 mb-1">在线节点</div>
          <div className="text-xl font-bold text-green-800">
            {realTimeData?.onlineNodes || 47} / {realTimeData?.totalNodes || 50}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 mb-1">网络延迟</div>
          <div className="text-xl font-bold text-blue-800">
            {realTimeData?.networkLatency || 23}ms
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 安全标签页
 */
function SecurityTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">安全事件</h3>
      <div className="space-y-2">
        {[
          { time: "14:23", event: "检测到端口扫描", severity: "medium" },
          { time: "14:15", event: "拦截恶意IP", severity: "high" },
          { time: "14:08", event: "防火墙规则更新", severity: "low" },
          { time: "13:54", event: "异常登录尝试", severity: "medium" },
        ].map((log, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{log.event}</span>
              <span className="text-xs text-gray-500">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 日志���签页
 */
function LogsTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">系统日志</h3>
      <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm max-h-80 overflow-y-auto">
        <div>[2024-01-15 14:23:45] INFO: 系统启动成功</div>
        <div>[2024-01-15 14:23:46] INFO: 加载安全规则...</div>
        <div>[2024-01-15 14:23:47] INFO: 网络监控启动</div>
        <div>[2024-01-15 14:23:48] WARN: 检测到异常流量</div>
        <div>[2024-01-15 14:23:49] INFO: 防火墙拦截成功</div>
        <div>[2024-01-15 14:23:50] INFO: 威胁已处理</div>
      </div>
    </div>
  );
}

/**
 * 拓扑标签页
 */
function MapTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">网络拓扑</h3>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Network className="w-12 h-12 mx-auto mb-2" />
          <div>网络拓扑图</div>
          <div className="text-sm">显示网络架构和连接��态</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 顶部控制栏
 */
function EnterpriseTopControlBar({
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
    <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  CyberGuard 企业态势感知
                </h1>
                <p className="text-sm text-gray-600">
                  Enterprise Security Situation Awareness Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
              <div className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleString("zh-CN")}
              </div>
            </div>

            <button
              onClick={onToggle2DPanel}
              className={`p-2 rounded-lg transition-colors ${
                is2DPanelVisible
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
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
 * 加载屏幕
 */
function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="text-gray-800 text-xl font-bold mb-2">
          加载企业态势感知平台
        </div>
        <div className="text-gray-600 text-sm">正在初始化安全监控系统...</div>
      </div>
    </div>
  );
}

/**
 * 主组件 - 企业态势显示
 * Main Component - Enterprise Situation Display
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
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* 顶部控制栏 */}
      <EnterpriseTopControlBar
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
              position: [0, 25, 50],
              fov: 60,
              near: 0.1,
              far: 400,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <MainEnterpriseScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={15}
                maxDistance={120}
                dampingFactor={0.05}
                enableDamping
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 前台信息覆盖层 */}
      <EnterpriseInfoOverlay />

      {/* 2D信息面板 */}
      <Enterprise2DPanel
        isVisible={is2DPanelVisible}
        onToggle={toggle2DPanel}
      />

      {/* 面板切换按钮 */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-l-lg shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl"
          title="打开企业控制面板"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* 底部状态栏 */}
      <div
        className={`absolute bottom-0 left-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 transition-all duration-300 ${
          is2DPanelVisible ? "right-[520px]" : "right-0"
        }`}
      >
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">
            CyberGuard 企业级网络安全态势感知平台 v2.0
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>系统运行正常</span>
          </div>
        </div>
      </div>
    </div>
  );
}
