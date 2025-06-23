import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
// Line component removed to prevent uniform errors
import {
  Group,
  Vector3,
  Mesh,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  MeshLambertMaterial,
  Color,
  PointLight,
  SpotLight,
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
  getNodeTypeColor,
  getPerformanceColor,
} from "@/lib/situationDisplayColors";

/**
 * 统一配色的企业建筑群
 * Unified Color Enterprise Buildings
 */
export function UnifiedEnterpriseBuildings() {
  const buildingsRef = useRef<Group>(null);

  const buildingDistricts = useMemo(() => {
    const districts = [
      {
        name: "总部大楼",
        position: [0, 0, 0],
        color: DISPLAY_COLORS.facility.headquarters,
        buildings: 4,
      },
      {
        name: "办公区域",
        position: [40, 0, 0],
        color: DISPLAY_COLORS.facility.office,
        buildings: 6,
      },
      {
        name: "数据中心",
        position: [-40, 0, 0],
        color: DISPLAY_COLORS.facility.datacenter,
        buildings: 3,
      },
      {
        name: "研发中心",
        position: [0, 0, 40],
        color: DISPLAY_COLORS.facility.research,
        buildings: 4,
      },
    ];

    return districts.flatMap((district, districtIndex) => {
      const buildings = [];
      const radius = 15;
      const angleStep = (Math.PI * 2) / district.buildings;

      for (let i = 0; i < district.buildings; i++) {
        const angle = i * angleStep;
        const x = district.position[0] + Math.cos(angle) * radius;
        const z = district.position[2] + Math.sin(angle) * radius;
        const height = 8 + Math.random() * 16;

        buildings.push({
          position: [x, height / 2, z] as [number, number, number],
          height,
          width: 3 + Math.random() * 2,
          depth: 3 + Math.random() * 2,
          color: district.color,
          district: district.name,
          id: `${districtIndex}-${i}`,
          status: Math.random() > 0.9 ? "warning" : "online",
        });
      }

      return buildings;
    });
  }, []);

  useFrame((state) => {
    if (buildingsRef.current) {
      buildingsRef.current.rotation.y =
        Math.sin(
          state.clock.getElapsedTime() * SCENE_CONFIG.animation.rotationSpeed,
        ) * 0.02;
    }
  });

  return (
    <group ref={buildingsRef}>
      {buildingDistricts.map((building) => (
        <UnifiedBuildingMesh
          key={building.id}
          position={building.position}
          height={building.height}
          width={building.width}
          depth={building.depth}
          color={building.color}
          district={building.district}
          status={building.status}
        />
      ))}
    </group>
  );
}

/**
 * 统一配色的建筑物组件
 */
function UnifiedBuildingMesh({
  position,
  height,
  width,
  depth,
  color,
  district,
  status,
}: {
  position: [number, number, number];
  height: number;
  width: number;
  depth: number;
  color: string;
  district: string;
  status: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered ? 1.05 : 1;
      meshRef.current.scale.setScalar(scale);

      // 根据状态添加脉冲效果
      if (status === "warning" && lightRef.current) {
        lightRef.current.intensity =
          0.5 +
          Math.sin(
            state.clock.getElapsedTime() * SCENE_CONFIG.animation.pulseSpeed,
          ) *
            0.3;
      }
    }
  });

  const statusColor =
    status === "warning"
      ? DISPLAY_COLORS.status.warning
      : getStatusColor(
          status as keyof typeof import("@/lib/situationDisplayColors").STATUS_COLORS,
        );

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={hovered ? DISPLAY_COLORS.material.building.highlight : color}
          emissive={new Color(color)}
          emissiveIntensity={hovered ? 0.2 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 状态指示光源 */}
      {status === "warning" && (
        <pointLight
          ref={lightRef}
          position={[0, height / 2 + 2, 0]}
          color={statusColor}
          intensity={0.5}
          distance={10}
        />
      )}

      {/* 悬停信息 */}
      {hovered && (
        <Html position={[0, height / 2 + 3, 0]} center>
          <div
            className="pointer-events-none px-4 py-2 rounded-lg border shadow-lg"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: DISPLAY_COLORS.ui.border.accent,
              color: DISPLAY_COLORS.ui.text.primary,
            }}
          >
            <div className="text-sm font-semibold">{district}</div>
            <div className="text-xs opacity-80">
              高度: {height.toFixed(1)}m | 状态:{" "}
              {status === "online" ? "正常" : "警告"}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 统一配色的数据中心集群
 * Unified Color Data Center Clusters
 */
