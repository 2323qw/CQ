import React, { useRef, useMemo, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  // Line component removed to prevent uniform errors
  Html,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Ring,
  Billboard,
  Icosahedron,
  Octahedron,
  Tetrahedron,
  Sparkles,
  Trail,
} from "@react-three/drei";
import {
  Group,
  Vector3,
  Mesh,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  TorusGeometry,
  MeshStandardMaterial,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Color,
  PointLight,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  DoubleSide,
  CatmullRomCurve3,
  TubeGeometry,
  MathUtils,
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
  getDataFlowColor,
  getNodeTypeColor,
} from "@/lib/situationDisplayColors";

/**
 * 量子网络拓扑配置
 * Quantum Network Topology Configuration
 */
const QUANTUM_NETWORK_CONFIG = {
  // 核心网络层
  coreLayer: {
    position: [0, 0, 0],
    radius: 8,
    nodes: [
      {
        id: "core-1",
        position: [0, 0, 0],
        type: "quantum-core",
        name: "量子核心路由器",
        status: "active",
        throughput: 10000,
        connections: 24,
        qubits: 1024,
      },
    ],
  },

  // 分布层网络
  distributionLayer: {
    radius: 20,
    nodes: [
      {
        id: "dist-1",
        position: [20, 0, 0],
        type: "distribution",
        name: "分布路由器-东",
        status: "active",
        throughput: 5000,
        connections: 16,
        qubits: 512,
      },
      {
        id: "dist-2",
        position: [-20, 0, 0],
        type: "distribution",
        name: "分布路由器-西",
        status: "active",
        throughput: 4800,
        connections: 14,
        qubits: 512,
      },
      {
        id: "dist-3",
        position: [0, 0, 20],
        type: "distribution",
        name: "分布路由器-北",
        status: "warning",
        throughput: 3200,
        connections: 12,
        qubits: 256,
      },
      {
        id: "dist-4",
        position: [0, 0, -20],
        type: "distribution",
        name: "分布路由器-南",
        status: "active",
        throughput: 5200,
        connections: 18,
        qubits: 512,
      },
    ],
  },

  // 接入层网络
  accessLayer: {
    radius: 35,
    nodes: [
      // 东区接入节点
      {
        id: "access-e1",
        position: [35, 0, 10],
        type: "access",
        name: "东区接入-1",
        status: "active",
        throughput: 1000,
        connections: 48,
        users: 256,
      },
      {
        id: "access-e2",
        position: [35, 0, -10],
        type: "access",
        name: "东区接入-2",
        status: "active",
        throughput: 950,
        connections: 42,
        users: 198,
      },
      // 西区接入节点
      {
        id: "access-w1",
        position: [-35, 0, 10],
        type: "access",
        name: "西区接入-1",
        status: "active",
        throughput: 1100,
        connections: 52,
        users: 301,
      },
      {
        id: "access-w2",
        position: [-35, 0, -10],
        type: "access",
        name: "西区接入-2",
        status: "critical",
        throughput: 200,
        connections: 8,
        users: 45,
      },
      // 北区接入节点
      {
        id: "access-n1",
        position: [10, 0, 35],
        type: "access",
        name: "北区接入-1",
        status: "active",
        throughput: 800,
        connections: 36,
        users: 178,
      },
      {
        id: "access-n2",
        position: [-10, 0, 35],
        type: "access",
        name: "北区接入-2",
        status: "warning",
        throughput: 600,
        connections: 24,
        users: 134,
      },
      // 南区接入节点
      {
        id: "access-s1",
        position: [10, 0, -35],
        type: "access",
        name: "南区接入-1",
        status: "active",
        throughput: 1200,
        connections: 58,
        users: 342,
      },
      {
        id: "access-s2",
        position: [-10, 0, -35],
        type: "access",
        name: "南区接入-2",
        status: "active",
        throughput: 980,
        connections: 44,
        users: 267,
      },
    ],
  },

  // 边缘计算节点
  edgeNodes: [
    {
      id: "edge-ai-1",
      position: [45, 8, 0],
      type: "ai-edge",
      name: "AI边缘节点-1",
      status: "active",
      computePower: 95,
      aiModels: 12,
      gpuCores: 2048,
    },
    {
      id: "edge-iot-1",
      position: [-45, 8, 0],
      type: "iot-edge",
      name: "IoT边缘节点-1",
      status: "active",
      computePower: 67,
      iotDevices: 15637,
      sensors: 8942,
    },
    {
      id: "edge-5g-1",
      position: [0, 8, 45],
      type: "5g-edge",
      name: "5G边缘节点-1",
      status: "active",
      computePower: 88,
      bandwidth: 20000,
      latency: 1,
    },
    {
      id: "edge-quantum-1",
      position: [0, 8, -45],
      type: "quantum-edge",
      name: "量子边缘节点-1",
      status: "processing",
      computePower: 99,
      qubits: 2048,
      coherenceTime: 100,
    },
  ],

  // 安全设施
  securityNodes: [
    {
      id: "firewall-1",
      position: [25, 5, 25],
      type: "firewall",
      name: "高级防火墙-1",
      status: "active",
      blockedAttacks: 1247,
      throughput: 50000,
      rules: 10000,
    },
    {
      id: "ids-1",
      position: [-25, 5, 25],
      type: "ids",
      name: "入侵检测系统-1",
      status: "active",
      detectedThreats: 89,
      analysisRate: 1000000,
      accuracy: 98.7,
    },
    {
      id: "honeypot-1",
      position: [25, 5, -25],
      type: "honeypot",
      name: "蜜罐系统-1",
      status: "active",
      trapCount: 156,
      attacksCaptured: 445,
      dataCollected: 2.3,
    },
    {
      id: "soc-1",
      position: [-25, 5, -25],
      type: "soc",
      name: "安全运营中心",
      status: "active",
      incidents: 23,
      analysts: 12,
      responseTime: 4.2,
    },
  ],

  // 云服务节点
  cloudNodes: [
    {
      id: "cloud-primary",
      position: [0, 25, 0],
      type: "cloud-primary",
      name: "主云数据中心",
      status: "active",
      instances: 10240,
      storage: 500000,
      availability: 99.99,
    },
    {
      id: "cloud-backup",
      position: [15, 20, 15],
      type: "cloud-backup",
      name: "备份云中心",
      status: "active",
      instances: 2048,
      storage: 100000,
      availability: 99.9,
    },
    {
      id: "cloud-edge",
      position: [-15, 20, -15],
      type: "cloud-edge",
      name: "边缘云节点",
      status: "active",
      instances: 512,
      storage: 25000,
      availability: 99.5,
    },
  ],

  // 网络连接定��
  connections: [
    // 核心到分布层
    {
      from: "core-1",
      to: "dist-1",
      type: "fiber",
      bandwidth: 10000,
      encryption: "quantum",
    },
    {
      from: "core-1",
      to: "dist-2",
      type: "fiber",
      bandwidth: 10000,
      encryption: "quantum",
    },
    {
      from: "core-1",
      to: "dist-3",
      type: "fiber",
      bandwidth: 8000,
      encryption: "aes256",
    },
    {
      from: "core-1",
      to: "dist-4",
      type: "fiber",
      bandwidth: 10000,
      encryption: "quantum",
    },

    // 分布层到接入层
    {
      from: "dist-1",
      to: "access-e1",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "dist-1",
      to: "access-e2",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "dist-2",
      to: "access-w1",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "dist-2",
      to: "access-w2",
      type: "copper",
      bandwidth: 100,
      encryption: "none",
    },
    {
      from: "dist-3",
      to: "access-n1",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "dist-3",
      to: "access-n2",
      type: "wireless",
      bandwidth: 500,
      encryption: "wpa3",
    },
    {
      from: "dist-4",
      to: "access-s1",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "dist-4",
      to: "access-s2",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },

    // 边缘节点连接
    {
      from: "dist-1",
      to: "edge-ai-1",
      type: "fiber",
      bandwidth: 10000,
      encryption: "quantum",
    },
    {
      from: "dist-2",
      to: "edge-iot-1",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "dist-3",
      to: "edge-5g-1",
      type: "5g",
      bandwidth: 20000,
      encryption: "5g-nea",
    },
    {
      from: "dist-4",
      to: "edge-quantum-1",
      type: "quantum",
      bandwidth: 50000,
      encryption: "quantum",
    },

    // 安全节点连接
    {
      from: "core-1",
      to: "firewall-1",
      type: "fiber",
      bandwidth: 50000,
      encryption: "quantum",
    },
    {
      from: "core-1",
      to: "ids-1",
      type: "fiber",
      bandwidth: 10000,
      encryption: "aes256",
    },
    {
      from: "core-1",
      to: "honeypot-1",
      type: "fiber",
      bandwidth: 1000,
      encryption: "aes256",
    },
    {
      from: "core-1",
      to: "soc-1",
      type: "fiber",
      bandwidth: 10000,
      encryption: "quantum",
    },

    // 云节点连接
    {
      from: "core-1",
      to: "cloud-primary",
      type: "fiber",
      bandwidth: 100000,
      encryption: "quantum",
    },
    {
      from: "cloud-primary",
      to: "cloud-backup",
      type: "fiber",
      bandwidth: 10000,
      encryption: "aes256",
    },
    {
      from: "cloud-primary",
      to: "cloud-edge",
      type: "fiber",
      bandwidth: 5000,
      encryption: "aes256",
    },
  ],
};

