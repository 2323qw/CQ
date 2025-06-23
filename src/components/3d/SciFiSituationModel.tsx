import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Sphere, Cylinder, Torus, Ring } from "@react-three/drei";
import {
  Group,
  Vector3,
  Mesh,
  MeshStandardMaterial,
  Color,
  Quaternion,
} from "three";
import {
  DISPLAY_COLORS,
  getThreatColor,
  getStatusColor,
} from "@/lib/situationDisplayColors";

/**
 * 简洁科幻3D态势模型配置
 */
const SCI_FI_CONFIG = {
  centralCore: {
    position: [0, 0, 0] as [number, number, number],
    radius: 2,
    height: 4,
    rotationSpeed: 0.01,
  },

  defensiveRings: [
    { radius: 8, height: 0, thickness: 0.2 },
    { radius: 12, height: 2, thickness: 0.15 },
    { radius: 16, height: -1, thickness: 0.1 },
  ],

  dataNodes: [
    { position: [6, 3, 0], type: "database", status: "active" },
    { position: [-6, 3, 0], type: "server", status: "active" },
    { position: [0, 3, 8], type: "network", status: "warning" },
    { position: [0, 3, -8], type: "security", status: "active" },
    { position: [8, 1, 8], type: "ai", status: "processing" },
    { position: [-8, 1, -8], type: "quantum", status: "active" },
  ],
};

/**
 * 中央能量核心组件
 */
function CentralCore() {
  const coreRef = useRef<Group>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += SCI_FI_CONFIG.centralCore.rotationSpeed;
    }
  });

  return (
    <group ref={coreRef} position={SCI_FI_CONFIG.centralCore.position}>
      {/* 内部能量球 */}
      <mesh>
        <sphereGeometry args={[SCI_FI_CONFIG.centralCore.radius, 32, 32]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.neon.blue}
          emissive={DISPLAY_COLORS.neon.blue}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 外层防护罩 */}
      <mesh>
        <sphereGeometry
          args={[SCI_FI_CONFIG.centralCore.radius + 0.5, 32, 32]}
        />
        <meshStandardMaterial
          color={DISPLAY_COLORS.neon.cyan}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* 核心柱体 */}
      <mesh>
        <cylinderGeometry
          args={[0.5, 0.5, SCI_FI_CONFIG.centralCore.height, 8]}
        />
        <meshStandardMaterial
          color={DISPLAY_COLORS.neon.purple}
          emissive={DISPLAY_COLORS.neon.purple}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

/**
 * 防护环层组件
 */
