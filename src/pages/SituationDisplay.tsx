import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Text,
  Html,
  Line,
  Sphere,
  Plane,
  Environment,
  Cloud,
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
  Building,
  Factory,
  Home,
  Car,
} from "lucide-react";
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
} from "three";
import { SituationMonitoringModel } from "@/components/3d/SituationMonitoringModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

// 3D城市建筑群背景
function CityBuildings() {
  const buildingsRef = useRef<Group>(null);

  const buildings = [
    // 第一圈建筑 - 内圈
    { position: [35, 0, 0], height: 8, width: 3, depth: 3, color: "#1a2332" },
    { position: [-35, 0, 0], height: 12, width: 4, depth: 3, color: "#2a1332" },
    { position: [0, 0, 35], height: 10, width: 3, depth: 4, color: "#1a3322" },
    { position: [0, 0, -35], height: 6, width: 2, depth: 2, color: "#332a1a" },
    { position: [25, 0, 25], height: 15, width: 5, depth: 4, color: "#1a2332" },
    { position: [-25, 0, 25], height: 9, width: 3, depth: 3, color: "#2a1332" },
    {
      position: [25, 0, -25],
      height: 11,
      width: 4,
      depth: 3,
      color: "#1a3322",
    },
    {
      position: [-25, 0, -25],
      height: 7,
      width: 2,
      depth: 3,
      color: "#332a1a",
    },

    // 第二圈建筑 - 中圈
    { position: [50, 0, 10], height: 18, width: 6, depth: 5, color: "#1a2332" },
    {
      position: [-50, 0, -10],
      height: 14,
      width: 4,
      depth: 4,
      color: "#2a1332",
    },
    { position: [10, 0, 50], height: 16, width: 5, depth: 6, color: "#1a3322" },
    {
      position: [-10, 0, -50],
      height: 12,
      width: 3,
      depth: 4,
      color: "#332a1a",
    },
    { position: [40, 0, 40], height: 20, width: 7, depth: 6, color: "#1a2332" },
    {
      position: [-40, 0, 40],
      height: 13,
      width: 4,
      depth: 4,
      color: "#2a1332",
    },
    {
      position: [40, 0, -40],
      height: 17,
      width: 5,
      depth: 5,
      color: "#1a3322",
    },
    {
      position: [-40, 0, -40],
      height: 11,
      width: 3,
      depth: 3,
      color: "#332a1a",
    },

    // 第三圈建筑 - 外圈
    { position: [70, 0, 0], height: 25, width: 8, depth: 7, color: "#1a2332" },
    { position: [-70, 0, 0], height: 22, width: 6, depth: 6, color: "#2a1332" },
    { position: [0, 0, 70], height: 28, width: 9, depth: 8, color: "#1a3322" },
    { position: [0, 0, -70], height: 19, width: 5, depth: 5, color: "#332a1a" },
    { position: [60, 0, 30], height: 24, width: 7, depth: 6, color: "#1a2332" },
    {
      position: [-60, 0, 30],
      height: 21,
      width: 6,
      depth: 5,
      color: "#2a1332",
    },
    {
      position: [60, 0, -30],
      height: 26,
      width: 8,
      depth: 7,
      color: "#1a3322",
    },
    {
      position: [-60, 0, -30],
      height: 18,
      width: 5,
      depth: 4,
      color: "#332a1a",
    },
    { position: [30, 0, 60], height: 23, width: 6, depth: 6, color: "#1a2332" },
    {
      position: [-30, 0, 60],
      height: 20,
      width: 5,
      depth: 5,
      color: "#2a1332",
    },
    {
      position: [30, 0, -60],
      height: 27,
      width: 8,
      depth: 7,
      color: "#1a3322",
    },
    {
      position: [-30, 0, -60],
      height: 16,
      width: 4,
      depth: 4,
      color: "#332a1a",
    },
  ];

  useFrame((state) => {
    if (buildingsRef.current) {
      const time = state.clock.getElapsedTime();
      // 轻微的整体旋转
      buildingsRef.current.rotation.y = time * 0.001;
    }
  });

  return (
    <group ref={buildingsRef}>
      {buildings.map((building, index) => (
        <group
          key={index}
          position={building.position as [number, number, number]}
        >
          {/* 建筑主体 */}
          <mesh position={[0, building.height / 2, 0]}>
            <boxGeometry
              args={[building.width, building.height, building.depth]}
            />
            <meshStandardMaterial
              color={building.color}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* 建筑顶部灯光 */}
          <mesh position={[0, building.height + 0.1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color={Math.random() > 0.5 ? "#ff6b00" : "#00f5ff"}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* 随机窗户灯光 */}
          {Array.from({ length: Math.floor(building.height / 2) }).map(
            (_, windowIndex) => {
              if (Math.random() > 0.6) {
                return (
                  <mesh
                    key={windowIndex}
                    position={[
                      (Math.random() - 0.5) * building.width * 0.8,
                      windowIndex * 2 + 1,
                      building.depth / 2 + 0.01,
                    ]}
                  >
                    <planeGeometry args={[0.3, 0.4]} />
                    <meshBasicMaterial
                      color={Math.random() > 0.7 ? "#ffff88" : "#88aaff"}
                      transparent
                      opacity={0.6}
                    />
                  </mesh>
                );
              }
              return null;
            },
          )}
        </group>
      ))}
    </group>
  );
}

