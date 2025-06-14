import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Text,
  Html,
  Line,
  Sphere,
} from "@react-three/drei";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Vector3, Color, Mesh, Group } from "three";
import { SituationMonitoringModel } from "@/components/3d/SituationMonitoringModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

// 3D攻击路径可视化
function AttackPathVisualization({ realTimeData }: { realTimeData: any }) {
  const pathRef = useRef<Group>(null);
  const [activeAttacks, setActiveAttacks] = useState([]);

  useEffect(() => {
    const attacks = [
      {
        id: 1,
        source: [12, 2, 8],
        target: [0, 0, 0],
        type: "DDoS",
        severity: "high",
        progress: 0,
      },
      {
        id: 2,
        source: [-10, 1, -6],
        target: [4, 0, 0],
        type: "Malware",
        severity: "critical",
        progress: 0,
      },
      {
        id: 3,
        source: [8, 3, -8],
        target: [-2, 0, 2],
        type: "Phishing",
        severity: "medium",
        progress: 0,
      },
    ];
    setActiveAttacks(attacks);
  }, []);

  useFrame((state) => {
    if (pathRef.current) {
      const time = state.clock.getElapsedTime();

      // 更新攻击路径动画
      setActiveAttacks((prev) =>
        prev.map((attack) => ({
          ...attack,
          progress: (Math.sin(time * 0.5 + attack.id) + 1) / 2,
        })),
      );
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff0033";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffaa00";
      default:
        return "#00ff88";
    }
  };

  return (
    <group ref={pathRef}>
      {activeAttacks.map((attack) => {
        const start = new Vector3(...attack.source);
        const end = new Vector3(...attack.target);
        const current = start.clone().lerp(end, attack.progress);

        return (
          <group key={attack.id}>
            {/* 攻击路径 */}
            <Line
              points={[start, end]}
              color={getSeverityColor(attack.severity)}
              lineWidth={3}
              transparent
              opacity={0.6}
              dashed
              dashSize={0.2}
              gapSize={0.1}
            />

            {/* 移动的攻击包 */}
            <mesh position={current}>
              <tetrahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial
                color={getSeverityColor(attack.severity)}
                emissive={getSeverityColor(attack.severity)}
                emissiveIntensity={0.8}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* 攻击源标记 */}
            <mesh position={attack.source}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color="#ff0033"
                emissive="#ff0033"
                emissiveIntensity={1}
              />
            </mesh>

            {/* 攻击类型标签 */}
            <Text
              position={[
                attack.source[0],
                attack.source[1] + 0.5,
                attack.source[2],
              ]}
              fontSize={0.08}
              color={getSeverityColor(attack.severity)}
              anchorX="center"
              anchorY="middle"
            >
              {attack.type}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// 3D地理威胁分布
function GeographicThreatMap3D() {
  const mapRef = useRef<Group>(null);

  const threatLocations = [
    { name: "北京", position: [15, 0, 10], threats: 8, type: "DDoS" },
    { name: "上海", position: [-12, 0, 8], threats: 5, type: "Malware" },
    { name: "深圳", position: [10, 0, -12], threats: 12, type: "Phishing" },
    { name: "广州", position: [8, 0, -8], threats: 3, type: "Brute Force" },
    { name: "杭州", position: [-8, 0, 10], threats: 7, type: "Injection" },
    { name: "成都", position: [-15, 0, -5], threats: 4, type: "XSS" },
  ];

  useFrame((state) => {
    if (mapRef.current) {
      const time = state.clock.getElapsedTime();
      mapRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y = Math.sin(time * 2 + index) * 0.1;
        }
      });
    }
  });

  const getThreatColor = (count: number) => {
    if (count > 10) return "#ff0033";
    if (count > 6) return "#ff6600";
    if (count > 3) return "#ffaa00";
    return "#00ff88";
  };

  return (
    <group ref={mapRef}>
      {threatLocations.map((location, index) => (
        <group
          key={index}
          position={location.position as [number, number, number]}
        >
          {/* 威胁标记柱 */}
          <mesh>
            <cylinderGeometry args={[0.2, 0.3, location.threats * 0.2, 8]} />
            <meshStandardMaterial
              color={getThreatColor(location.threats)}
              emissive={getThreatColor(location.threats)}
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* 威胁光环 */}
          <mesh position={[0, location.threats * 0.1, 0]}>
            <ringGeometry args={[0.5, 0.8, 16]} />
            <meshBasicMaterial
              color={getThreatColor(location.threats)}
              transparent
              opacity={0.3}
              side={2}
            />
          </mesh>

          {/* 城市标签 */}
          <Text
            position={[0, location.threats * 0.2 + 0.5, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {location.name}
          </Text>

          {/* 威胁类型 */}
          <Text
            position={[0, location.threats * 0.2 + 0.3, 0]}
            fontSize={0.08}
            color={getThreatColor(location.threats)}
            anchorX="center"
            anchorY="middle"
          >
            {location.type}
          </Text>

          {/* 威胁数量 */}
          <Text
            position={[0, location.threats * 0.2 + 0.1, 0]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {location.threats}
          </Text>
        </group>
      ))}
    </group>
  );
}

// 3D网络拓扑
function NetworkTopology3D({ realTimeData }: { realTimeData: any }) {
  const topoRef = useRef<Group>(null);

  const networkDevices = [
    {
      name: "核心路由器",
      position: [0, 2, 0],
      type: "router",
      status: "online",
      connections: 8,
    },
    {
      name: "防火墙-1",
      position: [6, 1, 0],
      type: "firewall",
      status: "online",
      connections: 4,
    },
    {
      name: "防火墙-2",
      position: [-6, 1, 0],
      type: "firewall",
      status: "warning",
      connections: 3,
    },
    {
      name: "Web服务器",
      position: [8, 0, 4],
      type: "server",
      status: "online",
      connections: 2,
    },
    {
      name: "数据库",
      position: [8, 0, -4],
      type: "database",
      status: "online",
      connections: 1,
    },
    {
      name: "邮件服务器",
      position: [-8, 0, 4],
      type: "server",
      status: "online",
      connections: 2,
    },
    {
      name: "文件服务器",
      position: [-8, 0, -4],
      type: "server",
      status: "offline",
      connections: 0,
    },
    {
      name: "交换机-1",
      position: [4, -1, 6],
      type: "switch",
      status: "online",
      connections: 6,
    },
    {
      name: "交换机-2",
      position: [-4, -1, 6],
      type: "switch",
      status: "online",
      connections: 5,
    },
    {
      name: "WiFi-AP",
      position: [0, -1, 8],
      type: "wireless",
      status: "online",
      connections: 12,
    },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 },
    { from: 0, to: 7 },
    { from: 0, to: 8 },
    { from: 7, to: 9 },
    { from: 8, to: 9 },
  ];

  useFrame((state) => {
    if (topoRef.current) {
      const time = state.clock.getElapsedTime();
      topoRef.current.rotation.y = time * 0.02;
    }
  });

  const getDeviceGeometry = (type: string) => {
    switch (type) {
      case "router":
        return <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />;
      case "firewall":
        return <boxGeometry args={[0.4, 0.3, 0.4]} />;
      case "server":
        return <boxGeometry args={[0.2, 0.6, 0.3]} />;
      case "database":
        return <cylinderGeometry args={[0.25, 0.25, 0.5, 12]} />;
      case "switch":
        return <boxGeometry args={[0.6, 0.1, 0.3]} />;
      case "wireless":
        return <sphereGeometry args={[0.2, 8, 8]} />;
      default:
        return <boxGeometry args={[0.3, 0.3, 0.3]} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#00ff88";
      case "warning":
        return "#ffaa00";
      case "offline":
        return "#666666";
      default:
        return "#ffffff";
    }
  };

  return (
    <group ref={topoRef}>
      {/* 设备节点 */}
      {networkDevices.map((device, index) => (
        <group
          key={index}
          position={device.position as [number, number, number]}
        >
          <mesh>
            {getDeviceGeometry(device.type)}
            <meshStandardMaterial
              color={getStatusColor(device.status)}
              emissive={getStatusColor(device.status)}
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* 设备名称 */}
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {device.name}
          </Text>

          {/* 连接数 */}
          <Text
            position={[0, 0.6, 0]}
            fontSize={0.06}
            color={getStatusColor(device.status)}
            anchorX="center"
            anchorY="middle"
          >
            {device.connections} 连接
          </Text>

          {/* 状态指示器 */}
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={getStatusColor(device.status)} />
          </mesh>
        </group>
      ))}

      {/* 网络连接线 */}
      {connections.map((conn, index) => {
        const from = new Vector3(...networkDevices[conn.from].position);
        const to = new Vector3(...networkDevices[conn.to].position);
        return (
          <Line
            key={index}
            points={[from, to]}
            color="#00f5ff"
            lineWidth={2}
            transparent
            opacity={0.5}
          />
        );
      })}
    </group>
  );
}

// 3D安全事件时间轴
function SecurityEventTimeline() {
  const timelineRef = useRef<Group>(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const securityEvents = [
      { time: "14:32", type: "Login Attempt", severity: "low", position: 0 },
      {
        time: "14:28",
        type: "Malware Detected",
        severity: "high",
        position: 1,
      },
      { time: "14:25", type: "Port Scan", severity: "medium", position: 2 },
      { time: "14:20", type: "DDoS Attack", severity: "critical", position: 3 },
      { time: "14:15", type: "File Upload", severity: "low", position: 4 },
      { time: "14:10", type: "SQL Injection", severity: "high", position: 5 },
      { time: "14:05", type: "Brute Force", severity: "medium", position: 6 },
    ];
    setEvents(securityEvents);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff0033";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffaa00";
      case "low":
        return "#00ff88";
      default:
        return "#ffffff";
    }
  };

  return (
    <group ref={timelineRef} position={[0, -3, 15]}>
      {/* 时间轴主线 */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 14, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* 事件节点 */}
      {events.map((event, index) => {
        const yPos = 6 - index * 2;
        return (
          <group key={index} position={[0, yPos, 0]}>
            {/* 事��标记 */}
            <mesh position={[0.5, 0, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={getSeverityColor(event.severity)}
                emissive={getSeverityColor(event.severity)}
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* 连接线 */}
            <Line
              points={[new Vector3(0, 0, 0), new Vector3(0.5, 0, 0)]}
              color={getSeverityColor(event.severity)}
              lineWidth={2}
            />

            {/* 事件信息 */}
            <Text
              position={[1, 0.2, 0]}
              fontSize={0.08}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
            >
              {event.type}
            </Text>

            <Text
              position={[1, 0, 0]}
              fontSize={0.06}
              color={getSeverityColor(event.severity)}
              anchorX="left"
              anchorY="middle"
            >
              {event.time} - {event.severity.toUpperCase()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// 3D资源使用监控
function ResourceMonitor3D({ realTimeData }: { realTimeData: any }) {
  const monitorRef = useRef<Group>(null);

  const resources = [
    {
      name: "CPU",
      value: realTimeData?.cpuUsage || 68,
      max: 100,
      color: "#ff6b00",
    },
    {
      name: "内存",
      value: realTimeData?.memoryUsage || 72,
      max: 100,
      color: "#00f5ff",
    },
    {
      name: "磁盘",
      value: realTimeData?.diskUsage || 45,
      max: 100,
      color: "#00ff88",
    },
    {
      name: "网络",
      value: realTimeData?.networkLatency || 25,
      max: 100,
      color: "#ff00ff",
    },
  ];

  useFrame((state) => {
    if (monitorRef.current) {
      const time = state.clock.getElapsedTime();
      monitorRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={monitorRef} position={[-15, 0, 0]}>
      {resources.map((resource, index) => {
        const height = (resource.value / resource.max) * 3;
        const angle = (index / resources.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;

        return (
          <group key={index} position={[x, 0, z]}>
            {/* 资源使用柱 */}
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, height, 8]} />
              <meshStandardMaterial
                color={resource.color}
                emissive={resource.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* 基座 */}
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>

            {/* 资源名称 */}
            <Text
              position={[0, height + 0.5, 0]}
              fontSize={0.12}
              color={resource.color}
              anchorX="center"
              anchorY="middle"
            >
              {resource.name}
            </Text>

            {/* 数值显示 */}
            <Text
              position={[0, height + 0.3, 0]}
              fontSize={0.1}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {resource.value}%
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// 增强的信息面板
function EnhancedInfoPanel3D({
  position,
  title,
  data,
  color,
  icon,
}: {
  position: [number, number, number];
  title: string;
  data: Array<{ label: string; value: string | number; trend?: string }>;
  color: string;
  icon?: string;
}) {
  return (
    <group position={position}>
      <Html
        transform
        occlude
        style={{
          background: "rgba(13, 17, 23, 0.95)",
          backdropFilter: "blur(15px)",
          border: `2px solid ${color}`,
          borderRadius: "16px",
          padding: "20px",
          color: "white",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          minWidth: "280px",
          boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}10`,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: `1px solid ${color}30`,
              paddingBottom: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: color,
                borderRadius: "50%",
                marginRight: "8px",
                boxShadow: `0 0 10px ${color}`,
              }}
            />
            <h3
              style={{
                color: color,
                margin: 0,
                fontWeight: "bold",
                fontSize: "16px",
                textShadow: `0 0 10px ${color}50`,
              }}
            >
              {title}
            </h3>
          </div>

          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: "11px" }}>
                {item.label}:
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {item.value}
                </span>
                {item.trend && (
                  <span
                    style={{
                      color:
                        item.trend === "up"
                          ? "#00ff88"
                          : item.trend === "down"
                            ? "#ff6600"
                            : "#ffaa00",
                      fontSize: "10px",
                    }}
                  >
                    {item.trend === "up"
                      ? "↗"
                      : item.trend === "down"
                        ? "↘"
                        : "→"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Html>
    </group>
  );
}

// 3D态势场景
function SituationScene3D() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  // 增强的信息面板数据
  const enhancedInfoPanels = [
    {
      position: [18, 6, 0] as [number, number, number],
      title: "系统性能监控",
      color: "#00f5ff",
      icon: "cpu",
      data: [
        {
          label: "CPU使用率",
          value: `${realTimeData?.cpuUsage || 68}%`,
          trend: "up",
        },
        {
          label: "内存使用",
          value: `${realTimeData?.memoryUsage || 72}%`,
          trend: "stable",
        },
        {
          label: "磁盘使用",
          value: `${realTimeData?.diskUsage || 45}%`,
          trend: "down",
        },
        {
          label: "网络延迟",
          value: `${realTimeData?.networkLatency || 25}ms`,
          trend: "stable",
        },
        { label: "活跃进程", value: "247", trend: "up" },
        { label: "系统负载", value: "2.34", trend: "stable" },
      ],
    },
    {
      position: [-18, 6, 0] as [number, number, number],
      title: "网络流量分析",
      color: "#ff6b00",
      icon: "network",
      data: [
        {
          label: "入站流量",
          value: `${realTimeData?.inboundTraffic || 85} MB/s`,
          trend: "up",
        },
        {
          label: "出站流量",
          value: `${realTimeData?.outboundTraffic || 92} MB/s`,
          trend: "up",
        },
        {
          label: "峰值入站",
          value: `${realTimeData?.peakInbound || 120} MB/s`,
          trend: "stable",
        },
        {
          label: "带宽使用",
          value: `${realTimeData?.bandwidthUsage || 65}%`,
          trend: "down",
        },
        { label: "数据包丢失", value: "0.02%", trend: "stable" },
        { label: "连接超时", value: "12", trend: "down" },
      ],
    },
    {
      position: [0, 8, 18] as [number, number, number],
      title: "安全威胁情报",
      color: "#00ff88",
      icon: "shield",
      data: [
        {
          label: "防火墙状态",
          value: realTimeData?.firewallStatus || "正常",
          trend: "stable",
        },
        {
          label: "已拦截攻击",
          value: realTimeData?.blockedAttacks?.toLocaleString() || "1,247",
          trend: "up",
        },
        {
          label: "实时威胁",
          value: realTimeData?.realTimeThreats || 3,
          trend: "down",
        },
        { label: "恶意IP", value: "156", trend: "up" },
        { label: "病毒查杀", value: "23", trend: "stable" },
        { label: "入侵尝试", value: "89", trend: "down" },
      ],
    },
    {
      position: [0, 8, -18] as [number, number, number],
      title: "用户活动监控",
      color: "#ff00ff",
      icon: "users",
      data: [
        { label: "在线用户", value: "1,847", trend: "up" },
        { label: "认证成功", value: "98.7%", trend: "stable" },
        { label: "失败登录", value: "23", trend: "down" },
        { label: "权限提升", value: "0", trend: "stable" },
        { label: "异常行为", value: "2", trend: "down" },
        { label: "会话超时", value: "156", trend: "stable" },
      ],
    },
    {
      position: [12, 4, 12] as [number, number, number],
      title: "数据库监控",
      color: "#ffff00",
      icon: "database",
      data: [
        { label: "查询响应", value: "45ms", trend: "stable" },
        { label: "连接池", value: "78/100", trend: "up" },
        { label: "缓存命中", value: "94.2%", trend: "up" },
        { label: "慢查询", value: "3", trend: "down" },
        { label: "死锁", value: "0", trend: "stable" },
      ],
    },
    {
      position: [-12, 4, -12] as [number, number, number],
      title: "应用服务监控",
      color: "#ff8800",
      icon: "server",
      data: [
        { label: "服务状态", value: "8/8在线", trend: "stable" },
        { label: "响应时间", value: "234ms", trend: "stable" },
        { label: "错误率", value: "0.02%", trend: "down" },
        { label: "吞吐量", value: "5.2K/s", trend: "up" },
        { label: "内存泄漏", value: "无", trend: "stable" },
      ],
    },
  ];

  return (
    <group>
      {/* 增强的环境光照 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 15, 0]} intensity={3} color="#ffffff" />
      <pointLight position={[15, 8, 15]} intensity={2} color="#00f5ff" />
      <pointLight position={[-15, 8, -15]} intensity={2} color="#ff6b00" />
      <pointLight position={[15, 8, -15]} intensity={1.5} color="#00ff88" />
      <pointLight position={[-15, 8, 15]} intensity={1.5} color="#ff00ff" />

      {/* 中央监控模型 */}
      <SituationMonitoringModel realTimeData={realTimeData} />

      {/* 攻击路径可视化 */}
      <AttackPathVisualization realTimeData={realTimeData} />

      {/* 地理威胁分布 */}
      <GeographicThreatMap3D />

      {/* 网络拓扑 */}
      <NetworkTopology3D realTimeData={realTimeData} />

      {/* 安全事件时间轴 */}
      <SecurityEventTimeline />

      {/* 资源监控 */}
      <ResourceMonitor3D realTimeData={realTimeData} />

      {/* 增强的信息面板 */}
      {enhancedInfoPanels.map((panel, index) => (
        <EnhancedInfoPanel3D
          key={index}
          position={panel.position}
          title={panel.title}
          data={panel.data}
          color={panel.color}
          icon={panel.icon}
        />
      ))}

      {/* 扩大的基础平台 */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[25, 25, 0.2, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* 多层网格背景 */}
      <gridHelper
        args={[50, 50, "#333333", "#1a1a1a"]}
        position={[0, -1.9, 0]}
      />
      <gridHelper
        args={[30, 30, "#444444", "#2a2a2a"]}
        position={[0, -1.8, 0]}
      />

      {/* 边界标记 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 22;
        const z = Math.sin(angle) * 22;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 增强的顶部控制栏
function EnhancedTopControlBar() {
  const navigate = useNavigate();
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState("overview");

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

  const viewModes = [
    { id: "overview", name: "总览", icon: Monitor },
    { id: "network", name: "网络", icon: Network },
    { id: "security", name: "安全", icon: Shield },
    { id: "performance", name: "性能", icon: Activity },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/95 via-matrix-surface/90 to-matrix-surface/95 backdrop-blur-lg border-b-2 border-matrix-border p-4">
      <div className="flex items-center justify-between">
        {/* 左侧控制 */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-matrix-accent/40 to-matrix-accent/60 hover:from-matrix-accent/60 hover:to-matrix-accent/80 rounded-lg transition-all duration-300 text-white border border-matrix-border"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Globe className="w-8 h-8 text-neon-blue animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Globe className="w-8 h-8 text-neon-blue opacity-30" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
                3D智能态势感知平台
              </h1>
              <p className="text-sm text-muted-foreground">
                Network Security Situation Awareness Platform
              </p>
            </div>
          </div>

          {/* 视图模式切换 */}
          <div className="flex items-center space-x-2 bg-matrix-accent/20 rounded-lg p-1">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === mode.id
                      ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                      : "text-muted-foreground hover:text-white hover:bg-matrix-accent/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 中央状态显示 */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4 bg-matrix-accent/20 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
              <span className="text-neon-green text-sm font-mono">
                系统在线
              </span>
            </div>
            <div className="w-px h-4 bg-matrix-border" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse" />
              <span className="text-neon-blue text-sm font-mono">监控正常</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">活跃威胁</div>
              <div className="text-threat-high font-bold font-mono text-lg">
                {realTimeData?.realTimeThreats || 3}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">已拦截</div>
              <div className="text-neon-green font-bold font-mono text-lg">
                {realTimeData?.blockedAttacks?.toLocaleString() || "1.2K"}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧控制 */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">当前时间</div>
            <div className="text-sm font-mono text-neon-blue">
              {currentTime}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isPlaying
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 shadow-lg shadow-neon-blue/20"
                  : "bg-matrix-accent/30 text-muted-foreground border border-matrix-border"
              }`}
              title={isPlaying ? "暂停监控" : "恢复监控"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-lg bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white transition-all duration-300 border border-matrix-border"
              title="全屏模式"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            <button
              className="p-3 rounded-lg bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white transition-all duration-300 border border-matrix-border"
              title="系统设置"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 增强的底部状态栏
function EnhancedBottomStatusBar() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1500,
    enabled: true,
  });

  const statusItems = [
    {
      icon: Users,
      label: "活跃连接",
      value: realTimeData?.activeConnections?.toLocaleString() || "1,247",
      change: "+5.2%",
      color: "text-neon-blue",
      bgColor: "bg-neon-blue/10",
    },
    {
      icon: Shield,
      label: "防火墙",
      value: realTimeData?.firewallStatus || "正常",
      change: "稳定",
      color: "text-neon-green",
      bgColor: "bg-neon-green/10",
    },
    {
      icon: Activity,
      label: "CPU负载",
      value: `${realTimeData?.cpuUsage || 68}%`,
      change: "+2.1%",
      color: "text-neon-orange",
      bgColor: "bg-neon-orange/10",
    },
    {
      icon: Network,
      label: "网络流量",
      value: `${(realTimeData?.inboundTraffic || 85) + (realTimeData?.outboundTraffic || 92)} MB/s`,
      change: "+8.7%",
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
    },
    {
      icon: Server,
      label: "在线节点",
      value: `${realTimeData?.onlineNodes || 47}/50`,
      change: "94%",
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10",
    },
    {
      icon: Database,
      label: "数据库",
      value: "正常",
      change: "45ms",
      color: "text-neon-yellow",
      bgColor: "bg-neon-yellow/10",
    },
    {
      icon: Wifi,
      label: "无线接入",
      value: "126台",
      change: "+12",
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/10",
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/95 via-matrix-surface/90 to-matrix-surface/95 backdrop-blur-lg border-t-2 border-matrix-border p-4">
      <div className="flex items-center justify-between">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center space-x-3 ${item.bgColor} rounded-lg px-4 py-3 border border-opacity-30 transition-all duration-300 hover:scale-105`}
            >
              <Icon className={`w-6 h-6 ${item.color}`} />
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </div>
                <div className={`font-mono font-bold text-sm ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 主要的增强3D态势大屏页面
export default function SituationDisplay() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-matrix-bg via-matrix-surface/20 to-matrix-bg text-white overflow-hidden relative">
      {/* 增强的顶部控制栏 */}
      <EnhancedTopControlBar />

      {/* 主要的3D场景 */}
      <div className="absolute inset-0 pt-24 pb-32">
        <ThreeErrorBoundary>
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center bg-matrix-bg">
                <div className="text-center space-y-6">
                  <SimpleShield />
                  <div className="text-neon-blue font-mono text-xl">
                    加载3D智能态势感知平台...
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-neon-green rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-neon-orange rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            }
          >
            <Canvas
              camera={{ position: [25, 20, 25], fov: 60 }}
              style={{ background: "transparent" }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              {/* 震撼的星空背景 */}
              <Stars
                radius={500}
                depth={300}
                count={15000}
                factor={6}
                saturation={0}
                fade
                speed={0.05}
              />

              {/* 增强的相机控制 */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.2}
                maxDistance={80}
                minDistance={15}
                maxPolarAngle={Math.PI / 1.1}
                minPolarAngle={Math.PI / 10}
              />

              {/* 增强的3D态势场景 */}
              <SituationScene3D />

              {/* 多层雾效 */}
              <fog attach="fog" args={["#0d1117", 30, 150]} />
            </Canvas>
          </Suspense>
        </ThreeErrorBoundary>
      </div>

      {/* 增强的底部状态栏 */}
      <EnhancedBottomStatusBar />

      {/* 多层背景效果 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-matrix-bg/10 to-matrix-bg/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-conic from-neon-blue/5 via-transparent to-neon-green/5 pointer-events-none" />
    </div>
  );
}