/**
 * 量子网络节点组件
 */
function QuantumNetworkNode({
  node,
  realTimeData,
}: {
  node: any;
  realTimeData: any;
}) {
  const nodeRef = useRef<Group>(null);
  const pulseRef = useRef<Mesh>(null);

  const nodeColor = getNodeTypeColor(node.type);
  const statusColor = getStatusColor(node.status);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (nodeRef.current) {
      // 节点轻微浮动
      nodeRef.current.position.y =
        node.position[1] + Math.sin(time * 2 + node.id.length) * 0.1;

      // 根据节点类型旋转
      if (node.type.includes("quantum")) {
        nodeRef.current.rotation.y = time * 0.5;
        nodeRef.current.rotation.x = time * 0.3;
      } else {
        nodeRef.current.rotation.y = time * 0.1;
      }
    }

    if (pulseRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.2;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  const getNodeGeometry = () => {
    switch (node.type) {
      case "quantum-core":
        return <icosahedronGeometry args={[2, 3]} />;
      case "distribution":
        return <octahedronGeometry args={[1.5, 2]} />;
      case "access":
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case "ai-edge":
        return <tetrahedronGeometry args={[1.8, 2]} />;
      case "iot-edge":
        return <sphereGeometry args={[1.3, 16, 16]} />;
      case "5g-edge":
        return <cylinderGeometry args={[1, 1.5, 2, 8]} />;
      case "quantum-edge":
        return <icosahedronGeometry args={[1.5, 2]} />;
      case "firewall":
        return <boxGeometry args={[2, 2.5, 2]} />;
      case "ids":
        return <octahedronGeometry args={[1.8, 1]} />;
      case "honeypot":
        return <tetrahedronGeometry args={[1.5, 1]} />;
      case "soc":
        return <sphereGeometry args={[1.8, 12, 12]} />;
      case "cloud-primary":
        return <sphereGeometry args={[3, 20, 20]} />;
      case "cloud-backup":
        return <sphereGeometry args={[2, 16, 16]} />;
      case "cloud-edge":
        return <sphereGeometry args={[1.5, 12, 12]} />;
      default:
        return <sphereGeometry args={[1, 12, 12]} />;
    }
  };

  const getNodeInfo = () => {
    switch (node.type) {
      case "quantum-core":
        return [`量子比特: ${node.qubits}`, `连接数: ${node.connections}`];
      case "distribution":
        return [`吞吐量: ${node.throughput} Mbps`, `量子比特: ${node.qubits}`];
      case "access":
        return [`用户数: ${node.users}`, `连接数: ${node.connections}`];
      case "ai-edge":
        return [`算力: ${node.computePower}%`, `AI模型: ${node.aiModels}`];
      case "iot-edge":
        return [`设备数: ${node.iotDevices}`, `传感器: ${node.sensors}`];
      case "5g-edge":
        return [`带宽: ${node.bandwidth} Mbps`, `延迟: ${node.latency}ms`];
      case "quantum-edge":
        return [
          `量子比特: ${node.qubits}`,
          `相干时间: ${node.coherenceTime}μs`,
        ];
      case "firewall":
        return [`拦截攻击: ${node.blockedAttacks}`, `规则数: ${node.rules}`];
      case "ids":
        return [
          `检测威胁: ${node.detectedThreats}`,
          `准确率: ${node.accuracy}%`,
        ];
      case "honeypot":
        return [
          `捕获攻击: ${node.attacksCaptured}`,
          `数据: ${node.dataCollected} TB`,
        ];
      case "soc":
        return [
          `事件数: ${node.incidents}`,
          `响应时间: ${node.responseTime}min`,
        ];
      case "cloud-primary":
        return [`实例数: ${node.instances}`, `可用性: ${node.availability}%`];
      case "cloud-backup":
        return [`存储: ${node.storage} GB`, `可用性: ${node.availability}%`];
      case "cloud-edge":
        return [`实例数: ${node.instances}`, `存储: ${node.storage} GB`];
      default:
        return ["", ""];
    }
  };

  const [info1, info2] = getNodeInfo();

  return (
    <group ref={nodeRef} position={node.position}>
      {/* 主节点体 */}
      <mesh>
        {getNodeGeometry()}
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 状态脉冲环 */}
      <mesh ref={pulseRef}>
        <torusGeometry args={[2.5, 0.1, 8, 32]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.6} />
      </mesh>

      {/* 量子效果 */}
      {node.type.includes("quantum") && (
        <Sparkles
          count={30}
          scale={[5, 5, 5]}
          size={3}
          speed={1}
          color={DISPLAY_COLORS.neon.purple}
          opacity={0.8}
        />
      )}

      {/* AI效果 */}
      {node.type.includes("ai") && (
        <Sparkles
          count={20}
          scale={[4, 4, 4]}
          size={2}
          speed={0.8}
          color={DISPLAY_COLORS.neon.blue}
          opacity={0.7}
        />
      )}

      {/* 5G效果 */}
      {node.type.includes("5g") && (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <mesh key={i} position={[0, 1 + i * 0.5, 0]}>
              <torusGeometry args={[1 + i * 0.3, 0.05, 8, 32]} />
              <meshBasicMaterial
                color={DISPLAY_COLORS.neon.cyan}
                transparent
                opacity={0.7 - i * 0.2}
              />
            </mesh>
          ))}
        </>
      )}

      {/* 云效果 */}
      {node.type.includes("cloud") && (
        <mesh>
          <sphereGeometry
            args={[node.type === "cloud-primary" ? 4 : 3, 16, 16]}
          />
          <meshStandardMaterial
            color={DISPLAY_COLORS.neon.cyan}
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}

      {/* 安全节点特殊效果 */}
      {["firewall", "ids", "honeypot", "soc"].includes(node.type) && (
        <mesh>
          <torusGeometry args={[3, 0.1, 8, 32]} />
          <meshBasicMaterial
            color={DISPLAY_COLORS.security.high}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* 节点信息显示 */}
      <Billboard position={[0, 4, 0]}>
        <Text
          fontSize={0.5}
          color={nodeColor}
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.4}
          color={statusColor}
          anchorX="center"
          anchorY="middle"
        >
          状态:{" "}
          {node.status === "active"
            ? "运行中"
            : node.status === "warning"
              ? "警告"
              : node.status === "critical"
                ? "严重"
                : node.status === "processing"
                  ? "处理中"
                  : "离线"}
        </Text>
        {info1 && (
          <Text
            position={[0, -1.0, 0]}
            fontSize={0.3}
            color={DISPLAY_COLORS.ui.text.secondary}
            anchorX="center"
            anchorY="middle"
          >
            {info1}
          </Text>
        )}
        {info2 && (
          <Text
            position={[0, -1.3, 0]}
            fontSize={0.3}
            color={DISPLAY_COLORS.ui.text.secondary}
            anchorX="center"
            anchorY="middle"
          >
            {info2}
          </Text>
        )}
      </Billboard>
    </group>
  );
}

