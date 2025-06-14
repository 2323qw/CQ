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
  Environment,
  Cloud,
  Detailed,
  useHelper,
  Instances,
  Instance,
  useTexture,
  Preload,
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
} from "lucide-react";
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

// 性能监控组件
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
      fps: Math.round(
        1 / (performance.now() / 1000 - performance.now() / 1000),
      ),
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
    });
  });

  return (
    <Html position={[-90, 20, 0]} transform>
      <div className="bg-black/80 text-white p-2 rounded text-xs font-mono">
        <div>FPS: {stats.fps}</div>
        <div>Draw Calls: {stats.drawCalls}</div>
        <div>Triangles: {stats.triangles.toLocaleString()}</div>
        <div>Geometries: {stats.geometries}</div>
        <div>Textures: {stats.textures}</div>
      </div>
    </Html>
  );
}

// 共享材质管理器
const SharedMaterials = {
  building: new MeshStandardMaterial({
    color: "#1a2432",
    metalness: 0.3,
    roughness: 0.7,
  }),
  buildingGlass: new MeshStandardMaterial({
    color: "#004466",
    transparent: true,
    opacity: 0.3,
    metalness: 0.8,
    roughness: 0.1,
  }),
  server: new MeshStandardMaterial({
    color: "#1a1a1a",
    metalness: 0.8,
    roughness: 0.2,
  }),
  road: new MeshStandardMaterial({ color: "#333333", roughness: 0.9 }),
  vehicle: new MeshStandardMaterial({
    color: "#2a2a2a",
    metalness: 0.6,
    roughness: 0.4,
  }),
  platform: new MeshStandardMaterial({
    color: "#0a0a0a",
    transparent: true,
    opacity: 0.4,
    metalness: 0.5,
    roughness: 0.5,
  }),
  light: new MeshStandardMaterial({
    color: "#00f5ff",
    emissive: "#00f5ff",
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.7,
  }),
};

// 共享几何体管理器
const SharedGeometries = {
  box: new BoxGeometry(1, 1, 1),
  cylinder: new CylinderGeometry(1, 1, 1, 8),
  sphere: new SphereGeometry(1, 8, 8),
  buildingBase: new BoxGeometry(1, 1, 1),
  serverRack: new BoxGeometry(2, 8, 1),
  vehicleBody: new BoxGeometry(1, 0.6, 2),
};

