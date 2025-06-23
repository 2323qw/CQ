import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Mesh,
  Group,
  Vector3,
  Color,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  AdditiveBlending,
} from "three";
import {
  Text,
  Line,
  Sphere,
  Box,
  Torus,
  Octahedron,
  Tetrahedron,
} from "@react-three/drei";

// 全息数据流组件
function HolographicDataStream({
  startPos,
  endPos,
  color = "#00f5ff",
  speed = 1,
}: {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color?: string;
  speed?: number;
}) {
  const dataRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (dataRef.current && groupRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      const progress = (Math.sin(time) + 1) / 2;

      // 数据包在起点和终点之间移动
      const currentPos = new Vector3(
        startPos[0] + (endPos[0] - startPos[0]) * progress,
        startPos[1] + (endPos[1] - startPos[1]) * progress,
        startPos[2] + (endPos[2] - startPos[2]) * progress,
      );

      dataRef.current.position.copy(currentPos);

      // 数据包旋转
      dataRef.current.rotation.y += 0.05;
      dataRef.current.rotation.x += 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 数据流路径 */}
      <Line
        points={[new Vector3(...startPos), new Vector3(...endPos)]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.4}
        dashed
        dashSize={0.1}
        gapSize={0.1}
      />

      {/* 移动的数据包 */}
      <mesh ref={dataRef}>
        <octahedronGeometry args={[0.05, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// 量子防护盾组件
function QuantumShield({
  radius = 3,
  segments = 32,
}: {
  radius?: number;
  segments?: number;
}) {
  const shieldRef = useRef<Group>(null);
  const innerShieldRef = useRef<Mesh>(null);
  const outerShieldRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (shieldRef.current) {
      const time = state.clock.getElapsedTime();
      shieldRef.current.rotation.y = time * 0.3;

      if (innerShieldRef.current) {
        innerShieldRef.current.rotation.y = -time * 0.5;
        innerShieldRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      }

      if (outerShieldRef.current) {
        outerShieldRef.current.rotation.y = time * 0.2;
        outerShieldRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
      }
    }
  });

  return (
    <group ref={shieldRef}>
      {/* 外层量子盾 */}
      <mesh ref={outerShieldRef}>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* 内层能量盾 */}
      <mesh ref={innerShieldRef}>
        <icosahedronGeometry args={[radius * 0.8, 2]} />
        <meshStandardMaterial
          color="#ff6b00"
          emissive="#ff6b00"
          emissiveIntensity={0.4}
          transparent
          opacity={0.15}
          side={2}
        />
      </mesh>

      {/* 量子环 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[(Math.PI / 3) * i, (Math.PI / 6) * i, 0]}>
          <torusGeometry args={[radius * 1.2, 0.02, 8, 32]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// 全息显示器组件
function HolographicDisplay({
  position,
  rotation = [0, 0, 0],
  text,
  color = "#00f5ff",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  text: string;
  color?: string;
}) {
  const displayRef = useRef<Group>(null);

  useFrame((state) => {
    if (displayRef.current) {
      const time = state.clock.getElapsedTime();
      displayRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={displayRef} position={position} rotation={rotation}>
      {/* 全息屏幕背景 */}
      <mesh>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
          side={2}
        />
      </mesh>

      {/* 全息边框 */}
      <Line
        points={[
          new Vector3(-0.75, -0.4, 0.01),
          new Vector3(0.75, -0.4, 0.01),
          new Vector3(0.75, 0.4, 0.01),
          new Vector3(-0.75, 0.4, 0.01),
          new Vector3(-0.75, -0.4, 0.01),
        ]}
        color={color}
        lineWidth={3}
      />

      {/* 全息文字 */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron-regular.woff"
      >
        {text}
      </Text>
    </group>
  );
}

// 网络节点集群
function NetworkNodeCluster() {
  const clusterRef = useRef<Group>(null);

  const nodes = useMemo(() => {
    const nodeArray = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 4;
      nodeArray.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 0.5,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        color: i % 3 === 0 ? "#ff6b00" : i % 3 === 1 ? "#00f5ff" : "#00ff88",
      });
    }
    return nodeArray;
  }, []);

  useFrame((state) => {
    if (clusterRef.current) {
      clusterRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={clusterRef}>
      {nodes.map((node, index) => (
        <mesh key={index} position={node.position}>
          <tetrahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* 节点间连接线 */}
      {nodes.map((node, index) => (
        <Line
          key={`connection-${index}`}
          points={[new Vector3(0, 0, 0), new Vector3(...node.position)]}
          color="#ffffff"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

// 粒子系统组件
function ParticleSystem() {
  const particlesRef = useRef<Points>(null);

  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef} geometry={particles}>
      <pointsMaterial
        size={0.02}
        color="#00f5ff"
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 主要的高级网络安全模型组件
export function AdvancedCyberSecurityModel() {
  const mainGroupRef = useRef<Group>(null);

  useFrame((state) => {
    if (mainGroupRef.current) {
      // 整体缓慢旋转
      mainGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 环境光和聚光灯 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#00f5ff" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff6b00" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#00ff88" />

      {/* 中央量子防护盾 */}
      <QuantumShield radius={2.5} />

      {/* 网络节点集群 */}
      <NetworkNodeCluster />

      {/* 粒子系统背景 */}
      <ParticleSystem />

      {/* 全息数据流 */}
      <HolographicDataStream
        startPos={[3, 1, 0]}
        endPos={[-3, -1, 0]}
        color="#00f5ff"
        speed={1.5}
      />
      <HolographicDataStream
        startPos={[0, 3, 1]}
        endPos={[0, -3, -1]}
        color="#ff6b00"
        speed={1.2}
      />
      <HolographicDataStream
        startPos={[2, 0, 3]}
        endPos={[-2, 0, -3]}
        color="#00ff88"
        speed={1.8}
      />

      {/* 全息显示器 */}
      <HolographicDisplay
        position={[3.5, 2, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        text="FIREWALL ACTIVE"
        color="#00ff88"
      />
      <HolographicDisplay
        position={[-3.5, 1.5, 1]}
        rotation={[0, Math.PI / 4, 0]}
        text="THREATS: 0"
        color="#00f5ff"
      />
      <HolographicDisplay
        position={[0, 3.5, 2]}
        rotation={[-Math.PI / 6, 0, 0]}
        text="SYSTEM SECURE"
        color="#ff6b00"
      />

      {/* 外层防护环 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[(Math.PI / 4) * i, (Math.PI / 6) * i, (Math.PI / 8) * i]}
        >
          <torusGeometry args={[5, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#00f5ff" : "#ff6b00"}
            emissive={i % 2 === 0 ? "#00f5ff" : "#ff6b00"}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* 中央核心 */}
      <mesh>
        <octahedronGeometry args={[0.3, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 扫描线效果 */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[6, 6.1, 64]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}
