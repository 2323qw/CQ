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
 * 优化后的世界地图基础轮廓数据 - 避免重叠，合理比例
 * Optimized World Map Base Outline Data - No Overlapping, Proper Proportions
 */
const OPTIMIZED_WORLD_MAP_DATA = {
  // 主要大洲轮廓（优化间距，避免重叠）
  continents: [
    {
      name: "北美洲",
      nameEn: "North America",
      center: [-45, 0, 25],
      color: DISPLAY_COLORS.facility.headquarters,
      outline: [
        [-55, 0, 35],
        [-50, 0, 32],
        [-45, 0, 28],
        [-40, 0, 25],
        [-35, 0, 22],
        [-30, 0, 18],
        [-35, 0, 15],
        [-40, 0, 18],
        [-45, 0, 22],
        [-50, 0, 28],
        [-55, 0, 32],
        [-55, 0, 35],
      ],
    },
    {
      name: "南美洲",
      nameEn: "South America",
      center: [-35, 0, -15],
      color: DISPLAY_COLORS.facility.office,
      outline: [
        [-42, 0, 5],
        [-38, 0, 0],
        [-34, 0, -5],
        [-30, 0, -10],
        [-28, 0, -15],
        [-30, 0, -20],
        [-34, 0, -25],
        [-38, 0, -20],
        [-42, 0, -15],
        [-45, 0, -10],
        [-44, 0, -5],
        [-42, 0, 5],
      ],
    },
    {
      name: "欧洲",
      nameEn: "Europe",
      center: [0, 0, 30],
      color: DISPLAY_COLORS.facility.datacenter,
      outline: [
        [-8, 0, 35],
        [-4, 0, 38],
        [0, 0, 40],
        [4, 0, 38],
        [8, 0, 35],
        [10, 0, 30],
        [8, 0, 25],
        [4, 0, 22],
        [0, 0, 20],
        [-4, 0, 22],
        [-8, 0, 25],
        [-10, 0, 30],
        [-8, 0, 35],
      ],
    },
    {
      name: "亚洲",
      nameEn: "Asia",
      center: [35, 0, 20],
      color: DISPLAY_COLORS.facility.research,
      outline: [
        [15, 0, 38],
        [20, 0, 42],
        [30, 0, 45],
        [40, 0, 42],
        [50, 0, 38],
        [55, 0, 30],
        [58, 0, 20],
        [55, 0, 10],
        [50, 0, 5],
        [40, 0, 2],
        [30, 0, 0],
        [20, 0, 2],
        [15, 0, 10],
        [12, 0, 20],
        [15, 0, 30],
        [15, 0, 38],
      ],
    },
    {
      name: "非洲",
      nameEn: "Africa",
      center: [8, 0, -8],
      color: DISPLAY_COLORS.network.access,
      outline: [
        [0, 0, 15],
        [4, 0, 18],
        [8, 0, 20],
        [12, 0, 18],
        [16, 0, 15],
        [18, 0, 8],
        [20, 0, 0],
        [18, 0, -8],
        [16, 0, -16],
        [12, 0, -24],
        [8, 0, -28],
        [4, 0, -24],
        [0, 0, -16],
        [-2, 0, -8],
        [-2, 0, 0],
        [0, 0, 8],
        [0, 0, 15],
      ],
    },
    {
      name: "大洋洲",
      nameEn: "Oceania",
      center: [45, 0, -25],
      color: DISPLAY_COLORS.network.edge,
      outline: [
        [38, 0, -18],
        [42, 0, -15],
        [48, 0, -12],
        [52, 0, -15],
        [55, 0, -18],
        [58, 0, -25],
        [55, 0, -32],
        [50, 0, -35],
        [45, 0, -38],
        [40, 0, -35],
        [35, 0, -32],
        [35, 0, -25],
        [38, 0, -18],
      ],
    },
  ],

  // 优化的全球主要数据中心节点 - 错开分布，避免重叠
  dataCenters: [
    {
      name: "纽约",
      nameEn: "New York",
      position: [-42, 4, 28],
      region: "北美",
      load: 78,
      size: 1.5,
    },
    {
      name: "洛杉矶",
      nameEn: "Los Angeles",
      position: [-52, 4, 18],
      region: "北美",
      load: 65,
      size: 1.3,
    },
    {
      name: "伦敦",
      nameEn: "London",
      position: [-5, 4, 32],
      region: "欧洲",
      load: 82,
      size: 1.4,
    },
    {
      name: "法兰克福",
      nameEn: "Frankfurt",
      position: [5, 4, 30],
      region: "欧洲",
      load: 71,
      size: 1.2,
    },
    {
      name: "东京",
      nameEn: "Tokyo",
      position: [52, 4, 25],
      region: "亚洲",
      load: 89,
      size: 1.6,
    },
    {
      name: "新加坡",
      nameEn: "Singapore",
      position: [42, 4, 8],
      region: "亚洲",
      load: 73,
      size: 1.3,
    },
    {
      name: "上海",
      nameEn: "Shanghai",
      position: [46, 4, 30],
      region: "亚洲",
      load: 85,
      size: 1.5,
    },
    {
      name: "悉尼",
      nameEn: "Sydney",
      position: [50, 4, -28],
      region: "大洋洲",
      load: 58,
      size: 1.1,
    },
    {
      name: "圣保罗",
      nameEn: "São Paulo",
      position: [-35, 4, -20],
      region: "南美",
      load: 63,
      size: 1.2,
    },
    {
      name: "开普敦",
      nameEn: "Cape Town",
      position: [12, 4, -30],
      region: "非洲",
      load: 45,
      size: 1.0,
    },
  ],

  // 优化的全球网络连接线 - 避免交叉重叠
  connections: [
    // 跨大西洋连接
    {
      from: [-42, 4, 28],
      to: [-5, 4, 32],
      type: "submarine",
      bandwidth: 95,
      id: "na-eu-1",
    },
    {
      from: [-35, 4, -20],
      to: [12, 4, -30],
      type: "submarine",
      bandwidth: 72,
      id: "sa-af-1",
    },

    // 跨太平洋连接
    {
      from: [-52, 4, 18],
      to: [52, 4, 25],
      type: "submarine",
      bandwidth: 88,
      id: "na-as-1",
    },
    {
      from: [-52, 4, 18],
      to: [50, 4, -28],
      type: "submarine",
      bandwidth: 76,
      id: "na-oc-1",
    },

    // 欧亚连接
    {
      from: [5, 4, 30],
      to: [46, 4, 30],
      type: "terrestrial",
      bandwidth: 92,
      id: "eu-as-1",
    },
    {
      from: [-5, 4, 32],
      to: [52, 4, 25],
      type: "terrestrial",
      bandwidth: 84,
      id: "eu-as-2",
    },

    // 亚洲内部连接
    {
      from: [52, 4, 25],
      to: [42, 4, 8],
      type: "terrestrial",
      bandwidth: 91,
      id: "as-sea-1",
    },
    {
      from: [46, 4, 30],
      to: [42, 4, 8],
      type: "terrestrial",
      bandwidth: 87,
      id: "as-sea-2",
    },

    // 其他重要连接
    {
      from: [42, 4, 8],
      to: [50, 4, -28],
      type: "submarine",
      bandwidth: 69,
      id: "sea-oc-1",
    },
    {
      from: [-5, 4, 32],
      to: [12, 4, -30],
      type: "terrestrial",
      bandwidth: 54,
      id: "eu-af-1",
    },
  ],

  // 优化的威胁源分布 - 错开位置，避免与数据中心重叠
  threatSources: [
    { position: [25, 2.5, 35], level: 8, type: "botnet", id: "threat-1" },
    { position: [-48, 2.5, 12], level: 6, type: "malware", id: "threat-2" },
    { position: [15, 2.5, -18], level: 7, type: "phishing", id: "threat-3" },
    { position: [38, 2.5, 18], level: 9, type: "apt", id: "threat-4" },
    { position: [-40, 2.5, -8], level: 5, type: "ddos", id: "threat-5" },
    { position: [-2, 2.5, 25], level: 6, type: "ransomware", id: "threat-6" },
  ],
};

