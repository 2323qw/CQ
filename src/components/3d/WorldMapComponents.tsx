import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line, Html } from "@react-three/drei";
import {
  Group,
  Vector3,
  Mesh,
  Shape,
  ExtrudeGeometry,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  Color,
  PointLight,
  Curve,
  CatmullRomCurve3,
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
  getNodeTypeColor,
} from "@/lib/situationDisplayColors";

/**
 * 世界地图基础轮廓数据
 * World Map Base Outline Data
 */
const WORLD_MAP_DATA = {
  // 主要大洲轮廓（简化版）
  continents: [
    {
      name: "北美洲",
      nameEn: "North America",
      center: [-30, 0, 20],
      color: DISPLAY_COLORS.facility.headquarters,
      outline: [
        [-45, 0, 35],
        [-40, 0, 30],
        [-35, 0, 25],
        [-30, 0, 20],
        [-25, 0, 15],
        [-20, 0, 20],
        [-25, 0, 25],
        [-30, 0, 30],
        [-35, 0, 35],
        [-40, 0, 40],
        [-45, 0, 35],
      ],
    },
    {
      name: "南美洲",
      nameEn: "South America",
      center: [-20, 0, -10],
      color: DISPLAY_COLORS.facility.office,
      outline: [
        [-25, 0, 5],
        [-20, 0, 0],
        [-15, 0, -5],
        [-10, 0, -10],
        [-15, 0, -15],
        [-20, 0, -20],
        [-25, 0, -15],
        [-30, 0, -10],
        [-25, 0, -5],
        [-25, 0, 5],
      ],
    },
    {
      name: "欧洲",
      nameEn: "Europe",
      center: [10, 0, 25],
      color: DISPLAY_COLORS.facility.datacenter,
      outline: [
        [5, 0, 30],
        [10, 0, 35],
        [15, 0, 30],
        [20, 0, 25],
        [15, 0, 20],
        [10, 0, 25],
        [5, 0, 20],
        [0, 0, 25],
        [5, 0, 30],
      ],
    },
    {
      name: "亚洲",
      nameEn: "Asia",
      center: [40, 0, 15],
      color: DISPLAY_COLORS.facility.research,
      outline: [
        [20, 0, 35],
        [30, 0, 40],
        [45, 0, 35],
        [60, 0, 30],
        [65, 0, 20],
        [60, 0, 10],
        [50, 0, 5],
        [40, 0, 0],
        [30, 0, 5],
        [20, 0, 10],
        [15, 0, 20],
        [20, 0, 30],
        [20, 0, 35],
      ],
    },
    {
      name: "非洲",
      nameEn: "Africa",
      center: [15, 0, -5],
      color: DISPLAY_COLORS.network.access,
      outline: [
        [10, 0, 15],
        [20, 0, 20],
        [25, 0, 10],
        [30, 0, 0],
        [25, 0, -10],
        [20, 0, -20],
        [15, 0, -25],
        [10, 0, -20],
        [5, 0, -10],
        [0, 0, 0],
        [5, 0, 10],
        [10, 0, 15],
      ],
    },
    {
      name: "大洋洲",
      nameEn: "Oceania",
      center: [55, 0, -15],
      color: DISPLAY_COLORS.network.edge,
      outline: [
        [50, 0, -10],
        [55, 0, -5],
        [60, 0, -10],
        [65, 0, -15],
        [60, 0, -20],
        [55, 0, -25],
        [50, 0, -20],
        [45, 0, -15],
        [50, 0, -10],
      ],
    },
  ],

  // 全球主要数据中心��点
  dataCenters: [
    {
      name: "纽约",
      nameEn: "New York",
      position: [-35, 3, 25],
      region: "北美",
      load: 78,
    },
    {
      name: "洛杉矶",
      nameEn: "Los Angeles",
      position: [-45, 3, 15],
      region: "北美",
      load: 65,
    },
    {
      name: "伦敦",
      nameEn: "London",
      position: [5, 3, 30],
      region: "欧洲",
      load: 82,
    },
    {
      name: "法兰克福",
      nameEn: "Frankfurt",
      position: [15, 3, 28],
      region: "欧洲",
      load: 71,
    },
    {
      name: "东京",
      nameEn: "Tokyo",
      position: [55, 3, 20],
      region: "亚洲",
      load: 89,
    },
    {
      name: "新加坡",
      nameEn: "Singapore",
      position: [45, 3, 5],
      region: "亚洲",
      load: 73,
    },
    {
      name: "上海",
      nameEn: "Shanghai",
      position: [50, 3, 25],
      region: "亚洲",
      load: 85,
    },
    {
      name: "悉尼",
      nameEn: "Sydney",
      position: [60, 3, -20],
      region: "大洋洲",
      load: 58,
    },
    {
      name: "圣保罗",
      nameEn: "São Paulo",
      position: [-20, 3, -15],
      region: "南美",
      load: 63,
    },
    {
      name: "开普敦",
      nameEn: "Cape Town",
      position: [15, 3, -25],
      region: "非洲",
      load: 45,
    },
  ],

  // 全球网络连接线
  connections: [
    // 跨大西洋连接
    { from: [-35, 3, 25], to: [5, 3, 30], type: "submarine", bandwidth: 95 },
    { from: [-20, 3, -15], to: [15, 3, -25], type: "submarine", bandwidth: 72 },

    // 跨太平洋连接
    { from: [-45, 3, 15], to: [55, 3, 20], type: "submarine", bandwidth: 88 },
    { from: [-45, 3, 15], to: [60, 3, -20], type: "submarine", bandwidth: 76 },

    // 欧亚连接
    { from: [15, 3, 28], to: [50, 3, 25], type: "terrestrial", bandwidth: 92 },
    { from: [5, 3, 30], to: [55, 3, 20], type: "terrestrial", bandwidth: 84 },

    // 亚洲内部连接
    { from: [55, 3, 20], to: [45, 3, 5], type: "terrestrial", bandwidth: 91 },
    { from: [50, 3, 25], to: [45, 3, 5], type: "terrestrial", bandwidth: 87 },

    // 其他连接
    { from: [45, 3, 5], to: [60, 3, -20], type: "submarine", bandwidth: 69 },
    { from: [5, 3, 30], to: [15, 3, -25], type: "terrestrial", bandwidth: 54 },
  ],

  // 威胁源分布
  threatSources: [
    { position: [35, 2, 30], level: 8, type: "botnet" },
    { position: [-40, 2, 10], level: 6, type: "malware" },
    { position: [25, 2, -10], level: 7, type: "phishing" },
    { position: [48, 2, 15], level: 9, type: "apt" },
    { position: [-25, 2, 0], level: 5, type: "ddos" },
    { position: [12, 2, 20], level: 6, type: "ransomware" },
  ],
};

