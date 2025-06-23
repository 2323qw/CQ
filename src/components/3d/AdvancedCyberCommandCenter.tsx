import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Line,
  Html,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Ring,
  Trail,
  Sparkles,
  Stars,
  useMatcapTexture,
  Billboard,
  Icosahedron,
  Octahedron,
  Tetrahedron,
  useTexture,
} from "@react-three/drei";
import {
  Group,
  Vector3,
  Mesh,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  TorusGeometry,
  RingGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  MeshBasicMaterial,
  Color,
  PointLight,
  SpotLight,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  MultiplyBlending,
  BackSide,
  ShaderMaterial,
  TextureLoader,
  RepeatWrapping,
  Fog,
  CatmullRomCurve3,
  TubeGeometry,
  MathUtils,
  Clock,
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
  getDataFlowColor,
  getTechLevelColor,
  getPerformanceColor,
} from "@/lib/situationDisplayColors";

/**
 * 高级网络安全指挥中心 3D 模型配置
 * Advanced Cyber Security Command Center 3D Model Configuration
 */
const CYBER_COMMAND_CONFIG = {
  // 中央量子核心
  quantumCore: {
    position: [0, 5, 0],
    radius: 3,
    layers: 5,
    rotationSpeed: 0.02,
    pulseSpeed: 2.5,
    energyLevel: 100,
    color: DISPLAY_COLORS.neon.blue,
    accentColor: DISPLAY_COLORS.neon.purple,
  },

  // 防护层级系统
  defenseLayers: [
    {
      name: "外围防火墙",
      radius: 25,
      height: 2,
      segments: 8,
      color: DISPLAY_COLORS.security.high,
      opacity: 0.3,
      rotationSpeed: 0.008,
    },
    {
      name: "入侵检测",
      radius: 20,
      height: 1.5,
      segments: 12,
      color: DISPLAY_COLORS.neon.orange,
      opacity: 0.4,
      rotationSpeed: -0.012,
    },
    {
      name: "深度包检测",
      radius: 15,
      height: 1,
      segments: 16,
      color: DISPLAY_COLORS.neon.cyan,
      opacity: 0.5,
      rotationSpeed: 0.015,
    },
    {
      name: "AI威胁分析",
      radius: 10,
      height: 0.8,
      segments: 20,
      color: DISPLAY_COLORS.neon.green,
      opacity: 0.6,
      rotationSpeed: -0.018,
    },
  ],

  // 监控塔群
  monitoringTowers: [
    {
      position: [18, 0, 18],
      name: "北区监控塔",
      type: "primary",
      height: 25,
      status: "active",
      threatLevel: 2,
      connections: 1247,
    },
    {
      position: [-18, 0, 18],
      name: "西区监控塔",
      type: "secondary",
      height: 22,
      status: "active",
      threatLevel: 1,
      connections: 892,
    },
    {
      position: [18, 0, -18],
      name: "东区监控塔",
      type: "secondary",
      height: 24,
      status: "warning",
      threatLevel: 4,
      connections: 756,
    },
    {
      position: [-18, 0, -18],
      name: "南区监控塔",
      type: "primary",
      height: 26,
      status: "active",
      threatLevel: 1,
      connections: 1534,
    },
  ],

  // 数据流节点
  dataNodes: [
    {
      position: [30, 8, 0],
      name: "云端数据中心",
      type: "cloud",
      throughput: 95,
      status: "active",
      techLevel: "ai",
    },
    {
      position: [-30, 8, 0],
      name: "边缘计算节点",
      type: "edge",
      throughput: 78,
      status: "active",
      techLevel: "quantum",
    },
    {
      position: [0, 8, 30],
      name: "神经网络集群",
      type: "neural",
      throughput: 89,
      status: "processing",
      techLevel: "neural",
    },
    {
      position: [0, 8, -30],
      name: "区块链验证",
      type: "blockchain",
      throughput: 67,
      status: "active",
      techLevel: "advanced",
    },
  ],

  // 威胁可视化球体
  threatSpheres: [
    {
      position: [12, 15, 12],
      threatType: "ddos",
      severity: 7,
      active: true,
      targetSystem: "web-servers",
    },
    {
      position: [-12, 15, 12],
      threatType: "malware",
      severity: 4,
      active: true,
      targetSystem: "endpoints",
    },
    {
      position: [12, 15, -12],
      threatType: "phishing",
      severity: 3,
      active: false,
      targetSystem: "email-system",
    },
    {
      position: [-12, 15, -12],
      threatType: "apt",
      severity: 9,
      active: true,
      targetSystem: "critical-infrastructure",
    },
  ],

  // 数据传输路径
  dataPaths: [
    {
      from: [30, 8, 0],
      to: [0, 5, 0],
      type: "high-bandwidth",
      encryption: "quantum",
      status: "active",
    },
    {
      from: [-30, 8, 0],
      to: [0, 5, 0],
      type: "edge-sync",
      encryption: "aes256",
      status: "active",
    },
    {
      from: [0, 8, 30],
      to: [0, 5, 0],
      type: "neural-feed",
      encryption: "neural",
      status: "processing",
    },
    {
      from: [0, 8, -30],
      to: [0, 5, 0],
      type: "blockchain-verify",
      encryption: "hash",
      status: "active",
    },
  ],
};

