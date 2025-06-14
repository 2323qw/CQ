import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
} from "three";
import { SituationMonitoringModel } from "@/components/3d/SituationMonitoringModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

// 优化的3D城市建筑群背景（更真实的比例）
function OptimizedCityBuildings() {
  const buildingsRef = useRef<Group>(null);

  const cityDistricts = useMemo(() => {
    return [
      // 商业区 - 高层建筑群
      {
        name: "商业区",
        center: [45, 0, 45],
        buildings: [
          { pos: [0, 0, 0], size: [4, 35, 4], color: "#1a2432", lights: 12 },
          { pos: [8, 0, 0], size: [5, 42, 5], color: "#2a1532", lights: 15 },
          { pos: [0, 0, 8], size: [4, 38, 4], color: "#1a3522", lights: 14 },
          { pos: [8, 0, 8], size: [6, 48, 6], color: "#321a25", lights: 18 },
          { pos: [-8, 0, 0], size: [3, 28, 3], color: "#1a2432", lights: 10 },
          { pos: [0, 0, -8], size: [4, 32, 4], color: "#2a1532", lights: 12 },
          { pos: [-8, 0, 8], size: [5, 40, 5], color: "#1a3522", lights: 16 },
          { pos: [8, 0, -8], size: [3, 30, 3], color: "#321a25", lights: 11 },
        ],
      },
      // 住宅区 - 中层建筑
      {
        name: "住宅区",
        center: [-45, 0, 45],
        buildings: [
          { pos: [0, 0, 0], size: [6, 18, 6], color: "#2a3442", lights: 8 },
          { pos: [12, 0, 0], size: [5, 15, 5], color: "#3a2542", lights: 6 },
          { pos: [0, 0, 12], size: [7, 20, 7], color: "#2a4532", lights: 9 },
          { pos: [12, 0, 12], size: [4, 12, 4], color: "#423a25", lights: 5 },
          { pos: [-12, 0, 0], size: [5, 16, 5], color: "#2a3442", lights: 7 },
          { pos: [0, 0, -12], size: [6, 14, 6], color: "#3a2542", lights: 6 },
          { pos: [-12, 0, 12], size: [8, 22, 8], color: "#2a4532", lights: 10 },
          { pos: [12, 0, -12], size: [3, 10, 3], color: "#423a25", lights: 4 },
        ],
      },
      // 工业区 - 特殊建筑
      {
        name: "工业区",
        center: [45, 0, -45],
        buildings: [
          { pos: [0, 0, 0], size: [12, 8, 8], color: "#442a1a", lights: 4 },
          { pos: [20, 0, 0], size: [8, 25, 6], color: "#1a442a", lights: 12 },
          { pos: [0, 0, 15], size: [15, 6, 10], color: "#2a1a44", lights: 3 },
          { pos: [20, 0, 15], size: [6, 20, 6], color: "#442a1a", lights: 8 },
          { pos: [-20, 0, 0], size: [10, 12, 6], color: "#1a442a", lights: 6 },
          { pos: [0, 0, -15], size: [8, 10, 8], color: "#2a1a44", lights: 5 },
          { pos: [-20, 0, 15], size: [14, 7, 9], color: "#442a1a", lights: 4 },
          { pos: [20, 0, -15], size: [5, 15, 5], color: "#1a442a", lights: 7 },
        ],
      },
      // 科技园区 - 现代建筑
      {
        name: "科技园区",
        center: [-45, 0, -45],
        buildings: [
          { pos: [0, 0, 0], size: [8, 30, 6], color: "#1a3a4a", lights: 15 },
          { pos: [15, 0, 0], size: [6, 25, 8], color: "#3a1a4a", lights: 12 },
          { pos: [0, 0, 15], size: [10, 35, 5], color: "#4a3a1a", lights: 18 },
          { pos: [15, 0, 15], size: [5, 20, 6], color: "#1a4a3a", lights: 10 },
          { pos: [-15, 0, 0], size: [7, 28, 7], color: "#1a3a4a", lights: 14 },
          { pos: [0, 0, -15], size: [9, 32, 4], color: "#3a1a4a", lights: 16 },
          { pos: [-15, 0, 15], size: [6, 22, 8], color: "#4a3a1a", lights: 11 },
          { pos: [15, 0, -15], size: [4, 18, 5], color: "#1a4a3a", lights: 9 },
        ],
      },
    ];
  }, []);

  useFrame((state) => {
    if (buildingsRef.current) {
      const time = state.clock.getElapsedTime();
      // 极缓慢的整体旋转
      buildingsRef.current.rotation.y = time * 0.0005;
    }
  });

  return (
    <group ref={buildingsRef}>
      {cityDistricts.map((district, districtIndex) => (
        <group key={districtIndex} position={district.center}>
          {/* 区域标识 */}
          <Text
            position={[0, 60, 0]}
            fontSize={2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {district.name}
          </Text>

          {district.buildings.map((building, buildingIndex) => (
            <group key={buildingIndex} position={building.pos}>
              {/* 建��主体 */}
              <mesh position={[0, building.size[1] / 2, 0]}>
                <boxGeometry args={building.size} />
                <meshStandardMaterial
                  color={building.color}
                  metalness={0.3}
                  roughness={0.7}
                />
              </mesh>

              {/* 建筑顶部灯光 */}
              <pointLight
                position={[0, building.size[1] + 2, 0]}
                intensity={0.3}
                color="#ffffff"
                distance={15}
              />

              {/* 窗户灯光 */}
              {Array.from({ length: building.lights }).map((_, lightIndex) => {
                const x = (Math.random() - 0.5) * building.size[0] * 0.8;
                const y =
                  Math.random() * building.size[1] * 0.8 +
                  building.size[1] * 0.1;
                const z = (Math.random() - 0.5) * building.size[2] * 0.8;
                return (
                  <mesh key={lightIndex} position={[x, y, z]}>
                    <boxGeometry args={[0.2, 0.2, 0.05]} />
                    <meshBasicMaterial
                      color={Math.random() > 0.7 ? "#ffaa00" : "#ffffff"}
                      transparent
                      opacity={Math.random() > 0.3 ? 0.8 : 0.2}
                    />
                  </mesh>
                );
              })}

              {/* 天线和设备 */}
              <mesh position={[0, building.size[1] + 1, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
                <meshStandardMaterial color="#888888" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// 增强的数据中心系统
function EnhancedDataCenterRacks() {
  const rackSystemRef = useRef<Group>(null);

  const dataCenters = useMemo(() => {
    return [
      {
        name: "主数据中心",
        position: [-60, 0, 0],
        racks: Array.from({ length: 8 }).map((_, i) => ({
          position: [(i % 4) * 6 - 9, 0, Math.floor(i / 4) * 4 - 2] as [
            number,
            number,
            number,
          ],
          status: Math.random() > 0.1 ? "active" : "warning",
          load: Math.random() * 100,
          temperature: 20 + Math.random() * 15,
        })),
      },
      {
        name: "备份数据中心",
        position: [60, 0, 0],
        racks: Array.from({ length: 6 }).map((_, i) => ({
          position: [(i % 3) * 6 - 6, 0, Math.floor(i / 3) * 4 - 2] as [
            number,
            number,
            number,
          ],
          status: Math.random() > 0.05 ? "active" : "maintenance",
          load: Math.random() * 80,
          temperature: 18 + Math.random() * 12,
        })),
      },
      {
        name: "边缘计算中心",
        position: [0, 0, 60],
        racks: Array.from({ length: 4 }).map((_, i) => ({
          position: [(i % 2) * 6 - 3, 0, Math.floor(i / 2) * 4 - 2] as [
            number,
            number,
            number,
          ],
          status: "active",
          load: Math.random() * 60,
          temperature: 22 + Math.random() * 10,
        })),
      },
    ];
  }, []);

  useFrame((state) => {
    if (rackSystemRef.current) {
      const time = state.clock.getElapsedTime();
      // 数据流动效果
      rackSystemRef.current.children.forEach((center, centerIndex) => {
        center.children.forEach((rack, rackIndex) => {
          if (rack.children[2]) {
            // 状态指示器
            const intensity = 0.5 + Math.sin(time * 2 + rackIndex * 0.5) * 0.3;
            (rack.children[2] as any).material.emissiveIntensity = intensity;
          }
        });
      });
    }
  });

  return (
    <group ref={rackSystemRef}>
      {dataCenters.map((center, centerIndex) => (
        <group key={centerIndex} position={center.position}>
          {/* 数据中心标识 */}
          <Text
            position={[0, 12, 0]}
            fontSize={1.5}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
          >
            {center.name}
          </Text>

          {/* 防护罩 */}
          <mesh position={[0, 6, 0]}>
            <cylinderGeometry args={[15, 15, 0.5, 32]} />
            <meshStandardMaterial
              color="#003366"
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>

          {center.racks.map((rack, rackIndex) => (
            <group key={rackIndex} position={rack.position}>
              {/* 机架主体 */}
              <mesh position={[0, 4, 0]}>
                <boxGeometry args={[2, 8, 1]} />
                <meshStandardMaterial
                  color="#1a1a1a"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>

              {/* 服务器单元 */}
              {Array.from({ length: 12 }).map((_, unitIndex) => (
                <mesh
                  key={unitIndex}
                  position={[0, 0.5 + unitIndex * 0.6, 0.45]}
                >
                  <boxGeometry args={[1.8, 0.4, 0.1]} />
                  <meshStandardMaterial
                    color={rack.status === "active" ? "#004400" : "#440000"}
                  />
                </mesh>
              ))}

              {/* 状态指示器 */}
              <mesh position={[0, 8.5, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial
                  color={
                    rack.status === "active"
                      ? "#00ff00"
                      : rack.status === "warning"
                        ? "#ffaa00"
                        : "#ff0000"
                  }
                  emissive={
                    rack.status === "active"
                      ? "#004400"
                      : rack.status === "warning"
                        ? "#442200"
                        : "#440000"
                  }
                  emissiveIntensity={0.5}
                />
              </mesh>

              {/* 负载显示 */}
              <Html position={[0, -1, 1]} transform>
                <div className="bg-black/70 text-white p-1 rounded text-xs">
                  负载: {rack.load.toFixed(1)}%<br />
                  温度: {rack.temperature.toFixed(1)}°C
                </div>
              </Html>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// 增强的卫星通信系统
function AdvancedSatelliteSystem() {
  const satelliteRef = useRef<Group>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useFrame((state) => {
    if (satelliteRef.current) {
      const time = state.clock.getElapsedTime();
      // 卫星轨道运动
      satelliteRef.current.position.x = Math.cos(time * 0.1) * 40;
      satelliteRef.current.position.z = Math.sin(time * 0.1) * 40;
      satelliteRef.current.position.y = 35 + Math.sin(time * 0.05) * 5;
      satelliteRef.current.rotation.y = time * 0.2;
    }
  });

  const groundStations = [
    { name: "北京站", position: [20, 0, 20], signal: 95 },
    { name: "上海站", position: [-20, 0, 20], signal: 88 },
    { name: "广州站", position: [20, 0, -20], signal: 92 },
    { name: "深圳站", position: [-20, 0, -20], signal: 90 },
    { name: "成都站", position: [0, 0, 25], signal: 86 },
    { name: "西安站", position: [0, 0, -25], signal: 91 },
  ];

  return (
    <group>
      {/* 卫星本体 */}
      <group ref={satelliteRef}>
        {/* 卫星主体 */}
        <mesh>
          <boxGeometry args={[3, 2, 4]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>

        {/* 太阳能板 */}
        <mesh position={[-4, 0, 0]}>
          <boxGeometry args={[2, 6, 0.1]} />
          <meshStandardMaterial color="#001166" />
        </mesh>
        <mesh position={[4, 0, 0]}>
          <boxGeometry args={[2, 6, 0.1]} />
          <meshStandardMaterial color="#001166" />
        </mesh>

        {/* 通信天线 */}
        <mesh position={[0, 2, 0]}>
          <coneGeometry args={[0.8, 2, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* 天线阵列 */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.5, -1.5, Math.sin(angle) * 1.5]}
            >
              <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
              <meshStandardMaterial color="#ffaa00" />
            </mesh>
          );
        })}

        {/* 卫星标识 */}
        <Text
          position={[0, -3, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CyberGuard-SAT-01
        </Text>

        {/* 状态信息 */}
        <Html position={[0, -4, 0]} transform>
          <div className="bg-black/80 text-white p-2 rounded text-xs">
            轨道高度: 35,786 km
            <br />
            信号强度: 97%
            <br />
            工作状态: 正常
            <br />
            时间: {currentTime.toLocaleTimeString()}
          </div>
        </Html>
      </group>

      {/* 地面站 */}
      {groundStations.map((station, index) => (
        <group key={index} position={station.position}>
          {/* 地面站建筑 */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[2, 2, 4, 16]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>

          {/* 抛物面天线 */}
          <mesh position={[0, 5, 0]} rotation={[Math.PI / 6, 0, 0]}>
            <sphereGeometry
              args={[1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color="#cccccc" />
          </mesh>

          {/* 通信信号 */}
          <Line
            points={[
              new Vector3(0, 5, 0),
              new Vector3(
                satelliteRef.current?.position.x || 0,
                satelliteRef.current?.position.y || 35,
                satelliteRef.current?.position.z || 0,
              ),
            ]}
            color="#00aaff"
            lineWidth={2}
            transparent
            opacity={0.6}
            dashed
          />

          {/* 地面站标识 */}
          <Text
            position={[0, 7, 0]}
            fontSize={0.3}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
          >
            {station.name}
          </Text>

          {/* 信号状态 */}
          <Html position={[0, -1, 0]} transform>
            <div className="bg-black/70 text-white p-1 rounded text-xs">
              信号: {station.signal}%
            </div>
          </Html>
        </group>
      ))}

      {/* 卫星覆盖范围 */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[80, 80, 0.1, 64]} />
        <meshBasicMaterial
          color="#0066ff"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
}

// 智能交通网络系统
function IntelligentTrafficNetwork() {
  const trafficRef = useRef<Group>(null);

  const roadNetwork = useMemo(() => {
    const roads = [
      // 主干道
      { start: [-80, 0, 0], end: [80, 0, 0], type: "highway" },
      { start: [0, 0, -80], end: [0, 0, 80], type: "highway" },
      // 环线
      { start: [-50, 0, -50], end: [50, 0, -50], type: "ring" },
      { start: [50, 0, -50], end: [50, 0, 50], type: "ring" },
      { start: [50, 0, 50], end: [-50, 0, 50], type: "ring" },
      { start: [-50, 0, 50], end: [-50, 0, -50], type: "ring" },
      // 连接道
      { start: [-50, 0, 0], end: [-25, 0, 0], type: "connector" },
      { start: [50, 0, 0], end: [25, 0, 0], type: "connector" },
      { start: [0, 0, -50], end: [0, 0, -25], type: "connector" },
      { start: [0, 0, 50], end: [0, 0, 25], type: "connector" },
    ];

    const vehicles = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      type: i % 5 === 0 ? "truck" : i % 3 === 0 ? "bus" : "car",
      position: [
        (Math.random() - 0.5) * 150,
        0.3,
        (Math.random() - 0.5) * 150,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.2,
      direction: Math.random() * Math.PI * 2,
      status: Math.random() > 0.9 ? "alert" : "normal",
    }));

    return { roads, vehicles };
  }, []);

  const [vehicles, setVehicles] = useState(roadNetwork.vehicles);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => {
        let newPosition = [...vehicle.position] as [number, number, number];
        newPosition[0] += Math.cos(vehicle.direction) * vehicle.speed;
        newPosition[2] += Math.sin(vehicle.direction) * vehicle.speed;

        // 边界检查和折返
        if (Math.abs(newPosition[0]) > 75 || Math.abs(newPosition[2]) > 75) {
          return {
            ...vehicle,
            direction:
              vehicle.direction + Math.PI + (Math.random() - 0.5) * 0.5,
          };
        }

        return {
          ...vehicle,
          position: newPosition,
        };
      }),
    );
  });

  return (
    <group ref={trafficRef}>
      {/* 道路网络 */}
      {roadNetwork.roads.map((road, index) => (
        <Line
          key={index}
          points={[new Vector3(...road.start), new Vector3(...road.end)]}
          color={
            road.type === "highway"
              ? "#ffaa00"
              : road.type === "ring"
                ? "#00aaff"
                : "#888888"
          }
          lineWidth={road.type === "highway" ? 6 : road.type === "ring" ? 4 : 2}
          transparent
          opacity={0.7}
        />
      ))}

      {/* 车辆 */}
      {vehicles.map((vehicle, index) => (
        <group
          key={vehicle.id}
          position={vehicle.position}
          rotation={[0, vehicle.direction, 0]}
        >
          {/* 车辆主体 */}
          <mesh>
            <boxGeometry
              args={
                vehicle.type === "truck"
                  ? [2, 0.8, 4]
                  : vehicle.type === "bus"
                    ? [1.5, 1, 3]
                    : [1, 0.6, 2]
              }
            />
            <meshStandardMaterial
              color={
                vehicle.status === "alert"
                  ? "#ff0000"
                  : vehicle.type === "truck"
                    ? "#444444"
                    : vehicle.type === "bus"
                      ? "#0066cc"
                      : "#2a2a2a"
              }
            />
          </mesh>

          {/* 车灯 */}
          <mesh
            position={[
              0,
              0.2,
              vehicle.type === "truck" ? 2 : vehicle.type === "bus" ? 1.5 : 1,
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* 状态指示 */}
          {vehicle.status === "alert" && (
            <pointLight
              position={[0, 2, 0]}
              intensity={0.5}
              color="#ff0000"
              distance={5}
            />
          )}
        </group>
      ))}

      {/* 交通信号灯 */}
      {[
        [40, 0, 40],
        [-40, 0, 40],
        [40, 0, -40],
        [-40, 0, -40],
        [0, 0, 0],
      ].map((pos, index) => (
        <group key={index} position={pos}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
          <mesh position={[0, 6, 0]}>
            <boxGeometry args={[0.5, 1.5, 0.3]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0, 6.3, 0.16]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial
              color={
                Math.sin(Date.now() * 0.002 + index) > 0 ? "#00ff00" : "#ff0000"
              }
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 高级网络拓扑可视化
function AdvancedNetworkTopology() {
  const networkRef = useRef<Group>(null);

  const networkLayers = useMemo(() => {
    return [
      {
        name: "核心层",
        radius: 15,
        height: 10,
        nodes: [
          { name: "核心路由器1", type: "core", angle: 0, status: "active" },
          {
            name: "核心路由器2",
            type: "core",
            angle: Math.PI,
            status: "active",
          },
        ],
      },
      {
        name: "汇聚层",
        radius: 25,
        height: 5,
        nodes: [
          {
            name: "汇聚交换机1",
            type: "aggregation",
            angle: 0,
            status: "active",
          },
          {
            name: "汇聚交换机2",
            type: "aggregation",
            angle: Math.PI / 2,
            status: "active",
          },
          {
            name: "汇聚交换机3",
            type: "aggregation",
            angle: Math.PI,
            status: "warning",
          },
          {
            name: "汇聚交换机4",
            type: "aggregation",
            angle: (3 * Math.PI) / 2,
            status: "active",
          },
        ],
      },
      {
        name: "接入层",
        radius: 35,
        height: 0,
        nodes: [
          { name: "接入交换机1", type: "access", angle: 0, status: "active" },
          {
            name: "接入交换机2",
            type: "access",
            angle: Math.PI / 4,
            status: "active",
          },
          {
            name: "接入交换机3",
            type: "access",
            angle: Math.PI / 2,
            status: "active",
          },
          {
            name: "接入交换机4",
            type: "access",
            angle: (3 * Math.PI) / 4,
            status: "maintenance",
          },
          {
            name: "接入交换机5",
            type: "access",
            angle: Math.PI,
            status: "active",
          },
          {
            name: "接入交换机6",
            type: "access",
            angle: (5 * Math.PI) / 4,
            status: "active",
          },
          {
            name: "接入交换机7",
            type: "access",
            angle: (3 * Math.PI) / 2,
            status: "active",
          },
          {
            name: "接入交换机8",
            type: "access",
            angle: (7 * Math.PI) / 4,
            status: "active",
          },
        ],
      },
    ];
  }, []);

  useFrame((state) => {
    if (networkRef.current) {
      const time = state.clock.getElapsedTime();
      // 网络层轻微旋转
      networkRef.current.children.forEach((layer, index) => {
        layer.rotation.y = time * 0.01 * (index + 1);
      });
    }
  });

  const getNodeGeometry = (type: string) => {
    switch (type) {
      case "core":
        return <octahedronGeometry args={[1]} />;
      case "aggregation":
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case "access":
        return <sphereGeometry args={[0.8, 16, 16]} />;
      default:
        return <sphereGeometry args={[0.5, 8, 8]} />;
    }
  };

  const getNodeColor = (type: string, status: string) => {
    if (status === "warning") return "#ffaa00";
    if (status === "maintenance") return "#666666";
    if (status === "error") return "#ff0000";

    switch (type) {
      case "core":
        return "#ff6600";
      case "aggregation":
        return "#0066ff";
      case "access":
        return "#00ff66";
      default:
        return "#ffffff";
    }
  };

  return (
    <group ref={networkRef} position={[0, 0, 0]}>
      {networkLayers.map((layer, layerIndex) => (
        <group key={layerIndex}>
          {/* 层标识 */}
          <Text
            position={[0, layer.height + 3, 0]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {layer.name}
          </Text>

          {/* 层级圆环 */}
          <mesh position={[0, layer.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[layer.radius - 0.5, layer.radius + 0.5, 32]} />
            <meshBasicMaterial color="#333333" transparent opacity={0.3} />
          </mesh>

          {/* 网络节点 */}
          {layer.nodes.map((node, nodeIndex) => {
            const x = Math.cos(node.angle) * layer.radius;
            const z = Math.sin(node.angle) * layer.radius;
            return (
              <group key={nodeIndex} position={[x, layer.height, z]}>
                {/* 节点主体 */}
                <mesh>
                  {getNodeGeometry(node.type)}
                  <meshStandardMaterial
                    color={getNodeColor(node.type, node.status)}
                    emissive={getNodeColor(node.type, node.status)}
                    emissiveIntensity={0.2}
                  />
                </mesh>

                {/* 节点名称 */}
                <Text
                  position={[0, 2, 0]}
                  fontSize={0.3}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {node.name}
                </Text>

                {/* 状态指示器 */}
                <mesh position={[0, -1.5, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
                  <meshBasicMaterial
                    color={getNodeColor(node.type, node.status)}
                  />
                </mesh>

                {/* 连接线到中心 */}
                {layerIndex > 0 && (
                  <Line
                    points={[
                      new Vector3(0, 0, 0),
                      new Vector3(
                        -x / 2,
                        networkLayers[layerIndex - 1].height - layer.height,
                        -z / 2,
                      ),
                    ]}
                    color="#00aaff"
                    lineWidth={2}
                    transparent
                    opacity={0.6}
                  />
                )}

                {/* 数据流动效果 */}
                <mesh position={[0, 0.5, 0]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.7}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// 增强的安全事件时间轴
function SecurityEventTimeline() {
  const timelineRef = useRef<Group>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const securityEvents = useMemo(() => {
    const now = new Date();
    return [
      {
        time: new Date(now.getTime() - 5 * 60000),
        type: "threat_detected",
        severity: "high",
        title: "DDoS攻击检测",
        description: "检测到来自多个IP的DDoS攻击",
        source: "防火墙系统",
      },
      {
        time: new Date(now.getTime() - 12 * 60000),
        type: "malware_blocked",
        severity: "medium",
        title: "恶意软件拦截",
        description: "成功拦截恶意软件下载",
        source: "端点保护",
      },
      {
        time: new Date(now.getTime() - 18 * 60000),
        type: "access_violation",
        severity: "high",
        title: "异常访问尝试",
        description: "检测到可疑的权限提升尝试",
        source: "访问控制",
      },
      {
        time: new Date(now.getTime() - 25 * 60000),
        type: "data_exfiltration",
        severity: "critical",
        title: "数据泄露风险",
        description: "检测到异常的大量数据传输",
        source: "数据保护",
      },
      {
        time: new Date(now.getTime() - 35 * 60000),
        type: "phishing_detected",
        severity: "medium",
        title: "钓鱼邮件拦截",
        description: "成功拦截钓鱼邮件攻击",
        source: "邮件安全",
      },
      {
        time: new Date(now.getTime() - 42 * 60000),
        type: "system_anomaly",
        severity: "low",
        title: "系统异常",
        description: "检测到系统性能异常",
        source: "监控系统",
      },
      {
        time: new Date(now.getTime() - 50 * 60000),
        type: "vulnerability_scan",
        severity: "info",
        title: "漏洞扫描完成",
        description: "定期漏洞扫描已完成",
        source: "漏洞管理",
      },
    ];
  }, [currentTime]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff0000";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffaa00";
      case "low":
        return "#00aaff";
      case "info":
        return "#00ff88";
      default:
        return "#888888";
    }
  };

  useFrame((state) => {
    if (timelineRef.current) {
      const time = state.clock.getElapsedTime();
      // 时间轴脉冲效果
      timelineRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
    }
  });

  return (
    <group ref={timelineRef} position={[80, 0, 0]}>
      {/* 时间轴主体 */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 40, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* 时间轴标题 */}
      <Text
        position={[0, 22, 0]}
        fontSize={1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        安全事件时间轴
      </Text>

      {/* 当前时间显示 */}
      <Html position={[0, 25, 0]} transform>
        <div className="bg-black/80 text-white p-2 rounded text-sm">
          当前时间: {currentTime.toLocaleString()}
        </div>
      </Html>

      {/* 安全事件 */}
      {securityEvents.map((event, index) => {
        const y = 15 - index * 5;
        const side = index % 2 === 0 ? 1 : -1;
        const x = side * 8;

        return (
          <group key={index} position={[x, y, 0]}>
            {/* 事件标记 */}
            <mesh position={[-x, 0, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial
                color={getSeverityColor(event.severity)}
                emissive={getSeverityColor(event.severity)}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* 连接线 */}
            <Line
              points={[new Vector3(-x, 0, 0), new Vector3(0, 0, 0)]}
              color={getSeverityColor(event.severity)}
              lineWidth={3}
              transparent
              opacity={0.7}
            />

            {/* 事件信息面板 */}
            <Html transform>
              <div
                className="bg-black/90 text-white p-3 rounded border-l-4 min-w-64"
                style={{ borderLeftColor: getSeverityColor(event.severity) }}
              >
                <div className="font-bold text-sm mb-1">{event.title}</div>
                <div className="text-xs text-gray-300 mb-2">
                  {event.time.toLocaleTimeString()}
                </div>
                <div className="text-xs mb-2">{event.description}</div>
                <div className="text-xs text-blue-300">
                  来源: {event.source}
                </div>
                <div
                  className="inline-block px-2 py-1 rounded text-xs mt-2"
                  style={{
                    backgroundColor: getSeverityColor(event.severity) + "20",
                    color: getSeverityColor(event.severity),
                  }}
                >
                  {event.severity.toUpperCase()}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// 系统资源监控可视化
function SystemResourceMonitor() {
  const monitorRef = useRef<Group>(null);
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const resourceTypes = useMemo(
    () => [
      {
        name: "CPU",
        icon: "Cpu",
        value: realTimeData?.cpuUsage || 45,
        max: 100,
        color: "#ff6600",
        position: [0, 0, 15] as [number, number, number],
      },
      {
        name: "内存",
        icon: "MemoryStick",
        value: realTimeData?.memoryUsage || 68,
        max: 100,
        color: "#0066ff",
        position: [15, 0, 0] as [number, number, number],
      },
      {
        name: "存储",
        icon: "HardDrive",
        value: realTimeData?.diskUsage || 72,
        max: 100,
        color: "#00ff66",
        position: [0, 0, -15] as [number, number, number],
      },
      {
        name: "网络",
        icon: "Network",
        value: realTimeData?.networkUsage || 34,
        max: 100,
        color: "#ff00aa",
        position: [-15, 0, 0] as [number, number, number],
      },
      {
        name: "GPU",
        icon: "Monitor",
        value: realTimeData?.gpuUsage || 56,
        max: 100,
        color: "#aaff00",
        position: [10, 0, 10] as [number, number, number],
      },
      {
        name: "带宽",
        icon: "Wifi",
        value: realTimeData?.bandwidthUsage || 42,
        max: 100,
        color: "#00aaff",
        position: [-10, 0, 10] as [number, number, number],
      },
    ],
    [realTimeData],
  );

  useFrame((state) => {
    if (monitorRef.current) {
      const time = state.clock.getElapsedTime();
      monitorRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={monitorRef} position={[-80, 0, 0]}>
      {/* 中央监控hub */}
      <mesh>
        <cylinderGeometry args={[3, 3, 2, 32]} />
        <meshStandardMaterial color="#222222" metalness={0.8} />
      </mesh>

      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        系统资源监控
      </Text>

      {resourceTypes.map((resource, index) => {
        const percentage = (resource.value / resource.max) * 100;
        const height = (percentage / 100) * 10;

        return (
          <group key={index} position={resource.position}>
            {/* 资源柱状图 */}
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[1, 1, height, 16]} />
              <meshStandardMaterial
                color={resource.color}
                emissive={resource.color}
                emissiveIntensity={0.1}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* 基座 */}
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[1.2, 1.2, 1, 16]} />
              <meshStandardMaterial color="#333333" />
            </mesh>

            {/* 资源名称 */}
            <Text
              position={[0, 11, 0]}
              fontSize={0.5}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {resource.name}
            </Text>

            {/* 数值显示 */}
            <Html position={[0, height + 1, 0]} transform>
              <div className="bg-black/80 text-white p-2 rounded text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: resource.color }}
                >
                  {resource.value}%
                </div>
                <div className="text-xs">负载率</div>
              </div>
            </Html>

            {/* 连接线到中心 */}
            <Line
              points={[
                new Vector3(0, 0, 0),
                new Vector3(
                  -resource.position[0] / 3,
                  1,
                  -resource.position[2] / 3,
                ),
              ]}
              color={resource.color}
              lineWidth={2}
              transparent
              opacity={0.5}
            />

            {/* 警报指示器 */}
            {percentage > 80 && (
              <mesh position={[0, height + 2, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color="#ff0000" />
                <pointLight color="#ff0000" intensity={0.5} distance={5} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// 主3D场景组件
function Main3DScene() {
  const sceneRef = useRef<Group>(null);

  return (
    <group ref={sceneRef}>
      {/* 增强的环境光照系统 */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight
        position={[50, 50, 50]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 20, 0]} intensity={1.2} color="#0088ff" />
      <pointLight position={[30, 15, 30]} intensity={0.8} color="#ff8800" />
      <pointLight position={[-30, 15, -30]} intensity={0.8} color="#88ff00" />
      <pointLight position={[0, 10, -40]} intensity={1.5} color="#ff8800" />
      <spotLight
        position={[0, 40, 0]}
        angle={Math.PI / 6}
        intensity={2}
        color="#ffffff"
        castShadow
      />

      {/* 中央监控模型 */}
      <SituationMonitoringModel realTimeData={generateSituationData()} />

      {/* 优化的背景城市建筑群 */}
      <OptimizedCityBuildings />

      {/* 增强的数据中心系统 */}
      <EnhancedDataCenterRacks />

      {/* 高级卫星通信系统 */}
      <AdvancedSatelliteSystem />

      {/* 智能交通网络 */}
      <IntelligentTrafficNetwork />

      {/* 高级网络拓扑 */}
      <AdvancedNetworkTopology />

      {/* 安全事件时间轴 */}
      <SecurityEventTimeline />

      {/* 系统资源监控 */}
      <SystemResourceMonitor />

      {/* 优化的基础平台系统 */}
      <mesh position={[0, -3, 0]} receiveShadow>
        <cylinderGeometry args={[120, 120, 1, 128]} />
        <meshStandardMaterial
          color="#0a0a0a"
          transparent
          opacity={0.4}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[0, -2.5, 0]} receiveShadow>
        <cylinderGeometry args={[100, 100, 0.5, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          transparent
          opacity={0.5}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[80, 80, 0.3, 32]} />
        <meshStandardMaterial
          color="#2a2a2a"
          transparent
          opacity={0.6}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* 多层网格系统 */}
      <gridHelper
        args={[200, 200, "#333333", "#1a1a1a"]}
        position={[0, -2.9, 0]}
      />
      <gridHelper
        args={[160, 160, "#444444", "#2a2a2a"]}
        position={[0, -2.8, 0]}
      />
      <gridHelper
        args={[120, 120, "#555555", "#3a3a3a"]}
        position={[0, -2.7, 0]}
      />
      <gridHelper
        args={[80, 80, "#666666", "#4a4a4a"]}
        position={[0, -2.6, 0]}
      />

      {/* 增强的边界防护系统 */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const radius = 90 + Math.sin(i * 0.5) * 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const height = 6 + Math.sin(i * 0.3) * 2;

        return (
          <group key={i} position={[x, height / 2, z]}>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, height, 8]} />
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={0.3}
                transparent
                opacity={0.7}
              />
            </mesh>
            <pointLight
              position={[0, height / 2, 0]}
              intensity={0.2}
              color="#00f5ff"
              distance={8}
            />
          </group>
        );
      })}

      {/* 天空球和星空 */}
      <Stars
        radius={300}
        depth={50}
        count={30000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <mesh position={[0, 50, 0]}>
        <sphereGeometry args={[250, 64, 64]} />
        <meshBasicMaterial
          color="#000a1a"
          transparent
          opacity={0.15}
          side={2}
        />
      </mesh>

      {/* 大气层效果 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial
          color="#004466"
          transparent
          opacity={0.05}
          side={2}
        />
      </mesh>
    </group>
  );
}

// 超级增强的顶部控制栏
function SuperEnhancedTopControlBar() {
  const navigate = useNavigate();
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const viewModes = [
    { id: "overview", name: "总览", icon: Monitor },
    { id: "network", name: "网络", icon: Network },
    { id: "security", name: "安全", icon: Shield },
    { id: "performance", name: "性能", icon: Activity },
    { id: "infrastructure", name: "基础设施", icon: Server },
    { id: "analytics", name: "分析", icon: BarChart3 },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/98 via-matrix-surface/95 to-matrix-surface/98 backdrop-blur-xl border-b-3 border-matrix-border shadow-2xl">
      {/* 主控制栏 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* 左侧控制区 */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-matrix-accent/50 to-matrix-accent/70 hover:from-matrix-accent/70 hover:to-matrix-accent/90 rounded-lg transition-all duration-300 text-white border border-matrix-border shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">返回</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Globe className="w-8 h-8 text-neon-blue animate-pulse" />
                <div className="absolute inset-0 animate-ping opacity-30">
                  <Globe className="w-8 h-8 text-neon-blue" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-neon-blue via-neon-green to-neon-purple bg-clip-text text-transparent">
                  CyberGuard 3D 态势感知平台
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  Advanced Network Security Situation Awareness Platform
                </p>
              </div>
            </div>
          </div>

          {/* 中央状态监控 */}
          <div className="flex items-center space-x-6">
            <div className="grid grid-cols-3 gap-4 bg-matrix-accent/20 rounded-lg p-3 border border-matrix-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  系统状态
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-neon-green font-bold text-sm">
                    在线
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  活跃威胁
                </div>
                <div className="text-threat-high font-bold text-lg">
                  {realTimeData?.realTimeThreats || 3}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">已拦截</div>
                <div className="text-neon-green font-bold text-lg">
                  {Math.floor(
                    ((realTimeData?.blockedAttacks || 1247) / 1000) * 10,
                  )}
                  K
                </div>
              </div>
            </div>

            <div className="bg-matrix-accent/20 rounded-lg p-3 border border-matrix-border">
              <div className="text-xs text-muted-foreground mb-1">当前时间</div>
              <div className="text-white font-mono text-sm">
                {currentTime.toLocaleString("zh-CN")}
              </div>
            </div>
          </div>

          {/* 右侧控制区 */}
          <div className="flex items-center space-x-4">
            {/* 视图模式选择 */}
            <div className="flex bg-matrix-accent/20 rounded-lg border border-matrix-border">
              {viewModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-2 text-xs font-medium transition-all duration-200 ${
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

            {/* 控制按钮 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-matrix-accent/30 hover:bg-matrix-accent/50 rounded-lg transition-all duration-200 text-white border border-matrix-border"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-matrix-accent/30 hover:bg-matrix-accent/50 rounded-lg transition-all duration-200 text-white border border-matrix-border"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷状态栏 */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-6">
            <span>CPU: {realTimeData?.cpuUsage || 45}%</span>
            <span>内存: {realTimeData?.memoryUsage || 68}%</span>
            <span>网络: {realTimeData?.networkUsage || 34}%</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>在线用户: {realTimeData?.onlineUsers || 1247}</span>
            <span>数据包/秒: {realTimeData?.packetsPerSecond || 85432}</span>
            <span>响应时间: {realTimeData?.responseTime || 12}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 增强的底部状态栏
function EnhancedBottomStatusBar() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const statusItems = [
    {
      label: "网络健康",
      value: "98.7%",
      status: "good",
      icon: Network,
    },
    {
      label: "安全等级",
      value: "高",
      status: "good",
      icon: Shield,
    },
    {
      label: "系统负载",
      value: `${realTimeData?.cpuUsage || 45}%`,
      status: "warning",
      icon: Activity,
    },
    {
      label: "连接数",
      value: "8,247",
      status: "good",
      icon: Users,
    },
    {
      label: "存储",
      value: `${realTimeData?.diskUsage || 72}%`,
      status: "warning",
      icon: HardDrive,
    },
    {
      label: "延迟",
      value: "12ms",
      status: "good",
      icon: Zap,
    },
    {
      label: "带宽",
      value: "2.4GB/s",
      status: "good",
      icon: Wifi,
    },
    {
      label: "安全事件",
      value: "7",
      status: "alert",
      icon: AlertTriangle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-neon-green";
      case "warning":
        return "text-yellow-400";
      case "alert":
        return "text-threat-high";
      default:
        return "text-white";
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-matrix-surface/98 via-matrix-surface/95 to-matrix-surface/98 backdrop-blur-xl border-t border-matrix-border">
      <div className="p-4">
        <div className="grid grid-cols-8 gap-4">
          {statusItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-matrix-accent/20 rounded-lg p-3 border border-matrix-border text-center"
              >
                <IconComponent
                  className={`w-4 h-4 mx-auto mb-1 ${getStatusColor(item.status)}`}
                />
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
                <div
                  className={`text-sm font-bold ${getStatusColor(item.status)}`}
                >
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 主要态势显示组件
export default function SituationDisplay() {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* 超级增强的顶部控制栏 */}
      <SuperEnhancedTopControlBar />

      {/* 主3D Canvas */}
      <div className="absolute inset-0 pt-24 pb-20">
        <ThreeErrorBoundary>
          <Canvas
            shadows
            camera={{
              position: [0, 25, 50],
              fov: 60,
              near: 0.1,
              far: 1000,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <Main3DScene />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={10}
                maxDistance={200}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
              />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* 增强的底部状态栏 */}
      <EnhancedBottomStatusBar />
    </div>
  );
}