/**
 * 网络连接线组件
 */
function NetworkConnection({
  connection,
  nodes,
  realTimeData,
}: {
  connection: any;
  nodes: any[];
  realTimeData: any;
}) {
  const connectionRef = useRef<Group>(null);
  const dataPacketRef = useRef<Mesh>(null);

  const fromNode = nodes.find((n) => n.id === connection.from);
  const toNode = nodes.find((n) => n.id === connection.to);

  if (!fromNode || !toNode) return null;

  const fromPos = new Vector3(...fromNode.position);
  const toPos = new Vector3(...toNode.position);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (dataPacketRef.current) {
      // 数据包沿连接线移动
      const progress = (Math.sin(time * 2 + connection.from.length) + 1) / 2;
      dataPacketRef.current.position.lerpVectors(fromPos, toPos, progress);
    }
  });

  const getConnectionColor = () => {
    switch (connection.encryption) {
      case "quantum":
        return DISPLAY_COLORS.neon.purple;
      case "aes256":
        return DISPLAY_COLORS.neon.blue;
      case "5g-nea":
        return DISPLAY_COLORS.neon.cyan;
      case "wpa3":
        return DISPLAY_COLORS.neon.green;
      case "none":
        return DISPLAY_COLORS.security.critical;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const getConnectionWidth = () => {
    if (connection.bandwidth >= 10000) return 4;
    if (connection.bandwidth >= 1000) return 3;
    if (connection.bandwidth >= 100) return 2;
    return 1;
  };

  const connectionColor = getConnectionColor();
  const lineWidth = getConnectionWidth();

  return (
    <group ref={connectionRef}>
      {/* 主连接线 */}
      {/* <Line
        points={[fromPos, toPos]}
        color={connectionColor}
        lineWidth={lineWidth}
        transparent
        opacity={0.8}
      /> */}

      {/* 加密类型显示 */}
      {connection.encryption !== "none" && (
        /* <Line
          points={[fromPos, toPos]}
          color={connectionColor}
          lineWidth={lineWidth + 2}
          transparent
          opacity={0.3}
          dashed
          dashSize={1}
          gapSize={0.5}
        /> */
        <></>
      )}

      {/* 移动的数据包 */}
      <mesh ref={dataPacketRef}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial
          color={connectionColor}
          emissive={connectionColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 量子纠缠效果 */}
      {connection.encryption === "quantum" && (
        <Trail
          width={0.3}
          length={8}
          color={DISPLAY_COLORS.neon.purple}
          attenuation={(t) => t * t}
        >
          <mesh ref={dataPacketRef}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={DISPLAY_COLORS.neon.purple} />
          </mesh>
        </Trail>
      )}

      {/* 连接信息显示 */}
      <Billboard
        position={[
          (fromPos.x + toPos.x) / 2,
          (fromPos.y + toPos.y) / 2 + 1,
          (fromPos.z + toPos.z) / 2,
        ]}
      >
        <Text
          fontSize={0.3}
          color={connectionColor}
          anchorX="center"
          anchorY="middle"
        >
          {connection.type.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.25}
          color={DISPLAY_COLORS.ui.text.secondary}
          anchorX="center"
          anchorY="middle"
        >
          {connection.bandwidth >= 1000
            ? `${connection.bandwidth / 1000}G`
            : `${connection.bandwidth}M`}
        </Text>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.2}
          color={connectionColor}
          anchorX="center"
          anchorY="middle"
        >
          {connection.encryption === "none"
            ? "未加密"
            : connection.encryption.toUpperCase()}
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * 网络层级指示器
 */
function NetworkLayerIndicator({ layer, radius, height, color, name }: any) {
  const layerRef = useRef<Group>(null);

  useFrame((state) => {
    if (layerRef.current) {
      layerRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={layerRef} position={[0, height, 0]}>
      {/* 层级环 */}
      <mesh>
        <torusGeometry args={[radius, radius * 0.01, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* 层级标识 */}
      <Billboard position={[radius + 5, 0, 0]}>
        <Text fontSize={0.8} color={color} anchorX="left" anchorY="middle">
          {name}
        </Text>
      </Billboard>

      {/* 层级分割线 */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 量子网络拓扑主组件
 */
export function QuantumNetworkTopology({
  realTimeData,
}: {
  realTimeData: any;
}) {
  const topologyRef = useRef<Group>(null);

  // 收集所有节点
  const allNodes = useMemo(() => {
    return [
      ...QUANTUM_NETWORK_CONFIG.coreLayer.nodes,
      ...QUANTUM_NETWORK_CONFIG.distributionLayer.nodes,
      ...QUANTUM_NETWORK_CONFIG.accessLayer.nodes,
      ...QUANTUM_NETWORK_CONFIG.edgeNodes,
      ...QUANTUM_NETWORK_CONFIG.securityNodes,
      ...QUANTUM_NETWORK_CONFIG.cloudNodes,
    ];
  }, []);

  useFrame((state) => {
    if (topologyRef.current) {
      // 整体缓慢旋转
      topologyRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <group ref={topologyRef}>
      {/* 网络层级指示器 */}
      <NetworkLayerIndicator
        layer="core"
        radius={QUANTUM_NETWORK_CONFIG.coreLayer.radius}
        height={0}
        color={DISPLAY_COLORS.network.core}
        name="核心层"
      />
      <NetworkLayerIndicator
        layer="distribution"
        radius={QUANTUM_NETWORK_CONFIG.distributionLayer.radius}
        height={0}
        color={DISPLAY_COLORS.network.distribution}
        name="分布层"
      />
      <NetworkLayerIndicator
        layer="access"
        radius={QUANTUM_NETWORK_CONFIG.accessLayer.radius}
        height={0}
        color={DISPLAY_COLORS.network.access}
        name="接入层"
      />

      {/* 渲染所有网络节点 */}
      {allNodes.map((node) => (
        <QuantumNetworkNode
          key={node.id}
          node={node}
          realTimeData={realTimeData}
        />
      ))}

      {/* 渲染所有网络连接 */}
      {QUANTUM_NETWORK_CONFIG.connections.map((connection, index) => (
        <NetworkConnection
          key={index}
          connection={connection}
          nodes={allNodes}
          realTimeData={realTimeData}
        />
      ))}

      {/* 网络流量可视化 */}
      <Sparkles
        count={100}
        scale={[60, 20, 60]}
        size={1.5}
        speed={0.5}
        color={DISPLAY_COLORS.neon.cyan}
        opacity={0.4}
      />

      {/* 基础网格 */}
      <mesh position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshBasicMaterial
          color={DISPLAY_COLORS.ui.border.primary}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default QuantumNetworkTopology;
