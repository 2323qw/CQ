import { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
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
  Maximize2,
  RotateCw,
  Play,
  Pause,
} from "lucide-react";
import { UltraCyberSecurityModel } from "@/components/3d/UltraCyberSecurityModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateThreatMetrics,
} from "@/hooks/useRealTimeData";

// 3D网络节点组件
function NetworkNode({
  position,
  status,
  nodeType,
  label,
}: {
  position: [number, number, number];
  status: "online" | "warning" | "critical" | "offline";
  nodeType: "server" | "firewall" | "router" | "endpoint";
  label: string;
}) {
  const meshRef = useRef<any>(null);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "#00ff88";
      case "warning":
        return "#ffaa00";
      case "critical":
        return "#ff3366";
      case "offline":
        return "#666666";
    }
  };

  const getNodeGeometry = () => {
    switch (nodeType) {
      case "server":
        return <boxGeometry args={[0.2, 0.3, 0.2]} />;
      case "firewall":
        return <octahedronGeometry args={[0.15, 0]} />;
      case "router":
        return <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />;
      case "endpoint":
        return <sphereGeometry args={[0.08, 8, 8]} />;
    }
  };

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        {getNodeGeometry()}
        <meshStandardMaterial
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 节点标签 */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.08}
        color={getStatusColor()}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* 状态光环 */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 16]} />
        <meshBasicMaterial color={getStatusColor()} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// 3D威胁指示器
function ThreatIndicator({
  position,
  severity,
  threatType,
}: {
  position: [number, number, number];
  severity: "low" | "medium" | "high" | "critical";
  threatType: string;
}) {
  const getSeverityColor = () => {
    switch (severity) {
      case "low":
        return "#00ff88";
      case "medium":
        return "#ffaa00";
      case "high":
        return "#ff6600";
      case "critical":
        return "#ff0033";
    }
  };

  return (
    <group position={position}>
      <mesh>
        <tetrahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color={getSeverityColor()}
          emissive={getSeverityColor()}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Text
        position={[0, -0.3, 0]}
        fontSize={0.06}
        color={getSeverityColor()}
        anchorX="center"
        anchorY="middle"
      >
        {threatType}
      </Text>
    </group>
  );
}

