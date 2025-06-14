import {
  useState,
  useRef,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Text,
  Html,
  Line,
  Sphere,
  Plane,
  Cloud,
  Detailed,
  useHelper,
  Instances,
  Instance,
  useTexture,
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
  Layers,
  Radar,
  Microscope,
  Gauge,
  Fingerprint,
  Scan,
  Search,
  CloudLightning,
  Loader,
  ChevronLeft,
  ChevronRight,
  FileText,
  PieChart,
  Map,
  List,
  X,
  Minimize2,
} from "lucide-react";
import {
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
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
  BoxHelper,
  PointLight,
  SpotLight,
  DirectionalLight,
  InstancedMesh,
  Object3D,
  Matrix4,
  MeshStandardMaterial,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  Quaternion,
  Euler,
  LOD,
} from "three";
import { SituationMonitoringModel } from "@/components/3d/SituationMonitoringModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

// 企业级配色方案 - 与2D面板保持一致
const BUSINESS_COLORS = {
  primary: "#2563eb", // 蓝色 - 主要
  success: "#16a34a", // 绿色 - 成功/正常
  warning: "#d97706", // 橙色 - 警告
  danger: "#dc2626", // 红色 - 危险
  info: "#0891b2", // 青色 - 信息
  purple: "#9333ea", // 紫色 - 特殊
  indigo: "#4f46e5", // 靛色 - 网络
  slate: "#64748b", // 灰色 - 次要
  // 浅色版本用于3D场景
  primaryLight: "#3b82f6",
  successLight: "#22c55e",
  warningLight: "#f59e0b",
  dangerLight: "#ef4444",
  infoLight: "#06b6d4",
  purpleLight: "#a855f7",
  indigoLight: "#6366f1",
};