// 3D数据中心机房
function DataCenterRacks() {
  const racksRef = useRef<Group>(null);

  const racks = [
    // 左侧机房
    { position: [-45, 0, -15], rotation: 0 },
    { position: [-45, 0, -12], rotation: 0 },
    { position: [-45, 0, -9], rotation: 0 },
    { position: [-45, 0, -6], rotation: 0 },
    { position: [-42, 0, -15], rotation: 0 },
    { position: [-42, 0, -12], rotation: 0 },
    { position: [-42, 0, -9], rotation: 0 },
    { position: [-42, 0, -6], rotation: 0 },

    // 右侧机房
    { position: [45, 0, 15], rotation: Math.PI },
    { position: [45, 0, 12], rotation: Math.PI },
    { position: [45, 0, 9], rotation: Math.PI },
    { position: [45, 0, 6], rotation: Math.PI },
    { position: [42, 0, 15], rotation: Math.PI },
    { position: [42, 0, 12], rotation: Math.PI },
    { position: [42, 0, 9], rotation: Math.PI },
    { position: [42, 0, 6], rotation: Math.PI },
  ];

  useFrame((state) => {
    if (racksRef.current) {
      const time = state.clock.getElapsedTime();
      racksRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          // 机架状态指示灯闪烁
          const indicators = child.children.slice(1);
          indicators.forEach((indicator, i) => {
            if (indicator instanceof Mesh) {
              indicator.material.opacity =
                0.5 + Math.sin(time * 3 + index + i) * 0.3;
            }
          });
        }
      });
    }
  });

  return (
    <group ref={racksRef}>
      {racks.map((rack, index) => (
        <group
          key={index}
          position={rack.position as [number, number, number]}
          rotation={[0, rack.rotation, 0]}
        >
          {/* 机架主体 */}
          <mesh>
            <boxGeometry args={[1, 2, 0.6]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>

          {/* 服务器指示灯 */}
          {Array.from({ length: 8 }).map((_, serverIndex) => (
            <mesh
              key={serverIndex}
              position={[0.3, -0.7 + serverIndex * 0.2, 0.31]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color={Math.random() > 0.3 ? "#00ff88" : "#ff6600"}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}

          {/* 机架标签 */}
          <Text
            position={[0, 1.2, 0.4]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            RACK-{index + 1}
          </Text>
        </group>
      ))}
    </group>
  );
}

// 3D卫星通信系统
function SatelliteSystem() {
  const satelliteRef = useRef<Group>(null);

  useFrame((state) => {
    if (satelliteRef.current) {
      const time = state.clock.getElapsedTime();
      satelliteRef.current.rotation.y = time * 0.1;
      satelliteRef.current.position.y = 25 + Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <group ref={satelliteRef} position={[0, 25, 0]}>
      {/* 卫星本体 */}
      <mesh>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* 太阳能板 */}
      <mesh position={[-2, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#001122" side={2} />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#001122" side={2} />
      </mesh>

      {/* 通信天线 */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* 信号指示灯 */}
      <mesh position={[0, 0.7, 0.6]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      {/* 卫星标签 */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SAT-LINK
      </Text>

      {/* 通信波束 */}
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 15;
        const z = Math.sin(angle) * 15;
        return (
          <Line
            key={index}
            points={[new Vector3(0, 0, 0), new Vector3(x, -20, z)]}
            color="#00ff88"
            lineWidth={1}
            transparent
            opacity={0.3}
            dashed
            dashSize={0.5}
            gapSize={0.3}
          />
        );
      })}
    </group>
  );
}

// 3D交通网络
function TrafficNetwork() {
  const trafficRef = useRef<Group>(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const vehicleData = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [(Math.random() - 0.5) * 80, 0, (Math.random() - 0.5) * 80],
      speed: 0.1 + Math.random() * 0.2,
      direction: Math.random() * Math.PI * 2,
      type: Math.random() > 0.5 ? "car" : "truck",
    }));
    setVehicles(vehicleData);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    setVehicles((prev) =>
      prev.map((vehicle) => {
        const newX =
          vehicle.position[0] + Math.cos(vehicle.direction) * vehicle.speed;
        const newZ =
          vehicle.position[2] + Math.sin(vehicle.direction) * vehicle.speed;

        // 边界检查，如果超出范围则重新定位
        if (Math.abs(newX) > 40 || Math.abs(newZ) > 40) {
          return {
            ...vehicle,
            position: [
              (Math.random() - 0.5) * 80,
              0,
              (Math.random() - 0.5) * 80,
            ],
            direction: Math.random() * Math.PI * 2,
          };
        }

        return {
          ...vehicle,
          position: [newX, vehicle.position[1], newZ],
        };
      }),
    );
  });

  // 道路网格
  const roads = [
    // 主干道
    { start: [-40, 0, 0], end: [40, 0, 0] },
    { start: [0, 0, -40], end: [0, 0, 40] },
    // 次干道
    { start: [-40, 0, 20], end: [40, 0, 20] },
    { start: [-40, 0, -20], end: [40, 0, -20] },
    { start: [20, 0, -40], end: [20, 0, 40] },
    { start: [-20, 0, -40], end: [-20, 0, 40] },
  ];

  return (
    <group ref={trafficRef}>
      {/* 道路 */}
      {roads.map((road, index) => (
        <Line
          key={index}
          points={[new Vector3(...road.start), new Vector3(...road.end)]}
          color="#444444"
          lineWidth={3}
          transparent
          opacity={0.6}
        />
      ))}

      {/* 车辆 */}
      {vehicles.map((vehicle) => (
        <group
          key={vehicle.id}
          position={vehicle.position as [number, number, number]}
          rotation={[0, vehicle.direction, 0]}
        >
          <mesh>
            <boxGeometry
              args={vehicle.type === "car" ? [0.8, 0.3, 0.4] : [1.2, 0.4, 0.6]}
            />
            <meshStandardMaterial
              color={vehicle.type === "car" ? "#ff6b00" : "#0066ff"}
              emissive={vehicle.type === "car" ? "#ff6b00" : "#0066ff"}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* 车灯 */}
          <mesh position={[0, 0.1, vehicle.type === "car" ? 0.25 : 0.35]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3D网络骨干线
function NetworkBackbone() {
  const backboneRef = useRef<Group>(null);

  const backboneNodes = [
    { position: [0, 5, 0], name: "CORE-HUB", connections: 8 },
    { position: [20, 3, 0], name: "NODE-A", connections: 4 },
    { position: [-20, 3, 0], name: "NODE-B", connections: 4 },
    { position: [0, 3, 20], name: "NODE-C", connections: 3 },
    { position: [0, 3, -20], name: "NODE-D", connections: 3 },
    { position: [35, 1, 15], name: "EDGE-1", connections: 2 },
    { position: [-35, 1, 15], name: "EDGE-2", connections: 2 },
    { position: [35, 1, -15], name: "EDGE-3", connections: 2 },
    { position: [-35, 1, -15], name: "EDGE-4", connections: 2 },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 1, to: 5 },
    { from: 2, to: 6 },
    { from: 3, to: 7 },
    { from: 4, to: 8 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 1, to: 4 },
    { from: 2, to: 3 },
  ];

  useFrame((state) => {
    if (backboneRef.current) {
      const time = state.clock.getElapsedTime();
      backboneRef.current.children.forEach((child, index) => {
        if (child instanceof Group && index < backboneNodes.length) {
          child.position.y += Math.sin(time * 2 + index) * 0.02;
        }
      });
    }
  });

  return (
    <group ref={backboneRef}>
      {/* 骨干节点 */}
      {backboneNodes.map((node, index) => (
        <group key={index} position={node.position as [number, number, number]}>
          {/* 节点主体 */}
          <mesh>
            <octahedronGeometry args={[0.5, 2]} />
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* 节点光环 */}
          <mesh>
            <torusGeometry args={[0.8, 0.05, 8, 32]} />
            <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} />
          </mesh>

          {/* 节点标签 */}
          <Text
            position={[0, 1, 0]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {node.name}
          </Text>

          {/* 连接数 */}
          <Text
            position={[0, 0.7, 0]}
            fontSize={0.08}
            color="#00f5ff"
            anchorX="center"
            anchorY="middle"
          >
            {node.connections} Links
          </Text>
        </group>
      ))}

      {/* 骨干连接线 */}
      {connections.map((conn, index) => {
        const from = new Vector3(...backboneNodes[conn.from].position);
        const to = new Vector3(...backboneNodes[conn.to].position);
        return (
          <Line
            key={index}
            points={[from, to]}
            color="#00aaff"
            lineWidth={4}
            transparent
            opacity={0.7}
          />
        );
      })}
    </group>
  );
}

// 动态粒子云系统
function DynamicParticleClouds() {
  const cloudsRef = useRef<Group>(null);

  const cloudSystems = useMemo(() => {
    const systems = [];
    for (let i = 0; i < 5; i++) {
      const count = 200;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const centerX = (Math.random() - 0.5) * 60;
      const centerY = 10 + Math.random() * 15;
      const centerZ = (Math.random() - 0.5) * 60;

      const color = new Color(
        i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff88",
      );

      for (let j = 0; j < count; j++) {
        const j3 = j * 3;
        const radius = Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[j3] = centerX + radius * Math.sin(phi) * Math.cos(theta);
        positions[j3 + 1] = centerY + radius * Math.sin(phi) * Math.sin(theta);
        positions[j3 + 2] = centerZ + radius * Math.cos(phi);

        colors[j3] = color.r;
        colors[j3 + 1] = color.g;
        colors[j3 + 2] = color.b;
      }

      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

      systems.push({
        geometry,
        center: [centerX, centerY, centerZ],
        rotationSpeed: 0.01 + Math.random() * 0.02,
      });
    }
    return systems;
  }, []);

  useFrame((state) => {
    if (cloudsRef.current) {
      const time = state.clock.getElapsedTime();
      cloudsRef.current.children.forEach((cloud, index) => {
        if (cloud instanceof Points) {
          const system = cloudSystems[index];
          cloud.rotation.y = time * system.rotationSpeed;
          cloud.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={cloudsRef}>
      {cloudSystems.map((system, index) => (
        <points key={index} geometry={system.geometry}>
          <pointsMaterial
            size={0.05}
            vertexColors
            transparent
            opacity={0.6}
            blending={AdditiveBlending}
            sizeAttenuation={true}
          />
        </points>
      ))}
    </group>
  );
}

// 3D全息地球
function HolographicEarth() {
  const earthRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      const time = state.clock.getElapsedTime();
      earthRef.current.rotation.y = time * 0.05;
      earthRef.current.position.y = 30 + Math.sin(time * 0.3) * 2;
    }
  });

  return (
    <group position={[0, 30, 0]}>
      {/* 地球主体 */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#004466"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* 地球光环 */}
      <mesh>
        <ringGeometry args={[4, 4.5, 64]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.4} side={2} />
      </mesh>

      {/* 经纬线 */}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <mesh key={index} rotation={[0, angle, 0]}>
            <torusGeometry args={[3, 0.02, 8, 32]} />
            <meshBasicMaterial color="#0088aa" transparent opacity={0.5} />
          </mesh>
        );
      })}

      {/* 地球标签 */}
      <Text
        position={[0, -5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        GLOBAL NETWORK
      </Text>
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
  width = 320,
}: {
  position: [number, number, number];
  title: string;
  data: Array<{
    label: string;
    value: string | number;
    trend?: string;
    status?: string;
  }>;
  color: string;
  icon?: string;
  width?: number;
}) {
  return (
    <group position={position}>
      <Html
        transform
        occlude
        style={{
          background: "rgba(13, 17, 23, 0.95)",
          backdropFilter: "blur(20px)",
          border: `3px solid ${color}`,
          borderRadius: "20px",
          padding: "24px",
          color: "white",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "13px",
          minWidth: `${width}px`,
          boxShadow: `0 0 40px ${color}50, inset 0 0 30px ${color}15`,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: `2px solid ${color}40`,
              paddingBottom: "16px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: color,
                borderRadius: "50%",
                marginRight: "12px",
                boxShadow: `0 0 15px ${color}`,
                animation: "pulse 2s infinite",
              }}
            />
            <h3
              style={{
                color: color,
                margin: 0,
                fontWeight: "bold",
                fontSize: "18px",
                textShadow: `0 0 15px ${color}70`,
                letterSpacing: "0.5px",
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
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.07)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    display: "block",
                  }}
                >
                  {item.label}
                </span>
                {item.status && (
                  <span
                    style={{
                      color:
                        item.status === "online"
                          ? "#00ff88"
                          : item.status === "warning"
                            ? "#ffaa00"
                            : "#ff6600",
                      fontSize: "10px",
                      marginTop: "2px",
                      display: "block",
                    }}
                  >
                    ● {item.status.toUpperCase()}
                  </span>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    fontFamily: "monospace",
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
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.trend === "up"
                      ? "↗ +%"
                      : item.trend === "down"
                        ? "↘ -%"
                        : "→ 0%"}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: `1px solid ${color}30`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#6b7280",
                fontSize: "11px",
              }}
            >
              最后更新: {new Date().toLocaleTimeString("zh-CN")}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// 主要的3D态势场景
function EnhancedSituationScene3D() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  // 更多的信息面板
  const comprehensiveInfoPanels = [
    {
      position: [25, 8, 0] as [number, number, number],
      title: "核心系统监控",
      color: "#00f5ff",
      width: 350,
      data: [
        {
          label: "CPU使用率",
          value: `${realTimeData?.cpuUsage || 68}%`,
          trend: "up",
          status: "online",
        },
        {
          label: "内存使用",
          value: `${realTimeData?.memoryUsage || 72}%`,
          trend: "stable",
          status: "online",
        },
        {
          label: "磁盘I/O",
          value: `${realTimeData?.diskUsage || 45}%`,
          trend: "down",
          status: "online",
        },
        {
          label: "网络延迟",
          value: `${realTimeData?.networkLatency || 25}ms`,
          trend: "stable",
          status: "online",
        },
        { label: "系统负载", value: "2.34", trend: "stable", status: "online" },
        { label: "活跃进程", value: "1,247", trend: "up", status: "online" },
        {
          label: "内存缓存",
          value: "8.2GB",
          trend: "stable",
          status: "online",
        },
        { label: "交换分区", value: "0.5GB", trend: "down", status: "online" },
      ],
    },
    {
      position: [-25, 8, 0] as [number, number, number],
      title: "网络流量分析",
      color: "#ff6b00",
      width: 350,
      data: [
        {
          label: "入站流量",
          value: `${realTimeData?.inboundTraffic || 85} MB/s`,
          trend: "up",
          status: "online",
        },
        {
          label: "出站流量",
          value: `${realTimeData?.outboundTraffic || 92} MB/s`,
          trend: "up",
          status: "online",
        },
        {
          label: "峰值入站",
          value: `${realTimeData?.peakInbound || 120} MB/s`,
          trend: "stable",
          status: "online",
        },
        {
          label: "带宽使用",
          value: `${realTimeData?.bandwidthUsage || 65}%`,
          trend: "down",
          status: "online",
        },
        { label: "数据包率", value: "55.2K/s", trend: "up", status: "online" },
        { label: "丢包率", value: "0.02%", trend: "stable", status: "online" },
        { label: "延迟抖动", value: "2.1ms", trend: "down", status: "online" },
        {
          label: "连接数",
          value: `${realTimeData?.activeConnections || 1247}`,
          trend: "up",
          status: "online",
        },
      ],
    },
    {
      position: [0, 12, 25] as [number, number, number],
      title: "安全威胁监控",
      color: "#ff0033",
      width: 380,
      data: [
        {
          label: "实时威胁",
          value: realTimeData?.realTimeThreats || 3,
          trend: "down",
          status: "warning",
        },
        {
          label: "已拦截攻击",
          value: realTimeData?.blockedAttacks?.toLocaleString() || "1,247",
          trend: "up",
          status: "online",
        },
        { label: "恶意IP", value: "156", trend: "up", status: "warning" },
        { label: "病毒查杀", value: "23", trend: "stable", status: "online" },
        { label: "入侵尝试", value: "89", trend: "down", status: "online" },
        { label: "异常流量", value: "12", trend: "down", status: "online" },
        { label: "黑名单", value: "2,847", trend: "up", status: "online" },
        {
          label: "安全评分",
          value: "96/100",
          trend: "stable",
          status: "online",
        },
      ],
    },
    {
      position: [0, 12, -25] as [number, number, number],
      title: "用户行为分析",
      color: "#00ff88",
      width: 350,
      data: [
        { label: "在线用户", value: "1,847", trend: "up", status: "online" },
        {
          label: "认证成功",
          value: "98.7%",
          trend: "stable",
          status: "online",
        },
        { label: "失败登录", value: "23", trend: "down", status: "online" },
        { label: "权限提升", value: "0", trend: "stable", status: "online" },
        { label: "异常行为", value: "2", trend: "down", status: "warning" },
        { label: "会话超时", value: "156", trend: "stable", status: "online" },
        { label: "多地登录", value: "5", trend: "up", status: "warning" },
        { label: "API调用", value: "45.2K", trend: "up", status: "online" },
      ],
    },
    {
      position: [20, 6, 20] as [number, number, number],
      title: "数据库性能",
      color: "#ffff00",
      width: 320,
      data: [
        { label: "查询响应", value: "45ms", trend: "stable", status: "online" },
        { label: "连接池", value: "78/100", trend: "up", status: "online" },
        { label: "缓存命中", value: "94.2%", trend: "up", status: "online" },
        { label: "慢查询", value: "3", trend: "down", status: "online" },
        { label: "死锁", value: "0", trend: "stable", status: "online" },
        { label: "事务/秒", value: "2,456", trend: "up", status: "online" },
        { label: "数据增长", value: "+12GB", trend: "up", status: "online" },
      ],
    },
    {
      position: [-20, 6, -20] as [number, number, number],
      title: "应用服务状态",
      color: "#ff8800",
      width: 330,
      data: [
        { label: "Web服务", value: "8/8", trend: "stable", status: "online" },
        { label: "API网关", value: "正常", trend: "stable", status: "online" },
        { label: "微服务", value: "24/24", trend: "stable", status: "online" },
        { label: "消息队列", value: "正常", trend: "stable", status: "online" },
        {
          label: "缓存服务",
          value: "Redis OK",
          trend: "stable",
          status: "online",
        },
        { label: "文件存储", value: "可用", trend: "stable", status: "online" },
        { label: "负载均衡", value: "健康", trend: "stable", status: "online" },
      ],
    },
    {
      position: [0, 4, 35] as [number, number, number],
      title: "云基础设施",
      color: "#9966ff",
      width: 340,
      data: [
        { label: "容器实例", value: "147/200", trend: "up", status: "online" },
        {
          label: "Kubernetes",
          value: "健康",
          trend: "stable",
          status: "online",
        },
        {
          label: "存储使用",
          value: "1.2TB/5TB",
          trend: "up",
          status: "online",
        },
        { label: "网络策略", value: "86条", trend: "stable", status: "online" },
        { label: "自动扩容", value: "启用", trend: "stable", status: "online" },
        { label: "备份状态", value: "完成", trend: "stable", status: "online" },
        {
          label: "监控探针",
          value: "23/23",
          trend: "stable",
          status: "online",
        },
      ],
    },
    {
      position: [0, 4, -35] as [number, number, number],
      title: "边缘计算节点",
      color: "#ff6699",
      width: 330,
      data: [
        {
          label: "边缘节点",
          value: "12/12",
          trend: "stable",
          status: "online",
        },
        { label: "CDN缓存", value: "89%", trend: "up", status: "online" },
        { label: "边缘延迟", value: "8ms", trend: "down", status: "online" },
        { label: "IoT设备", value: "2,847", trend: "up", status: "online" },
        { label: "5G连接", value: "156", trend: "up", status: "online" },
        { label: "边缘AI", value: "运行中", trend: "stable", status: "online" },
        { label: "数据同步", value: "正常", trend: "stable", status: "online" },
      ],
    },
  ];

  return (
    <group>
      {/* 增强的环境光照 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 20, 0]} intensity={4} color="#ffffff" />
      <pointLight position={[30, 15, 30]} intensity={2.5} color="#00f5ff" />
      <pointLight position={[-30, 15, -30]} intensity={2.5} color="#ff6b00" />
      <pointLight position={[30, 15, -30]} intensity={2} color="#00ff88" />
      <pointLight position={[-30, 15, 30]} intensity={2} color="#ff00ff" />
      <pointLight position={[0, 10, 40]} intensity={1.5} color="#ffff00" />
      <pointLight position={[0, 10, -40]} intensity={1.5} color="#ff8800" />

      {/* 中央监控模型 */}
      <SituationMonitoringModel realTimeData={realTimeData} />

      {/* 背景城市建筑群 */}
      <CityBuildings />

      {/* 数据中心机房 */}
      <DataCenterRacks />

      {/* 卫星通信系统 */}
      <SatelliteSystem />

      {/* 交通网络 */}
      <TrafficNetwork />

      {/* 网络骨干线 */}
      <NetworkBackbone />

      {/* 动态粒子云 */}
      <DynamicParticleClouds />

      {/* 全息地球 */}
      <HolographicEarth />

      {/* 综合信息面板 */}
      {comprehensiveInfoPanels.map((panel, index) => (
        <EnhancedInfoPanel3D
          key={index}
          position={panel.position}
          title={panel.title}
          data={panel.data}
          color={panel.color}
          width={panel.width}
        />
      ))}

      {/* 多层基础平台 */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[50, 50, 0.5, 128]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.3} />
      </mesh>

      <mesh position={[0, -2.8, 0]}>
        <cylinderGeometry args={[45, 45, 0.3, 64]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.4} />
      </mesh>

      {/* 多层网格系统 */}
      <gridHelper
        args={[100, 100, "#333333", "#1a1a1a"]}
        position={[0, -2.5, 0]}
      />
      <gridHelper
        args={[80, 80, "#444444", "#2a2a2a"]}
        position={[0, -2.4, 0]}
      />
      <gridHelper
        args={[60, 60, "#555555", "#3a3a3a"]}
        position={[0, -2.3, 0]}
      />

      {/* 边界防护墙 */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 48;
        const z = Math.sin(angle) * 48;
        return (
          <mesh key={i} position={[x, 1, z]}>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* 天空盒效果 */}
      <mesh position={[0, 25, 0]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color="#000a1a" transparent opacity={0.1} side={2} />
      </mesh>
    </group>
  );
}

// 增强的顶部控制栏
function SuperEnhancedTopControlBar() {
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
    { id: "infrastructure", name: "基础设施", icon: Server },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/98 via-matrix-surface/95 to-matrix-surface/98 backdrop-blur-xl border-b-3 border-matrix-border shadow-2xl">
      {/* 主控制栏 */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* 左侧控制区 */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-matrix-accent/50 to-matrix-accent/70 hover:from-matrix-accent/70 hover:to-matrix-accent/90 rounded-xl transition-all duration-300 text-white border-2 border-matrix-border shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">返回</span>
            </button>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <Globe className="w-10 h-10 text-neon-blue animate-pulse" />
                <div className="absolute inset-0 animate-ping opacity-30">
                  <Globe className="w-10 h-10 text-neon-blue" />
                </div>
                <div
                  className="absolute inset-0 animate-spin"
                  style={{ animationDuration: "3s" }}
                >
                  <Globe className="w-10 h-10 text-neon-green opacity-20" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-neon-blue via-neon-green to-neon-purple bg-clip-text text-transparent">
                  CyberGuard 3D 态势感知平台
                </h1>
                <p className="text-base text-muted-foreground font-mono">
                  Enterprise Network Security Situation Awareness Platform
                </p>
              </div>
            </div>
          </div>

          {/* 中央监控面板 */}
          <div className="flex items-center space-x-8">
            <div className="grid grid-cols-2 gap-6 bg-matrix-accent/20 rounded-xl p-4 border-2 border-matrix-border">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  系统状态
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-neon-green font-bold font-mono">
                    在线
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  监控状态
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-neon-blue rounded-full animate-pulse" />
                  <span className="text-neon-blue font-bold font-mono">
                    正常
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  活跃威胁
                </div>
                <div className="text-threat-high font-bold font-mono text-xl">
                  {realTimeData?.realTimeThreats || 3}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">已拦截</div>
                <div className="text-neon-green font-bold font-mono text-xl">
                  {Math.floor(
                    ((realTimeData?.blockedAttacks || 1247) / 1000) * 10,
                  ) / 10}
                  K
                </div>
              </div>
            </div>

            {/* ���图模式选择器 */}
            <div className="flex items-center space-x-2 bg-matrix-accent/20 rounded-xl p-2 border-2 border-matrix-border">
              {viewModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                      viewMode === mode.id
                        ? "bg-neon-blue/30 text-neon-blue border-2 border-neon-blue/50 shadow-lg shadow-neon-blue/20"
                        : "text-muted-foreground hover:text-white hover:bg-matrix-accent/40"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{mode.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧控制区 */}
          <div className="flex items-center space-x-6">
            <div className="text-right bg-matrix-accent/20 rounded-xl p-4 border-2 border-matrix-border">
              <div className="text-sm text-muted-foreground mb-1">当前时间</div>
              <div className="text-base font-mono text-neon-blue font-bold">
                {currentTime}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-4 rounded-xl transition-all duration-300 border-2 ${
                  isPlaying
                    ? "bg-neon-blue/30 text-neon-blue border-neon-blue/50 shadow-lg shadow-neon-blue/30"
                    : "bg-matrix-accent/30 text-muted-foreground border-matrix-border"
                }`}
                title={isPlaying ? "暂停监控" : "恢复监控"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-4 rounded-xl bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white transition-all duration-300 border-2 border-matrix-border"
                title="全屏模式"
              >
                <Maximize2 className="w-6 h-6" />
              </button>

              <button
                className="p-4 rounded-xl bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white transition-all duration-300 border-2 border-matrix-border"
                title="系统设置"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 增强的底部状态栏
function SuperEnhancedBottomStatusBar() {
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
      bgColor: "bg-neon-blue/15",
      borderColor: "border-neon-blue/30",
    },
    {
      icon: Shield,
      label: "防火墙",
      value: realTimeData?.firewallStatus || "正常",
      change: "稳定运行",
      color: "text-neon-green",
      bgColor: "bg-neon-green/15",
      borderColor: "border-neon-green/30",
    },
    {
      icon: Activity,
      label: "CPU负载",
      value: `${realTimeData?.cpuUsage || 68}%`,
      change: "+2.1%",
      color: "text-neon-orange",
      bgColor: "bg-neon-orange/15",
      borderColor: "border-neon-orange/30",
    },
    {
      icon: Network,
      label: "网络流量",
      value: `${(realTimeData?.inboundTraffic || 85) + (realTimeData?.outboundTraffic || 92)} MB/s`,
      change: "+8.7%",
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/15",
      borderColor: "border-neon-purple/30",
    },
    {
      icon: Server,
      label: "在线节点",
      value: `${realTimeData?.onlineNodes || 47}/50`,
      change: "94% 可用",
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/15",
      borderColor: "border-neon-cyan/30",
    },
    {
      icon: Database,
      label: "数据库",
      value: "正常",
      change: "45ms 响应",
      color: "text-neon-yellow",
      bgColor: "bg-neon-yellow/15",
      borderColor: "border-neon-yellow/30",
    },
    {
      icon: Wifi,
      label: "无线接入",
      value: "126台",
      change: "+12 设备",
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/15",
      borderColor: "border-neon-pink/30",
    },
    {
      icon: Satellite,
      label: "卫星链路",
      value: "在线",
      change: "信号良好",
      color: "text-neon-green",
      bgColor: "bg-neon-green/15",
      borderColor: "border-neon-green/30",
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/98 via-matrix-surface/95 to-matrix-surface/98 backdrop-blur-xl border-t-3 border-matrix-border shadow-2xl">
      <div className="p-6">
        <div className="grid grid-cols-8 gap-4">
          {statusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center space-y-3 ${item.bgColor} rounded-xl px-4 py-4 border-2 ${item.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <Icon className={`w-7 h-7 ${item.color}`} />
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    {item.label}
                  </div>
                  <div
                    className={`font-mono font-bold text-sm ${item.color} mb-1`}
                  >
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
    </div>
  );
}

// 主要的超级增强3D态势大屏页面
export default function SituationDisplay() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-matrix-bg via-matrix-surface/30 to-matrix-bg text-white overflow-hidden relative">
      {/* 超级增强的顶部控制栏 */}
      <SuperEnhancedTopControlBar />

      {/* 主要的3D场景 */}
      <div className="absolute inset-0 pt-32 pb-40">
        <ThreeErrorBoundary>
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center bg-matrix-bg">
                <div className="text-center space-y-8">
                  <SimpleShield />
                  <div className="text-neon-blue font-mono text-2xl font-bold">
                    加载 CyberGuard 3D 态势感知平台...
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce" />
                    <div
                      className="w-3 h-3 bg-neon-green rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-3 h-3 bg-neon-orange rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-3 h-3 bg-neon-purple rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                  <div className="text-muted-foreground">
                    正在初始化网络拓扑和安全组件...
                  </div>
                </div>
              </div>
            }
          >
            <Canvas
              camera={{ position: [35, 25, 35], fov: 65 }}
              style={{ background: "transparent" }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              {/* 震撼的宇宙星空 */}
              <Stars
                radius={800}
                depth={500}
                count={20000}
                factor={8}
                saturation={0}
                fade
                speed={0.03}
              />

              {/* 专业相机控制 */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.15}
                maxDistance={120}
                minDistance={20}
                maxPolarAngle={Math.PI / 1.05}
                minPolarAngle={Math.PI / 12}
              />

              {/* 超级增强的3D态势场景 */}
              <EnhancedSituationScene3D />

              {/* 多层深度雾效 */}
              <fog attach="fog" args={["#0a0a0a", 40, 200]} />
            </Canvas>
          </Suspense>
        </ThreeErrorBoundary>
      </div>

      {/* 超级增强的底部状态栏 */}
      <SuperEnhancedBottomStatusBar />

      {/* 多层次背景效果 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-matrix-bg/15 to-matrix-bg/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-conic from-neon-blue/8 via-transparent via-neon-green/8 via-transparent to-neon-purple/8 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,255,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,107,0,0.1)_0%,transparent_50%)] pointer-events-none" />
    </div>
  );
}
