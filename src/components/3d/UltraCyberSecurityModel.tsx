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
  MathUtils,
  DoubleSide,
} from "three";
import { Text, Line } from "@react-three/drei";

// 量子核心组件 - 丰富版
function QuantumCore() {
  const coreRef = useRef<Group>(null);
  const innerCoreRef = useRef<Mesh>(null);
  const middleCoreRef = useRef<Mesh>(null);
  const outerCoreRef = useRef<Mesh>(null);
  const pulseRing1Ref = useRef<Mesh>(null);
  const pulseRing2Ref = useRef<Mesh>(null);
  const pulseRing3Ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const time = state.clock.getElapsedTime();
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

      if (innerCoreRef.current) {
        const pulse = 1 + Math.sin(time * 4) * 0.2;
        innerCoreRef.current.scale.setScalar(pulse);
        innerCoreRef.current.rotation.x = time * 0.8;
        innerCoreRef.current.rotation.z = time * 0.6;
      }

      if (middleCoreRef.current) {
        const pulse = 1 + Math.sin(time * 3 + 1) * 0.15;
        middleCoreRef.current.scale.setScalar(pulse);
        middleCoreRef.current.rotation.y = -time * 0.5;
        middleCoreRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;
      }

      if (outerCoreRef.current) {
        outerCoreRef.current.rotation.z = time * 0.2;
        outerCoreRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
      }

      if (pulseRing1Ref.current) {
        const ringPulse1 = 1 + Math.sin(time * 3) * 0.3;
        pulseRing1Ref.current.scale.setScalar(ringPulse1);
        pulseRing1Ref.current.material.opacity = 0.8 - (ringPulse1 - 1) * 1.5;
      }

      if (pulseRing2Ref.current) {
        const ringPulse2 = 1 + Math.sin(time * 2.5 + 1) * 0.25;
        pulseRing2Ref.current.scale.setScalar(ringPulse2);
        pulseRing2Ref.current.material.opacity = 0.6 - (ringPulse2 - 1) * 1.2;
      }

      if (pulseRing3Ref.current) {
        const ringPulse3 = 1 + Math.sin(time * 2 + 2) * 0.2;
        pulseRing3Ref.current.scale.setScalar(ringPulse3);
        pulseRing3Ref.current.material.opacity = 0.4 - (ringPulse3 - 1);
      }
    }
  });

  return (
    <group ref={coreRef}>
      {/* 内层量子核心 */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00f5ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 中层核心 */}
      <mesh ref={middleCoreRef}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#ff6b00"
          emissive="#ff6b00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>

      {/* 外层核心 */}
      <mesh ref={outerCoreRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* 第一层脉冲环 */}
      <mesh ref={pulseRing1Ref}>
        <ringGeometry args={[1.0, 1.3, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.8}
          side={DoubleSide}
        />
      </mesh>

      {/* 第二层脉冲环 */}
      <mesh ref={pulseRing2Ref}>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={0.6}
          side={DoubleSide}
        />
      </mesh>

      {/* 第三层脉冲环 */}
      <mesh ref={pulseRing3Ref}>
        <ringGeometry args={[2.0, 2.3, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.4}
          side={DoubleSide}
        />
      </mesh>

      {/* 核心光环系统 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[(Math.PI / 3) * i, (Math.PI / 6) * i, (Math.PI / 4) * i]}
        >
          <torusGeometry args={[1.5, 0.03, 8, 32]} />
          <meshStandardMaterial
            color={
              i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff88"
            }
            emissive={
              i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff88"
            }
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// 高级防护矩阵系统
function AdvancedDefenseMatrix() {
  const matrixRef = useRef<Group>(null);

  const nodeNetworks = useMemo(() => {
    const networks = [];
    const layers = 4;
    const nodesPerLayer = [6, 8, 10, 12];

    for (let layer = 0; layer < layers; layer++) {
      const radius = 2.8 + layer * 1.4;
      const nodeCount = nodesPerLayer[layer];
      const layerNodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const yOffset = (layer - 1.5) * 0.9;
        const yVariation = Math.sin(angle * 3) * 0.3;

        layerNodes.push({
          position: [
            Math.cos(angle) * radius,
            yOffset + yVariation,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          color:
            layer === 0
              ? "#ff6b00"
              : layer === 1
                ? "#00f5ff"
                : layer === 2
                  ? "#00ff88"
                  : "#ff00ff",
          size: 0.14 - layer * 0.015,
          type:
            layer === 0
              ? "core"
              : layer === 1
                ? "shield"
                : layer === 2
                  ? "sensor"
                  : "defense",
        });
      }
      networks.push(layerNodes);
    }
    return networks;
  }, []);

  useFrame((state) => {
    if (matrixRef.current) {
      const time = state.clock.getElapsedTime();
      matrixRef.current.rotation.y = time * 0.08;
      matrixRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      matrixRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={matrixRef}>
      {nodeNetworks.map((layer, layerIndex) =>
        layer.map((node, nodeIndex) => (
          <group key={`${layerIndex}-${nodeIndex}`}>
            {/* 主节点 */}
            <mesh position={node.position}>
              <sphereGeometry args={[node.size, 12, 12]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* 节点光环 */}
            <mesh position={node.position}>
              <ringGeometry args={[node.size * 1.8, node.size * 2.2, 16]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.5}
                side={DoubleSide}
              />
            </mesh>

            {/* 节点数据流 */}
            <mesh position={node.position}>
              <ringGeometry args={[node.size * 2.5, node.size * 2.8, 8]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.3}
                side={DoubleSide}
              />
            </mesh>
          </group>
        )),
      )}

      {/* 层间连接线 */}
      {nodeNetworks.map((layer, layerIndex) => (
        <group key={`layer-connections-${layerIndex}`}>
          {layer.map((node, nodeIndex) => {
            const nextNodeIndex = (nodeIndex + 1) % layer.length;
            const nextNode = layer[nextNodeIndex];
            return (
              <group key={`layer-${layerIndex}-${nodeIndex}`}>
                {/* <Line
                  points={[
                    new Vector3(...node.position),
                    new Vector3(...nextNode.position),
                  ]}
                  color={node.color}
                  lineWidth={2}
                  transparent
                  opacity={0.4}
                /> */}
              </group>
            );
          })}
        </group>
      ))}

      {/* 核心连接线 */}
      {nodeNetworks[0]?.map((node, index) => (
        <group key={`core-${index}`}>
          {/* <Line
            points={[new Vector3(0, 0, 0), new Vector3(...node.position)]}
            color={node.color}
            lineWidth={1.5}
            transparent
            opacity={0.3}
          /> */}
        </group>
      ))}

      {/* 跨层连接 */}
      {nodeNetworks.slice(0, -1).map((layer, layerIndex) => (
        <group key={`cross-layer-${layerIndex}`}>
          {layer
            .slice(
              0,
              Math.min(layer.length, nodeNetworks[layerIndex + 1]?.length || 0),
            )
            .map((node, nodeIndex) => {
              const nextLayerNode = nodeNetworks[layerIndex + 1]?.[nodeIndex];
              if (!nextLayerNode) return null;
              return (
                <Line
                  key={`cross-${layerIndex}-${nodeIndex}`}
                  points={[
                    new Vector3(...node.position),
                    new Vector3(...nextLayerNode.position),
                  ]}
                  color="#ffffff"
                  lineWidth={1}
                  transparent
                  opacity={0.2}
                />
              );
            })}
        </group>
      ))}
    </group>
  );
}

