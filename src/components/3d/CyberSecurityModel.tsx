import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, Vector3, Color } from "three";
import { Text, Line, Sphere, Box } from "@react-three/drei";

// 网络节点组件
function NetworkNode({
  position,
  color = "#00f5ff",
  size = 0.15,
  isCore = false,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
  isCore?: boolean;
}) {
  const nodeRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (nodeRef.current) {
      const time = state.clock.getElapsedTime();
      const pulseScale = 1 + Math.sin(time * 3) * 0.2;
      nodeRef.current.scale.setScalar(isCore ? pulseScale * 1.5 : pulseScale);
    }
  });

  return (
    <mesh ref={nodeRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isCore ? 0.8 : 0.5}
        transparent
        opacity={0.8}
      />
      {/* 节点光环 */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </mesh>
  );
}

// 数据流连线组件
function DataConnection({
  start,
  end,
  color = "#39ff14",
}: {
  start: Vector3;
  end: Vector3;
  color?: string;
}) {
  const lineRef = useRef<Group>(null);

  const points = useMemo(() => [start, end], [start, end]);

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.getElapsedTime();
      lineRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={lineRef}>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      {/* 数据包动画 */}
      <mesh
        position={[
          start.x +
            ((end.x - start.x) * (Math.sin(Date.now() * 0.002) + 1)) / 2,
          start.y +
            ((end.y - start.y) * (Math.sin(Date.now() * 0.002) + 1)) / 2,
          start.z +
            ((end.z - start.z) * (Math.sin(Date.now() * 0.002) + 1)) / 2,
        ]}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

// 防护盾牌组件
function SecurityShield() {
  const shieldRef = useRef<Mesh>(null);
  const ringsRef = useRef<Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (shieldRef.current) {
      shieldRef.current.rotation.y = time * 0.3;
      shieldRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        ring.rotation.x = time * (0.5 + index * 0.2);
        ring.rotation.y = time * (0.3 + index * 0.1);
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 主盾牌 */}
      <mesh ref={shieldRef}>
        <cylinderGeometry args={[1.5, 1.8, 0.2, 8]} />
        <meshStandardMaterial
          color="#001144"
          metalness={0.9}
          roughness={0.1}
          emissive="#002288"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 防护环 */}
      <group ref={ringsRef}>
        {[2.2, 2.8, 3.4].map((radius, index) => (
          <mesh key={index}>
            <torusGeometry args={[radius, 0.08, 8, 32]} />
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={0.6}
              transparent
              opacity={0.7 - index * 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* 中心核心 */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// 威胁检测雷达
function ThreatRadar() {
  const radarRef = useRef<Group>(null);
  const scanLineRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (radarRef.current) {
      radarRef.current.rotation.y = time * 0.8;
    }

    if (scanLineRef.current) {
      scanLineRef.current.rotation.y = time * 2;
    }
  });

  return (
    <group ref={radarRef} position={[3, 2, -2]}>
      {/* 雷达基座 */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#004400" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 雷达圆环 */}
      {[0.8, 1.2, 1.6].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.02, 32]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* 扫描线 */}
      <mesh ref={scanLineRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 0.05]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 威胁点 */}
      {[...Array(5)].map((_, index) => {
        const angle = (index / 5) * Math.PI * 2;
        const radius = 0.8 + Math.random() * 0.8;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#ff0040"
              emissive="#ff0040"
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 数据立方体网格
function DataCubes() {
  const cubesRef = useRef<Group>(null);

  useFrame((state) => {
    if (cubesRef.current) {
      const time = state.clock.getElapsedTime();
      cubesRef.current.children.forEach((cube, index) => {
        cube.rotation.x = time * (0.5 + index * 0.1);
        cube.rotation.y = time * (0.3 + index * 0.1);
        cube.position.y = Math.sin(time + index) * 0.2;
      });
    }
  });

  return (
    <group ref={cubesRef}>
      {[...Array(12)].map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = 4;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(index) * 0.5,
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color="#006666"
              emissive="#006666"
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 主要的网络安全3D模型
export function CyberSecurityModel() {
  const groupRef = useRef<Group>(null);

  // 定义网络节点位置
  const networkNodes = useMemo(
    () => [
      {
        position: [0, 0, 0] as [number, number, number],
        isCore: true,
        color: "#00f5ff",
      },
      { position: [-2, 1, -1] as [number, number, number], color: "#39ff14" },
      { position: [2, -1, 1] as [number, number, number], color: "#39ff14" },
      { position: [-1, -2, 2] as [number, number, number], color: "#39ff14" },
      { position: [1, 2, -2] as [number, number, number], color: "#39ff14" },
      { position: [-3, 0, 0] as [number, number, number], color: "#ffff00" },
      { position: [3, 0, 0] as [number, number, number], color: "#ffff00" },
    ],
    [],
  );

  // 定义连接线
  const connections = useMemo(
    () => [
      { start: new Vector3(0, 0, 0), end: new Vector3(-2, 1, -1) },
      { start: new Vector3(0, 0, 0), end: new Vector3(2, -1, 1) },
      { start: new Vector3(0, 0, 0), end: new Vector3(-1, -2, 2) },
      { start: new Vector3(0, 0, 0), end: new Vector3(1, 2, -2) },
      { start: new Vector3(-2, 1, -1), end: new Vector3(-3, 0, 0) },
      { start: new Vector3(2, -1, 1), end: new Vector3(3, 0, 0) },
    ],
    [],
  );

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 环境光和点光源 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#39ff14" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#ff6600" />

      {/* 主防护盾牌 */}
      <SecurityShield />

      {/* 网络节点 */}
      {networkNodes.map((node, index) => (
        <NetworkNode key={index} {...node} />
      ))}

      {/* 数据连接线 */}
      {connections.map((connection, index) => (
        <DataConnection key={index} {...connection} />
      ))}

      {/* 威胁检测雷达 */}
      <ThreatRadar />

      {/* 数据立方体网格 */}
      <DataCubes />

      {/* 系统标识文字 */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.5}
        color="#00f5ff"
        anchorX="center"
        anchorY="center"
      >
        CYBERGUARD
      </Text>

      <Text
        position={[0, -4.8, 0]}
        fontSize={0.2}
        color="#39ff14"
        anchorX="center"
        anchorY="center"
      >
        NETWORK SECURITY SYSTEM
      </Text>

      {/* 防护网格背景 */}
      <mesh position={[0, 0, -8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 20, 32, 32]} />
        <meshStandardMaterial
          color="#003366"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* 粒子效果背景 */}
      {[...Array(50)].map((_, index) => (
        <mesh
          key={index}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial
            color={Math.random() > 0.5 ? "#00f5ff" : "#39ff14"}
            emissive={Math.random() > 0.5 ? "#00f5ff" : "#39ff14"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* 雾效 */}
      <fog attach="fog" args={["#0d1117", 8, 25]} />
    </group>
  );
}