// 优化的实例化建筑组件
function OptimizedInstancedBuildings() {
  const buildingsRef = useRef<Group>(null);
  const lowDetailRef = useRef<InstancedMesh>(null);
  const mediumDetailRef = useRef<InstancedMesh>(null);
  const highDetailRef = useRef<InstancedMesh>(null);

  const buildingData = useMemo(() => {
    const buildings = [];
    const tempObject = new Object3D();

    // 生成建筑数据
    const districts = [
      { center: [45, 0, 45], count: 8, heightRange: [25, 50] },
      { center: [-45, 0, 45], count: 8, heightRange: [12, 25] },
      { center: [45, 0, -45], count: 6, heightRange: [6, 15] },
      { center: [-45, 0, -45], count: 6, heightRange: [18, 35] },
    ];

    districts.forEach((district) => {
      for (let i = 0; i < district.count; i++) {
        const angle = (i / district.count) * Math.PI * 2;
        const radius = 8 + Math.random() * 12;
        const x = district.center[0] + Math.cos(angle) * radius;
        const z = district.center[2] + Math.sin(angle) * radius;
        const height =
          district.heightRange[0] +
          Math.random() * (district.heightRange[1] - district.heightRange[0]);

        buildings.push({
          position: [x, height / 2, z],
          scale: [3 + Math.random() * 3, height, 3 + Math.random() * 3],
          rotation: [0, Math.random() * Math.PI, 0],
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

      // 应用相同的矩阵到所有LOD级别
      lowDetailRef.current!.setMatrixAt(i, tempObject.matrix);
      mediumDetailRef.current!.setMatrixAt(i, tempObject.matrix);
      highDetailRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    lowDetailRef.current.instanceMatrix.needsUpdate = true;
    mediumDetailRef.current.instanceMatrix.needsUpdate = true;
    highDetailRef.current.instanceMatrix.needsUpdate = true;
  }, [buildingData]);

  return (
    <group ref={buildingsRef}>
      {/* LOD系统 - 远距离用简单几何体 */}
      <Detailed distances={[0, 50, 100]}>
        {/* 高细节 - 近距离 */}
        <instancedMesh
          ref={highDetailRef}
          args={[
            SharedGeometries.buildingBase,
            SharedMaterials.building,
            buildingData.length,
          ]}
          frustumCulled
        />
        {/* 中等细节 - 中距离 */}
        <instancedMesh
          ref={mediumDetailRef}
          args={[
            SharedGeometries.box,
            SharedMaterials.building,
            buildingData.length,
          ]}
          frustumCulled
        />
        {/* 低细节 - 远距离 */}
        <instancedMesh
          ref={lowDetailRef}
          args={[
            SharedGeometries.cylinder,
            SharedMaterials.building,
            buildingData.length,
          ]}
          frustumCulled
        />
      </Detailed>
    </group>
  );
}

// 优化的实例化数据中心
function OptimizedDataCenters() {
  const racksRef = useRef<InstancedMesh>(null);

  const rackData = useMemo(() => {
    const racks = [];
    const centers = [
      { pos: [-60, 0, 0], count: 8 },
      { pos: [60, 0, 0], count: 6 },
      { pos: [0, 0, 60], count: 4 },
    ];

    centers.forEach((center) => {
      for (let i = 0; i < center.count; i++) {
        const x = center.pos[0] + (i % 4) * 6 - 9;
        const z = center.pos[2] + Math.floor(i / 4) * 4 - 2;
        racks.push({
          position: [x, 4, z],
          scale: [1, 1, 1],
          status: Math.random() > 0.1 ? "active" : "warning",
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
    <instancedMesh
      ref={racksRef}
      args={[
        SharedGeometries.serverRack,
        SharedMaterials.server,
        rackData.length,
      ]}
      frustumCulled
    />
  );
}

// 优化的交通系统
function OptimizedTrafficSystem() {
  const vehiclesRef = useRef<InstancedMesh>(null);
  const [vehiclePositions, setVehiclePositions] = useState(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      position: [(Math.random() - 0.5) * 100, 0.3, (Math.random() - 0.5) * 100],
      direction: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.1,
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

        // 边界检查
        if (Math.abs(newPos[0]) > 60 || Math.abs(newPos[2]) > 60) {
          return {
            ...vehicle,
            direction:
              vehicle.direction + Math.PI + (Math.random() - 0.5) * 0.5,
          };
        }

        return { ...vehicle, position: newPos };
      }),
    );

    vehiclePositions.forEach((vehicle, i) => {
      tempObject.position.set(...vehicle.position);
      tempObject.rotation.y = vehicle.direction;
      tempObject.updateMatrix();
      vehiclesRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    vehiclesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={vehiclesRef}
      args={[
        SharedGeometries.vehicleBody,
        SharedMaterials.vehicle,
        vehiclePositions.length,
      ]}
      frustumCulled
    />
  );
}

// 优化的粒子系统
function OptimizedParticleSystem() {
  const particlesRef = useRef<Points>(null);

  const particleData = useMemo(() => {
    const count = 1000; // 减少粒子数量以提高性能
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 随机分布在场景中
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = Math.random() * 30 + 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      // 随机颜色
      const color = new Color(Math.random() > 0.5 ? "#00f5ff" : "#ff6b00");
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleData} frustumCulled>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 简化的网络拓扑
function SimplifiedNetworkTopology() {
  const networkRef = useRef<Group>(null);

  const networkNodes = useMemo(() => {
    const nodes = [];
    const layers = [
      { radius: 15, count: 2, height: 10, type: "core" },
      { radius: 25, count: 4, height: 5, type: "aggregation" },
      { radius: 35, count: 8, height: 0, type: "access" },
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
        });
      }
    });

    return nodes;
  }, []);

  return (
    <group ref={networkRef}>
      {networkNodes.map((node, index) => (
        <mesh key={index} position={node.position} frustumCulled>
          <sphereGeometry args={[node.type === "core" ? 1 : 0.8, 8, 8]} />
          <meshStandardMaterial
            color={
              node.type === "core"
                ? "#ff6600"
                : node.type === "aggregation"
                  ? "#0066ff"
                  : "#00ff66"
            }
            emissive={
              node.type === "core"
                ? "#ff6600"
                : node.type === "aggregation"
                  ? "#0066ff"
                  : "#00ff66"
            }
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// 优化的卫星系统
function OptimizedSatelliteSystem() {
  const satelliteRef = useRef<Group>(null);

  useFrame((state) => {
    if (satelliteRef.current) {
      const time = state.clock.getElapsedTime();
      satelliteRef.current.position.x = Math.cos(time * 0.05) * 30;
      satelliteRef.current.position.z = Math.sin(time * 0.05) * 30;
      satelliteRef.current.position.y = 25;
      satelliteRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={satelliteRef}>
      {/* 简化的卫星模型 */}
      <mesh frustumCulled>
        <boxGeometry args={[2, 1, 3]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>

      {/* 太阳能板 */}
      <mesh position={[-2.5, 0, 0]} frustumCulled>
        <boxGeometry args={[1, 4, 0.1]} />
        <meshStandardMaterial color="#001166" />
      </mesh>
      <mesh position={[2.5, 0, 0]} frustumCulled>
        <boxGeometry args={[1, 4, 0.1]} />
        <meshStandardMaterial color="#001166" />
      </mesh>

      {/* 卫星标识 */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CYBERGUARD SAT
      </Text>
    </group>
  );
}

// 优化的信息面板
function OptimizedInfoPanel({
  position,
  title,
  data,
  color,
}: {
  position: [number, number, number];
  title: string;
  data: Array<{ label: string; value: string | number }>;
  color: string;
}) {
  return (
    <group position={position}>
      <Html transform occlude>
        <div
          className="bg-black/90 text-white p-3 rounded border-l-4 min-w-48 max-w-64"
          style={{ borderLeftColor: color }}
        >
          <div className="font-bold text-sm mb-2" style={{ color }}>
            {title}
          </div>
          <div className="space-y-1">
            {data.slice(0, 4).map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-300">{item.label}:</span>
                <span className="font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

// 主优化场景组件
function OptimizedMainScene() {
  const sceneRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000, // 降低更新频率以提高性能
    enabled: true,
  });

  const informationPanels = useMemo(
    () => [
      {
        position: [40, 8, 0] as [number, number, number],
        title: "系统监控",
        color: "#00f5ff",
        data: [
          { label: "CPU", value: `${realTimeData?.cpuUsage || 45}%` },
          { label: "内存", value: `${realTimeData?.memoryUsage || 68}%` },
          { label: "网络", value: `${realTimeData?.networkUsage || 34}%` },
          { label: "状态", value: "正常" },
        ],
      },
      {
        position: [-40, 8, 0] as [number, number, number],
        title: "安全监控",
        color: "#ff6600",
        data: [
          { label: "威胁", value: realTimeData?.realTimeThreats || 3 },
          { label: "已拦截", value: realTimeData?.blockedAttacks || 1247 },
          { label: "防护", value: "启用" },
          { label: "级别", value: "高" },
        ],
      },
      {
        position: [0, 8, 40] as [number, number, number],
        title: "网络状态",
        color: "#00ff66",
        data: [
          { label: "连接数", value: realTimeData?.activeConnections || 8247 },
          { label: "带宽", value: "2.4GB/s" },
          { label: "延迟", value: "12ms" },
          { label: "健康度", value: "98.7%" },
        ],
      },
      {
        position: [0, 8, -40] as [number, number, number],
        title: "系统资源",
        color: "#aa00ff",
        data: [
          { label: "存储", value: `${realTimeData?.diskUsage || 72}%` },
          { label: "用户", value: realTimeData?.onlineUsers || 1247 },
          { label: "服务", value: "运行中" },
          { label: "负载", value: "正常" },
        ],
      },
    ],
    [realTimeData],
  );

  return (
    <group ref={sceneRef}>
      {/* 优化的光照系统 - 减少光源数量 */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[30, 30, 30]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#0088ff" />
      <pointLight position={[20, 10, 20]} intensity={0.5} color="#ff8800" />

      {/* 性能监控 */}
      <PerformanceMonitor />

      {/* 中央监控模型 - 简化版本 */}
      <Suspense fallback={null}>
        <SituationMonitoringModel realTimeData={realTimeData} />
      </Suspense>

      {/* 优化的组件 */}
      <OptimizedInstancedBuildings />
      <OptimizedDataCenters />
      <OptimizedTrafficSystem />
      <OptimizedParticleSystem />
      <SimplifiedNetworkTopology />
      <OptimizedSatelliteSystem />

      {/* 信息面板 */}
      {informationPanels.map((panel, index) => (
        <OptimizedInfoPanel
          key={index}
          position={panel.position}
          title={panel.title}
          data={panel.data}
          color={panel.color}
        />
      ))}

      {/* 简化的基础平台 */}
      <mesh position={[0, -2, 0]} receiveShadow frustumCulled>
        <cylinderGeometry args={[80, 80, 0.5, 32]} />
        <primitive object={SharedMaterials.platform} />
      </mesh>

      {/* 简化的网格 */}
      <gridHelper
        args={[160, 80, "#333333", "#1a1a1a"]}
        position={[0, -1.8, 0]}
      />

      {/* 简化的边界系统 */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 60;
        const z = Math.sin(angle) * 60;
        return (
          <mesh key={i} position={[x, 1, z]} frustumCulled>
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <primitive object={SharedMaterials.light} />
          </mesh>
        );
      })}

      {/* 优化的星空 - 减少星星数量 */}
      <Stars
        radius={200}
        depth={30}
        count={5000}
        factor={2}
        saturation={0}
        fade
        speed={0.2}
      />
    </group>
  );
}

// 优化的顶部控制栏
function OptimizedTopControlBar() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 5000); // 降低更新频率
    return () => clearInterval(timer);
  }, []);

  const viewModes = [
    { id: "overview", name: "总览", icon: Monitor },
    { id: "network", name: "网络", icon: Network },
    { id: "security", name: "安全", icon: Shield },
    { id: "performance", name: "性能", icon: Activity },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/95 via-matrix-surface/90 to-matrix-surface/95 backdrop-blur-lg border-b border-matrix-border">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-3 py-2 bg-matrix-accent/50 hover:bg-matrix-accent/70 rounded-lg transition-colors text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </button>

            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-neon-blue animate-pulse" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  CyberGuard 3D 态势感知
                </h1>
                <p className="text-xs text-muted-foreground">
                  优化版网络安全监控平台
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-matrix-accent/20 rounded-lg p-2 border border-matrix-border">
              <div className="text-xs text-white font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex bg-matrix-accent/20 rounded-lg border border-matrix-border">
              {viewModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-2 py-1 text-xs transition-colors ${
                      viewMode === mode.id
                        ? "bg-matrix-accent text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-3 h-3 mx-auto mb-1" />
                    {mode.name}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-matrix-accent/30 hover:bg-matrix-accent/50 rounded-lg transition-colors text-white"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加载屏幕组件
function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <Loader className="w-8 h-8 text-neon-blue animate-spin mx-auto mb-4" />
        <div className="text-white text-lg font-bold mb-2">
          加载3D态势感知平台
        </div>
        <div className="text-muted-foreground text-sm">正在优化性能...</div>
      </div>
    </div>
  );
}

// 主要态势显示组件
export default function SituationDisplay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <OptimizedTopControlBar />

      <div className="absolute inset-0 pt-16">
        <ThreeErrorBoundary>
          <Canvas
            shadows={false} // 禁用阴影以提高性能
            camera={{
              position: [0, 20, 40],
              fov: 60,
              near: 0.1,
              far: 500, // 减小远平面以提高性能
            }}
            gl={{
              antialias: false, // 禁用抗锯齿以提高性能
              alpha: true,
              powerPreference: "high-performance",
              precision: "lowp", // 使用低精度以提高性能
            }}
            dpr={[1, 1.5]} // 限制设备像素比
            performance={{ min: 0.5 }} // 自动性能调节
          >
            <Suspense fallback={null}>
              <OptimizedMainScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={10}
                maxDistance={150} // 限制最大距离
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
                dampingFactor={0.1} // 添加阻尼以减少计算
                enableDamping
              />
              <Environment preset="night" />
              <Preload all />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 简化的底部状态 */}
      <div className="absolute bottom-0 left-0 right-0 bg-matrix-surface/90 backdrop-blur-sm border-t border-matrix-border p-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>优化版 3D 网络安全态势感知平台</span>
          <span>高性能模式已启用</span>
        </div>
      </div>
    </div>
  );
}