export function UnifiedDataCenterClusters() {
  const dataCentersRef = useRef<Group>(null);

  const dataCenters = useMemo(
    () => [
      {
        name: "主数据中心",
        position: [-40, 4, 0] as [number, number, number],
        color: DISPLAY_COLORS.facility.datacenter,
        servers: 8,
        load: 75,
      },
      {
        name: "备份数据中心",
        position: [40, 4, 0] as [number, number, number],
        color: DISPLAY_COLORS.facility.datacenter,
        servers: 6,
        load: 45,
      },
      {
        name: "云数据中心",
        position: [0, 4, 40] as [number, number, number],
        color: DISPLAY_COLORS.facility.datacenter,
        servers: 4,
        load: 60,
      },
    ],
    [],
  );

  useFrame((state) => {
    if (dataCentersRef.current) {
      const time = state.clock.getElapsedTime();
      dataCentersRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y =
            4 +
            Math.sin(time * SCENE_CONFIG.animation.floatSpeed + index * 2) *
              SCENE_CONFIG.animation.floatAmplitude;
        }
      });
    }
  });

  return (
    <group ref={dataCentersRef}>
      {dataCenters.map((datacenter, index) => (
        <UnifiedDataCenterCluster
          key={index}
          position={datacenter.position}
          color={datacenter.color}
          name={datacenter.name}
          serverCount={datacenter.servers}
          load={datacenter.load}
        />
      ))}
    </group>
  );
}

/**
 * 统一配色的数据中心集群组件
 */
