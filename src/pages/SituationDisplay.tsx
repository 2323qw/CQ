import { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Html } from "@react-three/drei";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SituationMonitoringModel } from "@/components/3d/SituationMonitoringModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

// 3D信息面板组件
function InfoPanel3D({
  position,
  title,
  data,
  color,
}: {
  position: [number, number, number];
  title: string;
  data: Array<{ label: string; value: string | number }>;
  color: string;
}) {
  return (
    <group position={position}>
      <Html
        transform
        occlude
        style={{
          background: "rgba(13, 17, 23, 0.9)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${color}`,
          borderRadius: "12px",
          padding: "16px",
          color: "white",
          fontFamily: "monospace",
          fontSize: "12px",
          minWidth: "200px",
          boxShadow: `0 0 20px ${color}30`,
        }}
      >
        <div>
          <h3
            style={{
              color: color,
              marginBottom: "12px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {title}
          </h3>
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#9ca3af" }}>{item.label}:</span>
              <span style={{ color: "white", fontWeight: "bold" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Html>
    </group>
  );
}

// 3D威胁指示器
function ThreatIndicator3D({
  position,
  level,
  count,
}: {
  position: [number, number, number];
  level: "critical" | "high" | "medium" | "low";
  count: number;
}) {
  const threatRef = useRef<any>(null);

  const getColor = () => {
    switch (level) {
      case "critical":
        return "#ff0033";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffaa00";
      case "low":
        return "#00ff88";
    }
  };

  const getSize = () => {
    switch (level) {
      case "critical":
        return 0.3;
      case "high":
        return 0.25;
      case "medium":
        return 0.2;
      case "low":
        return 0.15;
    }
  };

  return (
    <group position={position}>
      <mesh ref={threatRef}>
        <icosahedronGeometry args={[getSize(), 1]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      <Text
        position={[0, getSize() + 0.3, 0]}
        fontSize={0.1}
        color={getColor()}
        anchorX="center"
        anchorY="middle"
      >
        {level.toUpperCase()}
      </Text>

      <Text
        position={[0, getSize() + 0.15, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {count}
      </Text>

      {/* 威胁光环 */}
      <mesh>
        <ringGeometry args={[getSize() * 1.5, getSize() * 2, 16]} />
        <meshBasicMaterial
          color={getColor()}
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>
    </group>
  );
}

// 3D网络节点
function NetworkNode3D({
  position,
  status,
  label,
}: {
  position: [number, number, number];
  status: "online" | "warning" | "offline";
  label: string;
}) {
  const getColor = () => {
    switch (status) {
      case "online":
        return "#00ff88";
      case "warning":
        return "#ffaa00";
      case "offline":
        return "#666666";
    }
  };

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={0.4}
        />
      </mesh>

      <Text
        position={[0, 0.4, 0]}
        fontSize={0.08}
        color={getColor()}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* 状态指示器 */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={getColor()} />
      </mesh>
    </group>
  );
}

// 3D数据流
function DataFlow3D({
  start,
  end,
  color,
  label,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  label: string;
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
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </line>

      {/* 标签 */}
      <Text
        position={[
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2 + 0.3,
          (start[2] + end[2]) / 2,
        ]}
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// 3D态势场景
function SituationScene3D() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  // 威胁分布数据
  const threats = [
    {
      level: "critical" as const,
      count: 2,
      position: [6, 2, 2] as [number, number, number],
    },
    {
      level: "high" as const,
      count: 5,
      position: [-6, 2, -2] as [number, number, number],
    },
    {
      level: "medium" as const,
      count: 12,
      position: [4, 1, -4] as [number, number, number],
    },
    {
      level: "low" as const,
      count: 18,
      position: [-4, 1, 4] as [number, number, number],
    },
  ];

  // 网络节点数据
  const networkNodes = [
    {
      position: [8, 0, 0] as [number, number, number],
      status: "online" as const,
      label: "Web服务器",
    },
    {
      position: [-8, 0, 0] as [number, number, number],
      status: "warning" as const,
      label: "数据库",
    },
    {
      position: [0, 0, 8] as [number, number, number],
      status: "online" as const,
      label: "路由器",
    },
    {
      position: [0, 0, -8] as [number, number, number],
      status: "online" as const,
      label: "防火墙",
    },
  ];

  // 信息面板数据
  const infoPanels = [
    {
      position: [12, 4, 0] as [number, number, number],
      title: "系统性能监控",
      color: "#00f5ff",
      data: [
        { label: "CPU使用率", value: `${realTimeData?.cpuUsage || 68}%` },
        { label: "内存使用", value: `${realTimeData?.memoryUsage || 72}%` },
        { label: "磁盘使用", value: `${realTimeData?.diskUsage || 45}%` },
        { label: "网络延迟", value: `${realTimeData?.networkLatency || 25}ms` },
      ],
    },
    {
      position: [-12, 4, 0] as [number, number, number],
      title: "网络流量统计",
      color: "#ff6b00",
      data: [
        {
          label: "入站流量",
          value: `${realTimeData?.inboundTraffic || 85} MB/s`,
        },
        {
          label: "出站流量",
          value: `${realTimeData?.outboundTraffic || 92} MB/s`,
        },
        {
          label: "峰值入站",
          value: `${realTimeData?.peakInbound || 120} MB/s`,
        },
        { label: "带宽使用", value: `${realTimeData?.bandwidthUsage || 65}%` },
      ],
    },
    {
      position: [0, 6, 8] as [number, number, number],
      title: "安全状态",
      color: "#00ff88",
      data: [
        { label: "防火墙状态", value: realTimeData?.firewallStatus || "正常" },
        {
          label: "已拦截攻击",
          value: realTimeData?.blockedAttacks?.toLocaleString() || "1,247",
        },
        {
          label: "活跃连接",
          value: realTimeData?.activeConnections?.toLocaleString() || "1,847",
        },
        { label: "实时威胁", value: realTimeData?.realTimeThreats || 3 },
      ],
    },
  ];

  return (
    <group>
      {/* 环境光照 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[10, 5, 10]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[-10, 5, -10]} intensity={1.5} color="#ff6b00" />

      {/* 中央监控模型 */}
      <SituationMonitoringModel realTimeData={realTimeData} />

      {/* 威胁指示器 */}
      {threats.map((threat, index) => (
        <ThreatIndicator3D
          key={index}
          position={threat.position}
          level={threat.level}
          count={threat.count}
        />
      ))}

      {/* 网络节点 */}
      {networkNodes.map((node, index) => (
        <NetworkNode3D
          key={index}
          position={node.position}
          status={node.status}
          label={node.label}
        />
      ))}

      {/* 数据流 */}
      <DataFlow3D
        start={[8, 0, 0]}
        end={[0, 0, 0]}
        color="#00f5ff"
        label="Web流量"
      />
      <DataFlow3D
        start={[0, 0, 0]}
        end={[-8, 0, 0]}
        color="#ff6b00"
        label="数据库查询"
      />
      <DataFlow3D
        start={[0, 0, 8]}
        end={[0, 0, 0]}
        color="#00ff88"
        label="路由数据"
      />

      {/* 信息面板 */}
      {infoPanels.map((panel, index) => (
        <InfoPanel3D
          key={index}
          position={panel.position}
          title={panel.title}
          data={panel.data}
          color={panel.color}
        />
      ))}

      {/* 基础平台 */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[15, 15, 0.2, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* 网格背景 */}
      <gridHelper
        args={[30, 30, "#333333", "#1a1a1a"]}
        position={[0, -1.9, 0]}
      />
    </group>
  );
}

// 顶部控制栏
function TopControlBar() {
  const navigate = useNavigate();
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentTime = new Date().toLocaleString("zh-CN");

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-matrix-surface/90 backdrop-blur border-b border-matrix-border p-4">
      <div className="flex items-center justify-between">
        {/* 左侧控制 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-matrix-accent/30 hover:bg-matrix-accent/50 rounded-lg transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>

          <div className="flex items-center space-x-3">
            <Monitor className="w-6 h-6 text-neon-blue" />
            <div>
              <h1 className="text-xl font-bold text-white">3D态势监控大屏</h1>
              <p className="text-sm text-muted-foreground">
                网络安全实时态势感知
              </p>
            </div>
          </div>
        </div>

        {/* 中央状态 */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
            <span className="text-neon-green text-sm font-mono">
              3D系统在线
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse" />
            <span className="text-neon-blue text-sm font-mono">实时监控</span>
          </div>
          <div className="text-sm text-muted-foreground">
            活跃威胁:{" "}
            <span className="text-threat-high font-mono">
              {realTimeData?.realTimeThreats || 3}
            </span>
          </div>
        </div>

        {/* 右侧控制 */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">{currentTime}</div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg transition-colors ${
                isPlaying
                  ? "bg-neon-blue/20 text-neon-blue"
                  : "bg-matrix-accent/30 text-muted-foreground"
              }`}
              title={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white transition-colors"
              title="全屏模式"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              className="p-2 rounded-lg bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white transition-colors"
              title="设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 底部状态栏
function BottomStatusBar() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1500,
    enabled: true,
  });

  const statusItems = [
    {
      icon: Users,
      label: "活跃连接",
      value: realTimeData?.activeConnections?.toLocaleString() || "1,247",
      color: "text-neon-blue",
    },
    {
      icon: Shield,
      label: "防火墙状态",
      value: realTimeData?.firewallStatus || "正常",
      color: "text-neon-green",
    },
    {
      icon: Activity,
      label: "CPU负载",
      value: `${realTimeData?.cpuUsage || 68}%`,
      color: "text-neon-orange",
    },
    {
      icon: Network,
      label: "网络流量",
      value: `${(realTimeData?.inboundTraffic || 85) + (realTimeData?.outboundTraffic || 92)} MB/s`,
      color: "text-neon-purple",
    },
    {
      icon: Server,
      label: "在线节点",
      value: `${realTimeData?.onlineNodes || 47}/50`,
      color: "text-neon-cyan",
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-matrix-surface/90 backdrop-blur border-t border-matrix-border p-4">
      <div className="flex items-center justify-between">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${item.color}`} />
              <div>
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
                <div className={`font-mono font-bold ${item.color}`}>
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 主要的3D态势大屏页面
export default function SituationDisplay() {
  return (
    <div className="h-screen w-screen bg-matrix-bg text-white overflow-hidden relative">
      {/* 顶部控制栏 */}
      <TopControlBar />

      {/* 主要的3D场景 */}
      <div className="absolute inset-0 pt-20 pb-20">
        <ThreeErrorBoundary>
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center bg-matrix-bg">
                <div className="text-center space-y-4">
                  <SimpleShield />
                  <div className="text-neon-blue font-mono text-lg">
                    加载3D态势监控场景...
                  </div>
                </div>
              </div>
            }
          >
            <Canvas
              camera={{ position: [20, 15, 20], fov: 60 }}
              style={{ background: "transparent" }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              {/* 星空背景 */}
              <Stars
                radius={300}
                depth={200}
                count={10000}
                factor={4}
                saturation={0}
                fade
                speed={0.1}
              />

              {/* 相机控制 */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.3}
                maxDistance={50}
                minDistance={10}
                maxPolarAngle={Math.PI / 1.2}
                minPolarAngle={Math.PI / 8}
              />

              {/* 3D态势场景 */}
              <SituationScene3D />

              {/* 深度雾效 */}
              <fog attach="fog" args={["#0d1117", 25, 100]} />
            </Canvas>
          </Suspense>
        </ThreeErrorBoundary>
      </div>

      {/* 底部状态栏 */}
      <BottomStatusBar />

      {/* 背景渐变效果 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-matrix-bg/20 to-matrix-bg/60 pointer-events-none" />
    </div>
  );
}
