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
  MathUtils,
  CylinderGeometry,
  SphereGeometry,
  RingGeometry,
} from "three";
import {
  Text,
  Line,
  Sphere,
  Cylinder,
  Torus,
  Icosahedron,
  MeshDistortMaterial,
  Float,
  Sparkles,
  Trail,
} from "@react-three/drei";

// 量子核心组件 - 性能优化版
function QuantumCore() {
  const coreRef = useRef<Group>(null);
  const innerCoreRef = useRef<Mesh>(null);
  const pulseRingRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const time = state.clock.getElapsedTime();

      // 缓慢旋转核心
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

      if (innerCoreRef.current) {
        // 内核脉冲效果
        const pulse = 1 + Math.sin(time * 4) * 0.15;
        innerCoreRef.current.scale.setScalar(pulse);
      }

      if (pulseRingRef.current) {
        // 脉冲环扩散效果
        const ringPulse = 1 + Math.sin(time * 3) * 0.2;
        pulseRingRef.current.scale.setScalar(ringPulse);
        pulseRingRef.current.material.opacity = 0.8 - (ringPulse - 1) * 2;
      }
    }
  });

  return (
    <group ref={coreRef}>
      {/* 主量子核心 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
        <mesh ref={innerCoreRef}>
          <Icosahedron args={[0.8, 2]}>
            <MeshDistortMaterial
              color="#ffffff"
              emissive="#00f5ff"
              emissiveIntensity={1.2}
              distort={0.3}
              speed={2}
              transparent
              opacity={0.9}
            />
          </Icosahedron>
        </mesh>
      </Float>

      {/* 能量脉冲环 */}
      <mesh ref={pulseRingRef}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.6}
          side={DoubleSide}
        />
      </mesh>

      {/* 量子粒子环绕 */}
      <Sparkles
        count={50}
        scale={[4, 4, 4]}
        size={3}
        speed={0.4}
        opacity={0.8}
        color="#00f5ff"
      />
    </group>
  );
}