/**
 * 世界地图轮廓组件
 * World Map Outline Component
 */
export function WorldMapOutline() {
  const mapRef = useRef<Group>(null);

  useFrame((state) => {
    if (mapRef.current) {
      // 轻微的地球自转效果
      mapRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={mapRef}>
      {WORLD_MAP_DATA.continents.map((continent, index) => (
        <ContinentMesh key={index} continent={continent} />
      ))}
    </group>
  );
}

/**
 * 大洲网格组件
 */
function ContinentMesh({ continent }: { continent: any }) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const shape = useMemo(() => {
    const shape = new Shape();
    continent.outline.forEach((point: number[], index: number) => {
      if (index === 0) {
        shape.moveTo(point[0], point[2]);
      } else {
        shape.lineTo(point[0], point[2]);
      }
    });
    shape.closePath();
    return shape;
  }, [continent]);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 4,
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered ? 1.02 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={
            hovered
              ? DISPLAY_COLORS.material.building.highlight
              : continent.color
          }
          emissive={new Color(continent.color)}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 大洲标签 */}
      <Text
        position={[continent.center[0], 2, continent.center[2]]}
        fontSize={2}
        color={DISPLAY_COLORS.ui.text.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor={DISPLAY_COLORS.ui.background.primary}
        outlineWidth={0.2}
      >
        {continent.name}
      </Text>

      {/* 悬停信息 */}
      {hovered && (
        <Html position={[continent.center[0], 4, continent.center[2]]} center>
          <div
            className="pointer-events-none px-4 py-2 rounded-lg shadow-lg border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: DISPLAY_COLORS.ui.border.accent,
              color: DISPLAY_COLORS.ui.text.primary,
            }}
          >
            <div className="text-sm font-semibold">{continent.name}</div>
            <div className="text-xs opacity-80">{continent.nameEn}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 全球数据中心节点
 * Global Data Center Nodes
 */
export function GlobalDataCenters() {
  const centersRef = useRef<Group>(null);

  useFrame((state) => {
    if (centersRef.current) {
      const time = state.clock.getElapsedTime();
      centersRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y =
            WORLD_MAP_DATA.dataCenters[index].position[1] +
            Math.sin(time * 2 + index * 0.5) * 0.3;
        }
      });
    }
  });

  return (
    <group ref={centersRef}>
      {WORLD_MAP_DATA.dataCenters.map((datacenter, index) => (
        <DataCenterNode key={index} datacenter={datacenter} />
      ))}
    </group>
  );
}

