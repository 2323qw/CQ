import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Text,
  Line,
  Html,
  Sphere,
  Box,
  Cylinder,
  Torus,
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
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
} from "@/lib/situationDisplayColors";

/**
 * 未来感网络监控中心数据配置
 * Futuristic Cyber Monitoring Center Data Configuration
 */
const CYBER_CENTER_CONFIG = {
  // 中央监控塔配置
  centralTower: {
    position: [0, 0, 0],
    height: 30,
    radius: 4,
    floors: 8,
    color: DISPLAY_COLORS.corporate.primary,
  },

  // 数据节点群配置
  dataNodes: [
    {
      id: "core-1",
      position: [15, 8, 15],
      type: "core",
      status: "active",
      dataFlow: 95,
      connections: 12,
    },
    {
      id: "core-2",
      position: [-15, 8, 15],
      type: "core",
      status: "active",
      dataFlow: 87,
      connections: 10,
    },
    {
      id: "core-3",
      position: [15, 8, -15],
      type: "core",
      status: "warning",
      dataFlow: 76,
      connections: 8,
    },
    {
      id: "core-4",
      position: [-15, 8, -15],
      type: "core",
      status: "active",
      dataFlow: 92,
      connections: 11,
    },
    {
      id: "edge-1",
      position: [25, 4, 0],
      type: "edge",
      status: "active",
      dataFlow: 65,
      connections: 6,
    },
    {
      id: "edge-2",
      position: [-25, 4, 0],
      type: "edge",
      status: "active",
      dataFlow: 72,
      connections: 7,
    },
    {
      id: "edge-3",
      position: [0, 4, 25],
      type: "edge",
      status: "active",
      dataFlow: 58,
      connections: 5,
    },
    {
      id: "edge-4",
      position: [0, 4, -25],
      type: "edge",
      status: "critical",
      dataFlow: 43,
      connections: 3,
    },
  ],

  // 数据流管道配置
  dataPipes: [
    { from: [0, 15, 0], to: [15, 8, 15], bandwidth: 95, type: "primary" },
    { from: [0, 15, 0], to: [-15, 8, 15], bandwidth: 87, type: "primary" },
    { from: [0, 15, 0], to: [15, 8, -15], bandwidth: 76, type: "primary" },
    { from: [0, 15, 0], to: [-15, 8, -15], bandwidth: 92, type: "primary" },
    { from: [15, 8, 15], to: [25, 4, 0], bandwidth: 65, type: "secondary" },
    { from: [-15, 8, 15], to: [-25, 4, 0], bandwidth: 72, type: "secondary" },
    { from: [15, 8, -15], to: [0, 4, -25], bandwidth: 43, type: "secondary" },
    { from: [-15, 8, -15], to: [0, 4, 25], bandwidth: 58, type: "secondary" },
  ],

  // 防护屏障配置
  shields: [
    { position: [0, 0, 0], radius: 35, height: 2, opacity: 0.3 },
    { position: [0, 8, 0], radius: 28, height: 1.5, opacity: 0.2 },
    { position: [0, 16, 0], radius: 20, height: 1, opacity: 0.15 },
  ],

  // 粒子系统配置
  particles: {
    count: 2000,
    spread: 50,
    speed: 0.02,
    color: DISPLAY_COLORS.material.effect.particle,
  },
};

/**
 * 中央监控塔组件
 * Central Monitoring Tower Component
 */