// 防护矩阵系统
function DefenseMatrix() {
  const matrixRef = useRef<Group>(null);

  // 生成防护节点位置
  const nodePositions = useMemo(() => {
    const positions = [];
    const layers = 3;
    const nodesPerLayer = 8;

    for (let layer = 0; layer < layers; layer++) {
      const radius = 3 + layer * 1.5;
      for (let i = 0; i < nodesPerLayer; i++) {
        const angle = (i / nodesPerLayer) * Math.PI * 2;
        const y = (layer - 1) * 0.8;
        positions.push({
          position: [
            Math.cos(angle) * radius,
            y + Math.sin(angle * 2) * 0.3,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          color: layer === 0 ? "#ff6b00" : layer === 1 ? "#00f5ff" : "#00ff88",
          size: 0.15 - layer * 0.02,
        });
      }
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (matrixRef.current) {
      const time = state.clock.getElapsedTime();
      matrixRef.current.rotation.y = time * 0.1;
      matrixRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  });

  return (
    <group ref={matrixRef}>
      {nodePositions.map((node, index) => (
        <Float
          key={index}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.3}
        >
          <mesh position={node.position}>
            <sphereGeometry args={[node.size, 8, 8]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />

            {/* 节点光环 */}
            <mesh>
              <ringGeometry args={[node.size * 1.5, node.size * 2, 16]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.4}
                side={DoubleSide}
              />
            </mesh>
          </mesh>
        </Float>
      ))}

      {/* 连接线网络 */}
      {nodePositions.slice(0, 8).map((node, index) => {
        const nextIndex = (index + 1) % 8;
        const nextNode = nodePositions[nextIndex];
        return (
          <Line
            key={`connection-${index}`}
            points={[
              new Vector3(...node.position),
              new Vector3(...nextNode.position),
            ]}
            color="#ffffff"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
}

// 全息数据界面
function HolographicInterface() {
  const interfaceRef = useRef<Group>(null);

  const interfaces = useMemo(
    () => [
      {
        position: [4, 2, 0] as [number, number, number],
        rotation: [0, -Math.PI / 3, 0] as [number, number, number],
        text: "QUANTUM FIREWALL",
        subtext: "STATUS: ACTIVE",
        color: "#00ff88",
      },
      {
        position: [-4, 1.5, 1] as [number, number, number],
        rotation: [0, Math.PI / 3, 0] as [number, number, number],
        text: "THREAT ANALYSIS",
        subtext: "THREATS: 0",
        color: "#00f5ff",
      },
      {
        position: [0, 4, 3] as [number, number, number],
        rotation: [-Math.PI / 6, 0, 0] as [number, number, number],
        text: "NEURAL SHIELD",
        subtext: "INTEGRITY: 100%",
        color: "#ff6b00",
      },
    ],
    [],
  );

  useFrame((state) => {
    if (interfaceRef.current) {
      const time = state.clock.getElapsedTime();
      interfaceRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y += Math.sin(time * 2 + index) * 0.001;
        }
      });
    }
  });

  return (
    <group ref={interfaceRef}>
      {interfaces.map((ui, index) => (
        <Float
          key={index}
          speed={1.5}
          rotationIntensity={0.1}
          floatIntensity={0.1}
        >
          <group position={ui.position} rotation={ui.rotation}>
            {/* 全息屏幕背景 */}
            <mesh>
              <planeGeometry args={[2, 1.2]} />
              <meshBasicMaterial
                color={ui.color}
                transparent
                opacity={0.15}
                side={DoubleSide}
              />
            </mesh>

            {/* 屏幕边框 */}
            <Line
              points={[
                new Vector3(-1, -0.6, 0.01),
                new Vector3(1, -0.6, 0.01),
                new Vector3(1, 0.6, 0.01),
                new Vector3(-1, 0.6, 0.01),
                new Vector3(-1, -0.6, 0.01),
              ]}
              color={ui.color}
              lineWidth={2}
            />

            {/* 主标题 */}
            <Text
              position={[0, 0.2, 0.02]}
              fontSize={0.15}
              color={ui.color}
              anchorX="center"
              anchorY="middle"
              font="/fonts/orbitron-regular.woff"
            >
              {ui.text}
            </Text>

            {/* 副标题 */}
            <Text
              position={[0, -0.1, 0.02]}
              fontSize={0.1}
              color={ui.color}
              anchorX="center"
              anchorY="middle"
              font="/fonts/orbitron-regular.woff"
            >
              {ui.subtext}
            </Text>

            {/* 状态指示器 */}
            <mesh position={[0.7, 0.4, 0.02]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color={ui.color} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

// 能量流动系统
function EnergyFlow() {
  const flowRef = useRef<Group>(null);

  const energyStreams = useMemo(() => {
    const streams = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 5;
      streams.push({
        start: [0, 0, 0] as [number, number, number],
        end: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 2,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        color: i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff88",
        speed: 1 + Math.random() * 2,
      });
    }
    return streams;
  }, []);

  return (
    <group ref={flowRef}>
      {energyStreams.map((stream, index) => (
        <Trail
          key={index}
          width={0.5}
          length={8}
          color={stream.color}
          attenuation={(t) => t * t}
        >
          <Float
            speed={stream.speed}
            rotationIntensity={1}
            floatIntensity={0.5}
          >
            <mesh>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial
                color={stream.color}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Float>
        </Trail>
      ))}
    </group>
  );
}

// 防护环系统
function ProtectionRings() {
  const ringsRef = useRef<Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        radius: 6 + i * 0.8,
        color: i % 2 === 0 ? "#00f5ff" : "#ff6b00",
        speed: 0.5 + i * 0.1,
        axis: i % 3,
      })),
    [],
  );

  useFrame((state) => {
    if (ringsRef.current) {
      const time = state.clock.getElapsedTime();
      ringsRef.current.children.forEach((ring, index) => {
        if (ring instanceof Mesh) {
          const ringData = rings[index];
          if (ringData.axis === 0) {
            ring.rotation.x = time * ringData.speed;
          } else if (ringData.axis === 1) {
            ring.rotation.y = time * ringData.speed;
          } else {
            ring.rotation.z = time * ringData.speed;
          }
        }
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {rings.map((ring, index) => (
        <mesh key={index}>
          <torusGeometry args={[ring.radius, 0.05, 8, 64]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// 优化的粒子系统
function OptimizedParticleSystem() {
  const particlesRef = useRef<Points>(null);

  const particleSystem = useMemo(() => {
    const count = 800; // 减少粒子数量以提高性能
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

      // 球形分布
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // 随机颜色
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
      particlesRef.current.rotation.y = time * 0.02;
      particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleSystem}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 主要的超级优化模型组件
export function UltraCyberSecurityModel() {
  const mainGroupRef = useRef<Group>(null);

  useFrame((state) => {
    if (mainGroupRef.current) {
      // 非常缓慢的整体旋转
      mainGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 优化的光照系统 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color="#ff6b00" />
      <spotLight
        position={[0, 10, 0]}
        angle={Math.PI / 6}
        penumbra={1}
        intensity={1}
        color="#00ff88"
      />

      {/* 量子核心 */}
      <QuantumCore />

      {/* 防护矩阵 */}
      <DefenseMatrix />

      {/* 全息界面 */}
      <HolographicInterface />

      {/* 能���流动 */}
      <EnergyFlow />

      {/* 防护环 */}
      <ProtectionRings />

      {/* 优化粒子系统 */}
      <OptimizedParticleSystem />

      {/* 扫描线效果 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[10, 10.1, 128]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