/**
 * 量子能量核心组件
 */
function QuantumEnergyCore({
  config,
  realTimeData,
}: {
  config: any;
  realTimeData: any;
}) {
  const coreGroupRef = useRef<Group>(null);
  const innerCoreRef = useRef<Mesh>(null);
  const energyRingsRef = useRef<Group>(null);

  const energyLevel = realTimeData?.systemHealth || 100;
  const threatLevel = realTimeData?.threatLevel || 0;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y = time * config.rotationSpeed;
    }

    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(time * config.pulseSpeed) * 0.15;
      innerCoreRef.current.scale.setScalar(pulse);

      // 根据威胁等级调整发光强度
      const material = innerCoreRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.4 + (threatLevel / 10) * 0.6;
    }

    if (energyRingsRef.current) {
      energyRingsRef.current.children.forEach((ring, index) => {
        ring.rotation.x = time * (0.01 + index * 0.002);
        ring.rotation.z = time * (0.008 + index * 0.003);
      });
    }
  });

  const getCoreColor = () => {
    if (threatLevel > 7) return DISPLAY_COLORS.security.critical;
    if (threatLevel > 4) return DISPLAY_COLORS.security.high;
    if (threatLevel > 2) return DISPLAY_COLORS.security.medium;
    return config.color;
  };

  return (
    <group ref={coreGroupRef} position={config.position}>
      {/* 内部量子核心 */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[config.radius * 0.6, 3]} />
        <meshStandardMaterial
          color={getCoreColor()}
          emissive={getCoreColor()}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 外层保护壳 */}
      <mesh>
        <icosahedronGeometry args={[config.radius, 2]} />
        <meshStandardMaterial
          color={config.accentColor}
          emissive={config.accentColor}
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* 能量环系统 */}
      <group ref={energyRingsRef}>
        {Array.from({ length: config.layers }, (_, i) => {
          const ringRadius = config.radius * (1.2 + i * 0.3);
          const ringColor = i % 2 === 0 ? config.color : config.accentColor;

          return (
            <mesh
              key={i}
              rotation={[
                (Math.PI / 4) * i,
                (Math.PI / 6) * i,
                (Math.PI / 8) * i,
              ]}
            >
              <torusGeometry args={[ringRadius, ringRadius * 0.05, 8, 32]} />
              <meshStandardMaterial
                color={ringColor}
                emissive={ringColor}
                emissiveIntensity={0.6}
                transparent
                opacity={0.7 - i * 0.1}
              />
            </mesh>
          );
        })}
      </group>

      {/* 量子数据流 */}
      <Sparkles
        count={50}
        scale={[config.radius * 3, config.radius * 3, config.radius * 3]}
        size={3}
        speed={0.8}
        color={config.accentColor}
        opacity={0.6}
      />

      {/* 核心状态显示 */}
      <Billboard position={[0, config.radius + 2, 0]}>
        <Text
          fontSize={0.8}
          color={DISPLAY_COLORS.ui.text.primary}
          anchorX="center"
          anchorY="middle"
        >
          量子安全核心
        </Text>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.6}
          color={getCoreColor()}
          anchorX="center"
          anchorY="middle"
        >
          能量等级: {energyLevel}%
        </Text>
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.6}
          color={getThreatColor(threatLevel)}
          anchorX="center"
          anchorY="middle"
        >
          威胁等级: {threatLevel}/10
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * 多层防护系统组件
 */
