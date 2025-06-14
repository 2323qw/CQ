import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Mesh,
  Group,
  Vector3,
  Color,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  AdditiveBlending,
  DoubleSide,
} from "three";
import { Text, Line } from "@react-three/drei";

// 中央控制台组件
function CentralControlHub({ realTimeData }: { realTimeData: any }) {
  const hubRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (hubRef.current) {
      const time = state.clock.getElapsedTime();
      hubRef.current.rotation.y = time * 0.1;

      if (coreRef.current) {
        const pulse = 1 + Math.sin(time * 3) * 0.15;
        coreRef.current.scale.setScalar(pulse);
      }
    }
  });

  return (
    <group ref={hubRef}>
      {/* 中央控制核心 */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.8, 1.2, 0.5, 8]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 控制台环 */}
      <mesh>
        <torusGeometry args={[1.5, 0.1, 8, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 数据端口 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]}
          >
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00ff88" : "#ff6b00"}
              emissive={i % 2 === 0 ? "#00ff88" : "#ff6b00"}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 活跃连接监控塔
function ActiveConnectionTower({ realTimeData }: { realTimeData: any }) {
  const towerRef = useRef<Group>(null);

  useFrame((state) => {
    if (towerRef.current) {
      const time = state.clock.getElapsedTime();
      towerRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
  });

  const connections = realTimeData?.activeConnections || 1247;
  const connectionLevels = Math.min(Math.floor(connections / 200), 10);

  return (
    <group ref={towerRef} position={[4, 0, 0]}>
      {/* 主塔结构 */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.4, 2, 6]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 连接等级指示器 */}
      {Array.from({ length: connectionLevels }).map((_, i) => (
        <mesh key={i} position={[0, -0.8 + i * 0.2, 0]}>
          <ringGeometry args={[0.5 + i * 0.1, 0.6 + i * 0.1, 16]} />
          <meshBasicMaterial
            color="#00f5ff"
            transparent
            opacity={1 - i * 0.08}
            side={DoubleSide}
          />
        </mesh>
      ))}

      {/* 连接数显示 */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.15}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
      >
        活跃连接
      </Text>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {connections.toLocaleString()}
      </Text>

      {/* 信号塔天线 */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 实时威胁监控球
function ThreatMonitoringSphere({ realTimeData }: { realTimeData: any }) {
  const sphereRef = useRef<Group>(null);
  const threatSphereRef = useRef<Mesh>(null);

  const threats = realTimeData?.realTimeThreats || 3;

  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.getElapsedTime();
      sphereRef.current.rotation.x = time * 0.3;
      sphereRef.current.rotation.z = time * 0.2;

      if (threatSphereRef.current) {
        const threatIntensity = Math.min(threats / 10, 1);
        threatSphereRef.current.material.emissiveIntensity =
          0.3 + threatIntensity * 0.5;
      }
    }
  });

  const getThreatColor = () => {
    if (threats > 20) return "#ff0033";
    if (threats > 10) return "#ff6600";
    if (threats > 5) return "#ffaa00";
    return "#00ff88";
  };

  return (
    <group ref={sphereRef} position={[-4, 2, 0]}>
      {/* 威胁监控球体 */}
      <mesh ref={threatSphereRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color={getThreatColor()}
          emissive={getThreatColor()}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>

      {/* 威胁等级环 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[(Math.PI / 3) * i, (Math.PI / 4) * i, (Math.PI / 6) * i]}
        >
          <torusGeometry args={[1 + i * 0.3, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={getThreatColor()}
            emissive={getThreatColor()}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* 威胁数量显示 */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.15}
        color={getThreatColor()}
        anchorX="center"
        anchorY="middle"
      >
        实时威胁
      </Text>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {threats}
      </Text>
    </group>
  );
}

// 系统性能监控柱
function SystemPerformanceColumns({ realTimeData }: { realTimeData: any }) {
  const columnsRef = useRef<Group>(null);

  const cpuUsage = realTimeData?.cpuUsage || 68;
  const memoryUsage = realTimeData?.memoryUsage || 72;
  const diskUsage = realTimeData?.diskUsage || 45;

  const metrics = [
    { label: "CPU", value: cpuUsage, color: "#ff6b00", position: [-1, 0, 4] },
    {
      label: "内存",
      value: memoryUsage,
      color: "#00f5ff",
      position: [0, 0, 4],
    },
    { label: "磁盘", value: diskUsage, color: "#00ff88", position: [1, 0, 4] },
  ];

  useFrame((state) => {
    if (columnsRef.current) {
      const time = state.clock.getElapsedTime();
      columnsRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y = Math.sin(time * 2 + index) * 0.02;
        }
      });
    }
  });

  return (
    <group ref={columnsRef}>
      {metrics.map((metric, index) => {
        const height = (metric.value / 100) * 2 + 0.5;
        return (
          <group
            key={index}
            position={metric.position as [number, number, number]}
          >
            {/* 性能柱 */}
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, height, 8]} />
              <meshStandardMaterial
                color={metric.color}
                emissive={metric.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* 基座 */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>

            {/* 标签 */}
            <Text
              position={[0, height + 0.3, 0]}
              fontSize={0.12}
              color={metric.color}
              anchorX="center"
              anchorY="middle"
            >
              {metric.label}
            </Text>
            <Text
              position={[0, height + 0.1, 0]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {metric.value}%
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// 防火墙连接堡垒
function FirewallFortress({ realTimeData }: { realTimeData: any }) {
  const fortressRef = useRef<Group>(null);

  const blockedAttacks = realTimeData?.blockedAttacks || 1247;
  const firewallStatus =
    realTimeData?.networkStatus === "正常" ? "active" : "warning";

  useFrame((state) => {
    if (fortressRef.current) {
      const time = state.clock.getElapsedTime();
      fortressRef.current.rotation.y = time * 0.05;
    }
  });

  const getFirewallColor = () => {
    return firewallStatus === "active" ? "#00ff88" : "#ffaa00";
  };

  return (
    <group ref={fortressRef} position={[0, 0, -4]}>
      {/* 防火墙主堡 */}
      <mesh>
        <boxGeometry args={[1.5, 1.8, 1.5]} />
        <meshStandardMaterial
          color={getFirewallColor()}
          emissive={getFirewallColor()}
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 防火墙塔楼 */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        return (
          <mesh key={i} position={[x, 1.2, z]}>
            <cylinderGeometry args={[0.2, 0.3, 0.8, 6]} />
            <meshStandardMaterial
              color={getFirewallColor()}
              emissive={getFirewallColor()}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}

      {/* 防护屏障 */}
      <mesh>
        <torusGeometry args={[2, 0.05, 8, 32]} />
        <meshStandardMaterial
          color={getFirewallColor()}
          emissive={getFirewallColor()}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 防火墙状态显示 */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.15}
        color={getFirewallColor()}
        anchorX="center"
        anchorY="middle"
      >
        防火墙系统
      </Text>
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        已拦截: {blockedAttacks.toLocaleString()}
      </Text>
    </group>
  );
}

// 网络流量可视化
function NetworkTrafficFlow({ realTimeData }: { realTimeData: any }) {
  const trafficRef = useRef<Group>(null);
  const packetsRef = useRef<Mesh[]>([]);

  const inboundTraffic = realTimeData?.inboundTraffic || 85;
  const outboundTraffic = realTimeData?.outboundTraffic || 92;

  // 流量数据包路径
  const trafficPaths = useMemo(() => {
    return [
      // 入站流量路径
      ...Array.from({ length: Math.floor(inboundTraffic / 20) }, (_, i) => ({
        start: [-8, Math.random() * 2 - 1, Math.random() * 2 - 1] as [
          number,
          number,
          number,
        ],
        end: [0, 0, 0] as [number, number, number],
        color: "#00f5ff",
        speed: 0.8 + Math.random() * 0.4,
        type: "inbound",
      })),
      // 出站流量路径
      ...Array.from({ length: Math.floor(outboundTraffic / 20) }, (_, i) => ({
        start: [0, 0, 0] as [number, number, number],
        end: [8, Math.random() * 2 - 1, Math.random() * 2 - 1] as [
          number,
          number,
          number,
        ],
        color: "#ff6b00",
        speed: 0.8 + Math.random() * 0.4,
        type: "outbound",
      })),
    ];
  }, [inboundTraffic, outboundTraffic]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    packetsRef.current.forEach((packet, index) => {
      if (packet && trafficPaths[index]) {
        const path = trafficPaths[index];
        const progress = (Math.sin(time * path.speed + index * 0.5) + 1) / 2;

        packet.position.lerpVectors(
          new Vector3(...path.start),
          new Vector3(...path.end),
          progress,
        );
      }
    });
  });

  return (
    <group ref={trafficRef} position={[0, -2, 0]}>
      {/* 流量路径线 */}
      {trafficPaths.map((path, index) => (
        <Line
          key={index}
          points={[new Vector3(...path.start), new Vector3(...path.end)]}
          color={path.color}
          lineWidth={1}
          transparent
          opacity={0.3}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      ))}

      {/* 移动的数据包 */}
      {trafficPaths.map((path, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) packetsRef.current[index] = el;
          }}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color={path.color} />
        </mesh>
      ))}

      {/* 流量统计显示 */}
      <group position={[-6, 2, 0]}>
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.12}
          color="#00f5ff"
          anchorX="center"
          anchorY="middle"
        >
          入站流量
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {inboundTraffic} MB/s
        </Text>
      </group>

      <group position={[6, 2, 0]}>
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.12}
          color="#ff6b00"
          anchorX="center"
          anchorY="middle"
        >
          出站流量
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {outboundTraffic} MB/s
        </Text>
      </group>
    </group>
  );
}