function UnifiedDataCenterCluster({
  position,
  color,
  name,
  serverCount,
  load,
}: {
  position: [number, number, number];
  color: string;
  name: string;
  serverCount: number;
  load: number;
}) {
  const servers = useMemo(() => {
    const serverArray = [];
    const rows = Math.ceil(Math.sqrt(serverCount));
    const cols = Math.ceil(serverCount / rows);

    for (let i = 0; i < serverCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = (col - cols / 2) * 3;
      const z = (row - rows / 2) * 2;
      const serverLoad = load + (Math.random() - 0.5) * 20;

      serverArray.push({
        position: [x, 0, z] as [number, number, number],
        load: Math.max(0, Math.min(100, serverLoad)),
        status:
          serverLoad > 90 ? "critical" : serverLoad > 75 ? "warning" : "normal",
      });
    }

    return serverArray;
  }, [serverCount, load]);

  return (
    <group position={position}>
      {servers.map((server, index) => (
        <mesh key={index} position={server.position}>
          <boxGeometry args={[2, 4, 1]} />
          <meshStandardMaterial
            color={getPerformanceColor(server.load)}
            emissive={new Color(getPerformanceColor(server.load))}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* 数据中心标签 */}
      <Text
        position={[0, 8, 0]}
        fontSize={1.2}
        color={DISPLAY_COLORS.ui.text.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor={DISPLAY_COLORS.ui.background.primary}
        outlineWidth={0.1}
      >
        {name}
      </Text>

      {/* 负载信息 */}
      <Html position={[0, 6, 0]} center>
        <div
          className="pointer-events-none px-3 py-1 rounded text-xs font-semibold"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            color: DISPLAY_COLORS.ui.text.secondary,
            border: `1px solid ${DISPLAY_COLORS.ui.border.primary}`,
          }}
        >
          负载: {load}%
        </div>
      </Html>
    </group>
  );
}

/**
 * 统一配色的网络拓扑
 * Unified Color Network Topology
 */
export function UnifiedNetworkTopology() {
  const networkRef = useRef<Group>(null);

  const networkNodes = useMemo(
    () => ({
      core: {
        position: [0, 12, 0] as [number, number, number],
        color: DISPLAY_COLORS.network.core,
        size: 2,
        type: "core" as const,
        label: "核心交换机",
      },
      distribution: [
        {
          position: [20, 8, 0] as [number, number, number],
          size: 1.5,
          label: "分布层 1",
        },
        {
          position: [-20, 8, 0] as [number, number, number],
          size: 1.5,
          label: "分布层 2",
        },
        {
          position: [0, 8, 20] as [number, number, number],
          size: 1.5,
          label: "分布层 3",
        },
        {
          position: [0, 8, -20] as [number, number, number],
          size: 1.5,
          label: "分布层 4",
        },
      ].map((node) => ({
        ...node,
        color: DISPLAY_COLORS.network.distribution,
        type: "distribution" as const,
      })),
      access: [
        {
          position: [30, 4, 15] as [number, number, number],
          label: "接入层 1",
        },
        {
          position: [30, 4, -15] as [number, number, number],
          label: "接入层 2",
        },
        {
          position: [-30, 4, 15] as [number, number, number],
          label: "接入层 3",
        },
        {
          position: [-30, 4, -15] as [number, number, number],
          label: "接入层 4",
        },
        {
          position: [15, 4, 30] as [number, number, number],
          label: "接入层 5",
        },
        {
          position: [-15, 4, 30] as [number, number, number],
          label: "接入层 6",
        },
        {
          position: [15, 4, -30] as [number, number, number],
          label: "接入层 7",
        },
        {
          position: [-15, 4, -30] as [number, number, number],
          label: "接入层 8",
        },
      ].map((node) => ({
        ...node,
        color: DISPLAY_COLORS.network.access,
        size: 1,
        type: "access" as const,
      })),
    }),
    [],
  );

  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y =
        state.clock.getElapsedTime() *
        SCENE_CONFIG.animation.rotationSpeed *
        10;
    }
  });

  return (
    <group ref={networkRef}>
      {/* 核心节点 */}
      <UnifiedNetworkNode {...networkNodes.core} />

      {/* 分布层节点 */}
      {networkNodes.distribution.map((node, index) => (
        <React.Fragment key={`dist-${index}`}>
          <UnifiedNetworkNode {...node} />
          <UnifiedNetworkConnection
            start={networkNodes.core.position}
            end={node.position}
            color={DISPLAY_COLORS.network.connection}
            type="primary"
          />
        </React.Fragment>
      ))}

      {/* 接入层节点 */}
      {networkNodes.access.map((node, index) => {
        const nearestDist = networkNodes.distribution.reduce(
          (nearest, dist) => {
            const distToNode = Math.sqrt(
              Math.pow(node.position[0] - dist.position[0], 2) +
                Math.pow(node.position[2] - dist.position[2], 2),
            );
            const distToNearest = Math.sqrt(
              Math.pow(node.position[0] - nearest.position[0], 2) +
                Math.pow(node.position[2] - nearest.position[2], 2),
            );
            return distToNode < distToNearest ? dist : nearest;
          },
        );

        return (
          <React.Fragment key={`access-${index}`}>
            <UnifiedNetworkNode {...node} />
            <UnifiedNetworkConnection
              start={nearestDist.position}
              end={node.position}
              color={DISPLAY_COLORS.network.connection}
              type="secondary"
            />
          </React.Fragment>
        );
      })}
    </group>
  );
}

/**
 * 统一配色的网络节点
 */