function MultiLayerDefenseSystem({
  layers,
  realTimeData,
}: {
  layers: any[];
  realTimeData: any;
}) {
  const defensesRef = useRef<Group>(null);

  useFrame((state) => {
    if (defensesRef.current) {
      defensesRef.current.children.forEach((layer, index) => {
        const config = layers[index];
        if (config) {
          layer.rotation.y += config.rotationSpeed;
        }
      });
    }
  });

  return (
    <group ref={defensesRef}>
      {layers.map((layer, index) => (
        <group key={index}>
          {/* 防护环 */}
          <mesh position={[0, layer.height, 0]}>
            <torusGeometry
              args={[layer.radius, layer.radius * 0.02, 8, layer.segments]}
            />
            <meshStandardMaterial
              color={layer.color}
              emissive={layer.color}
              emissiveIntensity={0.4}
              transparent
              opacity={layer.opacity}
            />
          </mesh>

          {/* 防护点 */}
          {Array.from({ length: layer.segments }, (_, i) => {
            const angle = (i / layer.segments) * Math.PI * 2;
            const x = Math.cos(angle) * layer.radius;
            const z = Math.sin(angle) * layer.radius;

            return (
              <mesh key={i} position={[x, layer.height, z]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial
                  color={layer.color}
                  emissive={layer.color}
                  emissiveIntensity={0.6}
                />
              </mesh>
            );
          })}

          {/* 防护屏障 */}
          <mesh position={[0, layer.height, 0]}>
            <cylinderGeometry
              args={[layer.radius, layer.radius, 0.1, layer.segments]}
            />
            <meshStandardMaterial
              color={layer.color}
              emissive={layer.color}
              emissiveIntensity={0.2}
              transparent
              opacity={layer.opacity * 0.3}
              side={2}
            />
          </mesh>

          {/* 防护层名称 */}
          <Billboard position={[layer.radius + 3, layer.height, 0]}>
            <Text
              fontSize={0.6}
              color={layer.color}
              anchorX="left"
              anchorY="middle"
            >
              {layer.name}
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  );
}

/**
 * 监控塔群组件
 */
function MonitoringTowerArray({
  towers,
  realTimeData,
}: {
  towers: any[];
  realTimeData: any;
}) {
  const towersRef = useRef<Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (towersRef.current) {
      towersRef.current.children.forEach((tower, index) => {
        // 轻微浮动效果
        tower.position.y = Math.sin(time * 1.5 + index) * 0.2;
      });
    }
  });

  return (
    <group ref={towersRef}>
      {towers.map((tower, index) => {
        const statusColor = getStatusColor(tower.status as any);
        const threatColor = getThreatColor(tower.threatLevel);

        return (
          <group key={index} position={tower.position}>
            {/* 塔身 */}
            <mesh>
              <cylinderGeometry args={[1, 1.5, tower.height, 12]} />
              <meshStandardMaterial
                color={statusColor}
                emissive={statusColor}
                emissiveIntensity={0.2}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>

            {/* 塔顶设备 */}
            <mesh position={[0, tower.height / 2 + 1, 0]}>
              <octahedronGeometry args={[1.2, 2]} />
              <meshStandardMaterial
                color={threatColor}
                emissive={threatColor}
                emissiveIntensity={0.4}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* 通信天线 */}
            {Array.from({ length: 4 }, (_, i) => {
              const angle = (i / 4) * Math.PI * 2;
              const x = Math.cos(angle) * 0.8;
              const z = Math.sin(angle) * 0.8;

              return (
                <mesh
                  key={i}
                  position={[x, tower.height / 2 + 2, z]}
                  rotation={[0, angle, Math.PI / 6]}
                >
                  <cylinderGeometry args={[0.02, 0.02, 2, 6]} />
                  <meshStandardMaterial
                    color={DISPLAY_COLORS.ui.text.primary}
                  />
                </mesh>
              );
            })}

            {/* 监控环 */}
            {Array.from({ length: 3 }, (_, i) => (
              <mesh
                key={i}
                position={[0, tower.height / 4 + i * (tower.height / 6), 0]}
              >
                <torusGeometry args={[2 + i * 0.5, 0.08, 8, 24]} />
                <meshStandardMaterial
                  color={statusColor}
                  emissive={statusColor}
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            ))}

            {/* 数据连接线 */}
            <Line
              points={[new Vector3(...tower.position), new Vector3(0, 5, 0)]}
              color={statusColor}
              lineWidth={2}
              transparent
              opacity={0.4}
            />

            {/* 信息显示 */}
            <Billboard position={[0, tower.height + 3, 0]}>
              <Text
                fontSize={0.5}
                color={statusColor}
                anchorX="center"
                anchorY="middle"
              >
                {tower.name}
              </Text>
              <Text
                position={[0, -0.6, 0]}
                fontSize={0.4}
                color={DISPLAY_COLORS.ui.text.secondary}
                anchorX="center"
                anchorY="middle"
              >
                连接数: {tower.connections.toLocaleString()}
              </Text>
              <Text
                position={[0, -1.0, 0]}
                fontSize={0.4}
                color={threatColor}
                anchorX="center"
                anchorY="middle"
              >
                威胁等级: {tower.threatLevel}
              </Text>
            </Billboard>

            {/* 威胁警报环 */}
            {tower.threatLevel > 3 && (
              <mesh position={[0, tower.height + 1.5, 0]}>
                <torusGeometry args={[2.5, 0.1, 8, 32]} />
                <meshBasicMaterial
                  color={threatColor}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

/**
 * 智能数据节点群组件
 */
function IntelligentDataNodes({
  nodes,
  realTimeData,
}: {
  nodes: any[];
  realTimeData: any;
}) {
  const nodesRef = useRef<Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, index) => {
        // 节点旋转
        node.rotation.y = time * (0.02 + index * 0.001);
        node.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
      });
    }
  });

  return (
    <group ref={nodesRef}>
      {nodes.map((node, index) => {
        const throughputColor = getDataFlowColor(node.throughput);
        const techColor = getTechLevelColor(node.techLevel);
        const statusColor = getStatusColor(node.status as any);

        return (
          <group key={index} position={node.position}>
            {/* 主节点体 */}
            <mesh>
              <boxGeometry args={[3, 3, 3]} />
              <meshStandardMaterial
                color={techColor}
                emissive={techColor}
                emissiveIntensity={0.3}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* 数据处理核心 */}
            <mesh>
              <icosahedronGeometry args={[1.5, 2]} />
              <meshStandardMaterial
                color={statusColor}
                emissive={statusColor}
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
                wireframe
              />
            </mesh>

            {/* 吞吐量指示器 */}
            {Array.from({ length: 4 }, (_, i) => {
              const progress = Math.min(node.throughput / 25, 1) * (i + 1);
              if (progress < 1) return null;

              const angle = (i / 4) * Math.PI * 2;
              const x = Math.cos(angle) * 2;
              const z = Math.sin(angle) * 2;

              return (
                <mesh key={i} position={[x, 0, z]}>
                  <cylinderGeometry args={[0.1, 0.1, 1.5, 6]} />
                  <meshStandardMaterial
                    color={throughputColor}
                    emissive={throughputColor}
                    emissiveIntensity={0.6}
                  />
                </mesh>
              );
            })}

            {/* 连接端口 */}
            {Array.from({ length: 6 }, (_, i) => {
              const positions = [
                [1.6, 0, 0],
                [-1.6, 0, 0],
                [0, 1.6, 0],
                [0, -1.6, 0],
                [0, 0, 1.6],
                [0, 0, -1.6],
              ];

              return (
                <mesh key={i} position={positions[i]}>
                  <sphereGeometry args={[0.2, 8, 8]} />
                  <meshStandardMaterial
                    color={DISPLAY_COLORS.neon.cyan}
                    emissive={DISPLAY_COLORS.neon.cyan}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              );
            })}

            {/* 数据粒子效果 */}
            <Sparkles
              count={20}
              scale={[6, 6, 6]}
              size={2}
              speed={node.throughput / 50}
              color={throughputColor}
              opacity={0.8}
            />

            {/* 信息标签 */}
            <Billboard position={[0, 4, 0]}>
              <Text
                fontSize={0.6}
                color={techColor}
                anchorX="center"
                anchorY="middle"
              >
                {node.name}
              </Text>
              <Text
                position={[0, -0.7, 0]}
                fontSize={0.5}
                color={throughputColor}
                anchorX="center"
                anchorY="middle"
              >
                吞吐量: {node.throughput}%
              </Text>
              <Text
                position={[0, -1.3, 0]}
                fontSize={0.4}
                color={statusColor}
                anchorX="center"
                anchorY="middle"
              >
                状态:{" "}
                {node.status === "active"
                  ? "运行中"
                  : node.status === "processing"
                    ? "处理中"
                    : "离线"}
              </Text>
            </Billboard>

            {/* 数据流轨道 */}
            <mesh>
              <torusGeometry args={[4, 0.05, 8, 32]} />
              <meshBasicMaterial
                color={throughputColor}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 威胁可视化球体群组件
 */
function ThreatVisualizationSpheres({
  threats,
  realTimeData,
}: {
  threats: any[];
  realTimeData: any;
}) {
  const threatsRef = useRef<Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (threatsRef.current) {
      threatsRef.current.children.forEach((threat, index) => {
        const threatData = threats[index];
        if (threatData && threatData.active) {
          // 活跃威胁的强烈动画
          threat.rotation.x = time * 0.5;
          threat.rotation.y = time * 0.3;
          threat.rotation.z = time * 0.2;

          // 脉冲效果
          const pulse = 1 + Math.sin(time * 4) * 0.2;
          threat.scale.setScalar(pulse);
        } else {
          // 非活跃威胁的缓慢旋转
          threat.rotation.y = time * 0.1;
        }
      });
    }
  });

  const getThreatTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      ddos: "DDoS攻击",
      malware: "恶意软件",
      phishing: "钓鱼攻击",
      apt: "高级持续威胁",
    };
    return names[type] || type;
  };

  const getThreatGeometry = (type: string) => {
    switch (type) {
      case "ddos":
        return <octahedronGeometry args={[1.5, 2]} />;
      case "malware":
        return <tetrahedronGeometry args={[1.5, 1]} />;
      case "phishing":
        return <icosahedronGeometry args={[1.5, 1]} />;
      case "apt":
        return <sphereGeometry args={[1.5, 16, 16]} />;
      default:
        return <sphereGeometry args={[1.5, 12, 12]} />;
    }
  };

  return (
    <group ref={threatsRef}>
      {threats.map((threat, index) => {
        const threatColor = getThreatColor(threat.severity);
        const isActive = threat.active;

        return (
          <group key={index} position={threat.position}>
            {/* 威胁主体 */}
            <mesh>
              {getThreatGeometry(threat.threatType)}
              <meshStandardMaterial
                color={threatColor}
                emissive={threatColor}
                emissiveIntensity={isActive ? 0.6 : 0.2}
                transparent
                opacity={isActive ? 0.8 : 0.4}
                wireframe={!isActive}
              />
            </mesh>

            {/* 威胁警告环 */}
            {isActive && (
              <>
                <mesh>
                  <torusGeometry args={[2.5, 0.1, 8, 32]} />
                  <meshBasicMaterial
                    color={threatColor}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
                <mesh>
                  <torusGeometry args={[3, 0.05, 8, 32]} />
                  <meshBasicMaterial
                    color={threatColor}
                    transparent
                    opacity={0.4}
                  />
                </mesh>
              </>
            )}

            {/* 威胁脉冲效果 */}
            {isActive && (
              <Sparkles
                count={30}
                scale={[5, 5, 5]}
                size={4}
                speed={1.5}
                color={threatColor}
                opacity={0.7}
              />
            )}

            {/* 威胁信息 */}
            <Billboard position={[0, 3, 0]}>
              <Text
                fontSize={0.6}
                color={threatColor}
                anchorX="center"
                anchorY="middle"
              >
                {getThreatTypeName(threat.threatType)}
              </Text>
              <Text
                position={[0, -0.7, 0]}
                fontSize={0.5}
                color={DISPLAY_COLORS.ui.text.secondary}
                anchorX="center"
                anchorY="middle"
              >
                严重度: {threat.severity}/10
              </Text>
              <Text
                position={[0, -1.3, 0]}
                fontSize={0.4}
                color={
                  isActive
                    ? DISPLAY_COLORS.security.critical
                    : DISPLAY_COLORS.ui.text.muted
                }
                anchorX="center"
                anchorY="middle"
              >
                状态: {isActive ? "活跃" : "已缓解"}
              </Text>
            </Billboard>

            {/* 攻击目标连接线 */}
            {isActive && (
              <Line
                points={[new Vector3(...threat.position), new Vector3(0, 0, 0)]}
                color={threatColor}
                lineWidth={3}
                transparent
                opacity={0.5}
                dashed
                dashSize={0.5}
                gapSize={0.3}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

/**
 * 智能数据流传输系统
 */
function IntelligentDataFlowSystem({
  paths,
  realTimeData,
}: {
  paths: any[];
  realTimeData: any;
}) {
  const flowRef = useRef<Group>(null);
  const packetsRef = useRef<Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    packetsRef.current.forEach((packet, index) => {
      if (packet && paths[index]) {
        const path = paths[index];
        const speed = path.status === "active" ? 1.0 : 0.3;
        const progress = (Math.sin(time * speed + index * 0.5) + 1) / 2;

        packet.position.lerpVectors(
          new Vector3(...path.from),
          new Vector3(...path.to),
          progress,
        );

        // 根据加密类型调整颜色
        const material = packet.material as MeshStandardMaterial;
        switch (path.encryption) {
          case "quantum":
            material.color.setHex(
              DISPLAY_COLORS.neon.purple.replace("#", "0x"),
            );
            break;
          case "neural":
            material.color.setHex(DISPLAY_COLORS.neon.green.replace("#", "0x"));
            break;
          case "aes256":
            material.color.setHex(DISPLAY_COLORS.neon.blue.replace("#", "0x"));
            break;
          default:
            material.color.setHex(DISPLAY_COLORS.neon.cyan.replace("#", "0x"));
        }
      }
    });
  });

  const getEncryptionColor = (encryption: string) => {
    switch (encryption) {
      case "quantum":
        return DISPLAY_COLORS.neon.purple;
      case "neural":
        return DISPLAY_COLORS.neon.green;
      case "aes256":
        return DISPLAY_COLORS.neon.blue;
      case "hash":
        return DISPLAY_COLORS.neon.orange;
      default:
        return DISPLAY_COLORS.neon.cyan;
    }
  };

  return (
    <group ref={flowRef}>
      {paths.map((path, index) => {
        const pathColor = getEncryptionColor(path.encryption);
        const isActive = path.status === "active";

        return (
          <group key={index}>
            {/* 数据传输管道 */}
            <Line
              points={[new Vector3(...path.from), new Vector3(...path.to)]}
              color={pathColor}
              lineWidth={isActive ? 4 : 2}
              transparent
              opacity={isActive ? 0.8 : 0.4}
            />

            {/* 数据流动指示器 */}
            {isActive && (
              <>
                <Line
                  points={[new Vector3(...path.from), new Vector3(...path.to)]}
                  color={pathColor}
                  lineWidth={6}
                  transparent
                  opacity={0.3}
                  dashed
                  dashSize={2}
                  gapSize={1}
                />

                {/* 移动的数据包 */}
                <mesh
                  ref={(el) => {
                    if (el) packetsRef.current[index] = el;
                  }}
                >
                  <sphereGeometry args={[0.2, 8, 8]} />
                  <meshStandardMaterial
                    color={pathColor}
                    emissive={pathColor}
                    emissiveIntensity={0.8}
                  />
                </mesh>

                {/* 数据流轨迹 */}
                <Trail
                  width={0.5}
                  length={6}
                  color={pathColor}
                  attenuation={(t) => t}
                >
                  <mesh>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color={pathColor} />
                  </mesh>
                </Trail>
              </>
            )}

            {/* 加密信息标签 */}
            <Billboard
              position={[
                (path.from[0] + path.to[0]) / 2,
                (path.from[1] + path.to[1]) / 2 + 2,
                (path.from[2] + path.to[2]) / 2,
              ]}
            >
              <Text
                fontSize={0.4}
                color={pathColor}
                anchorX="center"
                anchorY="middle"
              >
                {path.encryption.toUpperCase()}
              </Text>
              <Text
                position={[0, -0.5, 0]}
                fontSize={0.3}
                color={
                  isActive
                    ? DISPLAY_COLORS.status.active
                    : DISPLAY_COLORS.ui.text.muted
                }
                anchorX="center"
                anchorY="middle"
              >
                {isActive ? "传输中" : "暂停"}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 高级环境粒子系统
 */
function AdvancedEnvironmentParticles() {
  const particlesRef = useRef<Points>(null);
  const timeRef = useRef(0);

  const particleSystem = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new Color(DISPLAY_COLORS.neon.blue),
      new Color(DISPLAY_COLORS.neon.cyan),
      new Color(DISPLAY_COLORS.neon.purple),
      new Color(DISPLAY_COLORS.neon.green),
      new Color(DISPLAY_COLORS.ui.text.primary),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 创建层状分布的粒子
      const layer = Math.floor(i / (count / 5));
      const radius = 40 + layer * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.3;
      positions[i3 + 2] = radius * Math.cos(phi);

      // 根据层级分配颜色
      const color = colorPalette[layer % colorPalette.length];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // 随机尺寸
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

    return geometry;
  }, []);

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime();

    if (particlesRef.current) {
      // 缓慢旋转整个粒子系统
      particlesRef.current.rotation.y = timeRef.current * 0.002;
      particlesRef.current.rotation.x =
        Math.sin(timeRef.current * 0.001) * 0.01;

      // 动态调整粒子透明度
      const material = particlesRef.current.material as PointsMaterial;
      material.opacity = 0.6 + Math.sin(timeRef.current * 0.5) * 0.2;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleSystem}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * 高级3D网络安全指挥中心主组件
 */
export function AdvancedCyberCommandCenter({
  realTimeData,
}: {
  realTimeData: any;
}) {
  const mainGroupRef = useRef<Group>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (mainGroupRef.current) {
      // 非常缓慢的整体旋转
      mainGroupRef.current.rotation.y = time * 0.002;
    }

    // 更新动画相位
    setAnimationPhase(time);
  });

  // 动态光照系统
  const dynamicLights = useMemo(() => {
    const threatLevel = realTimeData?.threatLevel || 0;
    const intensity = 0.8 + (threatLevel / 10) * 0.5;

    return {
      ambient: { intensity: 0.3 },
      main: { intensity, color: DISPLAY_COLORS.ui.text.primary },
      accent1: {
        intensity: intensity * 0.8,
        color: DISPLAY_COLORS.neon.blue,
        position: [30, 20, 30],
      },
      accent2: {
        intensity: intensity * 0.8,
        color: DISPLAY_COLORS.neon.purple,
        position: [-30, 20, 30],
      },
      threat: {
        intensity: threatLevel > 5 ? 1.0 : 0.3,
        color: getThreatColor(threatLevel),
        position: [0, 40, 0],
      },
    };
  }, [realTimeData]);

  return (
    <group ref={mainGroupRef}>
      {/* 动态光照系统 */}
      <ambientLight intensity={dynamicLights.ambient.intensity} />
      <pointLight
        position={[0, 30, 0]}
        intensity={dynamicLights.main.intensity}
        color={dynamicLights.main.color}
        distance={200}
        decay={2}
      />
      <pointLight
        position={dynamicLights.accent1.position as [number, number, number]}
        intensity={dynamicLights.accent1.intensity}
        color={dynamicLights.accent1.color}
        distance={150}
        decay={1.5}
      />
      <pointLight
        position={dynamicLights.accent2.position as [number, number, number]}
        intensity={dynamicLights.accent2.intensity}
        color={dynamicLights.accent2.color}
        distance={150}
        decay={1.5}
      />
      <pointLight
        position={dynamicLights.threat.position as [number, number, number]}
        intensity={dynamicLights.threat.intensity}
        color={dynamicLights.threat.color}
        distance={100}
        decay={2}
      />

      {/* 雾效环境 */}
      <fog
        attach="fog"
        args={[DISPLAY_COLORS.ui.background.primary, 80, 300]}
      />

      {/* 量子能量核心 */}
      <QuantumEnergyCore
        config={CYBER_COMMAND_CONFIG.quantumCore}
        realTimeData={realTimeData}
      />

      {/* 多层防护系统 */}
      <MultiLayerDefenseSystem
        layers={CYBER_COMMAND_CONFIG.defenseLayers}
        realTimeData={realTimeData}
      />

      {/* 监控塔群 */}
      <MonitoringTowerArray
        towers={CYBER_COMMAND_CONFIG.monitoringTowers}
        realTimeData={realTimeData}
      />

      {/* 智能数据节点群 */}
      <IntelligentDataNodes
        nodes={CYBER_COMMAND_CONFIG.dataNodes}
        realTimeData={realTimeData}
      />

      {/* 威胁可视化球体群 */}
      <ThreatVisualizationSpheres
        threats={CYBER_COMMAND_CONFIG.threatSpheres}
        realTimeData={realTimeData}
      />

      {/* 智能数据流传输系统 */}
      <IntelligentDataFlowSystem
        paths={CYBER_COMMAND_CONFIG.dataPaths}
        realTimeData={realTimeData}
      />

      {/* 高级环境粒子系统 */}
      <AdvancedEnvironmentParticles />

      {/* 基础平台 */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[50, 50, 0.5, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* 全息网格 */}
      <mesh position={[0, -1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshBasicMaterial
          color={DISPLAY_COLORS.corporate.accent}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* 扫描环 */}
      <mesh
        position={[0, 0.5, 0]}
        rotation={[Math.PI / 2, 0, animationPhase * 0.5]}
      >
        <ringGeometry args={[45, 46, 128]} />
        <meshBasicMaterial
          color={DISPLAY_COLORS.neon.green}
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>

      {/* 星空背景 */}
      <Stars
        radius={300}
        depth={50}
        count={3000}
        factor={6}
        saturation={0.8}
        fade
        speed={0.5}
      />
    </group>
  );
}

export default AdvancedCyberCommandCenter;
