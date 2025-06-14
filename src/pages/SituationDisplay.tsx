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
import {
  Vector3,
  Color,
  Mesh,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  AdditiveBlending,
  BoxHelper,
  PointLight,
  SpotLight,
  DirectionalLight,
  InstancedMesh,
  Object3D,
  Matrix4,
  MeshStandardMaterial,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  Quaternion,
  Euler,
  LOD,
} from "three";
import { SituationMonitoringModel } from "@/components/3d/SituationMonitoringModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

// 企业级配色方案
const BUSINESS_COLORS = {
  primary: "#2563eb",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0891b2",
  purple: "#9333ea",
  indigo: "#4f46e5",
  slate: "#64748b",
};

// 简化的3D建筑组件
function SimplifiedBuildings() {
  const buildingsRef = useRef<Group>(null);

  const buildings = useMemo(() => {
    const buildingData = [];
    const positions = [
      [30, 0, 30],
      [-30, 0, 30],
      [30, 0, -30],
      [-30, 0, -30],
      [50, 0, 0],
      [-50, 0, 0],
      [0, 0, 50],
      [0, 0, -50],
    ];

    positions.forEach((pos, i) => {
      buildingData.push({
        position: pos,
        height: 10 + Math.random() * 20,
        color: i % 2 === 0 ? BUSINESS_COLORS.primary : BUSINESS_COLORS.success,
      });
    });

    return buildingData;
  }, []);

  useFrame((state) => {
    if (buildingsRef.current) {
      buildingsRef.current.rotation.y = state.clock.getElapsedTime() * 0.001;
    }
  });

  return (
    <group ref={buildingsRef}>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={[...building.position, building.height / 2]}
        >
          <boxGeometry args={[4, building.height, 4]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
    </group>
  );
}

// 简化的数据中心
function SimplifiedDataCenter() {
  const servers = useMemo(() => {
    return [
      { pos: [-40, 4, 0], color: BUSINESS_COLORS.info },
      { pos: [40, 4, 0], color: BUSINESS_COLORS.success },
      { pos: [0, 4, 40], color: BUSINESS_COLORS.purple },
    ];
  }, []);

  return (
    <group>
      {servers.map((server, index) => (
        <group key={index} position={server.pos}>
          <mesh>
            <boxGeometry args={[6, 8, 2]} />
            <meshStandardMaterial color={server.color} />
          </mesh>
          <Text
            position={[0, 6, 0]}
            fontSize={1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            数据中心 {index + 1}
          </Text>
        </group>
      ))}
    </group>
  );
}

// 简化的网络拓扑
function SimplifiedNetwork() {
  const networkRef = useRef<Group>(null);

  const nodes = useMemo(() => {
    return [
      {
        pos: [0, 8, 0],
        size: 1.5,
        color: BUSINESS_COLORS.primary,
        name: "核心",
      },
      {
        pos: [15, 4, 0],
        size: 1,
        color: BUSINESS_COLORS.success,
        name: "节点1",
      },
      {
        pos: [-15, 4, 0],
        size: 1,
        color: BUSINESS_COLORS.success,
        name: "节点2",
      },
      {
        pos: [0, 4, 15],
        size: 1,
        color: BUSINESS_COLORS.success,
        name: "节点3",
      },
      {
        pos: [0, 4, -15],
        size: 1,
        color: BUSINESS_COLORS.success,
        name: "节点4",
      },
    ];
  }, []);

  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={networkRef}>
      {nodes.map((node, index) => (
        <group key={index} position={node.pos}>
          <mesh>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshStandardMaterial color={node.color} />
          </mesh>
          {index > 0 && (
            <Line
              points={[new Vector3(...node.pos), new Vector3(0, 8, 0)]}
              color={node.color}
              lineWidth={2}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// 简化的安全雷达
function SimplifiedRadar() {
  const radarRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={radarRef} position={[0, 5, 0]}>
      <mesh>
        <cylinderGeometry args={[6, 6, 0.2, 32]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary}
          transparent
          opacity={0.3}
        />
      </mesh>
      <Html position={[0, 2, 0]} transform>
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-center shadow-lg">
          <div className="text-sm font-semibold text-gray-800">安全雷达</div>
          <div className="text-lg font-bold text-red-600">
            {realTimeData?.realTimeThreats || 3}
          </div>
          <div className="text-xs text-gray-600">活跃威胁</div>
        </div>
      </Html>
    </group>
  );
}

// 简化的主场景
function SimplifiedMainScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  return (
    <group ref={sceneRef}>
      {/* 基础光照 */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[20, 30, 20]} intensity={1} color="#ffffff" />
      <pointLight
        position={[0, 15, 0]}
        intensity={0.8}
        color={BUSINESS_COLORS.primary}
      />

      {/* 简化组件 */}
      <SimplifiedBuildings />
      <SimplifiedDataCenter />
      <SimplifiedNetwork />
      <SimplifiedRadar />

      {/* 基础平台 */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[60, 60, 0.2, 32]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.5} />
      </mesh>

      {/* 网格 */}
      <gridHelper
        args={[120, 60, "#cbd5e1", "#e2e8f0"]}
        position={[0, -0.9, 0]}
      />

      {/* 星空背景 */}
      <Stars
        radius={100}
        depth={20}
        count={1000}
        factor={1}
        saturation={0}
        fade
        speed={0.1}
      />
    </group>
  );
}

// 2D信息覆盖层
function ForegroundInfoOverlay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 顶部信息条 */}
      <div className="absolute top-20 left-6 right-6 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              CyberGuard 企业安全运营中心
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">系统运行正常</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <Shield className="w-8 h-8 text-blue-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-800">
                    {realTimeData?.realTimeThreats || 3}
                  </div>
                  <div className="text-sm text-blue-600">威胁检测</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-green-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-800">
                    {Math.floor((realTimeData?.blockedAttacks || 1247) / 1000)}K
                  </div>
                  <div className="text-sm text-green-600">拦截攻击</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-800">
                    {Math.floor((realTimeData?.onlineUsers || 8247) / 1000)}K
                  </div>
                  <div className="text-sm text-purple-600">在线用户</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <Cpu className="w-8 h-8 text-orange-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-800">
                    {realTimeData?.cpuUsage || 45}%
                  </div>
                  <div className="text-sm text-orange-600">CPU使用率</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 左侧性能监控 */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 w-80">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className="font-semibold text-gray-800">系统性能监控</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">CPU 使用率</span>
                <span className="font-semibold text-blue-600">
                  {realTimeData?.cpuUsage || 45}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${realTimeData?.cpuUsage || 45}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">内存使用率</span>
                <span className="font-semibold text-green-600">
                  {realTimeData?.memoryUsage || 68}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${realTimeData?.memoryUsage || 68}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧安全状态 */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 w-80">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-red-600 mr-3" />
            <h3 className="font-semibold text-gray-800">安全状态监控</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                威胁等级
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                中等
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                防护状态
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                已启用
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2D面板组件
function InfoPanel2D({
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

  const chartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${((new Date().getHours() - 23 + i) % 24).toString().padStart(2, "0")}:00`,
      cpu: 30 + Math.random() * 40,
      memory: 40 + Math.random() * 35,
      network: 20 + Math.random() * 60,
    }));
  }, []);

  return (
    <div
      className={`fixed right-0 top-16 bottom-0 bg-white border-l border-gray-200 transform transition-transform duration-300 z-40 shadow-2xl ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "480px" }}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">企业控制面板</h2>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">CPU 使用率</div>
            <div className="text-2xl font-bold text-blue-800">
              {realTimeData?.cpuUsage || 45}%
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">内存使用率</div>
            <div className="text-2xl font-bold text-green-800">
              {realTimeData?.memoryUsage || 68}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">性能趋势</h3>
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
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="CPU"
                />
                <RechartsLine
                  type="monotone"
                  dataKey="memory"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="内存"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// 顶部控制栏
function TopControlBar({
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
              <Globe className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  CyberGuard 企业态势感知
                </h1>
                <p className="text-sm text-gray-600">
                  Enterprise Security Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-600">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>

            <button
              onClick={onToggle2DPanel}
              className={`p-2 rounded-lg transition-colors ${
                is2DPanelVisible
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加载屏幕
function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <div className="text-gray-800 text-lg font-bold mb-2">
          加载企业态势感知平台
        </div>
        <div className="text-gray-600 text-sm">正在启动安全监控系统...</div>
      </div>
    </div>
  );
}

// 主组件
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearInterval(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <TopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
      />

      <div
        className={`absolute inset-0 pt-16 transition-all duration-300 ${
          is2DPanelVisible ? "pr-[480px]" : "pr-0"
        }`}
      >
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 20, 40],
              fov: 60,
              near: 0.1,
              far: 300,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <SimplifiedMainScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={10}
                maxDistance={100}
                dampingFactor={0.05}
                enableDamping
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      <ForegroundInfoOverlay />

      <InfoPanel2D isVisible={is2DPanelVisible} onToggle={toggle2DPanel} />

      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-l-lg shadow-xl border border-gray-200 transition-all duration-300"
          title="打开企业控制面板"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        className={`absolute bottom-0 left-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 transition-all duration-300 ${
          is2DPanelVisible ? "right-[480px]" : "right-0"
        }`}
      >
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>CyberGuard 企业级网络安全态势感知平台</span>
          <span>系统运行正常</span>
        </div>
      </div>
    </div>
  );
}