// 环境粒子效果
function EnvironmentParticles() {
  const particlesRef = useRef<Points>(null);

  const particleSystem = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new Color("#00f5ff"),
      new Color("#ff6b00"),
      new Color("#00ff88"),
      new Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 空间分布
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
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
      const time = state.clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.005;
      particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.01;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleSystem}>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 主要的态势监控模型
export function SituationMonitoringModel({
  realTimeData,
}: {
  realTimeData: any;
}) {
  const mainGroupRef = useRef<Group>(null);

  useFrame((state) => {
    if (mainGroupRef.current) {
      // 非常缓慢的整体旋转
      mainGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 光照系统 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 8, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[8, 4, 8]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[-8, 4, -8]} intensity={1.5} color="#ff6b00" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#00ff88" />

      {/* 中央控制台 */}
      <CentralControlHub realTimeData={realTimeData} />

      {/* 活跃连接监控塔 */}
      <ActiveConnectionTower realTimeData={realTimeData} />

      {/* 实时威胁监控球 */}
      <ThreatMonitoringSphere realTimeData={realTimeData} />

      {/* 系统性能监控柱 */}
      <SystemPerformanceColumns realTimeData={realTimeData} />

      {/* 防火墙连接堡垒 */}
      <FirewallFortress realTimeData={realTimeData} />

      {/* 网络流量可视化 */}
      <NetworkTrafficFlow realTimeData={realTimeData} />

      {/* 环境粒子效果 */}
      <EnvironmentParticles />

      {/* 基础平台 */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[12, 12, 0.2, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* 扫描线 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[10, 10.1, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