function UnifiedNetworkNode({
  position,
  color,
  size,
  type,
  label,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  type: "core" | "distribution" | "access";
  label: string;
}) {
  const nodeRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const [active, setActive] = React.useState(false);

  useFrame((state) => {
    if (nodeRef.current) {
      const scale = active ? 1.2 : 1;
      nodeRef.current.scale.setScalar(scale);

      // 核心节点旋转和脉冲
      if (type === "core") {
        nodeRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        if (lightRef.current) {
          lightRef.current.intensity =
            0.8 +
            Math.sin(
              state.clock.getElapsedTime() * SCENE_CONFIG.animation.pulseSpeed,
            ) *
              0.2;
        }
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={nodeRef}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={active ? DISPLAY_COLORS.material.building.highlight : color}
          emissive={new Color(color)}
          emissiveIntensity={active ? 0.4 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 节点光源 */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        color={color}
        intensity={type === "core" ? 0.8 : 0.4}
        distance={size * 10}
      />

      {/* 节点信息 */}
      {active && (
        <Html position={[0, size + 2, 0]} center>
          <div
            className="pointer-events-none px-3 py-2 rounded-lg shadow-lg"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: DISPLAY_COLORS.ui.border.accent,
              border: `1px solid ${DISPLAY_COLORS.ui.border.accent}`,
              color: DISPLAY_COLORS.ui.text.primary,
            }}
          >
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs opacity-80">类型: {type}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 统一配色的网络连接
 */
function UnifiedNetworkConnection({
  start,
  end,
  color,
  type,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  type: "primary" | "secondary";
}) {
  const connectionRef = useRef<Group>(null);

  useFrame((state) => {
    if (connectionRef.current) {
      const opacity =
        type === "primary"
          ? 0.8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2
          : 0.5 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;

      connectionRef.current.children.forEach((child) => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial
        ) {
          child.material.opacity = opacity;
        }
      });
    }
  });

  return (
    <group ref={connectionRef}>
      <Line
        points={[new Vector3(...start), new Vector3(...end)]}
        color={color}
        lineWidth={type === "primary" ? 3 : 2}
        transparent
        opacity={type === "primary" ? 0.8 : 0.5}
      />
    </group>
  );
}

/**
 * 统一配色的安全雷达
 * Unified Color Security Radar
 */
export function UnifiedSecurityRadar() {
  const radarRef = useRef<Group>(null);
  const sweepRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y =
        state.clock.getElapsedTime() *
        SCENE_CONFIG.animation.rotationSpeed *
        60;
    }

    if (sweepRef.current) {
      sweepRef.current.rotation.y =
        state.clock.getElapsedTime() * SCENE_CONFIG.animation.scanSpeed;
    }
  });

  return (
    <group position={[0, 8, 0]}>
      {/* 雷达平台 */}
      <mesh>
        <cylinderGeometry args={[8, 8, 0.3, 32]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.platform.base}
          emissive={new Color(DISPLAY_COLORS.corporate.primary)}
          emissiveIntensity={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 雷达扫描线 */}
      <mesh ref={sweepRef} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 8, 0.1, 32, 1, false, 0, Math.PI / 3]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.effect.scan}
          emissive={new Color(DISPLAY_COLORS.material.effect.scan)}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 雷达中心光源 */}
      <pointLight
        position={[0, 2, 0]}
        color={DISPLAY_COLORS.material.effect.scan}
        intensity={1}
        distance={20}
      />

      {/* 安全状态信息 */}
      <Html position={[0, 4, 0]} center>
        <div
          className="pointer-events-none px-6 py-4 rounded-lg shadow-xl border-2"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: DISPLAY_COLORS.material.effect.scan,
            color: DISPLAY_COLORS.ui.text.primary,
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold mb-2">安全雷达</div>
            <div className="text-sm opacity-80 mb-3">360° 威胁检测</div>
            <div
              className="text-3xl font-bold"
              style={{ color: DISPLAY_COLORS.security.high }}
            >
              3
            </div>
            <div className="text-xs opacity-80">活跃威胁</div>
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 统一配色的环境基础设施
 * Unified Color Environment Infrastructure
 */
export function UnifiedEnvironmentInfrastructure() {
  return (
    <group>
      {/* 主平台 */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[70, 70, 0.5, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.platform.base}
          emissive={new Color(DISPLAY_COLORS.material.platform.base)}
          emissiveIntensity={0.05}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 网格系统 */}
      <gridHelper
        args={[
          140,
          70,
          DISPLAY_COLORS.material.platform.grid,
          DISPLAY_COLORS.ui.border.primary,
        ]}
        position={[0, -0.7, 0]}
      />

      {/* 环境光照 */}
      <ambientLight
        color={SCENE_CONFIG.lighting.ambient.color}
        intensity={SCENE_CONFIG.lighting.ambient.intensity}
      />

      <directionalLight
        position={SCENE_CONFIG.lighting.directional.position}
        intensity={SCENE_CONFIG.lighting.directional.intensity}
        color={SCENE_CONFIG.lighting.directional.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight
        position={SCENE_CONFIG.lighting.point.position}
        intensity={SCENE_CONFIG.lighting.point.intensity}
        color={SCENE_CONFIG.lighting.point.color}
        distance={150}
      />
    </group>
  );
}