export function CentralMonitoringTower() {
  const towerRef = useRef<Group>(null);
  const floorsRef = useRef<Group[]>([]);

  useFrame((state) => {
    if (towerRef.current) {
      // 塔楼缓慢旋转
      towerRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }

    // 每层楼独立的脉冲效果
    floorsRef.current.forEach((floor, index) => {
      if (floor) {
        const time = state.clock.getElapsedTime();
        const phase = (index * Math.PI) / 4;
        floor.scale.x = floor.scale.z = 1 + Math.sin(time * 2 + phase) * 0.05;
      }
    });
  });

  const { centralTower } = CYBER_CENTER_CONFIG;

  return (
    <group ref={towerRef} position={centralTower.position}>
      {/* 塔楼主体 */}
      {Array.from({ length: centralTower.floors }, (_, i) => {
        const floorY = (i * centralTower.height) / centralTower.floors;
        const floorRadius = centralTower.radius * (1 - i * 0.08);

        return (
          <group
            key={i}
            ref={(el) => (floorsRef.current[i] = el!)}
            position={[0, floorY, 0]}
          >
            {/* 楼层主体 */}
            <mesh>
              <cylinderGeometry
                args={[
                  floorRadius,
                  floorRadius + 0.2,
                  centralTower.height / centralTower.floors,
                  16,
                ]}
              />
              <meshStandardMaterial
                color={centralTower.color}
                emissive={new Color(centralTower.color)}
                emissiveIntensity={0.2}
                transparent
                opacity={0.8}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>

            {/* 楼层光环 */}
            <mesh
              position={[0, centralTower.height / centralTower.floors / 2, 0]}
            >
              <torusGeometry args={[floorRadius + 0.5, 0.1, 8, 32]} />
              <meshStandardMaterial
                color={DISPLAY_COLORS.material.effect.beam}
                emissive={new Color(DISPLAY_COLORS.material.effect.beam)}
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* 楼层光源 */}
            <pointLight
              position={[0, 0, 0]}
              color={centralTower.color}
              intensity={0.5}
              distance={floorRadius * 3}
            />
          </group>
        );
      })}

      {/* 塔顶全息投影 */}
      <group position={[0, centralTower.height + 5, 0]}>
        <mesh>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial
            color={DISPLAY_COLORS.material.effect.scan}
            emissive={new Color(DISPLAY_COLORS.material.effect.scan)}
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
            side={DoubleSide}
          />
        </mesh>

        {/* 全息数据环 */}
        <HolographicDataRings />
      </group>

      {/* 塔楼信息标签 */}
      <Html position={[0, centralTower.height + 8, 0]} center>
        <div
          className="pointer-events-none px-4 py-2 rounded-lg shadow-lg border text-center"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: centralTower.color,
            color: DISPLAY_COLORS.ui.text.primary,
          }}
        >
          <div className="text-lg font-bold">中央监控塔</div>
          <div className="text-sm opacity-80">Central Control Tower</div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 全息数据环组件
 */