/**
 * 数据中心节点组件
 */
function DataCenterNode({ datacenter }: { datacenter: any }) {
  const nodeRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const [active, setActive] = React.useState(false);

  const statusColor = useMemo(() => {
    return getStatusColor(datacenter.load > 85 ? "warning" : "online");
  }, [datacenter.load]);

  useFrame((state) => {
    if (nodeRef.current) {
      const scale = active ? 1.3 : 1;
      nodeRef.current.scale.setScalar(scale);

      // 根据负载调整发光强度
      if (lightRef.current) {
        lightRef.current.intensity =
          0.5 +
          (datacenter.load / 100) * 0.5 +
          Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
      }
    }
  });

  return (
    <group position={datacenter.position}>
      {/* 数据中心基座 */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 16]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.platform.base}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 主节点 */}
      <mesh
        ref={nodeRef}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        <cylinderGeometry args={[0.8, 1.2, 2, 8]} />
        <meshStandardMaterial
          color={
            active ? DISPLAY_COLORS.material.building.highlight : statusColor
          }
          emissive={new Color(statusColor)}
          emissiveIntensity={active ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 数据流效果 */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.effect.particle}
          emissive={new Color(DISPLAY_COLORS.material.effect.particle)}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 节点光源 */}
      <pointLight
        ref={lightRef}
        position={[0, 1, 0]}
        color={statusColor}
        intensity={0.8}
        distance={15}
      />

      {/* 节点信息 */}
      {active && (
        <Html position={[0, 4, 0]} center>
          <div
            className="pointer-events-none px-4 py-3 rounded-lg shadow-xl border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: statusColor,
              color: DISPLAY_COLORS.ui.text.primary,
            }}
          >
            <div className="text-lg font-bold">{datacenter.name}</div>
            <div className="text-sm opacity-80 mb-2">{datacenter.nameEn}</div>
            <div className="text-sm">
              <div>区域: {datacenter.region}</div>
              <div>
                负载:{" "}
                <span
                  style={{
                    color: getStatusColor(
                      datacenter.load > 85 ? "warning" : "online",
                    ),
                  }}
                >
                  {datacenter.load}%
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 全球网络连接线
 * Global Network Connections
 */
export function GlobalNetworkConnections() {
  const connectionsRef = useRef<Group>(null);

  useFrame((state) => {
    if (connectionsRef.current) {
      const time = state.clock.getElapsedTime();
      connectionsRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          // 数据流动画效果
          const opacity = 0.6 + Math.sin(time * 2 + index * 0.8) * 0.3;
          child.children.forEach((lineChild) => {
            if (
              lineChild instanceof Mesh &&
              lineChild.material instanceof MeshStandardMaterial
            ) {
              lineChild.material.opacity = opacity;
            }
          });
        }
      });
    }
  });

  return (
    <group ref={connectionsRef}>
      {WORLD_MAP_DATA.connections.map((connection, index) => (
        <NetworkConnection key={index} connection={connection} />
      ))}
    </group>
  );
}

/**
 * 网络连接线组件
 */