// 3D数据流
function DataFlow({
  start,
  end,
  color = "#00f5ff",
  speed = 1,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  speed?: number;
}) {
  const dataPacketRef = useRef<any>(null);

  return (
    <group>
      {/* 数据流路径 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([...start, ...end])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>

      {/* 移动数据包 */}
      <mesh ref={dataPacketRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// 3D态势场景
function SituationScene() {
  const { data: realTimeData } = useRealTimeData(generateThreatMetrics, {
    interval: 3000,
    enabled: true,
  });

  // 模拟网络节点数据
  const networkNodes = [
    {
      id: 1,
      position: [3, 1, 2] as [number, number, number],
      status: "online" as const,
      type: "server" as const,
      label: "Web服务器",
    },
    {
      id: 2,
      position: [-3, 2, 1] as [number, number, number],
      status: "warning" as const,
      type: "firewall" as const,
      label: "防火墙",
    },
    {
      id: 3,
      position: [2, -1, -3] as [number, number, number],
      status: "online" as const,
      type: "router" as const,
      label: "核心路由",
    },
    {
      id: 4,
      position: [-2, -2, 3] as [number, number, number],
      status: "critical" as const,
      type: "endpoint" as const,
      label: "终端设备",
    },
    {
      id: 5,
      position: [0, 3, -2] as [number, number, number],
      status: "online" as const,
      type: "server" as const,
      label: "数据库",
    },
    {
      id: 6,
      position: [4, 0, 0] as [number, number, number],
      status: "online" as const,
      type: "firewall" as const,
      label: "边界防护",
    },
  ];

  // 模拟威胁数据
  const threats = [
    {
      id: 1,
      position: [-1, 2, 2] as [number, number, number],
      severity: "high" as const,
      type: "DDoS攻击",
    },
    {
      id: 2,
      position: [1, -1, 1] as [number, number, number],
      severity: "medium" as const,
      type: "异常访问",
    },
    {
      id: 3,
      position: [-2, 0, -1] as [number, number, number],
      severity: "low" as const,
      type: "扫描行为",
    },
  ];

  return (
    <group>
      {/* 环境光照 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f5ff" />

      {/* 中央量子核心 */}
      <UltraCyberSecurityModel />

      {/* 网络节点 */}
      {networkNodes.map((node) => (
        <NetworkNode
          key={node.id}
          position={node.position}
          status={node.status}
          nodeType={node.type}
          label={node.label}
        />
      ))}

      {/* 威胁指示器 */}
      {threats.map((threat) => (
        <ThreatIndicator
          key={threat.id}
          position={threat.position}
          severity={threat.severity}
          threatType={threat.type}
        />
      ))}

      {/* 背景网格 */}
      <gridHelper args={[20, 20, "#333333", "#1a1a1a"]} />
    </group>
  );
}

// 状态面板组件
function StatusPanel() {
  const { data: realTimeData } = useRealTimeData(generateThreatMetrics, {
    interval: 2000,
    enabled: true,
  });

  const statusItems = [
    {
      label: "网络状态",
      value: realTimeData?.networkStatus || "正常",
      icon: Globe,
      color: "text-neon-green",
      bgColor: "bg-neon-green/10",
    },
    {
      label: "活跃威胁",
      value: realTimeData?.realTimeThreats?.toString() || "3",
      icon: AlertTriangle,
      color: "text-threat-high",
      bgColor: "bg-threat-high/10",
    },
    {
      label: "在线节点",
      value: `${realTimeData?.onlineNodes || 47}/${realTimeData?.totalNodes || 50}`,
      icon: Server,
      color: "text-neon-blue",
      bgColor: "bg-neon-blue/10",
    },
    {
      label: "系统负载",
      value: `${realTimeData?.systemHealth || 68}%`,
      icon: Activity,
      color: "text-neon-orange",
      bgColor: "bg-neon-orange/10",
    },
  ];

  return (
    <div className="absolute top-4 left-4 z-10 space-y-4">
      <div className="cyber-card p-4 bg-matrix-surface/90 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-neon-blue" />
          <span>3D态势监控</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {statusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg p-3 border border-opacity-30`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <div className={`font-mono font-bold ${item.color}`}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 威胁等级面板 */}
      <div className="cyber-card p-4 bg-matrix-surface/90 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-neon-green" />
          <span>威胁等级分布</span>
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-threat-critical">严重</span>
            <span className="text-xs font-mono text-threat-critical">
              {realTimeData?.threatLevels?.critical || 1}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-threat-high">高危</span>
            <span className="text-xs font-mono text-threat-high">
              {realTimeData?.threatLevels?.high || 2}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-threat-medium">中等</span>
            <span className="text-xs font-mono text-threat-medium">
              {realTimeData?.threatLevels?.medium || 5}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-threat-low">低危</span>
            <span className="text-xs font-mono text-threat-low">
              {realTimeData?.threatLevels?.low || 12}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 控制面板组件
function ControlPanel() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [cameraMode, setCameraMode] = useState<"free" | "orbit">("orbit");

  const controlButtons = [
    {
      icon: isPlaying ? Pause : Play,
      label: isPlaying ? "暂停" : "播放",
      onClick: () => setIsPlaying(!isPlaying),
      active: isPlaying,
    },
    {
      icon: RotateCw,
      label: "重置视角",
      onClick: () => {
        // 重置相机位置的逻辑
      },
      active: false,
    },
    {
      icon: Eye,
      label: showGrid ? "隐藏网格" : "显示网格",
      onClick: () => setShowGrid(!showGrid),
      active: showGrid,
    },
    {
      icon: Maximize2,
      label: "全屏模式",
      onClick: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      },
      active: false,
    },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="cyber-card p-3 bg-matrix-surface/90 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          {controlButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={button.onClick}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  button.active
                    ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                    : "text-muted-foreground hover:text-white hover:bg-matrix-accent"
                }`}
                title={button.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 信息面板组件
function InfoPanel() {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="cyber-card p-4 bg-matrix-surface/90 backdrop-blur-sm max-w-sm">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-neon-orange" />
          <span>态势���息</span>
        </h3>

        <div className="space-y-3 text-sm">
          <div className="border-l-2 border-neon-blue pl-3">
            <div className="text-neon-blue font-semibold">网络拓扑</div>
            <div className="text-muted-foreground">
              实时显示网络设备连接状态和数据流向
            </div>
          </div>

          <div className="border-l-2 border-threat-high pl-3">
            <div className="text-threat-high font-semibold">威胁态势</div>
            <div className="text-muted-foreground">
              3D可视化展示当前检测到的安全威胁
            </div>
          </div>

          <div className="border-l-2 border-neon-green pl-3">
            <div className="text-neon-green font-semibold">防护状态</div>
            <div className="text-muted-foreground">
              显示防火墙、入侵检测等安全组件状态
            </div>
          </div>

          <div className="border-l-2 border-neon-orange pl-3">
            <div className="text-neon-orange font-semibold">性能监控</div>
            <div className="text-muted-foreground">
              监控系统资源使用情况和网络流量
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-matrix-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">最后更新:</span>
            <span className="text-neon-blue font-mono">
              {realTimeData?.lastUpdate ||
                new Date().toLocaleTimeString("zh-CN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 主要的3D态势展示页面
export default function SituationDisplay() {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* 主要的3D场景 */}
      <div className="absolute inset-0">
        <ThreeErrorBoundary>
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center bg-matrix-bg">
                <div className="text-center space-y-4">
                  <SimpleShield />
                  <div className="text-neon-blue font-mono">
                    加载3D态势展示场景...
                  </div>
                </div>
              </div>
            }
          >
            <Canvas
              camera={{ position: [12, 8, 12], fov: 60 }}
              style={{ background: "transparent" }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              {/* ��空背景 */}
              <Stars
                radius={200}
                depth={100}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.2}
              />

              {/* 相机控制 */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.3}
                maxDistance={30}
                minDistance={5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 6}
              />

              {/* 3D态势场景 */}
              <SituationScene />

              {/* 雾效 */}
              <fog attach="fog" args={["#0d1117", 15, 50]} />
            </Canvas>
          </Suspense>
        </ThreeErrorBoundary>
      </div>

      {/* UI 覆盖层 */}
      <StatusPanel />
      <InfoPanel />
      <ControlPanel />

      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-matrix-bg/90 via-transparent to-matrix-bg/90 pointer-events-none" />
    </div>
  );
}