// 高级全息界面系统
function AdvancedHolographicInterface() {
  const interfaceRef = useRef<Group>(null);

  const holographicPanels = useMemo(
    () => [
      {
        position: [4.5, 2.5, 0] as [number, number, number],
        rotation: [0, -Math.PI / 3, 0] as [number, number, number],
        title: "QUANTUM FIREWALL",
        data: ["STATUS: ACTIVE", "THREATS BLOCKED: 1,247", "EFFICIENCY: 99.8%"],
        color: "#00ff88",
        type: "security",
      },
      {
        position: [-4.5, 2, 1.5] as [number, number, number],
        rotation: [0, Math.PI / 3, 0] as [number, number, number],
        title: "THREAT ANALYSIS",
        data: ["ACTIVE THREATS: 0", "SCANNED: 2.3M", "LAST UPDATE: 0.1s"],
        color: "#00f5ff",
        type: "analysis",
      },
      {
        position: [0, 4.5, 3] as [number, number, number],
        rotation: [-Math.PI / 6, 0, 0] as [number, number, number],
        title: "NEURAL SHIELD",
        data: ["INTEGRITY: 100%", "ADAPTABILITY: HIGH", "LEARNING: ACTIVE"],
        color: "#ff6b00",
        type: "ai",
      },
      {
        position: [3, -2, -2] as [number, number, number],
        rotation: [Math.PI / 8, -Math.PI / 6, 0] as [number, number, number],
        title: "NETWORK STATUS",
        data: ["NODES: 47 ONLINE", "LATENCY: <1ms", "BANDWIDTH: 95%"],
        color: "#ff00ff",
        type: "network",
      },
      {
        position: [-3, -1.5, -2.5] as [number, number, number],
        rotation: [Math.PI / 12, Math.PI / 4, 0] as [number, number, number],
        title: "DATA MATRIX",
        data: [
          "PROCESSING: 847 GB/s",
          "ENCRYPTION: AES-512",
          "COMPRESSION: 89%",
        ],
        color: "#ffff00",
        type: "data",
      },
    ],
    [],
  );

  useFrame((state) => {
    if (interfaceRef.current) {
      const time = state.clock.getElapsedTime();
      interfaceRef.current.children.forEach((child, index) => {
        if (child instanceof Group) {
          child.position.y += Math.sin(time * 1.5 + index * 0.5) * 0.002;
          child.rotation.y += Math.sin(time * 0.3 + index) * 0.001;
        }
      });
    }
  });

  return (
    <group ref={interfaceRef}>
      {holographicPanels.map((panel, index) => (
        <group key={index} position={panel.position} rotation={panel.rotation}>
          {/* 全息屏幕背景 */}
          <mesh>
            <planeGeometry args={[2.2, 1.6]} />
            <meshBasicMaterial
              color={panel.color}
              transparent
              opacity={0.12}
              side={DoubleSide}
            />
          </mesh>

          {/* 高级边框系统 */}
          <Line
            points={[
              new Vector3(-1.1, -0.8, 0.01),
              new Vector3(1.1, -0.8, 0.01),
              new Vector3(1.1, 0.8, 0.01),
              new Vector3(-1.1, 0.8, 0.01),
              new Vector3(-1.1, -0.8, 0.01),
            ]}
            color={panel.color}
            lineWidth={3}
          />

          {/* 内边框 */}
          <Line
            points={[
              new Vector3(-1.0, -0.7, 0.02),
              new Vector3(1.0, -0.7, 0.02),
              new Vector3(1.0, 0.7, 0.02),
              new Vector3(-1.0, 0.7, 0.02),
              new Vector3(-1.0, -0.7, 0.02),
            ]}
            color={panel.color}
            lineWidth={1}
            transparent
            opacity={0.6}
          />

          {/* 标题 */}
          <Text
            position={[0, 0.5, 0.03]}
            fontSize={0.14}
            color={panel.color}
            anchorX="center"
            anchorY="middle"
          >
            {panel.title}
          </Text>

          {/* 数据行 */}
          {panel.data.map((line, lineIndex) => (
            <Text
              key={lineIndex}
              position={[0, 0.2 - lineIndex * 0.2, 0.03]}
              fontSize={0.08}
              color={panel.color}
              anchorX="center"
              anchorY="middle"
            >
              {line}
            </Text>
          ))}

          {/* 状态指示器 */}
          <mesh position={[0.9, 0.6, 0.03]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={panel.color} />
          </mesh>

          {/* 类型图标 */}
          <mesh position={[-0.9, 0.6, 0.03]}>
            <octahedronGeometry args={[0.03, 0]} />
            <meshBasicMaterial color={panel.color} />
          </mesh>

          {/* 扫描线 */}
          <mesh position={[0, Math.sin(index * 2) * 0.6, 0.04]}>
            <planeGeometry args={[2.0, 0.02]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 复杂能量流动系统
function ComplexEnergyFlow() {
  const energyPackets = useRef<Mesh[]>([]);
  const trailPackets = useRef<Mesh[]>([]);

  const energyStreams = useMemo(() => {
    const streams = [];
    const streamCount = 12;

    for (let i = 0; i < streamCount; i++) {
      const angle = (i / streamCount) * Math.PI * 2;
      const radius = 5.5 + Math.sin(i) * 1.5;
      const height = Math.cos(i * 0.7) * 2.5;

      streams.push({
        start: [0, 0, 0] as [number, number, number],
        mid: [
          Math.cos(angle) * radius * 0.6,
          height * 0.5,
          Math.sin(angle) * radius * 0.6,
        ] as [number, number, number],
        end: [Math.cos(angle) * radius, height, Math.sin(angle) * radius] as [
          number,
          number,
          number,
        ],
        color:
          i % 4 === 0
            ? "#00f5ff"
            : i % 4 === 1
              ? "#ff6b00"
              : i % 4 === 2
                ? "#00ff88"
                : "#ff00ff",
        speed: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return streams;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    energyPackets.current.forEach((packet, index) => {
      if (packet) {
        const stream = energyStreams[index];
        const progress = (Math.sin(time * stream.speed + stream.phase) + 1) / 2;

        // 三点贝塞尔曲线
        const t = progress;
        const t1 = 1 - t;
        const startVec = new Vector3(...stream.start);
        const midVec = new Vector3(...stream.mid);
        const endVec = new Vector3(...stream.end);

        const currentPos = startVec
          .clone()
          .multiplyScalar(t1 * t1)
          .add(midVec.clone().multiplyScalar(2 * t1 * t))
          .add(endVec.clone().multiplyScalar(t * t));

        packet.position.copy(currentPos);
        packet.rotation.y += 0.08;
        packet.rotation.x += 0.05;
        packet.rotation.z += 0.03;

        // 尾迹粒子
        const trailPacket = trailPackets.current[index];
        if (trailPacket) {
          const trailProgress = Math.max(0, progress - 0.1);
          const trailPos = startVec
            .clone()
            .multiplyScalar((1 - trailProgress) * (1 - trailProgress))
            .add(
              midVec
                .clone()
                .multiplyScalar(2 * (1 - trailProgress) * trailProgress),
            )
            .add(endVec.clone().multiplyScalar(trailProgress * trailProgress));
          trailPacket.position.copy(trailPos);
        }
      }
    });
  });

  return (
    <group>
      {energyStreams.map((stream, index) => (
        <group key={index}>
          {/* 主能量路径 */}
          <Line
            points={[
              new Vector3(...stream.start),
              new Vector3(...stream.mid),
              new Vector3(...stream.end),
            ]}
            color={stream.color}
            lineWidth={2}
            transparent
            opacity={0.5}
            dashed
            dashSize={0.15}
            gapSize={0.1}
          />

          {/* 辅助路径 */}
          <Line
            points={[new Vector3(...stream.start), new Vector3(...stream.end)]}
            color={stream.color}
            lineWidth={1}
            transparent
            opacity={0.2}
          />

          {/* 主能量包 */}
          <mesh
            ref={(el) => {
              if (el) energyPackets.current[index] = el;
            }}
          >
            <octahedronGeometry args={[0.08, 1]} />
            <meshStandardMaterial
              color={stream.color}
              emissive={stream.color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 尾迹能量包 */}
          <mesh
            ref={(el) => {
              if (el) trailPackets.current[index] = el;
            }}
          >
            <tetrahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color={stream.color} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 多层防护环系统
function MultiLayerProtectionRings() {
  const ringsRef = useRef<Group>(null);

  const ringLayers = useMemo(
    () => [
      // 内层快速环
      ...Array.from({ length: 3 }, (_, i) => ({
        radius: 5.2 + i * 0.4,
        color: "#00f5ff",
        speed: 0.8 - i * 0.1,
        axis: "y" as const,
        thickness: 0.06,
        opacity: 0.8 - i * 0.1,
      })),
      // 中层中速环
      ...Array.from({ length: 4 }, (_, i) => ({
        radius: 6.8 + i * 0.6,
        color: "#ff6b00",
        speed: 0.5 - i * 0.05,
        axis: "x" as const,
        thickness: 0.05,
        opacity: 0.7 - i * 0.1,
      })),
      // 外层慢速环
      ...Array.from({ length: 3 }, (_, i) => ({
        radius: 9.5 + i * 0.7,
        color: "#00ff88",
        speed: 0.3 - i * 0.05,
        axis: "z" as const,
        thickness: 0.04,
        opacity: 0.6 - i * 0.1,
      })),
    ],
    [],
  );

  useFrame((state) => {
    if (ringsRef.current) {
      const time = state.clock.getElapsedTime();
      ringsRef.current.children.forEach((ring, index) => {
        if (ring instanceof Mesh) {
          const ringData = ringLayers[index];
          if (ringData.axis === "x") {
            ring.rotation.x = time * ringData.speed;
          } else if (ringData.axis === "y") {
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
      {ringLayers.map((ring, index) => (
        <mesh key={index}>
          <torusGeometry args={[ring.radius, ring.thickness, 8, 64]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.6}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

// 高密度粒子系统
function HighDensityParticleSystem() {
  const particlesRef = useRef<Points>(null);
  const innerParticlesRef = useRef<Points>(null);

  const outerParticleSystem = useMemo(() => {
    const count = 1200;
    const positions = new Float32BufferAttribute(
      new Float32Array(count * 3),
      3,
    );
    const colors = new Float32BufferAttribute(new Float32Array(count * 3), 3);

    const colorPalette = [
      new Color("#00f5ff"),
      new Color("#ff6b00"),
      new Color("#00ff88"),
      new Color("#ff00ff"),
      new Color("#ffff00"),
      new Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 多层球形分布
      const layer = Math.floor(i / (count / 3));
      const radius = 10 + layer * 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions.array[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions.array[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions.array[i3 + 2] = radius * Math.cos(phi);

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors.array[i3] = color.r;
      colors.array[i3 + 1] = color.g;
      colors.array[i3 + 2] = color.b;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", positions);
    geometry.setAttribute("color", colors);
    return geometry;
  }, []);

  const innerParticleSystem = useMemo(() => {
    const count = 600;
    const positions = new Float32BufferAttribute(
      new Float32Array(count * 3),
      3,
    );
    const colors = new Float32BufferAttribute(new Float32Array(count * 3), 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions.array[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions.array[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions.array[i3 + 2] = radius * Math.cos(phi);

      const intensity = Math.random();
      colors.array[i3] = intensity;
      colors.array[i3 + 1] = intensity * 0.8;
      colors.array[i3 + 2] = 1;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", positions);
    geometry.setAttribute("color", colors);
    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.01;
      particlesRef.current.rotation.x = Math.sin(time * 0.02) * 0.02;
    }

    if (innerParticlesRef.current) {
      innerParticlesRef.current.rotation.y = -time * 0.03;
      innerParticlesRef.current.rotation.z = Math.cos(time * 0.025) * 0.03;
    }
  });

  return (
    <group>
      {/* 外层粒子系统 */}
      <points ref={particlesRef} geometry={outerParticleSystem}>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          blending={AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* 内层粒子系统 */}
      <points ref={innerParticlesRef} geometry={innerParticleSystem}>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          blending={AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

// 主要的超级丰富模型组件
export function UltraCyberSecurityModel() {
  const mainGroupRef = useRef<Group>(null);

  useFrame((state) => {
    if (mainGroupRef.current) {
      // 非常缓慢的整体旋转
      mainGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      mainGroupRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 高级光照系统 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffffff" />
      <pointLight position={[8, 8, 8]} intensity={2} color="#00f5ff" />
      <pointLight position={[-8, -8, -8]} intensity={2} color="#ff6b00" />
      <pointLight position={[0, 12, 0]} intensity={1.5} color="#00ff88" />
      <pointLight position={[6, -6, 6]} intensity={1.5} color="#ff00ff" />
      <spotLight
        position={[0, 15, 0]}
        angle={Math.PI / 4}
        penumbra={1}
        intensity={2}
        color="#ffffff"
        castShadow
      />

      {/* 量子核心 */}
      <QuantumCore />

      {/* 高级防护矩阵 */}
      <AdvancedDefenseMatrix />

      {/* 高级全息界面 */}
      <AdvancedHolographicInterface />

      {/* 复杂能量流动 */}
      <ComplexEnergyFlow />

      {/* 多层防护环 */}
      <MultiLayerProtectionRings />

      {/* 高密度粒子系统 */}
      <HighDensityParticleSystem />

      {/* 外层扫描环系统 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[12, 12.08, 128]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 3]}>
        <ringGeometry args={[11.2, 11.28, 128]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <ringGeometry args={[10.4, 10.48, 128]} />
        <meshBasicMaterial color="#ff6b00" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