function NetworkConnection({ connection }: { connection: any }) {
  const lineColor = useMemo(() => {
    if (connection.bandwidth > 90) return DISPLAY_COLORS.status.active;
    if (connection.bandwidth > 70) return DISPLAY_COLORS.corporate.accent;
    return DISPLAY_COLORS.network.access;
  }, [connection.bandwidth]);

  // 创建弧形连接线
  const curve = useMemo(() => {
    const start = new Vector3(...connection.from);
    const end = new Vector3(...connection.to);
    const mid = new Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .setY(8 + Math.random() * 4); // 弧形高度

    return new CatmullRomCurve3([start, mid, end]);
  }, [connection]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  return (
    <group>
      <Line
        points={points}
        color={lineColor}
        lineWidth={connection.type === "submarine" ? 4 : 3}
        transparent
        opacity={0.7}
      />

      {/* 连接线中点信息 */}
      <Html position={points[25]} center>
        <div
          className="pointer-events-none px-2 py-1 rounded text-xs"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            color: DISPLAY_COLORS.ui.text.secondary,
            border: `1px solid ${lineColor}`,
          }}
        >
          {connection.bandwidth}%
        </div>
      </Html>
    </group>
  );
}

/**
 * 全球威胁可视化
 * Global Threat Visualization
 */
export function GlobalThreatVisualization() {
  const threatsRef = useRef<Group>(null);

  useFrame((state) => {
    if (threatsRef.current) {
      const time = state.clock.getElapsedTime();
      threatsRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          // 威胁脉冲效果
          const scale = 1 + Math.sin(time * 4 + index * 1.2) * 0.3;
          child.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={threatsRef}>
      {WORLD_MAP_DATA.threatSources.map((threat, index) => (
        <ThreatNode key={index} threat={threat} />
      ))}
    </group>
  );
}

/**
 * 威胁节点组件
 */
function ThreatNode({ threat }: { threat: any }) {
  const threatColor = getThreatColor(threat.level);

  const threatTypeNames = {
    botnet: "僵尸网络",
    malware: "恶意软件",
    phishing: "钓鱼攻击",
    apt: "高级持续威胁",
    ddos: "DDoS攻击",
    ransomware: "勒索软件",
  };

  return (
    <group position={threat.position}>
      {/* 威胁核心 */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={threatColor}
          emissive={new Color(threatColor)}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 威胁波纹 */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[1.5, 0.1, 8, 32]} />
        <meshStandardMaterial
          color={threatColor}
          emissive={new Color(threatColor)}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 威胁光源 */}
      <pointLight
        position={[0, 0, 0]}
        color={threatColor}
        intensity={1}
        distance={8}
      />

      {/* 威胁信息 */}
      <Html position={[0, 2, 0]} center>
        <div
          className="pointer-events-none px-3 py-2 rounded-lg shadow-lg border text-center"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: threatColor,
            color: DISPLAY_COLORS.ui.text.primary,
          }}
        >
          <div className="text-sm font-bold" style={{ color: threatColor }}>
            威胁等级 {threat.level}
          </div>
          <div className="text-xs opacity-80">
            {threatTypeNames[threat.type as keyof typeof threatTypeNames]}
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 世界地图环境基础设施
 * World Map Environment Infrastructure
 */
export function WorldMapEnvironment() {
  return (
    <group>
      {/* 地球基座 */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[80, 80, 1, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.platform.base}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 经纬网格 */}
      <gridHelper
        args={[
          160,
          32,
          DISPLAY_COLORS.material.platform.grid,
          DISPLAY_COLORS.ui.border.primary,
        ]}
        position={[0, -1.4, 0]}
      />

      {/* 环境光照 */}
      <ambientLight
        color={SCENE_CONFIG.lighting.ambient.color}
        intensity={0.3}
      />

      <directionalLight
        position={[50, 80, 50]}
        intensity={1.5}
        color={SCENE_CONFIG.lighting.directional.color}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* 全局光源 */}
      <pointLight
        position={[0, 30, 0]}
        intensity={0.8}
        color={DISPLAY_COLORS.corporate.accent}
        distance={200}
      />

      {/* 边缘补光 */}
      <pointLight
        position={[60, 20, 60]}
        intensity={0.4}
        color={DISPLAY_COLORS.status.active}
        distance={100}
      />
      <pointLight
        position={[-60, 20, -60]}
        intensity={0.4}
        color={DISPLAY_COLORS.network.access}
        distance={100}
      />
    </group>
  );
}