function DefensiveRings() {
  const ringsRef = useRef<Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        if (ring instanceof Group) {
          ring.rotation.y += 0.005 * (i + 1);
        }
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {SCI_FI_CONFIG.defensiveRings.map((ring, i) => (
        <group key={i} position={[0, ring.height, 0]}>
          {/* 主环 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[
                ring.radius - ring.thickness,
                ring.radius + ring.thickness,
                64,
              ]}
            />
            <meshBasicMaterial
              color={DISPLAY_COLORS.neon.green}
              transparent
              opacity={0.4}
              side={2}
            />
          </mesh>

          {/* 节点指示器 */}
          {Array.from({ length: 8 }).map((_, nodeIndex) => {
            const angle = (nodeIndex / 8) * Math.PI * 2;
            const x = Math.cos(angle) * ring.radius;
            const z = Math.sin(angle) * ring.radius;

            return (
              <mesh key={nodeIndex} position={[x, 0, z]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial
                  color={DISPLAY_COLORS.neon.cyan}
                  emissive={DISPLAY_COLORS.neon.cyan}
                  emissiveIntensity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/**
 * 服务器机架模型
 */
function ServerRackModel({ node }: { node: any }) {
  const nodeRef = useRef<Group>(null);
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.neon.green;
      case "warning":
        return DISPLAY_COLORS.neon.orange;
      case "processing":
        return DISPLAY_COLORS.neon.purple;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const nodeColor = getNodeColor();

  useFrame((state) => {
    if (nodeRef.current && node.status === "processing") {
      nodeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={nodeRef} position={node.position}>
      {/* 服务器机架主体 */}
      <mesh>
        <boxGeometry args={[1.2, 2.5, 0.8]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 服务器托盘 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, -1 + i * 0.4, 0.35]}>
          <boxGeometry args={[1, 0.15, 0.1]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* LED指示灯 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-0.4 + i * 0.4, 1.5, 0.45]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 数据库存储柜模型
 */
function DatabaseStorageModel({ node }: { node: any }) {
  const nodeRef = useRef<Group>(null);
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.neon.blue;
      case "warning":
        return DISPLAY_COLORS.neon.orange;
      case "processing":
        return DISPLAY_COLORS.neon.cyan;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const nodeColor = getNodeColor();

  return (
    <group ref={nodeRef} position={node.position}>
      {/* 存储柜主体 */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 2.2, 8]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* 存储磁盘层 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[0, -0.8 + i * 0.3, 0]}
          rotation={[0, Math.PI * 0.25 * i, 0]}
        >
          <cylinderGeometry args={[0.75, 0.75, 0.1, 16]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* 数据流指示器 */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.4, 0.1, 8, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

/**
 * 网络设备模型
 */
function NetworkDeviceModel({ node }: { node: any }) {
  const nodeRef = useRef<Group>(null);
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.neon.cyan;
      case "warning":
        return DISPLAY_COLORS.neon.orange;
      case "processing":
        return DISPLAY_COLORS.neon.blue;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const nodeColor = getNodeColor();

  useFrame((state) => {
    if (nodeRef.current) {
      // 网络脉冲效果
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      nodeRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={nodeRef} position={node.position}>
      {/* 网络设备主体 */}
      <mesh>
        <boxGeometry args={[1.5, 0.4, 1]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* 网络端口 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.15, -0.1, 0.52]}>
          <boxGeometry args={[0.08, 0.06, 0.04]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* 天线 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 天线顶部 */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

/**
 * AI处理器模型
 */
function AIProcessorModel({ node }: { node: any }) {
  const nodeRef = useRef<Group>(null);
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.neon.purple;
      case "warning":
        return DISPLAY_COLORS.neon.orange;
      case "processing":
        return DISPLAY_COLORS.neon.pink;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const nodeColor = getNodeColor();

  useFrame((state) => {
    if (nodeRef.current && node.status === "processing") {
      nodeRef.current.rotation.x += 0.005;
      nodeRef.current.rotation.y += 0.01;
      nodeRef.current.rotation.z += 0.003;
    }
  });

  return (
    <group ref={nodeRef} position={node.position}>
      {/* AI核心处理器 */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.4}
          wireframe={false}
        />
      </mesh>

      {/* 神经网络连接 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={nodeColor}
              emissive={nodeColor}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* AI思考环 */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2, 0.05, 8, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

/**
 * 量子计算机模型
 */
function QuantumComputerModel({ node }: { node: any }) {
  const nodeRef = useRef<Group>(null);
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.neon.purple;
      case "warning":
        return DISPLAY_COLORS.neon.orange;
      case "processing":
        return DISPLAY_COLORS.neon.blue;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const nodeColor = getNodeColor();

  useFrame((state) => {
    if (nodeRef.current) {
      // 量子纠缠效果
      nodeRef.current.children.forEach((child, i) => {
        if (child instanceof Group) {
          child.rotation.y = state.clock.elapsedTime * (i + 1) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={nodeRef} position={node.position}>
      {/* 量子冷却室 */}
      <mesh>
        <cylinderGeometry args={[0.6, 1.2, 3, 6]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.primary}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* 量子比特层 */}
      {Array.from({ length: 3 }).map((_, layer) => (
        <group key={layer} position={[0, -1 + layer, 0]}>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 0.8;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return (
              <mesh key={i} position={[x, 0, z]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                  color={nodeColor}
                  emissive={nodeColor}
                  emissiveIntensity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* 量子场指示器 */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * 安全节点模型
 */
function SecurityNodeModel({ node }: { node: any }) {
  const nodeRef = useRef<Group>(null);
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.neon.green;
      case "warning":
        return DISPLAY_COLORS.neon.red;
      case "processing":
        return DISPLAY_COLORS.neon.yellow;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const nodeColor = getNodeColor();

  return (
    <group ref={nodeRef} position={node.position}>
      {/* 盾牌基座 */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 8]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 安全盾牌 */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          side={2}
        />
      </mesh>

      {/* 防护网格 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1;
        const z = Math.sin(angle) * 1;
        return (
          <mesh key={i} position={[x, 1.2, z]}>
            <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
            <meshStandardMaterial
              color={nodeColor}
              emissive={nodeColor}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 智能节点工厂 - 根据类型返回对应的3D模型
 */
function SmartDataNode({ node }: { node: any }) {
  switch (node.type) {
    case "server":
      return <ServerRackModel node={node} />;
    case "database":
      return <DatabaseStorageModel node={node} />;
    case "network":
      return <NetworkDeviceModel node={node} />;
    case "ai":
      return <AIProcessorModel node={node} />;
    case "quantum":
      return <QuantumComputerModel node={node} />;
    case "security":
      return <SecurityNodeModel node={node} />;
    default:
      return <ServerRackModel node={node} />; // 默认使用服务器模型
  }
}

/**
 * 连接线组件 - 使用简单几何体替代Line组件
 */
function SimpleConnection({
  from,
  to,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const connectionRef = useRef<Group>(null);

  const fromVec = new Vector3(...from);
  const toVec = new Vector3(...to);
  const center = fromVec.clone().add(toVec).multiplyScalar(0.5);
  const distance = fromVec.distanceTo(toVec);

  // 计算连接线的旋转
  const direction = toVec.clone().sub(fromVec).normalize();
  const up = new Vector3(0, 1, 0);
  const quaternion = new Quaternion().setFromUnitVectors(up, direction);

  return (
    <group ref={connectionRef}>
      {/* 连接起点 */}
      <mesh position={from}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* 连接终点 */}
      <mesh position={to}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* 中点指示器 */}
      <mesh position={center.toArray()}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * 主要SciFi态势模型组件
 */
export function SciFiSituationModel({ realTimeData }: { realTimeData?: any }) {
  const sceneRef = useRef<Group>(null);

  // 简化的连接数据
  const connections = useMemo(
    () => [
      { from: [6, 3, 0], to: [0, 0, 0], color: DISPLAY_COLORS.neon.blue },
      { from: [-6, 3, 0], to: [0, 0, 0], color: DISPLAY_COLORS.neon.blue },
      { from: [0, 3, 8], to: [0, 0, 0], color: DISPLAY_COLORS.neon.orange },
      { from: [0, 3, -8], to: [0, 0, 0], color: DISPLAY_COLORS.neon.green },
    ],
    [],
  );

  useFrame((state) => {
    if (sceneRef.current) {
      // 轻微的场景呼吸效果
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.02;
      sceneRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 中央能量核心 */}
      <CentralCore />

      {/* 防护环层 */}
      <DefensiveRings />

      {/* 数据节点 */}
      {SCI_FI_CONFIG.dataNodes.map((node, index) => (
        <SmartDataNode key={index} node={node} />
      ))}

      {/* 连接线 */}
      {connections.map((connection, index) => (
        <SimpleConnection
          key={index}
          from={connection.from as [number, number, number]}
          to={connection.to as [number, number, number]}
          color={connection.color}
        />
      ))}

      {/* 环境光效 */}
      <ambientLight intensity={0.4} />
      <pointLight
        position={[0, 10, 0]}
        intensity={1}
        color={DISPLAY_COLORS.neon.blue}
      />
      <pointLight
        position={[10, 5, 10]}
        intensity={0.5}
        color={DISPLAY_COLORS.neon.cyan}
      />
      <pointLight
        position={[-10, 5, -10]}
        intensity={0.5}
        color={DISPLAY_COLORS.neon.purple}
      />
    </group>
  );
}
