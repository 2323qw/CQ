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

// 量子核心组件
function QuantumCore() {
  const coreRef = useRef<Group>(null);
  const innerCoreRef = useRef<Mesh>(null);
  const pulseRingRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const time = state.clock.getElapsedTime();
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

      if (innerCoreRef.current) {
        const pulse = 1 + Math.sin(time * 4) * 0.15;
        innerCoreRef.current.scale.setScalar(pulse);
      }

      if (pulseRingRef.current) {
        const ringPulse = 1 + Math.sin(time * 3) * 0.2;
        pulseRingRef.current.scale.setScalar(ringPulse);
        pulseRingRef.current.material.opacity = 0.8 - (ringPulse - 1) * 2;
      }
    }
  });

  return (
    <group ref={coreRef}>
      {/* 主量子核心 */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00f5ff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.9}
        />
      </mesh>

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

      {/* 核心光环 */}
      <mesh>
        <ringGeometry args={[0.9, 1.1, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 防护矩阵系统
function DefenseMatrix() {
  const matrixRef = useRef<Group>(null);

  const nodePositions = useMemo(() => {
    const positions = [];
    const layers = 3;
    const nodesPerLayer = 6;

    for (let layer = 0; layer < layers; layer++) {
      const radius = 3 + layer * 1.2;
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
        <group key={index}>
          {/* 节点球体 */}
          <mesh position={node.position}>
            <sphereGeometry args={[node.size, 8, 8]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* 节点光环 */}
          <mesh position={node.position}>
            <ringGeometry args={[node.size * 1.5, node.size * 2, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.4}
              side={DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* 第一层连接线 */}
      {nodePositions.slice(0, 6).map((node, index) => {
        const nextIndex = (index + 1) % 6;
        const nextNode = nodePositions[nextIndex];
        return (
          <Line
            key={`layer1-${index}`}
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

      {/* 核心连接线 */}
      {nodePositions.slice(0, 6).map((node, index) => (
        <Line
          key={`core-${index}`}
          points={[new Vector3(0, 0, 0), new Vector3(...node.position)]}
          color={node.color}
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
}

// 全息界面
function HolographicInterface() {
  const interfaceRef = useRef<Group>(null);

  const interfaces = useMemo(
    () => [
      {
        position: [3.5, 2, 0] as [number, number, number],
        rotation: [0, -Math.PI / 4, 0] as [number, number, number],
        text: "FIREWALL",
        subtext: "ACTIVE",
        color: "#00ff88",
      },
      {
        position: [-3.5, 1.5, 1] as [number, number, number],
        rotation: [0, Math.PI / 4, 0] as [number, number, number],
        text: "THREATS",
        subtext: "0",
        color: "#00f5ff",
      },
      {
        position: [0, 3.5, 2.5] as [number, number, number],
        rotation: [-Math.PI / 6, 0, 0] as [number, number, number],
        text: "SHIELD",
        subtext: "100%",
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
        <group key={index} position={ui.position} rotation={ui.rotation}>
          {/* 全息屏幕背景 */}
          <mesh>
            <planeGeometry args={[1.5, 0.8]} />
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
              new Vector3(-0.75, -0.4, 0.01),
              new Vector3(0.75, -0.4, 0.01),
              new Vector3(0.75, 0.4, 0.01),
              new Vector3(-0.75, 0.4, 0.01),
              new Vector3(-0.75, -0.4, 0.01),
            ]}
            color={ui.color}
            lineWidth={2}
          />

          {/* 主标题 */}
          <Text
            position={[0, 0.15, 0.02]}
            fontSize={0.12}
            color={ui.color}
            anchorX="center"
            anchorY="middle"
          >
            {ui.text}
          </Text>

          {/* 副标题 */}
          <Text
            position={[0, -0.05, 0.02]}
            fontSize={0.08}
            color={ui.color}
            anchorX="center"
            anchorY="middle"
          >
            {ui.subtext}
          </Text>

          {/* 状态指示器 */}
          <mesh position={[0.6, 0.3, 0.02]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={ui.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 能量流动系统
function EnergyFlow() {
  const energyPackets = useRef<Mesh[]>([]);

  const energyStreams = useMemo(() => {
    const streams = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 4.5;
      streams.push({
        start: [0, 0, 0] as [number, number, number],
        end: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 1.5,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        color: i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff88",
        speed: 1 + Math.random(),
      });
    }
    return streams;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    energyPackets.current.forEach((packet, index) => {
      if (packet) {
        const stream = energyStreams[index];
        const progress = (Math.sin(time * stream.speed) + 1) / 2;

        packet.position.lerpVectors(
          new Vector3(...stream.start),
          new Vector3(...stream.end),
          progress,
        );

        packet.rotation.y += 0.05;
        packet.rotation.x += 0.03;
      }
    });
  });

  return (
    <group>
      {energyStreams.map((stream, index) => (
        <group key={index}>
          {/* 能量流路径 */}
          <Line
            points={[new Vector3(...stream.start), new Vector3(...stream.end)]}
            color={stream.color}
            lineWidth={2}
            transparent
            opacity={0.4}
            dashed
            dashSize={0.1}
            gapSize={0.1}
          />

          {/* 移动的能量包 */}
          <mesh
            ref={(el) => {
              if (el) energyPackets.current[index] = el;
            }}
          >
            <octahedronGeometry args={[0.06, 1]} />
            <meshBasicMaterial color={stream.color} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 防护环系统
function ProtectionRings() {
  const ringsRef = useRef<Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        radius: 5.5 + i * 0.8,
        color: i % 2 === 0 ? "#00f5ff" : "#ff6b00",
        speed: 0.3 + i * 0.1,
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
          <torusGeometry args={[ring.radius, 0.04, 8, 64]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// 粒子系统
function ParticleSystem() {
  const particlesRef = useRef<Points>(null);

  const particleSystem = useMemo(() => {
    const count = 400;
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

      const radius = 7 + Math.random() * 3;
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
      particlesRef.current.rotation.y = time * 0.01;
      particlesRef.current.rotation.x = Math.sin(time * 0.02) * 0.02;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleSystem}>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
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
      mainGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 光照系统 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00f5ff" />
      <pointLight position={[-5, -5, -5]} intensity={1.2} color="#ff6b00" />
      <spotLight
        position={[0, 8, 0]}
        angle={Math.PI / 6}
        penumbra={1}
        intensity={0.8}
        color="#00ff88"
      />

      {/* 量子核心 */}
      <QuantumCore />

      {/* 防护矩阵 */}
      <DefenseMatrix />

      {/* 全息界面 */}
      <HolographicInterface />

      {/* 能量流动 */}
      <EnergyFlow />

      {/* 防护环 */}
      <ProtectionRings />

      {/* 粒子系统 */}
      <ParticleSystem />

      {/* 外层扫描环 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9, 9.05, 128]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </mesh>

      {/* 垂直扫描环 */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[8.5, 8.55, 128]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