// 性能监控组件 - 企业级样式
function PerformanceMonitor() {
  const { gl, scene } = useThree();
  const [stats, setStats] = useState({
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
  });

  useFrame(() => {
    const info = gl.info;
    setStats({
      fps: Math.round(1000 / 16.67), // 近似FPS
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
    });
  });

  return (
    <Html position={[-90, 20, 0]} transform>
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
        <div className="text-gray-800 font-semibold mb-2">性能监控</div>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className="font-mono font-bold text-blue-600">
              {stats.fps}
            </span>
          </div>
          <div className="flex justify-between">
            <span>绘制调用:</span>
            <span className="font-mono font-bold text-green-600">
              {stats.drawCalls}
            </span>
          </div>
          <div className="flex justify-between">
            <span>三角形:</span>
            <span className="font-mono font-bold text-purple-600">
              {stats.triangles.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>几何体:</span>
            <span className="font-mono font-bold text-orange-600">
              {stats.geometries}
            </span>
          </div>
        </div>
      </div>
    </Html>
  );
}

// 企业级共享材质管理器 - 修复版本
const createBusinessMaterials = () => {
  const materials = {
    building: new MeshStandardMaterial({
      color: BUSINESS_COLORS.slate,
      metalness: 0.4,
      roughness: 0.6,
    }),
    buildingActive: new MeshStandardMaterial({
      color: BUSINESS_COLORS.primary,
      metalness: 0.3,
      roughness: 0.7,
    }),
    server: new MeshStandardMaterial({
      color: BUSINESS_COLORS.info,
      metalness: 0.8,
      roughness: 0.2,
    }),
    serverActive: new MeshStandardMaterial({
      color: BUSINESS_COLORS.success,
      metalness: 0.7,
      roughness: 0.3,
    }),
    vehicle: new MeshStandardMaterial({
      color: BUSINESS_COLORS.slate,
      metalness: 0.6,
      roughness: 0.4,
    }),
    platform: new MeshStandardMaterial({
      color: "#f8fafc",
      transparent: true,
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.9,
    }),
    light: new MeshStandardMaterial({
      color: BUSINESS_COLORS.primary,
      transparent: true,
      opacity: 0.8,
    }),
    network: new MeshStandardMaterial({
      color: BUSINESS_COLORS.indigo,
    }),
    threat: new MeshStandardMaterial({
      color: BUSINESS_COLORS.danger,
    }),
  };

  // 确保所有材质都正确初始化
  Object.values(materials).forEach((material) => {
    material.needsUpdate = true;
  });

  return materials;
};

const BusinessSharedMaterials = createBusinessMaterials();

// 共享几何体管理器 - 优化版本
const OptimizedGeometries = {
  box: new BoxGeometry(1, 1, 1),
  boxLOD1: new BoxGeometry(1, 1, 1, 2, 2, 2), // 低细节
  boxLOD2: new BoxGeometry(1, 1, 1, 4, 4, 4), // 中细节
  boxLOD3: new BoxGeometry(1, 1, 1, 8, 8, 8), // 高细节
  cylinder: new CylinderGeometry(1, 1, 1, 8),
  cylinderLOD: new CylinderGeometry(1, 1, 1, 16),
  sphere: new SphereGeometry(1, 8, 8),
  sphereLOD: new SphereGeometry(1, 16, 16),
  serverRack: new BoxGeometry(2, 8, 1),
  vehicleBody: new BoxGeometry(1, 0.6, 2),
};

// 企业级实例化建筑组件
function BusinessInstancedBuildings() {
  const buildingsRef = useRef<Group>(null);
  const lowDetailRef = useRef<InstancedMesh>(null);
  const mediumDetailRef = useRef<InstancedMesh>(null);
  const highDetailRef = useRef<InstancedMesh>(null);

  const buildingData = useMemo(() => {
    const buildings = [];

    // 企业园区布局
    const districts = [
      {
        center: [40, 0, 40],
        count: 6,
        heightRange: [20, 35],
        type: "headquarters",
        color: BUSINESS_COLORS.primary,
      },
      {
        center: [-40, 0, 40],
        count: 8,
        heightRange: [12, 20],
        type: "office",
        color: BUSINESS_COLORS.success,
      },
      {
        center: [40, 0, -40],
        count: 4,
        heightRange: [8, 15],
        type: "datacenter",
        color: BUSINESS_COLORS.info,
      },
      {
        center: [-40, 0, -40],
        count: 6,
        heightRange: [15, 25],
        type: "research",
        color: BUSINESS_COLORS.purple,
      },
    ];

    districts.forEach((district) => {
      for (let i = 0; i < district.count; i++) {
        const angle = (i / district.count) * Math.PI * 2;
        const radius = 6 + Math.random() * 8;
        const x = district.center[0] + Math.cos(angle) * radius;
        const z = district.center[2] + Math.sin(angle) * radius;
        const height =
          district.heightRange[0] +
          Math.random() * (district.heightRange[1] - district.heightRange[0]);

        buildings.push({
          position: [x, height / 2, z],
          scale: [2 + Math.random() * 2, height, 2 + Math.random() * 2],
          rotation: [0, Math.random() * Math.PI, 0],
          type: district.type,
          color: district.color,
        });
      }
    });

    return buildings;
  }, []);

  useEffect(() => {
    if (
      !lowDetailRef.current ||
      !mediumDetailRef.current ||
      !highDetailRef.current
    )
      return;

    const tempObject = new Object3D();

    buildingData.forEach((building, i) => {
      tempObject.position.set(...building.position);
      tempObject.scale.set(...building.scale);
      tempObject.rotation.set(...building.rotation);
      tempObject.updateMatrix();

      lowDetailRef.current!.setMatrixAt(i, tempObject.matrix);
      mediumDetailRef.current!.setMatrixAt(i, tempObject.matrix);
      highDetailRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    lowDetailRef.current.instanceMatrix.needsUpdate = true;
    mediumDetailRef.current.instanceMatrix.needsUpdate = true;
    highDetailRef.current.instanceMatrix.needsUpdate = true;
  }, [buildingData]);

  useFrame((state) => {
    if (buildingsRef.current) {
      const time = state.clock.getElapsedTime();
      // 极缓慢的脉冲效果
      buildingsRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.01);
    }
  });

  return (
    <group ref={buildingsRef}>
      <Detailed distances={[0, 40, 80]}>
        {/* 高细节 */}
        <instancedMesh
          ref={highDetailRef}
          args={[
            OptimizedGeometries.boxLOD3,
            BusinessSharedMaterials.buildingActive.clone(),
            buildingData.length,
          ]}
          frustumCulled
          castShadow
          receiveShadow
        />
        {/* 中细节 */}
        <instancedMesh
          ref={mediumDetailRef}
          args={[
            OptimizedGeometries.boxLOD2,
            BusinessSharedMaterials.building.clone(),
            buildingData.length,
          ]}
          frustumCulled
        />
        {/* 低细节 */}
        <instancedMesh
          ref={lowDetailRef}
          args={[
            OptimizedGeometries.boxLOD1,
            BusinessSharedMaterials.building.clone(),
            buildingData.length,
          ]}
          frustumCulled
        />
      </Detailed>

      {/* 建筑标识 */}
      {buildingData.slice(0, 4).map((building, index) => (
        <Text
          key={index}
          position={[
            building.position[0],
            building.position[1] + building.scale[1] / 2 + 2,
            building.position[2],
          ]}
          fontSize={0.8}
          color={building.color}
          anchorX="center"
          anchorY="middle"
        >
          {building.type.toUpperCase()}
        </Text>
      ))}
    </group>
  );
}

// 企业级数据中心
function BusinessDataCenters() {
  const racksRef = useRef<InstancedMesh>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  const rackData = useMemo(() => {
    const racks = [];
    const centers = [
      { pos: [-50, 0, 0], count: 6, name: "主数据中心" },
      { pos: [50, 0, 0], count: 4, name: "备份中心" },
      { pos: [0, 0, 50], count: 3, name: "边缘节点" },
    ];

    centers.forEach((center, centerIndex) => {
      for (let i = 0; i < center.count; i++) {
        const x = center.pos[0] + (i % 3) * 5 - 5;
        const z = center.pos[2] + Math.floor(i / 3) * 5 - 2.5;
        racks.push({
          position: [x, 4, z],
          scale: [1, 1, 1],
          status: Math.random() > 0.15 ? "active" : "warning",
          load: 30 + Math.random() * 50,
          centerIndex,
          centerName: center.name,
        });
      }
    });

    return racks;
  }, []);

  useEffect(() => {
    if (!racksRef.current) return;

    const tempObject = new Object3D();

    rackData.forEach((rack, i) => {
      tempObject.position.set(...rack.position);
      tempObject.scale.set(...rack.scale);
      tempObject.updateMatrix();
      racksRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    racksRef.current.instanceMatrix.needsUpdate = true;
  }, [rackData]);

  return (
    <group>
      <instancedMesh
        ref={racksRef}
        args={[
          OptimizedGeometries.serverRack,
          BusinessSharedMaterials.serverActive,
          rackData.length,
        ]}
        frustumCulled
        castShadow
      />

      {/* 数据中心标识 */}
      {[
        {
          pos: [-50, 0, 0],
          name: "主数据中心",
          color: BUSINESS_COLORS.primary,
        },
        { pos: [50, 0, 0], name: "备份中心", color: BUSINESS_COLORS.success },
        { pos: [0, 0, 50], name: "边缘节点", color: BUSINESS_COLORS.info },
      ].map((center, index) => (
        <group key={index} position={center.pos}>
          <Text
            position={[0, 12, 0]}
            fontSize={1.2}
            color={center.color}
            anchorX="center"
            anchorY="middle"
          >
            {center.name}
          </Text>

          <Html position={[0, -2, 0]} transform>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 text-center shadow-lg">
              <div className="text-xs text-gray-600">
                CPU: {realTimeData?.cpuUsage || 45}%
              </div>
              <div className="text-xs text-gray-600">
                负载: {Math.floor(Math.random() * 40 + 60)}%
              </div>
              <div
                className={`text-xs font-semibold ${
                  Math.random() > 0.8 ? "text-orange-600" : "text-green-600"
                }`}
              >
                {Math.random() > 0.8 ? "警告" : "正常"}
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// 企业级交通系统
function BusinessTrafficSystem() {
  const vehiclesRef = useRef<InstancedMesh>(null);
  const [vehiclePositions, setVehiclePositions] = useState(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [(Math.random() - 0.5) * 80, 0.3, (Math.random() - 0.5) * 80],
      direction: Math.random() * Math.PI * 2,
      speed: 0.08 + Math.random() * 0.06,
      type: i % 4 === 0 ? "security" : "business",
    }));
  });

  useFrame(() => {
    if (!vehiclesRef.current) return;

    const tempObject = new Object3D();

    setVehiclePositions((prev) =>
      prev.map((vehicle) => {
        const newPos = [...vehicle.position];
        newPos[0] += Math.cos(vehicle.direction) * vehicle.speed;
        newPos[2] += Math.sin(vehicle.direction) * vehicle.speed;

        if (Math.abs(newPos[0]) > 50 || Math.abs(newPos[2]) > 50) {
          return {
            ...vehicle,
            direction:
              vehicle.direction + Math.PI + (Math.random() - 0.5) * 0.3,
          };
        }

        return { ...vehicle, position: newPos };
      }),
    );

    vehiclePositions.forEach((vehicle, i) => {
      tempObject.position.set(...vehicle.position);
      tempObject.rotation.y = vehicle.direction;
      tempObject.scale.set(
        vehicle.type === "security" ? 1.2 : 1,
        1,
        vehicle.type === "security" ? 1.5 : 1,
      );
      tempObject.updateMatrix();
      vehiclesRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    vehiclesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={vehiclesRef}
      args={[
        OptimizedGeometries.vehicleBody,
        BusinessSharedMaterials.vehicle,
        vehiclePositions.length,
      ]}
      frustumCulled
    />
  );
}

// 企业级网络拓扑
function BusinessNetworkTopology() {
  const networkRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1500,
    enabled: true,
  });

  const networkNodes = useMemo(() => {
    const nodes = [];
    const layers = [
      {
        radius: 12,
        count: 2,
        height: 8,
        type: "core",
        color: BUSINESS_COLORS.primary,
        name: "核心层",
      },
      {
        radius: 20,
        count: 4,
        height: 4,
        type: "aggregation",
        color: BUSINESS_COLORS.success,
        name: "汇聚层",
      },
      {
        radius: 28,
        count: 6,
        height: 0,
        type: "access",
        color: BUSINESS_COLORS.info,
        name: "接入层",
      },
    ];

    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2;
        nodes.push({
          position: [
            Math.cos(angle) * layer.radius,
            layer.height,
            Math.sin(angle) * layer.radius,
          ],
          type: layer.type,
          color: layer.color,
          name: layer.name,
          status: Math.random() > 0.9 ? "warning" : "active",
          connections: Math.floor(Math.random() * 100 + 50),
        });
      }
    });

    return nodes;
  }, []);

  useFrame((state) => {
    if (networkRef.current) {
      const time = state.clock.getElapsedTime();
      networkRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <group ref={networkRef}>
      {networkNodes.map((node, index) => (
        <group key={index} position={node.position}>
          <mesh frustumCulled>
            <sphereGeometry
              args={[
                node.type === "core"
                  ? 1.2
                  : node.type === "aggregation"
                    ? 1
                    : 0.8,
                12,
                12,
              ]}
            />
            <meshStandardMaterial
              color={
                node.status === "warning" ? BUSINESS_COLORS.warning : node.color
              }
              emissive={
                node.status === "warning" ? BUSINESS_COLORS.warning : node.color
              }
              emissiveIntensity={0.2}
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* 节点信息 */}
          <Html position={[0, 2, 0]} transform>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded p-2 text-center shadow-lg min-w-24">
              <div
                className="text-xs font-semibold"
                style={{ color: node.color }}
              >
                {node.name}
              </div>
              <div className="text-xs text-gray-600">
                {node.connections} 连接
              </div>
              <div
                className={`text-xs font-medium ${
                  node.status === "warning"
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {node.status === "warning" ? "警告" : "正常"}
              </div>
            </div>
          </Html>

          {/* 连接线到中心 */}
          {index > 1 && (
            <Line
              points={[new Vector3(0, 0, 0), new Vector3(0, 2, 0)]}
              color={node.color}
              lineWidth={2}
              transparent
              opacity={0.6}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// 企业级安全监控雷达
function BusinessSecurityRadar() {
  const radarRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  useFrame((state) => {
    if (radarRef.current) {
      const time = state.clock.getElapsedTime();
      radarRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={radarRef} position={[0, 8, 0]}>
      {/* 雷达盘 */}
      <mesh>
        <cylinderGeometry args={[8, 8, 0.2, 32]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary}
          transparent
          opacity={0.3}
          emissive={BUSINESS_COLORS.primary}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 雷达扫描线 */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial
          color={BUSINESS_COLORS.primary}
          emissive={BUSINESS_COLORS.primary}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 威胁指示点 */}
      {Array.from({ length: realTimeData?.realTimeThreats || 3 }).map(
        (_, i) => {
          const angle =
            (i / (realTimeData?.realTimeThreats || 3)) * Math.PI * 2;
          const radius = 2 + Math.random() * 4;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial
                color={BUSINESS_COLORS.danger}
                emissive={BUSINESS_COLORS.danger}
                emissiveIntensity={0.6}
              />
            </mesh>
          );
        },
      )}

      {/* 雷达信息显示 */}
      <Html position={[0, 2, 0]} transform>
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-center shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            安全雷达
          </div>
          <div
            className="text-lg font-bold"
            style={{ color: BUSINESS_COLORS.danger }}
          >
            {realTimeData?.realTimeThreats || 3}
          </div>
          <div className="text-xs text-gray-600">活跃威胁</div>
        </div>
      </Html>
    </group>
  );
}

// 优化的粒子系统 - 企业级
function BusinessParticleSystem() {
  const particlesRef = useRef<Points>(null);

  const particleData = useMemo(() => {
    const count = 500; // 进一步减少以优化性能
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 更集中的分布
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = Math.random() * 20 + 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      // 企业级配色
      const colorIndex = Math.floor(Math.random() * 4);
      const colors_list = [
        new Color(BUSINESS_COLORS.primary),
        new Color(BUSINESS_COLORS.success),
        new Color(BUSINESS_COLORS.info),
        new Color(BUSINESS_COLORS.purple),
      ];
      const color = colors_list[colorIndex];

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleData} frustumCulled>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 企业级信息面板 - 3D版本
function Business3DInfoPanel({
  position,
  title,
  data,
  color,
  width = 200,
}: {
  position: [number, number, number];
  title: string;
  data: Array<{ label: string; value: string | number; status?: string }>;
  color: string;
  width?: number;
}) {
  return (
    <group position={position}>
      <Html transform occlude>
        <div
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl"
          style={{ width: width }}
        >
          <div
            className="px-3 py-2 rounded-t-lg border-b border-gray-200"
            style={{ backgroundColor: color + "20" }}
          >
            <div
              className="font-semibold text-gray-800 text-sm"
              style={{ color }}
            >
              {title}
            </div>
          </div>
          <div className="p-3 space-y-2">
            {data.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-gray-600">{item.label}:</span>
                <span className="font-semibold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

// 主优化场景组件 - 企业级
function BusinessOptimizedMainScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  const informationPanels = useMemo(
    () => [
      {
        position: [35, 6, 0] as [number, number, number],
        title: "系统监控中心",
        color: BUSINESS_COLORS.primary,
        data: [
          { label: "CPU使用率", value: `${realTimeData?.cpuUsage || 45}%` },
          { label: "内存占用", value: `${realTimeData?.memoryUsage || 68}%` },
          { label: "网络流量", value: `${realTimeData?.networkUsage || 34}%` },
          { label: "系统状态", value: "运行正常" },
        ],
      },
      {
        position: [-35, 6, 0] as [number, number, number],
        title: "安全防护中心",
        color: BUSINESS_COLORS.danger,
        data: [
          { label: "威胁检测", value: realTimeData?.realTimeThreats || 3 },
          {
            label: "攻击拦截",
            value: `${Math.floor((realTimeData?.blockedAttacks || 1247) / 1000)}K`,
          },
          { label: "防护等级", value: "企业级" },
          { label: "安全状态", value: "高级防护" },
        ],
      },
      {
        position: [0, 6, 35] as [number, number, number],
        title: "网络运营中心",
        color: BUSINESS_COLORS.success,
        data: [
          {
            label: "在线用户",
            value: `${Math.floor((realTimeData?.onlineUsers || 8247) / 1000)}K`,
          },
          {
            label: "活跃连接",
            value: `${Math.floor((realTimeData?.activeConnections || 5432) / 1000)}K`,
          },
          { label: "网络健康", value: "98.7%" },
          { label: "响应时间", value: "12ms" },
        ],
      },
      {
        position: [0, 6, -35] as [number, number, number],
        title: "数据分析中心",
        color: BUSINESS_COLORS.purple,
        data: [
          { label: "数据处理", value: "2.4TB/h" },
          { label: "存储使用", value: `${realTimeData?.diskUsage || 72}%` },
          { label: "分析任务", value: "147" },
          { label: "处理状态", value: "高效运行" },
        ],
      },
    ],
    [realTimeData],
  );

  return (
    <group ref={sceneRef}>
      {/* 企业级光照系统 */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight
        position={[20, 30, 20]}
        intensity={1.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight
        position={[-20, 25, -20]}
        intensity={0.6}
        color={BUSINESS_COLORS.primary}
      />
      <pointLight
        position={[0, 20, 0]}
        intensity={0.8}
        color={BUSINESS_COLORS.info}
        distance={50}
      />
      <hemisphereLight
        color={BUSINESS_COLORS.primary}
        groundColor="#f8fafc"
        intensity={0.4}
      />

      {/* 性能监控 */}
      <PerformanceMonitor />

      {/* 中央监控模型 */}
      <Suspense fallback={null}>
        <SituationMonitoringModel realTimeData={realTimeData} />
      </Suspense>

      {/* 企业级组件 */}
      <BusinessInstancedBuildings />
      <BusinessDataCenters />
      <BusinessTrafficSystem />
      <BusinessNetworkTopology />
      <BusinessSecurityRadar />
      <BusinessParticleSystem />

      {/* 企业级信息面板 */}
      {informationPanels.map((panel, index) => (
        <Business3DInfoPanel
          key={index}
          position={panel.position}
          title={panel.title}
          data={panel.data}
          color={panel.color}
          width={220}
        />
      ))}

      {/* 企业级基础平台 */}
      <mesh position={[0, -1.5, 0]} receiveShadow frustumCulled>
        <cylinderGeometry args={[70, 70, 0.3, 32]} />
        <primitive object={BusinessSharedMaterials.platform} />
      </mesh>

      {/* 企业级网格 */}
      <gridHelper
        args={[140, 70, BUSINESS_COLORS.slate, "#e2e8f0"]}
        position={[0, -1.4, 0]}
      />

      {/* 企业级边界标识 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 55;
        const z = Math.sin(angle) * 55;
        return (
          <mesh key={i} position={[x, 1, z]} frustumCulled castShadow>
            <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
            <primitive object={BusinessSharedMaterials.light} />
          </mesh>
        );
      })}

      {/* 企业级星空背景 */}
      <Stars
        radius={150}
        depth={20}
        count={2000}
        factor={1.5}
        saturation={0}
        fade
        speed={0.1}
      />

      {/* 企业级背景 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[300, 24, 24]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.1} side={2} />
      </mesh>
    </group>
  );
}

// 前端2D信息平面组件 - 与3D数据同步
function ForegroundInfoOverlay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 顶部企业级仪表板 */}
      <div className="absolute top-20 left-6 right-6 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: BUSINESS_COLORS.success }}
              />
              <h2 className="text-xl font-semibold text-gray-800">
                CyberGuard 企业安全运营中心
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">系统运行正常</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div
              className="rounded-lg p-4 border-2"
              style={{
                backgroundColor: BUSINESS_COLORS.primary + "10",
                borderColor: BUSINESS_COLORS.primary + "30",
              }}
            >
              <div className="flex items-center justify-between">
                <Shield
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.primary }}
                />
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: BUSINESS_COLORS.primary }}
                  >
                    {realTimeData?.realTimeThreats || 3}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.primary }}
                  >
                    威胁检测
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg p-4 border-2"
              style={{
                backgroundColor: BUSINESS_COLORS.success + "10",
                borderColor: BUSINESS_COLORS.success + "30",
              }}
            >
              <div className="flex items-center justify-between">
                <Target
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.success }}
                />
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: BUSINESS_COLORS.success }}
                  >
                    {Math.floor((realTimeData?.blockedAttacks || 1247) / 1000)}K
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.success }}
                  >
                    拦截攻击
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg p-4 border-2"
              style={{
                backgroundColor: BUSINESS_COLORS.purple + "10",
                borderColor: BUSINESS_COLORS.purple + "30",
              }}
            >
              <div className="flex items-center justify-between">
                <Users
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.purple }}
                />
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: BUSINESS_COLORS.purple }}
                  >
                    {Math.floor((realTimeData?.onlineUsers || 8247) / 1000)}K
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.purple }}
                  >
                    在线用户
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg p-4 border-2"
              style={{
                backgroundColor: BUSINESS_COLORS.indigo + "10",
                borderColor: BUSINESS_COLORS.indigo + "30",
              }}
            >
              <div className="flex items-center justify-between">
                <Network
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.indigo }}
                />
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: BUSINESS_COLORS.indigo }}
                  >
                    {Math.floor(
                      (realTimeData?.activeConnections || 5432) / 1000,
                    )}
                    K
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.indigo }}
                  >
                    活跃连接
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg p-4 border-2"
              style={{
                backgroundColor: BUSINESS_COLORS.warning + "10",
                borderColor: BUSINESS_COLORS.warning + "30",
              }}
            >
              <div className="flex items-center justify-between">
                <Cpu
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.warning }}
                />
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: BUSINESS_COLORS.warning }}
                  >
                    {realTimeData?.cpuUsage || 45}%
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.warning }}
                  >
                    CPU使用率
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg p-4 border-2"
              style={{
                backgroundColor: BUSINESS_COLORS.slate + "10",
                borderColor: BUSINESS_COLORS.slate + "30",
              }}
            >
              <div className="flex items-center justify-between">
                <Clock
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.slate }}
                />
                <div className="text-right">
                  <div
                    className="text-lg font-semibold font-mono"
                    style={{ color: BUSINESS_COLORS.slate }}
                  >
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.slate }}
                  >
                    系统时间
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 左侧安全风险评估 - 与3D数据同步 */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 w-80">
          <div className="flex items-center mb-4">
            <div
              className="rounded-lg p-2 mr-3"
              style={{ backgroundColor: BUSINESS_COLORS.danger + "20" }}
            >
              <AlertTriangle
                className="w-5 h-5"
                style={{ color: BUSINESS_COLORS.danger }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">安全风险评估</h3>
              <p className="text-sm text-gray-600">Security Risk Assessment</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  高风险事件
                </span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: BUSINESS_COLORS.danger }}
                >
                  {Math.max(
                    1,
                    Math.floor((realTimeData?.realTimeThreats || 3) * 0.3),
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: BUSINESS_COLORS.danger,
                    width: `${Math.min(100, (realTimeData?.realTimeThreats || 3) * 10)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  中风险事件
                </span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: BUSINESS_COLORS.warning }}
                >
                  {Math.floor((realTimeData?.realTimeThreats || 3) * 1.5)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: BUSINESS_COLORS.warning,
                    width: `${Math.min(100, (realTimeData?.realTimeThreats || 3) * 15)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  低风险事件
                </span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: BUSINESS_COLORS.success }}
                >
                  {Math.floor((realTimeData?.realTimeThreats || 3) * 2.5)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: BUSINESS_COLORS.success,
                    width: `${Math.min(100, (realTimeData?.realTimeThreats || 3) * 20)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                整体风险等级
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{
                  backgroundColor:
                    (realTimeData?.realTimeThreats || 3) > 5
                      ? BUSINESS_COLORS.danger
                      : (realTimeData?.realTimeThreats || 3) > 2
                        ? BUSINESS_COLORS.warning
                        : BUSINESS_COLORS.success,
                }}
              >
                {(realTimeData?.realTimeThreats || 3) > 5
                  ? "高"
                  : (realTimeData?.realTimeThreats || 3) > 2
                    ? "中等"
                    : "低"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧系统性能监控 - 与3D数据同步 */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 w-80">
          <div className="flex items-center mb-4">
            <div
              className="rounded-lg p-2 mr-3"
              style={{ backgroundColor: BUSINESS_COLORS.primary + "20" }}
            >
              <Activity
                className="w-5 h-5"
                style={{ color: BUSINESS_COLORS.primary }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">系统性能监控</h3>
              <p className="text-sm text-gray-600">
                System Performance Monitor
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">CPU 使用率</span>
                <span
                  className="font-semibold"
                  style={{ color: BUSINESS_COLORS.primary }}
                >
                  {realTimeData?.cpuUsage || 45}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: BUSINESS_COLORS.primary,
                    width: `${realTimeData?.cpuUsage || 45}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">内存使用率</span>
                <span
                  className="font-semibold"
                  style={{ color: BUSINESS_COLORS.success }}
                >
                  {realTimeData?.memoryUsage || 68}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: BUSINESS_COLORS.success,
                    width: `${realTimeData?.memoryUsage || 68}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">网络流量</span>
                <span
                  className="font-semibold"
                  style={{ color: BUSINESS_COLORS.purple }}
                >
                  {realTimeData?.networkUsage || 34}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: BUSINESS_COLORS.purple,
                    width: `${realTimeData?.networkUsage || 34}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">存储空间</span>
                <span
                  className="font-semibold"
                  style={{ color: BUSINESS_COLORS.warning }}
                >
                  {realTimeData?.diskUsage || 72}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: BUSINESS_COLORS.warning,
                    width: `${realTimeData?.diskUsage || 72}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                系统状态
              </span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: BUSINESS_COLORS.success }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: BUSINESS_COLORS.success }}
                >
                  企业级运行
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作日志 - 与3D数据同步 */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className="rounded-lg p-2 mr-3"
                style={{ backgroundColor: BUSINESS_COLORS.info + "20" }}
              >
                <FileText
                  className="w-4 h-4"
                  style={{ color: BUSINESS_COLORS.info }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  企业安全事件日志
                </h3>
                <p className="text-sm text-gray-600">
                  Enterprise Security Event Logs
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: BUSINESS_COLORS.success }}
              ></div>
              <span
                className="text-sm font-medium"
                style={{ color: BUSINESS_COLORS.success }}
              >
                企业级监控
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 h-24 overflow-y-auto border">
            <div className="font-mono text-sm text-gray-700 space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  [{currentTime.toLocaleTimeString()}]
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs text-white"
                  style={{ backgroundColor: BUSINESS_COLORS.primary }}
                >
                  INFO
                </span>
                <span>企业防火墙规则更新完成，安全策略已生效</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  [{new Date(currentTime.getTime() - 5000).toLocaleTimeString()}
                  ]
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs text-white"
                  style={{ backgroundColor: BUSINESS_COLORS.warning }}
                >
                  WARN
                </span>
                <span>检测到异常登录尝试，已启动高级认证流程</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  [
                  {new Date(currentTime.getTime() - 10000).toLocaleTimeString()}
                  ]
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs text-white"
                  style={{ backgroundColor: BUSINESS_COLORS.success }}
                >
                  SUCCESS
                </span>
                <span>企业级DDoS防护成功拦截，威胁已中和</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2D信息面板组件 - 企业级样式与3D同步
function InfoPanel2D({
  isVisible,
  onToggle,
  panelMode,
  setPanelMode,
}: {
  isVisible: boolean;
  onToggle: () => void;
  panelMode: string;
  setPanelMode: (mode: string) => void;
}) {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [selectedTab, setSelectedTab] = useState("overview");

  const panelTabs = [
    {
      id: "overview",
      name: "企业概览",
      icon: Monitor,
      color: BUSINESS_COLORS.primary,
    },
    {
      id: "metrics",
      name: "性能指标",
      icon: BarChart3,
      color: BUSINESS_COLORS.success,
    },
    {
      id: "network",
      name: "网络监控",
      icon: Network,
      color: BUSINESS_COLORS.indigo,
    },
    {
      id: "security",
      name: "安全防护",
      icon: Shield,
      color: BUSINESS_COLORS.danger,
    },
    {
      id: "logs",
      name: "系统日志",
      icon: FileText,
      color: BUSINESS_COLORS.info,
    },
    {
      id: "analytics",
      name: "数据分析",
      icon: PieChart,
      color: BUSINESS_COLORS.purple,
    },
  ];

  // 生成企业级图表数据
  const chartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = (new Date().getHours() - 23 + i) % 24;
      return {
        time: `${hour.toString().padStart(2, "0")}:00`,
        cpu: 30 + Math.random() * 30, // 更稳定的企业级数据
        memory: 50 + Math.random() * 25,
        network: 25 + Math.random() * 40,
        threats: Math.floor(Math.random() * 5),
        security: 85 + Math.random() * 10, // 企业��全评分
      };
    });
    return hours;
  }, []);

  const renderOverviewTab = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4">企业系统状态</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">CPU使用率</span>
              <span className="text-blue-800 font-bold font-mono">
                {realTimeData?.cpuUsage || 45}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${realTimeData?.cpuUsage || 45}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">内存使用率</span>
              <span className="text-blue-800 font-bold font-mono">
                {realTimeData?.memoryUsage || 68}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${realTimeData?.memoryUsage || 68}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-4">
            企业安全概况
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-700">活跃威胁</span>
              <span className="text-green-800 font-bold">
                {realTimeData?.realTimeThreats || 3}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">拦截攻击</span>
              <span className="text-green-800 font-bold">
                {Math.floor((realTimeData?.blockedAttacks || 1247) / 1000)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">企业用户</span>
              <span className="text-green-800 font-bold">
                {Math.floor((realTimeData?.onlineUsers || 8247) / 1000)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">防护等级</span>
              <span className="text-green-800 font-bold">企业级</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          企业级24小时运营趋势
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <RechartsLine
                type="monotone"
                dataKey="cpu"
                stroke={BUSINESS_COLORS.primary}
                strokeWidth={3}
                name="CPU"
              />
              <RechartsLine
                type="monotone"
                dataKey="memory"
                stroke={BUSINESS_COLORS.success}
                strokeWidth={3}
                name="内存"
              />
              <RechartsLine
                type="monotone"
                dataKey="security"
                stroke={BUSINESS_COLORS.purple}
                strokeWidth={3}
                name="安全评分"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderOverviewTab();
      default:
        return (
          <div className="p-6 text-center">
            <div className="text-gray-500 mb-4">
              <Monitor className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">企业级功能开发中</h3>
              <p className="text-sm mt-2">该模块正在针对企业需求进行优化</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed right-0 top-16 bottom-0 bg-white border-l border-gray-200 transform transition-transform duration-300 z-40 shadow-2xl ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "480px" }}
    >
      {/* 企业级面板头部 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">企业控制面板</h2>
          <p className="text-sm text-gray-600">Enterprise Control Panel</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggle()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 企业级标签栏 */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {panelTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-white border-b-2 text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              style={{
                borderBottomColor:
                  selectedTab === tab.id ? tab.color : "transparent",
              }}
            >
              <IconComponent
                className="w-4 h-4"
                style={{
                  color: selectedTab === tab.id ? tab.color : undefined,
                }}
              />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 内容区域 */}
      <div
        className="overflow-y-auto bg-gray-50"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {renderTabContent()}
      </div>
    </div>
  );
}

// 企业级顶部控制栏
function BusinessTopControlBar({
  onToggle2DPanel,
  is2DPanelVisible,
}: {
  onToggle2DPanel: () => void;
  is2DPanelVisible: boolean;
}) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState("enterprise");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  const viewModes = [
    {
      id: "enterprise",
      name: "企业级",
      icon: Building,
      color: BUSINESS_COLORS.primary,
    },
    {
      id: "security",
      name: "安全",
      icon: Shield,
      color: BUSINESS_COLORS.danger,
    },
    {
      id: "performance",
      name: "性能",
      icon: Activity,
      color: BUSINESS_COLORS.success,
    },
    {
      id: "analytics",
      name: "分析",
      icon: BarChart3,
      color: BUSINESS_COLORS.purple,
    },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 border border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">返回</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Globe
                  className="w-8 h-8"
                  style={{ color: BUSINESS_COLORS.primary }}
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: BUSINESS_COLORS.success }}
                ></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  CyberGuard 企业态势感知
                </h1>
                <p className="text-sm text-gray-600">
                  Enterprise Network Security Situation Awareness
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 font-medium">
                {currentTime.toLocaleString("zh-CN")}
              </div>
            </div>

            <div className="flex bg-gray-100 rounded-lg border border-gray-200">
              {viewModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-2 text-sm font-medium transition-all ${
                      viewMode === mode.id
                        ? "bg-white text-gray-800 shadow-sm rounded-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <IconComponent
                      className="w-4 h-4 mx-auto mb-1"
                      style={{
                        color: viewMode === mode.id ? mode.color : undefined,
                      }}
                    />
                    {mode.name}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-700" />
              ) : (
                <Play className="w-4 h-4 text-gray-700" />
              )}
            </button>

            <button
              onClick={onToggle2DPanel}
              className={`p-3 rounded-lg transition-colors border ${
                is2DPanelVisible
                  ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
              }`}
              title="切换企业控制面板"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加载屏幕组件 - 企业级
function BusinessLoadingScreen() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <Loader
            className="w-12 h-12 animate-spin mx-auto"
            style={{ color: BUSINESS_COLORS.primary }}
          />
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse"
            style={{ borderTopColor: BUSINESS_COLORS.success }}
          ></div>
        </div>
        <div className="text-gray-800 text-xl font-bold mb-2">
          加载企业态势感知平台
        </div>
        <div className="text-gray-600 text-sm">
          正在启动企业级安全监控系统...
        </div>
      </div>
    </div>
  );
}

// 主要态势显示组件 - 企业级
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [is2DPanelVisible, setIs2DPanelVisible] = useState(false);
  const [panelMode, setPanelMode] = useState("enterprise");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggle2DPanel = useCallback(() => {
    setIs2DPanelVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return <BusinessLoadingScreen />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <BusinessTopControlBar
        onToggle2DPanel={toggle2DPanel}
        is2DPanelVisible={is2DPanelVisible}
      />

      <div
        className={`absolute inset-0 pt-16 transition-all duration-300 ${
          is2DPanelVisible ? "pr-[480px]" : "pr-0"
        }`}
      >
        <ThreeErrorBoundary>
          <Canvas
            shadows // 启用阴影以增强企业级视觉效果
            camera={{
              position: [0, 25, 50],
              fov: 60,
              near: 0.1,
              far: 400,
            }}
            gl={{
              antialias: true, // 启用抗锯齿以获得更清晰的企业级视觉效果
              alpha: true,
              powerPreference: "high-performance",
              precision: "highp", // 企业级精度
            }}
            dpr={[1, 2]} // 企业级设备像素比
            performance={{ min: 0.7 }} // 企业级性能要求
          >
            <Suspense fallback={null}>
              <BusinessOptimizedMainScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={15}
                maxDistance={120}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                dampingFactor={0.05}
                enableDamping
                autoRotate={false}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 企业级前端2D信息平面 */}
      <ForegroundInfoOverlay />

      {/* 企业级2D信息面板 */}
      <InfoPanel2D
        isVisible={is2DPanelVisible}
        onToggle={toggle2DPanel}
        panelMode={panelMode}
        setPanelMode={setPanelMode}
      />

      {/* 企业级面板切换按钮 */}
      {!is2DPanelVisible && (
        <button
          onClick={toggle2DPanel}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-l-lg shadow-xl border border-gray-200 transition-all duration-300"
          title="打开企业控制面板"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* 企业级底部状态栏 */}
      <div
        className={`absolute bottom-0 left-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 transition-all duration-300 ${
          is2DPanelVisible ? "right-[480px]" : "right-0"
        }`}
      >
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">
            CyberGuard 企业级 3D 网络安全态势感知平台
          </span>
          <span>
            企业级监控已启用
            {is2DPanelVisible && <span className="ml-2">| 控制面板已开启</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
