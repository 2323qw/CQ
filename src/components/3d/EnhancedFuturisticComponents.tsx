import React, { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Line,
  Html,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Trail,
  Sparkles,
  Stars,
  useMatcapTexture,
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
  Color,
  PointLight,
  SpotLight,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  DoubleSide,
  BackSide,
  ShaderMaterial,
  TextureLoader,
  RepeatWrapping,
  Fog,
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
  getDataFlowColor,
  getTechLevelColor,
} from "@/lib/situationDisplayColors";

/**
 * 增强版3D科技中心配置
 * Enhanced 3D Tech Center Configuration
 */
const ENHANCED_CYBER_CONFIG = {
  // 量子中央塔配置
  quantumTower: {
    position: [0, 0, 0],
    height: 40,
    radius: 5,
    floors: 10,
    color: DISPLAY_COLORS.corporate.primary,
    accentColor: DISPLAY_COLORS.neon.blue,
    energyLevel: 100,
  },

  // 神经网络节点群
  neuralNodes: [
    {
      id: "neural-core-alpha",
      position: [20, 12, 20],
      type: "neural-core",
      status: "active",
      energy: 98,
      connections: 15,
      dataFlow: 95,
      techLevel: "neural",
    },
    {
      id: "neural-core-beta",
      position: [-20, 12, 20],
      type: "neural-core",
      status: "active",
      energy: 94,
      connections: 13,
      dataFlow: 87,
      techLevel: "neural",
    },
    {
      id: "neural-core-gamma",
      position: [20, 12, -20],
      type: "neural-core",
      status: "warning",
      energy: 78,
      connections: 9,
      dataFlow: 76,
      techLevel: "neural",
    },
    {
      id: "neural-core-delta",
      position: [-20, 12, -20],
      type: "neural-core",
      status: "active",
      energy: 92,
      connections: 12,
      dataFlow: 91,
      techLevel: "neural",
    },
    {
      id: "quantum-edge-1",
      position: [35, 6, 0],
      type: "quantum-edge",
      status: "active",
      energy: 85,
      connections: 8,
      dataFlow: 68,
      techLevel: "quantum",
    },
    {
      id: "quantum-edge-2",
      position: [-35, 6, 0],
      type: "quantum-edge",
      status: "active",
      energy: 87,
      connections: 9,
      dataFlow: 72,
      techLevel: "quantum",
    },
    {
      id: "ai-processing-1",
      position: [0, 6, 35],
      type: "ai-processing",
      status: "processing",
      energy: 76,
      connections: 7,
      dataFlow: 58,
      techLevel: "ai",
    },
    {
      id: "ai-processing-2",
      position: [0, 6, -35],
      type: "ai-processing",
      status: "critical",
      energy: 45,
      connections: 4,
      dataFlow: 32,
      techLevel: "ai",
    },
  ],

  // 增强数据流管道
  enhancedDataPipes: [
    {
      id: "quantum-primary-1",
      from: [0, 20, 0],
      to: [20, 12, 20],
      bandwidth: 98,
      type: "quantum-primary",
      energy: 95,
      priority: "critical",
    },
    {
      id: "quantum-primary-2",
      from: [0, 20, 0],
      to: [-20, 12, 20],
      bandwidth: 94,
      type: "quantum-primary",
      energy: 90,
      priority: "critical",
    },
    {
      id: "neural-secondary-1",
      from: [20, 12, 20],
      to: [35, 6, 0],
      bandwidth: 68,
      type: "neural-secondary",
      energy: 75,
      priority: "high",
    },
    {
      id: "neural-secondary-2",
      from: [-20, 12, 20],
      to: [-35, 6, 0],
      bandwidth: 72,
      type: "neural-secondary",
      energy: 78,
      priority: "high",
    },
    {
      id: "ai-tertiary-1",
      from: [20, 12, -20],
      to: [0, 6, -35],
      bandwidth: 32,
      type: "ai-tertiary",
      energy: 45,
      priority: "medium",
    },
    {
      id: "ai-tertiary-2",
      from: [-20, 12, -20],
      to: [0, 6, 35],
      bandwidth: 58,
      type: "ai-tertiary",
      energy: 65,
      priority: "medium",
    },
  ],

  // 量子防护罩
  quantumShields: [
    {
      id: "outer-shield",
      position: [0, 0, 0],
      radius: 50,
      height: 3,
      opacity: 0.15,
      energy: 100,
      type: "quantum-barrier",
    },
    {
      id: "inner-shield",
      position: [0, 12, 0],
      radius: 35,
      height: 2,
      opacity: 0.25,
      energy: 95,
      type: "neural-barrier",
    },
    {
      id: "core-shield",
      position: [0, 20, 0],
      radius: 20,
      height: 1.5,
      opacity: 0.35,
      energy: 98,
      type: "ai-barrier",
    },
  ],

  // 高级粒子系统
  advancedParticles: {
    quantum: {
      count: 1000,
      spread: 60,
      color: DISPLAY_COLORS.neon.purple,
      speed: 0.015,
      behavior: "quantum-fluctuation",
    },
    neural: {
      count: 800,
      spread: 45,
      color: DISPLAY_COLORS.neon.green,
      speed: 0.025,
      behavior: "neural-impulse",
    },
    energy: {
      count: 600,
      spread: 35,
      color: DISPLAY_COLORS.neon.blue,
      speed: 0.035,
      behavior: "energy-flow",
    },
    data: {
      count: 400,
      spread: 25,
      color: DISPLAY_COLORS.neon.cyan,
      speed: 0.045,
      behavior: "data-stream",
    },
  },
};

