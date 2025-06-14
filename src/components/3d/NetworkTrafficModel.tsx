import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, Vector3, BufferGeometry, LineBasicMaterial } from "three";
import { Line } from "@react-three/drei";

// 网络流量粒子
function TrafficParticle({
  path,
  speed = 1,
  color = "#00f5ff",
}: {
  path: Vector3[];
  speed?: number;
  color?: string;
}) {
  const particleRef = useRef<Mesh>(null);
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (particleRef.current && path.length > 1) {
      progressRef.current += delta * speed;

      if (progressRef.current >= 1) {
        progressRef.current = 0;
      }

      const totalSegments = path.length - 1;
      const currentSegment = Math.floor(progressRef.current * totalSegments);
      const segmentProgress = (progressRef.current * totalSegments) % 1;

      if (currentSegment < totalSegments) {
        const start = path[currentSegment];
        const end = path[currentSegment + 1];

        particleRef.current.position.lerpVectors(start, end, segmentProgress);
      }
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
      />
    </mesh>
  );
}

// 服务器节点
function ServerNode({
  position,
  type = "normal",
}: {
  position: [number, number, number];
  type?: "normal" | "firewall" | "database" | "router";
}) {
  const nodeRef = useRef<Group>(null);

  const colors = {
    normal: "#00f5ff",
    firewall: "#ff6600",
    database: "#39ff14",
    router: "#bf00ff",
  };

  useFrame((state) => {
    if (nodeRef.current) {
      const time = state.clock.getElapsedTime();
      nodeRef.current.rotation.y = time * 0.5;
      nodeRef.current.position.y =
        position[1] + Math.sin(time + position[0]) * 0.1;
    }
  });

  return (
    <group ref={nodeRef} position={position}>
      {/* 主体 */}
      <mesh>
        <boxGeometry
          args={type === "database" ? [0.5, 0.8, 0.5] : [0.6, 0.4, 0.6]}
        />
        <meshStandardMaterial
          color={colors[type]}
          emissive={colors[type]}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 状态指示灯 */}
      <mesh position={[0, type === "database" ? 0.5 : 0.3, 0.31]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={colors[type]}
          emissive={colors[type]}
          emissiveIntensity={1}
        />
      </mesh>

      {/* 防火墙特效 */}
      {type === "firewall" && (
        <mesh>
          <torusGeometry args={[0.8, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#ff6600"
            emissive="#ff6600"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* 数据库磁盘层 */}
      {type === "database" &&
        [...Array(3)].map((_, i) => (
          <mesh key={i} position={[0, -0.2 + i * 0.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}

      {/* 路由器天线 */}
      {type === "router" &&
        [...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.4, 0.3, Math.sin(angle) * 0.4]}
            >
              <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
              <meshStandardMaterial
                color="#bf00ff"
                emissive="#bf00ff"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
    </group>
  );
}

// 网络拓扑可视化
export function NetworkTrafficModel() {
  const groupRef = useRef<Group>(null);

  // 定义网络拓扑
  const nodes = useMemo(
    () => [
      {
        position: [0, 0, 0] as [number, number, number],
        type: "firewall" as const,
      },
      {
        position: [-3, 0, -2] as [number, number, number],
        type: "database" as const,
      },
      {
        position: [3, 0, -2] as [number, number, number],
        type: "normal" as const,
      },
      {
        position: [-2, 0, 2] as [number, number, number],
        type: "router" as const,
      },
      {
        position: [2, 0, 2] as [number, number, number],
        type: "normal" as const,
      },
      {
        position: [0, 0, 4] as [number, number, number],
        type: "router" as const,
      },
    ],
    [],
  );

  // 定义网络路径
  const networkPaths = useMemo(
    () => [
      // 主要数据流
      [new Vector3(0, 0, 4), new Vector3(0, 0, 0), new Vector3(-3, 0, -2)],
      [new Vector3(0, 0, 4), new Vector3(2, 0, 2), new Vector3(3, 0, -2)],
      [new Vector3(-2, 0, 2), new Vector3(0, 0, 0), new Vector3(3, 0, -2)],
      // 内部通信
      [new Vector3(-3, 0, -2), new Vector3(0, 0, 0), new Vector3(3, 0, -2)],
    ],
    [],
  );

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 服务器节点 */}
      {nodes.map((node, index) => (
        <ServerNode key={index} {...node} />
      ))}

      {/* 网络连接线 */}
      {networkPaths.map((path, pathIndex) => (
        <group key={pathIndex}>
          <Line
            points={path}
            color="#39ff14"
            lineWidth={2}
            transparent
            opacity={0.4}
          />

          {/* 流量粒子 */}
          <TrafficParticle
            path={path}
            speed={0.5 + Math.random() * 0.5}
            color={Math.random() > 0.5 ? "#00f5ff" : "#39ff14"}
          />

          {/* 反向流量 */}
          <TrafficParticle
            path={[...path].reverse()}
            speed={0.3 + Math.random() * 0.4}
            color="#ffff00"
          />
        </group>
      ))}

      {/* 威胁检测扫描 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 5.2, 64]} />
        <meshStandardMaterial
          color="#ff0040"
          emissive="#ff0040"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 数据包流量指示器 */}
      {[...Array(20)].map((_, index) => {
        const angle = (index / 20) * Math.PI * 2;
        const radius = 6 + Math.sin(Date.now() * 0.001 + index) * 0.5;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(Date.now() * 0.002 + index) * 0.5,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* 网络安全屏障 */}
      <mesh>
        <torusGeometry args={[8, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