function HolographicDataRings() {
  const ringsRef = useRef<Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      ringsRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ringsRef}>
      {[3, 4, 5].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, index * (Math.PI / 3)]}>
          <torusGeometry args={[radius, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={DISPLAY_COLORS.material.effect.particle}
            emissive={new Color(DISPLAY_COLORS.material.effect.particle)}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 数据节点群组件
 * Data Node Cluster Component
 */
export function DataNodeCluster() {
  const nodesRef = useRef<Group>(null);

  useFrame((state) => {
    if (nodesRef.current) {
      // 节点群的整体浮动
      nodesRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  return (
    <group ref={nodesRef}>
      {CYBER_CENTER_CONFIG.dataNodes.map((node, index) => (
        <DataNode key={node.id} node={node} index={index} />
      ))}
    </group>
  );
}

/**
 * 单个数据节点组件
 */
function DataNode({ node, index }: { node: any; index: number }) {
  const nodeRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const statusColor = useMemo(() => {
    switch (node.status) {
      case "active":
        return DISPLAY_COLORS.status.active;
      case "warning":
        return DISPLAY_COLORS.status.warning;
      case "critical":
        return DISPLAY_COLORS.status.critical;
      default:
        return DISPLAY_COLORS.status.offline;
    }
  }, [node.status]);

  const nodeSize = node.type === "core" ? 2 : 1.5;

  useFrame((state) => {
    if (nodeRef.current) {
      // 个体浮动效果
      const time = state.clock.getElapsedTime();
      nodeRef.current.position.y =
        node.position[1] + Math.sin(time * 2 + index) * 0.3;

      // 核心旋转
      if (coreRef.current) {
        coreRef.current.rotation.y = time * 0.5;
        coreRef.current.rotation.x = time * 0.3;
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
      {/* 节点核心 */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[nodeSize, 0]} />
        <meshStandardMaterial
          color={
            hovered ? DISPLAY_COLORS.material.building.highlight : statusColor
          }
          emissive={new Color(statusColor)}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 节点光环 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[nodeSize + 1, 0.1, 8, 32]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={new Color(statusColor)}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 数据流指示器 */}
      <DataFlowIndicators
        count={node.connections}
        radius={nodeSize + 2}
        color={statusColor}
      />

      {/* 节点光源 */}
      <pointLight
        position={[0, 0, 0]}
        color={statusColor}
        intensity={1}
        distance={nodeSize * 8}
      />

      {/* 节点信息 */}
      {hovered && (
        <Html position={[0, nodeSize + 3, 0]} center>
          <div
            className="pointer-events-none px-4 py-3 rounded-lg shadow-xl border text-center"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: statusColor,
              color: DISPLAY_COLORS.ui.text.primary,
            }}
          >
            <div className="text-base font-bold">{node.id.toUpperCase()}</div>
            <div className="text-sm opacity-80 mb-2">
              {node.type === "core" ? "核心节点" : "边缘节点"}
            </div>
            <div className="text-sm">
              <div>数据流: {node.dataFlow}%</div>
              <div>连接数: {node.connections}</div>
              <div>状态: {node.status}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 数据流指示器组件
 */
function DataFlowIndicators({
  count,
  radius,
  color,
}: {
  count: number;
  radius: number;
  color: string;
}) {
  const indicatorsRef = useRef<Group>(null);

  useFrame((state) => {
    if (indicatorsRef.current) {
      indicatorsRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group ref={indicatorsRef}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={new Color(color)}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 数据流管道系统
 * Data Flow Pipeline System
 */
export function DataFlowPipelines() {
  const pipelinesRef = useRef<Group>(null);

  useFrame((state) => {
    if (pipelinesRef.current) {
      // 管道系统的数据流动画
      const time = state.clock.getElapsedTime();
      pipelinesRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.children.forEach((pipe) => {
            if (
              pipe instanceof Mesh &&
              pipe.material instanceof MeshStandardMaterial
            ) {
              pipe.material.emissiveIntensity =
                0.3 + Math.sin(time * 3 + index) * 0.2;
            }
          });
        }
      });
    }
  });

  return (
    <group ref={pipelinesRef}>
      {CYBER_CENTER_CONFIG.dataPipes.map((pipe, index) => (
        <DataPipeline key={index} pipe={pipe} />
      ))}
    </group>
  );
}

/**
 * 单个数据管道组件
 */
function DataPipeline({ pipe }: { pipe: any }) {
  const pipeColor = useMemo(() => {
    if (pipe.bandwidth > 80) return DISPLAY_COLORS.status.active;
    if (pipe.bandwidth > 60) return DISPLAY_COLORS.corporate.accent;
    return DISPLAY_COLORS.network.access;
  }, [pipe.bandwidth]);

  // 创建管道路径
  const pipeGeometry = useMemo(() => {
    const start = new Vector3(...pipe.from);
    const end = new Vector3(...pipe.to);
    const distance = start.distanceTo(end);

    // 创建弯曲管道
    const mid1 = new Vector3()
      .lerpVectors(start, end, 0.3)
      .setY(start.y + distance * 0.1);
    const mid2 = new Vector3()
      .lerpVectors(start, end, 0.7)
      .setY(end.y + distance * 0.1);

    return { start, mid1, mid2, end };
  }, [pipe]);

  return (
    <group>
      {/* 主管道 */}
      <Line
        points={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={pipeColor}
        lineWidth={pipe.type === "primary" ? 8 : 5}
        transparent
        opacity={0.8}
      />

      {/* 管道光效 */}
      <Line
        points={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={pipeColor}
        lineWidth={pipe.type === "primary" ? 3 : 2}
        transparent
        opacity={0.9}
      />

      {/* 数据流粒子 */}
      <DataFlowParticles
        path={[
          pipeGeometry.start,
          pipeGeometry.mid1,
          pipeGeometry.mid2,
          pipeGeometry.end,
        ]}
        color={pipeColor}
        speed={pipe.bandwidth / 100}
      />
    </group>
  );
}

/**
 * 数据流粒子组件
 */
function DataFlowParticles({
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
    const positions = new Float32Array(30 * 3); // 10个粒子
    const colors = new Float32Array(30 * 3);

    for (let i = 0; i < 10; i++) {
      const progress = i / 9;
      const point = new Vector3();

      // 简化路径插值
      if (progress <= 0.33) {
        point.lerpVectors(path[0], path[1], progress * 3);
      } else if (progress <= 0.66) {
        point.lerpVectors(path[1], path[2], (progress - 0.33) * 3);
      } else {
        point.lerpVectors(path[2], path[3], (progress - 0.66) * 3);
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
      const time = state.clock.getElapsedTime() * speed;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < 10; i++) {
        const progress = (i / 9 + time) % 1;
        const point = new Vector3();

        // 简化路径插值
        if (progress <= 0.33) {
          point.lerpVectors(path[0], path[1], progress * 3);
        } else if (progress <= 0.66) {
          point.lerpVectors(path[1], path[2], (progress - 0.33) * 3);
        } else {
          point.lerpVectors(path[2], path[3], (progress - 0.66) * 3);
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
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 防护屏障系统
 * Protection Shield System
 */
export function ProtectionShields() {
  const shieldsRef = useRef<Group>(null);

  useFrame((state) => {
    if (shieldsRef.current) {
      shieldsRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

      // 屏障脉冲效果
      shieldsRef.current.children.forEach((shield, index) => {
        if (shield instanceof Mesh) {
          const time = state.clock.getElapsedTime();
          shield.scale.y = 1 + Math.sin(time * 2 + index * Math.PI) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={shieldsRef}>
      {CYBER_CENTER_CONFIG.shields.map((shield, index) => (
        <mesh key={index} position={shield.position}>
          <cylinderGeometry
            args={[shield.radius, shield.radius, shield.height, 32, 1, true]}
          />
          <meshStandardMaterial
            color={DISPLAY_COLORS.corporate.accent}
            emissive={new Color(DISPLAY_COLORS.corporate.accent)}
            emissiveIntensity={0.2}
            transparent
            opacity={shield.opacity}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 环境粒子系统
 * Environmental Particle System
 */
export function EnvironmentalParticles() {
  const particlesRef = useRef<Points>(null);

  const particleGeometry = useMemo(() => {
    const { particles } = CYBER_CENTER_CONFIG;
    const geometry = new BufferGeometry();
    const positions = new Float32Array(particles.count * 3);
    const colors = new Float32Array(particles.count * 3);
    const sizes = new Float32Array(particles.count);

    for (let i = 0; i < particles.count; i++) {
      // 随机分布粒子
      positions[i * 3] = (Math.random() - 0.5) * particles.spread * 2;
      positions[i * 3 + 1] = Math.random() * particles.spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * particles.spread * 2;

      // 粒子颜色
      const c = new Color(particles.color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // 粒子大小
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < CYBER_CENTER_CONFIG.particles.count; i++) {
        // 粒子上升运动
        positions[i * 3 + 1] += CYBER_CENTER_CONFIG.particles.speed;

        // 重置超出范围的粒子
        if (positions[i * 3 + 1] > CYBER_CENTER_CONFIG.particles.spread) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] =
            (Math.random() - 0.5) * CYBER_CENTER_CONFIG.particles.spread * 2;
          positions[i * 3 + 2] =
            (Math.random() - 0.5) * CYBER_CENTER_CONFIG.particles.spread * 2;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 未来感环境基础设施
 * Futuristic Environment Infrastructure
 */
export function FuturisticEnvironment() {
  return (
    <group>
      {/* 基础平台 */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[60, 60, 0.5, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.secondary}
          emissive={new Color(DISPLAY_COLORS.corporate.primary)}
          emissiveIntensity={0.1}
          transparent
          opacity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* 网格地面 */}
      <gridHelper
        args={[
          120,
          40,
          DISPLAY_COLORS.corporate.accent,
          DISPLAY_COLORS.ui.border.primary,
        ]}
        position={[0, -1.7, 0]}
      />

      {/* 环境光照 */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* 主光源 */}
      <directionalLight
        position={[30, 50, 30]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 氛围光源 */}
      <pointLight
        position={[0, 20, 0]}
        intensity={0.8}
        color={DISPLAY_COLORS.corporate.accent}
        distance={100}
      />

      {/* 边缘光效 */}
      <spotLight
        position={[40, 30, 40]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={0.6}
        color={DISPLAY_COLORS.status.active}
        distance={80}
      />

      <spotLight
        position={[-40, 30, -40]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={0.6}
        color={DISPLAY_COLORS.network.access}
        distance={80}
      />
    </group>
  );
}