/**
 * 增强版量子中央监控塔
 * Enhanced Quantum Central Monitoring Tower
 */
export function EnhancedQuantumTower() {
  const towerRef = useRef<Group>(null);
  const coreRef = useRef<Group>(null);
  const energyRingRef = useRef<Group>(null);
  const hologramRef = useRef<Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (towerRef.current) {
      // 塔楼主体缓慢旋转
      towerRef.current.rotation.y = time * 0.05;
    }

    if (coreRef.current) {
      // 核心更快旋转
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }

    if (energyRingRef.current) {
      // 能量环反向旋转
      energyRingRef.current.rotation.y = -time * 0.2;
      energyRingRef.current.position.y = 20 + Math.sin(time * 2) * 0.5;
    }

    if (hologramRef.current) {
      // 全息投影效果
      hologramRef.current.rotation.y = time * 0.4;
      hologramRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.05);
    }
  });

  const { quantumTower } = ENHANCED_CYBER_CONFIG;

  return (
    <group ref={towerRef} position={quantumTower.position}>
      {/* 塔楼主体 - 多层结构 */}
      {Array.from({ length: quantumTower.floors }, (_, i) => {
        const floorY = (i * quantumTower.height) / quantumTower.floors;
        const floorRadius = quantumTower.radius * (1 - i * 0.06);
        const floorHeight = quantumTower.height / quantumTower.floors;

        return (
          <group key={i} position={[0, floorY, 0]}>
            {/* 主楼层 */}
            <mesh>
              <cylinderGeometry
                args={[floorRadius, floorRadius + 0.3, floorHeight, 24]}
              />
              <meshStandardMaterial
                color={quantumTower.color}
                emissive={new Color(quantumTower.color)}
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* 能量光环 */}
            <mesh position={[0, floorHeight / 2, 0]}>
              <torusGeometry args={[floorRadius + 1, 0.15, 12, 32]} />
              <meshStandardMaterial
                color={quantumTower.accentColor}
                emissive={new Color(quantumTower.accentColor)}
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
              />
            </mesh>

            {/* 楼层数据接口 */}
            {Array.from({ length: 8 }, (_, j) => {
              const angle = (j / 8) * Math.PI * 2;
              const x = Math.cos(angle) * (floorRadius + 0.2);
              const z = Math.sin(angle) * (floorRadius + 0.2);

              return (
                <mesh key={j} position={[x, 0, z]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial
                    color={DISPLAY_COLORS.neon.green}
                    emissive={new Color(DISPLAY_COLORS.neon.green)}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              );
            })}

            {/* 楼层光源 */}
            <pointLight
              position={[0, 0, 0]}
              color={quantumTower.accentColor}
              intensity={0.6}
              distance={floorRadius * 4}
            />
          </group>
        );
      })}

      {/* 量子核心 */}
      <group ref={coreRef} position={[0, quantumTower.height + 5, 0]}>
        <mesh>
          <icosahedronGeometry args={[3, 1]} />
          <meshStandardMaterial
            color={DISPLAY_COLORS.neon.purple}
            emissive={new Color(DISPLAY_COLORS.neon.purple)}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
            side={DoubleSide}
          />
        </mesh>

        {/* 核心能量脉冲 */}
        <mesh>
          <sphereGeometry args={[4, 16, 16]} />
          <meshStandardMaterial
            color={DISPLAY_COLORS.neon.blue}
            emissive={new Color(DISPLAY_COLORS.neon.blue)}
            emissiveIntensity={0.4}
            transparent
            opacity={0.3}
            side={DoubleSide}
          />
        </mesh>
      </group>

      {/* 能量环系统 */}
      <group ref={energyRingRef}>
        {[6, 8, 10, 12].map((radius, index) => (
          <mesh key={index} rotation={[Math.PI / 2, 0, index * (Math.PI / 4)]}>
            <torusGeometry args={[radius, 0.1, 8, 32]} />
            <meshStandardMaterial
              color={DISPLAY_COLORS.material.effect.energy}
              emissive={new Color(DISPLAY_COLORS.material.effect.energy)}
              emissiveIntensity={0.7}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* 全息数据投影 */}
      <group ref={hologramRef} position={[0, quantumTower.height + 10, 0]}>
        <EnhancedHolographicDisplay />
      </group>

      {/* 塔楼信息面板 */}
      <Html position={[0, quantumTower.height + 15, 0]} center>
        <div
          className="pointer-events-none px-6 py-4 rounded-xl shadow-2xl border text-center backdrop-blur-md"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: quantumTower.accentColor,
            color: DISPLAY_COLORS.ui.text.primary,
            boxShadow: `0 0 30px ${quantumTower.accentColor}60`,
          }}
        >
          <div className="text-xl font-bold neon-text mb-2">量子中央控制塔</div>
          <div className="text-sm opacity-80 mb-3">
            Quantum Central Control Tower
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-neon-green">能量等级</div>
              <div className="font-mono">{quantumTower.energyLevel}%</div>
            </div>
            <div>
              <div className="text-neon-blue">量子状态</div>
              <div className="font-mono">稳定</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 增强版全息数据显示
 */
function EnhancedHolographicDisplay() {
  const displayRef = useRef<Group>(null);

  useFrame((state) => {
    if (displayRef.current) {
      const time = state.clock.getElapsedTime();
      displayRef.current.rotation.y = time * 0.3;

      // 全息闪烁效果
      displayRef.current.children.forEach((child, index) => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial
        ) {
          child.material.opacity = 0.6 + Math.sin(time * 5 + index) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={displayRef}>
      {/* 全息数据环 */}
      {[2, 3, 4, 5].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, index * (Math.PI / 6)]}>
          <torusGeometry args={[radius, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={DISPLAY_COLORS.material.effect.hologram}
            emissive={new Color(DISPLAY_COLORS.material.effect.hologram)}
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* 全息数据点 */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 3 + Math.sin(i) * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={DISPLAY_COLORS.neon.cyan}
              emissive={new Color(DISPLAY_COLORS.neon.cyan)}
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 增强版神经网络节点群
 * Enhanced Neural Network Node Cluster
 */
export function EnhancedNeuralCluster() {
  const clusterRef = useRef<Group>(null);

  useFrame((state) => {
    if (clusterRef.current) {
      // 整体集群的量子波动
      clusterRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.8;
      clusterRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={clusterRef}>
      {ENHANCED_CYBER_CONFIG.neuralNodes.map((node, index) => (
        <EnhancedNeuralNode key={node.id} node={node} index={index} />
      ))}

      {/* 节点间连接线 */}
      <NeuralConnectionMatrix nodes={ENHANCED_CYBER_CONFIG.neuralNodes} />
    </group>
  );
}

/**
 * 增强版单个神经网络节点
 */
function EnhancedNeuralNode({ node, index }: { node: any; index: number }) {
  const nodeRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const auraRef = useRef<Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const statusColor = useMemo(() => getStatusColor(node.status), [node.status]);
  const techColor = useMemo(
    () => getTechLevelColor(node.techLevel),
    [node.techLevel],
  );
  const energyColor = useMemo(
    () => getPerformanceColor(node.energy),
    [node.energy],
  );

  const nodeSize = useMemo(() => {
    switch (node.type) {
      case "neural-core":
        return 2.5;
      case "quantum-edge":
        return 2;
      case "ai-processing":
        return 1.8;
      default:
        return 1.5;
    }
  }, [node.type]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (nodeRef.current) {
      // 个体浮动和脉冲
      nodeRef.current.position.y =
        node.position[1] + Math.sin(time * 2 + index) * 0.4;
    }

    if (coreRef.current) {
      // 核心旋转
      coreRef.current.rotation.y = time * 0.8;
      coreRef.current.rotation.x = time * 0.4;

      // 能量脉冲效果
      const pulse = 1 + Math.sin(time * 4 + index) * 0.1;
      coreRef.current.scale.setScalar(pulse);
    }

    if (auraRef.current) {
      // 光环效果
      auraRef.current.rotation.z = -time * 0.5;
      const auraPulse = 0.6 + Math.sin(time * 3 + index) * 0.2;
      if (auraRef.current.material instanceof MeshStandardMaterial) {
        auraRef.current.material.opacity = auraPulse;
      }
    }
  });

  return (
    <group
      ref={nodeRef}
      position={[node.position[0], node.position[1], node.position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 节点核心 - 根据类型选择几何体 */}
      <mesh ref={coreRef}>
        {node.type === "neural-core" && (
          <icosahedronGeometry args={[nodeSize, 1]} />
        )}
        {node.type === "quantum-edge" && (
          <octahedronGeometry args={[nodeSize, 1]} />
        )}
        {node.type === "ai-processing" && (
          <dodecahedronGeometry args={[nodeSize, 1]} />
        )}
        <meshStandardMaterial
          color={hovered ? techColor : statusColor}
          emissive={new Color(statusColor)}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 能量光环 */}
      <mesh ref={auraRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[nodeSize + 1.5, 0.1, 8, 32]} />
        <meshStandardMaterial
          color={energyColor}
          emissive={new Color(energyColor)}
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 数据连接点 */}
      <EnhancedConnectionPoints
        count={node.connections}
        radius={nodeSize + 2}
        color={techColor}
        energy={node.energy}
      />

      {/* 节点粒子系统 */}
      <NodeParticleSystem
        position={[0, 0, 0]}
        color={statusColor}
        count={node.dataFlow}
        type={node.type}
      />

      {/* 节点光源 */}
      <pointLight
        position={[0, 0, 0]}
        color={statusColor}
        intensity={1.2}
        distance={nodeSize * 10}
      />

      {/* 悬停信息面板 */}
      {hovered && (
        <Html position={[0, nodeSize + 4, 0]} center>
          <div
            className="pointer-events-none px-5 py-4 rounded-xl shadow-2xl border text-center backdrop-blur-md"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: statusColor,
              color: DISPLAY_COLORS.ui.text.primary,
              boxShadow: `0 0 25px ${statusColor}60`,
              minWidth: "280px",
            }}
          >
            <div className="text-lg font-bold neon-text mb-1">
              {node.id.toUpperCase()}
            </div>
            <div className="text-sm opacity-80 mb-3">
              {node.type === "neural-core" && "神经核心节点"}
              {node.type === "quantum-edge" && "量子边缘节点"}
              {node.type === "ai-processing" && "AI处理节点"}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-neon-green mb-1">能量等级</div>
                <div className="font-mono text-lg">{node.energy}%</div>
              </div>
              <div>
                <div className="text-neon-blue mb-1">数据流</div>
                <div className="font-mono text-lg">{node.dataFlow}%</div>
              </div>
              <div>
                <div className="text-neon-purple mb-1">连接数</div>
                <div className="font-mono text-lg">{node.connections}</div>
              </div>
              <div>
                <div className="text-neon-orange mb-1">状态</div>
                <div className="font-mono text-lg capitalize">
                  {node.status}
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 增强版连接点系统
 */
function EnhancedConnectionPoints({
  count,
  radius,
  color,
  energy,
}: {
  count: number;
  radius: number;
  color: string;
  energy: number;
}) {
  const pointsRef = useRef<Group>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.rotation.y = time * 1.5;

      // 根据能量等级调整旋转速度
      const speedMultiplier = energy / 100;
      pointsRef.current.rotation.x = time * 0.5 * speedMultiplier;
    }
  });

  return (
    <group ref={pointsRef}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 0.5;

        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={new Color(color)}
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* 连接点光束 */}
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={new Color(color)}
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 神经网络连接矩阵
 */
function NeuralConnectionMatrix({ nodes }: { nodes: any[] }) {
  const connectionsRef = useRef<Group>(null);

  useFrame((state) => {
    if (connectionsRef.current) {
      const time = state.clock.getElapsedTime();

      // 连接线能量流动效果
      connectionsRef.current.children.forEach((connection, index) => {
        if (connection instanceof Group) {
          connection.children.forEach((line) => {
            if (
              line instanceof Mesh &&
              line.material instanceof MeshStandardMaterial
            ) {
              line.material.emissiveIntensity =
                0.3 + Math.sin(time * 3 + index * 0.5) * 0.2;
            }
          });
        }
      });
    }
  });

  const connections = useMemo(() => {
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const distance = new Vector3(...nodeA.position).distanceTo(
          new Vector3(...nodeB.position),
        );

        // 只连接距离适中的节点
        if (distance < 40 && distance > 15) {
          result.push({
            from: nodeA.position,
            to: nodeB.position,
            strength: Math.min(nodeA.energy, nodeB.energy) / 100,
            type: nodeA.type === nodeB.type ? "same-type" : "cross-type",
          });
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <group ref={connectionsRef}>
      {connections.map((connection, index) => (
        <NeuralConnection key={index} connection={connection} />
      ))}
    </group>
  );
}

/**
 * 单个神经网络连接
 */
function NeuralConnection({ connection }: { connection: any }) {
  const connectionColor = useMemo(() => {
    if (connection.type === "same-type") {
      return DISPLAY_COLORS.neon.green;
    } else {
      return DISPLAY_COLORS.neon.blue;
    }
  }, [connection.type]);

  const points = useMemo(() => {
    const start = new Vector3(...connection.from);
    const end = new Vector3(...connection.to);
    const mid = new Vector3().lerpVectors(start, end, 0.5);

    // 添加一些弯曲
    mid.y += Math.random() * 3 + 2;

    return [start, mid, end];
  }, [connection]);

  return (
    <group>
      <Line
        points={points}
        color={connectionColor}
        lineWidth={2 + connection.strength * 3}
        transparent
        opacity={0.6 + connection.strength * 0.3}
      />

      {/* 连接线粒子流 */}
      <ConnectionParticleFlow
        path={points}
        color={connectionColor}
        speed={connection.strength}
      />
    </group>
  );
}

/**
 * 连接线粒子流
 */
function ConnectionParticleFlow({
  path,
  color,
  speed,
}: {
  path: Vector3[];
  color: string;
  speed: number;
}) {
  const particlesRef = useRef<Points>(null);

  const particleGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(15 * 3); // 5个粒子
    const colors = new Float32Array(15 * 3);

    for (let i = 0; i < 5; i++) {
      const progress = i / 4;
      let point: Vector3;

      if (progress <= 0.5) {
        point = new Vector3().lerpVectors(path[0], path[1], progress * 2);
      } else {
        point = new Vector3().lerpVectors(
          path[1],
          path[2],
          (progress - 0.5) * 2,
        );
      }

      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;

      const c = new Color(color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    return geometry;
  }, [path, color]);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime() * speed * 2;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < 5; i++) {
        const progress = (i / 4 + time) % 1;
        let point: Vector3;

        if (progress <= 0.5) {
          point = new Vector3().lerpVectors(path[0], path[1], progress * 2);
        } else {
          point = new Vector3().lerpVectors(
            path[1],
            path[2],
            (progress - 0.5) * 2,
          );
        }

        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.4}
        vertexColors
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 节点粒子系统
 */
function NodeParticleSystem({
  position,
  color,
  count,
  type,
}: {
  position: [number, number, number];
  color: string;
  count: number;
  type: string;
}) {
  const particlesRef = useRef<Points>(null);

  const particleCount = Math.floor(count / 5) + 10;

  const particleGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // 根据节点类型调整粒子分布
      let radius = 3;
      if (type === "neural-core") radius = 4;
      if (type === "quantum-edge") radius = 3.5;
      if (type === "ai-processing") radius = 3;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * radius;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = new Color(color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

    return geometry;
  }, [particleCount, color, type]);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // 粒子轨道运动
        const originalX = positions[i * 3];
        const originalZ = positions[i * 3 + 2];
        const radius = Math.sqrt(originalX * originalX + originalZ * originalZ);
        const angle = Math.atan2(originalZ, originalX) + time * 0.5;

        positions[i * 3] = radius * Math.cos(angle);
        positions[i * 3 + 2] = radius * Math.sin(angle);
        positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.01;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <points ref={particlesRef} position={position} geometry={particleGeometry}>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 增强版数据流管道系统
 * Enhanced Data Flow Pipeline System
 */
export function EnhancedDataFlowSystem() {
  const systemRef = useRef<Group>(null);

  useFrame((state) => {
    if (systemRef.current) {
      const time = state.clock.getElapsedTime();

      // 系统整体能量脉冲
      systemRef.current.children.forEach((pipeline, index) => {
        if (pipeline instanceof Group) {
          pipeline.children.forEach((element) => {
            if (
              element instanceof Mesh &&
              element.material instanceof MeshStandardMaterial
            ) {
              element.material.emissiveIntensity =
                0.4 + Math.sin(time * 4 + index) * 0.3;
            }
          });
        }
      });
    }
  });

  return (
    <group ref={systemRef}>
      {ENHANCED_CYBER_CONFIG.enhancedDataPipes.map((pipe, index) => (
        <EnhancedDataPipeline key={pipe.id} pipe={pipe} index={index} />
      ))}
    </group>
  );
}

/**
 * 增强版单个数据管道
 */
function EnhancedDataPipeline({ pipe, index }: { pipe: any; index: number }) {
  const pipelineRef = useRef<Group>(null);

  const pipeColor = useMemo(
    () => getDataFlowColor(pipe.bandwidth),
    [pipe.bandwidth],
  );
  const energyColor = useMemo(
    () => getPerformanceColor(pipe.energy),
    [pipe.energy],
  );

  const pipeWidth = useMemo(() => {
    switch (pipe.type) {
      case "quantum-primary":
        return 12;
      case "neural-secondary":
        return 8;
      case "ai-tertiary":
        return 5;
      default:
        return 6;
    }
  }, [pipe.type]);

  useFrame((state) => {
    if (pipelineRef.current) {
      const time = state.clock.getElapsedTime();

      // 管道能量脉冲
      pipelineRef.current.children.forEach((child) => {
        if (child instanceof Group) {
          child.children.forEach((element) => {
            if (
              element instanceof Mesh &&
              element.material instanceof MeshStandardMaterial
            ) {
              element.material.emissiveIntensity =
                0.5 + Math.sin(time * 5 + index * 0.8) * 0.3;
            }
          });
        }
      });
    }
  });

  // 创建弯曲管道路径
  const pipeGeometry = useMemo(() => {
    const start = new Vector3(...pipe.from);
    const end = new Vector3(...pipe.to);
    const distance = start.distanceTo(end);

    // 创建更复杂的曲线路径
    const mid1 = new Vector3().lerpVectors(start, end, 0.25);
    const mid2 = new Vector3().lerpVectors(start, end, 0.75);

    mid1.y += distance * 0.15;
    mid2.y += distance * 0.1;

    return { start, mid1, mid2, end };
  }, [pipe]);

  return (
    <group ref={pipelineRef}>
      {/* 主数据管道 */}
      <Line
        points={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={pipeColor}
        lineWidth={pipeWidth}
        transparent
        opacity={0.8}
      />

      {/* 管道外层光效 */}
      <Line
        points={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={energyColor}
        lineWidth={pipeWidth + 4}
        transparent
        opacity={0.3}
      />

      {/* 管��内层能量流 */}
      <Line
        points={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={DISPLAY_COLORS.neon.blue}
        lineWidth={pipeWidth / 2}
        transparent
        opacity={0.9}
      />

      {/* 高级数据流粒子 */}
      <EnhancedDataFlowParticles
        path={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={pipeColor}
        speed={pipe.bandwidth / 50}
        density={pipe.energy / 20}
        type={pipe.type}
      />

      {/* 管道接口节点 */}
      <PipelineEndpoint
        position={pipeGeometry.start}
        color={pipeColor}
        type="source"
      />
      <PipelineEndpoint
        position={pipeGeometry.end}
        color={pipeColor}
        type="target"
      />
    </group>
  );
}

/**
 * 管道端点
 */
function PipelineEndpoint({
  position,
  color,
  type,
}: {
  position: Vector3;
  color: string;
  type: "source" | "target";
}) {
  const endpointRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (endpointRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * 6) * 0.2;
      endpointRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={endpointRef} position={position}>
      <sphereGeometry args={[0.5, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={new Color(color)}
        emissiveIntensity={type === "source" ? 0.8 : 0.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

/**
 * 增强版数据流粒子
 */
function EnhancedDataFlowParticles({
  path,
  color,
  speed,
  density,
  type,
}: {
  path: Vector3[];
  color: string;
  speed: number;
  density: number;
  type: string;
}) {
  const particlesRef = useRef<Points>(null);

  const particleCount = Math.floor(density) + 20;

  const particleGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const progress = i / (particleCount - 1);
      let point: Vector3;

      // 三段式路径插值
      if (progress <= 0.33) {
        point = new Vector3().lerpVectors(path[0], path[1], progress * 3);
      } else if (progress <= 0.66) {
        point = new Vector3().lerpVectors(
          path[1],
          path[2],
          (progress - 0.33) * 3,
        );
      } else {
        point = new Vector3().lerpVectors(
          path[2],
          path[3],
          (progress - 0.66) * 3,
        );
      }

      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;

      const c = new Color(color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // 根据管道类型调整粒子大小
      let baseSize = 0.3;
      if (type === "quantum-primary") baseSize = 0.5;
      if (type === "neural-secondary") baseSize = 0.4;
      if (type === "ai-tertiary") baseSize = 0.3;

      sizes[i] = baseSize + Math.random() * 0.2;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

    return geometry;
  }, [path, color, particleCount, type]);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const progress = (i / (particleCount - 1) + time) % 1;
        let point: Vector3;

        if (progress <= 0.33) {
          point = new Vector3().lerpVectors(path[0], path[1], progress * 3);
        } else if (progress <= 0.66) {
          point = new Vector3().lerpVectors(
            path[1],
            path[2],
            (progress - 0.33) * 3,
          );
        } else {
          point = new Vector3().lerpVectors(
            path[2],
            path[3],
            (progress - 0.66) * 3,
          );
        }

        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={1.2}
        vertexColors
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 增强版量子防护屏障系统
 * Enhanced Quantum Protection Shield System
 */
export function EnhancedQuantumShields() {
  const shieldsRef = useRef<Group>(null);

  useFrame((state) => {
    if (shieldsRef.current) {
      const time = state.clock.getElapsedTime();

      // 防护罩层级旋转
      shieldsRef.current.children.forEach((shield, index) => {
        if (shield instanceof Group) {
          shield.rotation.y = time * (0.1 + index * 0.05);
          shield.rotation.x = Math.sin(time * 0.5 + index) * 0.1;

          // 能量波动效果
          shield.children.forEach((element) => {
            if (
              element instanceof Mesh &&
              element.material instanceof MeshStandardMaterial
            ) {
              element.material.opacity =
                0.1 + Math.sin(time * 3 + index * Math.PI) * 0.15;
              element.material.emissiveIntensity =
                0.3 + Math.sin(time * 2 + index) * 0.2;
            }
          });
        }
      });
    }
  });

  return (
    <group ref={shieldsRef}>
      {ENHANCED_CYBER_CONFIG.quantumShields.map((shield, index) => (
        <EnhancedQuantumShield key={shield.id} shield={shield} index={index} />
      ))}
    </group>
  );
}

/**
 * 增强版单个量子防护罩
 */
function EnhancedQuantumShield({
  shield,
  index,
}: {
  shield: any;
  index: number;
}) {
  const shieldRef = useRef<Group>(null);

  const shieldColor = useMemo(() => {
    switch (shield.type) {
      case "quantum-barrier":
        return DISPLAY_COLORS.neon.purple;
      case "neural-barrier":
        return DISPLAY_COLORS.neon.green;
      case "ai-barrier":
        return DISPLAY_COLORS.neon.blue;
      default:
        return DISPLAY_COLORS.corporate.accent;
    }
  }, [shield.type]);

  return (
    <group ref={shieldRef} position={shield.position}>
      {/* 主防护罩 */}
      <mesh>
        <cylinderGeometry
          args={[shield.radius, shield.radius, shield.height, 64, 1, true]}
        />
        <meshStandardMaterial
          color={shieldColor}
          emissive={new Color(shieldColor)}
          emissiveIntensity={0.4}
          transparent
          opacity={shield.opacity}
          side={DoubleSide}
        />
      </mesh>

      {/* 防护罩网格效果 */}
      <mesh>
        <cylinderGeometry
          args={[
            shield.radius + 0.1,
            shield.radius + 0.1,
            shield.height,
            32,
            8,
            true,
          ]}
        />
        <meshStandardMaterial
          color={shieldColor}
          emissive={new Color(shieldColor)}
          emissiveIntensity={0.6}
          transparent
          opacity={shield.opacity * 0.5}
          wireframe
        />
      </mesh>

      {/* 防护罩粒子环 */}
      <ShieldParticleRing
        radius={shield.radius}
        color={shieldColor}
        energy={shield.energy}
        type={shield.type}
      />

      {/* 防护罩能量脉冲 */}
      <mesh position={[0, shield.height / 2, 0]}>
        <torusGeometry args={[shield.radius + 1, 0.2, 8, 32]} />
        <meshStandardMaterial
          color={shieldColor}
          emissive={new Color(shieldColor)}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[0, -shield.height / 2, 0]}>
        <torusGeometry args={[shield.radius + 1, 0.2, 8, 32]} />
        <meshStandardMaterial
          color={shieldColor}
          emissive={new Color(shieldColor)}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

/**
 * 防护罩粒子环
 */
function ShieldParticleRing({
  radius,
  color,
  energy,
  type,
}: {
  radius: number;
  color: string;
  energy: number;
  type: string;
}) {
  const particlesRef = useRef<Points>(null);

  const particleCount = Math.floor(radius * 4);

  const particleGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 4;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = new Color(color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    return geometry;
  }, [particleCount, radius, color]);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * (energy / 100);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        positions[i * 3] = x;
        positions[i * 3 + 2] = z;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 增强版环境基础设施
 * Enhanced Environment Infrastructure
 */
export function EnhancedEnvironment() {
  const environmentRef = useRef<Group>(null);

  useFrame((state) => {
    if (environmentRef.current) {
      const time = state.clock.getElapsedTime();

      // 环境能量脉冲
      environmentRef.current.children.forEach((element, index) => {
        if (
          element instanceof Mesh &&
          element.material instanceof MeshStandardMaterial
        ) {
          element.material.emissiveIntensity =
            0.1 + Math.sin(time * 0.5 + index) * 0.05;
        }
      });
    }
  });

  return (
    <group ref={environmentRef}>
      {/* 多层基础平台 */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[80, 80, 1, 128]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          emissive={new Color(DISPLAY_COLORS.corporate.primary)}
          emissiveIntensity={0.1}
          transparent
          opacity={0.4}
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[60, 60, 0.5, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.tertiary}
          emissive={new Color(DISPLAY_COLORS.corporate.accent)}
          emissiveIntensity={0.15}
          transparent
          opacity={0.5}
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>

      {/* 增强网格系统 */}
      <AdvancedGridSystem />

      {/* 环境光照系统 */}
      <EnhancedLightingSystem />

      {/* 环境粒子系统 */}
      <EnhancedEnvironmentalParticles />
    </group>
  );
}

/**
 * 高级网格系统
 */
function AdvancedGridSystem() {
  const gridRef = useRef<Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.getElapsedTime();

      // 网格能量流动
      gridRef.current.children.forEach((line, index) => {
        if (
          line instanceof Mesh &&
          line.material instanceof MeshStandardMaterial
        ) {
          line.material.emissiveIntensity =
            0.3 + Math.sin(time * 2 + index * 0.1) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={gridRef} position={[0, -2.5, 0]}>
      {/* 主网格线 */}
      {Array.from({ length: 21 }, (_, i) => {
        const x = (i - 10) * 8;
        return (
          <Line
            key={`grid-x-${i}`}
            points={[
              [x, 0, -80],
              [x, 0, 80],
            ]}
            color={DISPLAY_COLORS.corporate.accent}
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        );
      })}

      {Array.from({ length: 21 }, (_, i) => {
        const z = (i - 10) * 8;
        return (
          <Line
            key={`grid-z-${i}`}
            points={[
              [-80, 0, z],
              [80, 0, z],
            ]}
            color={DISPLAY_COLORS.corporate.accent}
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        );
      })}

      {/* 重点网格线 */}
      <Line
        points={[
          [-80, 0, 0],
          [80, 0, 0],
        ]}
        color={DISPLAY_COLORS.neon.green}
        lineWidth={2}
        transparent
        opacity={0.8}
      />
      <Line
        points={[
          [0, 0, -80],
          [0, 0, 80],
        ]}
        color={DISPLAY_COLORS.neon.green}
        lineWidth={2}
        transparent
        opacity={0.8}
      />
    </group>
  );
}

/**
 * 增强光照系统
 */
function EnhancedLightingSystem() {
  return (
    <group>
      {/* 环境光 */}
      <ambientLight intensity={0.2} color="#ffffff" />

      {/* 主方向光 */}
      <directionalLight
        position={[40, 60, 40]}
        intensity={0.6}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      {/* 量子光�� */}
      <pointLight
        position={[0, 30, 0]}
        intensity={1.2}
        color={DISPLAY_COLORS.neon.purple}
        distance={120}
      />

      {/* 神经网络光源 */}
      <pointLight
        position={[25, 15, 25]}
        intensity={0.8}
        color={DISPLAY_COLORS.neon.green}
        distance={80}
      />

      <pointLight
        position={[-25, 15, -25]}
        intensity={0.8}
        color={DISPLAY_COLORS.neon.green}
        distance={80}
      />

      {/* AI处理光源 */}
      <pointLight
        position={[0, 10, 40]}
        intensity={0.6}
        color={DISPLAY_COLORS.neon.blue}
        distance={60}
      />

      {/* 聚光灯系统 */}
      <spotLight
        position={[50, 40, 50]}
        angle={Math.PI / 8}
        penumbra={0.5}
        intensity={0.8}
        color={DISPLAY_COLORS.neon.cyan}
        distance={100}
        target-position={[0, 0, 0]}
      />

      <spotLight
        position={[-50, 40, -50]}
        angle={Math.PI / 8}
        penumbra={0.5}
        intensity={0.8}
        color={DISPLAY_COLORS.neon.pink}
        distance={100}
        target-position={[0, 0, 0]}
      />
    </group>
  );
}

/**
 * 增强环境粒子系统
 */
function EnhancedEnvironmentalParticles() {
  return (
    <group>
      {Object.entries(ENHANCED_CYBER_CONFIG.advancedParticles).map(
        ([type, config]) => (
          <AdvancedParticleSystem key={type} type={type} config={config} />
        ),
      )}
    </group>
  );
}

/**
 * 高级粒子系统
 */
function AdvancedParticleSystem({
  type,
  config,
}: {
  type: string;
  config: any;
}) {
  const particlesRef = useRef<Points>(null);

  const particleGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);
    const velocities = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
      // 根据行为类型分布粒子
      let x, y, z;

      switch (config.behavior) {
        case "quantum-fluctuation":
          x = (Math.random() - 0.5) * config.spread * 2;
          y = Math.random() * config.spread;
          z = (Math.random() - 0.5) * config.spread * 2;
          break;
        case "neural-impulse":
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * config.spread;
          x = Math.cos(angle) * radius;
          y = Math.random() * config.spread * 0.5;
          z = Math.sin(angle) * radius;
          break;
        case "energy-flow":
          x = (Math.random() - 0.5) * config.spread;
          y = Math.random() * config.spread * 1.5;
          z = (Math.random() - 0.5) * config.spread;
          break;
        default:
          x = (Math.random() - 0.5) * config.spread;
          y = Math.random() * config.spread;
          z = (Math.random() - 0.5) * config.spread;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = new Color(config.color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 2 + 0.5;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = Math.random() * config.speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute(
      "velocity",
      new Float32BufferAttribute(velocities, 3),
    );

    return geometry;
  }, [config]);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const velocities = particlesRef.current.geometry.attributes.velocity
        .array as Float32Array;

      for (let i = 0; i < config.count; i++) {
        // 更新粒子位置
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // 重置超出范围的粒子
        if (positions[i * 3 + 1] > config.spread) {
          positions[i * 3] = (Math.random() - 0.5) * config.spread * 2;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = (Math.random() - 0.5) * config.spread * 2;
        }

        // 根据行为类型添加特殊运动
        switch (config.behavior) {
          case "quantum-fluctuation":
            positions[i * 3] += Math.sin(time * 3 + i) * 0.01;
            positions[i * 3 + 2] += Math.cos(time * 3 + i) * 0.01;
            break;
          case "neural-impulse":
            const pulseStrength = Math.sin(time * 5 + i * 0.1);
            positions[i * 3] += pulseStrength * 0.005;
            positions[i * 3 + 2] += pulseStrength * 0.005;
            break;
          case "energy-flow":
            positions[i * 3] += Math.sin(time * 2 + i * 0.05) * 0.02;
            break;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
      />
    </points>
  );
}