/**
 * 世界地图轮廓组件 - 优化比例
 * World Map Outline Component - Optimized Proportions
 */
export function WorldMapOutline() {
  const mapRef = useRef<Group>(null);

  useFrame((state) => {
    if (mapRef.current) {
      // 轻微的地球自转效果 - 减慢速度避免眩晕
      mapRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={mapRef}>
      {OPTIMIZED_WORLD_MAP_DATA.continents.map((continent, index) => (
        <ContinentMesh key={index} continent={continent} />
      ))}
    </group>
  );
}

/**
 * 优化的大洲网格组件
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
      depth: 0.8, // 增加厚度使其更立体
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 6,
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
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* 大洲标签 - 调整高度避免重叠 */}
      <Text
        position={[continent.center[0], 3, continent.center[2]]}
        fontSize={1.8} // 调整字体大小
        color={DISPLAY_COLORS.ui.text.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor={DISPLAY_COLORS.ui.background.primary}
        outlineWidth={0.15}
        maxWidth={20}
      >
        {continent.name}
      </Text>

      {/* 悬停信息 - 调整位置避免重叠 */}
      {hovered && (
        <Html position={[continent.center[0], 5, continent.center[2]]} center>
          <div
            className="pointer-events-none px-4 py-2 rounded-lg shadow-lg border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: DISPLAY_COLORS.ui.border.accent,
              color: DISPLAY_COLORS.ui.text.primary,
              fontSize: "14px",
              whiteSpace: "nowrap",
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
 * 优化的全球数据中心节点
 * Optimized Global Data Center Nodes
 */
export function GlobalDataCenters() {
  const centersRef = useRef<Group>(null);

  useFrame((state) => {
    if (centersRef.current) {
      const time = state.clock.getElapsedTime();
      centersRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          // 减小浮动幅度，避免与其他元素碰撞
          child.position.y =
            OPTIMIZED_WORLD_MAP_DATA.dataCenters[index].position[1] +
            Math.sin(time * 1.5 + index * 0.8) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={centersRef}>
      {OPTIMIZED_WORLD_MAP_DATA.dataCenters.map((datacenter, index) => (
        <DataCenterNode key={index} datacenter={datacenter} />
      ))}
    </group>
  );
}

/**
 * 优化的数据中心节点组件
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
      const scale = active ? 1.2 : 1; // 减小缩放避免重叠
      nodeRef.current.scale.setScalar(scale);

      // 根据负载调整发光强度
      if (lightRef.current) {
        lightRef.current.intensity =
          0.4 +
          (datacenter.load / 100) * 0.4 +
          Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
      }
    }
  });

  return (
    <group position={datacenter.position}>
      {/* 数据中心基座 - 调整大小 */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[datacenter.size, datacenter.size, 0.4, 16]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.platform.base}
          transparent
          opacity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* 主节点 - 根据重要性调整大小 */}
      <mesh
        ref={nodeRef}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        <cylinderGeometry
          args={[
            datacenter.size * 0.6,
            datacenter.size * 0.8,
            datacenter.size * 1.5,
            8,
          ]}
        />
        <meshStandardMaterial
          color={
            active ? DISPLAY_COLORS.material.building.highlight : statusColor
          }
          emissive={new Color(statusColor)}
          emissiveIntensity={active ? 0.4 : 0.2}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* 数据流效果 - 调整位置 */}
      <mesh position={[0, datacenter.size * 1.8, 0]}>
        <sphereGeometry args={[datacenter.size * 0.3, 16, 16]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.effect.particle}
          emissive={new Color(DISPLAY_COLORS.material.effect.particle)}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 节点光源 - 调整强度 */}
      <pointLight
        ref={lightRef}
        position={[0, 1, 0]}
        color={statusColor}
        intensity={0.6}
        distance={datacenter.size * 8}
      />

      {/* 节点信息 - 调整位置避免重叠 */}
      {active && (
        <Html
          position={[0, datacenter.size * 3 + 1, 0]}
          center
          distanceFactor={10}
        >
          <div
            className="pointer-events-none px-4 py-3 rounded-lg shadow-xl border"
            style={{
              backgroundColor: DISPLAY_COLORS.ui.background.overlay,
              borderColor: statusColor,
              color: DISPLAY_COLORS.ui.text.primary,
              fontSize: "13px",
              minWidth: "120px",
            }}
          >
            <div className="text-base font-bold">{datacenter.name}</div>
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
 * 优化的全球网络连接线
 * Optimized Global Network Connections
 */
export function GlobalNetworkConnections() {
  const connectionsRef = useRef<Group>(null);

  useFrame((state) => {
    if (connectionsRef.current) {
      const time = state.clock.getElapsedTime();
      connectionsRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          // 数据流动画效果 - 调整速度
          const opacity = 0.5 + Math.sin(time * 1.5 + index * 0.6) * 0.2;
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
      {OPTIMIZED_WORLD_MAP_DATA.connections.map((connection, index) => (
        <NetworkConnection key={connection.id} connection={connection} />
      ))}
    </group>
  );
}

/**
 * 优化的网络连接线组件
 */
function NetworkConnection({ connection }: { connection: any }) {
  const lineColor = useMemo(() => {
    if (connection.bandwidth > 90) return DISPLAY_COLORS.status.active;
    if (connection.bandwidth > 70) return DISPLAY_COLORS.corporate.accent;
    return DISPLAY_COLORS.network.access;
  }, [connection.bandwidth]);

  // 创建弧形连接线 - 优化弧度避免重叠
  const curve = useMemo(() => {
    const start = new Vector3(...connection.from);
    const end = new Vector3(...connection.to);
    const distance = start.distanceTo(end);

    // 根据距离调整弧形高度
    const arcHeight = Math.max(6, distance * 0.15);

    const mid = new Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .setY(arcHeight);

    return new CatmullRomCurve3([start, mid, end]);
  }, [connection]);

  const points = useMemo(() => curve.getPoints(60), [curve]);

  return (
    <group>
      <Line
        points={points}
        color={lineColor}
        lineWidth={connection.type === "submarine" ? 3 : 2}
        transparent
        opacity={0.6}
      />

      {/* 连接线中点信息 - 调整位置 */}
      <Html position={points[30]} center distanceFactor={15}>
        <div
          className="pointer-events-none px-2 py-1 rounded text-xs"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            color: DISPLAY_COLORS.ui.text.secondary,
            border: `1px solid ${lineColor}`,
            fontSize: "11px",
          }}
        >
          {connection.bandwidth}%
        </div>
      </Html>
    </group>
  );
}

/**
 * 优化的全球威胁可视化
 * Optimized Global Threat Visualization
 */
export function GlobalThreatVisualization() {
  const threatsRef = useRef<Group>(null);

  useFrame((state) => {
    if (threatsRef.current) {
      const time = state.clock.getElapsedTime();
      threatsRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          // 威胁���冲效果 - 减小幅度避免重叠
          const scale = 1 + Math.sin(time * 3 + index * 1.5) * 0.2;
          child.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={threatsRef}>
      {OPTIMIZED_WORLD_MAP_DATA.threatSources.map((threat) => (
        <ThreatNode key={threat.id} threat={threat} />
      ))}
    </group>
  );
}

/**
 * 优化的威胁节点组件
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

  const threatSize = 0.4 + (threat.level / 10) * 0.3; // 根据威胁等级调整大小

  return (
    <group position={threat.position}>
      {/* 威胁核心 - 调整大小 */}
      <mesh>
        <sphereGeometry args={[threatSize, 16, 16]} />
        <meshStandardMaterial
          color={threatColor}
          emissive={new Color(threatColor)}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* 威胁波纹 - 调整大小和位置 */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[threatSize * 3, threatSize * 0.2, 8, 32]} />
        <meshStandardMaterial
          color={threatColor}
          emissive={new Color(threatColor)}
          emissiveIntensity={0.4}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 威胁光源 - 调整强度 */}
      <pointLight
        position={[0, 0, 0]}
        color={threatColor}
        intensity={0.8}
        distance={threatSize * 15}
      />

      {/* 威胁信息 - 调整位置 */}
      <Html position={[0, threatSize * 4 + 1, 0]} center distanceFactor={12}>
        <div
          className="pointer-events-none px-3 py-2 rounded-lg shadow-lg border text-center"
          style={{
            backgroundColor: DISPLAY_COLORS.ui.background.overlay,
            borderColor: threatColor,
            color: DISPLAY_COLORS.ui.text.primary,
            fontSize: "12px",
            minWidth: "100px",
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
 * 优化的世界地图环境基础设施
 * Optimized World Map Environment Infrastructure
 */
export function WorldMapEnvironment() {
  return (
    <group>
      {/* 地��基座 - 调整大小和位置 */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[90, 90, 1.5, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.material.platform.base}
          transparent
          opacity={0.25}
          roughness={0.8}
        />
      </mesh>

      {/* 经纬网格 - 调整密度 */}
      <gridHelper
        args={[
          180,
          36,
          DISPLAY_COLORS.material.platform.grid,
          DISPLAY_COLORS.ui.border.primary,
        ]}
        position={[0, -1.8, 0]}
      />

      {/* 环境光照 - 优化光照强度 */}
      <ambientLight
        color={SCENE_CONFIG.lighting.ambient.color}
        intensity={0.35}
      />

      <directionalLight
        position={[60, 100, 60]}
        intensity={1.2}
        color={SCENE_CONFIG.lighting.directional.color}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={300}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />

      {/* 全局光源 - 调整位置和强度 */}
      <pointLight
        position={[0, 40, 0]}
        intensity={0.6}
        color={DISPLAY_COLORS.corporate.accent}
        distance={250}
      />

      {/* 边缘补光 - 优化位置避免过亮 */}
      <pointLight
        position={[80, 25, 80]}
        intensity={0.3}
        color={DISPLAY_COLORS.status.active}
        distance={120}
      />
      <pointLight
        position={[-80, 25, -80]}
        intensity={0.3}
        color={DISPLAY_COLORS.network.access}
        distance={120}
      />
    </group>
  );
}
