import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line, Html } from "@react-three/drei";
import {
  Group,
  Vector3,
  InstancedMesh,
  Object3D,
  Matrix4,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
} from "three";
import {
  BUSINESS_COLORS,
  MODEL_CONFIG,
  getStatusColor,
} from "@/lib/businessColors";

/**
 * 企业建筑群组件
 * Enterprise Buildings Component
 */
export function EnterpriseBuildings() {
  const buildingsRef = useRef<Group>(null);

  const buildingDistricts = useMemo(() => {
    return MODEL_CONFIG.districts.flatMap((district, districtIndex) => {
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
        });
      }

      return buildings;
    });
  }, []);

  useFrame((state) => {
    if (buildingsRef.current) {
      buildingsRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  return (
    <group ref={buildingsRef}>
      {buildingDistricts.map((building) => (
        <BuildingMesh
          key={building.id}
          position={building.position}
          height={building.height}
          width={building.width}
          depth={building.depth}
          color={building.color}
          district={building.district}
        />
      ))}
    </group>
  );
}

/**
 * 单个建筑物组件
 */
function BuildingMesh({
  position,
  height,
  width,
  depth,
  color,
  district,
}: {
  position: [number, number, number];
  height: number;
  width: number;
  depth: number;
  color: string;
  district: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.y = hovered ? 1.1 : 1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={hovered ? BUSINESS_COLORS.primaryLight : color}
        transparent
        opacity={0.9}
      />

      {hovered && (
        <Html position={[0, height / 2 + 2, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 text-center shadow-lg pointer-events-none">
            <div className="text-sm font-semibold text-gray-800">
              {district}
            </div>
            <div className="text-xs text-gray-600">
              高度: {height.toFixed(1)}m
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/**
 * 企业数据中心组件
 * Enterprise Data Centers Component
 */
export function EnterpriseDataCenters() {
  const dataCentersRef = useRef<Group>(null);

  useFrame((state) => {
    if (dataCentersRef.current) {
      const time = state.clock.getElapsedTime();
      dataCentersRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y = 4 + Math.sin(time + index * 2) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={dataCentersRef}>
      {MODEL_CONFIG.datacenters.map((datacenter, index) => (
        <DataCenterCluster
          key={index}
          position={datacenter.position}
          color={datacenter.color}
          name={datacenter.name}
          serverCount={datacenter.servers}
        />
      ))}
    </group>
  );
}

/**
 * 数据中心集群组件
 */
function DataCenterCluster({
  position,
  color,
  name,
  serverCount,
}: {
  position: [number, number, number];
  color: string;
  name: string;
  serverCount: number;
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

      serverArray.push({
        position: [x, 0, z] as [number, number, number],
        status: Math.random() > 0.1 ? "normal" : "warning",
      });
    }

    return serverArray;
  }, [serverCount]);

  return (
    <group position={position}>
      {servers.map((server, index) => (
        <mesh key={index} position={server.position}>
          <boxGeometry args={[2, 4, 1]} />
          <meshStandardMaterial color={getStatusColor(server.status)} />
        </mesh>
      ))}

      <Text
        position={[0, 8, 0]}
        fontSize={1.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {name}
      </Text>
    </group>
  );
}

/**
 * 企业网络拓扑组件
 * Enterprise Network Topology Component
 */
export function EnterpriseNetworkTopology() {
  const networkRef = useRef<Group>(null);

  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={networkRef}>
      {/* 核心节点 */}
      <NetworkNode
        position={MODEL_CONFIG.network.core.position}
        color={MODEL_CONFIG.network.core.color}
        size={MODEL_CONFIG.network.core.size}
        type="core"
        label="核心交换机"
      />

      {/* 分布层节点 */}
      {MODEL_CONFIG.network.distribution.map((node, index) => (
        <React.Fragment key={`dist-${index}`}>
          <NetworkNode
            position={node.position}
            color={node.color}
            size={node.size}
            type="distribution"
            label={`分布层 ${index + 1}`}
          />

          {/* 核心到分布层连接 */}
          <NetworkConnection
            start={MODEL_CONFIG.network.core.position}
            end={node.position}
            color={BUSINESS_COLORS.primary}
          />
        </React.Fragment>
      ))}

      {/* 接入层节点 */}
      {MODEL_CONFIG.network.access.map((node, index) => {
        // 找到最近的分布层节点
        const nearestDist = MODEL_CONFIG.network.distribution.reduce(
          (nearest, dist, distIndex) => {
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
            <NetworkNode
              position={node.position}
              color={node.color}
              size={node.size}
              type="access"
              label={`接入�� ${index + 1}`}
            />

            {/* 分布层到接入层连接 */}
            <NetworkConnection
              start={nearestDist.position}
              end={node.position}
              color={BUSINESS_COLORS.success}
            />
          </React.Fragment>
        );
      })}
    </group>
  );
}

/**
 * 网络节点组件
 */
function NetworkNode({
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
  const [active, setActive] = React.useState(false);

  useFrame((state) => {
    if (nodeRef.current) {
      const scale = active ? 1.2 : 1;
      nodeRef.current.scale.setScalar(scale);

      // 核心节点旋转
      if (type === "core") {
        nodeRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
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
          color={active ? BUSINESS_COLORS.primaryLight : color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {active && (
        <Html position={[0, size + 1, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 text-center shadow-lg pointer-events-none">
            <div className="text-sm font-semibold text-gray-800">{label}</div>
            <div className="text-xs text-gray-600">{type}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 网络连接组件
 */
function NetworkConnection({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const connectionRef = useRef<Group>(null);

  useFrame((state) => {
    if (connectionRef.current) {
      const opacity = 0.6 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
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
        lineWidth={2}
        transparent
        opacity={0.6}
      />
    </group>
  );
}

/**
 * 安全监控雷达组件
 * Security Monitoring Radar Component
 */
export function SecurityRadar() {
  const radarRef = useRef<Group>(null);

  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={radarRef} position={[0, 8, 0]}>
      {/* 雷达平台 */}
      <mesh>
        <cylinderGeometry args={[8, 8, 0.3, 32]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 雷达扫描线 */}
      <RadarSweep />

      {/* 信息显示 */}
      <Html position={[0, 3, 0]} transform>
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 text-center shadow-lg pointer-events-none">
          <div className="text-lg font-bold text-gray-800">安全雷达</div>
          <div className="text-sm text-gray-600 mt-1">360° 威胁检测</div>
          <div className="text-2xl font-bold text-red-600 mt-2">3</div>
          <div className="text-xs text-gray-600">活跃威胁</div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 雷达扫描线组件
 */
function RadarSweep() {
  const sweepRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.y = state.clock.getElapsedTime() * 2;
    }
  });

  return (
    <mesh ref={sweepRef} position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0, 8, 0.1, 32, 1, false, 0, Math.PI / 3]} />
      <meshStandardMaterial
        color={BUSINESS_COLORS.danger}
        transparent
        opacity={0.6}
        emissive={BUSINESS_COLORS.danger}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/**
 * 企业级环境基础设施
 * Enterprise Environment Infrastructure
 */
export function EnvironmentInfrastructure() {
  return (
    <group>
      {/* 基础平台 */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[70, 70, 0.5, 64]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.material.platform}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 网格系统 */}
      <gridHelper
        args={[
          140,
          70,
          BUSINESS_COLORS.material.grid,
          BUSINESS_COLORS.backgroundTertiary,
        ]}
        position={[0, -0.7, 0]}
      />

      {/* 环境光照 */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[30, 40, 30]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        position={[0, 20, 0]}
        intensity={0.8}
        color={BUSINESS_COLORS.primary}
        distance={100}
      />
    </group>
  );
}
